import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const frames = [
  "assets/characters/mimi/v6/idle.png",
  "assets/characters/mimi/v6/walk_1.png",
  "assets/characters/mimi/v6/walk_2.png",
  "assets/characters/mimi/v6/walk_3.png",
  "assets/characters/mimi/v6/walk_4.png",
  "assets/characters/mimi/v6/jump.png",
  "assets/characters/mimi/v6/happy.png",
  "assets/characters/owlly/v6/idle.png",
  "assets/characters/owlly/v6/fly_1.png",
  "assets/characters/owlly/v6/fly_2.png",
  "assets/characters/owlly/v6/fly_3.png",
  "assets/characters/owlly/v6/write.png",
  "assets/characters/owlly/v6/happy.png",
];

for (const frame of frames) assert.equal(existsSync(new URL(`../${frame}`, import.meta.url)), true, `${frame} should exist`);

const inspection = spawnSync("sips", ["-g", "hasAlpha", "-g", "pixelWidth", "-g", "pixelHeight", ...frames], { encoding: "utf8" });
assert.equal(inspection.status, 0, inspection.stderr);
assert.equal((inspection.stdout.match(/hasAlpha: yes/g) || []).length, frames.length, "every v6 frame should preserve alpha");
assert.equal((inspection.stdout.match(/pixelWidth: 1254/g) || []).length, frames.length, "every v6 frame should share one canvas width");
assert.equal((inspection.stdout.match(/pixelHeight: 1254/g) || []).length, frames.length, "every v6 frame should share one canvas height");

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
assert.match(game, /assets\/characters\/mimi\/v6\/idle\.png/);
assert.match(game, /assets\/characters\/owlly\/v6\/idle\.png/);
