import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const art = readFileSync(new URL("../art-assets.js", import.meta.url), "utf8");
const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const signs = [
  ["math", "Math"],
  ["logic", "Logic"],
  ["science", "Science"],
  ["language", "Language"],
  ["english", "English"],
  ["riddle", "Riddle"],
];

for (const [kind, key] of signs) {
  assert.ok(existsSync(new URL(`../assets/props/quiz_sign_${kind}.png`, import.meta.url)));
  assert.match(art, new RegExp(`quizSign${key}: "assets/props/quiz_sign_${kind}\\.png`));
  assert.match(game, new RegExp(`kind === "${kind}"\\) drawQuizStandArt\\("${kind}"`));
}

assert.match(game, /function drawQuizStandArt\(kind, fallbackColor, fallbackLabel\)/);
assert.match(game, /drawQuizStand\(fallbackColor, fallbackLabel\)/);
