-- Run in Supabase SQL Editor (Dashboard → SQL)
-- Stores learning progress keyed like localStorage (mastery, quiz, oral, …)

create table if not exists public.progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

create index if not exists progress_snapshots_user_id_idx
  on public.progress_snapshots (user_id);

alter table public.progress_snapshots enable row level security;

drop policy if exists "progress_select_own" on public.progress_snapshots;
create policy "progress_select_own"
  on public.progress_snapshots for select
  using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.progress_snapshots;
create policy "progress_insert_own"
  on public.progress_snapshots for insert
  with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.progress_snapshots;
create policy "progress_update_own"
  on public.progress_snapshots for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "progress_delete_own" on public.progress_snapshots;
create policy "progress_delete_own"
  on public.progress_snapshots for delete
  using (auth.uid() = user_id);
