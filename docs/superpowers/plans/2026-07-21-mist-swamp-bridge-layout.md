# Mist Swamp Sleeping Bridge Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the Sleeping Wooden Bridge repair point with the painted bridge and safely randomize mushroom-lamp positions on hard and crazy difficulties without changing the level flow.

**Architecture:** Keep the static level definition as the easy/normal layout. During `resetGame()`, the existing Mist Swamp-only `prepareSleepingBridgeLevel()` shuffles a fixed pool of verified lamp anchors for hard/crazy and applies four unique anchors to the four existing `mushroom_lamp` tasks. A small Mist Swamp-only interaction priority makes unfinished lamps win over a completed frog when their interaction circles overlap.

**Tech Stack:** Vanilla JavaScript, Canvas 2D, Node.js `node:test`, VM-based functional runtime tests.

## Global Constraints

- New behavior must run only for `levels[state.levelIndex]?.world === "mist_swamp"` and level name `沉睡木桥`.
- Do not change Day 1-7, Moonlight Lake, Apple Valley, Forest Road, other Mist Swamp levels, existing bosses, difficulty selection, or score settlement.
- Reuse existing transparent PNG assets and Canvas fallbacks.
- Keep task kinds in snake_case and item/prop keys in camelCase.
- Do not add a task kind or refactor the shared game flow.

---

### Task 1: Align the bridge and add safe hard/crazy lamp placement

**Files:**
- Modify: `game.js:56-61`
- Modify: `game.js:1368-1394`
- Modify: `game.js:1705-1721`
- Test: `tests/mist-swamp-runtime.test.mjs:112-121`
- Test: `tests/mist-swamp-runtime.test.mjs:210-285`

**Interfaces:**
- Consumes: `selectedDifficulty`, `isMistSwampSleepingBridgeLevel()`, `state.tasksList`, and the existing `mushroom_lamp` tasks.
- Produces: `SLEEPING_BRIDGE_REPAIR_ANCHOR`, `SLEEPING_BRIDGE_LAMP_SLOTS`, `randomSleepingBridgeLampSlots()`, and `placeSleepingBridgeMushroomLamps()`.

- [ ] **Step 1: Write the failing layout tests**

Add assertions to `tests/mist-swamp-runtime.test.mjs` that preserve the fixed level definition, require the new bridge anchor, and exercise deterministic hard/crazy shuffles:

```js
assert.deepEqual(
  plain(sleepingBridgeLevel.tasks.find((task) => task.kind === "broken_bridge")),
  {
    x: 570,
    y: 300,
    name: "沉睡木桥",
    animal: "brokenBridge",
    need: ["bridgePlank", "bridgePlank", "bridgePlank"],
    kind: "broken_bridge",
    done: false,
    progress: 0,
  }
);

const bridgeLayouts = vm.runInContext(`
  const bridgeLevelIndex = levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沉睡木桥");
  const originalRandom = Math.random;
  const readLayout = () => state.tasksList
    .filter((task) => task.kind === "mushroom_lamp")
    .map(({ color, x, y }) => ({ color, x, y }));

  selectedDifficulty = "easy";
  resetGame(bridgeLevelIndex);
  const easy = readLayout();

  selectedDifficulty = "normal";
  resetGame(bridgeLevelIndex);
  const normal = readLayout();

  Math.random = () => 0;
  selectedDifficulty = "hard";
  resetGame(bridgeLevelIndex);
  const hard = readLayout();

  Math.random = () => 0.999;
  selectedDifficulty = "crazy";
  resetGame(bridgeLevelIndex);
  const crazy = readLayout();
  Math.random = originalRandom;

  ({ easy, normal, hard, crazy, slots: SLEEPING_BRIDGE_LAMP_SLOTS });
`, runtime);

const fixedLampLayout = [
  { color: "yellow", x: 300, y: 150 },
  { color: "blue", x: 450, y: 150 },
  { color: "purple", x: 600, y: 150 },
  { color: "green", x: 800, y: 150 },
];
assert.deepEqual(plain(bridgeLayouts.easy), fixedLampLayout);
assert.deepEqual(plain(bridgeLayouts.normal), fixedLampLayout);
assert.notDeepEqual(plain(bridgeLayouts.hard), fixedLampLayout);
assert.notDeepEqual(plain(bridgeLayouts.crazy), fixedLampLayout);
assert.notDeepEqual(plain(bridgeLayouts.hard), plain(bridgeLayouts.crazy));

for (const layout of [bridgeLayouts.hard, bridgeLayouts.crazy]) {
  const points = plain(layout);
  assert.equal(new Set(points.map(({ x, y }) => `${x},${y}`)).size, 4);
  assert.deepEqual(points.map(({ color }) => color), ["yellow", "blue", "purple", "green"]);
  for (const point of points) {
    assert.ok(bridgeLayouts.slots.some((slot) => slot.x === point.x && slot.y === point.y));
  }
  for (let left = 0; left < points.length; left += 1) {
    for (let right = left + 1; right < points.length; right += 1) {
      assert.ok(Math.hypot(points[left].x - points[right].x, points[left].y - points[right].y) >= 110);
    }
  }
}

const reservedBridgeAreas = [
  { x: 570, y: 300, distance: 120, label: "bridge repair" },
  { x: 230, y: 180, distance: 80, label: "plank one" },
  { x: 440, y: 350, distance: 80, label: "plank two" },
  { x: 690, y: 170, distance: 80, label: "plank three" },
  { x: 680, y: 340, distance: 120, label: "frog start" },
  { x: 830, y: 210, distance: 116, label: "exit interaction" },
];
for (const slot of bridgeLayouts.slots) {
  for (const reserved of reservedBridgeAreas) {
    assert.ok(
      Math.hypot(slot.x - reserved.x, slot.y - reserved.y) >= reserved.distance,
      `${slot.x},${slot.y} should avoid ${reserved.label}`
    );
  }
}
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: FAIL because the bridge still uses `{ x: 550, y: 280 }` and `SLEEPING_BRIDGE_LAMP_SLOTS` does not exist.

- [ ] **Step 3: Add the bridge anchor, safe slots, and shuffle implementation**

Add beside the existing Mist Swamp difficulty constants in `game.js`:

```js
const SLEEPING_BRIDGE_REPAIR_ANCHOR = Object.freeze({ x: 570, y: 300 });
const SLEEPING_BRIDGE_LAMP_SLOTS = Object.freeze([
  Object.freeze({ x: 120, y: 115 }),
  Object.freeze({ x: 280, y: 105 }),
  Object.freeze({ x: 440, y: 115 }),
  Object.freeze({ x: 600, y: 100 }),
  Object.freeze({ x: 760, y: 95 }),
  Object.freeze({ x: 900, y: 110 }),
]);
```

Use the bridge anchor in the `沉睡木桥` task definition:

```js
{
  x: SLEEPING_BRIDGE_REPAIR_ANCHOR.x,
  y: SLEEPING_BRIDGE_REPAIR_ANCHOR.y,
  name: "沉睡木桥",
  animal: "brokenBridge",
  need: ["bridgePlank", "bridgePlank", "bridgePlank"],
  kind: "broken_bridge",
  done: false,
  progress: 0,
},
```

Add the two focused helpers before `prepareSleepingBridgeLevel()`:

```js
function randomSleepingBridgeLampSlots() {
  const slots = SLEEPING_BRIDGE_LAMP_SLOTS.map((slot) => ({ ...slot }));
  for (let index = slots.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [slots[index], slots[swapIndex]] = [slots[swapIndex], slots[index]];
  }
  return slots.slice(0, 4);
}

function placeSleepingBridgeMushroomLamps() {
  if (!isMistSwampSleepingBridgeLevel() || !["hard", "crazy"].includes(selectedDifficulty)) return;
  const slots = randomSleepingBridgeLampSlots();
  state.tasksList.filter((task) => task.kind === "mushroom_lamp").forEach((task, index) => {
    task.x = slots[index].x;
    task.y = slots[index].y;
  });
}
```

Call `placeSleepingBridgeMushroomLamps()` inside `prepareSleepingBridgeLevel()` after setting the optional flags. Do not change the color order or sequence array.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: PASS with no changed behavior in other Mist Swamp runtime cases.

- [ ] **Step 5: Commit the aligned bridge and randomized layout**

```bash
git add game.js tests/mist-swamp-runtime.test.mjs
git commit -m "Improve Sleeping Bridge lamp layout"
```

---

### Task 2: Prevent the completed frog from blocking an unfinished lamp

**Files:**
- Modify: `game.js:1705-1721`
- Modify: `game.js:2867-2885`
- Test: `tests/mist-swamp-runtime.test.mjs:237-285`

**Interfaces:**
- Consumes: `isMistSwampSleepingBridgeLevel()`, `state.nearbyTask`, and existing task `done`/`kind` fields.
- Produces: `sleepingBridgeNearbyPriority(task)` returning `1` only for an unfinished Sleeping Bridge mushroom lamp, otherwise `0`.

- [ ] **Step 1: Write the failing interaction-priority and instruction tests**

Add to `tests/mist-swamp-runtime.test.mjs`:

```js
const bridgeInteractionPriority = vm.runInContext(`
  selectedDifficulty = "hard";
  const originalRandom = Math.random;
  Math.random = () => 0.999;
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沉睡木桥"));
  const greenLamp = state.tasksList.find((task) => task.kind === "mushroom_lamp" && task.color === "green");
  const completedFrog = state.tasksList.find((task) => task.kind === "escort_npc");
  completedFrog.done = true;
  completedFrog.x = greenLamp.x;
  completedFrog.y = greenLamp.y;
  state.player.x = greenLamp.x;
  state.player.y = greenLamp.y;
  checkTasks(0.016);
  const result = { nearbyKind: state.nearbyTask.kind, nearbyColor: state.nearbyTask.color, instruction: messageEl.textContent };
  Math.random = originalRandom;
  result;
`, runtime);
assert.deepEqual(plain(bridgeInteractionPriority), {
  nearbyKind: "mushroom_lamp",
  nearbyColor: "green",
  instruction: "按 E 互动",
});

const bridgeStartMessages = vm.runInContext(`
  const bridgeLevelIndex = levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沉睡木桥");
  const result = {};
  for (const difficulty of ["easy", "normal", "hard", "crazy"]) {
    selectedDifficulty = difficulty;
    resetGame(bridgeLevelIndex);
    result[difficulty] = messageEl.textContent;
  }
  result;
`, runtime);
assert.equal(bridgeStartMessages.easy, "找齐木桥板，修好木桥，再带小青蛙去出口。");
assert.equal(bridgeStartMessages.normal, "找齐木桥板，修好木桥，再带小青蛙去出口。");
assert.equal(bridgeStartMessages.hard, "观察灯的位置，按黄 → 蓝 → 紫 → 绿点亮。");
assert.equal(bridgeStartMessages.crazy, "观察灯的位置，按黄 → 蓝 → 紫 → 绿点亮。");
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: FAIL because `checkTasks()` still selects the completed frog when it is closer or later in task order, and hard/crazy still use the generic level message.

- [ ] **Step 3: Implement Mist Swamp-only interaction priority and message**

Add near the other Sleeping Bridge helpers:

```js
function sleepingBridgeNearbyPriority(task) {
  return isMistSwampSleepingBridgeLevel() && task.kind === "mushroom_lamp" && !task.done ? 1 : 0;
}
```

Update only the nearest-task selection inside `checkTasks()`:

```js
let nearestDistance = Infinity;
let nearestPriority = -1;
for (const task of state.tasksList) {
  if (isMistSwampLevel() && task.kind === "mud_bubble" && (!task.active || task.done)) continue;
  const near = distance(p, task) < 58;
  if (near) {
    const dist = distance(p, task);
    const priority = sleepingBridgeNearbyPriority(task);
    if (priority > nearestPriority || (priority === nearestPriority && dist < nearestDistance)) {
      nearestPriority = priority;
      nearestDistance = dist;
      state.nearbyTask = task;
    }
  }
```

Outside `沉睡木桥`, every task has priority `0`, preserving the existing nearest-distance behavior.

After the Sleeping Bridge preparation in `resetGame()`, set the starting message with a guarded expression:

```js
messageEl.textContent = isMistSwampSleepingBridgeLevel() && ["hard", "crazy"].includes(selectedDifficulty)
  ? "观察灯的位置，按黄 → 蓝 → 紫 → 绿点亮。"
  : level.message;
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: PASS, including the existing bridge repair, frog escort, sequence, and five-level settlement cases.

- [ ] **Step 5: Commit the interaction fix**

```bash
git add game.js tests/mist-swamp-runtime.test.mjs
git commit -m "Prevent Sleeping Bridge lamp interaction blocking"
```

---

### Task 3: Refresh the browser script and verify the complete level

**Files:**
- Modify: `index.html:171`
- Test: `tests/mist-swamp-base.test.mjs`

**Interfaces:**
- Consumes: the existing `game.js` script tag.
- Produces: browser cache key `mist-swamp-bridge-layout-20260721` for `game.js` only.

- [ ] **Step 1: Write the failing cache-key assertion**

Use the existing `index` string loaded from `index.html` in `tests/mist-swamp-base.test.mjs` and add:

```js
assert.match(index, /game\.js\?v=mist-swamp-bridge-layout-20260721/);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/mist-swamp-base.test.mjs
```

Expected: FAIL because `index.html` still loads `game.js?v=mist-swamp-final-20260720c`.

- [ ] **Step 3: Update only the game script cache key**

Change the `game.js` script tag in `index.html` to:

```html
<script src="./game.js?v=mist-swamp-bridge-layout-20260721"></script>
```

Do not change unrelated script versions.

- [ ] **Step 4: Run syntax and automated verification**

Run:

```bash
node --check game.js
node --check world-map.js
node --check mist-swamp-map-entry.js
node --check mist-swamp-quiz-bank.js
node --test tests/*.test.mjs
git diff --check
```

Expected: all syntax checks exit `0`, all tests pass, and `git diff --check` prints no errors.

- [ ] **Step 5: Browser-smoke the Sleeping Wooden Bridge**

Open the local `沉睡木桥` level and verify:

1. Easy and normal show the fixed lamp layout.
2. Hard and crazy change lamp positions after restart while preserving four reachable unique lamps.
3. The bridge prop sits on the cracked bridge deck before repair and remains aligned after repair.
4. `黄 → 蓝 → 紫 → 绿` completes on hard and crazy.
5. A completed frog cannot block interaction with an unfinished lamp.
6. All four difficulties complete and open the normal settlement panel.
7. Browser console errors and warnings remain `0`.

- [ ] **Step 6: Commit the cache refresh and verification test**

```bash
git add index.html tests/mist-swamp-base.test.mjs
git commit -m "Refresh Sleeping Bridge browser cache"
```
