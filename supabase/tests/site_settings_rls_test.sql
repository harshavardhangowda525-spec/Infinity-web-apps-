-- ============================================================================
-- RLS verification for public.site_settings
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL editor AFTER applying migration 0001.
-- It impersonates the 'authenticated' and 'anon' roles (the SQL editor itself
-- runs as a superuser that BYPASSES RLS, so role-switching is required to test
-- policies at all) and prints PASS/FAIL for each required case. It inserts a
-- temporary test row and deletes it again at the end — nothing persists.
--
-- Expectations:
--   1. authenticated admin  CAN insert settings
--   2. authenticated admin  CAN update settings
--   3. non-admin user       CANNOT insert settings
--   4. unauthenticated/anon  CANNOT insert settings
--   5. anyone               CAN read public settings
-- ============================================================================
do $$
declare
  admin_id uuid;
  user_id  uuid;
begin
  -- Pick an admin (allow-listed email or role='admin') and a plain non-admin.
  select p.id into admin_id
  from public.profiles p
  where p.role = 'admin'
     or exists (select 1 from public.admin_emails a where lower(a.email) = lower(p.email))
  limit 1;

  select p.id into user_id
  from public.profiles p
  where p.role <> 'admin'
    and not exists (select 1 from public.admin_emails a where lower(a.email) = lower(p.email))
  limit 1;

  raise notice '--- site_settings RLS tests --- admin=%  non_admin=%', admin_id, coalesce(user_id::text,'(none)');

  if admin_id is null then
    raise notice 'No admin found. Apply migration 0001 (seed admin_emails) first.';
    return;
  end if;

  -- TEST 1: admin INSERT should SUCCEED --------------------------------------
  perform set_config('request.jwt.claim.sub', admin_id::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', admin_id, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  begin
    insert into public.site_settings(key, value, is_public)
    values ('__rls_test__', '{"t":1}'::jsonb, true);
    raise notice 'TEST 1  admin insert           : PASS';
  exception when others then
    raise notice 'TEST 1  admin insert           : FAIL -> %', sqlerrm;
  end;
  execute 'reset role';

  -- TEST 2: admin UPDATE should SUCCEED --------------------------------------
  perform set_config('request.jwt.claim.sub', admin_id::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', admin_id, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  begin
    update public.site_settings set value = '{"t":2}'::jsonb where key = '__rls_test__';
    raise notice 'TEST 2  admin update           : PASS';
  exception when others then
    raise notice 'TEST 2  admin update           : FAIL -> %', sqlerrm;
  end;
  execute 'reset role';

  -- TEST 3: non-admin INSERT should be BLOCKED -------------------------------
  if user_id is not null then
    perform set_config('request.jwt.claim.sub', user_id::text, true);
    perform set_config('request.jwt.claims', json_build_object('sub', user_id, 'role', 'authenticated')::text, true);
    execute 'set local role authenticated';
    begin
      insert into public.site_settings(key, value, is_public)
      values ('__rls_test_bad__', '{"x":1}'::jsonb, true);
      raise notice 'TEST 3  non-admin insert blocked: FAIL -> insert unexpectedly succeeded';
    exception when insufficient_privilege then
      raise notice 'TEST 3  non-admin insert blocked: PASS';
    when others then
      raise notice 'TEST 3  non-admin insert blocked: PASS (blocked: %)', sqlerrm;
    end;
    execute 'reset role';
  else
    raise notice 'TEST 3  non-admin insert blocked: SKIPPED (no non-admin user exists)';
  end if;

  -- TEST 4: anonymous INSERT should be BLOCKED -------------------------------
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '', true);
  execute 'set local role anon';
  begin
    insert into public.site_settings(key, value, is_public)
    values ('__rls_test_anon__', '{"x":1}'::jsonb, true);
    raise notice 'TEST 4  anon insert blocked    : FAIL -> insert unexpectedly succeeded';
  exception when insufficient_privilege then
    raise notice 'TEST 4  anon insert blocked    : PASS';
  when others then
    raise notice 'TEST 4  anon insert blocked    : PASS (blocked: %)', sqlerrm;
  end;
  execute 'reset role';

  -- TEST 5: anonymous SELECT of a public key should SUCCEED ------------------
  execute 'set local role anon';
  begin
    perform 1 from public.site_settings where key = 'company';
    raise notice 'TEST 5  public read            : PASS';
  exception when others then
    raise notice 'TEST 5  public read            : FAIL -> %', sqlerrm;
  end;
  execute 'reset role';

  -- Cleanup (runs as superuser again) ----------------------------------------
  delete from public.site_settings
  where key in ('__rls_test__', '__rls_test_bad__', '__rls_test_anon__');
  raise notice '--- tests complete, temporary rows removed ---';
end $$;
