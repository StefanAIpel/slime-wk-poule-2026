# Slime Score 2026

Nederlandstalige WK 2026-poule app, mobiel eerst gebouwd met Next.js, Supabase en Vercel.

## Kern

- E-mail login via Supabase magic links, zonder wachtwoorden.
- Minimale profieldata: bijnaam en teamnaam.
- Scores voorspellen voor alle groepswedstrijden met live berekende groepsstanden.
- Laatste 32 automatisch uit de voorspelde groepsstanden.
- Rondekeuzes, kampioen, topscorer en licht ironische bonusstatistieken.
- Publieke ranglijst en schema zijn zonder login zichtbaar en cachebaar.
- Eigen subpoules met deelcode, WhatsApp-link, beheerder en moderators.
- Moderators kunnen poules aankleden met emoji, kleur en tekst en berichten op het prikbord plaatsen.
- Algemene ranglijst en subpoule-ranking op basis van de beste 4 spelers.
- Wegklikbare PWA-installkaart: werkt als browser-app en als beginscherm-app.
- Bonuslink naar de bestaande Slime World Cup game.

## Stack

- Next.js App Router
- Supabase Auth, Postgres en RLS
- Vercel deployment
- Tailwind CSS

## Lokaal draaien

```bash
npm install
npm run dev
```

Maak `.env.local` op basis van `.env.example`.

## Database

Supabase-project: `slime-wk-poule-2026`

Migraties:

```bash
supabase db push
```

## Uitslagen syncen

De route `/api/sync-results` accepteert server-side updates voor uitslagen, ronde-uitkomsten en bonusfeiten:

```json
{
  "results": [
    { "id": 1, "home_score": 2, "away_score": 1, "status": "finished" }
  ],
  "stage_results": {
    "round32": ["NED", "BRA"],
    "champion": ["NED"]
  },
  "facts": {
    "top_scorers": ["Memphis Depay"],
    "total_goals": 171,
    "total_corners": 840,
    "fastest_goal_minute": 3,
    "penalty_shootouts_ko": 4
  }
}
```

Authenticatie via `x-result-sync-secret`. Na elke update worden de ranglijsten opnieuw doorgerekend.

## Agent-documentatie

- [Agent brief](docs/AGENT_BRIEF.md)
- [Onderzoek WK-poule](docs/onderzoek-wk-poule.md)

## Productnotities

- Officieel domein: `https://slimescore.nl` (centraal in `SITE_URL`, gebruikt voor metadata, manifest en deel-links). Hosting draait op Vercel (`https://slimescore.vercel.app`).
- Auth-link fallback zit zowel in `/auth/confirm` als globaal in `AuthLinkBridge`, omdat Supabase-links afhankelijk van template/config op verschillende manieren kunnen terugkomen.
- De app kiest bewust voor gemak: groepsduels + automatisch berekende laatste 32 + rondekeuzes, niet alle 104 wedstrijden apart invullen.
- De publieke pagina's `/schema` en `/ranglijst` gebruiken ISR (`1h` en `30s`) om Supabase-load en TTFB laag te houden.
