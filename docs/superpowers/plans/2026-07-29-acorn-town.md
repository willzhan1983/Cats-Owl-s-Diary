# Acorn Town Chapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete four-level Acorn Town chapter with shared warm-autumn plaza art, difficulty-scaled tasks, gated fourth-grade quizzes, and world-map progression to Riverside Dock.

**Architecture:** Keep the existing classic-script game architecture. Add one small pure-rules file for difficulty visibility and penalties, keep the four level definitions and runtime integration in `game.js`, and follow the existing separate quiz-bank/map-entry script pattern. New raster art is created only through Image Gen, with Adobe Photoshop used only if transparent-edge cleanup is required.

**Tech Stack:** HTML5 Canvas, browser JavaScript classic scripts, localStorage, Node.js built-in test runner, PNG assets, Image Gen, optional Adobe Photoshop cleanup.

## Global Constraints

- Work in an isolated `codex/acorn-town` worktree created from fresh `origin/main`; carry only the approved design and plan commits into it.
- Preserve all unrelated working-tree changes in the current checkout.
- Do not refactor unrelated worlds or the core game engine.
- Do not create a continuous open-world hub or four duplicate town backgrounds.
- Image Gen creates all new background/prop art; Codex does not synthesize or retouch game art with code.
- Adobe Photoshop is the only allowed fallback for removing backgrounds, white edges, or local art cleanup.
- All new props/items must be directly usable transparent RGBA PNG files with lowercase English filenames.
- The shared background is exactly 1672 x 941 pixels and contains no UI, characters, task props, or embedded Chinese text.
- Reuse existing Ruru, Coco, Owlly, red-apple, and green-apple assets.
- Missing assets must keep a Canvas/image fallback and must never create a blank screen.
- Keep the four existing difficulty ids exactly: `easy`, `normal`, `hard`, `crazy`.
- Run `node --test tests/*.test.mjs` and `node --check` on every changed JavaScript file before final handoff.

---

## File Map

**Create**

- `acorn-town-rules.js` — pure difficulty rank, visibility, timer, and penalty rules.
- `acorn-town-quiz-bank.js` — 24 difficulty-tagged questions and one gated quiz placement per level.
- `acorn-town-map-entry.js` — guarded world-map entry into the first Acorn Town level.
- `tests/acorn-town-rules.test.mjs` — pure rules unit tests.
- `tests/acorn-town-assets.test.mjs` — dimensions, alpha-channel, and asset-path contract.
- `tests/acorn-town-levels.test.mjs` — four-level order and difficulty-scaled data contract.
- `tests/acorn-town-mechanics.test.mjs` — source/runtime contract for matching, decoys, trades, fragments, carts, exits, and quiz gating.
- `tests/acorn-town-quiz-bank.test.mjs` — bank size, difficulty distribution, placements, and script order.
- `tests/acorn-town-progression.test.mjs` — Forest Road → Acorn Town → Riverside Dock progression contract.
- `assets/bg/acorn_town_plaza.png` — shared opaque background.
- Thirteen transparent files listed in Task 2.

**Modify**

- `game.js` — world registration, levels, difficulty filtering, runtime mechanisms, rendering, progression hook, and fallbacks.
- `art-assets.js` — Acorn Town asset registry/preload entries.
- `index.html` — script loading order.
- `world-map.js` — new background path and runtime unlock state.

---

### Task 1: Add Pure Acorn Town Difficulty Rules

**Files:**

- Create: `acorn-town-rules.js`
- Create: `tests/acorn-town-rules.test.mjs`
- Modify: `index.html:130-141`

**Interfaces:**

- Produces: `globalThis.CATS_OWLS_ACORN_TOWN_RULES`
- Produces: `difficultyRank(mode: string): number`
- Produces: `visibleAtDifficulty(entry: {minDifficulty?: string}, mode: string): boolean`
- Produces: `timeFor(levelId: string, mode: string): number`
- Produces: `wrongActionPenalty(mode: string): number`
- Produces: `coreTasksDone(tasks: Array<{kind: string, optional?: boolean, done?: boolean}>): boolean`
- Consumed by: `game.js` reset, wrong-action, cart, and quiz-gating logic in later tasks.

- [ ] **Step 1: Write the failing rules test**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../acorn-town-rules.js", import.meta.url), "utf8");
const sandbox = {};
vm.runInNewContext(source, sandbox);
const rules = sandbox.CATS_OWLS_ACORN_TOWN_RULES;

assert.ok(rules, "Acorn Town rules API should be exported");
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map(rules.difficultyRank),
  [0, 1, 2, 3]
);
assert.equal(rules.visibleAtDifficulty({ minDifficulty: "hard" }, "normal"), false);
assert.equal(rules.visibleAtDifficulty({ minDifficulty: "hard" }, "crazy"), true);
assert.equal(rules.timeFor("acorn_post_office", "crazy"), 80);
assert.equal(rules.timeFor("acorn_notice_board", "easy"), 150);
assert.equal(rules.wrongActionPenalty("easy"), 0);
assert.equal(rules.wrongActionPenalty("normal"), 0);
assert.equal(rules.wrongActionPenalty("hard"), 3);
assert.equal(rules.wrongActionPenalty("crazy"), 5);
assert.equal(
  rules.coreTasksDone([
    { kind: "matched_delivery", done: true },
    { kind: "quiz", done: false },
    { kind: "decoy_target", optional: true, done: false },
  ]),
  true
);
assert.equal(
  rules.coreTasksDone([{ kind: "market_trade", done: false }, { kind: "quiz", done: false }]),
  false
);
```

- [ ] **Step 2: Run the test and verify the missing file failure**

Run: `node --test tests/acorn-town-rules.test.mjs`  
Expected: FAIL with `ENOENT` for `acorn-town-rules.js`.

- [ ] **Step 3: Implement the minimal pure rules file**

```js
/* Pure Acorn Town difficulty rules shared by the browser and Node tests. */
(function setupAcornTownRules(globalScope) {
  const DIFFICULTIES = ["easy", "normal", "hard", "crazy"];
  const TIMES = Object.freeze({
    acorn_post_office: Object.freeze({ easy: 130, normal: 110, hard: 95, crazy: 80 }),
    acorn_hunt: Object.freeze({ easy: 140, normal: 120, hard: 105, crazy: 90 }),
    acorn_market: Object.freeze({ easy: 145, normal: 125, hard: 110, crazy: 95 }),
    acorn_notice_board: Object.freeze({ easy: 150, normal: 130, hard: 115, crazy: 100 }),
  });
  const WRONG_ACTION_PENALTIES = Object.freeze({ easy: 0, normal: 0, hard: 3, crazy: 5 });

  function difficultyRank(mode) {
    const rank = DIFFICULTIES.indexOf(mode);
    return rank >= 0 ? rank : 1;
  }

  function visibleAtDifficulty(entry, mode) {
    return difficultyRank(mode) >= difficultyRank(entry?.minDifficulty || "easy");
  }

  function timeFor(levelId, mode) {
    return TIMES[levelId]?.[mode] || TIMES[levelId]?.normal || 110;
  }

  function wrongActionPenalty(mode) {
    return WRONG_ACTION_PENALTIES[mode] ?? WRONG_ACTION_PENALTIES.normal;
  }

  function coreTasksDone(tasks) {
    return tasks
      .filter((task) => task.kind !== "quiz" && !task.optional)
      .every((task) => task.done);
  }

  globalScope.CATS_OWLS_ACORN_TOWN_RULES = Object.freeze({
    difficultyRank,
    visibleAtDifficulty,
    timeFor,
    wrongActionPenalty,
    coreTasksDone,
  });
})(typeof window !== "undefined" ? window : globalThis);
```

- [ ] **Step 4: Load the rules before `game.js`**

Add immediately before the existing `game.js` script:

```html
<script src="./acorn-town-rules.js?v=acorn-town-20260729"></script>
<script src="./game.js?v=difficulty-20260629"></script>
```

- [ ] **Step 5: Run tests and syntax validation**

Run:

```bash
node --test tests/acorn-town-rules.test.mjs
node --check acorn-town-rules.js
```

Expected: both commands PASS.

- [ ] **Step 6: Commit**

```bash
git add acorn-town-rules.js index.html tests/acorn-town-rules.test.mjs
git commit -m "feat: add Acorn Town difficulty rules"
```

---

### Task 2: Generate and Validate the Acorn Town Art Set

**Files:**

- Create: `tests/acorn-town-assets.test.mjs`
- Create: `assets/bg/acorn_town_plaza.png`
- Create: `assets/props/acorn_postbox.png`
- Create: `assets/items/acorn_letter.png`
- Create: `assets/items/acorn.png`
- Create: `assets/items/fake_acorn.png`
- Create: `assets/items/acorn_basket.png`
- Create: `assets/props/acorn_exchange_stall.png`
- Create: `assets/props/acorn_order_board.png`
- Create: `assets/items/travel_star.png`
- Create: `assets/props/acorn_notice_board_broken.png`
- Create: `assets/props/acorn_notice_board_repaired.png`
- Create: `assets/items/acorn_notice_fragment.png`
- Create: `assets/props/acorn_town_cart.png`
- Create: `assets/props/riverside_dock_sign.png`

**Interfaces:**

- Produces: one 1672 x 941 opaque background.
- Produces: thirteen 1024 x 1024 transparent RGBA assets.
- Consumed by: asset registry and Canvas rendering in Task 3.

- [ ] **Step 1: Write the failing PNG contract test**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function pngInfo(url) {
  const data = readFileSync(url);
  assert.equal(data.subarray(1, 4).toString("ascii"), "PNG");
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    colorType: data[25],
  };
}

const background = pngInfo(new URL("../assets/bg/acorn_town_plaza.png", import.meta.url));
assert.deepEqual([background.width, background.height], [1672, 941]);

const transparentAssets = [
  "assets/props/acorn_postbox.png",
  "assets/items/acorn_letter.png",
  "assets/items/acorn.png",
  "assets/items/fake_acorn.png",
  "assets/items/acorn_basket.png",
  "assets/props/acorn_exchange_stall.png",
  "assets/props/acorn_order_board.png",
  "assets/items/travel_star.png",
  "assets/props/acorn_notice_board_broken.png",
  "assets/props/acorn_notice_board_repaired.png",
  "assets/items/acorn_notice_fragment.png",
  "assets/props/acorn_town_cart.png",
  "assets/props/riverside_dock_sign.png",
];

for (const path of transparentAssets) {
  const info = pngInfo(new URL(`../${path}`, import.meta.url));
  assert.deepEqual([info.width, info.height], [1024, 1024], `${path} canvas mismatch`);
  assert.ok([4, 6].includes(info.colorType), `${path} must contain an alpha channel`);
}
```

- [ ] **Step 2: Run the test and verify missing-asset failures**

Run: `node --test tests/acorn-town-assets.test.mjs`  
Expected: FAIL on the first missing Acorn Town PNG.

- [ ] **Step 3: Generate the background with Image Gen**

Use the `imagegen` skill. Generate one 16:9 background with this exact prompt:

> Child-friendly hand-painted storybook game background, warm autumn Acorn Town central plaza, honey gold and chestnut brown buildings with rounded acorn-shaped roofs, moss green trees, broad readable walking route, post office upper left, market upper right, acorn grove lower left, empty notice-board area and road toward Riverside Dock lower right. Clear open ground around every interaction zone, gentle daylight, no characters, no task items, no UI, no letters, no words, no signs containing text, no watermark. Wide 16:9 composition.

Save as `assets/bg/acorn_town_plaza.png`, then use a mechanical resize only to produce exactly 1672 x 941 pixels.

- [ ] **Step 4: Generate each transparent asset separately with Image Gen**

Use this exact shared direction for every call:

> Single isolated game prop, child-friendly hand-painted warm autumn storybook style, centered on a 1024 x 1024 canvas, complete silhouette, generous transparent margin, consistent three-quarter front view, soft internal shading, no cast shadow, no text, no letters, no watermark, transparent RGBA background.

Append exactly one subject line per call:

- `acorn_postbox.png`: Rounded chestnut wooden mailbox with a small acorn-shaped lid and no written label.
- `acorn_letter.png`: Sealed cream envelope with a tiny blank colored recipient medallion and no readable writing.
- `acorn.png`: Friendly natural brown acorn collectible with a textured cap.
- `fake_acorn.png`: Smooth brown pebble shaped similarly to an acorn but visibly missing the textured cap.
- `acorn_basket.png`: Small woven basket filled with space for collected acorns.
- `acorn_exchange_stall.png`: Compact wooden market stall decorated with acorn garlands and empty display shelves.
- `acorn_order_board.png`: Freestanding wooden order board with three blank icon slots and no writing.
- `travel_star.png`: Warm golden five-point travel star token with a tiny leaf motif.
- `acorn_notice_board_broken.png`: Wooden town notice board with four clearly empty fragment slots and a cracked frame.
- `acorn_notice_board_repaired.png`: Repaired wooden town notice board with four filled parchment panels but no writing.
- `acorn_notice_fragment.png`: One irregular blank parchment fragment with a wooden edge.
- `acorn_town_cart.png`: Small rounded wooden delivery cart with acorn-shaped wheels.
- `riverside_dock_sign.png`: Wooden direction sign with a bridge-and-river pictogram and no words.

If any output has a solid background, white fringe, or broken silhouette, use Adobe Photoshop for background removal/edge cleanup. Do not use code to perform those art edits.

- [ ] **Step 5: Inspect every generated file**

Use image inspection to verify:

- no baked-in text;
- no cropped edges;
- complete transparent margin;
- prop scale consistency;
- background interaction zones remain visually clear.

- [ ] **Step 6: Run the PNG contract test**

Run: `node --test tests/acorn-town-assets.test.mjs`  
Expected: PASS for dimensions and alpha channels.

- [ ] **Step 7: Commit**

```bash
git add tests/acorn-town-assets.test.mjs assets/bg/acorn_town_plaza.png assets/props/acorn_postbox.png assets/items/acorn_letter.png assets/items/acorn.png assets/items/fake_acorn.png assets/items/acorn_basket.png assets/props/acorn_exchange_stall.png assets/props/acorn_order_board.png assets/items/travel_star.png assets/props/acorn_notice_board_broken.png assets/props/acorn_notice_board_repaired.png assets/items/acorn_notice_fragment.png assets/props/acorn_town_cart.png assets/props/riverside_dock_sign.png
git commit -m "art: add Acorn Town chapter assets"
```

---

### Task 3: Register Assets and Add Safe Rendering Fallbacks

**Files:**

- Modify: `art-assets.js:1-180`
- Modify: `game.js:45-120, 2388-2430, 3716-3995, 5975-6015`
- Modify: `tests/acorn-town-assets.test.mjs`

**Interfaces:**

- Produces: art keys `acornPostbox`, `acornLetter`, `acorn`, `fakeAcorn`, `acornBasket`, `acornExchangeStall`, `acornOrderBoard`, `travelStar`, `acornNoticeBoardBroken`, `acornNoticeBoardRepaired`, `acornNoticeFragment`, `acornTownCart`, `riversideDockSign`.
- Consumed by: `drawItem`, `drawAnimal`, `drawPropImage`, cart rendering, and level definitions.

- [ ] **Step 1: Extend the failing asset test with registry assertions**

```js
const artAssets = readFileSync(new URL("../art-assets.js", import.meta.url), "utf8");
const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

for (const [key, path] of [
  ["acornPostbox", "assets/props/acorn_postbox.png"],
  ["acornLetter", "assets/items/acorn_letter.png"],
  ["acorn", "assets/items/acorn.png"],
  ["fakeAcorn", "assets/items/fake_acorn.png"],
  ["acornBasket", "assets/items/acorn_basket.png"],
  ["acornExchangeStall", "assets/props/acorn_exchange_stall.png"],
  ["acornOrderBoard", "assets/props/acorn_order_board.png"],
  ["travelStar", "assets/items/travel_star.png"],
  ["acornNoticeBoardBroken", "assets/props/acorn_notice_board_broken.png"],
  ["acornNoticeBoardRepaired", "assets/props/acorn_notice_board_repaired.png"],
  ["acornNoticeFragment", "assets/items/acorn_notice_fragment.png"],
  ["acornTownCart", "assets/props/acorn_town_cart.png"],
  ["riversideDockSign", "assets/props/riverside_dock_sign.png"],
]) {
  assert.match(artAssets, new RegExp(`${key}: "${path.replaceAll("/", "\\/")}"`));
}
assert.match(game, /acornTownPlaza: "\.\/assets\/bg\/acorn_town_plaza\.png"/);
assert.match(game, /else if \(type === "acorn"\) drawAcornFallback\(\);/);
assert.match(game, /else if \(type === "travelStar"\) drawTravelStarFallback\(\);/);
```

- [ ] **Step 2: Run the test and verify registry assertions fail**

Run: `node --test tests/acorn-town-assets.test.mjs`  
Expected: FAIL because the new keys and fallback branches are absent.

- [ ] **Step 3: Add exact asset paths to `art-assets.js`**

Add all thirteen keys to `window.ART_ASSETS.props`, then mirror them in `registry.props`:

```js
acornPostbox: window.ART_ASSETS.props.acornPostbox,
acornLetter: window.ART_ASSETS.props.acornLetter,
acorn: window.ART_ASSETS.props.acorn,
fakeAcorn: window.ART_ASSETS.props.fakeAcorn,
acornBasket: window.ART_ASSETS.props.acornBasket,
acornExchangeStall: window.ART_ASSETS.props.acornExchangeStall,
acornOrderBoard: window.ART_ASSETS.props.acornOrderBoard,
travelStar: window.ART_ASSETS.props.travelStar,
acornNoticeBoardBroken: window.ART_ASSETS.props.acornNoticeBoardBroken,
acornNoticeBoardRepaired: window.ART_ASSETS.props.acornNoticeBoardRepaired,
acornNoticeFragment: window.ART_ASSETS.props.acornNoticeFragment,
acornTownCart: window.ART_ASSETS.props.acornTownCart,
riversideDockSign: window.ART_ASSETS.props.riversideDockSign,
```

- [ ] **Step 4: Add background source and fallback candidates**

```js
acornTownPlaza: "./assets/bg/acorn_town_plaza.png",
```

```js
acornTownPlaza: [
  "./assets/bg/acorn_town_plaza.png",
  "./assets/bg/acorn_town_crossroad.png",
  "./assets/v2/v2-bg-city-road.png",
],
```

- [ ] **Step 5: Add item labels, art aliases, and simple Canvas fallbacks**

Add labels for every letter id, `acorn`, `fakeAcorn`, `acornBasket`, notice fragments, and `travelStar`. Map multiple letter/fragment ids to the same registered PNG. Add small fallback functions for an acorn, envelope, basket, fragment, and star; these are safety fallbacks only and must not replace generated art.

```js
function drawAcornFallback() {
  ctx.fillStyle = "#8b5b2b";
  ctx.beginPath();
  ctx.ellipse(0, 5, 17, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#5b3212";
  ctx.beginPath();
  ctx.ellipse(0, -10, 18, 9, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawLetterFallback() {
  ctx.fillStyle = "#fff4d2";
  roundRect(-24, -17, 48, 34, 5);
  ctx.fill();
  ctx.strokeStyle = "#8b5b2b";
  ctx.stroke();
}

function drawTravelStarFallback() {
  ctx.fillStyle = "#ffd94a";
  star(0, 0, 23);
}
```

In `drawItem`, all `acornLetter*` ids call the same envelope asset/fallback, all `noticeFragment*` ids call the same fragment asset/fallback, and generated art remains the first rendering attempt:

```js
if (drawItemArtPackImage(type)) return;
if (type.startsWith("acornLetter")) drawLetterFallback();
else if (type === "acorn") drawAcornFallback();
else if (type === "travelStar") drawTravelStarFallback();
```

For task-only props, use one readable generic fallback when `drawPropImage` returns false:

```js
function drawAcornTownPropFallback(label) {
  ctx.fillStyle = "#f6d89a";
  roundRect(-34, -42, 68, 72, 12);
  ctx.fill();
  ctx.strokeStyle = "#8b5b2b";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#5b3212";
  ctx.font = "900 11px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  fitText(label, 0, 0, 58);
}
```

- [ ] **Step 6: Run validation**

Run:

```bash
node --test tests/acorn-town-assets.test.mjs
node --check art-assets.js
node --check game.js
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add art-assets.js game.js tests/acorn-town-assets.test.mjs
git commit -m "feat: register Acorn Town art assets"
```

---

### Task 4: Add Four Levels and Difficulty-Filtered Scene Data

**Files:**

- Modify: `game.js:350-405, 1150-1290, 1302-1455`
- Create: `tests/acorn-town-levels.test.mjs`

**Interfaces:**

- Produces level ids: `acorn_post_office`, `acorn_hunt`, `acorn_market`, `acorn_notice_board`.
- Produces task kinds: `matched_delivery`, `decoy_target`, `market_trade`, `notice_slot`, `town_exit`.
- Produces state arrays: `townCarts`, `exitAreas`, filtered `collectibles`, filtered `tasksList`.
- Consumes: `CATS_OWLS_ACORN_TOWN_RULES.visibleAtDifficulty()` and `.timeFor()`.

- [ ] **Step 1: Write the failing level contract test**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const section = game.match(/name: "橡果镇邮局"[\s\S]*?name: "小镇公告板"[\s\S]*?\n  },\n];/)?.[0];

assert.ok(section, "Acorn Town four-level section should exist");
assert.equal((section.match(/world: "acorn_town"/g) || []).length, 4);
for (const name of ["橡果镇邮局", "寻找丢失的橡果", "橡果集市兑换", "小镇公告板"]) {
  assert.match(section, new RegExp(`name: "${name}"`));
}
for (const id of ["acorn_post_office", "acorn_hunt", "acorn_market", "acorn_notice_board"]) {
  assert.match(section, new RegExp(`id: "${id}"`));
}
assert.match(game, /WORLD_MAP\.acorn_town\.levels = levels/);
assert.match(game, /CATS_OWLS_ACORN_TOWN_RULES\.visibleAtDifficulty/);
assert.match(game, /CATS_OWLS_ACORN_TOWN_RULES\.timeFor/);
```

- [ ] **Step 2: Run the test and verify the level section is missing**

Run: `node --test tests/acorn-town-levels.test.mjs`  
Expected: FAIL with `Acorn Town four-level section should exist`.

- [ ] **Step 3: Register the world and shared chapter metadata in `game.js`**

Add `WORLD_MAP.acorn_town`, use background key `acornTownPlaza`, add the four day names, reuse Apple Valley music through an explicit `acorn_town` music path/pattern entry, and derive `WORLD_MAP.acorn_town.levels` exactly as Apple Valley and Forest Road do.

```js
acorn_town: {
  id: "acorn_town",
  name: "橡果镇",
  background: "acornTownPlaza",
  levels: [],
  taskTypes: [TASK_TYPES.FETCH_ITEM, TASK_TYPES.HELP_NPC, TASK_TYPES.SIMPLE_PUZZLE],
},
```

```js
MUSIC_BY_WORLD.acorn_town = MUSIC_BY_WORLD.apple_valley;
MUSIC_PATTERN_BY_WORLD.acorn_town = "harvest";

WORLD_MAP.acorn_town.levels = levels
  .map((level, index) => (level.world === "acorn_town" ? index : -1))
  .filter((index) => index >= 0);
```

- [ ] **Step 4: Add helper constructors**

Add focused constructors with these signatures:

```js
function matchedDeliveryTask(x, y, id, name, animal, need, label, options = {}) {
  return { x, y, id, name, need, label, animal, kind: "matched_delivery", done: false, progress: 0, ...options };
}

function decoyTargetTask(x, y, id, name, label, options = {}) {
  return { x, y, id, name, label, animal: "acornPostbox", kind: "decoy_target", optional: true, done: false, progress: 0, ...options };
}

function marketTradeTask(x, y, id, name, need, options = {}) {
  return { x, y, id, name, need, animal: "acornExchangeStall", kind: "market_trade", done: false, progress: 0, ...options };
}

function noticeSlotTask(x, y, id, name, need, requiresTaskId = null) {
  return { x, y, id, name, need, requiresTaskId, animal: "acornNoticeFragment", kind: "notice_slot", done: false, progress: 0 };
}

function townExitTask(x, y, id, name, requiresTaskIds) {
  return { x, y, id, name, requiresTaskIds, animal: "riversideDockSign", kind: "town_exit", done: false, progress: 0 };
}
```

Every returned task must contain a stable `id`, `kind`, `done: false`, `progress: 0`, and the dependency/difficulty fields supplied in `options`.

- [ ] **Step 5: Add the four data-driven level definitions**

Use the exact counts from the approved spec:

- Mail: three base letters, fourth `minDifficulty: "hard"`, fifth `minDifficulty: "crazy"`; one cart from Normal, second from Crazy; one Hard decoy mailbox and one Crazy decoy mailbox.
- Hunt: six base real acorns, two Hard real acorns, two Crazy real acorns; two Hard decoys and one Crazy decoy; one Easy leaf blocker, second Normal blocker, third Crazy blocker.
- Market: Orders A/B always visible, Order C from Hard; resource collectibles total seven acorns, two red apples, and two green apples, with Order-C-only resources from Hard.
- Board: four real fragments and four sequential slots; one Hard decoy fragment and one Crazy decoy; one Normal cart and a second Crazy cart; two wrong exits and one correct dock exit.

Use `requiresTaskId` for sequential orders/slots and `requiresTaskIds` for the correct exit.

The first level establishes the data shape:

```js
{
  id: "acorn_post_office",
  name: "橡果镇邮局",
  bg: "acornTownPlaza",
  world: "acorn_town",
  time: 110,
  timeByDifficulty: { easy: 130, normal: 110, hard: 95, crazy: 80 },
  start: { x: 480, y: 472 },
  message: "根据头像和颜色提示，把信送到正确邮箱。",
  collectibles: [
    item(184, 384, "acornLetterRuru", "给 Ruru 的信"),
    item(292, 326, "acornLetterCoco", "给 Coco 的信"),
    item(406, 402, "acornLetterOwlly", "给 Owlly 的信"),
    { ...item(522, 348, "acornLetterNono", "给 Nono 的信"), minDifficulty: "hard" },
    { ...item(642, 394, "acornLetterBird", "给小鸟邮差的信"), minDifficulty: "crazy" },
  ],
  tasks: [
    matchedDeliveryTask(176, 208, "mail_ruru", "Ruru", "ruru", "acornLetterRuru", "棕色橡果头像"),
    matchedDeliveryTask(340, 202, "mail_coco", "Coco", "coco", "acornLetterCoco", "绿色树叶头像"),
    matchedDeliveryTask(508, 202, "mail_owlly", "Owlly", "owl", "acornLetterOwlly", "蓝色月亮头像"),
    matchedDeliveryTask(676, 202, "mail_nono", "Nono", "nono", "acornLetterNono", "红色刺猬头像", { minDifficulty: "hard" }),
    matchedDeliveryTask(826, 214, "mail_bird", "小鸟邮差", "birdPostman", "acornLetterBird", "黄色羽毛头像", { minDifficulty: "crazy" }),
    decoyTargetTask(742, 424, "mail_decoy_1", "旧邮箱", "褪色图案", { minDifficulty: "hard" }),
    decoyTargetTask(862, 364, "mail_decoy_2", "空邮箱", "没有收件人", { minDifficulty: "crazy" }),
  ],
  townCarts: [
    { x: 260, y: 300, minX: 220, maxX: 690, speed: 58, dir: 1, minDifficulty: "normal" },
    { x: 720, y: 420, minX: 330, maxX: 790, speed: 76, dir: -1, minDifficulty: "crazy" },
  ],
  puddles: [],
  obstacles: [],
},
```

- [ ] **Step 6: Filter level data during `resetGame`**

Create a prepared level snapshot:

```js
function prepareLevelForDifficulty(level) {
  if (level.world !== "acorn_town") return level;
  const visible = (entry) => CATS_OWLS_ACORN_TOWN_RULES.visibleAtDifficulty(entry, selectedDifficulty);
  return {
    ...level,
    time: CATS_OWLS_ACORN_TOWN_RULES.timeFor(level.id, selectedDifficulty),
    collectibles: level.collectibles.filter(visible),
    tasks: level.tasks.filter(visible),
    townCarts: (level.townCarts || []).filter(visible),
    exitAreas: (level.exitAreas || []).filter(visible),
  };
}
```

Call it before cloning level arrays, copy `townCarts` into state, and make `levelTimeForDifficulty` return the exact Acorn Town time without applying the global multiplier again.

- [ ] **Step 7: Run validation**

Run:

```bash
node --test tests/acorn-town-rules.test.mjs tests/acorn-town-levels.test.mjs
node --check game.js
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add game.js tests/acorn-town-levels.test.mjs
git commit -m "feat: add Acorn Town level data"
```

---

### Task 5: Implement Mail Matching and Acorn Search

**Files:**

- Modify: `game.js:2198-2675, 3955-4065`
- Create: `tests/acorn-town-mechanics.test.mjs`

**Interfaces:**

- Produces: `taskDependenciesMet(task, tasks): boolean`
- Produces: `applyAcornTownWrongAction(x: number, y: number, message: string): number`
- Produces: `finishMatchedDelivery(task): boolean`
- Consumes: collectible `requiresTaskId`, `decoy`, and task `need`.

- [ ] **Step 1: Write the failing mechanics contract**

```js
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
```

- [ ] **Step 2: Run the test and verify missing helper failures**

Run: `node --test tests/acorn-town-mechanics.test.mjs`  
Expected: FAIL on `taskDependenciesMet`.

- [ ] **Step 3: Add dependency and wrong-action helpers**

`taskDependenciesMet` must accept either `requiresTaskId` or `requiresTaskIds`. `applyAcornTownWrongAction` must subtract exactly 0/0/3/5 seconds through the rules API, clamp at zero, show one floating time message, and leave inventory unchanged.

```js
function taskDependenciesMet(task, tasks = state.tasksList) {
  const ids = task.requiresTaskIds || (task.requiresTaskId ? [task.requiresTaskId] : []);
  return ids.every((id) => tasks.find((entry) => entry.id === id)?.done);
}

function applyAcornTownWrongAction(x, y, message) {
  const amount = CATS_OWLS_ACORN_TOWN_RULES.wrongActionPenalty(selectedDifficulty);
  if (amount) {
    state.time = Math.max(0, state.time - amount);
    addFloatingText(x, y - 56, `-${amount}秒`, "#e84b3f");
  }
  messageEl.textContent = message;
  updateHud();
  return amount;
}
```

- [ ] **Step 4: Gate hidden collectibles and handle decoys**

In `checkCollectibles`:

- skip a collectible until its prerequisite task is complete;
- for `decoy: true`, mark it inspected, show `这不是真橡果`, apply the difficulty penalty, and do not add inventory/hearts;
- keep existing behavior unchanged for every non-Acorn collectible.

```js
if (entry.requiresTaskId && !state.tasksList.find((task) => task.id === entry.requiresTaskId)?.done) continue;
if (entry.decoy) {
  entry.taken = true;
  applyAcornTownWrongAction(entry.x, entry.y, "这不是真橡果。");
  continue;
}
```

- [ ] **Step 5: Implement matching delivery**

When E is pressed at `matched_delivery`:

- if dependencies are incomplete, show the prerequisite message;
- if the exact `need` item is present, consume it and complete the task;
- if another `acornLetter*` is present, keep it and show `这封信不是寄到这里的`;
- if no letter is present, show the required recipient hint.

At `decoy_target`, always keep the letter and apply the configured penalty.

```js
function finishMatchedDelivery(task) {
  if (!taskDependenciesMet(task)) {
    messageEl.textContent = task.lockedMessage || "先完成前面的任务。";
    return false;
  }
  if (state.inventory.includes(task.need)) {
    consumeNeeds([task.need]);
    completeTask(task, task.x, task.y);
    return true;
  }
  if (state.inventory.some((type) => type.startsWith("acornLetter"))) {
    applyAcornTownWrongAction(task.x, task.y, "这封信不是寄到这里的。");
    return false;
  }
  messageEl.textContent = `${task.name}需要：${itemLabel(task.need)}。`;
  return false;
}
```

- [ ] **Step 6: Render mailbox targets and unavailable dependencies**

Use `acornPostbox` for matching/decoy targets. Dim tasks whose prerequisites are incomplete and show a lock-style short hint without hiding them.

- [ ] **Step 7: Run validation**

Run:

```bash
node --test tests/acorn-town-mechanics.test.mjs tests/acorn-town-levels.test.mjs
node --check game.js
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add game.js tests/acorn-town-mechanics.test.mjs
git commit -m "feat: add Acorn Town mail and search mechanics"
```

---

### Task 6: Implement Market Orders and Notice-Board Assembly

**Files:**

- Modify: `game.js:2220-2675, 3999-4065`
- Modify: `tests/acorn-town-mechanics.test.mjs`

**Interfaces:**

- Produces: `finishMarketTrade(task): boolean`
- Produces: `finishNoticeSlot(task): boolean`
- Consumes: existing `missingNeeds`, `consumeNeeds`, task dependencies, and wrong-action helper.

- [ ] **Step 1: Add failing mechanics assertions**

```js
for (const name of ["finishMarketTrade", "finishNoticeSlot"]) {
  assert.match(game, new RegExp(`function ${name}\\(`));
}
assert.match(game, /订单 A/);
assert.match(game, /订单 B/);
assert.match(game, /订单 C/);
assert.match(game, /公告碎片放错位置/);
assert.match(game, /reward: "travelStar"/);
```

- [ ] **Step 2: Run the test and verify missing helper failures**

Run: `node --test tests/acorn-town-mechanics.test.mjs`  
Expected: FAIL on `finishMarketTrade`.

- [ ] **Step 3: Implement fixed market orders**

Use these exact needs:

```js
const ACORN_MARKET_ORDERS = Object.freeze({
  A: ["acorn", "acorn", "redApple"],
  B: ["acorn", "acorn", "acorn", "greenApple"],
  C: ["acorn", "acorn", "redApple", "greenApple"],
});
```

`finishMarketTrade` completes only when all exact items exist. Missing or incorrect offers keep inventory intact; Hard/Crazy apply the configured wrong-action penalty. Order C grants `travelStar`.

```js
function finishMarketTrade(task) {
  if (!taskDependenciesMet(task)) {
    messageEl.textContent = task.lockedMessage || "先完成上一张订单。";
    return false;
  }
  const missing = missingNeeds(task.need);
  if (missing.length) {
    applyAcornTownWrongAction(task.x, task.y, `${task.name}还缺少：${needLabels(missing)}。`);
    return false;
  }
  consumeNeeds(task.need);
  completeTask(task, task.x, task.y);
  if (task.reward && !state.inventory.includes(task.reward)) state.inventory.push(task.reward);
  updateHud();
  return true;
}
```

- [ ] **Step 4: Implement sequential notice slots**

Each slot accepts only its own `noticeFragment1` through `noticeFragment4`. If a different notice fragment or `fakeNoticeFragment` is held, keep it and show `公告碎片放错位置`. A later slot remains locked until its prerequisite slot is done.

```js
function finishNoticeSlot(task) {
  if (!taskDependenciesMet(task)) {
    messageEl.textContent = "请从第一块公告碎片开始按顺序拼。";
    return false;
  }
  if (state.inventory.includes(task.need)) {
    consumeNeeds([task.need]);
    completeTask(task, task.x, task.y);
    return true;
  }
  if (state.inventory.some((type) => type.startsWith("noticeFragment") || type === "fakeNoticeFragment")) {
    applyAcornTownWrongAction(task.x, task.y, "公告碎片放错位置。");
    return false;
  }
  messageEl.textContent = `还没有找到${itemLabel(task.need)}。`;
  return false;
}
```

- [ ] **Step 5: Swap broken/repaired notice-board art**

Draw `acornNoticeBoardBroken` while any required slot is incomplete and `acornNoticeBoardRepaired` after all four slots are complete. Keep slot labels in Canvas/UI, not baked into the PNG.

```js
function acornNoticeBoardRepaired() {
  return ["notice_slot_1", "notice_slot_2", "notice_slot_3", "notice_slot_4"]
    .every((id) => state.tasksList.find((task) => task.id === id)?.done);
}

function drawAcornNoticeBoard() {
  const key = acornNoticeBoardRepaired() ? "acornNoticeBoardRepaired" : "acornNoticeBoardBroken";
  if (!drawPropImage(ctx, key, 700, 152, 156, 156)) {
    ctx.fillStyle = "#8b5b2b";
    roundRect(718, 182, 120, 92, 10);
    ctx.fill();
  }
}
```

- [ ] **Step 6: Run validation**

Run:

```bash
node --test tests/acorn-town-mechanics.test.mjs
node --check game.js
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add game.js tests/acorn-town-mechanics.test.mjs
git commit -m "feat: add Acorn Town market and notice puzzles"
```

---

### Task 7: Add Carts, Route Exits, and End-of-Level Quiz Gating

**Files:**

- Modify: `game.js:1377-1450, 1685-1760, 1990-2095, 2620-2665, 3180-3270, 3990-4095`
- Modify: `tests/acorn-town-mechanics.test.mjs`

**Interfaces:**

- Produces: `updateAcornTownMechanisms(dt: number): void`
- Produces: `updateTownCarts(dt: number): void`
- Produces: `checkAcornTownExitAreas(): void`
- Produces: `quizTaskAvailable(task): boolean`
- Consumes: `state.townCarts`, rules penalties, dependencies, and `coreTasksDone`.

- [ ] **Step 1: Add failing assertions**

```js
for (const name of [
  "updateAcornTownMechanisms",
  "updateTownCarts",
  "checkAcornTownExitAreas",
  "quizTaskAvailable",
]) {
  assert.match(game, new RegExp(`function ${name}\\(`));
}
assert.match(game, /先完成小镇任务，再来回答最后一题/);
assert.match(game, /这里不是通往河畔码头的出口/);
assert.match(game, /townCartCooldownUntil/);
```

- [ ] **Step 2: Run the test and verify missing helper failures**

Run: `node --test tests/acorn-town-mechanics.test.mjs`  
Expected: FAIL on `updateAcornTownMechanisms`.

- [ ] **Step 3: Implement cart paths and collision cooldown**

Move each cart between its configured `minX` and `maxX`, reverse direction at the ends, and draw `acornTownCart`. On collision:

- keep inventory unchanged;
- apply 0/0/3/5 seconds;
- set a one-second `townCartCooldownUntil`;
- push the player a short distance away from the cart.

```js
function updateTownCarts(dt) {
  const now = performance.now();
  for (const cart of state.townCarts || []) {
    cart.x += cart.speed * cart.dir * dt;
    if (cart.x <= cart.minX || cart.x >= cart.maxX) {
      cart.x = clamp(cart.x, cart.minX, cart.maxX);
      cart.dir *= -1;
    }
    if (distance(state.player, cart) < 48 && now >= state.townCartCooldownUntil) {
      state.townCartCooldownUntil = now + 1000;
      applyAcornTownWrongAction(cart.x, cart.y, "小推车经过，先让一让。");
      state.player.x = clamp(state.player.x - cart.dir * 34, 28, canvas.width - 28);
    }
  }
}

function updateAcornTownMechanisms(dt) {
  if (levels[state.levelIndex]?.world !== "acorn_town") return;
  updateTownCarts(dt);
  checkAcornTownExitAreas();
}
```

Initialize both cooldowns in the `resetGame` state object:

```js
townCartCooldownUntil: 0,
exitCooldownUntil: 0,
```

- [ ] **Step 4: Implement wrong and correct exits**

Wrong `exitAreas` show `这里不是通往河畔码头的出口`, apply the Hard/Crazy penalty, and return the player to the plaza start. The correct `town_exit` remains dependency-locked until all four notice slots are complete.

```js
function checkAcornTownExitAreas() {
  const now = performance.now();
  if (now < state.exitCooldownUntil) return;
  for (const area of state.exitAreas || []) {
    if (distance(state.player, area) >= area.r + 16) continue;
    state.exitCooldownUntil = now + 900;
    applyAcornTownWrongAction(area.x, area.y, "这里不是通往河畔码头的出口。");
    state.player.x = levels[state.levelIndex].start.x;
    state.player.y = levels[state.levelIndex].start.y;
    return;
  }
}
```

- [ ] **Step 5: Gate the final quiz**

`quizTaskAvailable` returns true only when the task does not request gating or `coreTasksDone(state.tasksList)` is true. Apply it in:

- near-task hints;
- direct E interaction;
- dialogue quiz button;
- `openQuiz`.

Early interaction shows `先完成小镇任务，再来回答最后一题`. Do not mark the quiz optional; it remains part of the required task count.

```js
function quizTaskAvailable(task) {
  return !task.requiresCoreTasks || CATS_OWLS_ACORN_TOWN_RULES.coreTasksDone(state.tasksList);
}

function openQuiz(task) {
  if (!quizTaskAvailable(task)) {
    messageEl.textContent = "先完成小镇任务，再来回答最后一题。";
    return;
  }
  if (state.activeQuiz === task) return;
  closeDialogue();
  state.activeQuiz = task;
  quizTitle.textContent = task.quiz.title;
  quizQuestion.textContent = task.quiz.question;
  quizOptions.innerHTML = "";
  task.quiz.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerQuiz(task, index));
    quizOptions.appendChild(button);
  });
  quizPanel.hidden = false;
}
```

- [ ] **Step 6: Run validation**

Run:

```bash
node --test tests/acorn-town-mechanics.test.mjs tests/acorn-town-rules.test.mjs
node --check game.js
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add game.js tests/acorn-town-mechanics.test.mjs
git commit -m "feat: add Acorn Town hazards exits and quiz gate"
```

---

### Task 8: Add the 24-Question Acorn Town Quiz Bank

**Files:**

- Create: `acorn-town-quiz-bank.js`
- Create: `tests/acorn-town-quiz-bank.test.mjs`
- Modify: `index.html:132-142`

**Interfaces:**

- Produces quiz key: `acornTownShared`.
- Produces exactly one `requiresCoreTasks: true` quiz task per Acorn Town level.
- Consumes: existing `quizBank`, `levels`, `randomQuiz` refresh behavior.

- [ ] **Step 1: Write the failing quiz-bank test**

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bankUrl = new URL("../acorn-town-quiz-bank.js", import.meta.url);
assert.ok(existsSync(bankUrl), "Acorn Town quiz bank should exist");
const bank = readFileSync(bankUrl, "utf8");

assert.match(index, /<script src="\.\/acorn-town-quiz-bank\.js\?v=acorn-town-20260729"><\/script>/);
assert.equal((bank.match(/difficulty: "easy"/g) || []).length, 6);
assert.equal((bank.match(/difficulty: "normal"/g) || []).length, 6);
assert.equal((bank.match(/difficulty: "hard"/g) || []).length, 6);
assert.equal((bank.match(/difficulty: "crazy"/g) || []).length, 6);
assert.equal((bank.match(/requiresCoreTasks: true/g) || []).length, 1);
for (const level of ["橡果镇邮局", "寻找丢失的橡果", "橡果集市兑换", "小镇公告板"]) {
  assert.match(bank, new RegExp(`level: "${level}"`));
}
```

- [ ] **Step 2: Run the test and verify the missing-file failure**

Run: `node --test tests/acorn-town-quiz-bank.test.mjs`  
Expected: FAIL with `Acorn Town quiz bank should exist`.

- [ ] **Step 3: Create the shared question pool**

Follow `forest-road-quiz-bank.js` exactly for unique append, placements, current-level refresh, and global count export. Add six questions per difficulty covering these exact answer facts:

- Easy: `acorn = 橡果`; 2+3=5; red letter matches red recipient icon; a basket stores collected acorns; a bridge pictogram points to the dock; complete town tasks before the final quiz.
- Normal: 3 letters +2 letters=5; 6 acorns split into 2 equal groups gives 3; `letter = 信`; Order A needs two acorns and one red apple; a wrong mailbox should be rechecked; the notice-board fragments go from 1 to 4.
- Hard: 8 acorns minus 3 equals 5; Orders A+B need five acorns total; four valid fragments plus one decoy means five visible pieces; `market = 市集`; compare route steps right/up/right; match letter recipient and icon together.
- Crazy: Orders A+B+C need seven acorns total; 10 real plus 3 fake means 13 visible; 95 seconds minus two 5-second penalties leaves 85; six visible fragments with two decoys leaves four valid; infer the dock route after the hint closes; choose the full sequence “tasks → route → quiz”.

Every question must have four concrete options and one numeric `answer` index.

Use this exact pool:

```js
const acornTownQuestions = [
  { difficulty: "easy", title: "橡果镇基础题", question: "acorn 的中文意思是？", options: ["橡果", "苹果", "信件", "小桥"], answer: 0 },
  { difficulty: "easy", title: "橡果镇基础题", question: "Coco 找到 2 颗橡果，又找到 3 颗，一共有几颗？", options: ["4", "5", "6", "7"], answer: 1 },
  { difficulty: "easy", title: "橡果镇基础题", question: "红色信件应该送到哪里？", options: ["红色收件人图标的邮箱", "没有图标的箱子", "橡果篮", "公告板"], answer: 0 },
  { difficulty: "easy", title: "橡果镇基础题", question: "收集到的橡果应该放进什么？", options: ["橡果篮", "河里", "路牌后面", "空邮箱"], answer: 0 },
  { difficulty: "easy", title: "橡果镇基础题", question: "带有桥和河流图案的路牌最可能通向哪里？", options: ["河畔码头", "苹果谷", "森林学校", "沼泽深处"], answer: 0 },
  { difficulty: "easy", title: "橡果镇基础题", question: "回答最后一题前应该先做什么？", options: ["完成小镇任务", "走进错误出口", "丢掉信件", "撞小推车"], answer: 0 },

  { difficulty: "normal", title: "橡果镇普通题", question: "已经送了 3 封信，还有 2 封，一共需要送几封？", options: ["4", "5", "6", "7"], answer: 1 },
  { difficulty: "normal", title: "橡果镇普通题", question: "6 颗橡果平均分成 2 组，每组几颗？", options: ["2", "3", "4", "5"], answer: 1 },
  { difficulty: "normal", title: "Acorn Town Quiz", question: "Which word means “信”?", options: ["letter", "market", "bridge", "basket"], answer: 0 },
  { difficulty: "normal", title: "橡果镇普通题", question: "订单 A 需要什么？", options: ["2 颗橡果和 1 个红苹果", "3 颗橡果和 1 个青苹果", "1 颗橡果和 2 个红苹果", "只要 1 个青苹果"], answer: 0 },
  { difficulty: "normal", title: "橡果镇普通题", question: "信件送到错误邮箱时，最合适的做法是？", options: ["重新核对收件提示", "把信丢掉", "继续投错", "拆掉邮箱"], answer: 0 },
  { difficulty: "normal", title: "橡果镇普通题", question: "公告碎片编号是 1、2、3、4，正确顺序是？", options: ["1、2、3、4", "4、3、2、1", "2、4、1、3", "3、1、4、2"], answer: 0 },

  { difficulty: "hard", title: "橡果镇困难题", question: "有 8 颗橡果，用掉 3 颗，还剩几颗？", options: ["4", "5", "6", "7"], answer: 1 },
  { difficulty: "hard", title: "橡果镇困难题", question: "订单 A 用 2 颗橡果，订单 B 用 3 颗，两单共用几颗？", options: ["4", "5", "6", "7"], answer: 1 },
  { difficulty: "hard", title: "橡果镇困难题", question: "4 块正确碎片和 1 块干扰碎片放在一起，一共看到几块？", options: ["4", "5", "6", "7"], answer: 1 },
  { difficulty: "hard", title: "Acorn Town Challenge", question: "Which word means “市集”?", options: ["market", "letter", "acorn", "route"], answer: 0 },
  { difficulty: "hard", title: "橡果镇困难题", question: "路线是“向右、向上、再向右”，正确顺序是？", options: ["右、上、右", "上、右、上", "右、右、下", "左、上、右"], answer: 0 },
  { difficulty: "hard", title: "橡果镇困难题", question: "确认收件人时，哪两项信息最有用？", options: ["名字和图标", "天气和时间", "篮子和小车", "树叶和石头"], answer: 0 },

  { difficulty: "crazy", title: "橡果镇综合挑战", question: "订单 A、B、C 分别用 2、3、2 颗橡果，一共用几颗？", options: ["5", "6", "7", "8"], answer: 2 },
  { difficulty: "crazy", title: "橡果镇综合挑战", question: "10 颗真橡果和 3 个假橡果放在一起，一共看到几个？", options: ["10", "11", "12", "13"], answer: 3 },
  { difficulty: "crazy", title: "橡果镇综合挑战", question: "剩余 95 秒，两次错误各扣 5 秒，还剩多少秒？", options: ["80", "85", "90", "95"], answer: 1 },
  { difficulty: "crazy", title: "橡果镇综合挑战", question: "看见 6 块公告碎片，其中 2 块是干扰项，正确碎片有几块？", options: ["3", "4", "5", "6"], answer: 1 },
  { difficulty: "crazy", title: "橡果镇综合挑战", question: "路线提示关闭后，怎样最容易找到码头？", options: ["按刚才记住的顺序走", "随便选一个出口", "一直撞小推车", "把碎片丢掉"], answer: 0 },
  { difficulty: "crazy", title: "橡果镇综合挑战", question: "完成橡果镇关卡的完整顺序是？", options: ["完成任务、找路线、回答题目", "回答题目、丢掉道具、回起点", "先选错路、再撞小车、最后答题", "只完成一项任务"], answer: 0 },
];
```

- [ ] **Step 4: Add four gated placements**

Use a single placement record per level and set `requiresCoreTasks: true` inside the quiz-task constructor. Use positions that do not overlap mailboxes, market stalls, board slots, carts, or exits.

```js
const placements = [
  { level: "橡果镇邮局", x: 468, y: 430, name: "邮局四年级题" },
  { level: "寻找丢失的橡果", x: 472, y: 430, name: "橡果观察题" },
  { level: "橡果集市兑换", x: 468, y: 430, name: "集市计算题" },
  { level: "小镇公告板", x: 470, y: 430, name: "码头路线题" },
];

function appendUniqueQuestions(key, questions) {
  if (!Array.isArray(quizBank[key])) quizBank[key] = [];
  const existing = new Set(quizBank[key].map((question) => question.question));
  for (const question of questions) {
    if (existing.has(question.question)) continue;
    quizBank[key].push(question);
    existing.add(question.question);
  }
}

function acornTownQuizTask(placement) {
  return {
    x: placement.x,
    y: placement.y,
    name: placement.name,
    animal: "riddle",
    speech: "完成小镇任务后，回答一道四年级题。",
    quizKey: "acornTownShared",
    quiz: null,
    kind: "quiz",
    requiresCoreTasks: true,
    done: false,
    progress: 0,
    acornTownShared: true,
  };
}

appendUniqueQuestions("acornTownShared", acornTownQuestions);
for (const placement of placements) {
  const level = levels.find((entry) => entry.world === "acorn_town" && entry.name === placement.level);
  if (!level || level.tasks.some((task) => task.acornTownShared)) continue;
  level.tasks.push(acornTownQuizTask(placement));
}

window.CATS_OWLS_ACORN_TOWN_QUIZ = Object.freeze({
  key: "acornTownShared",
  count: quizBank.acornTownShared.length,
});
```

- [ ] **Step 5: Load the bank after `grade-quiz.js` and after `game.js`**

```html
<script src="./acorn-town-quiz-bank.js?v=acorn-town-20260729"></script>
```

- [ ] **Step 6: Run validation**

Run:

```bash
node --test tests/acorn-town-quiz-bank.test.mjs
node --check acorn-town-quiz-bank.js
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add acorn-town-quiz-bank.js index.html tests/acorn-town-quiz-bank.test.mjs
git commit -m "feat: add Acorn Town quiz bank"
```

---

### Task 9: Add World Progression and Guarded Map Entry

**Files:**

- Create: `acorn-town-map-entry.js`
- Create: `tests/acorn-town-progression.test.mjs`
- Modify: `game.js:1695-1760, 6180-6200`
- Modify: `world-map.js:128-185, 320-410`
- Modify: `index.html:138-145`

**Interfaces:**

- Produces: `window.CATS_OWLS_PROGRESS.isWorldCompleted(worldId)`
- Produces: `window.CATS_OWLS_PROGRESS.isWorldUnlocked(worldId)`
- Produces: `window.CATS_OWLS_PROGRESS.markWorldCompleted(worldId)`
- Uses localStorage key: `catsOwlCompletedWorlds`.
- Consumed by: world-map rendering and Acorn Town entry button.

- [ ] **Step 1: Write the failing progression test**

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const worldMap = readFileSync(new URL("../world-map.js", import.meta.url), "utf8");
const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const entryUrl = new URL("../acorn-town-map-entry.js", import.meta.url);

assert.ok(existsSync(entryUrl), "Acorn Town map entry should exist");
const entry = readFileSync(entryUrl, "utf8");
assert.match(game, /catsOwlCompletedWorlds/);
assert.match(game, /markWorldCompleted\(currentWorld\)/);
assert.match(worldMap, /CATS_OWLS_PROGRESS\?\.isWorldUnlocked/);
assert.match(entry, /CATS_OWLS_PROGRESS\?\.isWorldUnlocked\("acorn_town"\)/);
assert.match(entry, /进入橡果镇篇/);
assert.match(index, /<script src="\.\/acorn-town-map-entry\.js\?v=acorn-town-20260729"><\/script>/);
```

- [ ] **Step 2: Run the test and verify missing progression hooks**

Run: `node --test tests/acorn-town-progression.test.mjs`  
Expected: FAIL with `Acorn Town map entry should exist`.

- [ ] **Step 3: Add minimal persisted world progression**

Store a JSON array under `catsOwlCompletedWorlds`. Mark a world complete when a cleared level is its final level, including:

- Forest Road level four → unlock `acorn_town`.
- Acorn Town level four → unlock `riverside_dock`.

Expose the three methods through `window.CATS_OWLS_PROGRESS`. Invalid/missing JSON must safely return an empty set.

```js
const COMPLETED_WORLDS_STORAGE_KEY = "catsOwlCompletedWorlds";
const WORLD_PREREQUISITES = Object.freeze({
  acorn_town: "forest_road",
  riverside_dock: "acorn_town",
});

function completedWorlds() {
  try {
    const values = JSON.parse(localStorage.getItem(COMPLETED_WORLDS_STORAGE_KEY) || "[]");
    return new Set(Array.isArray(values) ? values : []);
  } catch {
    return new Set();
  }
}

function isWorldCompleted(worldId) {
  return completedWorlds().has(worldId);
}

function isWorldUnlocked(worldId) {
  const prerequisite = WORLD_PREREQUISITES[worldId];
  return !prerequisite || isWorldCompleted(prerequisite);
}

function markWorldCompleted(worldId) {
  const completed = completedWorlds();
  completed.add(worldId);
  localStorage.setItem(COMPLETED_WORLDS_STORAGE_KEY, JSON.stringify([...completed]));
}

function markCurrentWorldCompletedAtBoundary() {
  const currentWorld = levels[state.levelIndex]?.world;
  const nextWorld = levels[state.levelIndex + 1]?.world;
  if (currentWorld && currentWorld !== nextWorld) markWorldCompleted(currentWorld);
}

window.CATS_OWLS_PROGRESS = Object.freeze({
  isWorldCompleted,
  isWorldUnlocked,
  markWorldCompleted,
});
```

Call `markCurrentWorldCompletedAtBoundary()` inside the level-clear branch before showing the completion storybook page.

- [ ] **Step 4: Make world-map unlock labels dynamic**

Keep static `unlocked: true` regions open. For Acorn Town and Riverside Dock, compute:

```js
const unlocked = region.unlocked || window.CATS_OWLS_PROGRESS?.isWorldUnlocked(regionId);
```

Use the computed value consistently in the detail text and map-node lock label. Update Acorn Town’s background path to `assets/bg/acorn_town_plaza.png`.

```js
function regionIsUnlocked(regionId) {
  const region = WORLD_MAP[regionId];
  return Boolean(region?.unlocked || window.CATS_OWLS_PROGRESS?.isWorldUnlocked(regionId));
}
```

- [ ] **Step 5: Implement guarded Acorn Town entry**

Copy the Forest Road entry structure but:

- derive the first `acorn_town` level index dynamically;
- add the button only when `isWorldUnlocked("acorn_town")` is true;
- show `完成森林公路后解锁橡果镇` when locked;
- enter with message `已从世界地图进入橡果镇篇，点击开始帮助镇上的朋友。`.

Implement this complete entry script:

```js
/* Guarded world-map entry for the Acorn Town chapter. */
(function setupAcornTownMapEntry() {
  const WORLD_ID = "acorn_town";

  function startIndex() {
    if (!Array.isArray(levels)) return -1;
    return levels.findIndex((level) => level.world === WORLD_ID);
  }

  function isUnlocked() {
    return Boolean(window.CATS_OWLS_PROGRESS?.isWorldUnlocked(WORLD_ID));
  }

  function openAcornTown() {
    const levelIndex = startIndex();
    if (!isUnlocked() || levelIndex < 0 || !levels[levelIndex]) return;
    const keepHearts = Boolean(state && state.hearts > 0);
    gameEntered = true;
    document.getElementById("homeScreen")?.classList.add("is-hidden");
    const panel = document.getElementById("worldMapPanel");
    if (panel) panel.hidden = true;
    resetGame(levelIndex, keepHearts);
    startBtn.textContent = text.start;
    messageEl.textContent = "已从世界地图进入橡果镇篇，点击开始帮助镇上的朋友。";
    preloadNearbyBackgrounds(levelIndex);
  }

  function addEntryAction() {
    const detail = document.getElementById("worldMapDetail");
    const active = document.querySelector('#worldMapGrid [data-region="acorn_town"][aria-pressed="true"]');
    if (!detail || !active || detail.querySelector("[data-acorn-town-start]")) return;
    if (!isUnlocked()) {
      const note = document.createElement("p");
      note.textContent = "完成森林公路后解锁橡果镇。";
      detail.appendChild(note);
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.acornTownStart = "true";
    button.textContent = "进入橡果镇篇";
    (detail.querySelector(".world-detail-actions") || detail).appendChild(button);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-acorn-town-start]")) {
      event.preventDefault();
      openAcornTown();
      return;
    }
    if (event.target.closest('#worldMapGrid [data-region="acorn_town"]')) {
      window.setTimeout(addEntryAction, 0);
    }
  });
})();
```

- [ ] **Step 6: Load the entry script after `world-map.js`**

```html
<script src="./acorn-town-map-entry.js?v=acorn-town-20260729"></script>
```

- [ ] **Step 7: Run validation**

Run:

```bash
node --test tests/acorn-town-progression.test.mjs
node --check acorn-town-map-entry.js
node --check world-map.js
node --check game.js
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add acorn-town-map-entry.js game.js world-map.js index.html tests/acorn-town-progression.test.mjs
git commit -m "feat: unlock Acorn Town and Riverside Dock"
```

---

### Task 10: Full Regression and Browser Play-Through

**Files:**

- Modify only files required by failures found in this task.
- Verify: all Acorn Town files and existing Forest Road/Apple Valley paths.

**Interfaces:**

- Consumes every prior task.
- Produces a verified, reviewable Acorn Town chapter with no known blocker.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
node --test tests/*.test.mjs
node --check game.js
node --check art-assets.js
node --check world-map.js
node --check acorn-town-rules.js
node --check acorn-town-quiz-bank.js
node --check acorn-town-map-entry.js
```

Expected: all tests and syntax checks PASS.

- [ ] **Step 2: Start the existing local server**

Run: `node server.js`  
Expected: local preview starts without a port or asset-loading error.

- [ ] **Step 3: Complete all four levels on Normal**

Verify:

- 3 letters / 0 decoy mailboxes / 1 cart;
- 6 real acorns / 0 decoys / 2 leaf piles;
- Orders A and B / 1 cart;
- 4 valid fragments / 0 decoys / board route hint / 1 cart;
- final quiz is inaccessible until every core task is complete;
- correct quiz answer completes each level.

- [ ] **Step 4: Complete all four levels on Crazy**

Verify:

- 5 letters / 2 decoy mailboxes / 2 carts / 80 seconds;
- 10 real acorns / 3 decoys / 3 blockers / 90 seconds;
- Orders A, B, C / 2 carts / 95 seconds;
- 4 valid fragments / 2 decoys / memory-only route / 2 carts / 100 seconds;
- wrong actions deduct exactly 5 seconds;
- cart collisions have a one-second cooldown.

- [ ] **Step 5: Check recovery and fallback behavior**

For each level, deliberately perform one wrong action, restart once, and confirm:

- inventory is not lost incorrectly;
- task state resets;
- no deadlock remains;
- missing-asset fallback can render after temporarily changing one source path in browser DevTools;
- no blank screen or uncaught console error occurs.

- [ ] **Step 6: Verify world transitions**

Clear Forest Road’s fourth level, open the map, enter Acorn Town, clear Acorn Town’s fourth level, and confirm Riverside Dock changes to unlocked while remaining non-playable.

- [ ] **Step 7: Re-run Forest Road and Apple Valley smoke checks**

Open one Forest Road level and one Apple Valley level. Confirm their tasks, quizzes, background, NPCs, and difficulty timer behavior remain unchanged.

- [ ] **Step 8: Commit only verified fixes**

If this task required changes, stage only the Acorn Town implementation/test paths:

```bash
git add -- game.js art-assets.js world-map.js index.html acorn-town-rules.js acorn-town-quiz-bank.js acorn-town-map-entry.js tests/acorn-town-assets.test.mjs tests/acorn-town-levels.test.mjs tests/acorn-town-mechanics.test.mjs tests/acorn-town-quiz-bank.test.mjs tests/acorn-town-progression.test.mjs tests/acorn-town-rules.test.mjs
git commit -m "fix: complete Acorn Town verification"
```

If no changes were needed, do not create an empty commit.

- [ ] **Step 9: Request code review**

Use `superpowers:requesting-code-review`, address only confirmed Acorn Town findings, then rerun the complete automated suite before claiming completion.
