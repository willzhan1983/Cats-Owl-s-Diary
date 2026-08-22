import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../world-map.js", import.meta.url), "utf8");

function element() {
  return {
    children: [],
    dataset: {},
    style: {},
    innerHTML: "",
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    addEventListener() {},
    setAttribute(name, value) {
      this[name] = value;
    },
  };
}

const map = element();
const detail = element();
const panel = element();
const elements = {
  worldMapGrid: map,
  worldMapDetail: detail,
  worldMapPanel: panel,
  worldMapBtn: element(),
};
const window = {
  addEventListener() {},
  CATS_OWLS_PROGRESS: {
    isWorldUnlocked(worldId) {
      return worldId === "acorn_town";
    },
  },
};
const document = {
  readyState: "complete",
  createElement: element,
  getElementById(id) {
    return elements[id] || null;
  },
  querySelectorAll() {
    return [];
  },
};

vm.runInNewContext(source, { document, window });
window.WorldMapSystem.renderWorldMap();

const nodes = new Map(
  map.children
    .filter((child) => child.dataset.region)
    .map((child) => [child.dataset.region, child])
);

assert.match(nodes.get("forest_road").innerHTML, />已解锁</);
assert.match(nodes.get("acorn_town").innerHTML, />已解锁</);
assert.match(nodes.get("riverside_dock").innerHTML, />未解锁</);
assert.doesNotMatch(map.children.map((child) => child.innerHTML).join(""), /可探索/);
