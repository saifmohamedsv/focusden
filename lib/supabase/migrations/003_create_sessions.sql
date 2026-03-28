-- Create sessions table
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  space_id uuid references public.spaces(id) not null,
  project_name text not null default '',
  mood text check (mood in ('focused', 'calm', 'anxious', 'restless')),
  duration_minutes integer not null default 0,
  todos_completed integer not null default 0,
  started_at timestamptz not null,
  ended_at timestamptz not null
);

-- Enable RLS
alter table public.sessions enable row level security;

-- Users can only read their own sessions
create policy "Users can read own sessions"
  on public.sessions for select
  using (
    user_id in (
      select id from public.users where google_id = auth.uid()::text
    )
  );

-- Users can only insert their own sessions
create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (
    user_id in (
      select id from public.users where google_id = auth.uid()::text
    )
  );

-- Create index for stats queries
create index sessions_user_id_idx on public.sessions(user_id);
create index sessions_started_at_idx on public.sessions(started_at);
