import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

assert.match(html, /wetland-park-quiz-bank\.js/);
assert.match(html, /wetland-park-map-entry\.js/);
assert.match(game, /if \(!isWetlandParkLevel\(\)\) return false;/);
assert.match(game, /function drawWetlandParkTaskArt\(task\)/);
assert.ok(!/isMistSwampLevel\(\)\s*&&\s*.*wetland/.test(game));
