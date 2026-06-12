-- Admin-instelbare poll voor de live-subsite + anonieme stemmen (1 per apparaat).
create table if not exists public.live_polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text,
  active boolean not null default false,
  updated_by text,
  updated_at timestamptz not null default now()
);

alter table public.live_polls enable row level security;

-- Iedereen mag de actieve poll lezen; schrijven kan alleen via de service-role.
create policy "live_polls_read_active" on public.live_polls
  for select using (active);

create table if not exists public.live_poll_votes (
  poll_id uuid not null references public.live_polls(id) on delete cascade,
  voter_id text not null,
  choice text not null check (choice in ('a', 'b', 'c')),
  created_at timestamptz not null default now(),
  primary key (poll_id, voter_id)
);

alter table public.live_poll_votes enable row level security;
-- Geen publieke policies: stemmen worden alleen via de service-role gelezen
-- (geaggregeerd) en geschreven (server-side, met cookie-stem-id).

create index if not exists live_poll_votes_poll_idx on public.live_poll_votes (poll_id);
