# Apple Valley Grounding Experiment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Apple Valley collectibles, tasks, NPCs, apple trees, and the cart read as grounded while retaining a subtle idle animation.

**Architecture:** Keep gameplay coordinates unchanged and add Apple Valley-only rendering helpers in `game.js`. Use trimmed alpha bounds with bottom alignment for relevant PNGs, draw shadows before bob transforms, and retain all existing fallbacks.

**Tech Stack:** Browser Canvas 2D, vanilla JavaScript, Node.js static regression tests, in-app browser QA.

## Global Constraints

- Apply visual changes only when the current level world is `apple_valley`.
- Do not change task, collectible, obstacle, or interaction coordinates.
- Do not change scoring, quiz, timer, task-count, or world-map behavior.
- Do not edit or regenerate image assets.

---

### Task 1: Lock the Apple Valley grounding contract

**Files:**
- Create: `tests/apple-valley-grounding.test.mjs`
- Modify: `game.js`

**Interfaces:**
- Consumes: `levels[state.levelIndex].world`, `ART_PACK_NPC_BOUNDS`, `imageTransparentBounds(image)`.
- Produces: `isAppleValleyLevel()`, `drawGroundedArtPackImage(category, key, x, y, width, height)`, and Apple Valley-only shadow/bob behavior.

- [ ] **Step 1: Write the failing test**

Create a static regression test that asserts `game.js` contains an Apple Valley world guard, a `1.5` collectible bob amplitude, a grounded alpha-trimmed image helper, and fixed shadow rendering before the collectible bob transform.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node tests/apple-valley-grounding.test.mjs`

Expected: FAIL because the Apple Valley grounding constants and helpers do not exist yet.

- [ ] **Step 3: Implement the minimum rendering change**

In `game.js`:

```js
function isAppleValleyLevel() {
  return levels[state.levelIndex]?.world === "apple_valley";
}
```

Add `drawGroundedArtPackImage(...)` beside the existing art-pack draw helpers. It must crop to `imageTransparentBounds(image)`, contain the visible image within the requested box, center it horizontally, and align its visible bottom to `y + height`.

Update the Apple Valley branch of:

- `drawCollectibles()` to use a `1.5` pixel bob and draw its shadow before `ctx.translate(0, bob)`.
- `drawTasks()` to draw a fixed shadow at the rendered task bottom and use at most `1` pixel idle movement.
- `drawNpcArtPackImage()` to use bottom-aligned trimmed images only in Apple Valley.
- `drawObstacleArtPackImage()` to add a shadow and bottom-align apple trees only in Apple Valley.
- `drawAppleCart()` and `drawEscortCart()` to use the trimmed cart image with a ground shadow.

Keep all non-Apple Valley branches behaviorally unchanged.

- [ ] **Step 4: Run the focused and full tests**

Run:

```bash
node tests/apple-valley-grounding.test.mjs
for test_file in tests/*.mjs; do node "$test_file"; done
for js_file in *.js; do node --check "$js_file"; done
git diff --check
```

Expected: all commands exit successfully.

- [ ] **Step 5: Commit**

```bash
git add game.js tests/apple-valley-grounding.test.mjs
git commit -m "Ground Apple Valley props and NPCs"
```

### Task 2: Browser QA levels 13-16

**Files:**
- Verify: `game.js`
- Verify: `tests/apple-valley-grounding.test.mjs`

**Interfaces:**
- Consumes: local preview URLs `?level=13&play=1` through `?level=16&play=1`.
- Produces: visual evidence and a user-facing test URL.

- [ ] **Step 1: Start the local preview**

Run a local static server on an unused `127.0.0.1` port from the repository root.

- [ ] **Step 2: Inspect all four Apple Valley levels**

Confirm each level renders meaningful content with no framework overlay and no relevant console errors. Check that collectible shadows stay on the ground, NPC/task shadows meet the sprite bottom, and apple trees/cart no longer appear suspended.

- [ ] **Step 3: Exercise an interaction**

On level 13, move the player into at least one collectible and verify the backpack/task UI changes. This confirms the visual-only change did not move interaction coordinates.

- [ ] **Step 4: Re-run final checks**

Run all tests, root JavaScript syntax checks, and `git diff --check` after browser QA.

- [ ] **Step 5: Keep the test page open**

Keep level 13 open as the deliverable tab and provide the exact local URL to the user.
