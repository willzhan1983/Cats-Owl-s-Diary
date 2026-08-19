import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const start = game.indexOf('id: "riverside_dock_entrance"');
const end = game.indexOf("WORLD_MAP.riverside_dock.levels", start);

assert.ok(start >= 0, "Riverside Dock level data should exist");
assert.ok(end > start, "Riverside Dock world mapping should follow the level data");
const section = game.slice(start, end);
const expected = [
  ["riverside_dock_entrance", "码头入口"],
  ["riverside_paddle_search", "寻找丢失的船桨"],
  ["riverside_bridge_repair", "修复河上木桥"],
  ["riverside_safe_crossing", "安全渡河"],
];

assert.equal((section.match(/world: "riverside_dock"/g) || []).length, 4);
for (const [id, name] of expected) {
  assert.match(section, new RegExp(`id: "${id}"[\\s\\S]*?name: "${name}"`));
}
assert.match(game, /WORLD_MAP\.riverside_dock\.levels = levels/);
