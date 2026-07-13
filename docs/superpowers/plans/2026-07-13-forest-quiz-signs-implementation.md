# Forest Quiz Signs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the six generic quiz stands with the approved firefly-magic forest sign PNGs while preserving the existing quiz behavior and canvas fallback.

**Architecture:** Generate six same-canvas RGBA assets from one approved visual family, register them as art-pack props, and route existing quiz kinds through one small image-first renderer. If an image is unavailable, the current `drawQuizStand` code remains the fallback.

**Tech Stack:** Image Gen raster assets, PNG/RGBA, browser Canvas 2D, vanilla JavaScript, Node assertion tests.

## Global Constraints

- Do not change quiz selection, difficulty, scoring, task coordinates, or completion behavior.
- Use lowercase English PNG filenames under `assets/props/`.
- All six assets must share one canvas size, baseline, silhouette, and transparent padding.
- Keep the current canvas-drawn quiz stand as the missing-image fallback.

---

### Task 1: Produce the Six Transparent Quiz-Sign Assets

**Files:**
- Create: `assets/props/quiz_sign_math.png`
- Create: `assets/props/quiz_sign_logic.png`
- Create: `assets/props/quiz_sign_science.png`
- Create: `assets/props/quiz_sign_language.png`
- Create: `assets/props/quiz_sign_english.png`
- Create: `assets/props/quiz_sign_riddle.png`

**Interfaces:**
- Consumes: approved family reference `docs/visual-reference/forest-quiz-signs-concept.png`
- Produces: six square RGBA PNGs with identical visual bounds and transparent corners

- [ ] **Step 1: Generate the master sign family**

Use the approved deep-green hollow-tree plaque, golden vine border, three small firefly lights, and short wooden stake. Generate one image per symbol with the exact symbol/accent mapping in the design spec. Use a flat removable background color that does not occur in the subject.

- [ ] **Step 2: Convert each source to transparent PNG**

Remove only the flat background, preserve anti-aliased edges, and output each file at the same square dimensions with an RGBA channel.

- [ ] **Step 3: Verify asset metadata**

Run:

```bash
for f in assets/props/quiz_sign_{math,logic,science,language,english,riddle}.png; do
  sips -g hasAlpha -g pixelWidth -g pixelHeight "$f"
done
```

Expected: every file reports `hasAlpha: yes` and the same width and height.

- [ ] **Step 4: Commit the asset family**

```bash
git add assets/props/quiz_sign_*.png
git commit -m "Add Forest quiz sign assets"
```

### Task 2: Register and Render the New Art With Fallback

**Files:**
- Create: `tests/forest-quiz-sign-art.test.mjs`
- Modify: `art-assets.js`
- Modify: `game.js`

**Interfaces:**
- Consumes: six PNG files from Task 1 and existing `drawArtPackImage(category, key, x, y, w, h)`
- Produces: `drawQuizStandArt(kind, fallbackColor, fallbackLabel)` that draws a PNG first and calls `drawQuizStand` when unavailable

- [ ] **Step 1: Write the failing registration and rendering test**

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const art = readFileSync(new URL("../art-assets.js", import.meta.url), "utf8");
const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const files = ["math", "logic", "science", "language", "english", "riddle"];

for (const kind of files) {
  assert.ok(existsSync(new URL(`../assets/props/quiz_sign_${kind}.png`, import.meta.url)));
}
assert.match(art, /quizSignMath: "assets\/props\/quiz_sign_math\.png/);
assert.match(art, /quizSignRiddle: "assets\/props\/quiz_sign_riddle\.png/);
assert.match(game, /function drawQuizStandArt\(kind, fallbackColor, fallbackLabel\)/);
assert.match(game, /drawQuizStand\(fallbackColor, fallbackLabel\)/);
```

- [ ] **Step 2: Run the test and verify the intended failure**

Run: `node tests/forest-quiz-sign-art.test.mjs`

Expected: FAIL because the six art registrations and `drawQuizStandArt` do not exist.

- [ ] **Step 3: Register all six props in `art-assets.js`**

Add `quizSignMath`, `quizSignLogic`, `quizSignScience`, `quizSignLanguage`, `quizSignEnglish`, and `quizSignRiddle` to `window.ART_ASSETS.props` and to the art-pack `registry.props` aliases.

- [ ] **Step 4: Add the minimal image-first renderer in `game.js`**

```js
const QUIZ_SIGN_ART_KEYS = {
  math: "quizSignMath",
  logic: "quizSignLogic",
  science: "quizSignScience",
  language: "quizSignLanguage",
  english: "quizSignEnglish",
  riddle: "quizSignRiddle",
};

function drawQuizStandArt(kind, fallbackColor, fallbackLabel) {
  const artKey = QUIZ_SIGN_ART_KEYS[kind];
  if (artKey && drawArtPackImage("props", artKey, -36, -44, 72, 80)) return;
  drawQuizStand(fallbackColor, fallbackLabel);
}
```

Replace only the six existing quiz-kind branches so each calls `drawQuizStandArt` with its current fallback color and label.

- [ ] **Step 5: Run the focused test**

Run: `node tests/forest-quiz-sign-art.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit rendering integration**

```bash
git add art-assets.js game.js tests/forest-quiz-sign-art.test.mjs
git commit -m "Render quiz tasks with Forest sign art"
```

### Task 3: Regression and Browser QA

**Files:**
- Verify only; no planned production changes.

**Interfaces:**
- Consumes: completed assets and renderer
- Produces: evidence that Forest Road and existing quiz behavior still work

- [ ] **Step 1: Run focused Forest Road tests**

```bash
node tests/forest-quiz-sign-art.test.mjs
node tests/forest-road-entrance.test.mjs
node tests/forest-road-crossing-art.test.mjs
node tests/forest-road-sign-visuals.test.mjs
node tests/forest-road-quiz-bank.test.mjs
```

Expected: all commands exit successfully.

- [ ] **Step 2: Run syntax and diff checks**

```bash
node --check game.js
node --check art-assets.js
git diff --check
```

Expected: all commands exit successfully.

- [ ] **Step 3: Inspect the rendered signs in the browser**

Open Forest Road levels 17–20, wait for art preloading, and verify that each quiz task displays a transparent forest sign without a colored matte or white fringe. Confirm the browser console has no errors and that selecting a quiz still opens the existing question modal.

- [ ] **Step 4: Commit any verification-only test adjustment if required**

Do not change production behavior during this step. If no test adjustment is required, make no commit.
