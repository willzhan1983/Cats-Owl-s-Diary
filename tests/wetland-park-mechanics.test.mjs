import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

assert.match(game, /function wetlandDifficultyConfig\(\)/);
assert.match(game, /function createWetlandAdventureState\(level\)/);
assert.match(game, /function updateWetlandParkMechanisms\(dt\)/);
assert.match(game, /state\.runPoints = Math\.max\(0, state\.runPoints - penalty\.points\)/);
