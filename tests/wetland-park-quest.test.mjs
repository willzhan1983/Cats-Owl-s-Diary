import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

assert.match(game, /function isWetlandParkLevel\(\)/);
assert.match(game, /function createWetlandQuestState\(level, tasks\)/);
assert.match(game, /function wetlandQuestAllowsProgress\(\)/);
assert.match(game, /function interactWetlandParkTask\(task\)/);
assert.match(game, /function wetlandAdventureRule\(\)/);
assert.match(game, /function wetlandNpcDialogue\(task\)/);
assert.match(game, /function applyWetlandSequenceStep\(task\)/);
assert.match(game, /function updateWetlandParkMechanisms\(dt\)/);
assert.match(game, /function prepareWetlandParkLevel\(level\)/);
assert.match(game, /kind: "wetland_decoy"/);
assert.match(game, /湿地幻象/);
assert.match(game, /wetland_boss_wisp/);
assert.match(game, /wetlandQuest\.waterSafe/);
assert.match(game, /state\.runPoints = Math\.max\(0, state\.runPoints - penalty\.points\)/);
assert.match(game, /openDialogue\(task\);/);
assert.match(game, /function drawWetlandParkNpcFallback\(kind\)/);
assert.match(game, /\["active", "ready"\]\.includes\(state\.wetlandQuest\?\.status\)/);
assert.match(game, /if \(task\.kind === "quiz"\) \{\s*openQuiz\(task\);\s*return true;/);
assert.match(game, /state\.wetlandQuest = createWetlandQuestState\(level, state\.tasksList\)/);
assert.match(game, /checkpoint/);
assert.match(game, /先去找\$\{wetlandQuestNpcTask\(\)\?\.name \|\| "任务伙伴"\}接任务/);
assert.match(game, /kind: "wetland_npc", role: "issuer", optional: true/);
assert.match(game, /kind: "wetland_memory_node"/);
for (const token of ["water", "leaf", "bird", "reed", "moon"]) {
  assert.match(game, new RegExp(`routeToken: "${token}"`));
}
assert.match(game, /memoryRoute = tokens\.slice\(0, wetlandDifficultyConfig\(\)\.routeLength\)/);
assert.match(game, /routeVisibleUntil = performance\.now\(\) \+ 4200/);
assert.match(game, /applyWetlandWrongAction\("芦苇把你带回了岔路口。", state\.wetlandQuest\.memoryCheckpoint\)/);
assert.match(game, /kind === "wetland_memory_route"/);
assert.doesNotMatch(game, /if \(task\.hidden\) continue;/);
assert.match(game, /if \(isWetlandParkLevel\(\) && levels\[state\.levelIndex\]\.id === "wetland_reed_maze" && task\.kind === "wetland_memory_route"\) continue;/);
assert.match(game, /function interactWetlandMemoryNode\(task\) \{[\s\S]*?routeIndex = 0;[\s\S]*?applyWetlandWrongAction\("芦苇把你带回了岔路口。", state\.wetlandQuest\.memoryCheckpoint\)/);
assert.match(game, /if \(task\.kind === "wetland_decoy"\) \{[\s\S]*?resetWetlandSequence\(rule\);[\s\S]*?applyWetlandWrongAction\("碰到了湿地幻象！"\);/);
