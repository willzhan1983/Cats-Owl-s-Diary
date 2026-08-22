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
const sandbox = { quizBank: {}, levels };
sandbox.window = sandbox;
vm.runInNewContext(source, sandbox);
const api = sandbox.CATS_OWLS_RIVERSIDE_DOCK_QUIZ;

const firstRunId = api.beginRun("normal");
const assignments = levels.map((level) => api.assign(level.id, "normal"));
assert.equal(new Set(assignments.map((entry) => entry.id)).size, 4, "same chapter run should use four different questions");
assert.equal(api.assign(levels[0].id, "normal").id, assignments[0].id, "retry should keep the assigned question");
assert.equal(api.runSnapshot().assignedLevels, 4);

const secondRunId = api.beginRun("normal");
assert.ok(secondRunId > firstRunId);
assert.equal(api.runSnapshot().assignedLevels, 0, "new chapter entry should clear old assignments");
assert.equal(api.assign(levels[0].id, "normal").difficulty, "normal");
