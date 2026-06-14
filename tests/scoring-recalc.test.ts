import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { isNlMatch, NL_POINTS_MULTIPLIER } from "../src/lib/entry-rules.ts";
import { scoreMatchPrediction } from "../src/lib/scoring.ts";

// Legt de wedstrijdpunten-keten vast zoals recalculate.ts die samenstelt:
// per gespeelde wedstrijd scoreMatchPrediction(), met dubbele punten voor Oranje.
type Row = { home_code: string; away_code: string; ph: number; pa: number; ah: number; aa: number };

function totalPoints(rows: Row[]): number {
  let total = 0;
  for (const r of rows) {
    const multiplier = isNlMatch(r.home_code, r.away_code) ? NL_POINTS_MULTIPLIER : 1;
    total += scoreMatchPrediction({ predictedHome: r.ph, predictedAway: r.pa, actualHome: r.ah, actualAway: r.aa }, multiplier).points;
  }
  return total;
}

test("recalc-keten: exacte niet-NL uitslag = 12, exacte Oranje-uitslag = 24", () => {
  assert.equal(totalPoints([{ home_code: "BRA", away_code: "ARG", ph: 2, pa: 1, ah: 2, aa: 1 }]), 12);
  assert.equal(totalPoints([{ home_code: "NED", away_code: "JPN", ph: 2, pa: 1, ah: 2, aa: 1 }]), 24);
  // NED als uitploeg telt ook dubbel.
  assert.equal(totalPoints([{ home_code: "TUN", away_code: "NED", ph: 1, pa: 1, ah: 1, aa: 1 }]), 24);
});

test("recalc-keten: gemengde set telt NL dubbel, mis levert 0", () => {
  const rows: Row[] = [
    { home_code: "NED", away_code: "JPN", ph: 2, pa: 0, ah: 2, aa: 1 }, // juiste winnaar (6) + thuis exact (2) = 8, x2 = 16
    { home_code: "BRA", away_code: "ARG", ph: 1, pa: 1, ah: 1, aa: 1 }, // exact = 12
    { home_code: "USA", away_code: "MEX", ph: 0, pa: 3, ah: 2, aa: 0 }, // volledig mis = 0
  ];
  assert.equal(totalPoints(rows), 16 + 12 + 0);
});

test("recalculate.ts bedraadt de Oranje-dubbel daadwerkelijk in", () => {
  const recalc = readFileSync(new URL("../src/lib/recalculate.ts", import.meta.url), "utf8");
  assert.match(recalc, /isNlMatch\(result\?\.home_code, result\?\.away_code\)/);
  assert.match(recalc, /NL_POINTS_MULTIPLIER/);
  assert.match(recalc, /scoreMatchPrediction\(\s*\{[\s\S]*?\},\s*multiplier,?\s*\)/);
});

test("recalculate.ts stopt bij stage/special/facts-queryfouten voordat scores worden overschreven", () => {
  const recalc = readFileSync(new URL("../src/lib/recalculate.ts", import.meta.url), "utf8");
  assert.match(recalc, /error:\s*bracketError/);
  assert.match(recalc, /error:\s*stageError/);
  assert.match(recalc, /error:\s*specialError/);
  assert.match(recalc, /error:\s*factError/);
  assert.match(recalc, /if \(bracketError \|\| stageError \|\| specialError \|\| factError\)/);
});
