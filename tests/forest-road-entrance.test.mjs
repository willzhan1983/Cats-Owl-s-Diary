import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const entrance = source.match(/name: "森林公路入口",[\s\S]*?\n    puddles:/)?.[0];

assert.ok(entrance, "森林公路入口配置应存在");
assert.equal(
  (entrance.match(/roadClearTask\(/g) || []).length,
  12,
  "森林公路入口应包含 12 个清路障碍"
);
