import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../acorn-town-rules.js", import.meta.url), "utf8");
const sandbox = {};
vm.runInNewContext(source, sandbox);
const rules = sandbox.CATS_OWLS_ACORN_TOWN_RULES;

assert.ok(rules, "Acorn Town rules API should be exported");
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map(rules.difficultyRank),
  [0, 1, 2, 3]
);
assert.equal(rules.visibleAtDifficulty({ minDifficulty: "hard" }, "normal"), false);
assert.equal(rules.visibleAtDifficulty({ minDifficulty: "hard" }, "crazy"), true);
assert.equal(rules.timeFor("acorn_post_office", "crazy"), 80);
assert.equal(rules.timeFor("acorn_notice_board", "easy"), 150);
assert.equal(rules.wrongActionPenalty("easy"), 0);
assert.equal(rules.wrongActionPenalty("normal"), 0);
assert.equal(rules.wrongActionPenalty("hard"), 3);
assert.equal(rules.wrongActionPenalty("crazy"), 5);
assert.equal(
  rules.coreTasksDone([
    { kind: "matched_delivery", done: true },
    { kind: "quiz", done: false },
    { kind: "decoy_target", optional: true, done: false },
  ]),
  true
);
assert.equal(
  rules.coreTasksDone([{ kind: "market_trade", done: false }, { kind: "quiz", done: false }]),
  false
);
