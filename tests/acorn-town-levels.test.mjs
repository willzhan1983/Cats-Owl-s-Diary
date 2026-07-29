import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const section = game.match(/id: "acorn_post_office"[\s\S]*?name: "小镇公告板"[\s\S]*?\n  },\n];/)?.[0];

assert.ok(section, "Acorn Town four-level section should exist");
assert.equal((section.match(/world: "acorn_town"/g) || []).length, 4);
for (const name of ["橡果镇邮局", "寻找丢失的橡果", "橡果集市兑换", "小镇公告板"]) {
  assert.match(section, new RegExp(`name: "${name}"`));
}
for (const id of ["acorn_post_office", "acorn_hunt", "acorn_market", "acorn_notice_board"]) {
  assert.match(section, new RegExp(`id: "${id}"`));
}
assert.match(game, /WORLD_MAP\.acorn_town\.levels = levels/);
assert.match(game, /CATS_OWLS_ACORN_TOWN_RULES\.visibleAtDifficulty/);
assert.match(game, /CATS_OWLS_ACORN_TOWN_RULES\.timeFor/);
