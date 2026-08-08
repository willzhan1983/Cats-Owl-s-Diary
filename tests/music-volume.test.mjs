import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

assert.match(game, /const BGM_AUDIO_VOLUME = 0\.42;/);
assert.match(game, /const BGM_SYNTH_GAIN = 0\.12;/);
assert.match(game, /music\.audio\.volume = BGM_AUDIO_VOLUME;/);
assert.match(game, /music\.master\.gain\.value = BGM_SYNTH_GAIN;/);

console.log("music volume test passed");
