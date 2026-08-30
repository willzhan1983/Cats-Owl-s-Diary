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
assert.doesNotMatch(resetSequence, /\.done\s*=/);
assert.doesNotMatch(resetSequence, /\.progress\s*=/);
assert.doesNotMatch(resetSequence, /state\.tasks\s*=/);
assert.match(resetSequence, /findIndex\(\(id\) => !state\.tasksList\.find\(\(entry\) => entry\.id === id\)\?\.done\)/);
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
assert.match(game, /state\.wetlandQuest\.checkpoint = \{ x: task\.x, y: task\.y \};/);
assert.match(game, /if \(state\.wetlandQuest\.fogPatrolHitCooldown <= 0 && patrol\.hitCooldown <= 0 && distance\(state\.player, patrol\) < patrol\.radius \+ 20\) \{\s*patrol\.hitCooldown = 1;\s*state\.wetlandQuest\.fogPatrolHitCooldown = 1;\s*applyWetlandWrongAction\("被迷雾挡住了，回到最近的瞭望台。"\);/);
assert.match(game, /function prepareWetlandPlatforms\(\)/);
assert.match(game, /function updateWetlandPlatforms\(dt\)/);
assert.match(game, /function resolveWetlandPlatformRide\(dt\)/);
assert.match(game, /wetlandCrossingCheckpoint/);
assert.match(game, /wetlandPlatforms: \[/);
assert.match(game, /id: "log_a", y: 358, minX: 272, maxX: 466, width: 82/);
assert.match(game, /id: "log_b", y: 302, minX: 440, maxX: 650, width: 82/);
assert.match(game, /id: "log_c", y: 244, minX: 626, maxX: 824, width: 82/);
assert.match(game, /applyWetlandWrongAction\("浮木下沉了，回到上一段安全岸边。", state\.wetlandQuest\.wetlandCrossingCheckpoint\)/);
assert.match(game, /state\.wetlandQuest\.waterRecoveryUntil = performance\.now\(\) \+ 700/);
assert.match(game, /先通过前面的浮木，才能点亮这盏灯。/);

assert.match(game, /function prepareWetlandMirrors\(\)/);
assert.match(game, /function rotateWetlandMirror\(task\)/);
assert.match(game, /function wetlandBeamPath\(\)/);
assert.match(game, /function drawWetlandBeamPath\(\)/);
assert.match(game, /mirrorMistHits/);
assert.match(game, /mirrors: \["wetland_mirror_one", "wetland_mirror_two", "wetland_mirror_three", "wetland_mirror_four"\]/);
assert.match(game, /answer: \[2, 0, 1, 2\]/);
assert.match(game, /id: "wetland_mirror_four"[\s\S]*?minDifficulty: "hard"/);
assert.match(game, /mirrorAngles = activeWetlandMirrorTasks\(\)\.map\(\(\) => 0\)/);
assert.match(game, /mirrorAngles\[index\] = \(state\.wetlandQuest\.mirrorAngles\[index\] \+ 1\) % 3/);
assert.match(game, /if \(state\.wetlandQuest\.mirrorMistHits === 3\) \{[\s\S]*?prepareWetlandMirrors\(\);[\s\S]*?applyWetlandWrongAction\("光束照到了迷雾晶石，镜面需要重新校准。"\)/);
assert.match(game, /state\.wetlandQuest\.mirrorMistHits = 0;[\s\S]*?completeTask\(mirror, mirror\.x, mirror\.y\)/);
assert.match(game, /rgba\(255, 213, 86, 0\.9\)/);
assert.match(game, /rgba\(135, 164, 184, 0\.72\)/);
assert.match(game, /const glyphs = \["↖", "↑", "↗"\]/);

assert.match(game, /function prepareWetlandBoss\(\)/);
assert.match(game, /function updateWetlandBoss\(dt\)/);
assert.match(game, /function collectWetlandBossWisp\(task\)/);
assert.match(game, /function startWetlandPurification\(\)/);
assert.match(game, /purificationCoreReady: true/);
assert.match(game, /applyWetlandWrongAction\("巨鳄又被雾气惊醒了，保留一束光再试一次。", boss\.checkpoint\)/);
assert.match(game, /const holdSeconds = \{ easy: 1\.8, normal: 1\.8, hard: 2\.2, crazy: 2\.6 \}/);
assert.match(game, /performance\.now\(\) \+ wetlandDifficultyConfig\(\)\.bossWindow \* 1000/);
assert.match(game, /if \(now >= boss\.purificationUntil\) return true;/);
const wetlandBossUpdate = game.slice(game.indexOf("function updateWetlandBoss(dt)"), game.indexOf("function collectWetlandBossWisp(task)"));
assert.match(wetlandBossUpdate, /if \(now > boss\.purificationUntil\) \{[\s\S]*?boss\.phase = "collect";[\s\S]*?boss\.carriedWispIds = boss\.carriedWispIds\.slice\(0, 1\);[\s\S]*?applyWetlandWrongAction\("巨鳄又被雾气惊醒了，保留一束光再试一次。", boss\.checkpoint\);[\s\S]*?return;/);
assert.doesNotMatch(wetlandBossUpdate, /purificationUntil && !boss\.holdStartedAt/);
assert.ok(wetlandBossUpdate.indexOf("now > boss.purificationUntil") < wetlandBossUpdate.indexOf("const holdSeconds"));

const reedMazeMemoryRouteSkip = /if \(isWetlandParkLevel\(\) && levels\[state\.levelIndex\]\.id === "wetland_reed_maze" && task\.kind === "wetland_memory_route"\) continue;/;
const checkTasksBody = game.match(/function checkTasks\(dt\)[\s\S]*?\n\}/)?.[0] || "";
const drawTasksBody = game.match(/function drawTasks\(\)[\s\S]*?\n\}/)?.[0] || "";
assert.match(checkTasksBody, reedMazeMemoryRouteSkip);
assert.match(drawTasksBody, reedMazeMemoryRouteSkip);
