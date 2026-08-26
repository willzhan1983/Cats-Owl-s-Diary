import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

const assets = [
  ["dockPass", "assets/items/dock_pass.png"],
  ["rescueRing", "assets/items/rescue_ring.png"],
  ["brokenPaddle", "assets/items/broken_paddle.png"],
  ["woodenPlank", "assets/items/wooden_plank.png"],
  ["dockRope", "assets/items/dock_rope.png"],
  ["deliveryPackage", "assets/items/delivery_package.png"],
  ["wetlandPass", "assets/items/wetland_pass.png"],
  ["waterGauge", "assets/props/water_gauge.png"],
  ["dockSignal", "assets/props/dock_signal.png"],
];

for (const [, path] of assets) {
  const url = new URL(`../${path}`, import.meta.url);
  assert.ok(existsSync(url), `${path} should exist`);
  const data = readFileSync(url);
  assert.equal(data.subarray(1, 4).toString("ascii"), "PNG", `${path} should be a PNG`);
  assert.ok([4, 6].includes(data[25]), `${path} should preserve alpha`);
}
assert.ok(existsSync(new URL("../assets/audio/bgm_riverside_dock.mp3", import.meta.url)), "Riverside Dock BGM should exist");

const source = readFileSync(new URL("../art-assets.js", import.meta.url), "utf8");
const sandbox = { window: {}, document: { documentElement: { dataset: {} } }, Image: class { set src(value) { this.srcValue = value; } } };
vm.runInNewContext(source, sandbox);
for (const [key, path] of assets) {
  assert.equal(sandbox.window.ART_ASSETS.props[key], path, `${key} path should be public`);
  assert.equal(sandbox.window.CATS_OWLS_ART_PACK_01.registry.props[key], path, `${key} should preload`);
}

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
assert.match(game, /riverside_dock: "assets\/audio\/bgm_riverside_dock\.mp3"/);
assert.match(game, /function drawRiversideDockTaskArt\(task\)/);
