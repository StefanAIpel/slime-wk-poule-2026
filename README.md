# Slime Score 2026

Nederlandstalige WK 2026-poule app, mobiel eerst gebouwd met Next.js, Supabase en Vercel.

## Kern

- E-mail login via Supabase magic links, zonder wachtwoorden.
- Minimale profieldata: bijnaam en teamnaam.
- Scores voorspellen voor alle groepswedstrijden.
- Rondekeuzes, kampioen, topscorer en licht ironische bonusstatistieken.
- Eigen subpoules met deelcode, WhatsApp-link, beheerder en moderators.
- Moderators kunnen poules aankleden met emoji, kleur en tekst en berichten op het prikbord plaatsen.
- Algemene ranglijst en subpoule-ranking op basis van de beste 4 spelers.
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
    "penalty_shootouts_ko": 4
  }
}
```

Authenticatie via `x-result-sync-secret`. Na elke update worden de ranglijsten opnieuw doorgerekend.

## Onderzoek

Zie [docs/onderzoek-wk-poule.md](docs/onderzoek-wk-poule.md).
