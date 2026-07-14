import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const chapters = [
  ["forest-school-map-entry.js", "进入森林学校篇", "data-forest-school-start", "resetGame(0, keepHearts)"],
  ["moonlight-map-entry.js", "进入月光湖篇", "data-moonlight-start", "resetGame(levelIndex, keepHearts)"],
  ["apple-valley-map-entry.js", "进入苹果谷篇", "data-apple-valley-start", "resetGame(levelIndex, keepHearts)"],
  ["forest-road-map-entry.js", "进入森林公路篇", "data-forest-road-start", "resetGame(levelIndex, keepHearts)"],
  ["mist-swamp-map-entry.js", "进入迷雾沼泽篇", "data-mist-swamp-start", "resetGame(levelIndex, keepHearts)"],
];

for (const [file, label, marker, resetCall] of chapters) {
  const url = new URL(`../${file}`, import.meta.url);
  assert.ok(existsSync(url), `${file} should exist`);
  assert.match(index, new RegExp(`<script src="\\./${file}"></script>`));
  const entry = readFileSync(url, "utf8");
  assert.ok(entry.includes(label));
  assert.ok(entry.includes(marker));
  assert.ok(entry.includes(resetCall));
}

const mistSwampEntry = readFileSync(new URL("../mist-swamp-map-entry.js", import.meta.url), "utf8");
assert.match(mistSwampEntry, /if \(!Array\.isArray\(levels\)\) return -1;/);
assert.doesNotMatch(mistSwampEntry, /window\.CATS_OWLS_GAME_DATA\?\.levels/);
