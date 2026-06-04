# CLAUDE.md — gids voor ontwikkelaars & agents

Instappunt voor wie (mens of agent) aan **Slime Score** werkt. Houd dit kort en actueel.

## Wat is het
Nederlandstalige, mobiel-eerst **WK 2026-poule**. Voorspel uitslagen + knock-out,
strijd in een algemene ranglijst en in eigen **subpoules**. Gratis, e-mail-only login
(magic link), geen wachtwoorden, geen tracking. Productie: `slimescore.com` (Vercel,
deployt vanaf `main`).

## Stack
Next.js 16 (App Router) · React 19 · Supabase (Auth + Postgres + RLS) · Tailwind v4 ·
Plus Jakarta Sans · gehost op Vercel.

## Structuur
```
src/app            routes + server actions (actions.ts) + /api/sync-results + /admin
src/components      UI (server + client)
src/lib            scoring, recalculate, group-standings, avatars, admin, rate-limit, log, constants, flags, format, types
src/lib/supabase   clients: browser, server, admin (service-role), middleware
supabase/migrations  DB-schema (reproduceerbaar)
public/assets      slimes + stadion-achtergronden (zie EXPECTED_ASSETS.md)
docs               productdocumentatie + werklijsten
```

## Werkwijze / conventies
- **Branch:** ontwikkel op `claude/wk-pool-app-ui-review-j5dpz`; productie = `main` (clean fast-forward → Vercel deployt).
- **Altijd groen houden:** `npx tsc --noEmit`, `npx eslint src`, `npm test` (scoring-tests), `npm run build`.
- **DB-wijzigingen:** via een migratie in `supabase/migrations/` én toepassen (MCP/CLI). Daarna `get_advisors` (security/performance) checken.
- **Secrets:** service-role key alleen server-side; `RESULT_SYNC_SECRET` alleen via header; `ADMIN_EMAILS` voor `/admin`.
- **Scoring is de bron van waarheid** in `src/lib/scoring.ts` (getest). `src/lib/recalculate.ts` herrekent alle ranglijsten en wordt gedeeld door `/api/sync-results` en `/admin`.
- **Slimes:** bron-art op witte achtergrond in `public/slimes/uploads/…`; cutout (flood-fill) → geoptimaliseerde WebP in `public/assets/` (zie git-historie voor het cutout-script).

## Belangrijke documenten
- `docs/feedback-status.md` — **genummerde feedback met prioriteit + status** (begin hier voor "wat moet er nog").
- `docs/audit-2026-06.md` — deepdive AVG/compliance + veiligheid/bots + SEO (wat is gefixt, wat is extern open).
- `docs/ui-review-todo.md` — werklijst per ronde.
- `docs/api-en-techniek.md` — uitslagen-API, puntentelling, push, SEO/ads, dataverkeer-sanity.
- `docs/operatie-launch.md` — auth-URLs, SMTP, back-up/restore, deploy + smoke-test (externe stappen).
- `docs/ui-deepdive-devices.md` — cross-device/browser + WhatsApp-in-app.
- `README.md` — productoverzicht + database-tabellen + roadmap.

## Status (kort)
Launch-waardig voor vrienden/familie. Open/actielijst (zie feedback-status.md): automatische
uitslagen-API + live scores, push-notificaties, knock-out cascade-validatie, taalkeuze NL/EN,
en externe config (Supabase auth-URLs + custom SMTP) vóór brede launch.
