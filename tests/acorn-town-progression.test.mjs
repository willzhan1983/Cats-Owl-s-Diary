import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const worldMap = readFileSync(new URL("../world-map.js", import.meta.url), "utf8");
const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const entryUrl = new URL("../acorn-town-map-entry.js", import.meta.url);

assert.ok(existsSync(entryUrl), "Acorn Town map entry should exist");
const entry = readFileSync(entryUrl, "utf8");
assert.match(game, /catsOwlCompletedWorlds/);
assert.match(game, /markWorldCompleted\(currentWorld\)/);
assert.match(game, /function nextPlayableLevelIndex\(/);
assert.match(worldMap, /CATS_OWLS_PROGRESS\?\.isWorldUnlocked/);
assert.match(worldMap, /\["acorn_town", "riverside_dock", "wetland_park", "mist_swamp"\]\.includes\(regionId\)/);
assert.match(entry, /CATS_OWLS_PROGRESS\?\.isWorldUnlocked\("acorn_town"\)/);
assert.match(entry, /进入橡果镇篇/);
assert.match(index, /<script src="\.\/acorn-town-map-entry\.js\?v=acorn-town-20260729"><\/script>/);
assert.match(index, /<script src="\.\/game\.js\?v=riverside-dock-polish-20260827"><\/script>/);
assert.match(index, /<script src="\.\/art-assets\.js\?v=riverside-dock-assets-20260826"><\/script>/);
assert.match(index, /<script src="\.\/world-map\.js\?v=acorn-town-20260729"><\/script>/);
