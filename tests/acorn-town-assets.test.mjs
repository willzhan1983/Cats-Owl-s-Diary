import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function pngInfo(url) {
  const data = readFileSync(url);
  assert.equal(data.subarray(1, 4).toString("ascii"), "PNG");
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    colorType: data[25],
  };
}

const background = pngInfo(new URL("../assets/bg/acorn_town_plaza.png", import.meta.url));
assert.deepEqual([background.width, background.height], [1672, 941]);

const transparentAssets = [
  "assets/props/acorn_postbox.png",
  "assets/items/acorn_letter.png",
  "assets/items/acorn.png",
  "assets/items/fake_acorn.png",
  "assets/items/acorn_basket.png",
  "assets/props/acorn_exchange_stall.png",
  "assets/props/acorn_order_board.png",
  "assets/items/travel_star.png",
  "assets/props/acorn_notice_board_broken.png",
  "assets/props/acorn_notice_board_repaired.png",
  "assets/items/acorn_notice_fragment.png",
  "assets/props/acorn_town_cart.png",
  "assets/props/riverside_dock_sign.png",
];

for (const path of transparentAssets) {
  const info = pngInfo(new URL(`../${path}`, import.meta.url));
  assert.deepEqual([info.width, info.height], [1024, 1024], `${path} canvas mismatch`);
  assert.ok([4, 6].includes(info.colorType), `${path} must contain an alpha channel`);
}
