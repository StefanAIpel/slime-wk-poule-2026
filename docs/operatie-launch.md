# Operationele checklist — launch & beheer

Stappen die buiten de code-repo geregeld moeten worden (Supabase/Vercel-dashboard).
Code-kant is gedekt; dit is de "live zetten"-checklist.

## 1. Supabase Auth (verplicht vóór live)
Dashboard → **Authentication → URL Configuration**:
- **Site URL:** `https://slimescore.com`
- **Redirect URLs (allowlist):** voeg toe:
  - `https://slimescore.com/auth/confirm`
  - `https://slimescore.app/auth/confirm` (alt-domein, indien gebruikt)
  - `http://localhost:3000/auth/confirm` (voor lokaal testen)

Zonder de juiste redirect-allowlist werkt de magic link niet.

## 2. E-mail / SMTP (betrouwbaarheid)
- Standaard Supabase-mail heeft lage limieten en matige deliverability.
- Zet **custom SMTP** aan (Authentication → Emails → SMTP) met **Resend** (`MAIL_FROM = noreply@slimesports.com`).
- Regel **SPF + DKIM** voor `slimesports.com` in Cloudflare.
- Pas de magic-link e-mailtemplate aan met de Slime Score-huisstijl.
- **Schaal:** bij >~1000 aanmeldingen/dag een betaald Resend-plan (gratis = 3000/mnd).

## 3. Environment variables (Vercel → Project → Settings → Environment Variables)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (client + middleware)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, nooit naar de client)
- `RESULT_SYNC_SECRET` (lang en willekeurig — wordt nu alleen via header geaccepteerd)

## 4. Back-up / restore
- **Supabase Pro** maakt dagelijkse automatische back-ups (7 dagen retentie); **PITR** is een
  add-on voor herstel op het moment.
- **Free tier:** geen automatische back-ups → maak vóór de launch een handmatige dump:
  ```bash
  supabase db dump --db-url "$SUPABASE_DB_URL" -f backup-$(date +%F).sql
  ```
- **Restore:** `psql "$SUPABASE_DB_URL" -f backup-YYYY-MM-DD.sql` (of via Dashboard → Database → Backups → Restore).
- Migraties staan in `supabase/migrations/` → schema is altijd reproduceerbaar met `supabase db push`.
- **Advies:** minimaal Pro-tier tijdens het toernooi voor dagelijkse back-ups.

## 5. Deploy / release
1. Merge `claude/wk-pool-app-ui-review-j5dpz` → `main` (of deploy de branch).
2. Controleer dat de env-vars hierboven staan.
3. `npm run build` slaagt al; `npm test` (scoring) groen houden in CI.
4. Na deploy: harde refresh — veel UI-fixes staan al in code maar nog niet live.

## 6. Live smoke test (na deploy)
1. Vraag een magic link aan met een echt e-mailadres → link werkt → ingelogd.
2. Maak naam + teamnaam (min. 4 tekens) af.
3. Vul een paar groepswedstrijden in → opslaan → herladen → waarden blijven staan.
4. Maak een subpoule → kopieer code → join met een 2e account → verschijnt in de stand.
5. `POST /api/sync-results` met een test-uitslag (header `x-result-sync-secret`) → ranglijst en
   "Laatste resultaten-update" werken bij.

## 7. Monitoring
- Code logt gestructureerd (JSON) via `src/lib/log.ts` → zichtbaar in Vercel-logs.
- Optioneel later: Sentry (DSN als env) voor alerts; `logError` is het centrale haakje.
- Eenvoudige uptime: een externe pinger (bijv. UptimeRobot) op `https://slimescore.com`.
