import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const wrongAction = game.match(/function applyRiversideDockWrongAction\([\s\S]*?\n}/)?.[0] || "";
const interaction = game.match(/function interactRiversideDockTask\([\s\S]*?\n}/)?.[0] || "";

assert.ok(wrongAction, "Riverside Dock wrong-action handler should exist");
assert.match(wrongAction, /wrongActionPenalty\(selectedDifficulty\)/);
assert.doesNotMatch(wrongAction, /state\.hearts/);
assert.match(game, /function restoreRiversideBridgeAttempt\(/);
assert.match(game, /kind === "route_marker"/);
assert.match(game, /kind === "dock_delivery"/);
assert.match(game, /kind === "bridge_slot"/);
assert.match(game, /kind === "water_gauge"/);
assert.match(game, /kind === "dock_signal"/);
assert.match(game, /kind === "dock_crossing"/);
assert.match(interaction, /advanceSequence/);
assert.match(interaction, /canCross/);
assert.match(interaction, /bridgeResetsOnMistake\(selectedDifficulty\)/);
assert.match(interaction, /waterSafe:\s*state\.tasksList\.some\(\(entry\) => entry\.id === "water_safe" && entry\.done\)/);
assert.match(interaction, /signalGreen:\s*state\.tasksList\.some\(\(entry\) => entry\.id === "signal_green" && entry\.done\)/);
assert.doesNotMatch(interaction, /waterSafe:\s*state\.riversideWaterSafe/);
assert.doesNotMatch(interaction, /signalGreen:\s*state\.riversideSignalGreen/);
assert.match(game, /signalWindowFor\(selectedDifficulty\)/);
assert.match(game, /WORLD_PREREQUISITES[\s\S]*riverside_dock: "acorn_town"/);
assert.match(game, /wetland_park: "riverside_dock"/);
