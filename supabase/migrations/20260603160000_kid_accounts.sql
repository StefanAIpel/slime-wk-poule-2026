-- Kind-accounts (voor kinderen zonder eigen e-mail): inloggen met alleen een code.
-- De code = wachtwoord; alleen de service-role (admin) kan deze tabel lezen.
create table if not exists public.kid_accounts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  code text not null unique,
  nickname text,
  created_by text,
  created_at timestamptz not null default now()
);

alter table public.kid_accounts enable row level security;
