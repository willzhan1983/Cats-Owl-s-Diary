# Mist Swamp Missing Art and Layout Design

## Scope

Complete the remaining Mist Swamp presentation without changing progression,
difficulty, rewards, settlement, or any existing chapter behavior.

## New transparent assets

- `assets/props/broken_bridge.png`
- `assets/obstacles/soft_mud.png`
- `assets/props/mushroom_lamp_yellow.png`
- `assets/props/mushroom_lamp_blue.png`
- `assets/props/mushroom_lamp_purple.png`
- `assets/props/mushroom_lamp_green.png`

Every file must be a lowercase English-named 512 x 512 RGBA PNG with genuinely
transparent corners. Canvas fallbacks remain available.

## Rendering

- Register the six assets in `art-assets.js`.
- Use color-specific mushroom art for Mist Swamp mushroom tasks.
- Use the broken bridge art for `broken_bridge`.
- Use the soft mud art for `softMud` obstacles.
- Display the existing mud core asset during Boss phase 3.

## Layout

- Level 2: add decorative `swampSnail` at x 840, y 180, scale 0.82.
- Level 3: mushroom lamps at x 300, 450, 600, 800 and y 150.
- Level 4 spores: (180,390), (480,420), (820,390).
- Level 5 spores: (190,390), (450,410), (690,390).

All new behavior and decoration must remain guarded to `world === "mist_swamp"`.

