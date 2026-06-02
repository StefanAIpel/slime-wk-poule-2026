# Vervolgplan & analyse: Slime Score → App Store & Play Store

Datum: 2026-06-02. Bouwt voort op `README.md`, `docs/AGENT_BRIEF.md` en
`docs/onderzoek-wk-poule.md`. Status na PR #1 (lichte WK 2026-stijl, share-functies,
domein `slimescore.com`).

---

## 1. Kernadvies (TL;DR)

1. **Voor WK 2026 zelf is de PWA de winnende zet, niet een native store-app.** Vandaag
   is 2-6, de invuldeadline is 11-6 21:00. App Store-review (1–3 dagen, soms langer
   bij eerste inzending) en vooral de **Play Store-testeis voor nieuwe persoonlijke
   developer-accounts (20 testers, 14 dagen gesloten test)** maken een store-lancering
   vóór de aanmeldpiek onrealistisch. De PWA is direct installeerbaar, deelbaar en
   heeft geen reviewdrempel.
2. **Beslis eerst de strategische vraag:** is Slime Score een *eenmalige WK-app* of een
   *terugkerend voorspel-platform* (EK 2028, CL, Eredivisie, bedrijfspoules)? Native
   store-investering verdient zich alleen terug bij het tweede. Mijn advies: positioneer
   als platform — de voorspel-engine is al toernooi-generiek.
3. **Realistische store-route:** Play Store via **TWA** (wrapt de bestaande PWA, snel
   en goedkoop) en App Store via een **Capacitor-shell met échte native features**
   (push, native share, account-verwijdering) — of, als platform-traction er is, een
   **Expo/React Native client** als strategische investering.
4. **Eerst de store-blokkers wegwerken** (privacy/voorwaarden, account-verwijderen in
   app, deep links voor magic-link, push) — die zijn óók los van native waardevol.
5. **Gebruik dit WK als groeimotor + bewijslast:** meet installs, retentie en
   deel-conversie. Die cijfers rechtvaardigen (of niet) de native bouw voor het
   volgende toernooi.

---

## 2. Waar staan we nu

### Sterk (conform brief)
- Snelle, datalichte onboarding: magic-link + bijnaam + teamnaam.
- Slimme, rustige opzet: 72 groepsduels → automatische groepsstanden → automatische
  laatste 32 → rondekeuzes (geen 104-wedstrijden-gedoe).
- Subpoules met code/WhatsApp, beheerder, moderators, prikbord.
- Dubbele ranglijst (personen + subpoules op beste 4).
- PWA, ISR-caching op publieke pagina's, server-side service-role.
- **Nieuw in PR #1:** licht/professioneel WK 2026-thema, trust-badges, share-knoppen
  (Web Share API + WhatsApp + kopieer), domein `slimescore.com` centraal in metadata,
  manifest en deel-links; Slime-game-knop → `soccer.slimescore.com`.

### Open uit de brief (nog niet af)
| Item | Brief-fase | Status | Ook store-blokker? |
|---|---|---|---|
| Privacy- / voorwaarden-pagina | 2 | Ontbreekt | **Ja** (beide stores) |
| Account verwijderen in-app | — | Ontbreekt | **Ja** (Apple 5.1.1(v)) |
| Magic-link deep links (app heropenen) | 3 | Web-only | **Ja** voor native |
| Push/e-mail reminders | 3 | Niet gebouwd | Nee, maar grote kans |
| Live resultatenprovider | 2 | Alleen handmatige sync-API | Nee |
| Admin-invoer uitslagen | 1 | Alleen `/api/sync-results` | Nee |
| Definitieve mailafzender (Resend) + Supabase SMTP | 2 | Te bevestigen | Nee |
| Monitoring / error logging | 2 | Ontbreekt | Nee |
| Scorevoorbeelden in regels | 1 | Ontbreekt | Nee |

---

## 3. Tijdslijn-realiteit voor WK 2026 (kritisch)

```
2-6 (nu) ───► 11-6 21:00 aanmeldpiek ───► groepsfase ───► 28-6 update ───► knock-out ───► finale
   PWA live & deelbaar          ▲                                   ▲
                                 │                                   │
              Native store NIET op tijd            Eventueel TWA (Android) mid-toernooi
```

- **Play Store:** nieuwe persoonlijke developer-accounts moeten een gesloten test met
  ≥20 testers gedurende ≥14 dagen draaien vóór productie. Dat haalt 11-6 niet. Een
  *organisatie*-account kent deze eis niet — als er al een geverifieerd organisatie-
  account is, kan een TWA sneller live.
- **App Store:** review is meestal 1–3 dagen, maar eerste inzendingen + magic-link/
  privacy-discussies kunnen vertragen. Niet betrouwbaar vóór de piek.
- **Conclusie:** zet alle marketing- en deel-energie op de **PWA + "zet op beginscherm"**
  voor dit WK. Lever native als *fast-follow* (knock-outfase) of, beter, als nette
  bouw voor het **volgende** toernooi.

---

## 4. Strategische vraag: één toernooi of platform?

Dit is de belangrijkste keuze en bepaalt of native zin heeft.

- **Eenmalige WK-app:** seizoensgebonden, lage herhaal-engagement, native ROI laag.
  Blijf bij PWA + TWA.
- **Terugkerend voorspel-platform:** dezelfde engine voor EK 2028, Champions League,
  Eredivisie, Olympische voetbaltoernooien en **bedrijfspoules** (Fase 4 brief). Dan
  is een native app met push-retentie en een vaste gebruikersbasis logisch.

**Advies:** kies platform. De datamodellen (teams, matches, stages, scoring) zijn al
toernooi-onafhankelijk; alleen de seed-data en wat copy zijn WK-specifiek. Maak
"toernooi" expliciet een eerste-klas concept zodat een volgend toernooi vooral
data-invoer is, geen herbouw.

---

## 5. Route naar de stores (technische opties)

De stack is **Next.js App Router (server components, server actions, route handlers,
ISR) + Supabase + Vercel**. Een volledige `output: export` (statische export) kan
niet zonder forse herbouw, want we leunen op server actions en de server-side
service-role (scoring, sync, admin, publieke caching). Dat sluit "gewoon Capacitor om
een statische build" uit en stuurt de keuze.

### Optie A — PWA (nu, kosteloos)
Installeerbaar via "zet op beginscherm", web push op Android en iOS ≥16.4 (mits
toegevoegd aan beginscherm). **Doen voor dit WK.**

### Optie B — Play Store via TWA (Trusted Web Activity)
Wrap de PWA met Bubblewrap/PWABuilder. Goedkoop, snel, door Google geaccepteerd.
Vereist `assetlinks.json` (Digital Asset Links) op `slimescore.com`. Alleen Android.
Apple accepteert een kale webview-wrapper niet (richtlijn 4.2 "minimal functionality").

### Optie C — App Store + Play Store via Capacitor-shell
Capacitor laadt de **gehoste** app (remote URL) in een native webview en voegt échte
native plugins toe: push, native share sheet, status bar, haptics, in-app account-
verwijdering. Met genoeg native meerwaarde haalbaar bij Apple. Aandachtspunten:
- Apple kan "het is een website" tegenwerpen → leun op native push + share + offline-
  scherm + account-flow om de "minimal functionality"-toets te halen.
- Magic-link moet via **Universal Links / App Links** terug de app in (niet Safari).
- Eén web-codebase blijft leidend; minste duplicatie.

### Optie D — Expo / React Native client (strategische investering)
Aparte native UI die Supabase direct gebruikt (uitstekende RN-support) plus de
bestaande Vercel-API voor server-only werk (sync/scoring/admin). Beste native UX en
store-acceptatie, push en deep links zijn first-class. Kosten: tweede codebase
(UI opnieuw bouwen). Verantwoord zodra platform-traction bewezen is.

### Vergelijking
| Criterium | A: PWA | B: TWA | C: Capacitor | D: Expo/RN |
|---|---|---|---|---|
| Tijd tot live | direct | dagen | weken | maanden |
| iOS store | nee | nee | ja (mits native meerwaarde) | ja |
| Android store | nee | ja | ja | ja |
| Herbruik web-code | 100% | 100% | ~95% | UI opnieuw |
| Native push betrouwbaar | beperkt | redelijk | ja | ja |
| Risico Apple-afwijzing | n.v.t. | n.v.t. | midden | laag |
| Kosten/onderhoud | laag | laag | midden | hoog |

**Aanbevolen pad:** A nu → B (TWA) zodra organisatie-account klaar is → C (Capacitor)
voor iOS-aanwezigheid → D alleen bij bewezen platform-traction.

---

## 6. Store-vereisten checklist (de blokkers)

Bouw dit hoe dan ook; het is ook los van native waardevol.

- [ ] **Privacybeleid + voorwaarden** als publieke pagina's (`/privacy`, `/voorwaarden`)
      en privacy policy-URL klaar voor beide stores. Sluit aan bij "geen reclame,
      data privé".
- [ ] **Datatransparantie**: Apple Privacy Nutrition Labels + Google Data Safety —
      eerlijk invullen (e-mail voor login, geen tracking/ads).
- [ ] **Account verwijderen in-app**: server action die profiel, voorspellingen,
      poule-lidmaatschappen en auth-user verwijdert (Supabase admin `deleteUser`).
      Apple-verplicht.
- [ ] **Deep links**: Universal Links (`apple-app-site-association`) + Android App Links
      (`assetlinks.json`) op `slimescore.com`, en Supabase redirect-URL's bijwerken zodat
      de magic-link de app heropent.
- [ ] **Login die Apple accepteert**: e-mail magic-link is first-party en mag; de
      "Sign in with Apple verplicht"-regel geldt alleen bij third-party social logins.
      Wel goed testen dat de magic-link in de webview/app terugkomt.
- [ ] **Geen verborgen kosten/ads**: maakt review simpel. Premium/IAP pas later (dan
      gelden Apple's IAP-regels: 30%/15%).
- [ ] **ASO-assets**: app-naam, ondertitel, keywords, en screenshots — de bestaande
      mascotte-/mockup-artwork is hiervoor goud.

---

## 7. Productkansen (groei zonder reclame)

### Activatie & conversie
- **Uitnodigingslinks i.p.v. alleen codes** (Fase 3): `slimescore.com/join/<code>` die na
  login direct in de poule plaatst. Halveert frictie bij delen.
- **Deel-momenten verzilveren**: na opslaan voorspellingen → "deel je scorekaart",
  na aanmaken poule → "nodig je groep uit". Share-componenten staan al klaar (PR #1).

### Retentie (de zwakke plek van een seizoensapp)
- **Push/e-mail reminders**: "nog 24u tot de deadline", "vul je voorspellingen in",
  "uitslag binnen — bekijk de stand", "28-6 update-window open". Grootste hefboom voor
  herhaalbezoek; reden #1 om native te overwegen.
- **Subpoule-activiteit & chat** (zoals de mockup-tabs Stand/Wedstrijden/Activiteit/
  Chat): reacties op het prikbord, dagelijkse stand-update, "klimmer/daler" badges.

### Geloofwaardigheid
- **Live resultatenprovider** kiezen (API-Football / football-data.org / Sportmonks) +
  cron, zodat uitslagen en de ranglijst vanzelf bijwerken i.p.v. handmatige sync.
- **Live wedstrijdstatus** op schema/ranglijst (gepland/​bezig/​afgelopen) met accent.

### Monetisatie zonder reclame (sluit aan op "geen reclame")
- **Bedrijfspoules / white-label** (B2B): bedrijven, kroegen, sportclubs betalen voor
  een eigen poule met logo. Hoogste marge, past bij "geen reclame voor de speler".
- **Premium subpoule-thema's** (cosmetisch: extra Slime-skins, kleuren, badges).
- **Vrijwillige donatie / "trakteer een biertje"**.
- Houd de kern altijd 100% gratis en reclamevrij — dat is je merkbelofte.

### Platform-uitbreiding
- **Toernooi als eerste-klas concept** → EK 2028, CL, Eredivisie met dezelfde engine.
- **Meertaligheid** zodra internationale ambitie ontstaat (engine is al generiek).

---

## 8. Gefaseerde roadmap

### Sprint 0 — Nu t/m 11-6 (alles op de PWA-piek)
- Auth end-to-end testen met echte mailtemplate + Supabase SMTP/Resend.
- Voorspel-flow op mobiel afmaken: **voortgangsbalk + duidelijke stappen op de pagina
  zelf** (nu alleen op home), sticky opslaan ook op desktop, live tellers bij ronde-
  keuzes (zie mockup).
- In-page tabs + avatars op subpoule/ranglijst (mockup-stijl) — vervolg op PR #1.
- Scorevoorbeeld in `/regels`.
- Uitnodigingslinks (`/join/<code>`).
- `/privacy` + `/voorwaarden` (ook nodig voor stores).
- Deel-CTA's na opslaan/aanmaken.

### Sprint 1 — Productie betrouwbaar (parallel/direct erna)
- Resultatenprovider kiezen + cron-sync; admin-invoerscherm als fallback.
- Monitoring + error logging (bijv. Sentry).
- Ranking-recalculatie uit de request naar background job (schaalbaarheid).
- Push-fundament: web push (Android/iOS-PWA) + reminder-scheduler.

### Sprint 2 — Store-gereed maken
- Account-verwijderen in-app.
- Deep links: Universal Links + App Links + Supabase redirects.
- Privacy labels / Data Safety invullen.
- **TWA** bouwen en in Play Store-organisatie-account zetten.

### Sprint 3 — iOS & native diepte
- **Capacitor-shell** met native push, share, account-flow → App Store.
- ASO-assets (screenshots uit de mockups), store-listing NL.
- A/B op onboarding-copy, install-prompt timing.

### Sprint 4 — Groei & platform (post-WK, datagedreven)
- Bedrijfspoules / white-label.
- Premium cosmetische thema's.
- Toernooi-abstractie afmaken voor het volgende toernooi.
- Overweeg **Expo/React Native** client als de install-/retentiecijfers het dragen.

---

## 9. Meetlat: wanneer is native gerechtvaardigd?

Verzamel tijdens WK 2026 op de PWA:
- Aantal installs ("zet op beginscherm") en aandeel t.o.v. bezoekers.
- D1/D7-retentie en terugkeer rond wedstrijddagen.
- Deel-conversie (poule-uitnodiging → nieuwe deelnemer).
- Aandeel iOS vs Android (bepaalt store-prioriteit).

**Drempel:** bij duidelijke herhaal-engagement en een platform-besluit (sectie 4) →
investeer in Capacitor/RN. Anders blijft PWA + TWA de verstandige, goedkope keuze.

---

## 10. Eerlijke risico's

- **Seizoenspiek mislopen:** native te laat voor dít WK — daarom PWA-first.
- **Apple-afwijzing** bij te "dunne" webview-wrapper — ondervang met echte native
  features.
- **Magic-link in webview/app** is het grootste technische risico voor native; eerst
  deep links waterdicht maken.
- **Resultaten-kwaliteit:** zonder betrouwbare provider lijdt vertrouwen — prioriteer
  de sync.
- **Onderhoudslast** van een tweede (native) codebase alleen aangaan met bewezen
  traction.
