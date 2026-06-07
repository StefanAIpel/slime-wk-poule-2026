# CLAUDE.md — gids voor ontwikkelaars & agents

Instappunt voor wie (mens of agent) aan **SlimeScore** werkt. Houd dit kort en actueel.

## Wat is het
Nederlandstalige, mobiel-eerst **WK 2026-poule**. Voorspel uitslagen + knock-out,
strijd in een algemene ranglijst en in eigen **subpoules**. Gratis, zonder advertenties.
Root `/` is Nederlands; `/en` is Engels. Productie: `slimescore.com` (Vercel,
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
- **Branch:** feature/fix/docs-branch + PR; productie = `main` (Vercel deployt vanaf `main`).
- **Altijd groen houden:** `npm test`, `npm run lint`, `npm run build`.
- **Taal:** Nederlands is hoofdmoot; NL/BE default NL. Bij iedere UI-copy wijziging NL én EN bijwerken (`/` en `/en`, plus aria/metadata/share/form/footer/deeproutes).
- **Versie:** app/UI-deploys verhogen `APP_VERSION` in `src/lib/constants.ts`; live footer moet `bèta/beta <versie>` tonen. Docs-only zonder app/UI-deploy hoeft geen bump.
- **Signal:** native Web Share/clipboard fallback; nooit terug naar `sgnl://send?text=...`.
- **Account:** SlimeScore naam/nickname blijft vast na signup/profiel; teamnaam/avatar/taal mogen editbaar blijven.
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
- `AGENTS.md` — korte operationele instructies voor coding agents.
- `README.md` — productoverzicht + database-tabellen + roadmap.

## Status (kort)
Launch-waardig voor vrienden/familie. NL/EN, SEO, sitemap/robots, password/fixed-code auth,
admin-dashboard en v0.21 release staan live. Open/actielijst (zie feedback-status.md): automatische
uitslagen-API + live scores, push-notificaties, knock-out cascade-validatie en externe config
(Supabase auth-URLs + custom SMTP) vóór brede launch.
