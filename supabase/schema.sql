-- ============================================================================
-- Infinity Web & Apps — Database Schema
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor (or via `supabase db push`) to provision
-- the full relational schema, indexes, triggers, and Row Level Security (RLS).
--
-- Design principles:
--   * Public visitors (anon) may INSERT leads and SELECT only "published"
--     public content (services, active pricing, public projects, testimonials,
--     and a whitelist of site settings). They can read/write nothing else.
--   * Authenticated administrators (profiles.role = 'admin') have full access.
--   * Password hashing & sessions are handled by Supabase Auth (auth.users).
--     We never store plaintext passwords.
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type lead_status as enum
    ('new', 'contacted', 'interested', 'follow_up', 'converted', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('admin', 'staff', 'viewer');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  full_name   text,
  avatar_url  text,
  role        user_role not null default 'viewer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Convenience helper: is the current auth user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'viewer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- leads  (contact-form submissions)
-- ----------------------------------------------------------------------------
create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  business_name  text,
  phone          text,
  email          text not null,
  business_type  text,
  service        text,
  budget         text,
  message        text,
  status         lead_status not null default 'new',
  source         text default 'website',
  notes          text,
  follow_up_date date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists trg_leads_updated on public.leads;
create trigger trg_leads_updated before update on public.leads
  for each row execute function public.set_updated_at();

create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_leads_email on public.leads(email);

-- ----------------------------------------------------------------------------
-- clients  (managed accounts / relationships)
-- ----------------------------------------------------------------------------
create table if not exists public.clients (
  id             uuid primary key default gen_random_uuid(),
  business_name  text not null,
  contact_person text,
  phone          text,
  email          text,
  service        text,
  status         lead_status not null default 'new',
  notes          text,
  follow_up_date date,
  lead_id        uuid references public.leads(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists trg_clients_updated on public.clients;
create trigger trg_clients_updated before update on public.clients
  for each row execute function public.set_updated_at();

create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_clients_created_at on public.clients(created_at desc);

-- ----------------------------------------------------------------------------
-- follow_ups  (history log per client / lead)
-- ----------------------------------------------------------------------------
create table if not exists public.follow_ups (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references public.clients(id) on delete cascade,
  lead_id     uuid references public.leads(id) on delete cascade,
  note        text not null,
  due_date    date,
  done        boolean not null default false,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_follow_ups_client on public.follow_ups(client_id);
create index if not exists idx_follow_ups_lead on public.follow_ups(lead_id);

-- ----------------------------------------------------------------------------
-- projects  (portfolio)
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique,
  category     text,
  description  text,
  image_url    text,
  live_url     text,
  tags         text[] default '{}',
  is_public    boolean not null default true,
  featured     boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

create index if not exists idx_projects_public on public.projects(is_public);
create index if not exists idx_projects_sort on public.projects(sort_order);

-- ----------------------------------------------------------------------------
-- services
-- ----------------------------------------------------------------------------
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique,
  description text,
  icon        text,          -- lucide icon name
  features    text[] default '{}',
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_services_updated on public.services;
create trigger trg_services_updated before update on public.services
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- pricing
-- ----------------------------------------------------------------------------
create table if not exists public.pricing (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  price_label   text not null,       -- e.g. "Starting from ₹4,999"
  price_amount  numeric,             -- optional numeric for sorting/analytics
  currency      text default 'INR',
  period        text,                -- e.g. "one-time", "per month"
  description   text,
  features      text[] default '{}',
  highlighted   boolean not null default false,
  is_active     boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists trg_pricing_updated on public.pricing;
create trigger trg_pricing_updated before update on public.pricing
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- testimonials
-- ----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  author      text not null,
  role        text,
  company     text,
  quote       text not null,
  avatar_url  text,
  rating      int default 5 check (rating between 1 and 5),
  is_public   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_testimonials_updated on public.testimonials;
create trigger trg_testimonials_updated before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- site_settings  (editable content / config, key-value JSON)
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  is_public   boolean not null default true,   -- may anon read this key?
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_site_settings_updated on public.site_settings;
create trigger trg_site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- activity_logs  (audit trail)
-- ----------------------------------------------------------------------------
create table if not exists public.activity_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references public.profiles(id) on delete set null,
  actor_email text,
  action      text not null,        -- e.g. "lead.update", "project.create"
  entity      text,                 -- table name
  entity_id   uuid,
  metadata    jsonb default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_activity_created on public.activity_logs(created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles       enable row level security;
alter table public.leads          enable row level security;
alter table public.clients        enable row level security;
alter table public.follow_ups     enable row level security;
alter table public.projects       enable row level security;
alter table public.services       enable row level security;
alter table public.pricing        enable row level security;
alter table public.testimonials   enable row level security;
alter table public.site_settings  enable row level security;
alter table public.activity_logs  enable row level security;

-- ---- profiles --------------------------------------------------------------
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- leads -----------------------------------------------------------------
-- Anyone (even anonymous) may submit a lead, but only with status 'new'.
drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert" on public.leads
  for insert to anon, authenticated
  with check (status = 'new');

-- Only admins may read / update / delete leads.
drop policy if exists "leads_admin_select" on public.leads;
create policy "leads_admin_select" on public.leads
  for select using (public.is_admin());

drop policy if exists "leads_admin_modify" on public.leads;
create policy "leads_admin_modify" on public.leads
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads_admin_delete" on public.leads;
create policy "leads_admin_delete" on public.leads
  for delete using (public.is_admin());

-- ---- clients / follow_ups / activity_logs : admin only ---------------------
drop policy if exists "clients_admin_all" on public.clients;
create policy "clients_admin_all" on public.clients
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "follow_ups_admin_all" on public.follow_ups;
create policy "follow_ups_admin_all" on public.follow_ups
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "activity_admin_select" on public.activity_logs;
create policy "activity_admin_select" on public.activity_logs
  for select using (public.is_admin());
drop policy if exists "activity_admin_insert" on public.activity_logs;
create policy "activity_admin_insert" on public.activity_logs
  for insert to authenticated with check (public.is_admin());

-- ---- projects --------------------------------------------------------------
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects
  for select to anon, authenticated using (is_public or public.is_admin());
drop policy if exists "projects_admin_write" on public.projects;
create policy "projects_admin_write" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- services --------------------------------------------------------------
drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services
  for select to anon, authenticated using (is_active or public.is_admin());
drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- pricing ---------------------------------------------------------------
drop policy if exists "pricing_public_read" on public.pricing;
create policy "pricing_public_read" on public.pricing
  for select to anon, authenticated using (is_active or public.is_admin());
drop policy if exists "pricing_admin_write" on public.pricing;
create policy "pricing_admin_write" on public.pricing
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- testimonials ----------------------------------------------------------
drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read" on public.testimonials
  for select to anon, authenticated using (is_public or public.is_admin());
drop policy if exists "testimonials_admin_write" on public.testimonials;
create policy "testimonials_admin_write" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- site_settings ---------------------------------------------------------
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select to anon, authenticated using (is_public or public.is_admin());
drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- STORAGE  (project images)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "project_images_public_read" on storage.objects;
create policy "project_images_public_read" on storage.objects
  for select using (bucket_id = 'project-images');

drop policy if exists "project_images_admin_write" on storage.objects;
create policy "project_images_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project_images_admin_update" on storage.objects;
create policy "project_images_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project_images_admin_delete" on storage.objects;
create policy "project_images_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'project-images' and public.is_admin());
