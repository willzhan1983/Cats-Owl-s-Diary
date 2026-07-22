# Mist Swamp Quest Guidance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an NPC-led accept, guide, return, reward, and settlement loop to all five Mist Swamp levels while preserving every existing mechanic and every non-Mist-Swamp flow.

**Architecture:** Store immutable quest copy on each Mist Swamp level and one small mutable `state.mistQuest` object at runtime. Reuse each level's existing main NPC task as the conversation anchor, derive objective progress from existing tasks and collectibles, and add Mist-Swamp-only guards around interaction and settlement. Reuse the existing dialogue panel and score panel; add only one small quest HUD card plus Canvas markers and guidance dots.

**Tech Stack:** Vanilla JavaScript, Canvas 2D, HTML/CSS, Node.js `node:test`, VM-based runtime tests, local browser smoke tests.

## Global Constraints

- All new runtime behavior must be guarded by `levels[state.levelIndex]?.world === "mist_swamp"`.
- Cover exactly `迷雾沼泽入口`, `萤火虫小径`, `沉睡木桥`, `迷雾核心`, and `沼泽泥浆怪`.
- Reuse the current dialogue panel, NPC art, `E` interaction, task kinds, rewards, difficulty settings, and score settlement panel.
- Do not change Day 1-7, Moonlight Lake, Apple Valley, Forest Road, existing boss branches, shared quiz behavior, or world-map structure.
- Do not add a general quest journal, a new gameplay task kind, or a second dialogue system.
- Preserve `fireflyLantern` as the Level 4 reward and `mistGuardianBadge` as the Level 5 reward; both must be granted once.
- Preserve all Easy/Normal/Hard/Crazy mechanics, including timed fog, randomized bridge lamps, mushroom requirements, bubble counts, and lantern charge timing.
- Collectibles may be picked up before quest acceptance; task interactions and automatic task progress may not advance while the quest is locked.

## File map

- `game.js`: quest configuration, runtime state, progress derivation, dialogue modes, task locking, turn-in, settlement gating, HUD rendering, Canvas markers, and guidance trail.
- `index.html`: Mist Swamp quest card markup and refreshed `game.js` cache key.
- `style.css`: desktop and mobile quest-card layout.
- `tests/mist-swamp-runtime.test.mjs`: functional quest state, task locking, rewards, turn-in, difficulty, and settlement coverage.
- `tests/mist-swamp-base.test.mjs`: static DOM, cache-key, and Mist-Swamp-only guard assertions.
- Existing `world-map.js`, `mist-swamp-map-entry.js`, and `mist-swamp-quiz-bank.js` remain behaviorally unchanged and are syntax-checked only.

---

### Task 1: Add Mist Swamp quest configuration and locked runtime state

**Files:**
- Modify: `game.js:1331-1450`
- Modify: `game.js:1494-1520`
- Modify: `game.js:1640-1788`
- Modify: `game.js:2603-2680`
- Modify: `game.js:2901-3005`
- Modify: `game.js:3431-3568`
- Test: `tests/mist-swamp-runtime.test.mjs:90-210`

**Interfaces:**
- Consumes: `levels`, `state.tasksList`, `isMistSwampLevel()`, `interactMistSwampTask(task)`, `updateMistSwampMechanisms(dt)`.
- Produces: `createMistQuestState(level, tasks)`, `mistQuestNpcTask()`, `isMistQuestNpc(task)`, `mistQuestAllowsProgress()`, `acceptMistQuest()`.

- [ ] **Step 1: Write failing configuration and locking tests**

Add after the five-level assertions in `tests/mist-swamp-runtime.test.mjs`:

```js
const expectedQuestNpcs = {
  "迷雾沼泽入口": "ruru",
  "萤火虫小径": "fireflyGuide",
  "沉睡木桥": "littleFrog",
  "迷雾核心": "mistSpirit",
  "沼泽泥浆怪": "mudMonster",
};

for (const level of mistLevels) {
  assert.equal(level.mistQuest.npcAnimal, expectedQuestNpcs[level.name], `${level.name} quest NPC`);
  assert.ok(level.mistQuest.introLines.length >= 2, `${level.name} should explain the quest`);
  assert.ok(level.mistQuest.completeLines.length >= 1, `${level.name} should have completion dialogue`);
}

const lockedQuestRuntime = vm.runInContext(`
  (() => {
    selectedDifficulty = "normal";
    resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "迷雾沼泽入口"));
    const lamp = state.tasksList.find((task) => task.kind === "mist_lamp");
    const collectible = state.collectibles.find((entry) => entry.type === "fireflyCore");
    collectible.taken = true;
    state.inventory.push("fireflyCore");
    interactMistSwampTask(lamp);
    const beforeAccept = {
      status: state.mistQuest.status,
      npc: mistQuestNpcTask().animal,
      lampDone: lamp.done,
      inventory: [...state.inventory],
    };
    acceptMistQuest();
    interactMistSwampTask(lamp);
    return {
      beforeAccept,
      afterAccept: {
        status: state.mistQuest.status,
        lampDone: lamp.done,
        collectibleStillTaken: collectible.taken,
      },
    };
  })();
`, runtime);

assert.deepEqual(plain(lockedQuestRuntime), {
  beforeAccept: {
    status: "locked",
    npc: "ruru",
    lampDone: false,
    inventory: ["fireflyCore"],
  },
  afterAccept: {
    status: "active",
    lampDone: true,
    collectibleStillTaken: true,
  },
});

const nonMistQuestState = vm.runInContext(`
  resetGame(levels.findIndex((level) => level.world !== "mist_swamp"));
  state.mistQuest;
`, runtime);
assert.equal(nonMistQuestState, null);

const lockedAutomaticProgress = vm.runInContext(`
  (() => {
    resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "萤火虫小径"));
    const firstPoint = state.fireflyTrail.find((point) => !point.decoy);
    state.player.x = firstPoint.x;
    state.player.y = firstPoint.y;
    updateMistSwampMechanisms(0.016);
    const beforeAccept = state.fireflyTrailIndex;
    acceptMistQuest();
    updateMistSwampMechanisms(0.016);
    return { beforeAccept, afterAccept: state.fireflyTrailIndex };
  })();
`, runtime);
assert.deepEqual(plain(lockedAutomaticProgress), { beforeAccept: 0, afterAccept: 1 });
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: FAIL because Mist Swamp levels do not have `mistQuest`, and `acceptMistQuest()` is undefined.

- [ ] **Step 3: Add exact quest copy to the five level objects**

Add a `mistQuest` object to each level next to `message`. Use these exact values:

```js
mistQuest: {
  npcAnimal: "ruru",
  introLines: ["旧路被迷雾挡住啦。", "请收集萤火虫灯芯，点亮两盏雾灯，再回来告诉我。"],
  activeHint: "收集萤火虫灯芯，点亮入口的两盏雾灯。",
  readyHint: "入口的雾已经散开，回去告诉 Ruru。",
  completeLines: ["太棒啦，前面的旧路重新亮起来了！"],
  objectiveLabels: ["收集萤火虫灯芯", "点亮雾灯", "雾与光答题"],
},
```

```js
mistQuest: {
  npcAnimal: "fireflyGuide",
  introLines: ["跟紧温暖的金色光点。", "收集四个发光孢子，并找到木桥钥匙。"],
  activeHint: "跟随真正的萤火虫路线，找齐发光孢子和木桥钥匙。",
  readyHint: "小径已经走通，回到萤火虫向导身边。",
  completeLines: ["你已经学会辨认真正的萤火虫路线啦！"],
  objectiveLabels: ["跟随真正光点", "收集发光孢子", "找到木桥钥匙"],
},
```

```js
mistQuest: {
  npcAnimal: "littleFrog",
  introLines: ["木桥坏掉啦，我不敢过去。", "请找齐木桥板、修好桥，再带我去出口。"],
  activeHint: "找木桥板、修好木桥，再护送小青蛙到出口。",
  readyHint: "小青蛙已经安全到达，和它说说话吧。",
  completeLines: ["谢谢你修好木桥，还安全地带我过来了！"],
  objectiveLabels: ["收集木桥板", "修复木桥", "蘑菇灯顺序", "护送小青蛙"],
},
```

```js
mistQuest: {
  npcAnimal: "mistSpirit",
  introLines: ["迷雾核心被黑雾泡泡围住了。", "请收集光之孢子，点亮大雾灯，让这里重新发光。"],
  activeHint: "点亮大雾灯，依次清除黑雾泡泡，再安抚迷雾精灵。",
  readyHint: "迷雾精灵恢复清醒了，回去和它说话。",
  completeLines: ["谢谢你，沼泽重新亮起来了！"],
  objectiveLabels: ["收集光之孢子", "点亮大雾灯", "清除黑雾泡泡", "安抚迷雾精灵"],
},
```

```js
mistQuest: {
  npcAnimal: "mudMonster",
  introLines: ["沼泽守护者被黑雾和泥浆困住了。", "先点亮三盏大雾灯，我们一起帮助它恢复清醒。"],
  activeHint: "按当前阶段完成点灯、清泡泡和灯笼充能。",
  readyHint: "守护者恢复平静了，去听听它想说什么。",
  completeLines: ["谢谢你！我会继续守护这片沼泽。"],
  objectiveLabels: ["同时点亮大雾灯", "清除泥浆泡泡", "灯笼充能与答题"],
},
```

- [ ] **Step 4: Add the minimal runtime state helpers**

Add after `isMistSwampMistCoreLevel()`:

```js
function createMistQuestState(level, tasks) {
  if (level?.world !== "mist_swamp" || !level.mistQuest) return null;
  const npcTask = tasks.find((task) => task.animal === level.mistQuest.npcAnimal);
  return {
    status: "locked",
    npcTaskId: npcTask?.id || null,
    readyAt: 0,
    lastProgressAt: performance.now(),
    progressSignature: "",
    pendingReward: null,
  };
}

function mistQuestNpcTask() {
  if (!isMistSwampLevel() || !state.mistQuest) return null;
  return state.tasksList.find((task) => task.id === state.mistQuest.npcTaskId) || null;
}

function isMistQuestNpc(task) {
  return !!task && !!state?.mistQuest && task.id === state.mistQuest.npcTaskId;
}

function mistQuestAllowsProgress() {
  return !state?.mistQuest || state.mistQuest.status === "active";
}

function acceptMistQuest() {
  if (!state?.mistQuest || state.mistQuest.status !== "locked") return false;
  state.mistQuest.status = "active";
  state.mistQuest.lastProgressAt = performance.now();
  messageEl.textContent = levels[state.levelIndex].mistQuest.activeHint;
  updateHud();
  return true;
}
```

Initialize `mistQuest: null` inside the `state` object in `resetGame()`, then immediately after the object is created add:

```js
state.mistQuest = createMistQuestState(level, state.tasksList);
```

- [ ] **Step 5: Guard Mist Swamp progress while locked**

In `updateMistSwampMechanisms(dt)`, keep the fog-opacity update, then stop automatic quest mechanics while locked:

```js
if (!mistQuestAllowsProgress()) return;
```

At the top of `interactMistSwampTask(task)`, after the null check, add:

```js
if (!mistQuestAllowsProgress()) {
  messageEl.textContent = `先去找${mistQuestNpcTask()?.name || "任务伙伴"}接任务。`;
  return true;
}
```

In `checkTasks(dt)`, after the nearby-task selection but before `if (task.done) continue`, add:

```js
if (near && isMistQuestNpc(task)) {
  const marker = state.mistQuest.status === "locked" ? "接任务" : state.mistQuest.status === "ready" ? "交任务" : "查看任务";
  messageEl.textContent = `按 E 和${task.name}对话（${marker}）。`;
  continue;
}
if (near && !mistQuestAllowsProgress()) {
  messageEl.textContent = `先去找${mistQuestNpcTask()?.name || "任务伙伴"}接任务。`;
  continue;
}
```

- [ ] **Step 6: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: PASS after adding `acceptMistQuest()` immediately after every existing Mist Swamp `resetGame(...)` in legacy mechanic cases that intentionally exercise task progress.

- [ ] **Step 7: Commit the quest data and locked state**

```bash
git add game.js tests/mist-swamp-runtime.test.mjs
git commit -m "Add Mist Swamp quest acceptance state"
```

---

### Task 2: Reuse dialogue for acceptance and NPC turn-in

**Files:**
- Modify: `game.js:1944-2050`
- Modify: `game.js:2309-2375`
- Modify: `game.js:3024-3053`
- Modify: `game.js:3195-3430`
- Test: `tests/mist-swamp-runtime.test.mjs:560-790`

**Interfaces:**
- Consumes: Task 1 helpers and `level.mistQuest` copy.
- Produces: `mistQuestGameplayComplete()`, `updateMistQuestReadiness()`, `grantTaskReward(task, x, y)`, `turnInMistQuest(task)`, `canSettleCurrentLevel()`.

- [ ] **Step 1: Write failing state-transition, reward, and settlement tests**

Add a fresh runtime block to `tests/mist-swamp-runtime.test.mjs`:

```js
const questTurnInRuntime = loadGameRuntime();
vm.runInContext(mistQuizSource, questTurnInRuntime, { filename: "mist-swamp-quiz-bank.js" });
const questTransitions = vm.runInContext(`
  (() => {
    const result = [];
    for (const levelName of ["迷雾沼泽入口", "萤火虫小径", "沉睡木桥", "迷雾核心", "沼泽泥浆怪"]) {
      selectedDifficulty = "normal";
      resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === levelName));
      scoreSummaryPanel.hidden = true;
      acceptMistQuest();
      const npc = mistQuestNpcTask();
      for (const task of requiredTasksForCurrentLevel()) {
        if (task === npc && task.kind === "delivery") continue;
        task.done = true;
      }
      if (npc.kind === "delivery") state.inventory.push(...npc.need);
      if (levelName === "迷雾沼泽入口") {
        state.tasksList.filter((task) => task.kind === "mist_lamp").forEach((task) => {
          task.lit = true;
          task.litUntil = null;
        });
      }
      updateMistQuestReadiness();
      const ready = state.mistQuest.status;
      const panelBefore = scoreSummaryPanel.hidden;
      turnInMistQuest(npc);
      closeDialogue();
      state.running = true;
      update(0);
      result.push({
        levelName,
        ready,
        settled: state.mistQuest.status,
        levelSettled: state.levelSettled,
        panelBefore,
        panelAfter: scoreSummaryPanel.hidden,
      });
    }
    return result;
  })();
`, questTurnInRuntime);

for (const transition of plain(questTransitions)) {
  assert.equal(transition.ready, "ready", `${transition.levelName} should wait for turn-in`);
  assert.equal(transition.settled, "settled", `${transition.levelName} should turn in`);
  assert.equal(transition.levelSettled, true, `${transition.levelName} should settle normally`);
  assert.equal(transition.panelBefore, true, `${transition.levelName} panel stays closed before turn-in`);
  assert.equal(transition.panelAfter, false, `${transition.levelName} panel opens after turn-in`);
}

const questRewards = vm.runInContext(`
  (() => {
    const result = {};
    for (const [levelName, reward] of [["迷雾核心", "fireflyLantern"], ["沼泽泥浆怪", "mistGuardianBadge"]]) {
      resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === levelName));
      acceptMistQuest();
      const npc = mistQuestNpcTask();
      completeTask(npc, npc.x, npc.y);
      const beforeTurnIn = state.inventory.filter((item) => item === reward).length;
      state.mistQuest.status = "ready";
      turnInMistQuest(npc);
      turnInMistQuest(npc);
      result[levelName] = {
        beforeTurnIn,
        afterTurnIn: state.inventory.filter((item) => item === reward).length,
      };
    }
    return result;
  })();
`, questTurnInRuntime);
assert.deepEqual(plain(questRewards), {
  "迷雾核心": { beforeTurnIn: 0, afterTurnIn: 1 },
  "沼泽泥浆怪": { beforeTurnIn: 0, afterTurnIn: 1 },
});

const dialogueButtons = vm.runInContext(`
  (() => {
    resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "迷雾沼泽入口"));
    const npc = mistQuestNpcTask();
    openDialogue(npc);
    state.activeDialogue.index = state.activeDialogue.lines.length - 1;
    renderDialogue();
    const acceptLabel = dialogueNextBtn.textContent;
    nextDialogueLine();
    state.mistQuest.status = "ready";
    openDialogue(npc);
    renderDialogue();
    return { acceptLabel, giveLabel: dialogueGiveBtn.textContent, giveHidden: dialogueGiveBtn.hidden };
  })();
`, questTurnInRuntime);
assert.deepEqual(plain(dialogueButtons), { acceptLabel: "接受任务", giveLabel: "完成任务", giveHidden: false });

const readyQuestTimeout = vm.runInContext(`
  (() => {
    selectedDifficulty = "crazy";
    resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沉睡木桥"));
    acceptMistQuest();
    requiredTasksForCurrentLevel().forEach((task) => { task.done = true; });
    updateMistQuestReadiness();
    state.time = 0;
    state.running = true;
    scoreSummaryPanel.hidden = true;
    update(0);
    return {
      status: state.mistQuest.status,
      running: state.running,
      levelSettled: state.levelSettled,
      panelHidden: scoreSummaryPanel.hidden,
    };
  })();
`, questTurnInRuntime);
assert.deepEqual(plain(readyQuestTimeout), {
  status: "ready",
  running: true,
  levelSettled: false,
  panelHidden: true,
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: FAIL because readiness, turn-in, and deferred reward helpers do not exist.

- [ ] **Step 3: Add readiness and settlement predicates**

Add near the Task 1 helpers:

```js
function mistQuestGameplayComplete() {
  if (!state?.mistQuest || state.mistQuest.status !== "active") return false;
  const npc = mistQuestNpcTask();
  return requiredTasksForCurrentLevel().every((task) => {
    if (task !== npc || task.kind !== "delivery") return task.done;
    return missingNeeds(task.need).length === 0 && canTalkToMistSwampTask(task);
  });
}

function updateMistQuestReadiness() {
  if (!mistQuestGameplayComplete()) return false;
  state.mistQuest.status = "ready";
  state.mistQuest.readyAt = performance.now();
  messageEl.textContent = levels[state.levelIndex].mistQuest.readyHint;
  updateHud();
  return true;
}

function canSettleCurrentLevel(requiredTasks) {
  if (!requiredTasks.every((task) => task.done)) return false;
  return !state.mistQuest || state.mistQuest.status === "settled";
}
```

In `update(dt)`, call `updateMistQuestReadiness()` after `checkTasks(dt)`. Replace the existing completion condition with:

```js
if (requiredTasks.length > 0 && canSettleCurrentLevel(requiredTasks)) {
```

Do not change the body of the existing settlement branch.

Preserve Crazy timeout behavior while objectives are active, but allow an already-ready quest to be handed in. Replace the timeout failure condition with:

```js
if (difficultySettings().stopOnTimeout && !["ready", "settled"].includes(state.mistQuest?.status)) {
```

Outside Mist Swamp `state.mistQuest` is `null`, so the existing failure behavior is unchanged.

- [ ] **Step 4: Defer quest-NPC rewards until turn-in**

Extract the reward block in `completeTask()` into:

```js
function grantTaskReward(task, x = task.x, y = task.y) {
  if (!task.reward || task.rewardGranted) return false;
  state.inventory.push(task.reward);
  task.rewardGranted = true;
  addFloatingText(x, y - 82, `+ ${itemLabel(task.reward)}`, "#f2ad31");
  return true;
}
```

Replace the old unconditional reward block in `completeTask()` with:

```js
if (task.reward) {
  if (isMistQuestNpc(task) && state.mistQuest.status !== "settled") state.mistQuest.pendingReward = task.reward;
  else grantTaskReward(task, x, y);
}
```

- [ ] **Step 5: Add Mist Swamp dialogue modes and turn-in**

At the start of `taskDialogueMode(task)`, before `task.done`, add:

```js
if (isMistQuestNpc(task)) {
  return {
    locked: "quest_intro",
    active: "quest_active",
    ready: "quest_ready",
    settled: "quest_after",
  }[state.mistQuest.status];
}
```

At the start of `taskDialogueLines(task, mode)`, add:

```js
if (isMistQuestNpc(task)) {
  const quest = levels[state.levelIndex].mistQuest;
  if (mode === "quest_intro") return quest.introLines;
  if (mode === "quest_active") return [quest.activeHint];
  if (mode === "quest_ready") return quest.completeLines;
  if (mode === "quest_after") return ["谢谢你，继续开心探索吧！"];
}
```

In `renderDialogue()`, reset the button labels on every render, then add quest behavior:

```js
dialogueNextBtn.textContent = "下一句";
dialogueGiveBtn.textContent = "交给TA";
const questIntroDone = dialogue.mode === "quest_intro" && !hasNext;
dialogueNextBtn.hidden = !hasNext && !questIntroDone;
if (questIntroDone) dialogueNextBtn.textContent = "接受任务";
const questReady = dialogue.mode === "quest_ready";
dialogueGiveBtn.hidden = !(questReady || ((task.kind === "delivery" || task.kind === "sort_basket") && dialogue.mode === "ready" && !task.done));
if (questReady) dialogueGiveBtn.textContent = "完成任务";
```

In `nextDialogueLine()`, add `const task = dialogue.task;` immediately after the null guard. Then insert this branch before the delivery branch:

```js
} else if (dialogue.mode === "quest_intro") {
  acceptMistQuest();
  state.activeDialogue = {
    taskId: task.id,
    task,
    speaker: task.name,
    lines: [levels[state.levelIndex].mistQuest.activeHint],
    index: 0,
    mode: "quest_active",
  };
  renderDialogue();
```

Define turn-in before `finishDialogueDelivery()`:

```js
function turnInMistQuest(task = mistQuestNpcTask()) {
  if (!isMistQuestNpc(task) || state.mistQuest.status !== "ready") return false;
  if (task.kind === "delivery" && !task.done) {
    if (missingNeeds(task.need).length || !canTalkToMistSwampTask(task)) return false;
    consumeNeeds(task.need);
    completeTask(task, task.x, task.y);
  }
  state.mistQuest.status = "settled";
  grantTaskReward(task, task.x, task.y);
  state.activeDialogue = {
    taskId: task.id,
    task,
    speaker: task.name,
    lines: levels[state.levelIndex].mistQuest.completeLines,
    index: 0,
    mode: "quest_after",
  };
  updateHud();
  renderDialogue();
  return true;
}
```

At the start of `finishDialogueDelivery()` add:

```js
if (dialogue?.mode === "quest_ready") {
  turnInMistQuest(task);
  return;
}
```

In `talkToNearbyTask()`, before `interactMistSwampTask(...)`, open dialogue for quest states while allowing the Level 4 and Level 5 anchor tasks to retain their active mechanical interaction:

```js
const activeQuestMechanic = state.mistQuest?.status === "active" && ["mist_core", "mud_boss"].includes(state.nearbyTask?.kind);
if (isMistQuestNpc(state.nearbyTask) && !activeQuestMechanic) {
  openDialogue(state.nearbyTask);
  return;
}
```

Apply the same `activeQuestMechanic` exception to the quest-NPC hint branch added to `checkTasks(dt)`, so active `mist_core` and `mud_boss` tasks continue to display their existing exact interaction hints.

- [ ] **Step 6: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: PASS with the score panel closed in `ready`, open in `settled`, and both rewards present exactly once.

- [ ] **Step 7: Commit the dialogue and settlement flow**

```bash
git add game.js tests/mist-swamp-runtime.test.mjs
git commit -m "Add Mist Swamp NPC quest turn-in"
```

---

### Task 3: Add the quest card, exact hints, markers, and guidance trail

**Files:**
- Modify: `index.html:68-105`
- Modify: `style.css:322-450`
- Modify: `style.css:810-880`
- Modify: `style.css:1020-1065`
- Modify: `game.js:1-45`
- Modify: `game.js:2288-2303`
- Modify: `game.js:3653-3678`
- Modify: `game.js:4990-5160`
- Test: `tests/mist-swamp-base.test.mjs`
- Test: `tests/mist-swamp-runtime.test.mjs`

**Interfaces:**
- Consumes: `state.mistQuest`, `mistQuestNpcTask()`, existing tasks, collectibles, difficulty, and Task 2 turn-in.
- Produces: `mistQuestObjectiveRows()`, `mistQuestNextHint()`, `mistQuestInteractionHint(task)`, `renderMistQuestHud()`, `canUseMistQuestFallback()`, `turnInMistQuestFallback()`, `drawMistQuestTrail()`, `drawMistQuestMarker(task)`.

- [ ] **Step 1: Write failing DOM and runtime guidance tests**

Add to `tests/mist-swamp-base.test.mjs`:

```js
for (const id of ["mistQuestCard", "mistQuestNpc", "mistQuestStage", "mistQuestObjectives", "mistQuestNext", "mistQuestHelpBtn", "mistQuestFallbackBtn"]) {
  assert.match(index, new RegExp(`id=["']${id}["']`), `${id} should exist`);
}
assert.match(game, /function drawMistQuestMarker\(task\)/);
assert.match(game, /function drawMistQuestTrail\(\)/);
assert.match(game, /if \(!isMistSwampLevel\(\)\) return;/);
```

Add to `tests/mist-swamp-runtime.test.mjs`:

```js
const questGuidance = vm.runInContext(`
  (() => {
    selectedDifficulty = "hard";
    resetGame(levels.findIndex((level) => level.name === "沉睡木桥"));
    const locked = mistQuestNextHint();
    acceptMistQuest();
    const bridge = state.tasksList.find((task) => task.kind === "broken_bridge");
    const activeRows = mistQuestObjectiveRows();
    state.inventory.push(...bridge.need);
    const repairHint = mistQuestInteractionHint(bridge);
    interactMistSwampTask(bridge);
    const afterBridge = mistQuestNextHint();
    const frog = mistQuestNpcTask();
    frog.done = true;
    frog.x = 830;
    frog.y = 210;
    state.tasksList.filter((task) => task.kind === "mushroom_lamp").forEach((task) => { task.done = true; });
    updateMistQuestReadiness();
    state.mistQuest.readyAt = performance.now() - 10001;
    scoreSummaryPanel.hidden = true;
    renderMistQuestHud();
    const readyHint = mistQuestNextHint();
    const fallbackVisible = !mistQuestFallbackBtn.hidden;
    const fallbackCompleted = turnInMistQuestFallback();
    return {
      locked,
      activeLabels: activeRows.map((row) => row.label),
      repairHint,
      afterBridge,
      ready: readyHint,
      fallbackVisible,
      fallbackCompleted,
      fallbackStatus: state.mistQuest.status,
      frogPosition: { x: frog.x, y: frog.y },
    };
  })();
`, runtime);
assert.equal(questGuidance.locked, "去找小青蛙，按 E 接受任务。");
assert.deepEqual(plain(questGuidance.activeLabels), ["收集木桥板", "修复木桥", "蘑菇灯顺序", "护送小青蛙"]);
assert.equal(questGuidance.repairHint, "按 E 修复木桥。");
assert.match(questGuidance.afterBridge, /蘑菇灯|小青蛙/);
assert.match(questGuidance.ready, /小青蛙已经安全到达.*按 E 完成任务/);
assert.equal(questGuidance.fallbackVisible, true);
assert.equal(questGuidance.fallbackCompleted, true);
assert.equal(questGuidance.fallbackStatus, "settled");
assert.deepEqual(plain(questGuidance.frogPosition), { x: 830, y: 210 });
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test tests/mist-swamp-base.test.mjs tests/mist-swamp-runtime.test.mjs
```

Expected: FAIL because the quest-card DOM and guidance/render helpers do not exist.

- [ ] **Step 3: Add the Mist Swamp-only quest card markup**

Inside `.canvas-wrap`, after `#message` and before `#quizPanel`, add:

```html
<aside id="mistQuestCard" class="mist-quest-card" aria-live="polite" hidden>
  <div class="mist-quest-heading">
    <strong id="mistQuestNpc"></strong>
    <span id="mistQuestStage"></span>
  </div>
  <div id="mistQuestObjectives" class="mist-quest-objectives"></div>
  <p id="mistQuestNext"></p>
  <div class="mist-quest-actions">
    <button id="mistQuestHelpBtn" type="button">查看下一步</button>
    <button id="mistQuestFallbackBtn" type="button" hidden>直接完成任务</button>
  </div>
</aside>
```

Add matching DOM constants beside the existing dialogue constants in `game.js`.

- [ ] **Step 4: Derive objective rows from existing state**

Add near the quest helpers:

```js
function collectedMistItemCount(type) {
  return state.collectibles.filter((entry) => entry.type === type && entry.taken).length;
}

function completedMistTaskCount(kind) {
  return state.tasksList.filter((task) => task.kind === kind && task.done).length;
}

function mistQuestObjectiveRows() {
  if (!state?.mistQuest) return [];
  const level = levels[state.levelIndex];
  if (level.name === "迷雾沼泽入口") return [
    { label: "收集萤火虫灯芯", current: collectedMistItemCount("fireflyCore"), target: 3 },
    { label: "点亮雾灯", current: completedMistTaskCount("mist_lamp"), target: 2 },
    { label: "雾与光答题", current: state.tasksList.some((task) => task.mistSwampShared && task.done) ? 1 : 0, target: 1 },
  ];
  if (level.name === "萤火虫小径") return [
    { label: "跟随真正光点", current: state.fireflyTrailIndex, target: state.fireflyTrail.filter((point) => !point.decoy).length },
    { label: "收集发光孢子", current: collectedMistItemCount("glowSpore"), target: 4 },
    { label: "找到木桥钥匙", current: collectedMistItemCount("bridgeKey"), target: 1 },
  ];
  if (level.name === "沉睡木桥") {
    const bridge = state.tasksList.find((task) => task.kind === "broken_bridge");
    const rows = [
      { label: "收集木桥板", current: collectedMistItemCount("bridgePlank"), target: bridge.need.length },
      { label: "修复木桥", current: bridge.done ? 1 : 0, target: 1 },
    ];
    if (["hard", "crazy"].includes(selectedDifficulty)) rows.push({
      label: "蘑菇灯顺序",
      current: completedMistTaskCount("mushroom_lamp"),
      target: state.mushroomSequence.length,
    });
    rows.push({ label: "护送小青蛙", current: mistQuestNpcTask().done ? 1 : 0, target: 1 });
    return rows;
  }
  if (level.name === "迷雾核心") return [
    { label: "收集光之孢子", current: collectedMistItemCount("lightSpore"), target: 3 },
    { label: "点亮大雾灯", current: completedMistTaskCount("mist_lamp"), target: 3 },
    { label: "清除黑雾泡泡", current: completedMistTaskCount("mist_bubble"), target: 3 },
    { label: "安抚迷雾精灵", current: mistQuestNpcTask().done ? 1 : 0, target: 1 },
  ];
  const boss = mistQuestNpcTask();
  if (boss.phase === 1) return [{ label: "同时点亮大雾灯", current: state.tasksList.filter((task) => task.kind === "mist_lamp" && isMistLampActive(task)).length, target: 3 }];
  if (boss.phase === 2) return [{ label: "清除泥浆泡泡", current: state.mudBubbles.filter((bubble) => bubble.done).length, target: state.mudBubbles.length }];
  return [{ label: "灯笼充能与答题", current: boss.done ? 1 : Math.min(state.lanternCharge, state.lanternChargeRequired), target: boss.done ? 1 : state.lanternChargeRequired }];
}
```

- [ ] **Step 5: Add exact next hints, idle detection, and HUD rendering**

Add:

```js
function mistQuestNextHint() {
  if (!state?.mistQuest) return "";
  const npc = mistQuestNpcTask();
  if (state.mistQuest.status === "locked") return `去找${npc.name}，按 E 接受任务。`;
  if (state.mistQuest.status === "ready") return `${levels[state.levelIndex].mistQuest.readyHint} 按 E 完成任务。`;
  if (state.mistQuest.status === "settled") return "任务已经完成。";
  const row = mistQuestObjectiveRows().find((entry) => entry.current < entry.target);
  return row ? `下一步：${row.label}（${Math.floor(row.current)}/${row.target}）` : levels[state.levelIndex].mistQuest.readyHint;
}

function mistQuestInteractionHint(task) {
  if (task.kind === "mist_lamp") return `按 E 点亮${task.name}。`;
  if (task.kind === "mushroom_lamp") return `按 E 点亮${task.name}。`;
  if (task.kind === "broken_bridge") return missingNeeds(task.need).length ? `还需要 ${missingNeeds(task.need).length} 块木桥板。` : "按 E 修复木桥。";
  if (task.kind === "mist_bubble") return "按 E 清除带金色光环的黑雾泡泡。";
  if (task.kind === "mist_core") return "按 E 安抚迷雾精灵。";
  if (task.kind === "mud_boss") return task.phase === 3 ? "保持靠近泥浆核心，充满灯笼后按 E 答题。" : task.speech;
  if (task.kind === "firefly_trail") return "沿着温暖的金色光点前进。";
  return taskNearHint(task);
}

function canUseMistQuestFallback() {
  return state?.mistQuest?.status === "ready" && performance.now() - state.mistQuest.readyAt >= 10000;
}

function turnInMistQuestFallback() {
  return canUseMistQuestFallback() ? turnInMistQuest() : false;
}

function renderMistQuestHud() {
  if (!mistQuestCard) return;
  if (!state?.mistQuest || state.mistQuest.status === "settled" || state.activeQuiz || state.activeDialogue || !scoreSummaryPanel.hidden) {
    mistQuestCard.hidden = true;
    return;
  }
  mistQuestCard.hidden = false;
  mistQuestNpc.textContent = mistQuestNpcTask()?.name || "迷雾沼泽任务";
  mistQuestStage.textContent = { locked: "等待接取", active: "进行中", ready: "可以交付" }[state.mistQuest.status];
  mistQuestObjectives.replaceChildren();
  for (const row of mistQuestObjectiveRows().slice(0, 3)) {
    const line = document.createElement("div");
    line.textContent = `${row.current >= row.target ? "✓" : "○"} ${row.label} ${Math.floor(row.current)}/${row.target}`;
    mistQuestObjectives.appendChild(line);
  }
  mistQuestNext.textContent = mistQuestNextHint();
  mistQuestHelpBtn.hidden = selectedDifficulty !== "easy";
  mistQuestFallbackBtn.hidden = !canUseMistQuestFallback();
}

function updateMistQuestGuidance() {
  if (!state?.mistQuest || state.mistQuest.status !== "active") return;
  const signature = JSON.stringify(mistQuestObjectiveRows().map(({ current, target }) => [current, target]));
  if (signature !== state.mistQuest.progressSignature) {
    state.mistQuest.progressSignature = signature;
    state.mistQuest.lastProgressAt = performance.now();
  } else if (performance.now() - state.mistQuest.lastProgressAt >= 8000) {
    messageEl.textContent = mistQuestNextHint();
    state.mistQuest.lastProgressAt = performance.now();
  }
}
```

Call `renderMistQuestHud()` from `updateHud()` and `updateMistQuestGuidance()` after `checkTasks(dt)`.

Also call `renderMistQuestHud()` after state changes in `openDialogue()`, `closeDialogue()`, `openQuiz()`, `closeQuiz()`, and after `showScoreSummaryPanel()` makes the score panel visible. This enforces the card's no-overlap rule while a modal is open.

Wire the buttons with:

```js
mistQuestHelpBtn?.addEventListener("click", () => { messageEl.textContent = mistQuestNextHint(); });
mistQuestFallbackBtn?.addEventListener("click", turnInMistQuestFallback);
```

In the existing Mist Swamp branch in `checkTasks(dt)`, replace generic `按 E 互动` copy with:

```js
messageEl.textContent = mistQuestInteractionHint(task);
```

- [ ] **Step 6: Draw quest markers and guidance dots**

Add:

```js
function drawMistQuestMarker(task) {
  if (!isMistQuestNpc(task) || !state.mistQuest) return;
  const marker = { locked: "!", active: "…", ready: "?", settled: "✓" }[state.mistQuest.status];
  const color = { locked: "#ffd94a", active: "#d7dde3", ready: "#ffbd3d", settled: "#83b83d" }[state.mistQuest.status];
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,247,223,0.94)";
  circle(0, -86, 15);
  ctx.fillStyle = color;
  ctx.font = "900 20px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  ctx.fillText(marker, 0, -79);
  ctx.restore();
}

function drawMistQuestTrail() {
  if (!isMistSwampLevel() || !state.mistQuest || !["locked", "ready"].includes(state.mistQuest.status)) return;
  const npc = mistQuestNpcTask();
  if (!npc) return;
  const dx = npc.x - state.player.x;
  const dy = npc.y - state.player.y;
  const distanceToNpc = Math.hypot(dx, dy);
  const steps = Math.min(8, Math.max(2, Math.floor(distanceToNpc / 70)));
  ctx.save();
  for (let index = 1; index <= steps; index += 1) {
    const ratio = index / (steps + 1);
    ctx.globalAlpha = 0.35 + ratio * 0.45;
    ctx.fillStyle = "#ffe26a";
    circle(state.player.x + dx * ratio, state.player.y + dy * ratio, 3 + ratio * 2);
  }
  ctx.restore();
}
```

Call `drawMistQuestMarker(task)` in `drawTasks()` immediately after the task animal is drawn. Call `drawMistQuestTrail()` in `draw()` after fog and before the player, so it remains visible without covering UI.

- [ ] **Step 7: Style desktop and mobile layouts**

Add desktop rules:

```css
.mist-quest-card {
  position: absolute;
  z-index: 6;
  top: 14px;
  left: 14px;
  width: min(300px, calc(100% - 28px));
  padding: 12px;
  border: 2px solid rgba(255, 217, 74, 0.62);
  border-radius: 10px;
  background: rgba(34, 66, 62, 0.9);
  color: #fff7df;
  box-shadow: 0 10px 24px rgba(20, 47, 45, 0.24);
}

.mist-quest-card[hidden] { display: none; }
.mist-quest-heading { display: flex; justify-content: space-between; gap: 8px; }
.mist-quest-heading span { color: #ffe26a; font-weight: 900; }
.mist-quest-objectives { display: grid; gap: 3px; margin-top: 8px; font-size: 13px; }
.mist-quest-card p { margin: 8px 0; color: #fff1a8; font-weight: 800; }
.mist-quest-actions { display: flex; gap: 8px; }
.mist-quest-actions button { min-height: 34px; padding: 6px 10px; border-radius: 8px; font-weight: 900; }
```

Inside the existing mobile media query add:

```css
.mist-quest-card {
  top: 8px;
  left: 8px;
  width: min(270px, 72vw);
  max-height: 42dvh;
  overflow: auto;
  padding: 9px;
  font-size: 12px;
}
```

- [ ] **Step 8: Run focused tests and commit**

Run:

```bash
node --test tests/mist-swamp-base.test.mjs tests/mist-swamp-runtime.test.mjs
```

Expected: PASS, including locked/active/ready HUD text, fallback visibility, frog exit position, markers, and guarded guidance.

Commit:

```bash
git add game.js index.html style.css tests/mist-swamp-base.test.mjs tests/mist-swamp-runtime.test.mjs
git commit -m "Add Mist Swamp quest guidance UI"
```

---

### Task 4: Preserve full gameplay completion and refresh the browser build

**Files:**
- Modify: `index.html:171`
- Modify: `tests/mist-swamp-base.test.mjs`
- Modify: `tests/mist-swamp-runtime.test.mjs:560-790`
- Test: all `tests/*.test.mjs`

**Interfaces:**
- Consumes: all Task 1-3 quest APIs.
- Produces: complete five-level, four-difficulty regression coverage and browser cache key `mist-swamp-quest-guidance-20260722`.

- [ ] **Step 1: Update existing functional completions to use the real quest flow**

In every existing full-level runtime scenario, insert this immediately after Mist Swamp `resetGame(...)`:

```js
acceptMistQuest();
```

After the final gameplay objective is completed, replace direct settlement assumptions with:

```js
updateMistQuestReadiness();
const readyBeforeTurnIn = state.mistQuest.status === "ready" && scoreSummaryPanel.hidden;
turnInMistQuest(mistQuestNpcTask());
closeDialogue();
update(0);
```

Extend each result object with `readyBeforeTurnIn` and `questStatus`, and assert:

```js
assert.equal(result.readyBeforeTurnIn, true);
assert.equal(result.questStatus, "settled");
assert.equal(result.levelClear, true);
assert.equal(result.levelSettled, true);
assert.equal(result.normalScorePanelOpen, true);
```

Apply this exact flow to:

- the five-level completion block;
- the Easy/Normal/Hard/Crazy Sleeping Bridge completion block;
- the Hard/Crazy boss simultaneous-lamp and final-charge block.

- [ ] **Step 2: Add table-driven four-difficulty quest coverage for all five levels**

Add a fresh runtime that completes every Mist Swamp level under every difficulty through acceptance, gameplay objectives, turn-in, and settlement:

```js
const matrixRuntime = loadGameRuntime();
vm.runInContext(mistQuizSource, matrixRuntime, { filename: "mist-swamp-quiz-bank.js" });
const questCompletionMatrix = vm.runInContext(`
  (() => {
    const results = [];
    const finishSharedQuiz = () => {
      const quiz = state.tasksList.find((task) => task.mistSwampShared && !task.done);
      if (quiz) completeTask(quiz, quiz.x, quiz.y);
    };
    for (const difficulty of ["easy", "normal", "hard", "crazy"]) {
      for (const levelName of ["迷雾沼泽入口", "萤火虫小径", "沉睡木桥", "迷雾核心", "沼泽泥浆怪"]) {
        selectedDifficulty = difficulty;
        resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === levelName));
        scoreSummaryPanel.hidden = true;
        const initialStatus = state.mistQuest.status;
        const npcAnimal = mistQuestNpcTask().animal;
        acceptMistQuest();

        if (levelName === "迷雾沼泽入口") {
          state.inventory.push("fireflyCore", "fireflyCore", "fireflyCore");
          state.tasksList.filter((task) => task.kind === "mist_lamp").forEach((task) => interactMistSwampTask(task));
          finishSharedQuiz();
        } else if (levelName === "萤火虫小径") {
          const trail = state.tasksList.find((task) => task.kind === "firefly_trail");
          state.inventory.push(...trail.need);
          state.fireflyTrailIndex = state.fireflyTrail.filter((point) => !point.decoy).length;
          updateMistSwampMechanisms(0);
          finishSharedQuiz();
        } else if (levelName === "沉睡木桥") {
          for (const color of state.mushroomSequence) {
            interactMistSwampTask(state.tasksList.find((task) => task.kind === "mushroom_lamp" && task.color === color));
          }
          const bridge = state.tasksList.find((task) => task.kind === "broken_bridge");
          state.inventory.push(...bridge.need);
          interactMistSwampTask(bridge);
          const frog = mistQuestNpcTask();
          frog.following = true;
          frog.x = 830;
          frog.y = 210;
          completeTask(frog, frog.x, frog.y);
          finishSharedQuiz();
        } else if (levelName === "迷雾核心") {
          state.inventory.push("lightSpore", "lightSpore", "lightSpore");
          state.tasksList.filter((task) => task.kind === "mist_lamp").forEach((task) => interactMistSwampTask(task));
          state.tasksList.filter((task) => task.kind === "mist_bubble").forEach((task) => interactMistSwampTask(task));
          finishSharedQuiz();
          interactMistSwampTask(mistQuestNpcTask());
        } else {
          state.inventory.push("lightSpore", "lightSpore", "lightSpore");
          state.tasksList.filter((task) => task.kind === "mist_lamp").forEach((task) => interactMistSwampTask(task));
          updateMistSwampMechanisms(0);
          state.mudBubbles.forEach((bubble) => completeTask(bubble, bubble.x, bubble.y));
          updateMistSwampMechanisms(0);
          const boss = mistQuestNpcTask();
          boss.chargeReady = true;
          completeTask(boss, boss.x, boss.y);
        }

        updateMistQuestReadiness();
        const readyBeforeTurnIn = state.mistQuest.status === "ready" && scoreSummaryPanel.hidden;
        turnInMistQuest(mistQuestNpcTask());
        closeDialogue();
        state.running = true;
        update(0);
        results.push({
          difficulty,
          levelName,
          initialStatus,
          npcAnimal,
          readyBeforeTurnIn,
          questStatus: state.mistQuest.status,
          levelClear: state.levelClear,
          levelSettled: state.levelSettled,
          panelOpen: !scoreSummaryPanel.hidden,
        });
      }
    }
    return results;
  })();
`, matrixRuntime);

assert.equal(questCompletionMatrix.length, 20);
for (const result of plain(questCompletionMatrix)) {
  assert.equal(result.initialStatus, "locked", `${result.difficulty} ${result.levelName} starts locked`);
  assert.equal(result.npcAnimal, expectedQuestNpcs[result.levelName], `${result.levelName} NPC`);
  assert.equal(result.readyBeforeTurnIn, true, `${result.difficulty} ${result.levelName} waits for turn-in`);
  assert.equal(result.questStatus, "settled", `${result.difficulty} ${result.levelName} quest settled`);
  assert.equal(result.levelClear, true, `${result.difficulty} ${result.levelName} clear`);
  assert.equal(result.levelSettled, true, `${result.difficulty} ${result.levelName} score settled`);
  assert.equal(result.panelOpen, true, `${result.difficulty} ${result.levelName} panel open`);
}
```

- [ ] **Step 3: Refresh only the game cache key and its assertions**

Change:

```html
<script src="./game.js?v=mist-swamp-bridge-layout-20260721"></script>
```

to:

```html
<script src="./game.js?v=mist-swamp-quest-guidance-20260722"></script>
```

Update the exact `game.js` cache-key assertions in `tests/mist-swamp-base.test.mjs` and `tests/quiz-randomization.test.mjs`. Leave all other script cache keys unchanged.

- [ ] **Step 4: Run complete automated verification**

Run:

```bash
node --check game.js
node --check world-map.js
node --check mist-swamp-map-entry.js
node --check mist-swamp-quiz-bank.js
node --check grade-quiz.js
node --check art-assets.js
node --test tests/*.test.mjs
git diff --check
```

Expected: every syntax check exits `0`, all tests pass, and `git diff --check` prints no output.

- [ ] **Step 5: Browser-smoke all five levels**

Start the existing local server and open each Mist Swamp level. For every level verify:

1. The quest card first says to find the correct NPC.
2. The yellow `!` marker and locked guidance dots lead to that NPC.
3. `E` opens the existing dialogue panel and the last line shows `接受任务`.
4. Existing mechanisms do not progress before acceptance, while already collected items remain.
5. Objective counts and the next action match gameplay.
6. All required mechanics complete on Easy, Normal, Hard, and Crazy.
7. The score panel remains closed in `ready`.
8. The gold `?` marker and guidance dots lead back to the NPC.
9. NPC turn-in displays completion dialogue, grants the reward once, and opens the normal score panel once.
10. Waiting ten seconds in `ready` displays a working `直接完成任务` fallback.
11. Level 3 turns in to the frog at `mistBridgeExit`.
12. Level 4 grants one `fireflyLantern`; Level 5 grants one `mistGuardianBadge`.
13. Browser console errors and warnings are zero.

Also open one Day 1-7 level, one Moonlight Lake level, one Apple Valley level, and one Forest Road level. Verify that no quest card appears and dialogue, task completion, rewards, and settlement remain unchanged.

- [ ] **Step 6: Commit the complete regression pass**

```bash
git add game.js index.html tests/mist-swamp-base.test.mjs tests/mist-swamp-runtime.test.mjs tests/quiz-randomization.test.mjs
git commit -m "Verify Mist Swamp quest guidance flow"
```

---

## Final acceptance

- All five Mist Swamp levels support `locked -> active -> ready -> settled`.
- Every level uses its approved existing NPC anchor.
- Children always see a concrete next action and progress count.
- No Mist Swamp score panel opens before NPC turn-in or the delayed fallback.
- Rewards are granted once at turn-in.
- Easy/Normal/Hard/Crazy remain completable without reducing advanced mechanics.
- No new behavior runs outside Mist Swamp.
- Full automated tests, syntax checks, `git diff --check`, browser smoke, and zero-console-error checks pass before PR creation.
