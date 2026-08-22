# Riverside Dock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a four-level Riverside Dock chapter after Acorn Town, with a route-memory prologue, recoverable dock mechanics, difficulty-matched quizzes, and Wetland Park unlocking.

**Architecture:** Add a pure `riverside-dock-rules.js` module for deterministic difficulty and recovery rules, then integrate four data-driven levels and the minimum Riverside-only task handlers into the existing Canvas engine. Keep entry, quiz-bank, and tests in chapter-scoped files; use existing water art and Canvas fallbacks so art is optional.

**Tech Stack:** Browser JavaScript, HTML5 Canvas, Node.js `node:test`, localStorage-compatible existing progress API.

**Spec:** `docs/superpowers/specs/2026-08-19-riverside-dock-design.md`

## Global Constraints

- Do not change the localStorage schema or old-world level definitions.
- Do not add or replace character art.
- Wrong actions never remove hearts or key inventory.
- Missing art must render a Canvas fallback instead of a blank scene.
- Every production behavior starts with a failing test and a witnessed RED run.

---

### Task 1: Pure rules and four-level data

**Files:**
- Create: `riverside-dock-rules.js`
- Modify: `game.js`
- Test: `tests/riverside-dock-rules.test.mjs`
- Test: `tests/riverside-dock-levels.test.mjs`

**Interfaces:**
- Produces `window.CATS_OWLS_RIVERSIDE_DOCK_RULES` with `timeFor(levelId, mode)`, `wrongActionPenalty(mode)`, `routeFor(mode)`, `waterWindowFor(mode)`, `advanceSequence(expected, progress, choice)`, and `canCross({ waterSafe, signalGreen, hasPackage })`.
- Produces four `levels` entries whose `world` is `riverside_dock`.

- [ ] **Step 1: Write failing rules and level tests**

Test literal time tables, route lengths `2/3/3/4`, penalties `0/0/3/5`, reset-on-wrong sequence behavior, crossing gates, four ordered level IDs, and `WORLD_MAP.riverside_dock.levels` mapping.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/riverside-dock-rules.test.mjs tests/riverside-dock-levels.test.mjs`

Expected: FAIL because `riverside-dock-rules.js` and Riverside level data do not exist.

- [ ] **Step 3: Implement minimal pure rules and data-driven levels**

Use the literal tables from the spec. The levels must use IDs `riverside_dock_entrance`, `riverside_paddle_search`, `riverside_bridge_repair`, and `riverside_safe_crossing`; they must reuse existing background keys until dedicated approved art exists.

- [ ] **Step 4: Run targeted tests and verify GREEN**

Run: `node --test tests/riverside-dock-rules.test.mjs tests/riverside-dock-levels.test.mjs`

Expected: 2 tests pass, 0 fail.

### Task 2: Entry, unlock, and recoverable mechanics

**Files:**
- Create: `riverside-dock-map-entry.js`
- Modify: `game.js`
- Modify: `world-map.js`
- Modify: `index.html`
- Test: `tests/riverside-dock-progression.test.mjs`
- Test: `tests/riverside-dock-mechanics.test.mjs`

**Interfaces:**
- Consumes `CATS_OWLS_RIVERSIDE_DOCK_RULES` and `CATS_OWLS_PROGRESS.isWorldUnlocked("riverside_dock")`.
- Produces a `[data-riverside-dock-start]` entry action and Riverside-only task kinds `route_marker`, `dock_delivery`, `bridge_slot`, `water_gauge`, `dock_signal`, and `dock_crossing`.

- [ ] **Step 1: Write failing progression and mechanics tests**

Exercise the map-entry script in a VM DOM fixture for locked and unlocked states. Exercise pure sequence/crossing behavior and assert source integration maps wrong actions to Riverside-only time penalties without changing hearts.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/riverside-dock-progression.test.mjs tests/riverside-dock-mechanics.test.mjs`

Expected: FAIL because the entry file and runtime task handlers do not exist.

- [ ] **Step 3: Implement the minimum chapter-scoped runtime integration**

Add the entry button, task factories, proximity hints, interaction handlers, Canvas prop fallbacks, and world completion mapping. On wrong sequence or bridge placement, restore task collectibles and move the player to the level start; never alter `state.hearts`.

- [ ] **Step 4: Run targeted tests and verify GREEN**

Run: `node --test tests/riverside-dock-progression.test.mjs tests/riverside-dock-mechanics.test.mjs`

Expected: 2 tests pass, 0 fail.

### Task 3: Difficulty-aware quiz run

**Files:**
- Create: `riverside-dock-quiz-bank.js`
- Modify: `game.js`
- Modify: `index.html`
- Test: `tests/riverside-dock-quiz-bank.test.mjs`
- Test: `tests/riverside-dock-quiz-run.test.mjs`

**Interfaces:**
- Produces `window.CATS_OWLS_RIVERSIDE_DOCK_QUIZ` with `beginRun(difficulty)`, `assign(levelId, difficulty)`, `runSnapshot()`, and immutable `catalog`.
- Injects one gated `riversideDockShared` quiz task into each Riverside level.

- [ ] **Step 1: Write failing quiz catalog and run-state tests**

Require valid `id/category/difficulty/question/options/answer`, six questions per difficulty, four categories (`math`, `science`, `language`, `english`), four unique same-run assignments, stable retry assignments, and new assignments after `beginRun`.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/riverside-dock-quiz-bank.test.mjs tests/riverside-dock-quiz-run.test.mjs`

Expected: FAIL because the Riverside quiz API does not exist.

- [ ] **Step 3: Implement catalog, shuffle bag, and gated task injection**

Create 24 age-appropriate questions with explicit answers. Reuse the existing option-shuffle pattern while preserving the answer index; begin a new run only when entering Riverside from another world.

- [ ] **Step 4: Run targeted tests and verify GREEN**

Run: `node --test tests/riverside-dock-quiz-bank.test.mjs tests/riverside-dock-quiz-run.test.mjs`

Expected: 2 tests pass, 0 fail.

### Task 4: Full regression and browser verification

**Files:**
- Modify only files required to fix verified Riverside regressions.

**Interfaces:**
- Consumes all prior task outputs; produces verification evidence only.

- [ ] **Step 1: Run syntax and complete automated tests**

Run: `node --check game.js && node --check world-map.js && node --check riverside-dock-rules.js && node --check riverside-dock-map-entry.js && node --check riverside-dock-quiz-bank.js && node --test tests/*.test.mjs && git diff --check`

- [ ] **Step 2: Run desktop browser smoke test**

Serve with `node server.js`; check 1280×800 entry, all four levels, wrong-action recovery, completion, Wetland Park unlock, and zero console errors.

- [ ] **Step 3: Run mobile browser smoke test**

Check 390×844 controls, task hints, quiz panel, no text overlap, no canvas overflow, and zero console errors.

- [ ] **Step 4: Review scope and report remaining art work separately**

Confirm the diff contains no old-world task, quiz, character, or save-schema changes. Dedicated Riverside backgrounds and transparent props remain an Image Gen follow-up unless approved assets were generated and visually verified during this task.
