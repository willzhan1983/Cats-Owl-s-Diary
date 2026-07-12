import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const quizBank = readFileSync(new URL("../forest-road-quiz-bank.js", import.meta.url), "utf8");
const levelNames = ["森林公路入口", "弯弯森林小路", "护送小动物过路", "橡果镇路口"];

function levelBlock(name) {
  const start = game.indexOf(`name: "${name}"`);
  const end = game.indexOf("\n  },\n  {", start);
  assert.notEqual(start, -1, `${name} 配置应存在`);
  return game.slice(start, end === -1 ? undefined : end);
}

const points = [];
for (const name of levelNames) {
  const block = levelBlock(name);
  for (const match of block.matchAll(/(?:roadClearTask|directionSignTask|exitTask|escortNpcTask)\((\d+),\s*(\d+)/g)) {
    points.push({ name, x: Number(match[1]), y: Number(match[2]) });
  }
}
for (const match of quizBank.matchAll(/\{ level: "([^"]+)", x: (\d+), y: (\d+)/g)) {
  points.push({ name: match[1], x: Number(match[2]), y: Number(match[3]) });
}

assert.ok(points.length > 0, "位置扫描应找到森林公路任务点");
assert.equal(points.filter((point) => point.x < 80 || point.x > 820 || point.y < 130 || point.y > 420).length, 0, "out-of-safe-area points = 0");
assert.equal(points.filter((point) => point.x > 830).length, 0, "x > 830 = 0");
assert.equal(points.filter((point) => point.y > 420).length, 0, "y > 420 = 0");

const overlaps = points.flatMap((point, index) =>
  points.slice(index + 1).filter((other) => point.name === other.name && Math.hypot(point.x - other.x, point.y - other.y) < 56)
);
assert.equal(overlaps.length, 0, "unexpected overlaps = 0");

console.log(`Forest Road position scan: ${points.length} points, out-of-safe-area points = 0, x > 830 = 0, y > 420 = 0, unexpected overlaps = 0`);
