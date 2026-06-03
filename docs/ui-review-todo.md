# UI-review WK-poule — werklijst

Bijgehouden tijdens de UI-review. Status: ✅ klaar · 🟡 deels · ⬜ open.

## Ronde 3 (deze sessie)

**✅ Gedaan**
- Groene (Mexico-)knoppen i.p.v. wit; mobiele hero: slime in de hoek, knoppen volle breedte (tekst botst niet meer).
- Aanmelden: expliciete akkoord-checkbox (voorwaarden + privacy) verplicht.
- Statusbalk: "Gratis meedoen" is nu een duidelijke knop-link met pijl.
- Schema: groep+team op één regel, team gefilterd op gekozen groep, tijdverschil met NL achter de tijd (bijv. −6 u).
- Ranglijst: zoekveld **per tabel** (wereld + subpoules apart).
- SEO: Organisatie-logo in JSON-LD (Google-logootje).
- Lichtere fonts, stadion-hero met slime op het veld, gecentreerde footer (uit ronde 2, geverifieerd met screenshots).
- Deepdive-document `docs/api-en-techniek.md` (API, puntentelling, push, SEO/ads, cookies, dataverkeer).
- Cookies: alleen sessiecookie, geen banner nodig (staat al op /privacy).

**🟡 / ⬜ Actielijst (open)**
- **Push-notificaties** voor wedstrijden: vereist VAPID + cron + `push_subscriptions` (plan in api-en-techniek.md). Alternatief: "Zet in agenda" (.ics) — snel te bouwen.
- **Uitslagen-API** automatiseren (API-Football) + `external_id` op matches + cron.
- **Live scores / WK-app-functies** in schema zodra API live is.
- **Scheidsrechter-slime** asset (`slime-08-scheidsrechter.png`) — valt nu terug op coach.
- **Knock-out cascade** (kwart alleen uit achtste-keuzes) — nu volledigheidswaarschuwing.
- **Schaalpunt:** betaald e-mailplan (Resend/SMTP) vóór ~1000 aanmeldingen/dag.
- Sommige eerdere fixes (Regels-icoon, stadion-hero's, ranglijst-tabs, landing-CTA's) staan al in de code maar waren op de getoonde productie-screenshots nog niet live — **deploy van deze branch nodig**.

---


## Gedaan ✅
- ✅ Deelopties: WhatsApp, Facebook, X, Telegram, e-mail, kopieer-link (Instagram via kopieer).
- ✅ Witte tekst op oranje/groen: dieper, extra vet, tekstschaduw.
- ✅ Desktopmenu: WK-blauwe actiestaat i.p.v. fel oranje + tricolor-accent; Regels-icoon altijd zichtbaar.
- ✅ Menu-labels: "Poule invullen / wijzigen", "Subpoules", "Mijn account".
- ✅ Wedstrijden: 3-letter landcodes op mobiel + stad + stadionnaam (home, schema, voorspel-kaart).
- ✅ Landing: app-icoon weg, banner bovenaan, copy herschreven, join-met-code duidelijk, dubbele voorwaarden-tekst weg.
- ✅ Profiel: naam + teamnaam min. 4 tekens; pagina's vereisen complete scorekaart.
- ✅ Account-pagina `/account`: naam/team/avatar wijzigen, e-mail tonen, account verwijderen (cascade + auth-delete).
- ✅ Avatarkeuze (eigen slime) + tonen in ranglijst/poules.
- ✅ "Selecteer groep"-label; voortgang-chip verborgen op mobiel.
- ✅ "Vriendenpoules" → "Subpoules".
- ✅ Ranglijst compacter (1 regel) + tabs op mobiel.
- ✅ Subpoules als tabs + klik-op-speler (punten per afgelopen wedstrijd + voorspellingen; e-mail privé).
- ✅ Groepsstand met nullen i.p.v. "vul scores in".
- ✅ Bonusvragen herzien (weg: topscorer/0-0/speelstad/corners; nieuw: team-meeste-goals + hoe-ver-Oranje) + wijzigbaar t/m 28 juni 21:00.
- ✅ Regels: beknopt + uitklap + FAQ; bonusgame weg; coach-slime; layout herschikt.
- ✅ SEO: WebApplication + FAQPage JSON-LD, keywords.
- ✅ Duo-gamebanner (soccer + volley).
- ✅ Knock-out: waarschuwing bij onvolledige groepsinvoer.
- ✅ README/roadmap met game-omschrijving + database-koppeling.

## Deels / open 🟡⬜
- 🟡 Knock-out **cascade** (kwart alleen uit achtste-keuzes, enz.): nu alleen een
  volledigheidswaarschuwing. Volledige dynamische cascade = client-rewrite van het bracket-formulier.
- 🟡 Menu desktop "links/rechts" sidebar: nu nette tricolor-pill bovenaan i.p.v. zijbalk.
- ⬜ Taalkeuze NL/EN (account) — bewust later.
- ⬜ Wordmark-PNG in header zodra aangeleverd (`public/assets/slimescore-wordmark.png`).
- ⬜ Hero-mascotte (IKEA-slime) vooraf gecomponeerd / hogere resolutie i.p.v. zwevende PNG.
- ⬜ Scheidsrechter-slime (Stefan levert) voor regels/uitleg.

## Assets aan te leveren (Stefan)
- Duo-banner-beelden (2× 800×800) — voorlopig gebruiken we de bestaande banners.
- Wordmark-PNG.
- Eventueel betere hero-mascotte met slime al in beeld.

## Data / API ⬜
- ⬜ Databron uitslagen + stats vastleggen (nu handmatig via `/api/sync-results`).
- ⬜ Stats voor bonusvragen automatiseren (team-meeste-goals, penaltyseries, Oranje-stage).
- ⬜ `SLIME_VOLLEY_URL` bevestigen (nu aanname `https://volley.slimescore.com`).
