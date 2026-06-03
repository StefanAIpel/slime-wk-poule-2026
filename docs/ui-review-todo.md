# UI-review WK-poule — werklijst

Bijgehouden tijdens de UI-review. Status: ✅ klaar · 🟡 deels · ⬜ open.

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
