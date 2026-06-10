import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Bewaakt de valkuil van de kleur-token-refactor: een CSS-var ("var(--x)") mag
// NOOIT als echte kleurwaarde aan een JS-functie/lib worden doorgegeven (QR,
// sharp, error-pagina zonder CSS). Die hoort een echte hex te zijn.
const poules = readFileSync(new URL("../src/app/poules/page.tsx", import.meta.url), "utf8");
const globalError = readFileSync(new URL("../src/app/global-error.tsx", import.meta.url), "utf8");

test("QR-code kleur is een echte hex, geen CSS-var", () => {
  assert.match(poules, /dark: "#[0-9a-fA-F]{6}"/);
  assert.doesNotMatch(poules, /dark: "var\(/);
});

test("global-error gebruikt echte hex-kleuren (geen CSS-vars: bare document)", () => {
  assert.doesNotMatch(globalError, /"var\(--/);
});
