import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../style.css", import.meta.url), "utf8");

assert.match(game, /const worldMapPanel = document\.getElementById\("worldMapPanel"\);/);
assert.match(
  game,
  /function isGameplayOverlayOpen\(\)[\s\S]*?worldMapPanel\?\.getAttribute\?\.\("aria-modal"\) === "true" && !worldMapPanel\.hidden[\s\S]*?runHistoryPanel\?\.getAttribute\?\.\("aria-modal"\) === "true" && !runHistoryPanel\.hidden/
);
assert.match(game, /if \(syncGameplayOverlayPause\(\)\) return;\s*if \(!state\.running\) return;\s*state\.time -= dt;/);
assert.match(game, /function resumeGameplayTimers\(pauseStartedAt, pausedFor\)[\s\S]*?boss\.purificationUntil = shiftActiveDeadline/);
assert.match(styles, /#worldMapBtn,\s*#recordsBtn,\s*#startBtn,\s*\.sound-btn\s*\{[\s\S]*?pointer-events: auto;/);
assert.match(styles, /@media \(min-width: 921px\) and \(max-height: 760px\)[\s\S]*?\.canvas-wrap\s*\{[\s\S]*?100dvh - 190px/);

console.log("world map modal safety test passed");
