# Mist Swamp Final Asset Completion Design

## Goal

Replace the remaining Mist Swamp Canvas or shared-art placeholders with dedicated,
game-ready transparent PNG files, then verify the full five-level chapter and
publish the completed branch for review.

## Scope

Add these eight dedicated assets:

- `assets/items/firefly_core.png`
- `assets/items/glow_spore.png`
- `assets/items/bridge_plank.png`
- `assets/items/bridge_key.png`
- `assets/props/mist_lamp.png`
- `assets/effects/mud_bubble.png`
- `assets/effects/mud_core.png`
- `assets/items/mist_guardian_badge.png`

Existing dedicated backgrounds, NPCs, mushrooms, broken bridge, soft mud, big
mist lamp, light spore, firefly lantern, mist badge, and dark mist bubble remain
unchanged.

## Visual Direction

- Match the existing Mist Swamp painterly children's-game style.
- Keep shapes rounded, friendly, bright enough to read through the fog, and not
  frightening.
- Use one centered object per image, no text, no frame, no shadow baked onto a
  solid background, and no white outline.
- Final files must be lowercase English filenames, 512 x 512 RGBA PNGs with
  genuinely transparent corners.
- Use Image Gen for new art and Adobe background removal for clean alpha edges.
  Do not crop objects out of a combined concept sheet.

## Integration

- Register all eight files in `art-assets.js`.
- Add item, prop, or effect keys and drawing bounds in `game.js`.
- Use `mistLamp` only for normal Mist Swamp lamp tasks; keep `bigMistLamp`
  unchanged.
- Render `mudBubble` during Boss phase 2 and `mudCore` during Boss phase 3.
- Render `mistGuardianBadge` as the final Boss reward icon.
- Preserve every current Canvas fallback so a missing image cannot blank the
  scene.
- Guard all new runtime paths with `level.world === "mist_swamp"` or the existing
  `isMistSwampLevel()` helper.
- Do not change progression, difficulty, rewards, settlement, or other worlds.

## Verification

- Add automated checks for file existence, 512 x 512 RGBA format, transparent
  corners, registration, and guarded render paths.
- Run syntax checks for all Mist Swamp entry and quiz scripts.
- Run `node --test tests/*.test.mjs` and `git diff --check`.
- Open all five Mist Swamp levels in the browser and confirm the new objects load,
  the chapter remains completable, the score panel still opens, and console
  errors/warnings are zero.
- Confirm the revised quiz rotation remains non-repeating on all four difficulty
  modes.
- Push the finished branch and create or update the matching pull request only
  after every check passes.
