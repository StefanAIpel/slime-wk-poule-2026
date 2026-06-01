# Onderzoek WK-poule apps en spelregels

Datum: 2026-06-01.

## Bronnen

- FIFA meldt voor WK 2026 een toernooi met 48 teams, 104 wedstrijden en 16 speelsteden:
  https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums
- Intikkertje beschrijft een klassieke poule met 104 wedstrijdvoorspellingen, maximaal 10 punten per wedstrijd en 510 bonuspunten op 1.550 totaal:
  https://intikkertje.nl/spelregels/
- Intikkertje positioneert de productwaarde duidelijk rond eigen poules, algemene ranglijst, automatisch punten tellen en aanpassen tot deadline:
  https://intikkertje.nl/wk-poule/
- Supabase Auth vereist dat `redirectTo` in de toegestane redirect-URL's staat; de Site URL is de fallback en custom mailtemplates moeten `RedirectTo` goed gebruiken:
  https://supabase.com/docs/guides/auth/redirect-urls

## Patronen in leidende poule-apps

- Houd de eerste actie klein: e-mail invullen, daarna pas bijnaam/teamnaam.
- Maak de voorspelflow batch-achtig: alles vooraf invullen en niet per wedstrijd terug hoeven komen.
- Voorspellingen blijven prive tot de deadline, zodat afkijken niet loont.
- De ranglijst moet in twee smaken zichtbaar zijn: personen en subpoules.
- Subpoules hebben sociale functies nodig: delen, beheer, korte berichten en een beetje eigen identiteit.
- Puntentelling moet exacte scores belonen, maar niet zo zwaar dat 1 mazzelwedstrijd alles bepaalt.
- Bonusvragen moeten leuk zijn en licht onderscheidend, maar beperkt blijven in totale waarde.
- Een volledig 104-wedstrijdenmodel is compleet, maar vraagt veel tussentijds invullen. Voor Slime Score is gemak belangrijker.

## Bewuste keuzes voor Slime WK Poule

- Scores invullen voor de 72 groepswedstrijden.
- De groepsstanden worden automatisch uit de ingevulde scores berekend.
- De laatste 32 worden automatisch bepaald: nummers 1 en 2 per groep plus de beste acht nummers 3.
- Daarna rondekeuzes in plaats van een hele dynamische knock-out bracket. Dit houdt de app rustiger dan apps waarbij je elke knock-outwedstrijd later opnieuw moet invullen.
- Een beperkte update na de groepsfase voor finalisten, kampioen en knock-outstatistieken.
- Subpoule-ranking op basis van de beste 4 spelers, zodat grotere groepen niet automatisch winnen.
- Ironische statistieken: 0-0's, rode kaarten, speelstad met meeste goals, penaltyseries, eigen goals en kaartenkoning-team.
- Moderators kunnen een poule aankleden met emoji/kleur/tekst en berichten op het prikbord plaatsen.

## Puntentelling Slime Score

- Wedstrijd exact: 12 punten maximum per wedstrijd.
- Niet exact: juiste richting 6, juist doelsaldo 3, per juist teamdoelpunt 1.
- Rondekeuzes: laatste 32 automatisch uit groepsstand, daarna oplopend per ronde.
- Kampioen: 55 punten. Daarmee blijft kampioen ruim onder 8% van het totale haalbare pakket.
- Bonusvragen: topscorer, totaal goals en trackbare statistieken. Samen leuk, maar niet dominant.

Belangrijk: stage-checkboxes worden server-side begrensd. Maximaal 16 landen bij achtste finale, 8 bij kwartfinale, 4 bij halve finale en 2 finalisten.

## API-opties voor uitslagen

- API-Football: meestal goede dekking, gratis/goedkope tiers maar WK-dekking vooraf controleren.
- football-data.org: eenvoudige voetbaldata-API, goedkoop voor standaardgebruik; WK 2026-dekking controleren zodra beschikbaar.
- Sportmonks: professioneel en betrouwbaar, vaak duurder maar geschikt als live/resultaatkwaliteit belangrijker wordt.
- Fallback: beveiligde interne sync-route accepteert handmatige of cron-updates met wedstrijd-id en eindstand.

## Domeinobservaties

Controle gedaan op 2026-06-01 met RDAP/WHOIS:

- `slime.net`: geregistreerd, registrar GoDaddy.
- `slime.eu`: geregistreerd, registrar MarkMonitor.
- `sli.me`: geregistreerd, registrar Name.com.
- `slime.app`: geregistreerd.
- `slime.nl`: geregistreerd.

Conclusie: deze korte Slime-domeinen zijn niet vrij. Als ze te koop zijn, is dat waarschijnlijk aftermarket/brokerwerk. Sedo geeft als algemene marktcontext dat domeinprijzen vanaf USD 20 kunnen starten maar geen bovengrens hebben en dat veel domeinen onder USD 2.500 verkopen; korte merkbare domeinen kunnen daar ruim boven zitten.
