# UI-review WK-poule — werklijst

Bijgehouden tijdens de UI-review. Status: ✅ klaar · 🟡 mee bezig · ⬜ open.

## Batch 1 — gedaan ✅
- ✅ Deelopties: WhatsApp, Facebook, X, Telegram, e-mail, kopieer-link (Instagram via kopieer).
- ✅ Witte tekst op oranje/groen: dieper, extra vet, tekstschaduw.
- ✅ Desktopmenu: WK-blauwe actiestaat i.p.v. fel oranje + tricolor-accent; Regels-icoon altijd zichtbaar.
- ✅ Wedstrijden: 3-letter landcodes op mobiel + stad/venue (home + schema).
- ✅ Landing: "Wie wordt de baas?" herschreven, join-met-code duidelijk, dubbele voorwaarden-tekst weg.
- ✅ Profiel: naam + teamnaam min. 4 tekens.
- ✅ Voorspellen: "Selecteer groep"-label; voortgang-chip verborgen op mobiel.
- ✅ "Vriendenpoules" → "Subpoules".
- ✅ Tekstafbreking `pretty` i.p.v. `balance`.

## Landing / aanmelden ⬜
- ⬜ App-icoon weg van aanmeldpagina; banner/visual bovenaan plaatsen.
- ⬜ Wordmark-PNG (`public/assets/slimescore-wordmark.png`) in header zodra aangeleverd.
- ⬜ "Link gaat eerst naar aanmeldscherm" voor join-met-code — al via `#login`, controleren.
- ⬜ Webmail-deeplink na inloglink: al aanwezig (Gmail/Outlook/etc.), verifiëren.

## Account / profiel ⬜
- ⬜ Nieuwe `/account`-pagina (NL; taal NL/EN later):
  - naam + teamnaam wijzigen
  - avatar kiezen uit slime-set (`profiles.avatar_key` bestaat al)
  - e-mail tonen (privé)
  - account verwijderen met bevestiging
- ⬜ Avatar-component laten luisteren naar gekozen `avatar_key`.

## Menu / navigatie ⬜
- ⬜ Labels duidelijker: "Poule invullen/wijzigen (kan tot deadline)" en "Subpoules".
- ⬜ Menu beter ingebed op desktop (links/rechts overwegen) — nu floating pill bovenaan.

## Ranglijst / subpoules ⬜
- ⬜ Ranglijst compacter: 1 regel per speler.
- ⬜ Zoekveld per tabel; op mobiel aparte tab (wereld vs. subpoules).
- ⬜ Subpoules: 1 tab per subpoule i.p.v. onder elkaar.
- ⬜ Klik op speler in je subpoule → zie voorspellingen per wedstrijd + behaalde punten (e-mail blijft privé).
- ⬜ Tabel: behaalde punten per afgelopen wedstrijd, totaalstand, voorspelling komende wedstrijden.

## Voorspellen / scores ⬜
- ⬜ Groepsstand met nullen tonen i.p.v. "Vul scores in om de stand te zien".
- ⬜ Stadionnaam naast stad (mapping stad→stadion toevoegen).
- ⬜ Knock-out cascade: achtste pas zichtbaar/geldig als alle groepswedstrijden ingevuld; duidelijke waarschuwing bij ontbrekende invoer.
- ⬜ Cascade achtste(16) → kwart(8) → halve(4) → finale(2) → kampioen, zodat niets vergeten wordt en geen rare data.
- ⬜ Bonusvragen vervangen (akkoord gegeven):
  - weg: topscorer, 0-0's groepsfase, speelstad met meeste doelpunten
  - houden: team met meeste doelpunten
  - corners: alleen als API-data makkelijk vindbaar
  - wijzigbaar t/m **28 juni 21:00**: wereldkampioen, penaltyseries knock-out, "hoe ver komt Oranje"
- ⬜ Deadline-semantiek: wijzigbaar t/m 28 juni 21:00 (niet pas óp 28 juni).

## Regels & uitleg ⬜
- ⬜ Beknopte puntentelling + uitklap met details.
- ⬜ FAQ-accordeon toevoegen.
- ⬜ Bonusgame-knop weg.
- ⬜ Layout: poule-/uitslagblokken links van punten en regels.
- ⬜ Slime i.p.v. app-icoon (trainer-slime; scheidsrechter-slime volgt van Stefan).

## SEO / GEO / vindbaarheid ⬜
- ⬜ JSON-LD structured data (Organization / WebApplication / FAQ).
- ⬜ Keywords + metadata aanscherpen, OG-beelden checken.
- ⬜ Kwaliteitsdocumenten: privacy + voorwaarden bestaan; aanvullen waar nodig.

## Banners / beeld ⬜
- ⬜ Duo-banner Slime Soccer + Volley als twee tegels (mobiel gestapeld).
  - Aan te leveren: 2× vierkant 800×800 (per game); optioneel 1× 1600×630 voor social.
- ⬜ Hero-mascotte (IKEA-slime) "zweeft" en oogt lage kwaliteit → liever vooraf gecomponeerde afbeelding (slime al in beeld), of beter verankeren + hogere resolutie.

## Data / API (resultaten & stats) ⬜
- ⬜ API-koppeling voor uitslagen (sync-results bestaat al — bron + frequentie vastleggen).
- ⬜ Stats voor bonusvragen: team met meeste goals, penaltyseries KO, corners (indien beschikbaar).
- ⬜ Live status / scores tonen bij afgelopen wedstrijden.
