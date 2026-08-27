import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const quizBank = readFileSync(new URL("../riverside-dock-quiz-bank.js", import.meta.url), "utf8");

assert.match(game, /function riversideDockStartMessage\(level\)[\s\S]*?routeHintFor\(selectedDifficulty\)/);
assert.match(game, /function currentLevelStartMessage\(\)[\s\S]*?level\?\.world === "riverside_dock"[\s\S]*?riversideDockStartMessage\(level\)/);
assert.match(game, /if \(initialLevel > 0\) \{[\s\S]*?startBtn\.textContent = text\.start[\s\S]*?messageEl\.textContent = currentLevelStartMessage\(\)/);
assert.match(game, /task\.kind === "route_marker"[\s\S]*?routeHintFor\(selectedDifficulty\)/);
assert.match(index, /riverside-dock-rules\.js\?v=riverside-dock-difficulty-20260822/);
assert.match(index, /game\.js\?v=character-v6-20260827/);
assert.match(index, /riverside-dock-quiz-bank\.js\?v=riverside-dock-polish-20260827/);
assert.match(quizBank, /if \(wasRunning\)[\s\S]*?text\.restart[\s\S]*?else[\s\S]*?text\.start/);
