import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../style.css", import.meta.url), "utf8");

assert.match(game, /const worldMapPanel = document\.getElementById\("worldMapPanel"\);/);
assert.match(
  game,
  /if \(state\.activeDialogue\) return;\s*if \(worldMapPanel\?\.getAttribute\?\.\("aria-modal"\) === "true" && !worldMapPanel\.hidden\) return;\s*state\.time -= dt;/
);
assert.match(styles, /#worldMapBtn,\s*#recordsBtn,\s*#startBtn,\s*\.sound-btn\s*\{[\s\S]*?pointer-events: auto;/);
assert.match(styles, /@media \(min-width: 921px\) and \(max-height: 760px\)[\s\S]*?\.game-panel\s*\{[\s\S]*?100dvh - 164px/);

console.log("world map modal safety test passed");
