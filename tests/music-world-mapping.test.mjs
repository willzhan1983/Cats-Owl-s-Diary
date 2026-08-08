import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

assert.match(
  game,
  /const key = MUSIC_WORLD_ALIASES\[level\?\.world\] \|\| level\?\.world;/,
  "关卡音乐应先应用世界别名",
);
assert.match(
  game,
  /return Object\.hasOwn\(MUSIC_BY_WORLD, key\) \? key : "forest_school";/,
  "关卡音乐应使用别名映射后的 key",
);
assert.match(game, /mist_swamp: "dark_swamp"/, "迷雾沼泽应映射到黑暗沼泽音乐");

console.log("music world mapping test passed");
