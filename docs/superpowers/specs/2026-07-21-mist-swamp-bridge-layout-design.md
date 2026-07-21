# Mist Swamp Sleeping Bridge Layout Design

## Goal

Make the Mist Swamp level `沉睡木桥` look more natural and add a safe spatial-memory challenge on hard and crazy difficulties. Keep the existing level flow, task kinds, rewards, difficulty system, and settlement behavior unchanged.

## Scope

- Run all new behavior only when `levels[state.levelIndex]?.world === "mist_swamp"` and the level name is `沉睡木桥`.
- Do not change Day 1-7, Moonlight Lake, Apple Valley, Forest Road, other Mist Swamp levels, existing bosses, or the score settlement panel.
- Reuse the existing transparent PNG assets and Canvas fallbacks.
- Do not add a new task kind or restructure the shared interaction flow.

## Bridge placement

- Move the `broken_bridge` interaction anchor and its prop drawing anchor to the visible center of the cracked bridge deck.
- Use the same anchor before and after repair so the repaired bridge does not jump or float away from the background bridge.
- Keep the repair anchor outside the frog exit safe zone and away from collectible plank positions.
- Preserve the existing difficulty-based plank requirement and repair message.

## Mushroom lamp placement

- Easy and normal keep deterministic lamp positions.
- Hard and crazy choose four unique positions from a fixed pool of reachable, hand-checked safe anchors each time the level resets.
- The safe pool must keep lamps away from the bridge repair anchor, the three plank collectibles, the frog start, and `mistBridgeExit`.
- Selected lamp anchors must maintain enough spacing to avoid overlapping art and interaction radii.
- Only positions change. The required interaction order remains `yellow → blue → purple → green`.
- A wrong choice keeps the current child-friendly behavior: reset only the lamp sequence, replay the color hint, and apply no score, health, inventory, or position penalty.

## Interaction priority and feedback

- In `沉睡木桥`, an unfinished mushroom lamp takes interaction priority over an already completed frog when both are nearby.
- Hard and crazy show the instruction `观察灯的位置，按黄 → 蓝 → 紫 → 绿点亮。`.
- The existing completion path remains: collect planks, repair the bridge, complete the required lamp challenge for the selected difficulty, and escort the frog to the exit.

## Tests and acceptance

Add functional runtime coverage that verifies:

- Easy and normal keep fixed lamp positions.
- Hard and crazy produce four unique positions drawn from the safe pool across repeated resets.
- Every randomized layout preserves the fixed color order and minimum spacing.
- Lamps do not overlap the bridge anchor, plank collectibles, frog start, or exit safe zone.
- The bridge prop and interaction use the new aligned anchor.
- An unfinished lamp wins interaction priority over the completed frog.
- Easy, normal, hard, and crazy can still complete the level and open the normal settlement panel.
- No new behavior runs outside `mist_swamp` / `沉睡木桥`.

Run the existing syntax checks, `node --test tests/*.test.mjs`, `git diff --check`, and a browser smoke test of `沉睡木桥` with zero console errors.
