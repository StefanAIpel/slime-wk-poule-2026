-- Admin-instelbare mededelingen op hoofdpagina's (ingelogde home + voorspellen).
-- Eén rij per plek; leeg = geen banner. Optioneel tijdvenster (bijv. "toon vanaf
-- 14 juni 21:00") zodat de tekst vanzelf wisselt na de deadline.
create table if not exists public.site_messages (
  placement text primary key check (placement in ('home', 'voorspellingen')),
  body_nl text not null default '',
  body_en text not null default '',
  show_from timestamptz,
  show_until timestamptz,
  updated_by text,
  updated_at timestamptz not null default now()
);

alter table public.site_messages enable row level security;

-- Iedereen mag lezen (de banner is publieke site-copy); schrijven kan alleen
-- via de service-role (geen insert/update/delete-policies).
create policy "site_messages_read" on public.site_messages
  for select using (true);
