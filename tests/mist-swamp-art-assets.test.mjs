import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

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

function readRgbaPng(path) {
  const png = readFileSync(new URL(path, root));
  assert.equal(png.toString("hex", 0, 8), "89504e470d0a1a0a", `${path} must be PNG`);
  let offset = 8;
  let width;
  let height;
  let colorType;
  const idat = [];
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("ascii", offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      assert.equal(data[8], 8, `${path} must use 8-bit channels`);
      colorType = data[9];
    }
    if (type === "IDAT") idat.push(data);
    offset += length + 12;
  }
  assert.equal(colorType, 6, `${path} must be RGBA`);
  const packed = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const pixels = Buffer.alloc(stride * height);
  let input = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = packed[input++];
    for (let x = 0; x < stride; x += 1) {
      const raw = packed[input++];
      const left = x >= 4 ? pixels[y * stride + x - 4] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upperLeft = y > 0 && x >= 4 ? pixels[(y - 1) * stride + x - 4] : 0;
      let value = raw;
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += Math.floor((left + up) / 2);
      else if (filter === 4) {
        const p = left + up - upperLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upperLeft);
        value += pa <= pb && pa <= pc ? left : pb <= pc ? up : upperLeft;
      } else assert.equal(filter, 0, `${path} uses an unsupported PNG filter`);
      pixels[y * stride + x] = value & 255;
    }
  }
  return { width, height, pixels };
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
    ["swampSnail", "assets/npc/swamp_snail.png"],
    ["mistSpirit", "assets/npc/mist_spirit.png"],
    ["mudMonster", "assets/npc/mud_monster.png"],
  ]) {
    assert.equal(existsSync(new URL(path, root)), true, `${path} should exist`);
    assert.match(artAssets, new RegExp(`${key}: ["']\\./${path}["']`));
    assert.deepEqual(pngInfo(path), { width: 768, height: 768, colorType: 6 });
    const { width, height, pixels } = readRgbaPng(path);
    const alphaAt = (x, y) => pixels[(y * width + x) * 4 + 3];
    assert.deepEqual(
      [alphaAt(0, 0), alphaAt(width - 1, 0), alphaAt(0, height - 1), alphaAt(width - 1, height - 1)],
      [0, 0, 0, 0],
      `${path} corners must be transparent`,
    );
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

test("final Mist Swamp replacement art uses transparent PNG files", () => {
  for (const path of [
    "assets/props/broken_bridge.png",
    "assets/obstacles/soft_mud.png",
    "assets/props/mushroom_lamp_yellow.png",
    "assets/props/mushroom_lamp_blue.png",
    "assets/props/mushroom_lamp_purple.png",
    "assets/props/mushroom_lamp_green.png",
  ]) {
    const { width, height, pixels } = readRgbaPng(path);
    assert.equal(width, 512, `${path} width`);
    assert.equal(height, 512, `${path} height`);
    const alphaAt = (x, y) => pixels[(y * width + x) * 4 + 3];
    assert.deepEqual(
      [alphaAt(0, 0), alphaAt(width - 1, 0), alphaAt(0, height - 1), alphaAt(width - 1, height - 1)],
      [0, 0, 0, 0],
      `${path} corners must be transparent`,
    );
    assert.ok(Array.from({ length: width * height }, (_, index) => pixels[index * 4 + 3]).some(Boolean), `${path} must contain visible pixels`);
  }
});

test("final Mist Swamp props are registered with guarded render paths", () => {
  for (const [key, path] of [
    ["brokenBridge", "assets/props/broken_bridge.png"],
    ["mushroomLampYellow", "assets/props/mushroom_lamp_yellow.png"],
    ["mushroomLampBlue", "assets/props/mushroom_lamp_blue.png"],
    ["mushroomLampPurple", "assets/props/mushroom_lamp_purple.png"],
    ["mushroomLampGreen", "assets/props/mushroom_lamp_green.png"],
  ]) {
    assert.match(artAssets, new RegExp(`${key}: ["']${path}["']`));
  }
  assert.match(artAssets, /softMud: ["']\.\/assets\/obstacles\/soft_mud\.png["']/);
  assert.match(game, /const MIST_SWAMP_MUSHROOM_ART_KEYS = \{/);
  assert.match(game, /isMistSwampLevel\(\) && task\.kind === "mushroom_lamp"/);
  assert.match(game, /softMud: "softMud"/);
  assert.match(game, /else if \(obstacle\.type === "softMud" && isMistSwampLevel\(\)\) drawGroundPuddle/);
  assert.match(game, /function drawMudBossCore\(task\)/);
});
