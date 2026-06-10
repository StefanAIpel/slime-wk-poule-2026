import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const layout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("FOUC-vangnet: probe + eenmalige reload aanwezig en CSS verbergt de probe", () => {
  assert.match(layout, /id="css-probe"/);
  assert.match(layout, /ss_css_retry/);
  assert.match(layout, /location\.reload\(\)/);
  assert.match(css, /#css-probe \{ display: none; \}/);
});
