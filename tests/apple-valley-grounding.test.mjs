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

const appleValleyLevels = [...source.matchAll(/world: "apple_valley",\n\s*time: \d+,\n\s*start: \{ x: \d+, y: (\d+) \}/g)];
assert.equal(appleValleyLevels.length, 4, "all four Apple Valley levels should expose a start position");
for (const [, startY] of appleValleyLevels) {
  assert.ok(Number(startY) >= 430 && Number(startY) <= 440, `Apple Valley start.y ${startY} should stay on visible ground`);
}

const harvestOrchard = source.match(/name: "丰收果园"[\s\S]*?name: "果篮整理站"/)?.[0] || "";
const orchardPit = harvestOrchard.match(/\{ type: "pit", x: (\d+), y: (\d+), r: 24 \}/);
assert.ok(orchardPit, "Harvest Orchard should include its pit obstacle");
assert.ok(Number(orchardPit[1]) >= 810 && Number(orchardPit[1]) <= 820, "Harvest Orchard pit.x should stay inside the safe area");
assert.ok(Number(orchardPit[2]) >= 395 && Number(orchardPit[2]) <= 405, "Harvest Orchard pit.y should stay inside the safe area");

const basketStation = source.match(/name: "果篮整理站"[\s\S]*?name: "送给猫头鹰校长"/)?.[0] || "";
const languageSign = basketStation.match(/quizTask\((\d+), (\d+), "丰收语文牌"/);
assert.ok(languageSign, "Basket Sorting Station should include its language quiz sign");
const languageSignX = Number(languageSign[1]);
const languageSignY = Number(languageSign[2]);
assert.ok(languageSignX >= 660 && languageSignX <= 700, "Basket Sorting Station quiz sign should stay clear of mobile overlays");
assert.ok(languageSignY <= 420, "Basket Sorting Station quiz sign should not sit under foreground foliage");
assert.ok(languageSignX + 36 <= 840, "Basket Sorting Station quiz sign should stay inside the safe area");
assert.ok(Math.hypot(languageSignX - 706, languageSignY - 410) > 80, "Basket Sorting Station quiz sign should not overlap the right puddle");
assert.ok(Math.hypot(languageSignX - 510, languageSignY - 435) > 100, "Basket Sorting Station quiz sign should not overlap the player start");
assert.ok(Math.hypot(languageSignX - 804, languageSignY - 352) > 80, "Basket Sorting Station quiz sign should not overlap the right green apple");
assert.ok(Math.hypot(languageSignX - 626, languageSignY - 250) > 80, "Basket Sorting Station quiz sign should not overlap the green basket");

const schoolDelivery = source.match(/name: "送给猫头鹰校长"[\s\S]*?name: "森林公路入口"/)?.[0] || "";
const riddleSign = schoolDelivery.match(/quizTask\((\d+), (\d+), "分享理解题"/);
assert.ok(riddleSign, "School Delivery should include its riddle sign");
assert.ok(Number(riddleSign[1]) >= 700 && Number(riddleSign[1]) <= 760, "School Delivery riddle sign should stay clear of mobile overlays");
assert.ok(Number(riddleSign[2]) <= 410, "School Delivery riddle sign should remain on visible ground");
assert.ok(Number(riddleSign[1]) + 36 <= 840, "School Delivery riddle sign should stay inside the safe area");
assert.ok(Math.hypot(Number(riddleSign[1]) - 632, Number(riddleSign[2]) - 390) > 70, "School Delivery riddle sign should not overlap the right puddle");
assert.ok(Math.hypot(Number(riddleSign[1]) - 520, Number(riddleSign[2]) - 435) > 100, "School Delivery riddle sign should not overlap the player start");

const foregroundFoliageY = Number(source.match(/const y = (\d+) \+ \(i % 4\) \* 9;/)?.[1]);
assert.equal(foregroundFoliageY, 510, "foreground foliage baseline should remain stable");
for (const [, startY] of appleValleyLevels) {
  assert.ok(Number(startY) + 50 < foregroundFoliageY, "player feet should remain clear of foreground foliage");
}
