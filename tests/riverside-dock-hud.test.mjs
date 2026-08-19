import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const dayNames = game.match(/const dayNames = \[[\s\S]*?\n\];/)?.[0] || "";

for (const name of ["码头入口", "寻找丢失的船桨", "修复河上木桥", "安全渡河"]) {
  assert.match(dayNames, new RegExp(`"${name}"`), `HUD should show ${name} instead of a numeric fallback`);
}
