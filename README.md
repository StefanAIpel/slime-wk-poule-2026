# Slime Score — WK Poule 2026

Nederlandstalige, mobiel-eerst WK 2026-poule. Voorspel uitslagen, kies wie ver komt,
strijd in een algemene ranglijst én in eigen subpoules met familie, vrienden of collega's.
Gratis, zonder wachtwoord en zonder advertenties.

Gebouwd met **Next.js (App Router)**, **Supabase** (Auth + Postgres + RLS) en gehost op
**Vercel**. Styling met **Tailwind CSS v4**; lettertype **Poppins**.

## Wat je als speler doet

1. **Aanmelden** met alleen je e-mail (Supabase magic link, geen wachtwoord).
2. **Scorekaart afmaken**: naam + teamnaam (allebei min. 4 tekens). Pas daarna doe je echt mee.
3. **Groepswedstrijden voorspellen** — de groepsstanden en de laatste 32 worden live uit je
   eigen scores berekend.
4. **Knock-out kiezen**: welke landen halen achtste, kwart, halve finale, finale, wereldkampioen.
5. **Bonusvragen** invullen (zie roadmap — wordt herzien).
6. **Subpoule** maken of joinen met een deelcode en de strijd aangaan.

Publieke pagina's (`/schema`, `/ranglijst`, `/regels`, `/privacy`, `/voorwaarden`) zijn zonder
login zichtbaar en worden gecachet (ISR).

## Slime-game koppeling

Naast de poule is er de losse arcade-game **Slime Soccer / Slime Volley** (`SLIME_GAME_URL`,
`https://soccer.slimescore.com`). Die wordt als sfeer-/bonusbanner getoond en als menu-link.
Er is géén score-koppeling tussen game en poule; het is puur vermaak. Een **duo-banner**
(soccer + volley naast elkaar) staat op de roadmap.

## Architectuur

```
src/app            App Router pagina's + server actions (actions.ts) + API routes
src/components      UI-componenten (server + client)
src/lib            Domeinlogica: scoring, groepsstanden, avatars, flags, constants, types
src/lib/supabase   Supabase clients (browser, server, admin/service-role, middleware)
supabase           Migraties
public             Statische assets (slimes, avatars, hero-beelden)
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

## Lokaal draaien

```bash
npm install
cp .env.example .env.local   # vul Supabase-url + keys + RESULT_SYNC_SECRET
npm run dev
```

Migraties: `supabase db push`.

## Roadmap

Volledige, levende werklijst: **[docs/ui-review-todo.md](docs/ui-review-todo.md)**.

**Gepland / in uitvoering**
- Account-pagina (✅ basis: naam/team/avatar/e-mail/verwijderen) — taalkeuze NL/EN later.
- Subpoule-tabs met klik-op-speler (voorspellingen + punten per wedstrijd; e-mail blijft privé).
- Regels + FAQ herschrijven; beknopte puntentelling met uitklap.
- Voorspel-flow: groepsstand met nullen, stadionnaam naast stad, knock-out cascade-validatie.
- Bonusvragen herzien: weg met topscorer/0-0/speelstad; toevoegen team-met-meeste-goals en
  "hoe ver komt Oranje"; wereldkampioen + penaltyseries + Oranje wijzigbaar t/m 28 juni 21:00.
- SEO/GEO: structured data (JSON-LD), metadata aanscherpen.
- Duo-banner Slime Soccer + Volley.

**Niet gepland (bewuste keuzes)**
- Niet alle 104 wedstrijden los invullen — alleen groepsduels + automatische laatste 32.
- Geen score-koppeling tussen de arcade-game en de poule.
- Geen wachtwoorden / social login — alleen e-mail magic links.
- Geen advertenties of tracking-cookies.

## Documentatie

- [Werklijst UI-review](docs/ui-review-todo.md)
- [Agent brief](docs/AGENT_BRIEF.md)
- [Onderzoek WK-poule](docs/onderzoek-wk-poule.md)

## Productnotities

- Officieel domein `https://slimescore.com` (`SITE_URL`); hosting op Vercel.
- Inlogmails via `MAIL_FROM` (`noreply@slimesports.com`, Cloudflare Email Routing); contact via `CONTACT_EMAIL`.
- Juridisch: `/privacy` + `/voorwaarden` (publiek, in sitemap; privé-routes uitgesloten in `robots.txt`).
- Subpoule-banner: server-side auto-conversie naar WebP (max 1600×900) in Storage-bucket `pool-media`.
- Auth-link fallback in `/auth/confirm` én globaal via `AuthLinkBridge`.
