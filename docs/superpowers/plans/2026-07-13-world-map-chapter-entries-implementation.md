# World Map Chapter Entries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Forest School and Forest Road the same single-button world-map entry behavior already used by Moonlight Lake and Apple Valley.

**Architecture:** Keep one small entry script per playable chapter. Add only the two missing scripts and load them after `world-map.js`; do not move entry behavior into the world-map core.

**Tech Stack:** Browser JavaScript, DOM events, Node.js assertion tests, local browser QA.

## Global Constraints

- Only Forest School, Moonlight Lake, Apple Valley, and Forest Road show playable entry buttons.
- Locked regions do not receive entry buttons.
- Do not change level content, quiz systems, scoring, profiles, storybook cutscenes, or completion logic.
- Repeated region selection must not create duplicate entry buttons.
- Missing entry code must not make the game canvas blank.

---

### Task 1: Add the missing chapter entry contracts

**Files:**
- Create: `tests/world-map-chapter-entries.test.mjs`
- Create: `forest-school-map-entry.js`
- Create: `forest-road-map-entry.js`
- Modify: `index.html`
- Remove: `tests/forest-road-map-entry.test.mjs`

**Interfaces:**
- Consumes: `levels`, `state`, `gameEntered`, `resetGame`, `startBtn`, `text`, `messageEl`, and `preloadNearbyBackgrounds` from `game.js`; `#worldMapGrid` and `#worldMapDetail` from `world-map.js`.
- Produces: one `[data-forest-school-start]` button and one `[data-forest-road-start]` button when their respective regions are active.

- [ ] **Step 1: Write the failing all-entry test**

Create `tests/world-map-chapter-entries.test.mjs` that asserts:

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const chapters = [
  ["forest-school-map-entry.js", "进入森林学校篇", "data-forest-school-start", "resetGame(0, keepHearts)"],
  ["moonlight-map-entry.js", "进入月光湖篇", "data-moonlight-start", "resetGame(levelIndex, keepHearts)"],
  ["apple-valley-map-entry.js", "进入苹果谷篇", "data-apple-valley-start", "resetGame(levelIndex, keepHearts)"],
  ["forest-road-map-entry.js", "进入森林公路篇", "data-forest-road-start", "resetGame(levelIndex, keepHearts)"],
];

for (const [file, label, marker, resetCall] of chapters) {
  const url = new URL(`../${file}`, import.meta.url);
  assert.ok(existsSync(url), `${file} should exist`);
  assert.match(index, new RegExp(`<script src="\\./${file}"></script>`));
  const entry = readFileSync(url, "utf8");
  assert.ok(entry.includes(label));
  assert.ok(entry.includes(marker));
  assert.ok(entry.includes(resetCall));
}
```

- [ ] **Step 2: Run the test and verify the missing Forest School entry fails**

Run: `node tests/world-map-chapter-entries.test.mjs`

Expected: failure because `forest-school-map-entry.js` does not exist.

- [ ] **Step 3: Add the Forest School entry script**

Implement `forest-school-map-entry.js` with an idempotent `进入森林学校篇` button. Its click handler hides the map, calls `resetGame(0, keepHearts)`, restores the start-button label, shows the Forest School start message, and preloads nearby backgrounds.

- [ ] **Step 4: Complete and load the Forest Road entry script**

Keep the existing Forest Road start-index lookup using `level.world === "forest_road"`. Ensure `index.html` loads both missing scripts after the existing Moonlight Lake and Apple Valley entry scripts.

- [ ] **Step 5: Run the focused test**

Run: `node tests/world-map-chapter-entries.test.mjs`

Expected: exit code `0` with no assertion failure.

- [ ] **Step 6: Commit the entry implementation**

```bash
git add index.html forest-school-map-entry.js forest-road-map-entry.js tests/world-map-chapter-entries.test.mjs tests/forest-road-map-entry.test.mjs
git commit -m "Add playable world map entries"
```

### Task 2: Rebase and validate all chapter entries

**Files:**
- Verify: `index.html`
- Verify: `forest-school-map-entry.js`
- Verify: `moonlight-map-entry.js`
- Verify: `apple-valley-map-entry.js`
- Verify: `forest-road-map-entry.js`

**Interfaces:**
- Consumes: the four entry scripts from Task 1.
- Produces: a branch based on current `origin/main` with verified entry behavior.

- [ ] **Step 1: Rebase onto current main**

Run:

```bash
git fetch origin main
git rebase origin/main
```

Expected: successful rebase with the chapter-entry commits on top of current `main`.

- [ ] **Step 2: Run syntax and regression checks**

Run:

```bash
node tests/world-map-chapter-entries.test.mjs
for test_file in tests/*.mjs; do node "$test_file"; done
for js_file in *.js; do node --check "$js_file"; done
git diff --check origin/main...HEAD
```

Expected: all commands exit `0`; Forest Road position scan reports no out-of-area points or overlaps.

- [ ] **Step 3: Browser-check the four playable regions**

Open the latest branch in the local browser, open the world map, and select each playable region. Verify the detail panel contains exactly one corresponding entry button:

```text
森林学校 -> 进入森林学校篇
月光湖 -> 进入月光湖篇
苹果谷 -> 进入苹果谷篇
森林公路 -> 进入森林公路篇
```

Select at least one locked region and verify no `进入…篇` button appears. Click the Forest School and Forest Road entry buttons and verify they enter Day 1 and Forest Road Entrance without console errors.

- [ ] **Step 4: Record final branch state**

Run: `git status -sb`

Expected: clean branch with only the planned commits ahead of `origin/main`.
