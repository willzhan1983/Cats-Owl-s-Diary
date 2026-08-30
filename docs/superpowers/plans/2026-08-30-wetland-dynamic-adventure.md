# Wetland Park Dynamic Adventure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the five Wetland Park levels into an input-driven adventure with moving hazards, memory routes, dynamic floating logs, mirror beams, and a nonviolent three-phase Fog Crocodile encounter.

**Architecture:** Extend `state.wetlandQuest` only under `world === "wetland_park"`. Add data to the existing five levels, advance dynamic objects in `updateWetlandParkMechanisms(dt)`, and resolve all interactions through the current E/touch interaction path. Existing dialogue, quiz, score settlement, music controls, and Canvas fallbacks remain intact.

**Tech Stack:** Browser JavaScript, HTML Canvas, existing asset loaders/fallbacks, Node built-in test runner, static local server.

**Spec:** `docs/superpowers/specs/2026-08-28-wetland-park-adventure-design.md`

## Global Constraints

- Preserve the existing uncommitted `game.js` and Wetland test changes; never reset, stash, or discard them.
- Every new runtime branch must guard with `isWetlandParkLevel()` or the exact Wetland level id; no old world behavior may change.
- Keep direction movement plus E/interaction as the only inputs. Do not add a jump button, attacks, or complex gestures.
- Retain a Canvas fallback for every dynamic object. Image or audio failures may not block loading or completion.
- Use `applyWetlandWrongAction` as the only Wetland failure entry. Points floor at zero and penalties remain Easy `-3 秒/-3 分`, Normal `-5 秒/-5 分`, Hard `-7 秒/-8 分`, Crazy `-9 秒/-12 分`.
- Errors reset only the current mechanic chain, segment, or Boss phase to a stable checkpoint; completed level objectives remain complete.
- Run `node --check game.js`, `git diff --check`, and focused tests after each task. Run `node --test tests/*.test.mjs` before browser QA.

---

## Planned File Structure

| Path | Responsibility |
| --- | --- |
| `game.js` | Wetland data, state, update/collision logic, drawing, interactions, and difficulty scaling. |
| `tests/wetland-park-mechanics.test.mjs` | Dynamic mechanic, failure-routing, and world-guard contract. |
| `tests/wetland-park-quest.test.mjs` | Dynamic task interaction contract. |
| `tests/wetland-park-runtime.test.mjs` | Art fallback and no cross-world regression guard. |

## Task 1: Establish the Wetland-only runtime contract

**Files:**

- Create: `tests/wetland-park-mechanics.test.mjs`
- Modify: `game.js: createWetlandQuestState, updateWetlandParkMechanisms, applyWetlandWrongAction`
- Test: `tests/wetland-park-mechanics.test.mjs`

**Interfaces:**

- Consumes: `isWetlandParkLevel()`, `state.wetlandQuest`, `addFloatingText()`, `updateHud()`, selected difficulty.
- Produces: `wetlandDifficultyConfig()`, `createWetlandAdventureState(level)`, one guarded update entry.

- [ ] **Step 1: Write the failing test.**

```js
assert.match(game, /function wetlandDifficultyConfig\(\)/);
assert.match(game, /function createWetlandAdventureState\(level\)/);
assert.match(game, /function updateWetlandParkMechanisms\(dt\)/);
assert.match(game, /state\.runPoints = Math\.max\(0, state\.runPoints - penalty\.points\)/);
```

- [ ] **Step 2: Run `node --test tests/wetland-park-mechanics.test.mjs`; expect FAIL because the two new helpers are absent.**

- [ ] **Step 3: Implement the smallest data helper and reset state.**

```js
function wetlandDifficultyConfig() {
  return {
    easy: { routeLength: 3, hintViews: Infinity, patrols: 1, patrolSpeed: 44, logSpeed: 38, mirrorCount: 3, bossSpeed: 68, bossWindow: 5.5 },
    normal: { routeLength: 4, hintViews: 2, patrols: 2, patrolSpeed: 58, logSpeed: 52, mirrorCount: 3, bossSpeed: 82, bossWindow: 4.5 },
    hard: { routeLength: 5, hintViews: 1, patrols: 3, patrolSpeed: 72, logSpeed: 68, mirrorCount: 4, bossSpeed: 98, bossWindow: 3.6 },
    crazy: { routeLength: 5, hintViews: 1, patrols: 4, patrolSpeed: 88, logSpeed: 84, mirrorCount: 4, bossSpeed: 116, bossWindow: 2.8 },
  }[selectedDifficulty] || { routeLength: 4, hintViews: 2, patrols: 2, patrolSpeed: 58, logSpeed: 52, mirrorCount: 3, bossSpeed: 82, bossWindow: 4.5 };
}
```

`createWetlandAdventureState(level)` returns only `checkpoint`, `hintViews`, `routeIndex`, `routeVisibleUntil`, `patrols`, `platforms`, `mirrorAngles`, `mirrorMistHits`, and `boss`. Merge it into `state.wetlandQuest` during reset; use empty defaults on levels without that mechanic.

- [ ] **Step 4: Update the failure helper to restore a supplied checkpoint.**

```js
function applyWetlandWrongAction(text, checkpoint = state.wetlandQuest.checkpoint) {
  const penalty = { easy: { time: 3, points: 3 }, normal: { time: 5, points: 5 }, hard: { time: 7, points: 8 }, crazy: { time: 9, points: 12 } }[selectedDifficulty] || { time: 5, points: 5 };
  state.time = Math.max(0, state.time - penalty.time);
  state.runPoints = Math.max(0, state.runPoints - penalty.points);
  state.hearts = Math.max(0, state.hearts - 1);
  state.player.x = checkpoint.x;
  state.player.y = checkpoint.y;
  addFloatingText(checkpoint.x, checkpoint.y - 54, `-${penalty.time} 秒 / -${penalty.points} 分`, "#dc5a5a");
  messageEl.textContent = `${text} 时间 -${penalty.time} 秒、积分 -${penalty.points}。`;
  updateHud();
}
```

- [ ] **Step 5: Run `node --check game.js && node --test tests/wetland-park-mechanics.test.mjs && git diff --check`; expect PASS; commit `feat: add Wetland adventure runtime contract`.**

## Task 2: Add fog patrols and the memory-route maze

**Files:**

- Modify: `game.js: wetland_fog_entrance and wetland_reed_maze data, update, interaction, drawing`
- Modify: `tests/wetland-park-mechanics.test.mjs`, `tests/wetland-park-quest.test.mjs`

**Interfaces:**

- Consumes: Task 1 helpers and current nearby-task E handling.
- Produces: `prepareWetlandFogPatrols()`, `updateWetlandFogPatrols(dt)`, `prepareWetlandMemoryRoute()`, `interactWetlandMemoryNode(task)`.

- [ ] **Step 1: Add failing assertions and run them.**

```js
assert.match(game, /function prepareWetlandFogPatrols\(\)/);
assert.match(game, /function updateWetlandFogPatrols\(dt\)/);
assert.match(game, /function prepareWetlandMemoryRoute\(\)/);
assert.match(game, /function interactWetlandMemoryNode\(task\)/);
assert.match(game, /kind: "wetland_memory_node"/);
```

Run: `node --test tests/wetland-park-mechanics.test.mjs tests/wetland-park-quest.test.mjs`

Expected: FAIL on the four helper names and memory-node task kind.

- [ ] **Step 2: Add patrol data and collision recovery.**

```js
fogPatrols: [
  { id: "fog_patrol_left", path: [{ x: 336, y: 334 }, { x: 520, y: 262 }], radius: 30 },
  { id: "fog_patrol_right", path: [{ x: 618, y: 346 }, { x: 796, y: 210 }], radius: 30 },
  { id: "fog_patrol_far", path: [{ x: 720, y: 126 }, { x: 874, y: 260 }], radius: 28, minDifficulty: "hard" },
];
```

`prepareWetlandFogPatrols()` copies visible entries as `{ x, y, segment: 0, direction: 1, radius, hitCooldown: 0 }`. `updateWetlandFogPatrols(dt)` moves between path points and calls `applyWetlandWrongAction("被迷雾挡住了，回到最近的瞭望台。")` at most once per second when player distance is less than patrol radius plus 20. Use three correctly completed lookouts as checkpoints.

- [ ] **Step 3: Add a deterministic memory route.**

Add five `wetland_memory_node` tasks with `routeToken` values `water`, `leaf`, `bird`, `reed`, `moon`. Build the route from the corresponding prefix according to `routeLength`; set `routeVisibleUntil = performance.now() + 4200` and `hintViews` from difficulty.

```js
function interactWetlandMemoryNode(task) {
  const expected = state.wetlandQuest.memoryRoute[state.wetlandQuest.routeIndex];
  if (task.routeToken !== expected) {
    state.wetlandQuest.routeIndex = 0;
    applyWetlandWrongAction("芦苇把你带回了岔路口。", state.wetlandQuest.memoryCheckpoint);
    return true;
  }
  state.wetlandQuest.routeIndex += 1;
  return true;
}
```

Candidate nodes are inputs, not required tasks. Only route completion resolves the one main objective, preventing inflated task counts.

- [ ] **Step 4: Draw soft-edged purple-gray patrols. During the hint window draw route order labels; after expiry draw only a subtle glow. Use Canvas primitives; do not add images.**

- [ ] **Step 5: Run `node --check game.js && node --test tests/wetland-park-mechanics.test.mjs tests/wetland-park-quest.test.mjs && git diff --check`; expect PASS; commit `feat: add Wetland patrol and memory challenges`.**

## Task 3: Add moving floating logs and recovery points

**Files:**

- Modify: `game.js: wetland_drift_crossing data, runtime update, player collision, drawing`
- Modify: `tests/wetland-park-mechanics.test.mjs`, `tests/wetland-park-runtime.test.mjs`

**Interfaces:**

- Consumes: `logSpeed`, `applyWetlandWrongAction()`, player coordinates, guarded `floating_log.png` loader.
- Produces: `prepareWetlandPlatforms()`, `updateWetlandPlatforms(dt)`, `resolveWetlandPlatformRide(dt)`.

- [ ] **Step 1: Add failing assertions and run them.**

```js
assert.match(game, /function prepareWetlandPlatforms\(\)/);
assert.match(game, /function updateWetlandPlatforms\(dt\)/);
assert.match(game, /function resolveWetlandPlatformRide\(dt\)/);
assert.match(game, /wetlandCrossingCheckpoint/);
```

Run: `node --test tests/wetland-park-mechanics.test.mjs tests/wetland-park-runtime.test.mjs`

Expected: FAIL on the three platform helpers and checkpoint marker.

- [ ] **Step 2: Declare three lanes.**

```js
wetlandPlatforms: [
  { id: "log_a", y: 358, minX: 272, maxX: 466, width: 82, checkpoint: { x: 250, y: 386 } },
  { id: "log_b", y: 302, minX: 440, maxX: 650, width: 82, checkpoint: { x: 470, y: 330 } },
  { id: "log_c", y: 244, minX: 626, maxX: 824, width: 82, checkpoint: { x: 674, y: 272 } },
];
```

Prepared state includes `x`, `direction`, `submergedUntil`, `lastSafeX`. Reverse at the lane end. A log only submerges after it reaches an endpoint and resurfaces before its next required crossing.

- [ ] **Step 3: Implement riding and water recovery.**

Move the player by platform delta while standing in its width and within 24 pixels of its top. Inside water without an active platform applies one failure and sets a 700 ms recovery cooldown.

```js
if (inWater && !standingPlatform && performance.now() >= state.wetlandQuest.waterRecoveryUntil) {
  state.wetlandQuest.waterRecoveryUntil = performance.now() + 700;
  applyWetlandWrongAction("浮木下沉了，回到上一段安全岸边。", state.wetlandQuest.wetlandCrossingCheckpoint);
}
```

- [ ] **Step 4: Require the matching lane checkpoint before each lamp. An early lamp press says `先通过前面的浮木，才能点亮这盏灯。` without penalty. Draw image art when loaded; otherwise use a brown rounded log and blue wake. Submerged logs are alpha `0.32` and not standable.**

- [ ] **Step 5: Run `node --check game.js && node --test tests/wetland-park-mechanics.test.mjs tests/wetland-park-runtime.test.mjs && git diff --check`; expect PASS; commit `feat: add Wetland floating log crossing`.**

## Task 4: Add the mirror beam puzzle

**Files:**

- Modify: `game.js: wetland_ruin_mirrors data, interaction, drawing`
- Modify: `tests/wetland-park-mechanics.test.mjs`, `tests/wetland-park-quest.test.mjs`

**Interfaces:**

- Consumes: `mirrorCount`, `applyWetlandWrongAction()`, existing mirror art.
- Produces: `prepareWetlandMirrors()`, `rotateWetlandMirror(task)`, `wetlandBeamPath()`, `drawWetlandBeamPath()`.

- [ ] **Step 1: Add failing assertions and run them.**

```js
assert.match(game, /function prepareWetlandMirrors\(\)/);
assert.match(game, /function rotateWetlandMirror\(task\)/);
assert.match(game, /function wetlandBeamPath\(\)/);
assert.match(game, /function drawWetlandBeamPath\(\)/);
assert.match(game, /mirrorMistHits/);
```

Run: `node --test tests/wetland-park-mechanics.test.mjs tests/wetland-park-quest.test.mjs`

Expected: FAIL because the four mirror helpers are absent.

- [ ] **Step 2: Add answer data and rotation behavior.**

```js
wetland_ruin_mirrors: {
  mirrors: ["wetland_mirror_one", "wetland_mirror_two", "wetland_mirror_three", "wetland_mirror_four"],
  answer: [2, 0, 1, 2],
}
```

Create three mirror tasks plus a fourth `minDifficulty: "hard"`. Start active angles at zero. Each E press rotates one angle modulo three. `wetlandBeamPath()` returns `{ connectedCount, hitsMist }`; after three consecutive mist hits reset angles, clear the hit count, and call `applyWetlandWrongAction("光束照到了迷雾晶石，镜面需要重新校准。")`. A safe adjustment clears the hit count.

- [ ] **Step 3: Draw gold connected beam segments, blue-gray pending segments, and left/straight/right glyphs under each active mirror regardless of formal image load. Complete the gate only when the active answer prefix matches.**

- [ ] **Step 4: Run `node --check game.js && node --test tests/wetland-park-mechanics.test.mjs tests/wetland-park-quest.test.mjs && git diff --check`; expect PASS; commit `feat: add Wetland mirror beam puzzle`.**

## Task 5: Add the Fog Crocodile purification encounter

**Files:**

- Modify: `game.js: wetland_fog_crocodile data, update, interaction, drawing`
- Modify: `tests/wetland-park-mechanics.test.mjs`, `tests/wetland-park-runtime.test.mjs`

**Interfaces:**

- Consumes: `bossSpeed`, `bossWindow`, failure helper, E input, and `wetland_boss_wisp` tasks.
- Produces: `prepareWetlandBoss()`, `updateWetlandBoss(dt)`, `collectWetlandBossWisp(task)`, `startWetlandPurification()`, `drawWetlandBossEffects()`.

- [ ] **Step 1: Add failing assertions and run them.**

```js
assert.match(game, /function prepareWetlandBoss\(\)/);
assert.match(game, /function updateWetlandBoss\(dt\)/);
assert.match(game, /function collectWetlandBossWisp\(task\)/);
assert.match(game, /function startWetlandPurification\(\)/);
assert.match(game, /phase: "avoid"/);
assert.match(game, /phase: "collect"/);
assert.match(game, /phase: "purify"/);
```

Run: `node --test tests/wetland-park-mechanics.test.mjs tests/wetland-park-runtime.test.mjs`

Expected: FAIL with missing Boss helpers and phase values.

- [ ] **Step 2: Initialize a self-contained Boss state.**

```js
state.wetlandQuest.boss = {
  phase: "avoid", waveAngle: 0, nextWaveAt: performance.now() + 1400,
  safeGapAngle: 0, carriedWisps: 0, requiredWisps: 3,
  purificationUntil: 0, holdStartedAt: 0, checkpoint: { x: 180, y: 392 },
};
```

Treat the previous crystal as a chapter-progression ability in this state, not a normal cross-level inventory item, so direct test URLs cannot soft-lock.

- [ ] **Step 3: Implement avoid and collect.**

Spawn one expanding mist ring with a visible safe gap. Collisions outside it call the standard failure helper. After three avoided rings switch to `collect`, activate three wisps, and let each collection increase `carriedWisps`. A collect-phase hit reactivates only the last carried wisp.

- [ ] **Step 4: Implement held-E purification.**

At three wisps set phase `purify` and open `bossWindow` seconds. Near the core, continuous held E needs 1.8 seconds on Easy/Normal, 2.2 on Hard, 2.6 on Crazy. Window expiry returns to collect with one retained wisp and copy `巨鳄又被雾气惊醒了，保留一束光再试一次。`; success completes `wetland_fog_core` by the existing reward path.

- [ ] **Step 5: Draw rings with gaps, orbiting wisps, and a circular hold meter. Never use health bars, damage text, weapons, or attack language. Preserve formal core art and Canvas fallback.**

- [ ] **Step 6: Run `node --check game.js && node --test tests/wetland-park-mechanics.test.mjs tests/wetland-park-runtime.test.mjs && git diff --check`; expect PASS; commit `feat: add Fog Crocodile purification encounter`.**

## Task 6: Full regression and browser/mobile QA

**Files:**

- Modify: `game.js` and Wetland test files only for defects found in this task.
- Test: all Wetland tests and full suite.

**Interfaces:**

- Consumes: every helper above and existing HUD, dialogue, quiz, and controls.
- Produces: five playable levels with no automatic completion and a recoverable error path for each mechanic.

- [ ] **Step 1: Add final assertions.**

```js
assert.match(game, /按 E 重新查看路线/);
assert.match(game, /先通过前面的浮木，才能点亮这盏灯。/);
assert.match(game, /光束照到了迷雾晶石/);
assert.match(game, /巨鳄又被雾气惊醒了/);
assert.ok(!/isMistSwampLevel\(\).*wetland/.test(game));
```

- [ ] **Step 2: Run `node --check game.js && git diff --check && node --test tests/wetland-park-levels.test.mjs tests/wetland-park-progression.test.mjs tests/wetland-park-quiz-bank.test.mjs tests/wetland-park-quest.test.mjs tests/wetland-park-runtime.test.mjs tests/wetland-park-mechanics.test.mjs && node --test tests/*.test.mjs`; expect all PASS.**

- [ ] **Step 3: Browser smoke test the five fresh URLs.**

```text
http://127.0.0.1:5177/?level=34&play=1&review=dynamic-fog
http://127.0.0.1:5177/?level=35&play=1&review=memory-maze
http://127.0.0.1:5177/?level=36&play=1&review=floating-logs
http://127.0.0.1:5177/?level=37&play=1&review=mirror-beams
http://127.0.0.1:5177/?level=38&play=1&review=fog-crocodile
```

Verify canvas load, NPC quest start, a correct advance, an incorrect penalty without soft lock, a reachable quiz, and on narrow mobile viewports visible direction/interaction controls with no permanently blocking panel.

- [ ] **Step 4: Run `git status --short && git log --oneline --decorate -8`; expect no untracked generated files, only Wetland logic/tests, and one commit per feature slice. Do not push or merge unless the user explicitly asks.**
