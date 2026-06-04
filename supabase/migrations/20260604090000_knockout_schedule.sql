-- Knock-outschema WK 2026 (wedstrijden 73-104).
--
-- De landen zijn nog onbekend tot de groepsfase klaar is, dus we tonen beschrijvende
-- slot-labels (home_label / away_label), bv. "Winnaar Groep A" of "Winnaar W73". Datum,
-- aftraptijd en stadion komen uit het officiele FIFA-schema (loting 5 december 2025).
-- starts_at staat in lokale stadiontijd met de juiste UTC-offset; de app rekent dit om
-- naar Nederlandse tijd. group_letter blijft NULL (dat markeert een knock-outwedstrijd);
-- home_code/away_code blijven NULL tot de teams bekend zijn.

alter table public.matches
  add column if not exists home_label text,
  add column if not exists away_label text;

insert into public.matches (id, stage, group_letter, starts_at, venue, home_label, away_label) values
  -- Laatste 32 (28 juni - 3 juli)
  (73,  'round32', null, '2026-06-28 12:00:00-07', 'Los Angeles',            'Nr. 2 Groep A',  'Nr. 2 Groep B'),
  (74,  'round32', null, '2026-06-29 16:30:00-04', 'Boston',                 'Winnaar Groep E', 'Beste 3e (A/B/C/D/F)'),
  (75,  'round32', null, '2026-06-29 19:00:00-06', 'Monterrey',              'Winnaar Groep F', 'Nr. 2 Groep C'),
  (76,  'round32', null, '2026-06-29 12:00:00-05', 'Houston',                'Winnaar Groep C', 'Nr. 2 Groep F'),
  (77,  'round32', null, '2026-06-30 17:00:00-04', 'New York New Jersey',    'Winnaar Groep I', 'Beste 3e (C/D/F/G/H)'),
  (78,  'round32', null, '2026-06-30 12:00:00-05', 'Dallas',                 'Nr. 2 Groep E',  'Nr. 2 Groep I'),
  (79,  'round32', null, '2026-06-30 19:00:00-06', 'Mexico City',            'Winnaar Groep A', 'Beste 3e (C/E/F/H/I)'),
  (80,  'round32', null, '2026-07-01 12:00:00-04', 'Atlanta',                'Winnaar Groep L', 'Beste 3e (E/H/I/J/K)'),
  (81,  'round32', null, '2026-07-01 17:00:00-07', 'San Francisco Bay Area', 'Winnaar Groep D', 'Beste 3e (B/E/F/I/J)'),
  (82,  'round32', null, '2026-07-01 13:00:00-07', 'Seattle',                'Winnaar Groep G', 'Beste 3e (A/E/H/I/J)'),
  (83,  'round32', null, '2026-07-02 19:00:00-04', 'Toronto',                'Nr. 2 Groep K',  'Nr. 2 Groep L'),
  (84,  'round32', null, '2026-07-02 12:00:00-07', 'Los Angeles',            'Winnaar Groep H', 'Nr. 2 Groep J'),
  (85,  'round32', null, '2026-07-02 20:00:00-07', 'Vancouver',              'Winnaar Groep B', 'Beste 3e (E/F/G/I/J)'),
  (86,  'round32', null, '2026-07-03 18:00:00-04', 'Miami',                  'Winnaar Groep J', 'Nr. 2 Groep H'),
  (87,  'round32', null, '2026-07-03 20:30:00-05', 'Kansas City',            'Winnaar Groep K', 'Beste 3e (D/E/I/J/L)'),
  (88,  'round32', null, '2026-07-03 13:00:00-05', 'Dallas',                 'Nr. 2 Groep D',  'Nr. 2 Groep G'),
  -- Achtste finale (4 - 7 juli)
  (89,  'round16', null, '2026-07-04 17:00:00-04', 'Philadelphia',           'Winnaar W74', 'Winnaar W77'),
  (90,  'round16', null, '2026-07-04 12:00:00-05', 'Houston',                'Winnaar W73', 'Winnaar W75'),
  (91,  'round16', null, '2026-07-05 16:00:00-04', 'New York New Jersey',    'Winnaar W76', 'Winnaar W78'),
  (92,  'round16', null, '2026-07-05 18:00:00-06', 'Mexico City',            'Winnaar W79', 'Winnaar W80'),
  (93,  'round16', null, '2026-07-06 14:00:00-05', 'Dallas',                 'Winnaar W83', 'Winnaar W84'),
  (94,  'round16', null, '2026-07-06 17:00:00-07', 'Seattle',                'Winnaar W81', 'Winnaar W82'),
  (95,  'round16', null, '2026-07-07 12:00:00-04', 'Atlanta',                'Winnaar W86', 'Winnaar W88'),
  (96,  'round16', null, '2026-07-07 13:00:00-07', 'Vancouver',              'Winnaar W85', 'Winnaar W87'),
  -- Kwartfinale (9 - 11 juli)
  (97,  'quarterfinal', null, '2026-07-09 16:00:00-04', 'Boston',            'Winnaar W89', 'Winnaar W90'),
  (98,  'quarterfinal', null, '2026-07-10 12:00:00-07', 'Los Angeles',       'Winnaar W93', 'Winnaar W94'),
  (99,  'quarterfinal', null, '2026-07-11 17:00:00-04', 'Miami',             'Winnaar W91', 'Winnaar W92'),
  (100, 'quarterfinal', null, '2026-07-11 20:00:00-05', 'Kansas City',       'Winnaar W95', 'Winnaar W96'),
  -- Halve finale (14 - 15 juli)
  (101, 'semifinal', null, '2026-07-14 14:00:00-05', 'Dallas',               'Winnaar W97', 'Winnaar W98'),
  (102, 'semifinal', null, '2026-07-15 15:00:00-04', 'Atlanta',              'Winnaar W99', 'Winnaar W100'),
  -- Troostfinale + finale (18 - 19 juli)
  (103, 'third_place', null, '2026-07-18 17:00:00-04', 'Miami',              'Verliezer W101', 'Verliezer W102'),
  (104, 'final', null, '2026-07-19 15:00:00-04', 'New York New Jersey',      'Winnaar W101', 'Winnaar W102')
on conflict (id) do update set
  stage = excluded.stage,
  starts_at = excluded.starts_at,
  venue = excluded.venue,
  home_label = excluded.home_label,
  away_label = excluded.away_label;
