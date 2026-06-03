-- Auditlog voor admin-acties (resultaatcorrecties e.d.). Alleen server (service-role).
create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  actor_email text,
  action text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);

alter table public.admin_audit_log enable row level security;
