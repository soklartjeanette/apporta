begin;

alter table public.exercises drop column difficulty;

update public.exercises
set sketch = sketch - 'caption'
where jsonb_typeof(sketch) = 'object' and sketch ? 'caption';

create table public.exercise_notes (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null references public.exercises (id) on delete cascade,
  note text not null check (char_length(note) <= 2000 and btrim(note) <> ''),
  primary key (user_id, exercise_id)
);

alter table public.exercise_notes enable row level security;
revoke all on public.exercise_notes from public, anon, authenticated;
grant select, insert, update, delete on public.exercise_notes to authenticated;

create policy "Users manage their own exercise notes"
on public.exercise_notes for all to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.exercises
    where exercises.id = exercise_notes.exercise_id and exercises.status = 'published'
  )
);

commit;
