import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

assert.match(game, /function wetlandDifficultyConfig\(\)/);
assert.match(game, /function createWetlandAdventureState\(level\)/);
assert.match(game, /function updateWetlandParkMechanisms\(dt\)/);
assert.match(game, /state\.runPoints = Math\.max\(0, state\.runPoints - penalty\.points\)/);

const difficultyConfig = game.match(/function wetlandDifficultyConfig\(\)\s*\{[\s\S]*?\n\}/)?.[0] || "";
assert.match(difficultyConfig, /easy: \{ routeLength: 3, hintViews: Infinity, patrols: 1, patrolSpeed: 44, logSpeed: 38, mirrorCount: 3, bossSpeed: 68, bossWindow: 5\.5 \}/);
assert.match(difficultyConfig, /normal: \{ routeLength: 4, hintViews: 2, patrols: 2, patrolSpeed: 58, logSpeed: 52, mirrorCount: 3, bossSpeed: 82, bossWindow: 4\.5 \}/);
assert.match(difficultyConfig, /hard: \{ routeLength: 5, hintViews: 1, patrols: 3, patrolSpeed: 72, logSpeed: 68, mirrorCount: 4, bossSpeed: 98, bossWindow: 3\.6 \}/);
assert.match(difficultyConfig, /crazy: \{ routeLength: 5, hintViews: 1, patrols: 4, patrolSpeed: 88, logSpeed: 84, mirrorCount: 4, bossSpeed: 116, bossWindow: 2\.8 \}/);

const adventureFactory = game.match(/function createWetlandAdventureState\(level\)\s*\{[\s\S]*?\n\}/)?.[0] || "";
for (const field of ["checkpoint", "hintViews", "routeIndex", "routeVisibleUntil", "patrols", "platforms", "mirrorAngles", "mirrorMistHits", "boss"]) {
  assert.match(adventureFactory, new RegExp(`\\b${field}\\s*:`), `factory should define ${field}`);
}
assert.match(adventureFactory, /checkpoint: isWetland \? \{ \.\.\.level\.start \} : null/);
assert.match(adventureFactory, /hintViews: isWetland \? config\.hintViews : 0/);
assert.match(adventureFactory, /patrols: \[\]/);
assert.match(adventureFactory, /platforms: \[\]/);
assert.match(adventureFactory, /mirrorAngles: \[\]/);
assert.match(adventureFactory, /boss: null/);

const wrongAction = game.match(/function applyWetlandWrongAction\([\s\S]*?\n\}/)?.[0] || "";
for (const [difficulty, time, points] of [["easy", 3, 3], ["normal", 5, 5], ["hard", 7, 8], ["crazy", 9, 12]]) {
  assert.match(wrongAction, new RegExp(`${difficulty}: \\{ time: ${time}, points: ${points} \\}`));
}
assert.match(wrongAction, /checkpoint = state\.wetlandQuest\.checkpoint/);
assert.match(wrongAction, /state\.player\.x = checkpoint\.x/);
assert.match(wrongAction, /state\.player\.y = checkpoint\.y/);
assert.match(wrongAction, /addFloatingText\(checkpoint\.x, checkpoint\.y - 54/);

assert.match(game, /function updateWetlandParkMechanisms\(dt\)\s*\{\s*if \(!isWetlandParkLevel\(\) \|\| !state\.wetlandQuest\) return;/);
const resetSequence = game.match(/function resetWetlandSequence\([\s\S]*?\n\}/)?.[0] || "";
assert.doesNotMatch(resetSequence, /state\.hearts\s*=\s*Math\.max/);
assert.doesNotMatch(resetSequence, /state\.time\s*=\s*Math\.max/);
assert.match(game, /if \(isWetlandParkLevel\(\) && task\.kind === "wetland_npc"\) return wetlandNpcDialogue\(task\);/);
assert.match(game, /function prepareWetlandFogPatrols\(\)/);
assert.match(game, /function updateWetlandFogPatrols\(dt\)/);
assert.match(game, /function prepareWetlandMemoryRoute\(\)/);
assert.match(game, /function interactWetlandMemoryNode\(task\)/);
assert.match(game, /fogPatrols: \[/);
assert.match(game, /fog_patrol_far.*minDifficulty: "hard"/);
assert.match(game, /state\.wetlandQuest\.fogPatrolHitCooldown = 1/);
assert.match(game, /applyWetlandWrongAction\("被迷雾挡住了，回到最近的瞭望台。"/);
assert.match(game, /function drawWetlandFogPatrols\(\)/);
assert.match(game, /function drawWetlandMemoryRoute\(\)/);
