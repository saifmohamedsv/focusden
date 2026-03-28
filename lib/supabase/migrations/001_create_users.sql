-- Create users table
create table public.users (
  id uuid primary key default gen_random_uuid(),
  google_id text unique not null,
  email text not null,
  display_name text not null,
  image text,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Users can read their own row
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid()::text = google_id);

-- Users can update their own row
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid()::text = google_id);

-- Service role can insert (used during auth callback)
create policy "Service role can insert users"
  on public.users for insert
  with check (true);
