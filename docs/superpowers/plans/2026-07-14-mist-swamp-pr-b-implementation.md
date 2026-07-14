# Mist Swamp PR B Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Mist Swamp-only timed fog, decoy fireflies, four-color memory, Mist Core prerequisites, and the three-phase Swamp Mud Monster Boss.

**Architecture:** Extend only the existing update, interaction, reset, hint, and Canvas drawing dispatchers with branches guarded by `levels[state.levelIndex]?.world === "mist_swamp"`. Reuse `completeTask`, quiz UI, inventory, difficulty, and score settlement without modifying their existing behavior.

**Tech Stack:** Browser JavaScript, Canvas 2D, Node.js built-in test runner.

## Global Constraints

- PR B is based on verified PR A.
- No mechanism runs outside `level.world === "mist_swamp"`.
- Existing shared branch conditions and bodies remain unchanged; append guarded branches only.
- Easy fog clears permanently with `null`, not a large time value.
- Interaction clears `mudBubble`; attack support is optional and must reuse the stable existing action.
- Boss reset guarantees enough temporary `lightSpore` and `fireflyLantern` to avoid deadlock.

---

### Task 1: Lock advanced mechanics with failing tests

**Files:**
- Create: `tests/mist-swamp-mechanics.test.mjs`

**Interfaces:**
- Consumes: `game.js` source text and exported game data.
- Produces: contracts for constants, guards, task kinds, rewards, and Boss phases.

- [ ] **Step 1: Write the failing test**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
assert.match(game, /MIST_CLEAR_TIME_BY_DIFFICULTY\s*=\s*\{[\s\S]*?easy:\s*null[\s\S]*?normal:\s*12000[\s\S]*?hard:\s*8000[\s\S]*?crazy:\s*6000/);
for (const kind of ["mist_lamp", "firefly_trail", "mushroom_lamp", "broken_bridge", "mist_core", "mud_boss"]) assert.ok(game.includes(`kind: "${kind}"`));
assert.ok(game.includes("这不是正确路线，再观察一下吧。"));
assert.ok(game.includes("再看一看萤火虫提示哦。"));
assert.ok(game.includes("黑雾变淡了，泥浆怪露出了泥浆泡泡！"));
assert.ok(game.includes("泥浆怪安静下来了，它原来是在守护沼泽。"));
assert.match(game, /function isMistSwampLevel\(\)[\s\S]*?world\s*===\s*"mist_swamp"/);
assert.ok(game.includes("mistGuardianBadge"));
assert.match(game, /MUD_BUBBLE_COUNT_BY_DIFFICULTY\s*=\s*\{\s*easy:\s*2,\s*normal:\s*3,\s*hard:\s*4,\s*crazy:\s*4/);
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/mist-swamp-mechanics.test.mjs`

Expected: FAIL because PR A has no advanced task kinds or constants.

### Task 2: Add timed fog and correct/decoy firefly trail

**Files:**
- Modify: `game.js`
- Test: `tests/mist-swamp-mechanics.test.mjs`

**Interfaces:**
- Produces: `isMistSwampLevel()`, fog state, relight interaction, and ordered trail state.

- [ ] **Step 1: Add constants and state**

```js
const MIST_CLEAR_TIME_BY_DIFFICULTY = { easy: null, normal: 12000, hard: 8000, crazy: 6000 };
function isMistSwampLevel() {
  return levels[state.levelIndex]?.world === "mist_swamp";
}
```

During `resetGame`, copy `mistOpacity`, `mistClearUntil`, `fireflyTrail`, and `fireflyTrailIndex` only from the current Mist Swamp level; default other worlds to inert values.

- [ ] **Step 2: Add guarded update functions**

```js
function updateMistSwampMechanisms(dt) {
  if (!isMistSwampLevel()) return;
  updateMistFog(dt);
  updateFireflyTrail(dt);
}
```

Call this by appending one line in `update(dt)` without altering existing update calls. `updateMistFog` keeps easy opacity cleared; timed modes ease opacity toward the level base after `mistClearUntil`. `updateFireflyTrail` advances only the next correct point, fades nearby decoys with no penalty, and never moves a decoy into a dead corner.

- [ ] **Step 3: Add guarded interaction and drawing**

Append Mist Swamp-only interaction handling for `mist_lamp` and draw the fog overlay at the end of world rendering but before UI/hints. Draw route points with correct, pending, and faded-decoy colors.

- [ ] **Step 4: Verify GREEN for fog and trail**

Run: `node --test tests/mist-swamp-mechanics.test.mjs`

Expected: failures remain only for mushroom, core, and Boss contracts.

### Task 3: Add four-color mushroom memory and Mist Core prerequisites

**Files:**
- Modify: `game.js`
- Test: `tests/mist-swamp-mechanics.test.mjs`

**Interfaces:**
- Produces: `mushroom_lamp`, `broken_bridge`, and `mist_core` completion branches.

- [ ] **Step 1: Replace PR A placeholders with explicit task data**

Replace Level 3 and Level 4 PR A task arrays with these exact advanced task shapes:

```js
mushroomSequence: ["yellow", "blue", "purple", "green"],
tasks: [
  { x: 250, y: 170, name: "黄色蘑菇灯", animal: "mushroomLamp", kind: "mushroom_lamp", color: "yellow", done: false },
  { x: 410, y: 160, name: "蓝色蘑菇灯", animal: "mushroomLamp", kind: "mushroom_lamp", color: "blue", done: false },
  { x: 570, y: 170, name: "紫色蘑菇灯", animal: "mushroomLamp", kind: "mushroom_lamp", color: "purple", done: false },
  { x: 730, y: 160, name: "绿色蘑菇灯", animal: "mushroomLamp", kind: "mushroom_lamp", color: "green", done: false },
  { x: 520, y: 320, name: "沉睡木桥", animal: "brokenBridge", kind: "broken_bridge", need: ["bridgePlank", "bridgePlank", "bridgePlank"], done: false },
  escortNpcTask(230, 390, "小青蛙", "littleFrog", "mistBridgeExit"),
],
```

```js
tasks: [
  { x: 250, y: 170, name: "大雾灯一", animal: "bigMistLamp", kind: "mist_lamp", need: "lightSpore", done: false },
  { x: 480, y: 130, name: "大雾灯二", animal: "bigMistLamp", kind: "mist_lamp", need: "lightSpore", done: false },
  { x: 710, y: 170, name: "大雾灯三", animal: "bigMistLamp", kind: "mist_lamp", need: "lightSpore", done: false },
  { x: 330, y: 330, name: "黑雾泡泡一", animal: "darkMistBubble", kind: "mist_bubble", done: false },
  { x: 520, y: 350, name: "黑雾泡泡二", animal: "darkMistBubble", kind: "mist_bubble", done: false },
  { x: 700, y: 330, name: "黑雾泡泡三", animal: "darkMistBubble", kind: "mist_bubble", done: false },
  { x: 810, y: 260, name: "迷雾精灵", animal: "mistSpirit", kind: "mist_core", reward: ["mistBadge", "fireflyLantern"], done: false },
],
```

- [ ] **Step 2: Append guarded interactions**

For `mushroom_lamp`, compare the selected task color to `state.mushroomSequence[state.mushroomStep]`; on failure reset the step and display `再看一看萤火虫提示哦。`, and on four correct choices display `蘑菇灯都亮啦！`. For `broken_bridge`, consume three `bridgePlank` and display `木桥修好啦，可以安全通过了！`. For `mist_core`, require all lamps and bubbles completed before awarding `mistBadge` and `fireflyLantern` once.

- [ ] **Step 3: Add Canvas fallbacks**

Add `drawMushroomLamp(task)`, `drawBigMistLamp(task)`, and `drawMistBubble(task)` and route only the new task animals to them.

- [ ] **Step 4: Run targeted and full tests**

Run: `node --test tests/mist-swamp-mechanics.test.mjs tests/mist-swamp-base.test.mjs`

Expected: failures remain only for `mud_boss` phases.

### Task 4: Implement the non-damaging three-phase Mud Monster Boss

**Files:**
- Modify: `game.js`
- Modify: `mist-swamp-quiz-bank.js`
- Test: `tests/mist-swamp-mechanics.test.mjs`

**Interfaces:**
- Produces: `mud_boss` state machine, interaction-cleared bubbles, final quiz, and `mistGuardianBadge` reward.

- [ ] **Step 1: Add difficulty counts and safe reset inventory**

```js
const MUD_BUBBLE_COUNT_BY_DIFFICULTY = { easy: 2, normal: 3, hard: 4, crazy: 4 };
```

On Boss-level reset, count reachable `lightSpore` plus inventory and add only the missing amount to a `temporaryMistItems` list/inventory. If no `fireflyLantern` is present or reachable, add one temporary lantern. Clear temporary items on the next reset.

- [ ] **Step 2: Add the phase state machine**

Phase 1 completes after three `big_mist_lamp` tasks. Phase 2 activates the difficulty-specific number of `mud_bubble` tasks and clears each through the existing interaction key while nearby. Phase 3 opens a `mistSwampBoss` quiz only when a lantern is available. A correct answer calls `completeTask(mudBoss, mudBoss.x, mudBoss.y)`, awards `mistGuardianBadge` once, and leaves existing settlement detection unchanged.

- [ ] **Step 3: Add Boss quiz entries and fallback drawing**

Add the supplied kindness/logic question to the isolated quiz bank with `answer: 0`. Add hard/crazy variants only for those difficulty tiers. Draw `mudMonster`, `mudBubble`, and `bigMistLamp` through Canvas fallbacks; do not add damage hazards.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/mist-swamp-mechanics.test.mjs tests/mist-swamp-base.test.mjs`

Expected: PASS.

### Task 5: Verify and commit PR B

**Files:**
- Verify: all touched source and test files.

**Interfaces:**
- Produces: a clean advanced-mechanics commit ready for PR B review.

- [ ] **Step 1: Run required checks**

```bash
node --check game.js
node --check world-map.js
node --check mist-swamp-map-entry.js
node --check mist-swamp-quiz-bank.js
node --test tests/*.test.mjs
```

- [ ] **Step 2: Browser smoke all five levels**

Verify map entry, timed/permanent fog, safe decoy, four-color reset, bridge completion, Mist Core prerequisites, all Boss phases, quiz completion, and score panel. Recheck Black Bear and Nessie without console errors.

- [ ] **Step 3: Commit PR B scope**

```bash
git add game.js mist-swamp-quiz-bank.js tests/mist-swamp-mechanics.test.mjs
git commit -m "Add Mist Swamp challenge mechanics and Mud Monster"
```
