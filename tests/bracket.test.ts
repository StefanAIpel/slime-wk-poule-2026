import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const explorer = readFileSync(new URL("../src/components/schedule-explorer.tsx", import.meta.url), "utf8");

test("knockout bracket is additive with a List/Bracket toggle, default List", () => {
  // Toggle bestaat en staat standaard op de lijst (niet bracket).
  assert.match(explorer, /useState<"list" \| "bracket">\("list"\)/);
  assert.match(explorer, /ko-view-toggle/);
  // Lijstweergave blijft bestaan naast de bracket.
  assert.match(explorer, /view === "bracket" \? \(\s*<KnockoutBracket/);
  assert.match(explorer, /knockout-match-list/);
});

test("bracket derives connections + halves from the 'Winnaar W{n}' labels", () => {
  assert.match(explorer, /Winnaar\\s\+W\(\\d\+\)/);
  assert.match(explorer, /buildBracketGraph/);
  assert.match(explorer, /"top" \| "bottom"/);
  // Toont expliciet wie je volgende ronde kunt treffen.
  assert.match(explorer, /nextMeets/);
});
