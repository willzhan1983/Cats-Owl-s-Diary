# Wetland Park Adventure PR A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a fallback-safe, five-level Wetland Park chapter that can be entered after Riverside Dock, uses NPC quest acceptance, preserves checkpoint progress, and is fully playable before advanced movement, Boss, and final art/music work.

**Architecture:** Add five `wetland_park` level records and a small chapter-scoped `wetlandQuest` state alongside the existing Mist Swamp quest flow. Reuse the current quest card and dialogue surface without modifying Mist Swamp behavior; add only wetland-guarded branches. A new entry script and isolated quiz bank follow the Riverside Dock pattern. Canvas draw functions are the immediate visual contract, with later asset replacement planned separately.

**Tech Stack:** Browser JavaScript, HTML Canvas, existing global script loading, Node built-in test runner, static local server.

**Spec:** `docs/superpowers/specs/2026-08-28-wetland-park-adventure-design.md`

## Global Constraints

- Work from a clean isolated worktree created from the current `github/main`; do not use the migrated primary checkout for Git operations.
- Add only `wetland_park`-guarded behavior; do not change an existing chapter's behavior, level order, save format, score settlement, or music behavior.
- Keep `WORLD_PREREQUISITES.wetland_park = "riverside_dock"`; add `mist_swamp: "wetland_park"` only after verifying no existing public route relies on Mist Swamp being initially unlocked.
- Reuse the existing NPC dialogue/card and Canvas fallback paths. Missing images/audio must not block start, interaction, completion, or score summary.
- Use lower-case English identifiers: `wetland_fog_entrance`, `wetland_reed_maze`, `wetland_drift_crossing`, `wetland_ruin_mirrors`, `wetland_fog_crocodile`, `wetlandQuest`, and `wetlandParkShared`.
- New formal image assets are out of scope for this PR. Do not replace approved Mimi/Owlly assets. PR B/C will add transparent PNGs and music after review.
- Each task starts with a focused failing test, uses the minimum implementation, runs its focused test, and commits only its listed files.

## Planned File Structure

| Path | Responsibility |
| --- | --- |
| `game.js` | Wetland world registration, five level definitions, reset-time `wetlandQuest` state, NPC acceptance/turn-in guards, checkpoint handling, Canvas-only task drawing, and completion/unlock integration. |
| `wetland-park-map-entry.js` | World-map detail button and guarded chapter start, patterned after `riverside-dock-map-entry.js`. |
| `wetland-park-quiz-bank.js` | Isolated, difficulty-aware `wetlandParkShared` bank and five stable per-run quiz placements. |
| `index.html` | Load wetland quiz and map-entry scripts in the same ordering as the current chapter scripts; bump only relevant cache query strings. |
| `tests/wetland-park-levels.test.mjs` | Level data, derived world mapping, and no changes to existing level IDs. |
| `tests/wetland-park-progression.test.mjs` | Map entry, prerequisite, completion-to-unlock, and level-order assertions. |
| `tests/wetland-park-quest.test.mjs` | NPC quest acceptance, chapter guard, preserved checkpoint state, and fallback-safe Canvas handler assertions. |
| `tests/wetland-park-quiz-bank.test.mjs` | Question schema, difficulty coverage, stable assignment, no repeated level question, and valid answer indexes. |
| `tests/wetland-park-runtime.test.mjs` | Script load order and no-Mist-regression static guard assertions. |

## Task 1: Add the failing chapter, mapping, and unlock tests

**Files:**
- Create: `tests/wetland-park-levels.test.mjs`
- Create: `tests/wetland-park-progression.test.mjs`
- Modify: none

**Interfaces:**
- Consumes: `levels`, `WORLD_MAP`, `WORLD_PREREQUISITES`, and the naming conventions in `game.js`.
- Produces: a red test suite that fixes the required IDs, names, world mapping, and unlock contract before runtime code changes.

- [ ] **Step 1: Write the failing level-data test.**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const expected = [
  ["wetland_fog_entrance", "雾中入口"],
  ["wetland_reed_maze", "芦苇迷径"],
  ["wetland_drift_crossing", "浮木渡口"],
  ["wetland_ruin_mirrors", "沼泽遗迹"],
  ["wetland_fog_crocodile", "迷雾巨鳄·沼泽守门人"],
];

for (const [id, name] of expected) {
  assert.match(game, new RegExp(`id: "${id}"[\\s\\S]{0,300}?name: "${name}"`));
}
assert.match(game, /WORLD_MAP\.wetland_park\.levels = levels[\s\S]*level\.world === "wetland_park"/);
```

- [ ] **Step 2: Write the failing progression test.**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const entry = readFileSync(new URL("../wetland-park-map-entry.js", import.meta.url), "utf8");

assert.match(game, /wetland_park:\s*"riverside_dock"/);
assert.match(game, /mist_swamp:\s*"wetland_park"/);
assert.match(entry, /const WORLD_ID = "wetland_park"/);
assert.match(entry, /data-wetland-park-start/);
assert.match(entry, /startWetlandParkChapter: true/);
```

- [ ] **Step 3: Run both tests and verify they fail because Wetland Park runtime data does not yet exist.**

Run: `node --test tests/wetland-park-levels.test.mjs tests/wetland-park-progression.test.mjs`

Expected: FAIL with a missing `wetland_fog_entrance` or missing `wetland-park-map-entry.js` assertion.

- [ ] **Step 4: Commit the red tests.**

```bash
git add tests/wetland-park-levels.test.mjs tests/wetland-park-progression.test.mjs
git commit -m "test: define Wetland Park chapter contract"
```

## Task 2: Add data-only levels and a guarded world-map entry

**Files:**
- Create: `wetland-park-map-entry.js`
- Modify: `game.js: WORLD_MAP declaration, WORLD_PREREQUISITES, level data block, derived world level mappings`
- Modify: `index.html: chapter script list near existing quiz/map-entry scripts`
- Test: `tests/wetland-park-levels.test.mjs`
- Test: `tests/wetland-park-progression.test.mjs`

**Interfaces:**
- Consumes: the red test contract from Task 1 and the existing `riverside-dock-map-entry.js` entry API: `levels`, `state`, `resetGame`, `gameEntered`, `startBtn`, `text`, and `preloadNearbyBackgrounds`.
- Produces: five ordered level records with `world: "wetland_park"`, derived `WORLD_MAP.wetland_park.levels`, and `window`-safe entry button behavior.

- [ ] **Step 1: Add `wetland_park` to the runtime `WORLD_MAP` and preserve derived indices.**

Add the runtime world object adjacent to `riverside_dock` and `mist_swamp`:

```js
wetland_park: {
  id: "wetland_park",
  name: "湿地公园",
  background: "wetland",
  levels: [],
  taskTypes: [TASK_TYPES.FETCH_ITEM, TASK_TYPES.HELP_NPC, TASK_TYPES.SIMPLE_PUZZLE, TASK_TYPES.BOSS_FIGHT],
  boss: "fogCrocodile",
},
```

After the existing Riverside Dock level-index derivation, add the same derived assignment for `wetland_park`; never hard-code numeric level indices.

- [ ] **Step 2: Append the five minimal playable level records.**

Append after the Riverside Dock records without inserting into older chapters. Each object must include `id`, `name`, `bg: "wetland"`, `world: "wetland_park"`, `time`, `start`, `message`, `collectibles`, `tasks`, and empty `puddles`/`hazards` arrays. Use these first-pass NPC tasks and rewards:

```js
{ id: "lumi_quest", name: "Lumi", animal: "lumi", kind: "wetland_npc", role: "issuer", done: false, progress: 0 }
{ id: "reed_quest", name: "Reed", animal: "reed", kind: "wetland_npc", role: "issuer", done: false, progress: 0 }
{ id: "crocodile_quest", name: "迷雾巨鳄", animal: "fogCrocodile", kind: "wetland_npc", role: "boss", done: false, progress: 0 }
```

Use the following objective kind per level for the fallback-complete PR A route: `wetland_lookout`, `wetland_observation`, `wetland_lamp`, `wetland_mirror`, and `wetland_core`. Each objective has `requiresWetlandQuest: true`, a unique `id`, and a reward respectively `wetlandMapPiece`, `windFeather`, `crossingKnot`, `purificationCore`, and `wetlandPass`.

- [ ] **Step 3: Wire the prerequisite map.**

Keep the existing requirement and add the next route requirement:

```js
const WORLD_PREREQUISITES = Object.freeze({
  acorn_town: "forest_road",
  riverside_dock: "acorn_town",
  wetland_park: "riverside_dock",
  mist_swamp: "wetland_park",
});
```

Before retaining this line, manually confirm in the world-map UI that `mist_swamp` uses `CATS_OWLS_PROGRESS.isWorldUnlocked`; if it is statically `unlocked: true`, change only its world-map metadata to use dynamic progress in the same pattern as `wetland_park`.

- [ ] **Step 4: Create `wetland-park-map-entry.js` by adapting the Riverside Dock entry with only identifier/copy changes.**

The start method must use this call:

```js
resetGame(levelIndex, keepHearts, { startWetlandParkChapter: true });
messageEl.textContent = "已从世界地图进入湿地公园篇，点击开始跟随 Lumi 探索迷雾。";
```

The action button must have `data-wetland-park-start="true"`, text `进入湿地公园篇`, and the locked copy `完成河畔码头安全渡河后解锁湿地公园。`.

- [ ] **Step 5: Load the new entry script.**

Add this script after `riverside-dock-map-entry.js` and before `mist-swamp-map-entry.js`:

```html
<script src="./wetland-park-map-entry.js?v=wetland-park-base-20260829"></script>
```

- [ ] **Step 6: Run focused tests and syntax checks.**

Run: `node --check game.js && node --check wetland-park-map-entry.js && node --test tests/wetland-park-levels.test.mjs tests/wetland-park-progression.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit the data and entry slice.**

```bash
git add game.js index.html wetland-park-map-entry.js tests/wetland-park-levels.test.mjs tests/wetland-park-progression.test.mjs
git commit -m "feat: add Wetland Park chapter entry"
```

## Task 3: Define and test isolated Wetland Park quizzes

**Files:**
- Create: `wetland-park-quiz-bank.js`
- Modify: `index.html: load wetland quiz bank before grade-quiz.js`
- Test: `tests/wetland-park-quiz-bank.test.mjs`

**Interfaces:**
- Consumes: global `quizBank`, `levels`, `state`, `resetGame`, `startBtn`, and the stable assignment shape exported by `CATS_OWLS_RIVERSIDE_DOCK_QUIZ`.
- Produces: `window.CATS_OWLS_WETLAND_PARK_QUIZ` with `{ key, beginRun, assign, runSnapshot, catalog }` and exactly one `wetlandParkShared` quiz task per Wetland Park level.

- [ ] **Step 1: Write the failing bank test.**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../wetland-park-quiz-bank.js", import.meta.url), "utf8");
const context = { quizBank: {}, levels: [{ world: "wetland_park", id: "wetland_fog_entrance", tasks: [] }], globalThis: {}, Math };
context.window = context.globalThis;
vm.runInNewContext(source, context);
const api = context.globalThis.CATS_OWLS_WETLAND_PARK_QUIZ;

assert.equal(api.key, "wetlandParkShared");
assert.ok(api.catalog.some((question) => question.difficulty === "easy"));
assert.ok(api.catalog.some((question) => question.difficulty === "normal"));
assert.ok(api.catalog.some((question) => question.difficulty === "hard"));
assert.ok(api.catalog.some((question) => question.difficulty === "crazy"));
for (const question of api.catalog) assert.equal(question.options[question.answer] !== undefined, true);
```

- [ ] **Step 2: Run the test and verify it fails because the module is absent.**

Run: `node --test tests/wetland-park-quiz-bank.test.mjs`

Expected: FAIL with `ENOENT` for `wetland-park-quiz-bank.js`.

- [ ] **Step 3: Implement a bank that copies the Riverside Dock run-state contract, with wetland-specific questions.**

Use `const KEY = "wetlandParkShared"` and the same `beginRun`, `assign`, option shuffle, same-run assignment map, and bounded recent-ID avoidance design. The catalog must contain at least six questions at each of `easy`, `normal`, `hard`, and `crazy`, each with the fields `id`, `category`, `difficulty`, `question`, `options`, and `answer`.

Use only these categories: `math`, `english`, `language`, `reading`, `logic`. Cover: direction order, safe water-level choices, wetland habitat relationships, `fog` / `reed` / `wetland` vocabulary, and cause/effect reasoning. Do not use `science`, because the project quiz-quality rules do not permit it.

For every level with `world === "wetland_park"`, push one task only when no task already has `wetlandParkShared`:

```js
{
  id: `wp_quiz_${level.id}`,
  name: "湿地观察题",
  kind: "quiz",
  quizKey: KEY,
  quiz: null,
  requiresCoreTasks: true,
  wetlandParkShared: true,
  done: false,
  progress: 0,
}
```

- [ ] **Step 4: Begin a new bank run when chapter entry resets its first level.**

In `resetGame`, directly after the current Riverside Dock `beginRun` branch, add a guarded branch:

```js
const wetlandQuizApi = window.CATS_OWLS_WETLAND_PARK_QUIZ;
if (rawLevel?.world === "wetland_park" && (options.startWetlandParkChapter || previousWorld !== "wetland_park") && typeof wetlandQuizApi?.beginRun === "function") {
  wetlandQuizApi.beginRun(selectedDifficulty);
}
```

In the current `quizDisplay` assignment dispatch, add a mutually exclusive `task.wetlandParkShared && level.world === "wetland_park"` branch that calls `wetlandQuizApi.assign(level.id, selectedDifficulty)`.

- [ ] **Step 5: Load the bank before `grade-quiz.js` and run tests.**

Add:

```html
<script src="./wetland-park-quiz-bank.js?v=wetland-park-base-20260829"></script>
```

Run: `node --check game.js && node --check wetland-park-quiz-bank.js && node --test tests/wetland-park-quiz-bank.test.mjs tests/quiz-quality.test.mjs tests/quiz-randomization.test.mjs`

Expected: PASS; the existing general quiz tests still pass.

- [ ] **Step 6: Commit the quiz slice.**

```bash
git add game.js index.html wetland-park-quiz-bank.js tests/wetland-park-quiz-bank.test.mjs
git commit -m "feat: add Wetland Park quiz bank"
```

## Task 4: Add NPC acceptance, checkpoint state, and Canvas fallback mechanics

**Files:**
- Modify: `game.js: reset state, task interaction, dialogue mode, draw dispatch, and task labels`
- Create: `tests/wetland-park-quest.test.mjs`
- Create: `tests/wetland-park-runtime.test.mjs`

**Interfaces:**
- Consumes: `state.tasksList`, `completeTask(task, x, y)`, `taskDialogueLines(task, mode)`, `renderMistQuestHud()`, current task draw dispatch, and Wetland task IDs from Task 2.
- Produces: `isWetlandParkLevel()`, `createWetlandQuestState(level, tasks)`, `wetlandQuestNpcTask()`, `wetlandQuestAllowsProgress()`, `interactWetlandParkTask(task)`, and a Canvas fallback renderer for each PR A objective.

- [ ] **Step 1: Write the failing Wetland quest/runtime tests.**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
assert.match(game, /function isWetlandParkLevel\(\)/);
assert.match(game, /function createWetlandQuestState\(level, tasks\)/);
assert.match(game, /function wetlandQuestAllowsProgress\(\)/);
assert.match(game, /function interactWetlandParkTask\(task\)/);
assert.match(game, /if \(!isWetlandParkLevel\(\)\) return false;/);
assert.match(game, /status: "locked"/);
assert.match(game, /checkpoint/);
```

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
assert.match(html, /wetland-park-quiz-bank\.js/);
assert.match(html, /wetland-park-map-entry\.js/);
assert.match(game, /wetland_park/);
assert.ok(!/isMistSwampLevel\(\)\s*&&\s*.*wetland/.test(game));
```

- [ ] **Step 2: Run the focused tests and verify they fail.**

Run: `node --test tests/wetland-park-quest.test.mjs tests/wetland-park-runtime.test.mjs`

Expected: FAIL because the Wetland quest helpers do not exist.

- [ ] **Step 3: Create a narrow Wetland quest state.**

Add these helpers beside the existing Mist Quest helpers; do not rename Mist functions:

```js
function isWetlandParkLevel() {
  return levels[state?.levelIndex]?.world === "wetland_park";
}

function createWetlandQuestState(level, tasks) {
  if (level?.world !== "wetland_park") return null;
  const npcTask = tasks.find((task) => task.kind === "wetland_npc");
  return { status: "locked", npcTaskId: npcTask?.id || null, checkpoint: { ...level.start } };
}

function wetlandQuestAllowsProgress() {
  return !isWetlandParkLevel() || state.wetlandQuest?.status === "active";
}
```

Initialize `wetlandQuest: createWetlandQuestState(rawLevel, tasksList)` in the existing `resetGame` state literal. Do not write new values to `localStorage` in PR A.

- [ ] **Step 4: Gate objective interactions behind accepted NPC dialogue.**

When the nearby task is the `wetland_npc` issuer, reuse the existing dialogue object flow. The first interaction changes `state.wetlandQuest.status` from `locked` to `active`; the active interaction gives the existing level message; the ready interaction completes only after all non-NPC, non-quiz Wetland objectives are done. Before acceptance, `interactWetlandParkTask` must return this exact child-facing copy:

```js
messageEl.textContent = `先去找${wetlandQuestNpcTask()?.name || "任务伙伴"}接任务。`;
```

For `wetland_lookout`, `wetland_observation`, `wetland_lamp`, `wetland_mirror`, and `wetland_core`, call `completeTask`, update `state.wetlandQuest.checkpoint` to `{ x: task.x, y: task.y }`, and show one level-specific message. No objective may consume an item in PR A.

- [ ] **Step 5: Add Canvas fallback drawing and labels.**

Add a `drawWetlandParkTaskArt(task)` branch before the generic animal fallback. It returns `false` for non-Wetland levels. Draw simple, readable Canvas shapes for: lit/unlit lookout and lamp, observation marker, crossing marker, mirror beam, crystal, fog core, and the large rounded fog crocodile. Use existing `drawAnimal` only as fallback for NPCs. Add task/action labels to the existing label helpers for all six Wetland task kinds.

- [ ] **Step 6: Make the check-point recovery explicit.**

Add `restoreWetlandCheckpoint(message)` that only runs for `isWetlandParkLevel()`, moves the player to `state.wetlandQuest.checkpoint`, clears transient movement target, and updates `messageEl`. Invoke it only for a future water/hazard callback hook; PR A has no damaging hazard, so test it by directly calling the helper in a narrow unit-like exported test harness or static verification. Do not change global heart or timer behavior.

- [ ] **Step 7: Run focused tests and full static checks.**

Run: `node --check game.js && node --test tests/wetland-park-quest.test.mjs tests/wetland-park-runtime.test.mjs tests/wetland-park-levels.test.mjs tests/wetland-park-progression.test.mjs tests/wetland-park-quiz-bank.test.mjs && git diff --check`

Expected: PASS.

- [ ] **Step 8: Commit the NPC and fallback slice.**

```bash
git add game.js tests/wetland-park-quest.test.mjs tests/wetland-park-runtime.test.mjs
git commit -m "feat: add Wetland Park NPC quest flow"
```

## Task 5: Verify the PR A playable path and prepare review evidence

**Files:**
- Modify: none unless a focused test identifies an unmet PR A acceptance condition
- Test: `tests/wetland-park-*.test.mjs`
- Test: existing `tests/world-map-*.test.mjs`, `tests/mist-swamp-*.test.mjs`, `tests/riverside-dock-*.test.mjs`, `tests/quiz-*.test.mjs`

**Interfaces:**
- Consumes: all Task 1–4 deliverables.
- Produces: evidence that the chapter can enter, accept NPC quests, complete five fallback objectives, answer quizzes, settle levels, and expose the next-map unlock without regressions.

- [ ] **Step 1: Run the complete automated suite.**

Run: `node --test tests/*.test.mjs`

Expected: PASS with no skipped Wetland assertions and no failures in Mist Swamp, Riverside Dock, world-map, or quiz tests.

- [ ] **Step 2: Run syntax and diff checks.**

Run: `node --check game.js && node --check wetland-park-map-entry.js && node --check wetland-park-quiz-bank.js && git diff --check github/main...HEAD`

Expected: all commands exit 0.

- [ ] **Step 3: Browser smoke test at desktop size.**

Run: `node server.js`

Open `http://127.0.0.1:5177/`. Complete Riverside Dock using existing local progress or a test-safe completion state, open Wetland Park from the world map, accept the NPC task in every Wetland level, complete its fallback objective and quiz, and confirm each score summary. On the fifth summary, confirm Mist Swamp is shown as unlocked. Record console errors; expected count is 0.

- [ ] **Step 4: Browser smoke test at mobile size.**

At a 390×844 viewport, repeat Level 1 NPC acceptance, one objective interaction, quiz opening, and the World Map detail action. Confirm the quest card/dialogue does not cover the active interaction target and tap input works. Record console errors; expected count is 0.

- [ ] **Step 5: Review the changed-file scope.**

Run: `git diff --stat github/main...HEAD && git diff --name-only github/main...HEAD`

Expected files are limited to `game.js`, `index.html`, the two Wetland scripts, and `tests/wetland-park-*.test.mjs`; no formal art/audio files or unrelated chapter files are included.

- [ ] **Step 6: Commit only a verification repair if a test exposes a defect.**

```bash
git add game.js index.html wetland-park-map-entry.js wetland-park-quiz-bank.js tests/wetland-park-*.test.mjs
git commit -m "fix: verify Wetland Park base chapter"
```

If every check already passes, do not create an empty commit.

## Follow-up Delivery Plans

PR A is intentionally the first executable plan because it proves `能进入 → 能接任务 → 能完成 → 能结算` without new assets or advanced timing. After PR A is reviewed, write separate plans from the approved specification for:

1. **PR B:** route inference, dynamic floating platforms, mirror path rules, difficulty-specific visibility/timing, and persistent checkpoint recovery tests.
2. **PR C:** ImageGen-produced transparent PNG assets, five background tracks, Boss three-stage state machine, post-purification scene, and desktop/mobile visual QA.

Neither follow-up begins until PR A has passed regression checks and the user has reviewed the playable fallback version.
