import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const expected = [
  ["wetland_fog_entrance", "雾中入口"],
  ["wetland_reed_maze", "芦苇迷径"],
  ["wetland_drift_crossing", "浮木渡口"],
  ["wetland_ruin_mirrors", "沼泽遗迹"],
  ["wetland_fog_crocodile", "迷雾巨鳄·沼泽守门人"],
];

for (const [id, name] of expected) {
  assert.match(game, new RegExp(`id: "${id}"[\\s\\S]{0,300}?name: "${name}"`));
}
assert.match(game, /WORLD_MAP\.wetland_park\.levels = levels[\s\S]*level\.world === "wetland_park"/);
