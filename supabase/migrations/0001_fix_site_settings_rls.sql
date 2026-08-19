-- ============================================================================
-- Migration 0001 — Fix "new row violates row-level security policy for
--                   table site_settings"
-- ----------------------------------------------------------------------------
-- ROOT CAUSE
--   The database function public.is_admin() authorized writes only when
--   profiles.role = 'admin'. But administrators were being bootstrapped through
--   the application's ADMIN_EMAILS environment variable, which the database
--   cannot see. Such a user passes the app's route guard yet still has
--   profiles.role = 'viewer', so the site_settings INSERT/UPDATE WITH CHECK
--   (public.is_admin()) evaluated to false and RLS rejected the write.
--
-- FIX (RLS stays ON everywhere)
--   1. Introduce a database-side admin allow-list table (admin_emails) so the
--      email allow-list is enforceable by RLS, in sync with the app.
--   2. Make is_admin() true when EITHER profiles.role = 'admin' OR the user's
--      email is in admin_emails.
--   3. Auto-promote new signups to 'admin' when their email is allow-listed.
--   4. Replace the single FOR ALL policy on site_settings with explicit,
--      minimal SELECT / INSERT / UPDATE / DELETE policies.
--   5. Seed the allow-list and promote the existing admin account.
--
-- Safe to run multiple times (idempotent).
-- ============================================================================

-- 1. ---- Database-side admin allow-list --------------------------------------
create table if not exists public.admin_emails (
  email      text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_emails enable row level security;

-- Only existing admins may view or change the allow-list. (Seeding below is
-- done from the SQL editor, which runs as a superuser and bypasses RLS.)
drop policy if exists "admin_emails_admin_all" on public.admin_emails;
create policy "admin_emails_admin_all" on public.admin_emails
  for all using (public.is_admin()) with check (public.is_admin());

-- 2. ---- Robust is_admin(): role OR allow-listed email -----------------------
-- SECURITY DEFINER + stable; reads profiles.email (populated on signup) so we
-- never touch the auth schema from a policy. No recursion: the function owner
-- bypasses RLS for the internal reads.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
    or exists (
      select 1
      from public.profiles p
      join public.admin_emails a on lower(a.email) = lower(p.email)
      where p.id = auth.uid()
    );
$$;

-- 3. ---- Auto-promote allow-listed signups to admin --------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role user_role := 'viewer';
begin
  if exists (
    select 1 from public.admin_emails a where lower(a.email) = lower(new.email)
  ) then
    assigned_role := 'admin';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    assigned_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 4. ---- Explicit, minimal policies on site_settings -------------------------
-- Drop the old broad policies and any prior names.
drop policy if exists "settings_admin_write" on public.site_settings;
drop policy if exists "settings_public_read" on public.site_settings;
drop policy if exists "site_settings_select" on public.site_settings;
drop policy if exists "site_settings_insert" on public.site_settings;
drop policy if exists "site_settings_update" on public.site_settings;
drop policy if exists "site_settings_delete" on public.site_settings;

-- SELECT: anyone may read public keys; admins may read everything.
create policy "site_settings_select" on public.site_settings
  for select to anon, authenticated
  using (is_public or public.is_admin());

-- INSERT: only admins, and only rows that satisfy is_admin() (WITH CHECK).
create policy "site_settings_insert" on public.site_settings
  for insert to authenticated
  with check (public.is_admin());

-- UPDATE: only admins may target a row and only admin rows may result.
create policy "site_settings_update" on public.site_settings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE: only admins.
create policy "site_settings_delete" on public.site_settings
  for delete to authenticated
  using (public.is_admin());

-- 5. ---- Seed the allow-list and promote the existing admin ------------------
-- >>> Replace the email below with YOUR admin email if different. <<<
insert into public.admin_emails (email)
values ('akagaminodfshanks@gmail.com')
on conflict (email) do nothing;

-- Promote any already-registered profile whose email is now allow-listed.
update public.profiles p
set role = 'admin'
from public.admin_emails a
where lower(p.email) = lower(a.email)
  and p.role <> 'admin';
