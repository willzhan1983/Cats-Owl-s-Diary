import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const entry = readFileSync(new URL("../wetland-park-map-entry.js", import.meta.url), "utf8");

assert.match(game, /wetland_park:\s*"riverside_dock"/);
assert.match(game, /mist_swamp:\s*"wetland_park"/);
assert.match(entry, /const WORLD_ID = "wetland_park"/);
assert.match(entry, /data-wetland-park-start/);
assert.match(entry, /startWetlandParkChapter: true/);
