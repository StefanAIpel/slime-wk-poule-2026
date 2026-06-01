# Onderzoek WK-poule apps en spelregels

Datum: 2026-06-01.

## Bronnen en patronen

- WKPooltjes.nl: gratis vrienden/bedrijven-pooltje, wedstrijden selecteren, spelers toevoegen/uitnodigen.
- Voetbalpoules.nl: nadruk op makkelijk winnaar/gelijk/verlies invullen, uitslagen bekijken, voorspellingen aanpassen en stand volgen.
- Intikkertje: richt zich op groepen, alle wedstrijden voorspellen en FAQ rondom groepsindeling.
- Poules.com: klassieke sportpoule-opzet met ranglijst en groepservaring.
- FIFA match schedule PDF van 10 april 2026: actuele groepen, deelnemers en wedstrijdschema voor WK 2026.

## Ideeen die nuttig zijn

- Houd de eerste actie klein: e-mail invullen, daarna pas bijnaam/teamnaam.
- Maak de voorspelflow batch-achtig: alles vooraf invullen en niet per wedstrijd terug hoeven komen.
- Voorspellingen blijven prive tot de deadline, zodat afkijken niet loont.
- De ranglijst moet in twee smaken zichtbaar zijn: personen en subpoules.
- Subpoules hebben sociale functies nodig: delen, beheer, korte berichten en een beetje eigen identiteit.
- Puntentelling moet exact score belonen, maar niet zo zwaar dat 1 mazzelwedstrijd alles bepaalt.
- Bonusvragen moeten leuk zijn en licht onderscheidend, maar beperkt blijven in totale waarde.

## Bewuste keuzes voor Slime WK Poule

- Scores invullen voor de 72 groepswedstrijden, plus rondekeuzes in plaats van een hele dynamische knock-out bracket.
- Een beperkte update na de groepsfase voor finalisten, kampioen en knock-outstatistieken.
- Subpoule-ranking op basis van de beste 4 spelers, zodat grotere groepen niet automatisch winnen.
- Ironische statistieken: 0-0's, rode kaarten, speelstad met meeste goals, penaltyseries, eigen goals en kaartenkoning-team.
- Moderators kunnen een poule aankleden met emoji/kleur/tekst en berichten op het prikbord plaatsen.

## API-opties voor uitslagen

- API-Football: meestal goede dekking, gratis/goedkope tiers maar WK-dekking vooraf controleren.
- football-data.org: eenvoudige voetbaldata-API, goedkoop voor standaardgebruik; WK 2026-dekking controleren zodra beschikbaar.
- Sportmonks: professioneel en betrouwbaar, vaak duurder maar geschikt als live/resultaatkwaliteit belangrijker wordt.
- Fallback: beveiligde interne sync-route accepteert handmatige of cron-updates met wedstrijd-id en eindstand.
