import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

assert.match(game, /function isWetlandParkLevel\(\)/);
assert.match(game, /function createWetlandQuestState\(level, tasks\)/);
assert.match(game, /function wetlandQuestAllowsProgress\(\)/);
assert.match(game, /function interactWetlandParkTask\(task\)/);
assert.match(game, /function drawWetlandParkNpcFallback\(kind\)/);
assert.match(game, /state\.wetlandQuest = createWetlandQuestState\(level, state\.tasksList\)/);
assert.match(game, /checkpoint/);
assert.match(game, /先去找\$\{wetlandQuestNpcTask\(\)\?\.name \|\| "任务伙伴"\}接任务/);
assert.match(game, /kind: "wetland_npc", role: "issuer", optional: true/);
