import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const art = readFileSync(new URL("../art-assets.js", import.meta.url), "utf8");
const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const files = ["math", "logic", "science", "language", "english", "riddle"];

for (const kind of files) {
  assert.ok(existsSync(new URL(`../assets/props/quiz_sign_${kind}.png`, import.meta.url)));
}

assert.match(art, /quizSignMath: "assets\/props\/quiz_sign_math\.png/);
assert.match(art, /quizSignRiddle: "assets\/props\/quiz_sign_riddle\.png/);
assert.match(game, /function drawQuizStandArt\(kind, fallbackColor, fallbackLabel\)/);
assert.match(game, /drawQuizStand\(fallbackColor, fallbackLabel\)/);
