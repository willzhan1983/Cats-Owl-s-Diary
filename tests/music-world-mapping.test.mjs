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
assert.match(game, /MUSIC_BY_WORLD\.wetland_park = MUSIC_BY_WORLD\.dark_swamp;/, "湿地普通关应复用稳定的沼泽音轨");
assert.match(game, /MUSIC_BY_WORLD\.wetland_boss = MUSIC_BY_WORLD\.boss;/, "湿地巨鳄关应复用稳定的 Boss 音轨");
assert.match(game, /if \(level\?\.id === "wetland_fog_crocodile"\) return "wetland_boss";/, "巨鳄关应使用独立音乐 key");
assert.match(game, /MUSIC_PATTERN_BY_WORLD\.wetland_park = "danger";/);
assert.match(game, /MUSIC_PATTERN_BY_WORLD\.wetland_boss = "boss";/);

console.log("music world mapping test passed");
