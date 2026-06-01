# Agent Brief: Slime Score 2026

## Doel van de app

Slime Score 2026 is een Nederlandstalige, mobiel-eerst WK-poule app. De kern is snel meedoen met alleen e-mail, bijnaam en teamnaam, groepswedstrijden voorspellen, automatisch groepsstanden zien, eigen subpoules delen via code/WhatsApp en ranglijsten volgen.

De app moet professioneel kunnen doorgroeien, maar de eerste productkeuze blijft gemak boven volledigheid: deelnemers moeten niet tijdens het hele WK steeds nieuwe formulieren moeten invullen.

## Prompt-specifieke eisen van Stefan

- Nieuwe repo en Vercel-site, niet te veel bouwen op de bestaande Slime game repo.
- Link naar de bestaande Slime WK-game als bonus.
- Nederlandse UI.
- E-mail login met bevestigingsmail/magic link en minimale data.
- Supabase als betrouwbare database.
- Mobiel eerste ervaring, maar bruikbaar op desktop/tablet.
- Slime Score branding: vrolijk, WK, voetbal, Slime, niet kinderachtig.
- Geen prompt-antwoordteksten zoals "Wat zit erin?" op publieke pagina's.
- Scores invullen voor groepswedstrijden.
- Rondekeuzes, kampioen, topscorer en bonusstatistieken.
- Invullen tot 11 juni 2026 om 21:00 Nederlandse tijd.
- Na groepsfase optioneel 1 update-window op 28 juni 2026 tot 21:00.
- Gebalanceerde puntentelling, kampioen maximaal ongeveer 8% van totaal.
- Eigen subpoules met geheime code, WhatsApp delen, beheerder, moderators en berichten.
- Algemene ranglijst en subpoule-ranking op beste 4 spelers.
- Goede regels/uitlegpagina.
- Toegankelijkheid belangrijk.

## Huidige functionele staat

- Auth: Supabase magic-link login. `/auth/confirm` verwerkt `access_token`/`refresh_token`, `code` en `token_hash`. Een globale `AuthLinkBridge` vangt ook links af die op `/` landen met tokens achter `#`.
- Profiel: bijnaam en teamnaam na eerste login.
- Voorspellingen: 72 groepsduels met live berekende groepsstand per groep.
- Laatste 32: automatisch uit groepsstanden, nummers 1 en 2 plus beste acht nummers 3.
- Rondekeuzes: achtste finale, kwartfinale, halve finale, finalisten, kampioen.
- Bonus: topscorer, totaal goals, 0-0's, rode kaarten, speelstad met meeste goals, penaltyseries, eigen goals, kaarten-team knock-out.
- Poules: maken, joinen met code, delen via WhatsApp, leden verwijderen, moderators, aankleding, prikbordberichten.
- Ranglijsten: personen en subpoules op beste 4 spelers.
- Resultaten: `/api/sync-results` verwerkt uitslagen, stage-results en tournament-facts en rekent scores opnieuw door.

## Belangrijke technische vraagstukken

### Supabase Auth

Controleer in Supabase Dashboard:

- Site URL: productie-url, nu `https://slimescore.vercel.app`.
- Redirect URLs: minimaal `https://slimescore.vercel.app/**` en lokale dev URL.
- Als mailtemplates zijn aangepast: gebruik `{{ .ConfirmationURL }}` of gebruik `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email` als `RedirectTo` al naar `/auth/confirm` wijst. Voeg niet nog een extra `/auth/confirm` toe.

Bron: https://supabase.com/docs/guides/auth/redirect-urls

### Puntentelling

Per wedstrijd is 12 punten het maximum. Exacte uitslag stapelt niet door met deelpunten. Niet-exacte voorspellingen kunnen deelpunten krijgen voor richting, doelsaldo en teamgoals.

Server-side begrenzing is belangrijk: rondecheckboxes mogen niet onbeperkt punten geven.

### Resultatenprovider

Er is nog geen live football data provider gekoppeld. Kies in latere fase tussen API-Football, football-data.org of Sportmonks. Tot die tijd kan de beveiligde sync-route of een adminpaneel uitslagen verwerken.

### Schaalbaarheid

De huidige stack is geschikt voor een betaalbare MVP:

- Vercel voor Next.js.
- Supabase Postgres/Auth/RLS.
- Server actions voor eenvoudige mutaties.
- Service role alleen server-side.

Voor grotere schaal: ranking-recalculatie uit de request halen en naar queue/cron/background job verplaatsen.

## Ontwikkelfases

### Fase 1: MVP afronden

- Auth volledig testen met echte e-mailtemplate.
- Prediction UX afronden op mobiel.
- Regels en scorevoorbeelden aanscherpen.
- Admin-invoer voor uitslagen bouwen.
- Resultaat-sync handmatig of semi-automatisch bruikbaar maken.

### Fase 2: Productie betrouwbaar

- Definitief domein en mailafzender via Cloudflare/Resend.
- Supabase SMTP instellen.
- Resultatenprovider kiezen en cron/sync bouwen.
- Monitoring en error logging.
- Privacy/voorwaarden/cookievrije basispagina's.

### Fase 3: Professionaliseren

- Uitnodigingslinks in plaats van alleen codes.
- PWA-installatie en push/e-mail reminders.
- Betere subpoule-home met activiteit en favorieten.
- Admin dashboard met auditlog.
- Accessibility QA en load test.

### Fase 4: Groei

- Bedrijfspoules.
- Premium subpoule-thema's of sponsorvrije bedrijfsvariant.
- Meertaligheid als er internationale ambitie komt.
- Native wrapper pas overwegen als PWA tractie heeft.
