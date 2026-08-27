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
assert.equal((section.match(/type: "brokenPaddle"/g) || []).length, 0);
assert.equal((section.match(/"brokenPaddle"/g) || []).length, 2);
assert.match(section, /item\(714, 344, "brokenPaddle", "损坏船桨"\)[\s\S]*?minDifficulty: "normal"/);
assert.match(section, /item\(610, 390, "brokenPaddle", "损坏船桨"\)[\s\S]*?minDifficulty: "crazy"/);
assert.match(section, /id: "bridge_short"[\s\S]*?need: "plankShort"[\s\S]*?animal: "bridgePlank"/);
assert.match(section, /id: "bridge_medium"[\s\S]*?need: "plankMedium"[\s\S]*?animal: "bridgePlank"/);
assert.match(section, /id: "bridge_long"[\s\S]*?need: "plankLong"[\s\S]*?animal: "bridgePlank"/);
assert.match(game, /plankShort: \{ x: -29, y: -14, w: 58, h: 28 \}/);
assert.match(game, /plankMedium: \{ x: -42, y: -18, w: 84, h: 36 \}/);
assert.match(game, /plankLong: \{ x: -55, y: -22, w: 110, h: 44 \}/);
assert.match(game, /bridge_short: "plankShort"[\s\S]*?bridge_medium: "plankMedium"[\s\S]*?bridge_long: "plankLong"/);
assert.match(game, /bridgePlank: \{ key: "woodenPlank", bounds: bridgeBounds \|\| "woodenPlank" \}/);
assert.match(game, /WORLD_MAP\.riverside_dock\.levels = levels/);
