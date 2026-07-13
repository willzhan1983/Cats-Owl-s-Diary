import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const collectibles = source.match(/function drawCollectibles\(\) \{[\s\S]*?\n\}/)?.[0] || "";

assert.match(source, /const APPLE_VALLEY_COLLECTIBLE_BOB = 1\.5;/);
assert.match(source, /function isAppleValleyLevel\(\)/);
assert.match(source, /function drawGroundedArtPackImage\(category, key, x, y, width, height\)/);
assert.match(source, /function appleValleyTaskGroundShadow\(task\)/);
assert.match(source, /function drawAppleValleyGroundShadow\(x, y, width, height\)/);

const shadowIndex = collectibles.indexOf("drawAppleValleyGroundShadow(");
const bobTransformIndex = collectibles.indexOf("ctx.translate(0, bob)");
assert.ok(shadowIndex >= 0, "collectibles should draw a ground shadow");
assert.ok(bobTransformIndex >= 0, "collectibles should apply bob after the fixed position");
assert.ok(shadowIndex < bobTransformIndex, "Apple Valley collectible shadow should stay fixed below the bobbing sprite");

assert.match(source, /isAppleValleyLevel\(\) \? APPLE_VALLEY_COLLECTIBLE_BOB : 5/);
assert.match(source, /obstacle\.type === "appleTree" && isAppleValleyLevel\(\)/);
assert.match(source, /isAppleValleyLevel\(\)[\s\S]*?drawGroundedArtPackImage\("props", key, bounds\.x, bounds\.y, bounds\.w, bounds\.h\)/);
