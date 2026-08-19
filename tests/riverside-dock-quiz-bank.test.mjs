import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../riverside-dock-quiz-bank.js", import.meta.url), "utf8");
const levels = [
  "riverside_dock_entrance",
  "riverside_paddle_search",
  "riverside_bridge_repair",
  "riverside_safe_crossing",
].map((id) => ({ id, world: "riverside_dock", tasks: [] }));
let resetLevel = null;
const sandbox = {
  quizBank: {},
  levels,
  state: { levelIndex: 0, running: true },
  resetGame(levelIndex) { resetLevel = levelIndex; },
  startBtn: { textContent: "" },
  text: { restart: "重来" },
};
sandbox.window = sandbox;
vm.runInNewContext(source, sandbox);

const api = sandbox.CATS_OWLS_RIVERSIDE_DOCK_QUIZ;
assert.ok(api, "Riverside Dock quiz API should be exported");
assert.equal(api.catalog.length, 24);
for (const difficulty of ["easy", "normal", "hard", "crazy"]) {
  assert.equal(api.catalog.filter((entry) => entry.difficulty === difficulty).length, 6);
}
assert.deepEqual(
  [...new Set(api.catalog.map((entry) => entry.category))].sort(),
  ["english", "language", "math", "science"]
);
for (const question of api.catalog) {
  assert.equal(typeof question.id, "string");
  assert.equal(typeof question.question, "string");
  assert.equal(question.options.length, 4);
  assert.ok(Number.isInteger(question.answer));
  assert.ok(question.answer >= 0 && question.answer < question.options.length);
}
assert.equal(levels.every((level) => level.tasks.filter((task) => task.riversideDockShared).length === 1), true);
assert.equal(resetLevel, 0, "a directly opened Riverside level should refresh after quiz injection");
assert.equal(sandbox.state.running, true, "refresh should preserve the running state");
