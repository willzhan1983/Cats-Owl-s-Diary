# PR81 Generic Quest Adapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one reusable quest adapter around the existing Mist Swamp quest flow and prove it on Day 1 without changing task kinds, score logic, Day 4, or any other level configuration.

**Architecture:** Add `level.quest` support beside the existing `level.mistQuest` configuration, create one shared runtime quest state, and keep the current Mist Swamp public helper names as thin compatibility wrappers. Generalize the existing HUD, dialogue, turn-in, progress gate, and settlement gate rather than copying them. Configure only `早晨上学路`; every other non-Mist level remains unchanged in PR81.

**Tech Stack:** Vanilla JavaScript, Canvas/DOM UI, Node.js syntax checks, Node `vm` runtime tests, Git/GitHub.

## Global Constraints

- PR81 configures only Day 1 outside Mist Swamp.
- Do not copy the Mist Swamp quest implementation into a second branch of logic.
- Do not add, remove, rename, or change any gameplay task kind.
- Do not modify `settleLevelRun`, score calculation, local score records, or the score-summary panel.
- Do not add quest configuration or a quest gate to Day 4 `森林课堂挑战`.
- Preserve `state.mistQuest` and existing Mist Swamp helper entry points as compatibility aliases until later PRs migrate their tests.
- Do not change Moonlight Lake, Apple Valley, Forest Road, or Boss configuration in PR81.
- Use test-first development: every behavior change must fail for the intended reason before production code is edited.

---

## File structure

- Modify `game.js`: Day 1 quest configuration, generic adapter/state helpers, generic HUD/dialogue/turn-in calls, progress and settlement gates.
- Modify `tests/mist-swamp-runtime.test.mjs`: reuse the existing real-game VM harness for generic adapter, Day 1, Day 4, and Mist Swamp compatibility tests; do not duplicate the harness.
- Modify `index.html`: bump only the `game.js` cache version after runtime behavior changes.
- Modify `tests/mist-swamp-base.test.mjs` and `tests/quiz-randomization.test.mjs`: update only the asserted `game.js` cache version.
- Keep `style.css`, score files, world-map files, quiz banks, and task constructors unchanged.

### Task 1: Generic quest configuration and runtime state

**Files:**
- Modify: `tests/mist-swamp-runtime.test.mjs`
- Modify: `game.js:721-746`
- Modify: `game.js:1554-1574`
- Modify: `game.js:1880-1950`

**Interfaces:**
- Produces: `levelQuestConfig(level?) -> object | null`
- Produces: `createLevelQuestState(level, tasks) -> object | null`
- Produces: `levelQuestState() -> object | null`
- Preserves: `state.mistQuest` as the exact same object as `state.levelQuest` on Mist Swamp levels

- [ ] **Step 1: Write failing adapter/state tests**

Add assertions after the runtime has loaded:

```js
const genericQuestSetup = vm.runInContext(`
  (() => {
    const day1Index = levels.findIndex((level) => level.name === "早晨上学路");
    const day4Index = levels.findIndex((level) => level.name === "森林课堂挑战");
    resetGame(day1Index);
    const day1 = {
      configNpc: levelQuestConfig().npcAnimal,
      status: levelQuestState().status,
      npcAnimal: questNpcTask().animal,
      mistAlias: state.mistQuest,
    };
    resetGame(day4Index);
    const day4 = { config: levelQuestConfig(), state: levelQuestState() };
    resetGame(levels.findIndex((level) => level.name === "迷雾沼泽入口"));
    const mist = {
      sameState: state.levelQuest === state.mistQuest,
      status: state.mistQuest.status,
      npc: mistQuestNpcTask().animal,
    };
    return { day1, day4, mist };
  })();
`, runtime);

assert.deepEqual(plain(genericQuestSetup), {
  day1: { configNpc: "rabbit", status: "locked", npcAnimal: "rabbit", mistAlias: null },
  day4: { config: null, state: null },
  mist: { sameState: true, status: "locked", npc: "ruru" },
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: FAIL because `levelQuestConfig`, `levelQuestState`, and `questNpcTask` do not exist and Day 1 has no quest configuration.

- [ ] **Step 3: Add the Day 1 configuration**

Add this property to `早晨上学路` without changing its tasks:

```js
quest: {
  npcAnimal: "rabbit",
  introLines: [
    "上学路上有几位邻居需要帮助。",
    "请找到苹果、铅笔和作业本，再把它们送到正确的朋友手里。",
  ],
  activeHint: "先收集需要的物品，再帮助小鹿、松鼠和兔老师。",
  readyHint: "大家都收到需要的物品啦，回到兔老师身边完成任务。",
  completeLines: ["谢谢你帮助了上学路上的每一位朋友！"],
  objectiveLabels: ["帮助小鹿", "帮助松鼠", "帮助兔老师"],
},
```

- [ ] **Step 4: Implement the shared adapter/state**

Replace the Mist-only state constructor with one implementation and one compatibility wrapper:

```js
function levelQuestConfig(level = levels[state?.levelIndex]) {
  return level?.quest || level?.mistQuest || null;
}

function createLevelQuestState(level, tasks) {
  const config = levelQuestConfig(level);
  if (!config) return null;
  const npcTask = tasks.find((task) => task.animal === config.npcAnimal);
  return {
    status: "locked",
    npcTaskId: npcTask?.id || null,
    readyAt: 0,
    lastProgressAt: performance.now(),
    progressSignature: "",
    pendingReward: null,
  };
}

function levelQuestState() {
  return state?.levelQuest || state?.mistQuest || null;
}

function questNpcTask() {
  const quest = levelQuestState();
  if (!quest) return null;
  return state.tasksList.find((task) => task.id === quest.npcTaskId) || null;
}

function mistQuestNpcTask() {
  return questNpcTask();
}
```

Initialize both fields during reset:

```js
state.levelQuest = createLevelQuestState(level, state.tasksList);
state.mistQuest = level.world === "mist_swamp" ? state.levelQuest : null;
```

The initial state object must declare both fields:

```js
levelQuest: null,
mistQuest: null,
```

- [ ] **Step 5: Run focused test and verify GREEN**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: PASS, including the new Day 1/Day 4 adapter assertions and all existing Mist Swamp assertions.

- [ ] **Step 6: Commit the adapter/state slice**

```bash
git add game.js tests/mist-swamp-runtime.test.mjs
git commit -m "Add generic quest state adapter"
```

### Task 2: Generic HUD and dialogue flow

**Files:**
- Modify: `tests/mist-swamp-runtime.test.mjs`
- Modify: `game.js:1567-1732`
- Modify: `game.js:3448-3638`
- Modify: `game.js:5388-5422`

**Interfaces:**
- Consumes: `levelQuestConfig`, `levelQuestState`, `questNpcTask`
- Produces: `isQuestNpc(task) -> boolean`
- Produces: `questObjectiveRows() -> Array<{label:string,current:number,target:number}>`
- Produces: `questNextHint() -> string`
- Produces: `acceptLevelQuest() -> boolean`
- Produces: `turnInLevelQuest(task?) -> boolean`
- Preserves thin wrappers: `mistQuestObjectiveRows`, `mistQuestNextHint`, `acceptMistQuest`, `turnInMistQuest`

- [ ] **Step 1: Write failing Day 1 HUD/dialogue tests**

Add a functional test that uses the existing dialogue functions:

```js
const day1DialogueFlow = vm.runInContext(`
  (() => {
    resetGame(levels.findIndex((level) => level.name === "早晨上学路"));
    const rabbit = questNpcTask();
    const lockedHint = questNextHint();
    openDialogue(rabbit);
    const introMode = state.activeDialogue.mode;
    while (state.activeDialogue?.mode === "quest_intro") nextDialogueLine();
    const accepted = {
      status: levelQuestState().status,
      mode: state.activeDialogue.mode,
      message: messageEl.textContent,
    };
    closeDialogue();
    renderMistQuestHud();
    return {
      lockedHint,
      introMode,
      accepted,
      hudVisible: !mistQuestCard.hidden,
      npcLabel: mistQuestNpc.textContent,
      rows: questObjectiveRows(),
    };
  })();
`, runtime);

assert.equal(day1DialogueFlow.lockedHint, "去找兔老师，按 E 接受任务。");
assert.equal(day1DialogueFlow.introMode, "quest_intro");
assert.deepEqual(plain(day1DialogueFlow.accepted), {
  status: "active",
  mode: "quest_active",
  message: "先收集需要的物品，再帮助小鹿、松鼠和兔老师。",
});
assert.equal(day1DialogueFlow.hudVisible, true);
assert.equal(day1DialogueFlow.npcLabel, "兔老师");
assert.deepEqual(plain(day1DialogueFlow.rows), [
  { label: "帮助小鹿", current: 0, target: 1 },
  { label: "帮助松鼠", current: 0, target: 1 },
  { label: "帮助兔老师", current: 0, target: 1 },
]);
```

- [ ] **Step 2: Run focused test and verify RED**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: FAIL because HUD/dialogue helpers still require `world === "mist_swamp"` and read `level.mistQuest` directly.

- [ ] **Step 3: Add generic objective and hint adapters**

Rename the existing detailed Mist Swamp objective function to `mistSwampQuestObjectiveRows` without changing its body. Add one generic dispatcher and one compatibility wrapper:

```js
function questObjectiveRows() {
  const quest = levelQuestState();
  if (!quest) return [];
  if (isMistSwampLevel()) return mistSwampQuestObjectiveRows();
  const labels = levelQuestConfig()?.objectiveLabels || [];
  return requiredTasksForCurrentLevel().map((task, index) => ({
    label: labels[index] || task.name,
    current: task.done ? 1 : 0,
    target: 1,
  }));
}

function mistQuestObjectiveRows() {
  return questObjectiveRows();
}

function questNextHint() {
  const quest = levelQuestState();
  const config = levelQuestConfig();
  const npc = questNpcTask();
  if (!quest || !config || !npc) return "";
  if (quest.status === "locked") return `去找${npc.name}，按 E 接受任务。`;
  if (quest.status === "ready") return `${config.readyHint} 按 E 完成任务。`;
  if (quest.status === "settled") return "任务已经完成。";
  const row = questObjectiveRows().find((entry) => entry.current < entry.target);
  return row ? `下一步：${row.label}（${Math.floor(row.current)}/${row.target}）` : config.readyHint;
}
```

For Mist Swamp, keep `mistQuestNextHint()` as `return questNextHint()` only after removing the old duplicate body.

- [ ] **Step 4: Generalize HUD and dialogue without duplicating UI**

Change `renderMistQuestHud` to test `levelQuestState()` instead of `isMistSwampLevel()` and `state.mistQuest`. Keep the existing DOM elements and CSS class. Its visible fallback label becomes `关卡任务`.

Update `taskDialogueMode`, `taskDialogueLines`, `renderDialogue`, and `nextDialogueLine` to use:

```js
function isQuestNpc(task) {
  const quest = levelQuestState();
  return !!task && !!quest && task.id === quest.npcTaskId;
}

function isMistQuestNpc(task) {
  return isQuestNpc(task);
}

function acceptLevelQuest() {
  const quest = levelQuestState();
  const config = levelQuestConfig();
  if (!quest || !config || quest.status !== "locked") return false;
  quest.status = "active";
  quest.lastProgressAt = performance.now();
  messageEl.textContent = config.activeHint;
  updateHud();
  return true;
}

function acceptMistQuest() {
  return acceptLevelQuest();
}
```

All quest dialogue copy must come from `levelQuestConfig()`. Existing non-quest dialogue branches remain byte-for-byte unchanged.

- [ ] **Step 5: Generalize markers and fallback eligibility**

Change `drawMistQuestMarker`, the ready-state guidance trail, and fallback checks to read `levelQuestState()` and `questNpcTask()`. Keep the same marker colors and ten-second rule. Do not change Canvas drawing outside those guards.

- [ ] **Step 6: Run focused test and verify GREEN**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: PASS with Day 1 HUD/dialogue flow and all existing Mist Swamp dialogue, marker, fallback, and objective tests intact.

- [ ] **Step 7: Commit the HUD/dialogue slice**

```bash
git add game.js tests/mist-swamp-runtime.test.mjs
git commit -m "Generalize quest guidance UI"
```

### Task 3: Day 1 progress gate, turn-in, and settlement gate

**Files:**
- Modify: `tests/mist-swamp-runtime.test.mjs`
- Modify: `game.js:1703-1754`
- Modify: `game.js:2538-2595`
- Modify: `game.js:2845-2855`
- Modify: `game.js:3142-3210`
- Modify: `game.js:3619-3638`
- Modify: `game.js:3728-3765`

**Interfaces:**
- Consumes: `levelQuestConfig`, `levelQuestState`, `questNpcTask`, `questObjectiveRows`
- Produces: `questAllowsProgress() -> boolean`
- Produces: `updateLevelQuestReadiness() -> boolean`
- Produces: `canSettleCurrentLevel(requiredTasks) -> boolean` using the generic state
- Produces: `turnInLevelQuest(task?) -> boolean`
- Preserves thin wrappers used by Mist Swamp tests and mechanisms

- [ ] **Step 1: Write failing locked-progress and Day 4 regression tests**

Add tests that exercise the real interaction dispatcher:

```js
const questProgressGate = vm.runInContext(`
  (() => {
    const day1Index = levels.findIndex((level) => level.name === "早晨上学路");
    resetGame(day1Index);
    const deer = state.tasksList.find((task) => task.animal === "deer");
    state.inventory.push("apple");
    state.nearbyTask = deer;
    interact();
    const locked = { done: deer.done, inventory: [...state.inventory], status: levelQuestState().status };
    acceptLevelQuest();
    state.nearbyTask = deer;
    interact();
    while (state.activeDialogue && !dialogueGiveBtn.hidden) finishDialogueDelivery();
    const active = { done: deer.done, status: levelQuestState().status };

    resetGame(levels.findIndex((level) => level.name === "森林课堂挑战"));
    return { locked, active, day4Quest: levelQuestState() };
  })();
`, runtime);

assert.deepEqual(plain(questProgressGate), {
  locked: { done: false, inventory: ["apple"], status: "locked" },
  active: { done: true, status: "active" },
  day4Quest: null,
});
```

- [ ] **Step 2: Write failing Day 1 readiness/turn-in/settlement test**

```js
const day1SettlementFlow = vm.runInContext(`
  (() => {
    resetGame(levels.findIndex((level) => level.name === "早晨上学路"));
    acceptLevelQuest();
    const deer = state.tasksList.find((task) => task.animal === "deer");
    const squirrel = state.tasksList.find((task) => task.animal === "squirrel");
    const rabbit = questNpcTask();
    completeTask(deer, deer.x, deer.y);
    completeTask(squirrel, squirrel.x, squirrel.y);
    state.inventory.push("book", "apple");
    const becameReady = updateLevelQuestReadiness();
    const beforeTurnIn = {
      becameReady,
      status: levelQuestState().status,
      rabbitDone: rabbit.done,
      scoreHidden: scoreSummaryPanel.hidden,
    };
    const firstTurnIn = turnInLevelQuest(rabbit);
    const secondTurnIn = turnInLevelQuest(rabbit);
    state.running = true;
    update(0.016);
    return {
      beforeTurnIn,
      firstTurnIn,
      secondTurnIn,
      finalStatus: levelQuestState().status,
      rabbitDone: rabbit.done,
      scoreOpen: !scoreSummaryPanel.hidden,
      settled: state.levelSettled,
    };
  })();
`, runtime);

assert.deepEqual(plain(day1SettlementFlow), {
  beforeTurnIn: { becameReady: true, status: "ready", rabbitDone: false, scoreHidden: true },
  firstTurnIn: true,
  secondTurnIn: false,
  finalStatus: "settled",
  rabbitDone: true,
  scoreOpen: true,
  settled: true,
});
```

- [ ] **Step 3: Run focused test and verify RED**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: FAIL because shared dispatchers and settlement still consult only `state.mistQuest`.

- [ ] **Step 4: Implement one generic progress gate**

```js
function questAllowsProgress() {
  const quest = levelQuestState();
  return !quest || quest.status === "active";
}

function mistQuestAllowsProgress() {
  return questAllowsProgress();
}
```

Use `questAllowsProgress()` in shared action progression and the interaction dispatcher. In `checkTasks`, use `isQuestNpc(task)` before the gate so the locked NPC can always open the acceptance dialogue. Keep Mist Swamp mechanism checks behind their existing world guard.

In `completeTask`, replace the Mist-only pending-reward guard with `isQuestNpc(task)` and `levelQuestState()`. Do not change `grantTaskReward` or any score call.

- [ ] **Step 5: Implement generic readiness and settlement gating**

```js
function levelQuestGameplayComplete() {
  const quest = levelQuestState();
  if (!quest || quest.status !== "active") return false;
  const npc = questNpcTask();
  return requiredTasksForCurrentLevel().every((task) => {
    if (task !== npc || task.kind !== "delivery") return task.done;
    return missingNeeds(task.need).length === 0 && canTalkToMistSwampTask(task);
  });
}

function updateLevelQuestReadiness() {
  const quest = levelQuestState();
  const config = levelQuestConfig();
  if (!quest || !config || !levelQuestGameplayComplete()) return false;
  quest.status = "ready";
  quest.readyAt = performance.now();
  messageEl.textContent = config.readyHint;
  updateHud();
  return true;
}

function canSettleCurrentLevel(requiredTasks) {
  if (!requiredTasks.every((task) => task.done)) return false;
  const quest = levelQuestState();
  return !quest || quest.status === "settled";
}
```

Call `updateLevelQuestReadiness()` from the existing update loop. Keep `updateMistQuestReadiness()` as a compatibility wrapper.

Change the Crazy timeout check to read `levelQuestState()?.status` so a ready or settled Day 1 quest is treated exactly like the existing ready or settled Mist Swamp quest. Do not change difficulty settings or timeout penalties.

- [ ] **Step 6: Implement guarded generic turn-in**

```js
function turnInLevelQuest(task = questNpcTask()) {
  const quest = levelQuestState();
  const config = levelQuestConfig();
  if (!quest || !config || !isQuestNpc(task) || quest.status !== "ready") return false;
  if (task.kind === "delivery" && !task.done) {
    if (missingNeeds(task.need).length) return false;
    consumeNeeds(task.need);
    completeTask(task, task.x, task.y);
  }
  quest.status = "settled";
  grantTaskReward(task, task.x, task.y);
  state.activeDialogue = {
    taskId: task.id,
    task,
    speaker: task.name,
    lines: config.completeLines,
    index: 0,
    mode: "quest_after",
  };
  updateHud();
  renderDialogue();
  return true;
}

function turnInMistQuest(task = questNpcTask()) {
  return turnInLevelQuest(task);
}
```

Do not edit `settleLevelRun` or score-summary code. Settlement continues through the existing update-loop call after the quest becomes settled and every original required task is done.

- [ ] **Step 7: Run focused test and verify GREEN**

Run:

```bash
node --test tests/mist-swamp-runtime.test.mjs
```

Expected: PASS for locked Day 1 behavior, Day 1 turn-in and single settlement, Day 4 exemption, and all Mist Swamp quest tests.

- [ ] **Step 8: Commit the progress/settlement slice**

```bash
git add game.js tests/mist-swamp-runtime.test.mjs
git commit -m "Gate Day 1 with quest turn-in"
```

### Task 4: Cache version, regression verification, and Day 1 browser smoke

**Files:**
- Modify: `index.html:183`
- Modify: `tests/mist-swamp-base.test.mjs:9`
- Modify: `tests/quiz-randomization.test.mjs:52-54`

**Interfaces:**
- Consumes the completed PR81 runtime behavior.
- Produces no new runtime API.

- [ ] **Step 1: Update the game cache version and its exact tests**

Use one new version consistently:

```html
<script src="./game.js?v=generic-quest-adapter-pr81-20260722"></script>
```

Update only the two tests that assert this exact version string.

- [ ] **Step 2: Run syntax and complete automated verification**

Run:

```bash
node --check game.js
node --check world-map.js
node --check mist-swamp-map-entry.js
node --check mist-swamp-quiz-bank.js
node --test tests/*.test.mjs
git diff --check
```

Expected: all syntax checks exit 0, all tests pass, and diff check emits no errors.

- [ ] **Step 3: Audit the diff scope**

Run:

```bash
git diff --stat origin/main...HEAD
git diff origin/main...HEAD -- game.js index.html tests/mist-swamp-runtime.test.mjs tests/mist-swamp-base.test.mjs tests/quiz-randomization.test.mjs
```

Expected: no task constructor or task kind changes; no edits to score calculation, score records, Day 4 level data, world maps, other chapter level data, or Boss branches.

- [ ] **Step 4: Browser smoke Day 1 and Mist Swamp**

Start the existing local server and verify Day 1 in Easy and Normal:

1. Load Day 1 and confirm the task card says to find 兔老师.
2. Pick up one item before acceptance and confirm it remains in the bag.
3. Try another NPC before acceptance and confirm its delivery does not complete.
4. Talk to 兔老师, accept, complete all three original deliveries, and return to 兔老师.
5. Confirm score settlement opens once and the console has zero errors.
6. Load Day 4 and confirm direct quiz interaction still works without acceptance.
7. Load one Mist Swamp level and confirm its existing acceptance, HUD, turn-in, and settlement still work.

- [ ] **Step 5: Commit the verified PR81 result**

```bash
git add index.html tests/mist-swamp-base.test.mjs tests/quiz-randomization.test.mjs
git commit -m "Verify generic quest adapter"
```

- [ ] **Step 6: Open PR81 as Draft**

Push `codex/all-level-quest-mode-pr81` and open a Draft PR targeting `main` with the title:

```text
Add generic quest adapter with Day 1 validation
```

The PR body must state that only Day 1 is newly configured, Day 4 is unchanged, no task kinds or score code changed, and subsequent chapters will be separate PRs.
