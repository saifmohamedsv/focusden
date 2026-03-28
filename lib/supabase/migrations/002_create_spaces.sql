-- Create spaces table
create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  wallpaper_path text not null,
  palette_json jsonb not null,
  default_sounds_json jsonb not null default '[]'::jsonb,
  companion_theme text not null default 'default'
);

-- Enable RLS
alter table public.spaces enable row level security;

-- All authenticated users can read spaces
create policy "Authenticated users can read spaces"
  on public.spaces for select
  to authenticated
  using (true);
