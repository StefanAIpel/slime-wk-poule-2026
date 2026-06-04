# Feedback — genummerd, prioriteit & status

Alle input (alle rondes) gebundeld. Status: ✅ klaar · 🟡 deels · ⬜ open.
Prioriteit: **P1** launch-blocker · **P2** belangrijk · **P3** later/nice-to-have.
"Opmerking" = mijn advies / tegengeluid waar iets complex is of nadelen heeft.

> Alles met ✅ staat **in de branch / PR #2**, nog niet op productie (zie #75).

## Landing / hero / branding
| # | Punt | Prio | Status | Opmerking |
|--|--|--|--|--|
| 1 | Slime ín de achtergrond (niet ernaast) | P2 | ✅ | WK-beker-slime in stadion gecomponeerd |
| 2 | Slime scherp/hoge kwaliteit (niet transparant) | P2 | ✅ | strikte cutout uit HQ-uploads |
| 3 | Titel kleiner | P3 | ✅ | |
| 4 | Geïntegreerde header + woordmerk | P2 | ✅ | CSS-woordmerk (geen PNG nodig) |
| 5 | App-icoon weg op aanmeldpagina, banner bovenaan | P2 | ✅ | |
| 6 | Tekst niet afgekapt / knoppen mobiel | P1 | ✅ | volle-breedte knoppen |
| 7 | Groene knoppen i.p.v. wit | P2 | ✅ | |
| 8 | "Wie wordt de baas" weg | P3 | ✅ | |
| 9 | "Gratis meedoen" = link | P2 | ✅ | |
| 10 | Eigen wordmark-PNG | P3 | ⬜ | CSS-woordmerk volstaat; PNG optioneel |

## Delen / menu / navigatie
| # | Punt | Prio | Status | Opmerking |
|--|--|--|--|--|
| 11 | Meer deelopties (FB/X/Telegram/mail/kopieer) | P2 | ✅ | IG via kopieer-link |
| 12 | Duo-banner soccer+volley + formaten | P3 | ✅ | 2 tegels; volley-URL bevestigen |
| 13 | Desktopmenu beter, WK-kleuren, minder fel | P2 | ✅ | |
| 14 | Regels-icoon (geen puntjes) | P2 | ✅ | |
| 15 | Labels "Poule invullen/wijzigen", "Subpoules" | P2 | ✅ | |
| 16 | Uitgelogd ook Subpoules/Schema bereikbaar | P2 | ✅ | nav toont nu altijd alles |
| 76 | Tablet (800-1023px) toonde géén menu | P1 | ✅ | headerbalk + onderbalk wisselen nu beide op 768px; "Schema"-label past |

## Wedstrijden / schema
| # | Punt | Prio | Status | Opmerking |
|--|--|--|--|--|
| 17 | 3-letter codes op mobiel | P2 | ✅ | |
| 18 | Stadionnaam naast plaats | P3 | ✅ | |
| 19 | Vlaggen overal | P2 | ✅ | 48/48 gecontroleerd |
| 20 | Groep+team op één regel + team gefilterd op groep | P2 | ✅ | |
| 21 | Tijdverschil (−6 u) achter de tijd | P3 | ✅ | |
| 22 | Rare regelafbrekingen desktop | P2 | ✅ | text-wrap pretty |
| 89 | Knock-outwedstrijden in speelschema (73–104), teams onbekend maar datum/tijd/stadion vast | P2 | ✅ | officieel FIFA-schema geseed via migratie; slot-labels "Winnaar Groep A" / "Winnaar W73"; datumfilter loopt nu t/m 19 juli (finale). **DB-migratie moet toegepast worden bij de deploy (zie opmerking onder).** |

## Voorspellen / scores
| # | Punt | Prio | Status | Opmerking |
|--|--|--|--|--|
| 23 | Groepsstand met nullen tonen | P2 | ✅ | |
| 24 | "Selecteer groep"-label | P3 | ✅ | |
| 25 | "0% ingevuld" weg op mobiel | P3 | ✅ | |
| 26 | "Nog X wedstrijden in te vullen" | P3 | ✅ | |
| 27 | Knock-out **cascade** (achtste→kwart, niets vergeten) | P2 | 🟡 | **Tegengeluid:** laatste-32 is al automatisch; nu een duidelijke *waarschuwing* bij onvolledige groep. Volledige dynamische cascade = forse client-rewrite van het bracket-formulier → ik zou dit P3 maken, ná launch |
| 28 | Bonusvragen herzien | P2 | ✅ | corners eruit (geen makkelijke databron) |
| 29 | Champion/penalty/Oranje wijzigbaar t/m 28 jun 21:00 | P2 | ✅ | |
| 30 | Wit-op-oranje duidelijker | P2 | ✅ | dieper oranje + schaduw (en daarna gewicht teruggebracht n.a.v. "ugly vette fonts") |

## Ranglijst / subpoules / account
| # | Punt | Prio | Status | Opmerking |
|--|--|--|--|--|
| 31 | Ranglijst compact (1 regel) | P2 | ✅ | |
| 32 | Mobiele tabs + zoek per tabel | P2 | ✅ | |
| 33 | Subpoules als tabs + klik-op-speler | P2 | ✅ | voorspellingen pas zichtbaar na deadline |
| 34 | "Vriendenpoules" → "Subpoules" | P3 | ✅ | |
| 35 | "Laatste resultaten-update" | P2 | ✅ | |
| 36 | Invite-link resetten | P3 | ✅ | |
| 37 | Account-pagina (naam/team/avatar/e-mail/verwijderen) | P1 | ✅ | |
| 38 | Avatar kiezen | P2 | ✅ | |
| 39 | Taalkeuze NL/EN | P3 | ⬜ | **Tegengeluid:** i18n = veel extra onderhoud; advies ná launch |
| 40 | Profiel min. 4 tekens + gate | P1 | ✅ | |
| 41 | Transparant scorelog + support-info | P2 | ✅ | op /account |
| 77 | Kind-account boardt zelf naam + team (geen vaste "Zoon") | P1 | ✅ | kind kiest bij 1e login naam/teamnaam; admin geeft alleen code |

## Regels / SEO / vertrouwen
| # | Punt | Prio | Status | Opmerking |
|--|--|--|--|--|
| 42 | Beknopte spelregels + uitklap + FAQ | P2 | ✅ | |
| 43 | Bonusgame weg | P3 | ✅ | |
| 44 | Scheidsrechter-slime | P3 | 🟡 | valt terug op coach; asset nog aanleveren |
| 45 | Stadion-hero + slime (geen app-icon) | P2 | ✅ | |
| 46 | JSON-LD (WebApp/FAQ/Organisatie-logo) | P2 | ✅ | Google-logootje |
| 47 | Keywords/metadata | P2 | ✅ | |
| 48 | Google-Ads-advies | P3 | ✅ | in api-en-techniek.md |
| 49 | Search Console aanmelden | P2 | ⬜ | extern (jij) |
| 50 | Consent-checkbox bij aanmelden | P1 | ✅ | |
| 51 | Cookies (alleen sessie, geen banner) | P1 | ✅ | beantwoord op /privacy |
| 52 | Contact/e-mail consequent | P2 | ✅ | |

## Techniek / launch / admin
| # | Punt | Prio | Status | Opmerking |
|--|--|--|--|--|
| 53 | Scoring-tests | P1 | ✅ | `npm test`, 12 tests |
| 54 | Sync-secret header-only | P1 | ✅ | |
| 55 | RLS/security review + fixes | P1 | ✅ | advisor schoon |
| 56 | Rate limiting | P2 | ✅ | DB-functie |
| 57 | Monitoring/logging | P2 | ✅ | structured; Sentry optioneel |
| 58 | Foutpagina's | P2 | ✅ | |
| 59 | Back-up/restore-procedure | P1 | ✅ | doc; Pro-tier advies |
| 60 | Auth-URLs / custom SMTP | P1 | ⬜ | extern (doc operatie-launch.md) |
| 61 | Admin-dashboard + auditlog | P2 | ✅ | Fase 2 |
| 62 | Result-correctie + herbereken | P2 | ✅ | |
| 78 | Games (Soccer/Volley) in eigen UI inbedden | P2 | ✅ | /games tabs+iframe; CSP frame-ancestors live op soccer./volley.slimescore.com, beide laden zonder console-errors |
| 63 | Staging-omgeving | P3 | ⬜ | extern |
| 64 | E2E-test | P3 | ⬜ | |
| 65 | DB-indexes-check | P3 | ⬜ | volume nu klein |
| 66 | Feature flags | P3 | ⬜ | |

## Devices / API / deploy
| # | Punt | Prio | Status | Opmerking |
|--|--|--|--|--|
| 67 | Cross-device deepdive | P2 | ✅ | 8 formaten, 0 overflow |
| 68 | Safari prefix + iOS safe-area | P2 | ✅ | |
| 69 | WhatsApp/in-app-browser scroll + nudge | P1 | ✅ | nudge + analyse (zie hieronder) |
| 70 | API-koppeling deepdive | P2 | ✅ | doc |
| 71 | Automatische uitslagen-API | P2 | ⬜ | actielijst (API-Football + cron) |
| 72 | Live scores in schema | P3 | ⬜ | hangt aan #71 |
| 73 | Push-notificaties wedstrijden | P3 | ⬜ | vereist VAPID+cron; **.ics-alternatief** aangeboden |
| 74 | Sanity 1000 users/dag | P2 | ✅ | doc; **e-mailplan** is het schaalpunt |
| 75 | **Branch → productie mergen** | **P1** | 🟡 | klaar (schone fast-forward); GitHub-MCP down → via git of jij in GitHub |

## Compliance / security / SEO-audit (juni 2026)
Drie deepdives op de live code (zie **`docs/audit-2026-06.md`** voor het volledige rapport).
Leidend principe: **minimaal voldoen, gebruiksgemak voorop** — geen cookiebanner, geen CAPTCHA-frictie.
| # | Punt | Prio | Status | Opmerking |
|--|--|--|--|--|
| 79 | Vlaggen self-hosted (`public/assets/flags/`) i.p.v. flagcdn | P2 | ✅ | geen IP/UA-lek naar derde + sneller; emoji-fallback blijft |
| 80 | Brede OG-banner 1200×630 + `summary_large_image` hersteld | P2 | ✅ | grote WhatsApp/X-preview i.p.v. klein vierkant icoon |
| 81 | Eigen `metadata` + self-canonical op /schema, /ranglijst, /regels (+ /voorwaarden, /games) | P2 | ✅ | beste SEO-pagina's erfden eerst de homepage-titel |
| 82 | Privacyverklaring AVG-compleet | P1 | ✅ | verantwoordelijke, grondslag, bewaartermijn, verwerkers (Supabase/Vercel/mail), kinderen (art. 8), rechten + klachtrecht AP, VS-doorgifte |
| 83 | Kind-code min. 8 tekens (bearer-secret, anti-brute-force) | P2 | ✅ | admin-form + server-validatie |
| 84 | Content-Security-Policy (report-only) | P2 | ✅ | defense-in-depth; afdwingen na observatieperiode (#86) |
| 85 | `sharp` expliciet in `package.json` | P3 | ✅ | banner-upload niet langer afhankelijk van transitieve dep |
| 86 | CSP van report-only → afdwingen | P3 | ⬜ | na console-observatie op productie |
| 87 | **Supabase Auth bot-bescherming aanzetten** (onzichtbare Turnstile/hCaptcha) | P2 | ⬜ | **extern (jij)** — sluit magic-link e-mailbombing + massa-fake-accounts, onzichtbaar voor echte gezinnen; daarna `captchaToken` meesturen in `signInWithOtp` |
| 88 | `slimescore.app` 301-redirect → `.com` | P3 | ⬜ | extern (DNS/Vercel); voorkomt duplicate content |

> #49 (Search Console aanmelden + sitemap indienen) blijft **open en is nu het belangrijkste externe SEO-actiepunt** gezien het korte WK-seizoen.

## WhatsApp / in-app-browser (deepdive)
De meeste mensen openen de link in de **in-app browser** van WhatsApp.
- **iOS WhatsApp** = SFSafariViewController (échte Safari-engine) → scrollen, sticky balken en safe-areas werken; we hebben `-webkit-backdrop-filter` + `env(safe-area-inset-*)` toegevoegd.
- **Android WhatsApp** = meestal een Chrome Custom Tab → idem prima.
- **Aandachtspunten:** (a) je kunt **niet als PWA installeren** vanuit een in-app browser; (b) de **magic-link** opent in je standaardbrowser, niet in de WhatsApp-tab → je raakt "ingelogd" in een andere tab.
- **Opgelost:** een wegklikbare **nudge** (#69) die WhatsApp/Instagram/etc. detecteert en licht naar Safari/Chrome duwt — dat lost zowel installeren als de magic-link-verwarring op.
