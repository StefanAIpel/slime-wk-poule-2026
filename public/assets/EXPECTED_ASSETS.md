# Verwachte asset-paden (UI-review)

De UI verwijst al naar deze bestanden met nette fallbacks. Zet de definitieve
PNG's op exact deze paden en ze verschijnen automatisch — geen code-wijziging nodig.

| Pad | Gebruikt voor | Fallback tot het bestaat |
| --- | --- | --- |
| `public/assets/slime-07-duo.png` | Duo-mascotte (twee oranje slimes met bal) op de landing-hero | `slime-02-mascotte-bal.png` |
| `public/assets/slime-08-scheidsrechter.png` | Scheidsrechter-slime op de Regels-pagina | `slime-04-coach.png` |
| `public/assets/Hero-bg.webp` | Stadion-achtergrond achter de hero's (slimes staan op het gras) | bestaat al |

Aanbevelingen voor de mascotte-PNG's: transparant, vierkant (bijv. 1200×1200),
personage onderaan uitgelijnd zodat het op het gras "staat".

Optioneel, mooiere brede hero-achtergrond: vervang `Hero-bg.webp` door een
breed stadionbeeld (ca. 2000×900, gras onderaan) — de hero lijnt automatisch op
de onderkant uit.
