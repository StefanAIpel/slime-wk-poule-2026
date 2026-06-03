# API, data & techniek — deepdive

Beantwoordt de vragen over API-koppeling, puntentelling, push, vindbaarheid,
cookies en dataverkeer. Wat nog niet gebouwd is, staat als actiepunt in
`docs/ui-review-todo.md`.

## 1. Uitslagen-API (automatische koppeling)

**Nu:** uitslagen, ronde-uitkomsten en bonusfeiten worden handmatig naar
`POST /api/sync-results` gestuurd (auth via `x-result-sync-secret`); daarna
rekent de route alle ranglijsten opnieuw door.

**Aanbevolen bron:** een voetbal-data-API met WK 2026-dekking:
- **API-Football** (api-sports.io) — volledige dekking, fixtures + statistieken, betaalbaar.
- **Football-Data.org** — gratis tier, beperkter (geen diepe stats).
- **SportMonks** — uitgebreid, duurder.

**Koppelplan:**
1. Voeg kolom `external_id` toe aan `matches` (mapping naar de fixture-id van de API).
2. Cron (Vercel Cron of GitHub Action) draait elke ~5 min tijdens speeldagen:
   fetch afgeronde fixtures → vertaal naar `results[]` → `POST /api/sync-results`.
3. Stats voor de bonusvragen komen uit de statistics-endpoints:
   - *team met meeste goals* = som goals per team over het toernooi.
   - *penaltyseries KO* / *eigen goals KO* / *kaarten* = aggregatie over knock-outfixtures.
   - *hoe ver komt Oranje* = hoogste ronde die NED bereikt.

**Let op (schaal):** `recalculateScores()` herberekent nu **alle** spelers per sync.
Bij 1000 spelers is dat prima (~80k voorspel-rijen). Boven ~10k spelers: maak het
incrementeel (alleen gewijzigde wedstrijden/spelers).

## 2. Puntentelling (samenvatting)

Bron: `src/lib/scoring.ts`.
- **Wedstrijd:** exact = 12; anders juiste uitslag 6 + doelsaldo 2 + per juist teamdoelpunt 2 (max 12).
- **Knock-outrondes:** laatste 32 = 4, achtste = 8, kwart = 14, halve = 30, finalist = 45, kampioen = 90 (per juist land).
- **Bonus:** team-meeste-goals 20, hoe-ver-Oranje 20 (dichtbij 8), totaal goals 20/12/6, overige stats 12/6.
- **Gelijke stand:** meeste exacte uitslagen → meeste juiste resultaten → bonuspunten → vroegste inzending.

## 3. "WK-app-functionaliteit" (m.n. schema)

Hangt allemaal aan dezelfde `matches`-data zodra de API live is:
- Live score + status in het schema, met auto-refresh.
- Echte groepsstanden (nu: standen uit jouw voorspellingen).
- Knock-outschema/bracket.
- Tijdverschil per speelstad t.o.v. NL staat er al (bijv. −6 u).

## 4. Push-notificaties voor wedstrijden

**Kan**, maar vereist wat infrastructuur (daarom nu actiepunt, niet half gebouwd):
- VAPID-sleutels, tabel `push_subscriptions`, een `push`-handler in `public/sw.js`,
  en een cron die stuurt: "wedstrijd begint over 1 uur" en "uitslag binnen — je
  scoorde X punten".
- iOS: web-push werkt alleen voor de **geïnstalleerde** PWA (iOS 16.4+).
- **Direct alternatief zonder backend:** een "Zet in agenda"-knop per wedstrijd
  (.ics-download) — herinnering via de telefoonagenda. Dit kan ik snel bouwen.

## 5. Cookies

Alleen **strikt noodzakelijke** cookies: de Supabase auth-sessie (`sb-*`). Geen
tracking-, analytics- of marketingcookies. Onder AVG/ePrivacy is hiervoor **geen
cookiebanner** nodig. Aanbeveling: noem de sessiecookie expliciet in het privacybeleid.

## 6. Vindbaarheid (SEO/GEO) + Google Ads

**Al gedaan:** sitemap, robots, per-pagina titels/omschrijvingen, OG-image,
FAQ-schema (regels), en nu Organisatie-logo in JSON-LD (Google-logootje).

**Vergroten:**
- Meld de site aan bij **Google Search Console** + **Bing Webmaster** en dien de sitemap in.
- Korte SEO-content: een pagina "Hoe werkt een WK-poule 2026?" voor zoekwoorden.
- Backlinks: deel op socials/voetbalfora; vraag bevriende sites om een link.
- Echte favicon/maskable icon staat al (`icon-192/512`).

**Google Ads (beperkt budget):**
- Zoekcampagne NL, zoekwoorden: "WK poule 2026", "gratis voetbalpoule", "WK voorspellen".
- Phrase/exact match, dagbudget €5–10, landingspagina = home.
- Conversie = aanmelding (meet via een eenvoudige event op de inloglink).
- Pre-toernooi zijn clicks goedkoop; schaal op richting de aftrap (11 juni).

## 7. Dataverkeer-sanity bij 1000 gebruikers/dag

- **Egress:** eerste bezoek ~1–1.5 MB (stadion-webp + font + JS), herhaalbezoek
  gecached ~50–100 KB. Grof: 1000×1.2 MB + 2000×0.1 MB ≈ **~1.4 GB/dag** ≈ ~42 GB/mnd.
  Vercel-CDN dekt dit ruim (free 100 GB/mnd).
- **Database:** `/schema` (ISR 1u) en `/ranglijst` (ISR 30s) cachen, dus DB-load is
  begrensd ongeacht het aantal bezoekers. Schrijfacties (voorspellingen) zijn klein.
- **Rijen:** 1000 spelers × ~72 voorspellingen ≈ 72k rijen — verwaarloosbaar voor Postgres.
- **⚠️ Inlogmails:** 1000 aanmeldingen/dag = 1000 magic-link-mails. Resend gratis = 3000/mnd
  → bij dit volume een **betaald e-mailplan** (Resend/SMTP) nodig, en let op Supabase
  auth-rate-limits. Dit is het belangrijkste schaalpunt om vooraf te regelen.
