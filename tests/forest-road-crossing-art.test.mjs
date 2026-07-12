import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const artAssets = readFileSync(new URL("../art-assets.js", import.meta.url), "utf8");
const zebraArt = new URL("../assets/props/zebra_crossing.png", import.meta.url);

assert.ok(existsSync(zebraArt), "透明斑马线素材应存在");
assert.match(artAssets, /zebraCrossing: "assets\/props\/zebra_crossing\.png"/);
assert.match(artAssets, /zebraCrossing: window\.ART_ASSETS\.props\.zebraCrossing/);
assert.match(game, /drawPropImage\(ctx, "zebraCrossing", -zone\.w \/ 2, -zone\.h \/ 2, zone\.w, zone\.h\)/);
