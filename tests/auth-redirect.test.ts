import assert from "node:assert/strict";
import { test } from "node:test";
import { buildEmailRedirectTo, safeRedirectTarget, serverAuthCallbackPath } from "../src/lib/supabase/auth-redirect.ts";

test("magic-link login blijft op confirm-url en confirm kan server callback starten", () => {
  assert.equal(buildEmailRedirectTo("https://slimescore.com"), "https://slimescore.com/auth/confirm");

  const callbackPath = serverAuthCallbackPath(
    new URL("https://slimescore.com/auth/confirm?code=abc123&type=email&next=%2Fpoules"),
  );
  assert.equal(callbackPath, "/auth/callback?code=abc123&type=email&next=%2Fpoules");
});

test("magic-link callback bewaart alleen veilige interne next redirects", () => {
  assert.equal(buildEmailRedirectTo("https://slimescore.com", "/poules"), "https://slimescore.com/auth/confirm?next=%2Fpoules");
  assert.equal(safeRedirectTarget("/poules"), "/poules");
  assert.equal(safeRedirectTarget("//evil.test"), "/?login=gelukt");
  assert.equal(safeRedirectTarget("/..//evil.com"), "/?login=gelukt");
  assert.equal(safeRedirectTarget("/%2e%2e//evil.com"), "/?login=gelukt");
  assert.equal(safeRedirectTarget("/\\\\evil.com"), "/?login=gelukt");
  assert.equal(safeRedirectTarget("https://evil.test"), "/?login=gelukt");
  assert.equal(safeRedirectTarget(null), "/?login=gelukt");
});
