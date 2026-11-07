begin;

create table public.exercises (
  id text primary key,
  title text not null check (btrim(title) <> ''),
  category text not null check (category in (
    'Markering', 'Dirigering och linjetag', 'Sök och närsök',
    'Stadga och passivitet', 'Stoppsignal', 'Vattenarbete', 'Ringträning'
  )),
  difficulty text not null check (difficulty in ('Nybörjare', 'Fortsättning', 'Avancerad')),
  description text,
  equipment text[],
  steps text[] not null default '{}',
  sketch jsonb,
  tips text,
  variations text,
  duration_minutes integer check (duration_minutes > 0),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'published' or (
    cardinality(steps) > 0 and sketch is not null and jsonb_typeof(sketch) = 'object'
  ))
);

create function public.set_exercise_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_exercise_updated_at
before update on public.exercises
for each row execute function public.set_exercise_updated_at();

alter table public.exercises enable row level security;
revoke all on public.exercises from public, anon, authenticated;
grant select on public.exercises to anon, authenticated;

create policy "Visitors can read published exercises"
on public.exercises for select to anon, authenticated
using (status = 'published');

commit;
