begin;

create schema if not exists apportera_private;
revoke all on schema apportera_private from public, anon, authenticated;
grant usage on schema apportera_private to authenticated;

create table apportera_private.exercise_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table apportera_private.exercise_admins enable row level security;
revoke all on apportera_private.exercise_admins from public, anon, authenticated;

create function apportera_private.is_exercise_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from apportera_private.exercise_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function apportera_private.is_exercise_admin() from public, anon, authenticated;
grant execute on function apportera_private.is_exercise_admin() to authenticated;

grant insert, update, delete on public.exercises to authenticated;

create policy "Exercise administrators can manage exercises"
on public.exercises for all to authenticated
using ((select apportera_private.is_exercise_admin()))
with check ((select apportera_private.is_exercise_admin()));

commit;
