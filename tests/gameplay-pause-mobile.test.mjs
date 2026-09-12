import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const mobile = readFileSync(new URL("../mobile-fixes.css", import.meta.url), "utf8");
const styles = readFileSync(new URL("../style.css", import.meta.url), "utf8");

const prepareRoute = game.match(/function prepareWetlandMemoryRoute\(\)[\s\S]*?\n\}/)?.[0] || "";
assert.match(prepareRoute, /routeVisibleUntil = 0;/);
assert.match(game, /function startWetlandMemoryRoute\(\)[\s\S]*?routeVisibleUntil = performance\.now\(\) \+ 4200/);
assert.match(game, /function closeDialogue\(\)[\s\S]*?task\?\.kind === "wetland_npc"[\s\S]*?startWetlandMemoryRoute\(\);/);
assert.match(game, /function hasCurrentRunProgress\(\)[\s\S]*?state\.time < state\.levelTime - 1/);
assert.match(game, /if \(hasCurrentRunProgress\(\) && !window\.confirm\("重新开始会失去这一关当前进度，确定要重来吗？"\)\) return;/);
assert.match(game, /function setStartButton\(label, restarting = false\)[\s\S]*?classList\.toggle\("is-restart", restarting\)/);
assert.match(mobile, /#startBtn\.is-restart::after \{ content: "\\21BB";/);
assert.match(styles, /@media \(max-width: 920px\) and \(orientation: portrait\)[\s\S]*?\.canvas-wrap\s*\{[\s\S]*?align-self: start;/);

console.log("gameplay pause and mobile controls test passed");
