# SlimeScore — WK Poule 2026

Nederlandstalige, mobiel-eerst WK 2026-poule. Voorspel uitslagen, kies wie ver komt,
strijd in een algemene ranglijst én in eigen subpoules met familie, vrienden of collega's.
Gratis en zonder advertenties. Nederlands is de hoofdervaring; `/en` is de Engelse route
voor internationale bezoekers.

Gebouwd met **Next.js (App Router)**, **Supabase** (Auth + Postgres + RLS) en gehost op
**Vercel**. Styling met **Tailwind CSS v4**; lettertype **Poppins**.

## Wat je als speler doet

1. **Aanmelden** met e-mail + wachtwoord, of via vaste code zonder e-mail voor kind-/beheeraccounts.
2. **Scorekaart afmaken**: SlimeScore-naam + teamnaam (allebei min. 4 tekens). Pas daarna doe je echt mee.
3. **Groepswedstrijden voorspellen** — de groepsstanden en de laatste 32 worden live uit je
   eigen scores berekend.
4. **Knock-out kiezen**: welke landen halen achtste, kwart, halve finale, finale, wereldkampioen.
5. **Bonusvragen** invullen (zie roadmap — wordt herzien).
6. **Subpoule** maken of joinen met een deelcode en de strijd aangaan.

Publieke pagina's (`/`, `/en`, `/schema`, `/ranglijst`, `/regels`, `/privacy`, `/voorwaarden`, `/games`) zijn zonder
login zichtbaar en worden gecachet waar dat past (ISR).

## Slime-game koppeling

Naast de poule is er de losse arcade-game **Slime Soccer / Slime Volley** (`SLIME_GAME_URL`,
`https://soccer.slimescore.com`). Die wordt als sfeer-/bonusbanner getoond en als menu-link.
Er is géén score-koppeling tussen game en poule; het is puur vermaak. Een **duo-banner**
(soccer + volley naast elkaar) staat op de roadmap.

## Architectuur

```
src/app            App Router pagina's + server actions (actions.ts) + /api/sync-results + /admin
src/components      UI-componenten (server + client)
src/lib            Domeinlogica: scoring, recalculate, groepsstanden, avatars, admin, rate-limit, log, flags, constants, format, types
src/lib/supabase   Supabase clients (browser, server, admin/service-role, middleware)
supabase           Migraties
public             Statische assets (slimes, avatars, hero-beelden)
tests              Unit-tests (scoring) via `node --test`

docs               Productdocumentatie + werklijst
```

### Database (Supabase Postgres)

Belangrijkste tabellen en koppelingen (alle user-data cascadeert vanaf `profiles`):

| Tabel | Doel |
| --- | --- |
| `profiles` | speler: `nickname`, `team_name`, `avatar_key` (1:1 met `auth.users`, geen FK — bij verwijderen handmatig profiel + auth-user wissen) |
| `teams` | 48 landen: `code`, `name_nl`, `group_letter`, `sort_order` |
| `matches` | wedstrijden: `starts_at`, `venue` (speelstad), `home/away_code`, `status`, uitslag |
| `predictions` | scorevoorspellingen per speler per wedstrijd (FK → `profiles`, cascade) |
| `bracket_predictions` | rondekeuzes per `stage_key` (round32/16, quarter, semi, finalists, champion) |
| `special_predictions` | bonusvragen per speler |
| `stage_results` | werkelijke ronde-uitkomsten per `stage_key` |
| `tournament_facts` | werkelijke bonusfeiten (één rij, `id = true`) |
| `scores` | doorgerekende totalen per speler (`points`, `exact_scores`, `correct_results`, `bonus_points`) |
| `pools` | subpoule: `name`, `code`, `owner_id`, opmaak (`badge_emoji`, `accent_color`, `description`) |
| `pool_members` | lidmaatschap + rol (`owner`/`moderator`/`member`) |
| `pool_messages` | prikbord per subpoule |

Scoring zit in `src/lib/scoring.ts`; standen/laatste-32 in `src/lib/group-standings.ts`.

## Uitslagen syncen (`/api/sync-results`)

Server-side koppeling voor uitslagen, ronde-uitkomsten en bonusfeiten. Authenticatie via
`x-result-sync-secret` (alleen via header, niet via querystring). Na elke update worden **alle ranglijsten opnieuw
doorgerekend**.

```json
{
  "results": [{ "id": 1, "home_score": 2, "away_score": 1, "status": "finished" }],
  "stage_results": { "round32": ["NED", "BRA"], "champion": ["NED"] },
  "facts": { "total_goals": 171, "penalty_shootouts_ko": 4 }
}
```

> **Databron is nog niet vastgelegd.** Nu wordt er handmatig/extern gepost. Een geautomatiseerde
> koppeling met een wedstrijd-API (uitslagen + stats voor de bonusvragen) staat op de roadmap.

## Taal, SEO en deployregels voor agents

- **Nederlands is de hoofdmoot.** Root `/` is Nederlands; NL/BE-bezoekers blijven standaard Nederlands.
- **Engels staat op `/en`.** Buiten NL/BE mag Engels de fallback zijn; `?lang=en` en `?lang=nl` zetten de locale-cookie en redirecten canonical.
- **Elke zichtbare UI-tekstwijziging moet in NL én EN kloppen.** Controleer ook aria-labels, statusbalk, share-copy, formulieren, footer, metadata en deep routes.
- **Elke deploy die de app wijzigt verhoogt `APP_VERSION` in `src/lib/constants.ts`.** De footer moet live de nieuwe `bèta/beta` versie tonen.
- **Signal blijft native share/fallback copy.** Niet terug naar directe `sgnl://send?text=...` links.
- **Accountnaam blijft vast na signup/eerste profielstap.** Teamnaam, avatar en taal mogen wel bewerkbaar blijven.
- **Voor deploy:** draai `npm test`, `npm run lint`, `npm run build`; smoke-test lokaal/preview én productie met NL, EN, mobiel, relevante ingelogde flows, console en layout.
- **Geen secrets loggen of committen.** Testaccounts/scripts altijd opruimen.

Zie ook `AGENTS.md` en `docs/AGENT_BRIEF.md`.

## Lokaal draaien

```bash
npm install
cp .env.example .env.local   # Supabase-url + keys + RESULT_SYNC_SECRET + ADMIN_EMAILS
npm run dev
npm test                     # scoring-tests (node --test)
```

Migraties: `supabase db push`. Beheer: `/admin` (toegang via `ADMIN_EMAILS`).

## Roadmap & status

Genummerde feedback met prioriteit + status: **[docs/feedback-status.md](docs/feedback-status.md)**.
Werklijst per ronde: **[docs/ui-review-todo.md](docs/ui-review-todo.md)**.

**Gedaan ✅** — account-pagina (naam/team/avatar/e-mail/verwijderen), subpoule-tabs + klik-op-speler,
regels + FAQ, voorspel-flow (groepsstand met nullen, stadionnaam, bonusvragen herzien, t/m 28 jun),
SEO JSON-LD, duo-gamebanner, scoring-tests, rate-limiting, sync-secret header-only, RLS-review,
foutpagina's + logging, **admin-dashboard + auditlog**, hi-res slimes + stadion-hero's, cross-device + WhatsApp-nudge.

**Open / actielijst ⬜** — automatische uitslagen-API + live scores, push-notificaties (of .ics),
knock-out cascade-validatie en externe config (Supabase auth-URLs + custom SMTP)
vóór brede launch (zie `docs/operatie-launch.md`).

**Niet gepland (bewuste keuzes)**
- Niet alle 104 wedstrijden los invullen — alleen groepsduels + automatische laatste 32.
- Geen score-koppeling tussen de arcade-game en de poule.
- Geen advertenties of tracking-cookies.

## Documentatie

- [Agent/projectinstructies](AGENTS.md)
- [Werklijst UI-review](docs/ui-review-todo.md)
- [Agent brief](docs/AGENT_BRIEF.md)
- [Onderzoek WK-poule](docs/onderzoek-wk-poule.md)

## Productnotities

- Officieel domein `https://slimescore.com` (`SITE_URL`); hosting op Vercel.
- Inlogmails via `MAIL_FROM` (`noreply@slimesports.com`, Cloudflare Email Routing); contact via `CONTACT_EMAIL`.
- Juridisch: `/privacy` + `/voorwaarden` (publiek, in sitemap; privé-routes uitgesloten in `robots.txt`).
- Subpoule-banner: server-side auto-conversie naar WebP (max 1600×900) in Storage-bucket `pool-media`.
- Auth-link fallback in `/auth/confirm` én globaal via `AuthLinkBridge`.
