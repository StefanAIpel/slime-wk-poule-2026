# Agent Brief: SlimeScore 2026

## Doel van de app

SlimeScore 2026 is een Nederlandstalige, mobiel-eerst WK-poule app. De kern is snel meedoen met e-mail + wachtwoord of vaste code, SlimeScore-naam en teamnaam kiezen, groepswedstrijden voorspellen, automatisch groepsstanden zien, eigen subpoules delen via code/share-knoppen en ranglijsten volgen. Nederlands is de hoofdervaring; `/en` is de Engelse route voor internationale bezoekers.

De app moet professioneel kunnen doorgroeien, maar de eerste productkeuze blijft gemak boven volledigheid: deelnemers moeten niet tijdens het hele WK steeds nieuwe formulieren moeten invullen.

## Prompt-specifieke eisen van Stefan

- Nieuwe repo en Vercel-site, niet te veel bouwen op de bestaande Slime game repo.
- Link naar de bestaande Slime WK-game als bonus.
- Nederlandse UI als hoofdervaring; `/en` volledig Engels voor internationale bezoekers.
- NL/BE-bezoekers standaard Nederlands; buiten NL/BE mag Engels de fallback zijn.
- E-mail + wachtwoordlogin, vaste codes zonder e-mail en minimale data.
- Supabase als betrouwbare database.
- Mobiel eerste ervaring, maar bruikbaar op desktop/tablet.
- SlimeScore branding: vrolijk, WK, voetbal, Slime, niet kinderachtig.
- Geen prompt-antwoordteksten zoals "Wat zit erin?" op publieke pagina's.
- Scores invullen voor groepswedstrijden.
- Rondekeuzes, kampioen, topscorer en bonusstatistieken.
- Invullen tot 11 juni 2026 om 21:00 Nederlandse tijd.
- Na groepsfase optioneel 1 update-window op 28 juni 2026 tot 21:00.
- Gebalanceerde puntentelling, kampioen maximaal ongeveer 8% van totaal.
- Puntentelling mag de kampioenrichtlijn niet letterlijk of te laag maken: knock-outrondes moeten genoeg gewicht hebben om een inhaalrace mogelijk te houden.
- Eigen subpoules met geheime code, WhatsApp delen, beheerder, moderators en berichten.
- Algemene ranglijst en subpoule-ranking op beste 4 spelers.
- Goede regels/uitlegpagina.
- Toegankelijkheid belangrijk.

## Huidige functionele staat

- Auth: Supabase e-mail + wachtwoordlogin, wachtwoordreset en vaste code-accounts zonder e-mail. `/auth/confirm` verwerkt `access_token`/`refresh_token`, `code` en `token_hash`. Een globale `AuthLinkBridge` vangt ook links af die op `/` landen met tokens achter `#`.
- Profiel: SlimeScore-naam en teamnaam na eerste login; SlimeScore-naam blijft daarna vast, teamnaam/avatar/taal blijven bewerkbaar.
- Voorspellingen: 72 groepsduels met live berekende groepsstand per groep.
- Laatste 32: automatisch uit groepsstanden, nummers 1 en 2 plus beste acht nummers 3.
- Rondekeuzes: achtste finale, kwartfinale, halve finale, finalisten, kampioen.
- Bonus: topscorer, totaal goals, corners, snelste goal, 0-0's, rode kaarten, speelstad met meeste goals, penaltyseries, eigen goals, kaarten-team knock-out.
- Poules: maken, joinen met code, delen via WhatsApp, leden verwijderen, moderators, aankleding, prikbordberichten.
- Ranglijsten: publieke personenranglijst en subpoules op beste 4 spelers.
- PWA: wegklikbare installkaart voor beginscherm/installeren; app blijft ook normaal bruikbaar in de browser.
- Locale/SEO: `/` is Nederlands, `/en` Engels; NL/BE default NL, internationale fallback EN; sitemap/robots/hreflang aanwezig.
- Delen: WhatsApp/Facebook/Telegram/Signal/mail/native share. Signal gebruikt native share/clipboard fallback, niet `sgnl://`.
- Resultaten: `/api/sync-results` verwerkt uitslagen, stage-results en tournament-facts en rekent scores opnieuw door.

## Belangrijke technische vraagstukken

### Supabase Auth

Controleer in Supabase Dashboard:

- Site URL: productie-url `https://slimescore.com`.
- Redirect URLs: minimaal `https://slimescore.com/**`, Vercel preview indien gebruikt en lokale dev URL.
- Als mailtemplates zijn aangepast: gebruik `{{ .ConfirmationURL }}` of gebruik `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email` als `RedirectTo` al naar `/auth/confirm` wijst. Voeg niet nog een extra `/auth/confirm` toe.

Bron: https://supabase.com/docs/guides/auth/redirect-urls

### Puntentelling

Per wedstrijd is 12 punten het maximum. Exacte uitslag stapelt niet door met deelpunten. Niet-exacte voorspellingen kunnen deelpunten krijgen voor richting, doelsaldo en teamgoals.

Actuele waarden:

- Exacte uitslag: 12.
- Juiste winnaar/gelijkspel: 6.
- Juiste doelsaldo: 2.
- Per juist teamdoelpunt: 2.
- Laatste 32: 4 per land, automatisch berekend.
- Achtste finale: 8 per land.
- Kwartfinale: 14 per land.
- Halve finale: 30 per land.
- Finalist: 45 per land.
- Wereldkampioen: 90.
- Team met meeste goals: 20.
- Hoe ver komt Oranje: 20 exact, 8 als je er één ronde naast zit.
- Totaal goals: exact 36; elke afwijking kost 1 punt tot 0.
- Totaal gele kaarten: exact 36; elke afwijking kost 1 punt tot 0.
- Rode kaarten totaal: 10 alleen bij exact.
- Snelste goal: 12 exact, 6 binnen 2 minuten.
- Penaltyseries knock-out: 12 exact, 6 als je er 1 naast zit.

Server-side begrenzing is belangrijk: rondecheckboxes mogen niet onbeperkt punten geven.

### Performance

De publieke pagina's `/schema` en `/ranglijst` zijn met ISR cachebaar. Houd ze publiek server-rendered via service role in plaats van anon databasepolicies toe te voegen. De globale quick menu check gebruikt client-side sessieopslag voor zichtbaarheid van privélinks; echte toegangsbescherming blijft server-side.

### Resultatenprovider

Er is nog geen live football data provider gekoppeld. Kies in latere fase tussen API-Football, football-data.org of Sportmonks. Tot die tijd kan de beveiligde sync-route of een adminpaneel uitslagen verwerken.

### Schaalbaarheid

De huidige stack is geschikt voor een betaalbare MVP:

- Vercel voor Next.js.
- Supabase Postgres/Auth/RLS.
- Server actions voor eenvoudige mutaties.
- Service role alleen server-side.

Voor grotere schaal: ranking-recalculatie uit de request halen en naar queue/cron/background job verplaatsen.

## Agent- en release-instructies

- Behandel Nederlands als primaire producttaal. Iedere UI-copy wijziging moet in NL én EN worden bijgewerkt.
- Controleer bij i18n ook aria-labels, statusbalken, share-copy, formulieren, metadata, footer en ingelogde/deeproutes.
- Elke app-deploy met code/UI-wijziging moet `APP_VERSION` in `src/lib/constants.ts` verhogen en live footer `bèta/beta <versie>` tonen.
- Draai vóór merge/deploy minimaal `npm test`, `npm run lint` en `npm run build`.
- Browser smoke-test NL `/`, EN `/en`, relevante deeproute(s), mobiel/compacte layout, console errors en indien geraakt een ingelogde flow.
- Maak tijdelijke testaccounts/scripts schoon en log/commit nooit secrets.

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
- Lighthouse/Web Vitals meten op productie en waar nodig routes splitsen of query's cachen.
- Betere subpoule-home met activiteit en favorieten.
- Admin dashboard met auditlog.
- Accessibility QA en load test.

### Fase 4: Groei

- Bedrijfspoules.
- Premium subpoule-thema's of sponsorvrije bedrijfsvariant.
- Internationale SEO en Engelse copy verder aanscherpen op basis van gebruik.
- Native wrapper pas overwegen als PWA tractie heeft.
