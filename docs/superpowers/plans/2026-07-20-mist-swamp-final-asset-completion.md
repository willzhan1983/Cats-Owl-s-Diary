# Mist Swamp Final Asset Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the final eight Mist Swamp Canvas/shared-art placeholders with dedicated transparent PNG assets, verify all five levels, and publish the reviewed branch.

**Architecture:** Add one standalone RGBA asset per missing item, prop, or effect; register each file in the existing art pack and route only Mist Swamp rendering through those keys. Keep every Canvas fallback intact and extend the existing asset/runtime tests rather than changing the main gameplay flow.

**Tech Stack:** Vanilla JavaScript, Canvas 2D, PNG/RGBA assets, Node.js test runner, Image Gen, Adobe background removal, Git/GitHub CLI.

## Global Constraints

- Final files are lowercase English-named 512 x 512 RGBA PNGs with transparent corners.
- New art uses the existing painterly, rounded, child-friendly Mist Swamp style.
- Image Gen creates new art; Adobe removes backgrounds and cleans alpha edges.
- No combined concept-sheet crops.
- All new runtime paths are guarded by `level.world === "mist_swamp"` or `isMistSwampLevel()`.
- Existing backgrounds, NPCs, progression, difficulty, rewards, settlement, and other worlds remain unchanged.
- Canvas fallbacks remain available.

---

### Task 1: Add the eight transparent assets

**Files:**
- Create: `assets/items/firefly_core.png`
- Create: `assets/items/glow_spore.png`
- Create: `assets/items/bridge_plank.png`
- Create: `assets/items/bridge_key.png`
- Create: `assets/props/mist_lamp.png`
- Create: `assets/effects/mud_bubble.png`
- Create: `assets/effects/mud_core.png`
- Create: `assets/items/mist_guardian_badge.png`
- Modify: `tests/mist-swamp-art-assets.test.mjs`

**Interfaces:**
- Consumes: `readRgbaPng(path)` from `tests/mist-swamp-art-assets.test.mjs`.
- Produces: eight 512 x 512 RGBA files with alpha-zero corners for art-pack registration.

- [ ] **Step 1: Write the failing asset test**

Add this test before creating any files:

```js
test("final Mist Swamp item and effect replacements use transparent PNG files", () => {
  for (const path of [
    "assets/items/firefly_core.png",
    "assets/items/glow_spore.png",
    "assets/items/bridge_plank.png",
    "assets/items/bridge_key.png",
    "assets/props/mist_lamp.png",
    "assets/effects/mud_bubble.png",
    "assets/effects/mud_core.png",
    "assets/items/mist_guardian_badge.png",
  ]) {
    const { width, height, pixels } = readRgbaPng(path);
    assert.equal(width, 512);
    assert.equal(height, 512);
    const alphaAt = (x, y) => pixels[(y * width + x) * 4 + 3];
    assert.deepEqual([alphaAt(0, 0), alphaAt(511, 0), alphaAt(0, 511), alphaAt(511, 511)], [0, 0, 0, 0]);
  }
});
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run: `node --test tests/mist-swamp-art-assets.test.mjs`

Expected: FAIL because `assets/items/firefly_core.png` does not exist.

- [ ] **Step 3: Generate and clean each asset**

Generate each object separately with the existing Mist Swamp art as style reference. Use a white generation background only as an intermediate; remove it with Adobe and visually inspect the full-resolution cutout before saving. Save the final outputs at the eight exact paths above and resize only the already-transparent square outputs to 512 x 512.

- [ ] **Step 4: Verify transparency and dimensions**

Run: `node --test tests/mist-swamp-art-assets.test.mjs`

Expected: the new transparency test passes.

- [ ] **Step 5: Commit the asset batch**

```bash
git add assets/items/firefly_core.png assets/items/glow_spore.png assets/items/bridge_plank.png assets/items/bridge_key.png assets/props/mist_lamp.png assets/effects/mud_bubble.png assets/effects/mud_core.png assets/items/mist_guardian_badge.png tests/mist-swamp-art-assets.test.mjs
git commit -m "Add final Mist Swamp item art"
```

### Task 2: Register and render the new art

**Files:**
- Modify: `art-assets.js:70-82,180-220`
- Modify: `game.js:4280-4410,4450-4495,4990-5225`
- Modify: `tests/mist-swamp-art-assets.test.mjs`
- Test: `tests/mist-swamp-runtime.test.mjs`

**Interfaces:**
- Consumes: the eight exact files from Task 1.
- Produces: art-pack keys `fireflyCore`, `glowSpore`, `bridgePlank`, `bridgeKey`, `mistLamp`, `mudBubble`, `mudCore`, and `mistGuardianBadge`.

- [ ] **Step 1: Write failing registration and guard assertions**

Add assertions for all eight paths in `art-assets.js`, their corresponding item/prop/effect keys in `game.js`, and these guarded render contracts:

```js
assert.match(game, /isMistSwampLevel\(\) && task\.kind === "mist_lamp" && task\.animal !== "bigMistLamp"/);
assert.match(game, /drawEffectArtPackImage\("mudBubble"/);
assert.match(game, /drawEffectArtPackImage\("mudCore"/);
```

- [ ] **Step 2: Run focused tests and verify they fail**

Run: `node --test tests/mist-swamp-art-assets.test.mjs tests/mist-swamp-runtime.test.mjs`

Expected: FAIL because the new keys and render calls are not registered yet.

- [ ] **Step 3: Register exact asset paths**

Add these mappings in `art-assets.js` using the existing category structure:

```js
fireflyCore: "assets/items/firefly_core.png",
glowSpore: "assets/items/glow_spore.png",
bridgePlank: "assets/items/bridge_plank.png",
bridgeKey: "assets/items/bridge_key.png",
mistGuardianBadge: "assets/items/mist_guardian_badge.png",
mistLamp: "assets/props/mist_lamp.png",
mudBubble: "./assets/effects/mud_bubble.png",
mudCore: "./assets/effects/mud_core.png",
```

- [ ] **Step 4: Add item keys, bounds, and guarded drawing**

Add the item keys to `ART_PACK_ITEM_KEYS`, scene/effect keys beside the existing Mist Swamp mappings, and 512-source display bounds consistent with nearby assets. Route normal `mist_lamp` tasks to `mistLamp`, Boss phase-2 bubbles to `mudBubble`, and Boss phase-3 core to `mudCore`. Keep the existing Canvas functions as the fallback branch.

- [ ] **Step 5: Run focused tests**

Run: `node --check game.js && node --check art-assets.js && node --test tests/mist-swamp-art-assets.test.mjs tests/mist-swamp-runtime.test.mjs`

Expected: PASS with no warnings or errors.

- [ ] **Step 6: Commit the integration**

```bash
git add art-assets.js game.js tests/mist-swamp-art-assets.test.mjs tests/mist-swamp-runtime.test.mjs
git commit -m "Render final Mist Swamp item art"
```

### Task 3: Verify the full chapter and quiz fix

**Files:**
- Verify: `game.js`
- Verify: `world-map.js`
- Verify: `mist-swamp-map-entry.js`
- Verify: `mist-swamp-quiz-bank.js`
- Verify: `grade-quiz.js`
- Verify: `art-assets.js`
- Verify: `tests/*.test.mjs`

**Interfaces:**
- Consumes: completed art registration and existing five-level Mist Swamp chapter.
- Produces: evidence that the complete branch is safe to publish.

- [ ] **Step 1: Run all syntax checks**

```bash
node --check game.js
node --check world-map.js
node --check mist-swamp-map-entry.js
node --check mist-swamp-quiz-bank.js
node --check grade-quiz.js
node --check art-assets.js
```

Expected: all commands exit 0 with no output.

- [ ] **Step 2: Run all automated tests and whitespace validation**

```bash
node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and `git diff --check` prints nothing.

- [ ] **Step 3: Browser-check Levels 21-25**

Open `http://127.0.0.1:5177/?level=21&play=1` through `?level=25&play=1`. Confirm every new object is visible in its intended stage, all five levels remain completable, the settlement panel opens, and browser console errors/warnings equal zero.

- [ ] **Step 4: Verify quiz rotation**

Run: `node --test tests/mist-swamp-runtime.test.mjs tests/quiz-randomization.test.mjs`

Expected: all four difficulty modes use four distinct chapter questions before repeating, and Boss retries rotate three questions per supported difficulty.

### Task 4: Publish the reviewed branch

**Files:**
- No source-file changes.

**Interfaces:**
- Consumes: a clean branch with all Task 3 checks passing.
- Produces: the existing matching PR updated, or one new PR if no matching PR exists.

- [ ] **Step 1: Check for an existing PR from the branch**

Run: `gh pr list --head codex/mist-swamp-difficulty-pass --state all`

Expected: either one matching PR to update or no matching PR.

- [ ] **Step 2: Push the branch**

Run: `git push -u github codex/mist-swamp-difficulty-pass`

Expected: remote head advances to the verified local commit.

- [ ] **Step 3: Create or update the PR**

If a matching PR exists, update its title/body and preserve its current Draft/Ready status unless the user explicitly requests a status change. Otherwise create a Draft PR titled `Complete Mist Swamp art and quiz rotation` with the asset list, Mist-only guards, quiz fix, and verification results.

- [ ] **Step 4: Verify GitHub state**

Run: `gh pr view --json number,title,state,isDraft,mergeable,headRefName,baseRefName,url`

Expected: the PR points to `codex/mist-swamp-difficulty-pass`, reports the correct title/body, and is mergeable or explains any remaining GitHub-side blocker.
