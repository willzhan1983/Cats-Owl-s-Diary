import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const map = readFileSync(new URL("../world-map.js", import.meta.url), "utf8");
const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const names = ["迷雾沼泽入口", "萤火虫小径", "沉睡木桥", "迷雾核心", "沼泽泥浆怪"];

for (const name of names) {
  assert.ok(game.includes(`"${name}"`), `${name} should be appended`);
}

assert.match(game, /mist_swamp:\s*\{[\s\S]*?levels:\s*\[\]/);
assert.match(game, /WORLD_MAP\.mist_swamp\.levels\s*=\s*levels[\s\S]*?level\.world\s*===\s*"mist_swamp"/);
assert.ok(!/WORLD_MAP\.mist_swamp\.levels\s*=\s*\[\d/.test(game));
assert.match(map, /mist_swamp:\s*\{[\s\S]*?name:\s*"迷雾沼泽"/);

for (const key of ["mistSwampEntrance", "fireflyTrailPath", "sleepingWoodenBridge", "mistCoreClearing", "mudMonsterLair"]) {
  assert.ok(game.includes(`${key}:`), `${key} background should exist`);
}

for (const key of ["fireflyCore", "glowSpore", "bridgePlank", "bridgeKey", "lightSpore", "fireflyLantern", "mistBadge", "mistGuardianBadge"]) {
  assert.ok(game.includes(`${key}:`), `${key} label should exist`);
}

for (const file of ["mist-swamp-map-entry.js", "mist-swamp-quiz-bank.js"]) {
  assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), `${file} should exist`);
  assert.ok(index.includes(`<script src="./${file}"></script>`), `${file} should be loaded`);
}

const quiz = readFileSync(new URL("../mist-swamp-quiz-bank.js", import.meta.url), "utf8");
assert.ok(quiz.includes('const MIST_SWAMP_QUIZ_KEY = "mistSwampShared"'));
assert.ok(!quiz.includes("appleValleyShared"));
assert.ok(!quiz.includes("moonlightShared"));
assert.ok(quiz.includes("function refreshCurrentMistSwampLevel()"));
assert.match(game, /else if \(levels\[state\.levelIndex\]\?\.world === "mist_swamp"\) \{\s*drawMistSwampFallbackBackground\(\);/);
assert.ok(game.includes("function drawMistSwampFallbackBackground()"));
assert.match(game, /const MIST_SWAMP_NPC_RENDERERS = \{[\s\S]*?typeof drawFirefly === "function"[\s\S]*?typeof drawMudMonster === "function"/);
assert.match(game, /function drawMistSwampNpcFallback\(label\)/);
