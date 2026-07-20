import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const game = readFileSync(new URL("game.js", root), "utf8");
const artAssets = readFileSync(new URL("art-assets.js", root), "utf8");

function pngInfo(path) {
  const bytes = readFileSync(new URL(path, root));
  assert.equal(bytes.toString("ascii", 1, 4), "PNG", `${path} must be PNG`);
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    colorType: bytes[25],
  };
}

test("remaining Mist Swamp backgrounds use dedicated 1672x941 PNG files", () => {
  for (const [key, path] of [
    ["mistSwampEntrance", "assets/bg/mist_swamp_entrance.png"],
    ["fireflyTrailPath", "assets/bg/firefly_trail_path.png"],
    ["sleepingWoodenBridge", "assets/bg/sleeping_wooden_bridge.png"],
    ["mistCoreClearing", "assets/bg/mist_core_clearing.png"],
    ["mudMonsterLair", "assets/bg/mud_monster_lair.png"],
  ]) {
    assert.equal(existsSync(new URL(path, root)), true, `${path} should exist`);
    assert.match(game, new RegExp(`${key}: ["']\\./${path}["']`));
    assert.deepEqual(pngInfo(path), { width: 1672, height: 941, colorType: 2 });
  }
});

test("remaining Mist Swamp characters are registered transparent PNG files", () => {
  for (const [key, path] of [
    ["ruru", "assets/npc/ruru_raccoon.png"],
    ["fireflyGuide", "assets/npc/firefly_guide.png"],
    ["littleFrog", "assets/npc/little_frog.png"],
    ["mistSpirit", "assets/npc/mist_spirit.png"],
    ["mudMonster", "assets/npc/mud_monster.png"],
  ]) {
    assert.equal(existsSync(new URL(path, root)), true, `${path} should exist`);
    assert.match(artAssets, new RegExp(`${key}: ["']\\./${path}["']`));
    assert.deepEqual(pngInfo(path), { width: 768, height: 768, colorType: 6 });
  }
});

test("Mist Swamp items, props, and effects are registered transparent PNG files", () => {
  for (const [key, path] of [
    ["lightSpore", "assets/items/light_spore.png"],
    ["fireflyLantern", "assets/items/firefly_lantern.png"],
    ["mistBadge", "assets/items/mist_badge.png"],
    ["bigMistLamp", "assets/props/big_mist_lamp.png"],
    ["darkMistBubble", "assets/effects/dark_mist_bubble.png"],
  ]) {
    assert.equal(existsSync(new URL(path, root)), true, `${path} should exist`);
    assert.match(artAssets, new RegExp(`${key}: ["'](?:\\./)?${path}["']`));
    assert.deepEqual(pngInfo(path), { width: 512, height: 512, colorType: 6 });
  }
});
