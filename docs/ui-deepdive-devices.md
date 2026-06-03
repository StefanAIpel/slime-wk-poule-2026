# UI-deepdive: devices, browsers & leesbaarheid

Getest met Chromium op geëmuleerde device-viewports + DPR. Native Safari (WebKit)
en Firefox-engines waren in deze omgeving niet installeerbaar — die zijn dus
geredeneerd vanuit bekende verschillen en hieronder als fixes verwerkt.

## Geteste schermen (geen horizontale overflow op één ervan)
| Device | Viewport | Resultaat |
| --- | --- | --- |
| iPhone SE | 375×667 | ✅ leesbaar, knoppen volle breedte, slime op gras |
| iPhone 14 | 390×844 | ✅ |
| iPhone 14 Pro Max | 430×932 | ✅ |
| Pixel 7 (Android) | 412×915 @2.6 | ✅ |
| iPad mini | 768×1024 | ✅ (mobiele tab-layout < 1024) |
| iPad Pro | 1024×1366 | ✅ (ranglijst naast elkaar vanaf 1024) |
| Desktop | 1280 / 1920 | ✅ |

Automatische overflow-check (`scrollWidth > innerWidth`) gaf **0 px** op alle 24 combinaties.

## Doorgevoerde cross-browser fixes
- **Safari/iOS — `backdrop-filter`:** overal `-webkit-backdrop-filter` toegevoegd
  (onderbalk, statusbalk-glas, snelmenu, groep-spring). Zonder prefix bleef de
  blur in Safari weg.
- **iOS notch / home-indicator (`env(safe-area-inset-*)`):**
  - Onderbalk: `bottom: max(12px, env(safe-area-inset-bottom))` — botst niet meer met de home-indicator.
  - `page-shell` onderpadding houdt rekening met de inset.
  - Statusbalk bovenpadding houdt rekening met de notch in standalone-PWA-modus.
- **Tap-targets:** knoppen/links zijn ≥48 px hoog (Apple/Google-richtlijn) — touch-vriendelijk.
- **Lettertype:** Plus Jakarta Sans wordt self-hosted via `next/font` geladen →
  identiek op iOS/Android/Mac/Windows, geen FOUT/flits.

## Leesbaarheid & schaling
- Mobiele hero-koptekst verkleind (1.7 rem, strakkere regelhoogte) → minder rare
  afbrekingen, nog ruim leesbaar.
- Lichaamstekst ≥0.875 rem; contrast wit-op-donker en donker-op-wit voldoet.
- **Browser-zoom / "grotere tekst":** layout is rem- en flex/grid-gebaseerd →
  schaalt evenredig mee, geen overflow tot ~150%. (iOS Dynamic Type beïnvloedt
  web niet, dus geen risico daar.)
- `text-wrap: pretty` wordt in oudere Safari/Firefox genegeerd → valt netjes terug
  op normale terugloop.

## Aandachtspunten (klein, geen blocker)
- **Native Safari/Firefox** niet in deze omgeving te testen → graag één keer handmatig
  controleren op een echte iPhone (Safari) en Mac (Safari) na deploy.
- iPad 768–1023 px gebruikt de mobiele tab-ranglijst; naast-elkaar pas vanaf 1024.
  Bewuste keuze; kan desgewenst naar 900 px verlaagd worden.
- Donkere modus: nog niet ondersteund (staat op de nice-to-have-lijst).
