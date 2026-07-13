# Forest Quiz Signs Design

## Goal

Replace the generic canvas-drawn quiz stands with six readable Forest Road quiz-sign props. This is an art and rendering change only; quiz selection, difficulty, scoring, and completion behavior stay unchanged.

## Approved Visual Direction

Use the approved "firefly magic sign" family shown in `docs/visual-reference/forest-quiz-signs-concept.png`.

All signs share one silhouette: a deep forest-green hollow-tree plaque, warm golden vine border, a few yellow firefly lights, and a short wooden stake. The sign face contains one large subject symbol and no label text.

## Assets

| Quiz type | File | Center symbol | Accent |
| --- | --- | --- | --- |
| Math | `assets/props/quiz_sign_math.png` | `+` | golden yellow |
| Logic | `assets/props/quiz_sign_logic.png` | diamond outline | lavender purple |
| Science | `assets/props/quiz_sign_science.png` | leaf | bright green |
| Language | `assets/props/quiz_sign_language.png` | `文` | coral red |
| English | `assets/props/quiz_sign_english.png` | `ABC` | sky blue |
| Riddle | `assets/props/quiz_sign_riddle.png` | `?` | warm pink |

Each deliverable is a square lowercase English-named RGBA PNG with transparent corners, generous padding, no colored matte, no white fringe, and a consistent baseline and canvas size.

## Integration

Register all six paths in `art-assets.js`. Update quiz-task rendering in `game.js` to select the corresponding image by existing quiz kind (`math`, `logic`, `science`, `language`, `english`, `riddle`). Keep the current `drawQuizStand` implementation as fallback when an image is unavailable.

The change applies wherever those six existing quiz kinds are rendered, including Forest Road. It does not add quiz tasks or change their coordinates.

## Validation

- All six files are RGBA PNGs with transparent corners.
- Symbols remain recognizable at the current quiz-stand draw size.
- Missing or failed images still render the existing canvas fallback.
- Forest Road levels remain completable and show no console errors.
- Existing Forest Road tests, syntax checks, and `git diff --check` pass.
