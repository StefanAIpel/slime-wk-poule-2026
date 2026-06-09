import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const actions = readFileSync(new URL("../src/app/actions.ts", import.meta.url), "utf8");

function actionBody(name: string) {
  const body = actions.split(`export async function ${name}`)[1];
  assert.ok(body, `action ${name} bestaat niet meer — test bijwerken`);
  return body.split("export async function")[0];
}

// Characterization: elke poule-mutatie met een user-controlled pool_id checkt het
// lidmaatschap/de rol van de AANROEPER server-side vóór de mutatie.
test("pool mutations verify caller membership/ownership server-side", () => {
  const membershipChecked = ["removeMember", "updatePoolStyle", "postPoolMessage", "deletePoolMessage", "uploadPoolImage", "setMemberRole"];
  for (const name of membershipChecked) {
    const body = actionBody(name);
    assert.match(body, /from\("pool_members"\)[\s\S]*?\.eq\("user_id", user\.id\)/, `${name} mist een membership-check op de aanroeper`);
  }
  assert.match(actionBody("resetPoolCode"), /pool\.owner_id !== user\.id/, "resetPoolCode mist de owner-check");
});

// Cross-poule-bescherming: een bericht wissen moet op id ÉN pool_id filteren,
// anders kan een beheerder van poule A berichten in poule B verwijderen.
test("deletePoolMessage scopes the delete to the checked pool", () => {
  assert.match(actionBody("deletePoolMessage"), /\.delete\(\)\.eq\("id", messageId\)\.eq\("pool_id", poolId\)/);
});

// Autorisatie komt nooit uit verborgen formuliervelden: profiel- en
// voorspellingsmutaties gebruiken altijd de sessie-user, nooit een form-id.
test("profile and prediction mutations only act on the session user", () => {
  for (const name of ["saveProfile", "updateAccount", "deleteAccount", "savePredictions"]) {
    const body = actionBody(name);
    assert.doesNotMatch(body, /formData\.get\("user_id"\)/, `${name} mag geen user_id uit het formulier lezen`);
  }
});
