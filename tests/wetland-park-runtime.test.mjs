import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

assert.match(html, /wetland-park-quiz-bank\.js/);
assert.match(html, /wetland-park-map-entry\.js/);
assert.match(game, /if \(!isWetlandParkLevel\(\)\) return false;/);
assert.match(game, /function drawWetlandParkTaskArt\(task\)/);
assert.match(game, /function drawWetlandParkImage\(key, bounds\)/);
assert.match(game, /wetlandFogEntrance: "\.\/assets\/wetland-park-generated\/fog_entrance\.png"/);
assert.match(game, /fogCrocodile: \{ key: "fogCrocodile", bounds: \{ x: -92, y: -126, w: 184, h: 126 \} \}/);
assert.ok(!/isMistSwampLevel\(\)\s*&&\s*.*wetland/.test(game));
