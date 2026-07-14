# Mist Swamp PR A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five enterable, completable, and normally settling Mist Swamp levels with a world-map entry and isolated quiz bank.

**Architecture:** Append Mist Swamp data to the existing `game.js` arrays and reuse existing collectible, delivery, quiz, escort, and completion behavior for PR A. Add only guarded Mist Swamp fallback drawing plus two chapter-specific scripts loaded after `game.js`.

**Tech Stack:** Browser JavaScript, Canvas 2D, Node.js built-in test runner, static HTML.

## Global Constraints

- Do not refactor the main flow or change existing Day 1–7, Moonlight Lake, Apple Valley, Forest Road, score settlement, difficulty, `boss`, or `moon_boss` behavior.
- All new levels append after existing levels and set `world: "mist_swamp"`.
- Derive `WORLD_MAP.mist_swamp.levels` by filtering `level.world === "mist_swamp"`; never hard-code indices.
- New task kinds are snake_case; item and prop keys are camelCase.
- PR A prioritizes `能进入 → 能完成 → 能结算`; advanced mechanisms remain for PR B.

---

### Task 1: Lock PR A chapter contracts with failing tests

**Files:**
- Create: `tests/mist-swamp-base.test.mjs`
- Modify: `tests/world-map-chapter-entries.test.mjs`

**Interfaces:**
- Consumes: source text from `game.js`, `world-map.js`, and `index.html`.
- Produces: assertions for five appended levels, derived indices, isolated scripts, and entry routing.

- [ ] **Step 1: Write the failing base test**

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const map = readFileSync(new URL("../world-map.js", import.meta.url), "utf8");
const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const names = ["迷雾沼泽入口", "萤火虫小径", "沉睡木桥", "迷雾核心", "沼泽泥浆怪"];

for (const name of names) assert.ok(game.includes(`"${name}"`), `${name} should be appended`);
assert.match(game, /mist_swamp:\s*\{[\s\S]*?levels:\s*\[\]/);
assert.match(game, /WORLD_MAP\.mist_swamp\.levels\s*=\s*levels[\s\S]*?level\.world\s*===\s*"mist_swamp"/);
assert.ok(!/WORLD_MAP\.mist_swamp\.levels\s*=\s*\[\d/.test(game));
assert.match(map, /mist_swamp:\s*\{[\s\S]*?name:\s*"迷雾沼泽"/);
for (const file of ["mist-swamp-map-entry.js", "mist-swamp-quiz-bank.js"]) {
  assert.ok(existsSync(new URL(`../${file}`, import.meta.url)));
  assert.ok(index.includes(`<script src="./${file}"></script>`));
}
```

- [ ] **Step 2: Extend the shared entry test**

```js
chapters.push([
  "mist-swamp-map-entry.js",
  "进入迷雾沼泽篇",
  "data-mist-swamp-start",
  "resetGame(levelIndex, keepHearts)",
]);
```

- [ ] **Step 3: Verify RED**

Run: `node --test tests/mist-swamp-base.test.mjs tests/world-map-chapter-entries.test.mjs`

Expected: FAIL because the Mist Swamp levels and scripts do not exist.

### Task 2: Add five minimal playable levels and runtime data

**Files:**
- Modify: `game.js`

**Interfaces:**
- Consumes: existing `item`, `delivery`, `quizTask`, `escortNpcTask`, and `actionTask` helpers.
- Produces: `WORLD_MAP.mist_swamp`, five appended level objects, labels, NPC registrations, and Canvas background keys.

- [ ] **Step 1: Add background keys and fallback candidates**

```js
mistSwampEntrance: "./assets/v2/v2-bg-swamp-boss.png",
fireflyTrailPath: "./assets/v2/v2-bg-wetland.png",
sleepingWoodenBridge: "./assets/v2/v2-bg-pond.png",
mistCoreClearing: "./assets/v2/v2-bg-swamp-boss.png",
mudMonsterLair: "./assets/v2/v2-bg-swamp-boss.png",
```

Use the same keys in `backgroundSourceCandidates`, with existing swamp/wetland images as fallbacks.

- [ ] **Step 2: Add registrations and runtime world**

```js
fireflyGuide: { id: "fireflyGuide", displayName: "萤火虫向导", renderer: drawFirefly, world: "mist_swamp" },
littleFrog: { id: "littleFrog", displayName: "小青蛙", renderer: drawFrog, world: "mist_swamp" },
swampSnail: { id: "swampSnail", displayName: "沼泽蜗牛", renderer: drawHedgehog, world: "mist_swamp" },
mistSpirit: { id: "mistSpirit", displayName: "迷雾精灵", renderer: drawFirefly, world: "mist_swamp" },
ruru: { id: "ruru", displayName: "Ruru 小浣熊", renderer: drawSquirrel, world: "mist_swamp" },
mudMonster: { id: "mudMonster", displayName: "沼泽泥浆怪", renderer: drawMudMonster, world: "mist_swamp" },
```

```js
mist_swamp: {
  id: "mist_swamp",
  name: "迷雾沼泽",
  background: "mistSwampEntrance",
  levels: [],
  taskTypes: [TASK_TYPES.FETCH_ITEM, TASK_TYPES.HELP_NPC, TASK_TYPES.SIMPLE_PUZZLE, TASK_TYPES.BOSS_FIGHT],
  boss: "mudMonster",
},
```

- [ ] **Step 3: Append names and five basic level objects**

Append the exact five names to `dayNames`. Append five `world: "mist_swamp"` level objects using only existing mechanics in PR A:

```js
{
  name: "迷雾沼泽入口",
  world: "mist_swamp",
  bg: "mistSwampEntrance",
  time: 90,
  start: { x: 120, y: 390 },
  message: "跟随温柔的光，点亮迷雾沼泽入口。",
  collectibles: [item(250, 190, "fireflyCore", "萤火虫灯芯"), item(470, 330, "fireflyCore", "萤火虫灯芯"), item(730, 170, "fireflyCore", "萤火虫灯芯")],
  tasks: [delivery(350, 220, "入口雾灯", "light", "fireflyCore", "点亮入口雾灯"), delivery(650, 300, "深处雾灯", "light", "fireflyCore", "点亮深处雾灯"), delivery(820, 390, "Ruru 小浣熊", "ruru", "fireflyCore", "确认旧路方向")],
},
```

Append the remaining exact PR A level shapes:

```js
{
  name: "萤火虫小径", world: "mist_swamp", bg: "fireflyTrailPath", time: 95,
  start: { x: 110, y: 390 }, message: "收集发光孢子，找到木桥钥匙。",
  collectibles: [item(250, 330, "glowSpore", "发光孢子"), item(390, 210, "glowSpore", "发光孢子"), item(560, 350, "glowSpore", "发光孢子"), item(710, 220, "glowSpore", "发光孢子"), item(820, 360, "bridgeKey", "木桥钥匙")],
  tasks: [delivery(480, 120, "萤火虫向导", "fireflyGuide", ["glowSpore", "glowSpore", "glowSpore", "glowSpore", "bridgeKey"], "跟着萤火虫走吧！")],
},
{
  name: "沉睡木桥", world: "mist_swamp", bg: "sleepingWoodenBridge", time: 100,
  start: { x: 120, y: 400 }, message: "找齐木桥板，唤醒蘑菇灯，再帮助小青蛙过桥。",
  collectibles: [item(230, 180, "bridgePlank", "木桥板"), item(440, 350, "bridgePlank", "木桥板"), item(690, 170, "bridgePlank", "木桥板")],
  tasks: [delivery(550, 280, "沉睡木桥", "sign", ["bridgePlank", "bridgePlank", "bridgePlank"], "修复沉睡木桥"), escortNpcTask(250, 390, "小青蛙", "littleFrog", "mistBridgeExit")],
  safeZones: [{ id: "mistBridgeExit", x: 830, y: 210, r: 48 }],
},
{
  name: "迷雾核心", world: "mist_swamp", bg: "mistCoreClearing", time: 110,
  start: { x: 120, y: 390 }, message: "收集光之孢子，帮助迷雾精灵恢复清醒。",
  collectibles: [item(250, 180, "lightSpore", "光之孢子"), item(470, 350, "lightSpore", "光之孢子"), item(710, 180, "lightSpore", "光之孢子")],
  tasks: [delivery(780, 300, "迷雾精灵", "mistSpirit", ["lightSpore", "lightSpore", "lightSpore"], "净化迷雾核心", "fireflyLantern")],
},
{
  name: "沼泽泥浆怪", world: "mist_swamp", bg: "mudMonsterLair", time: 120,
  start: { x: 120, y: 390 }, message: "用光和知识帮助沼泽守护者。",
  collectibles: [item(220, 180, "lightSpore", "光之孢子"), item(380, 350, "lightSpore", "光之孢子"), item(560, 170, "lightSpore", "光之孢子"), item(720, 360, "fireflyLantern", "萤火虫灯笼")],
  tasks: [delivery(780, 230, "沼泽泥浆怪", "mudMonster", ["lightSpore", "lightSpore", "lightSpore", "fireflyLantern"], "帮助守护者恢复清醒")],
},
```

- [ ] **Step 4: Derive map indices after level normalization**

```js
WORLD_MAP.mist_swamp.levels = levels
  .map((level, index) => (level.world === "mist_swamp" ? index : -1))
  .filter((index) => index >= 0);
```

- [ ] **Step 5: Add item labels and minimal fallbacks**

Add `fireflyCore`, `mistLamp`, `glowSpore`, `bridgePlank`, `bridgeKey`, `mushroomLamp`, `lightSpore`, `mistBadge`, `fireflyLantern`, `darkMistBubble`, `mudBubble`, `mudCore`, `bigMistLamp`, and `mistGuardianBadge` to `itemLabel`. Route these keys through small existing item drawings or a new `drawMistSwampItem(type)` Canvas fallback. Add a rounded `drawMudMonster()` function with large eyes and firefly dots.

- [ ] **Step 6: Verify GREEN for data contracts**

Run: `node --test tests/mist-swamp-base.test.mjs`

Expected: remaining failures only identify the still-missing entry and quiz scripts.

### Task 3: Add isolated quiz bank, world map entry, and display metadata

**Files:**
- Create: `mist-swamp-quiz-bank.js`
- Create: `mist-swamp-map-entry.js`
- Modify: `index.html`
- Modify: `world-map.js`
- Test: `tests/mist-swamp-base.test.mjs`

**Interfaces:**
- Consumes: `window.CATS_OWLS_GAME_DATA`, `levels`, `resetGame`, `quizBank`.
- Produces: `mistSwampShared` questions and `data-mist-swamp-start` entry button.

- [ ] **Step 1: Create the isolated quiz bank**

Create an IIFE with `MIST_SWAMP_QUIZ_KEY = "mistSwampShared"` and this question array:

```js
const questions = [
  { difficulty: "easy", title: "雾灯数学题", question: "已经点亮 1 盏雾灯，再点亮 2 盏，一共有几盏？", options: ["2", "3", "4", "5"], answer: 1 },
  { difficulty: "easy", title: "迷雾语文题", question: "“迷雾”最接近下面哪个意思？", options: ["让远处看不清的雾", "明亮的阳光", "清澈的河水", "整齐的木桥"], answer: 0 },
  { difficulty: "normal", title: "沼泽英语题", question: "英文 fog 是什么意思？", options: ["桥", "光", "雾", "灯"], answer: 2 },
  { difficulty: "normal", title: "萤火虫科学题", question: "萤火虫为什么能在夜里被看到？", options: ["身体会发光", "翅膀会下雨", "脚会变长", "会搬木桥"], answer: 0 },
  { difficulty: "hard", title: "颜色逻辑题", question: "顺序是黄、蓝、紫、绿，蓝色后面是什么？", options: ["黄", "紫", "绿", "红"], answer: 1 },
  { difficulty: "crazy", title: "沼泽综合题", question: "light 是光，bridge 是桥。哪一项是“用光照亮桥”？", options: ["Use light on the bridge", "Hide the bridge", "Turn off every light", "Make more fog"], answer: 0 },
];
```

Append unique questions by `question` text. For each `level.world === "mist_swamp"`, append one `{ kind: "quiz", quizKey: MIST_SWAMP_QUIZ_KEY, mistSwampShared: true }` task only when that marker is absent.

- [ ] **Step 2: Create the map entry script**

```js
(function setupMistSwampMapEntry() {
  const WORLD_ID = "mist_swamp";
  function mistSwampStartIndex() {
    const gameLevels = window.CATS_OWLS_GAME_DATA?.levels || levels;
    return gameLevels.findIndex((level) => level.world === WORLD_ID);
  }
  function openMistSwamp() {
    const levelIndex = mistSwampStartIndex();
    if (levelIndex < 0 || !levels[levelIndex]) return;
    const keepHearts = Boolean(state && state.hearts > 0);
    gameEntered = true;
    document.getElementById("homeScreen")?.classList.add("is-hidden");
    const panel = document.getElementById("worldMapPanel");
    if (panel) panel.hidden = true;
    resetGame(levelIndex, keepHearts);
    startBtn.textContent = text.start;
    messageEl.textContent = "已从世界地图进入迷雾沼泽篇。";
    preloadNearbyBackgrounds(levelIndex);
  }
  function addStartButton() {
    const detail = document.getElementById("worldMapDetail");
    const active = document.querySelector(`#worldMapGrid [data-region="${WORLD_ID}"][aria-pressed="true"]`);
    if (!detail || !active || detail.querySelector("[data-mist-swamp-start]")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.mistSwampStart = "true";
    button.textContent = "进入迷雾沼泽篇";
    (detail.querySelector(".world-detail-actions") || detail).appendChild(button);
  }
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-mist-swamp-start]")) {
      event.preventDefault();
      openMistSwamp();
    } else if (event.target.closest(`#worldMapGrid [data-region="${WORLD_ID}"]`)) {
      window.setTimeout(addStartButton, 0);
    }
  });
})();
```

- [ ] **Step 3: Load scripts and update the reserved map node**

Load the quiz script after other chapter quiz banks and the entry script after other chapter entry scripts. In `world-map.js`, update the existing `mist_swamp` object to the new non-horror description, background, NPCs, tasks, unlock copy, and `BOSS`-free base chapter wording without duplicating the node.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/mist-swamp-base.test.mjs tests/world-map-chapter-entries.test.mjs`

Expected: PASS.

### Task 4: Verify and commit PR A

**Files:**
- Verify: `game.js`, `world-map.js`, `mist-swamp-map-entry.js`, `mist-swamp-quiz-bank.js`, all tests.

**Interfaces:**
- Produces: a clean PR A commit that proves all five levels enter, complete, and settle.

- [ ] **Step 1: Run syntax and regression checks**

```bash
node --check game.js
node --check world-map.js
node --check mist-swamp-map-entry.js
node --check mist-swamp-quiz-bank.js
node --test tests/*.test.mjs
```

- [ ] **Step 2: Run browser smoke tests**

Start `node server.js`, open the local game, enter Mist Swamp from the map, complete each of the five levels, and verify `scoreSummaryPanel.hidden === false` after each completion. Also open Black Bear and Nessie levels and confirm no console errors.

- [ ] **Step 3: Commit PR A scope**

```bash
git add game.js world-map.js index.html mist-swamp-map-entry.js mist-swamp-quiz-bank.js tests/mist-swamp-base.test.mjs tests/world-map-chapter-entries.test.mjs
git commit -m "Add Mist Swamp base chapter"
```
