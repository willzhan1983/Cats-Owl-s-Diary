import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../riverside-dock-map-entry.js", import.meta.url), "utf8");
let clickHandler = null;
let appended = null;
let resetCall = null;
const detail = {
  querySelector(selector) {
    if (selector === "[data-riverside-dock-start]") return appended;
    return { appendChild(node) { appended = node; } };
  },
  appendChild(node) { appended = node; },
};
const sandbox = {
  levels: [{ world: "riverside_dock" }],
  state: { hearts: 3 },
  gameEntered: false,
  startBtn: { textContent: "" },
  text: { start: "开始" },
  messageEl: { textContent: "" },
  resetGame(...args) { resetCall = args; },
  preloadNearbyBackgrounds() {},
  document: {
    addEventListener(type, handler) { if (type === "click") clickHandler = handler; },
    querySelector(selector) {
      return selector.includes('data-region="riverside_dock"') ? {} : null;
    },
    getElementById(id) {
      if (id === "worldMapDetail") return detail;
      if (id === "worldMapPanel") return { hidden: false };
      if (id === "homeScreen") return { classList: { add() {} } };
      return null;
    },
    createElement() { return { dataset: {}, textContent: "", type: "" }; },
  },
  window: {
    CATS_OWLS_PROGRESS: { isWorldUnlocked: () => true },
    setTimeout(callback) { callback(); },
  },
};

vm.runInNewContext(source, sandbox);
assert.equal(typeof clickHandler, "function", "map entry should register a click handler");
clickHandler({
  preventDefault() {},
  target: { closest(selector) { return selector.includes('data-region="riverside_dock"') ? {} : null; } },
});
assert.equal(appended?.dataset?.riversideDockStart, "true");
assert.equal(appended?.textContent, "进入河畔码头篇");

clickHandler({
  preventDefault() {},
  target: { closest(selector) { return selector.includes("data-riverside-dock-start") ? {} : null; } },
});
assert.equal(resetCall?.[0], 0);
assert.equal(resetCall?.[1], true);
assert.equal(resetCall?.[2]?.startRiversideDockChapter, true);
assert.match(sandbox.messageEl.textContent, /河畔码头/);
