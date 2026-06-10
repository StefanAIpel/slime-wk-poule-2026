import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const explorer = readFileSync(new URL("../src/components/schedule-explorer.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("knockout bracket is additive with a List/Bracket toggle, default List", () => {
  assert.match(explorer, /useState<"list" \| "bracket">\("list"\)/);
  assert.match(explorer, /ko-view-toggle/);
  assert.match(explorer, /view === "bracket" \? \(\s*<KnockoutBracket/);
  assert.match(explorer, /knockout-match-list/);
});

test("bracket splits into halves and ends each half at the semifinal, final separate", () => {
  assert.match(explorer, /buildBracketGraph/);
  assert.match(explorer, /"round32", "round16", "quarterfinal", "semifinal"/);
  assert.match(explorer, /stage === "final" \|\| m\.stage === "third_place"/);
  assert.match(explorer, /ko-round-final/);
});

test("bracket renders as a true centered, contained bracket (space-around, no page overflow)", () => {
  const bracket = css.match(/\.ko-bracket \{[\s\S]*?\}/)?.[0] ?? "";
  const matches = css.match(/\.ko-round-matches \{[\s\S]*?\}/)?.[0] ?? "";
  assert.match(bracket, /overflow-x: auto/);
  assert.match(bracket, /max-width: 100%/);
  assert.match(matches, /justify-content: space-around/);
});
