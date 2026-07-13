import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const art = readFileSync(new URL("../art-assets.js", import.meta.url), "utf8");
const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

assert.ok(existsSync(new URL("../assets/items/pearl_crown.png", import.meta.url)), "深海珍珠王冠 PNG 应存在");
assert.match(art, /pearlCrown: "assets\/items\/pearl_crown\.png"/);
assert.match(game, /pearlCrown: "pearlCrown"/);
assert.match(game, /pearlCrown: \{ x: -36, y: -34, w: 72, h: 64 \}/);
