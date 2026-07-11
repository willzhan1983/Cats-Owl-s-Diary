import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const artAssets = readFileSync(new URL("../art-assets.js", import.meta.url), "utf8");

assert.ok(
  existsSync(new URL("../assets/props/sign_piece_pickup.png", import.meta.url)),
  "路牌碎片应使用单独的透明拾取物图片"
);
assert.match(artAssets, /signPiece: "assets\/props\/sign_piece_pickup\.png"/);
assert.match(
  artAssets,
  /forestSchoolDirectionSign: "assets\/props\/forest_school_direction_sign\.png"/
);
assert.match(
  game,
  /\{ x: 494, y: 412, r: 48, type: "wrongExit", label: "森林学校方向", propKey: "forestSchoolDirectionSign" \}/
);
assert.match(game, /signPiece: \{ x: -38, y: -35, w: 76, h: 70 \}/);
assert.match(
  game,
  /if \(area\.propKey && drawPropImage\(ctx, area\.propKey, -52, -78, 104, 118\)\) \{\n    ctx\.restore\(\);\n    return;/
);
