import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../riverside-dock-rules.js", import.meta.url), "utf8");
const sandbox = {};
vm.runInNewContext(source, sandbox);
const rules = sandbox.CATS_OWLS_RIVERSIDE_DOCK_RULES;

assert.ok(rules, "Riverside Dock rules API should be exported");
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((mode) => rules.timeFor("riverside_dock_entrance", mode)),
  [140, 120, 105, 90]
);
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((mode) => rules.routeFor(mode).length),
  [2, 3, 3, 4]
);
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map(rules.wrongActionPenalty),
  [0, 0, 3, 5]
);
assert.deepEqual(
  { ...rules.advanceSequence(["right", "up", "dock"], 0, "right") },
  { progress: 1, complete: false, reset: false }
);
assert.deepEqual(
  { ...rules.advanceSequence(["right", "up", "dock"], 1, "left") },
  { progress: 0, complete: false, reset: true }
);
assert.deepEqual(
  { ...rules.advanceSequence(["right", "up", "dock"], 2, "dock") },
  { progress: 3, complete: true, reset: false }
);
assert.equal(rules.canCross({ waterSafe: true, signalGreen: true, hasPackage: true }), true);
assert.equal(rules.canCross({ waterSafe: false, signalGreen: true, hasPackage: true }), false);
assert.equal(rules.canCross({ waterSafe: true, signalGreen: false, hasPackage: true }), false);
assert.equal(rules.canCross({ waterSafe: true, signalGreen: true, hasPackage: false }), false);
assert.ok(rules.waterWindowFor("easy") > rules.waterWindowFor("crazy"));
