# Open Source Game Code Pattern Research

Project context: Cats & Owl's Diary is already a playable HTML5 Canvas game. This research is for safe future reference only. Do not migrate the game to a new engine, do not rewrite `game.js`, and do not change gameplay from this document alone.

## Summary Recommendation

Use small, self-contained patterns first:

- Save/load: use a tiny project-owned `localStorage` wrapper inspired by Store.js and MDN, not a full storage dependency unless compatibility issues appear.
- Inventory: keep it as plain data in the existing game state, inspired by QuestJS item naming and state separation.
- Tasks: continue moving toward data-driven task definitions, using QuestJS as a reference only.
- Sprite animation: use a small state-machine helper inspired by Kontra.js or Sprite.js, but keep it outside `drawPlayer` until tested behind a flag.
- Audio: Howler.js is the safest direct dependency candidate if background music and sound effects become important.
- Camera/scene helpers: reference Kontra.js, LittleJS, Excalibur, KAPLAY, and Phaser concepts only. Do not migrate the game loop.

## Candidate Review

| Project | URL | License | Useful part | Safe to reuse? | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Store.js | https://github.com/marcuswestin/store.js | MIT | Small key/value storage API over localStorage with fallback concepts. Useful for save slots, versioned save payloads, and safe clear/remove behavior. | Yes, but direct dependency is probably unnecessary for this game. Use ideas, not library, unless browser compatibility becomes painful. | Reference only |
| MDN Web Storage API | https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage | MDN content license; browser API itself is native | Baseline behavior of `window.localStorage`, saved across browser sessions. Useful for designing a minimal save/load module. | Use the browser API directly. Do not copy tutorial code verbatim unless license/attribution is handled. | Use native API |
| QuestJS | https://github.com/ThePix/QuestJS | MIT | Browser-based JavaScript adventure structure, including rooms, items, and game state concepts. Useful for thinking about inventory and task data. | Safe license, but it is a text-adventure engine and should not be imported into the Canvas game. | Reference only |
| Kontra.js | https://github.com/straker/kontra | MIT | Lightweight JS game micro-library. Useful references: sprite sheets, animations, update/render separation, small game-loop helpers. | Safe license. Do not import wholesale; borrow small architecture ideas only. | Reference only |
| Kontra Animation docs | https://straker.github.io/kontra/api/animation | MIT project docs/source | Animation object pattern: sprite sheet frames plus frame rate. Useful for Mimi/Owlly animation planning later. | Safe as reference. Any copied code should retain MIT attribution if used. | Reference only |
| Sprite.js / Canvas-Sprite-Animations | https://github.com/IceCreamYou/Canvas-Sprite-Animations | MIT | Very focused HTML5 Canvas sprite animation helper with `SpriteMap` and `Sprite` concepts. Good model for a small animation-state helper. | Safe license. Watch demo image attribution; do not reuse Atari demo asset. | Reference only |
| Howler.js | https://github.com/goldfire/howler.js | MIT | Robust audio wrapper that defaults to Web Audio and falls back to HTML5 Audio. Useful for music layers, mute/unmute, volume, and mobile-safe playback. | Safe to use as a dependency if audio becomes a dedicated PR. Keep it isolated in `audio-system.js`. | Use |
| LittleJS | https://github.com/KilledByAPixel/LittleJS | MIT | Tiny HTML5 engine with clean examples for input, sound, rendering, particles, and camera-like world helpers. | Safe license, but too large to integrate into this existing game. | Reference only |
| Excalibur.js | https://github.com/excaliburjs/Excalibur | BSD-2-Clause | Scene, camera, actor, animation, and loader patterns. Helpful for naming and system boundaries. | Safe license, but it is a full engine and would be overkill. | Reference only |
| KAPLAY | https://github.com/kaplayjs/kaplay | MIT | Component-style objects, tags, scenes, collision callbacks, and examples. Useful for future data organization ideas. | Safe license, but it expects its own runtime style and bundler workflow. | Reference only |
| Phaser | https://github.com/phaserjs/phaser | MIT | Mature examples for scenes, cameras, animations, audio, loaders, and mobile input. Good for comparison when designing small helpers. | Safe license, but direct migration/import would violate current stability goals. | Avoid for direct reuse |

## Pattern Notes For This Project

### 1. localStorage Save/Load

Safe shape for a future PR:

- New file only, for example `save-system.js`.
- Keep a versioned save key, such as `cats-owls-diary-save-v1`.
- Store only plain JSON: level index, score, hearts, collected item counts, completed task IDs, selected character, and settings.
- Validate loaded data before applying it to state.
- Add a reset-save function that only removes this game's key.
- Do not save images, DOM nodes, timers, canvas context, or live function references.

Recommendation: implement directly with native `localStorage`, using Store.js only as a reference for API shape and fallback thinking.

### 2. Lightweight Inventory

Safe shape for a future PR:

- Keep inventory as a plain object like `{ apple: 2, pencil: 1 }`.
- Add small helper functions: `addItem(type, amount)`, `hasItem(type, amount)`, `removeItem(type, amount)`.
- Keep item display names in a data table, separate from counts.
- Do not change collection collision or task completion in the same PR.

Recommendation: use the existing game item types first. Do not invent new items until the inventory is stable.

### 3. Data-Driven Task System

Safe shape for a future PR:

- Define tasks as data with `id`, `name`, `npc`, `requires`, `reward`, `dialogue`, and `completeWhen`.
- Keep the current task execution logic intact initially.
- Add a migration layer that converts old level task entries into the new shape.
- Store completed task IDs in save data.

Recommendation: reference QuestJS for separation of world data and logic, but keep the project-specific Canvas task flow.

### 4. Sprite Animation State Machine

Safe shape for a future PR:

- Do not modify `drawPlayer` first.
- Create a helper that can answer: current frame rectangle, current animation key, elapsed frame time.
- Start with NPC or item sparkle animation before Mimi/Owlly.
- Use feature flags and fallback to current drawing when a spritesheet is missing.

Recommendation: reference Kontra.js and Sprite.js; build a tiny helper tailored to this project.

### 5. Safe Audio System

Safe shape for a future PR:

- New file only, for example `audio-system.js`.
- Start muted or wait for the first user interaction before playing.
- Provide `playMusic(sceneKey)`, `playSfx(key)`, `setMuted(value)`, and `setVolume(value)`.
- Save mute/volume settings in localStorage separately from progress.
- If using Howler.js, load it as an explicit dependency and keep all calls inside the audio module.

Recommendation: use Howler.js when ready for audio polish. For one or two simple sounds, vanilla Web Audio is also acceptable.

### 6. Canvas Camera / Scene Helper

Safe shape for a future PR:

- Keep the existing canvas size and draw loop.
- Add a small camera object only if levels become wider than the viewport.
- Use `ctx.save()`, `ctx.translate(-camera.x, -camera.y)`, draw world objects, then `ctx.restore()`.
- Keep UI drawing outside the camera transform.
- Clamp camera to scene bounds.

Recommendation: reference Kontra.js, LittleJS, Excalibur, KAPLAY, and Phaser camera concepts, but build a tiny helper only when the current levels need scrolling.

## Avoid List

- GPL-licensed examples for direct reuse.
- Unlicensed GitHub snippets.
- Stack Overflow code unless attribution and license handling are explicitly added.
- Full engine migration to Phaser, Excalibur, KAPLAY, LittleJS, or Kontra.
- Runtime patching scripts such as `game-loader.js`.

## Next Safe PR Order

1. Add `save-system.js` with versioned localStorage save/load and no gameplay changes.
2. Add `inventory-system.js` helpers and tests/manual console checks.
3. Convert one level's tasks to data-driven definitions behind a compatibility layer.
4. Add a small sprite animation helper for non-player objects first.
5. Add `audio-system.js` with Howler.js or vanilla Web Audio.
6. Add camera helper only if a level becomes wider than the current canvas.
