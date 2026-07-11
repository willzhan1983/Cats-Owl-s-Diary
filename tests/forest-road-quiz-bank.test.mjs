import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const artAssets = readFileSync(new URL("../art-assets.js", import.meta.url), "utf8");
const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bankUrl = new URL("../forest-road-quiz-bank.js", import.meta.url);

assert.ok(existsSync(bankUrl), "森林公路随机题库脚本应存在");
const bank = readFileSync(bankUrl, "utf8");

assert.match(index, /<script src="\.\/forest-road-quiz-bank\.js\?v=forest-road-quiz-20260711"><\/script>/);
assert.match(artAssets, /appleValleyMapSign: "assets\/props\/apple_valley_map_sign\.png"/);
assert.match(
  game,
  /\{ x: 144, y: 246, r: 48, type: "wrongExit", label: "苹果谷方向", propKey: "appleValleyMapSign" \}/
);
assert.equal((bank.match(/difficulty: "/g) || []).length, 24, "题库应有 24 道分难度随机题");
assert.equal((bank.match(/forestRoadShared: true/g) || []).length, 1, "题库注入应使用一个统一任务标记");
assert.match(bank, /const wasRunning = state\.running;/);
assert.match(bank, /if \(wasRunning\) \{\n      state\.running = true;/);
for (const level of ["森林公路入口", "弯弯森林小路", "护送小动物过路", "橡果镇路口"]) {
  assert.match(bank, new RegExp(`level: "${level}"`));
}
