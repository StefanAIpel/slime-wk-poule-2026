import assert from "node:assert/strict";
import { test } from "node:test";
import { activeSiteMessage, type SiteMessageRow } from "../src/lib/site-messages.ts";

function row(overrides: Partial<SiteMessageRow> = {}): SiteMessageRow {
  return {
    placement: "home",
    body_nl: "De voorspellingen zijn gesloten — veel succes!",
    body_en: "Predictions are closed — good luck!",
    show_from: null,
    show_until: null,
    ...overrides,
  };
}

test("activeSiteMessage returns the locale body without a window", () => {
  assert.equal(activeSiteMessage(row(), "nl"), "De voorspellingen zijn gesloten — veel succes!");
  assert.equal(activeSiteMessage(row(), "en"), "Predictions are closed — good luck!");
});

test("activeSiteMessage falls back to NL when EN is empty", () => {
  assert.equal(activeSiteMessage(row({ body_en: "" }), "en"), "De voorspellingen zijn gesloten — veel succes!");
});

test("activeSiteMessage hides empty or missing messages", () => {
  assert.equal(activeSiteMessage(null, "nl"), null);
  assert.equal(activeSiteMessage(row({ body_nl: "  ", body_en: "" }), "nl"), null);
});

test("activeSiteMessage respects the show window (deadline 14 juni 21:00 NL)", () => {
  const deadline = row({ show_from: "2026-06-14T21:00:00+02:00" });
  assert.equal(activeSiteMessage(deadline, "nl", new Date("2026-06-14T20:59:00+02:00")), null);
  assert.ok(activeSiteMessage(deadline, "nl", new Date("2026-06-14T21:00:00+02:00")));

  const expiring = row({ show_until: "2026-06-28T21:00:00+02:00" });
  assert.ok(activeSiteMessage(expiring, "nl", new Date("2026-06-28T20:59:00+02:00")));
  assert.equal(activeSiteMessage(expiring, "nl", new Date("2026-06-28T21:00:00+02:00")), null);
});
