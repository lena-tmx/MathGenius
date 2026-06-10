-- MathGenius Supabase progress schema
-- Creates user topic progress summary and exercise attempt history.

create extension if not exists pgcrypto;

create table if not exists public.user_topic_progress (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  topic_slug text not null,
  status text not null default 'started'
    check (status in ('started', 'practicing', 'completed')),

  completed_count integer not null default 0
    check (completed_count >= 0),

  total_count integer not null default 0
    check (total_count >= 0),

  score integer not null default 0
    check (score >= 0 and score <= 100),

  completed_at timestamptz,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  unique (user_id, topic_slug)
);

create table if not exists public.user_exercise_attempts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  topic_slug text not null,
  exercise_id text not null,

  is_correct boolean,
  answer_text text,

  attempt_number integer not null default 1
    check (attempt_number >= 1),

  time_spent_seconds integer
    check (time_spent_seconds is null or time_spent_seconds >= 0),

  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists user_topic_progress_user_idx
  on public.user_topic_progress (user_id);

create index if not exists user_topic_progress_topic_idx
  on public.user_topic_progress (topic_slug);

create index if not exists user_exercise_attempts_user_topic_idx
  on public.user_exercise_attempts (user_id, topic_slug);

create index if not exists user_exercise_attempts_exercise_idx
  on public.user_exercise_attempts (exercise_id);

create index if not exists user_exercise_attempts_user_topic_exercise_idx
  on public.user_exercise_attempts (user_id, topic_slug, exercise_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_user_topic_progress_updated_at
on public.user_topic_progress;

create trigger set_user_topic_progress_updated_at
before update on public.user_topic_progress
for each row
execute function public.set_updated_at();

alter table public.user_topic_progress enable row level security;
alter table public.user_exercise_attempts enable row level security;

drop policy if exists "Users can view own topic progress"
on public.user_topic_progress;

create policy "Users can view own topic progress"
on public.user_topic_progress
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own topic progress"
on public.user_topic_progress;

create policy "Users can insert own topic progress"
on public.user_topic_progress
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own topic progress"
on public.user_topic_progress;

create policy "Users can update own topic progress"
on public.user_topic_progress
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own topic progress"
on public.user_topic_progress;

create policy "Users can delete own topic progress"
on public.user_topic_progress
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can view own exercise attempts"
on public.user_exercise_attempts;

create policy "Users can view own exercise attempts"
on public.user_exercise_attempts
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own exercise attempts"
on public.user_exercise_attempts;

create policy "Users can insert own exercise attempts"
on public.user_exercise_attempts
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own exercise attempts"
on public.user_exercise_attempts;

create policy "Users can update own exercise attempts"
on public.user_exercise_attempts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own exercise attempts"
on public.user_exercise_attempts;

create policy "Users can delete own exercise attempts"
on public.user_exercise_attempts
for delete
using (auth.uid() = user_id);