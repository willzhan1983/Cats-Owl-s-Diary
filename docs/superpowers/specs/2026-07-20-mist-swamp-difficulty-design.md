# Mist Swamp Difficulty Pass Design

## Goal

Increase the challenge of all five Mist Swamp levels without changing the main game flow. The chapter remains child-friendly: mistakes create fog, delay, or a small progress rollback, but never damage the player, reset the whole level, or remove completed collection progress.

## Scope and isolation

- All new behavior is guarded by `levels[state.levelIndex]?.world === "mist_swamp"` or `isMistSwampLevel()`.
- Preserve Day 1-7, Moonlight Lake, Apple Valley, Forest Road, existing bosses, scoring settlement, and the difficulty selector.
- Keep task kinds in snake_case and item/prop keys in camelCase.
- Keep existing transparent PNG assets and Canvas fallbacks.
- Do not add a new attack system or restructure shared dispatchers.

## Level design

### 1. Mist Swamp Entrance

- Easy keeps permanent fog clearing.
- Normal, hard, and crazy keep the existing 12/8/6 second clear windows.
- A completed lamp may be relit without consuming another `fireflyCore`.
- Ruru can only complete the direction task while at least one mist lamp is currently active on normal or above.
- If the fog returns, completed collection and lamp tasks remain completed.

### 2. Firefly Trail

- Correct path points use warm gold and a stable breathing pulse.
- Decoy points use green light and only extend for a short distance; they never lead into a dead end.
- Touching a decoy increases fog slightly and rolls trail progress back by one checkpoint.
- The player is never teleported and collected spores or the bridge key are never removed.
- Easy uses stronger highlighting and no progress rollback.

### 3. Sleeping Wooden Bridge

- Preserve the existing difficulty-based plank requirement, repaired bridge behavior, frog escort, and `mistBridgeExit` safe zone.
- Easy: two arbitrary mushroom lamps may be lit for feedback, but mushrooms remain optional.
- Normal: a three-color sequence is an optional score challenge with a repeatable hint.
- Hard/crazy: the four-color sequence is required. A mistake only resets the lamp sequence and replays the hint.
- The bridge and frog remain the stable core completion path.

### 4. Mist Core

- Convert the level into three visible stages: light the three lamps, clear bubbles in the indicated glow order, then interact with the Mist Spirit.
- Only the currently indicated bubble is vulnerable; touching another bubble shows a hint and adds a small amount of fog.
- Completed lamps and bubbles remain completed.
- The Mist Spirit cannot complete before both prerequisite stages finish.

### 5. Swamp Mud Monster

- Phase 1: all three big mist lamps must be active inside the shared difficulty clear window. Completed lamps can be relit for free.
- Phase 2: mud bubbles appear in waves and move slowly. Easy/normal expose one active bubble at a time; hard/crazy expose two at a time until only one remains.
- Bubble counts stay aligned with the existing difficulty system: easy 2, normal 3, hard 4, crazy 4.
- Phase 3: the player stays near the boss to charge the firefly lantern for 1.2/2/2.5/3 seconds by difficulty, then receives the final quiz.
- A wrong quiz answer clears only the lantern charge and allows an immediate retry. It does not reset boss phases.
- The boss never directly damages the player.

## Difficulty table

| Difficulty | Fog clear | Trail | Mushroom lamps | Mud bubbles | Lantern charge |
| --- | --- | --- | --- | --- | --- |
| easy | permanent | strong correct highlight, no rollback | any two, optional | 2, very slow | 1.2 s |
| normal | 12 s | two short decoys, one-checkpoint rollback | three-color, optional bonus | 3, one active wave | 2 s |
| hard | 8 s | closer visual contrast | four-color, required | 4, up to two active | 2.5 s |
| crazy | 6 s | shorter hint pulse | four-color, required, short hint | 4, faster, up to two active | 3 s |

## State and data flow

Add Mist Swamp-only state for active lamp expiry, trail checkpoint rollback, ordered Mist Core bubbles, boss wave activation, and lantern charge progress. Reset initializes these values from the current level and selected difficulty. The existing update loop advances them only through `updateMistSwampMechanisms(dt)`.

Interaction continues through `interactMistSwampTask()`. Existing task kinds remain unchanged. Relighting a completed lamp changes its active expiry but does not call `completeTask()` again, preventing duplicate score and task counts.

## Player feedback and recovery

- Mistakes show a short Chinese hint and a visible fog or light response.
- No mistake deducts hearts, score, or inventory.
- No Mist Swamp task teleports the player.
- Re-lighting and quiz retries are always available.
- Easy mode remains completable without timing pressure.
- Level settlement continues through the existing completion and local score panel.

## Tests and acceptance

Add functional runtime tests for:

- Mist Swamp-only state and dispatch guards.
- Free relighting without duplicate task completion or item consumption.
- Decoy rollback behavior and no rollback on easy.
- Difficulty-specific mushroom requirements while preserving bridge completion.
- Ordered Mist Core bubble activation.
- Boss simultaneous-lamp gate, wave counts, lantern charge duration, and quiz retry reset.
- No advanced mechanism appearing in other worlds.

Run syntax checks for `game.js`, `world-map.js`, `mist-swamp-map-entry.js`, and `mist-swamp-quiz-bank.js`, then all `tests/*.test.mjs` and `git diff --check`. Browser-smoke all five Mist Swamp levels and verify completion settlement plus zero console errors.
