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
assert.match(game, /fogCrocodile: \{ key: "fogCrocodile", bounds: \{ x: -74, y: -101, w: 148, h: 101 \} \}/);
assert.ok(!/isMistSwampLevel\(\)\s*&&\s*.*wetland/.test(game));
assert.match(game, /wetlandFloatingLog: "\.\/assets\/wetland-park-generated\/props\/floating_log\.png"/);
assert.match(game, /function drawWetlandPlatforms\(\)/);
assert.match(game, /ctx\.globalAlpha = platform\.submergedUntil > performance\.now\(\) \? 0\.32 : 1/);
assert.match(game, /phase: "avoid"/);
assert.match(game, /phase = "collect"/);
assert.match(game, /phase = "purify"/);
assert.match(game, /function drawWetlandBossEffects\(\)/);
assert.match(game, /drawWetlandBossEffects\(\);/);
assert.match(game, /touchDirs\.add\("interact"\)/);
assert.match(game, /touchDirs\.delete\("interact"\)/);
assert.match(game, /attackBtn\.hidden = isWetlandBossLevel\(\)/);
