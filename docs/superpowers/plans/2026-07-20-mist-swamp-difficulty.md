# Mist Swamp Difficulty Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all five Mist Swamp levels more challenging through observation, memory, timing, and staged boss mechanics while preserving child-friendly recovery and normal settlement.

**Architecture:** Keep level data and dispatch structure intact. Add Mist Swamp-only difficulty constants and state, then extend `updateMistSwampMechanisms(dt)` and `interactMistSwampTask(task)` behind the existing world guard. Functional VM tests exercise the real runtime without changing shared chapter behavior.

**Tech Stack:** Vanilla JavaScript, Canvas 2D, Node.js built-in test runner, Node `vm`, static local browser preview.

## Global Constraints

- Every new mechanism must run only when `levels[state.levelIndex]?.world === "mist_swamp"`.
- Do not modify Day 1-7, Moonlight Lake, Apple Valley, Forest Road, existing boss branches, score settlement, or difficulty selection behavior.
- Keep task kinds snake_case and item/prop keys camelCase.
- Do not add an attack system, damage penalties, level-wide failure resets, or player teleportation.
- Relighting a completed lamp must not consume another item or award duplicate task progress.
- Preserve the repaired bridge, difficulty plank counts, frog `escort_npc`, and `mistBridgeExit` safe zone.
- Preserve transparent PNG art and Canvas fallbacks; missing assets must not blank the game.

---

### Task 1: Restore and lock the dedicated Mist Swamp art mappings

**Files:**
- Create: `tests/mist-swamp-art-assets.test.mjs`
- Modify: `game.js:107-145`
- Modify: `game.js:4142-4310`
- Modify: `art-assets.js:78-112`
- Add: `assets/bg/mist_swamp_entrance.png`
- Add: `assets/bg/firefly_trail_path.png`
- Add: `assets/bg/sleeping_wooden_bridge.png`
- Add: `assets/bg/mud_monster_lair.png`
- Add: `assets/npc/ruru_raccoon.png`
- Add: `assets/npc/firefly_guide.png`
- Add: `assets/npc/little_frog.png`
- Add: `assets/npc/mud_monster.png`

**Interfaces:**
- Consumes: existing `backgroundSources`, `backgroundSourceCandidates`, `ART_PACK_NPC_KEYS`, `ART_PACK_NPC_BOUNDS`, and `CATS_OWLS_ART_PACK_01` registry.
- Produces: dedicated background keys and directly usable transparent NPC assets with fallback candidates.

- [ ] **Step 1: Write the failing asset contract test**

```js
for (const [key, file] of [
  ["mistSwampEntrance", "assets/bg/mist_swamp_entrance.png"],
  ["fireflyTrailPath", "assets/bg/firefly_trail_path.png"],
  ["sleepingWoodenBridge", "assets/bg/sleeping_wooden_bridge.png"],
  ["mudMonsterLair", "assets/bg/mud_monster_lair.png"],
]) {
  assert.ok(existsSync(new URL(`../${file}`, import.meta.url)));
  assert.match(game, new RegExp(`${key}: ["']\\./${file}["']`));
}
for (const file of ["ruru_raccoon.png", "firefly_guide.png", "little_frog.png", "mud_monster.png"]) {
  assert.ok(existsSync(new URL(`../assets/npc/${file}`, import.meta.url)));
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/mist-swamp-art-assets.test.mjs`

Expected: FAIL because the clean branch still points to shared V2 backgrounds and old NPC entries.

- [ ] **Step 3: Copy approved assets and add minimal mappings**

```js
mistSwampEntrance: "./assets/bg/mist_swamp_entrance.png",
fireflyTrailPath: "./assets/bg/firefly_trail_path.png",
sleepingWoodenBridge: "./assets/bg/sleeping_wooden_bridge.png",
mudMonsterLair: "./assets/bg/mud_monster_lair.png",
```

Add the new path first in each fallback candidate array. Register `fireflyGuide`, `littleFrog`, `ruru`, and `mudMonster` in `ART_PACK_NPC_KEYS`, `ART_PACK_NPC_BOUNDS`, and `art-assets.js` without removing fallback renderers.

- [ ] **Step 4: Run the focused test**

Run: `node --test tests/mist-swamp-art-assets.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add game.js art-assets.js tests/mist-swamp-art-assets.test.mjs assets/bg assets/npc
git commit -m "Add dedicated Mist Swamp art"
```

---

### Task 2: Add difficulty configuration and recoverable lamp state

**Files:**
- Modify: `game.js:50-60`
- Modify: `game.js:1580-1705`
- Modify: `game.js:3324-3344`
- Test: `tests/mist-swamp-runtime.test.mjs`

**Interfaces:**
- Consumes: `MIST_CLEAR_TIME_BY_DIFFICULTY`, `selectedDifficulty`, `resetGame()`, `mistLampTask()`, `completeTask()`.
- Produces: `mistLampDuration()`, `isMistLampActive(task, now)`, per-task `litUntil`, and global `state.mistMistakeCount`.

- [ ] **Step 1: Add failing runtime assertions for lamp expiry and free relighting**

```js
const relight = vm.runInContext(`
  selectedDifficulty = "normal";
  resetGame(levels.findIndex((level) => level.name === "迷雾沼泽入口"));
  const lamp = state.tasksList.find((task) => task.kind === "mist_lamp");
  state.inventory.push("fireflyCore");
  interactMistSwampTask(lamp);
  const tasksAfterFirstLight = state.tasks;
  const inventoryAfterFirstLight = state.inventory.length;
  performance.now = () => 13000;
  interactMistSwampTask(lamp);
  ({ tasksAfterFirstLight, tasksAfterRelight: state.tasks,
     inventoryAfterFirstLight, inventoryAfterRelight: state.inventory.length,
     litUntil: lamp.litUntil });
`, runtime);
assert.equal(relight.tasksAfterRelight, relight.tasksAfterFirstLight);
assert.equal(relight.inventoryAfterRelight, relight.inventoryAfterFirstLight);
assert.ok(relight.litUntil > 13000);
```

- [ ] **Step 2: Run the runtime test and verify failure**

Run: `node --test tests/mist-swamp-runtime.test.mjs`

Expected: FAIL because completed lamps currently short-circuit or use only global `mistClearUntil`.

- [ ] **Step 3: Implement task-local lamp activity**

```js
function mistLampDuration() {
  return MIST_CLEAR_TIME_BY_DIFFICULTY[selectedDifficulty];
}

function isMistLampActive(task, now = performance.now()) {
  return task?.lit && (task.litUntil === null || task.litUntil > now);
}
```

On first interaction, consume the required item and call `completeTask()`. On subsequent interactions, set `task.lit = true` and refresh `task.litUntil` without consuming or completing again. Use `null` for easy and an absolute expiry for other difficulties.

- [ ] **Step 4: Run focused Mist Swamp tests**

Run: `node --test tests/mist-swamp-mechanics.test.mjs tests/mist-swamp-runtime.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add game.js tests/mist-swamp-runtime.test.mjs
git commit -m "Make Mist Swamp lamps safely relightable"
```

---

### Task 3: Add entrance timing gate and recoverable firefly route mistakes

**Files:**
- Modify: `game.js:1320-1362`
- Modify: `game.js:2535-2568`
- Modify: `game.js:3324-3344`
- Modify: `game.js:4750-4775`
- Test: `tests/mist-swamp-runtime.test.mjs`

**Interfaces:**
- Consumes: `isMistLampActive()`, `state.fireflyTrailIndex`, `state.fireflyTrail`, `state.mistOpacity`.
- Produces: `hasActiveMistLamp()`, `mistTrailRollback()`, task property `requiresActiveLamp`, and difficulty-aware decoy feedback.

- [ ] **Step 1: Add failing entrance and decoy tests**

```js
const entranceGate = vm.runInContext(`
  selectedDifficulty = "normal";
  resetGame(levels.findIndex((level) => level.name === "迷雾沼泽入口"));
  const ruru = state.tasksList.find((task) => task.animal === "ruru");
  state.inventory.push("fireflyCore");
  interactMistSwampTask(ruru);
  ({ done: ruru.done, message: messageEl.textContent });
`, runtime);
assert.equal(entranceGate.done, false);
assert.match(entranceGate.message, /先点亮一盏雾灯/);

const decoy = vm.runInContext(`
  selectedDifficulty = "hard";
  resetGame(levels.findIndex((level) => level.name === "萤火虫小径"));
  state.fireflyTrailIndex = 3;
  const point = state.fireflyTrail.find((entry) => entry.decoy);
  state.player.x = point.x; state.player.y = point.y;
  updateMistSwampMechanisms(0.016);
  ({ index: state.fireflyTrailIndex, playerX: state.player.x, fog: state.mistOpacity });
`, runtime);
assert.equal(decoy.index, 2);
assert.equal(decoy.playerX, 500);
assert.ok(decoy.fog > 0.32);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test tests/mist-swamp-runtime.test.mjs`

Expected: FAIL because Ruru has no active-lamp gate and decoys do not roll back progress.

- [ ] **Step 3: Implement Mist Swamp-only gates**

```js
function hasActiveMistLamp() {
  return state.tasksList.some((task) => task.kind === "mist_lamp" && isMistLampActive(task));
}

function mistTrailRollback() {
  if (selectedDifficulty !== "easy") state.fireflyTrailIndex = Math.max(0, state.fireflyTrailIndex - 1);
  state.mistOpacity = Math.min(0.42, state.mistOpacity + 0.08);
}
```

Mark the Ruru task with `requiresActiveLamp: true` and guard its delivery interaction only in Mist Swamp. Keep player coordinates unchanged. Update trail rendering so correct points have a stable warm-gold pulse and decoys remain green with lower alpha.

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/mist-swamp-runtime.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add game.js tests/mist-swamp-runtime.test.mjs
git commit -m "Add recoverable Mist Swamp route challenges"
```

---

### Task 4: Make mushroom memory difficulty-aware and stage the Mist Core

**Files:**
- Modify: `game.js:1364-1412`
- Modify: `game.js:1670-1690`
- Modify: `game.js:2540-2570`
- Modify: `game.js:3345-3403`
- Test: `tests/mist-swamp-runtime.test.mjs`

**Interfaces:**
- Consumes: `prepareSleepingBridgeLevel()`, `interactMistSwampTask()`, `mist_bubble` tasks.
- Produces: `mushroomSequenceForDifficulty()`, `state.mistCoreBubbleIndex`, and `isMistCoreBubbleActive(task)`.

- [ ] **Step 1: Replace outdated mushroom assertions and add ordered-core failures**

```js
for (const [difficulty, expected] of Object.entries({ easy: 2, normal: 3, hard: 4, crazy: 4 })) {
  const length = vm.runInContext(`
    selectedDifficulty = "${difficulty}";
    resetGame(levels.findIndex((level) => level.name === "沉睡木桥"));
    state.mushroomSequence.length;
  `, runtime);
  assert.equal(length, expected);
}

const coreOrder = vm.runInContext(`
  selectedDifficulty = "normal";
  resetGame(levels.findIndex((level) => level.name === "迷雾核心"));
  state.tasksList.filter((task) => task.kind === "mist_lamp").forEach((task) => { task.done = true; task.lit = true; task.litUntil = null; });
  const bubbles = state.tasksList.filter((task) => task.kind === "mist_bubble");
  interactMistSwampTask(bubbles[1]);
  const secondDoneEarly = bubbles[1].done;
  interactMistSwampTask(bubbles[0]);
  ({ secondDoneEarly, firstDone: bubbles[0].done, index: state.mistCoreBubbleIndex });
`, runtime);
assert.equal(coreOrder.secondDoneEarly, false);
assert.equal(coreOrder.firstDone, true);
assert.equal(coreOrder.index, 1);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test tests/mist-swamp-runtime.test.mjs`

Expected: FAIL because easy/normal mushrooms are pre-completed and all core bubbles are currently vulnerable.

- [ ] **Step 3: Implement difficulty sequences without weakening bridge recovery**

```js
function mushroomSequenceForDifficulty() {
  if (selectedDifficulty === "easy") return ["yellow", "blue"];
  if (selectedDifficulty === "normal") return ["yellow", "blue", "purple"];
  return ["yellow", "blue", "purple", "green"];
}
```

Keep mushrooms excluded from hard completion checks only on easy/normal, but do not mark them done during reset. Completing easy/normal mushrooms awards their normal task points without becoming a settlement prerequisite.

For Mist Core, initialize `state.mistCoreBubbleIndex = 0`. Reject a bubble unless all core lamps are complete and its array index equals the active index. Correct interaction completes one bubble and increments the index. Draw a bright ring around only the active bubble.

- [ ] **Step 4: Verify bridge and core behavior**

Run: `node --test tests/mist-swamp-runtime.test.mjs`

Expected: PASS, including plank counts, frog escort, and ordered bubbles.

- [ ] **Step 5: Commit**

```bash
git add game.js tests/mist-swamp-runtime.test.mjs
git commit -m "Stage Mist Swamp memory and core puzzles"
```

---

### Task 5: Add simultaneous boss lamps, bubble waves, and lantern charging

**Files:**
- Modify: `game.js:50-60`
- Modify: `game.js:1590-1600`
- Modify: `game.js:1690-1710`
- Modify: `game.js:2568-2605`
- Modify: `game.js:3404-3435`
- Modify: `game.js:4775-4805`
- Modify: `mist-swamp-quiz-bank.js`
- Test: `tests/mist-swamp-runtime.test.mjs`

**Interfaces:**
- Consumes: `isMistLampActive()`, `state.mudBubbles`, `mudBossTask()`, existing `openQuiz()` and quiz result dispatcher.
- Produces: `MIST_LANTERN_CHARGE_TIME_BY_DIFFICULTY`, `activateMudBubbleWave()`, `state.lanternCharge`, and task property `quizRetryNeedsCharge`.

- [ ] **Step 1: Add failing boss phase tests**

```js
for (const [difficulty, chargeSeconds] of Object.entries({ easy: 1.2, normal: 2, hard: 2.5, crazy: 3 })) {
  const setup = vm.runInContext(`
    selectedDifficulty = "${difficulty}";
    resetGame(levels.findIndex((level) => level.name === "沼泽泥浆怪"));
    ({ charge: state.lanternChargeRequired,
       active: state.mudBubbles.filter((bubble) => bubble.active).length });
  `, runtime);
  assert.equal(setup.charge, chargeSeconds);
  assert.equal(setup.active, 0);
}

const lampGate = vm.runInContext(`
  selectedDifficulty = "normal";
  resetGame(levels.findIndex((level) => level.name === "沼泽泥浆怪"));
  const boss = state.tasksList.find((task) => task.kind === "mud_boss");
  const lamps = state.tasksList.filter((task) => task.kind === "mist_lamp");
  lamps.forEach((lamp) => { lamp.done = true; lamp.lit = true; lamp.litUntil = 1; });
  performance.now = () => 2;
  updateMistSwampMechanisms(0.016);
  boss.phase;
`, runtime);
assert.equal(lampGate, 1);
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test tests/mist-swamp-runtime.test.mjs`

Expected: FAIL because phase 1 checks only permanent `done` values and lantern charging does not exist.

- [ ] **Step 3: Implement boss progression**

```js
const MIST_LANTERN_CHARGE_TIME_BY_DIFFICULTY = {
  easy: 1.2,
  normal: 2,
  hard: 2.5,
  crazy: 3,
};

function activateMudBubbleWave() {
  const limit = selectedDifficulty === "hard" || selectedDifficulty === "crazy" ? 2 : 1;
  state.mudBubbles.filter((bubble) => !bubble.done).slice(0, limit).forEach((bubble) => { bubble.active = true; });
}
```

Advance to phase 2 only when all three lamps are currently active. After each cleared wave, activate the next one. In phase 3, accumulate `state.lanternCharge += dt` only while the player remains within the boss interaction radius and has the temporary or earned lantern. Open the quiz after the configured duration.

In the Mist Swamp boss quiz wrong-answer branch, set `state.lanternCharge = 0` and close the quiz while leaving `task.phase = 3`. Do not touch other quiz branches.

- [ ] **Step 4: Run boss and legacy regression tests**

Run: `node --test tests/mist-swamp-runtime.test.mjs tests/mist-swamp-mechanics.test.mjs`

Expected: PASS, including bubble counts 2/3/4/4 and unchanged legacy task-kind counts.

- [ ] **Step 5: Commit**

```bash
git add game.js mist-swamp-quiz-bank.js tests/mist-swamp-runtime.test.mjs
git commit -m "Deepen Swamp Mud Monster phases"
```

---

### Task 6: Full verification and browser play-through

**Files:**
- Modify only if a verification failure identifies a Mist Swamp regression.
- Verify: `game.js`, `world-map.js`, `mist-swamp-map-entry.js`, `mist-swamp-quiz-bank.js`, `tests/*.test.mjs`

**Interfaces:**
- Consumes: all completed tasks.
- Produces: syntax-clean, test-clean, browser-verified five-level chapter with normal settlement.

- [ ] **Step 1: Run required syntax checks**

```bash
node --check game.js
node --check world-map.js
node --check mist-swamp-map-entry.js
node --check mist-swamp-quiz-bank.js
```

Expected: all exit 0 with no output.

- [ ] **Step 2: Run all tests and whitespace validation**

```bash
node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and `git diff --check` exits 0.

- [ ] **Step 3: Browser-smoke all five levels**

Open `?level=21&play=1` through `?level=25&play=1` and verify:

- Level 1 active-lamp Ruru gate can recover after fog returns.
- Level 2 correct trail completes and decoys never trap or teleport.
- Level 3 bridge repairs, frog reaches `mistBridgeExit`, and difficulty mushroom rules match the table.
- Level 4 enforces lamp → ordered bubbles → spirit.
- Level 5 completes simultaneous lamps → bubble waves → lantern charge → quiz.
- Every level opens the existing settlement panel.
- Console error count is zero.

- [ ] **Step 4: Commit verification fixes if needed**

```bash
git add game.js mist-swamp-quiz-bank.js tests
git commit -m "Polish Mist Swamp difficulty pass"
```

Skip this commit when no verification fixes are required.
