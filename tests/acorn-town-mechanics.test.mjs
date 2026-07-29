import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

for (const name of [
  "taskDependenciesMet",
  "applyAcornTownWrongAction",
  "finishMatchedDelivery",
]) {
  assert.match(game, new RegExp(`function ${name}\\(`));
}

assert.match(game, /entry\.requiresTaskId/);
assert.match(game, /entry\.decoy/);
assert.match(game, /task\.kind === "matched_delivery"/);
assert.match(game, /task\.kind === "decoy_target"/);
assert.match(game, /这不是真橡果/);
assert.match(game, /这封信不是寄到这里的/);

for (const name of ["finishMarketTrade", "finishNoticeSlot"]) {
  assert.match(game, new RegExp(`function ${name}\\(`));
}
assert.match(game, /订单 A/);
assert.match(game, /订单 B/);
assert.match(game, /订单 C/);
assert.match(game, /公告碎片放错位置/);
assert.match(game, /reward: "travelStar"/);
