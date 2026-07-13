# Apple Valley Grounding Experiment Design

## Goal

Reduce the floating appearance of Apple Valley props and NPCs while preserving a small visual animation and all existing gameplay behavior.

## Scope

- Apply only to the four `apple_valley` levels.
- Keep collectible movement at 1-2 pixels instead of the current 5 pixels.
- Keep ground shadows fixed while the visible sprite moves slightly.
- Add fixed ground shadows below Apple Valley task NPCs, baskets, quiz signs, and the cart station.
- Draw Apple Valley NPC, cart, and apple tree PNGs from their visible alpha bounds and align their visible bottom edge to the intended ground baseline.
- Preserve all task, collectible, obstacle, and interaction coordinates.

## Non-Goals

- No changes to Day 1-7, Moonlight Lake, Forest Road, scoring, quizzes, timers, task counts, or world-map routing.
- No asset generation or image editing.
- No global grounding behavior until the Apple Valley experiment is visually approved.

## Rendering Rules

1. Apple Valley collectibles use a maximum bob amplitude of `1.5` pixels. Other worlds retain their existing animation.
2. The collectible shadow is drawn at the fixed item coordinate before the sprite bob is applied.
3. Apple Valley tasks draw a fixed ellipse shadow at the bottom of the rendered NPC or prop bounds. The task sprite may retain a subtle idle movement of at most `1` pixel.
4. Apple Valley NPC and apple-tree images use trimmed transparent bounds and bottom alignment. Fallback drawings remain available when an image is unavailable.
5. Interaction calculations continue using the existing task and item coordinates.

## Validation

- Add a focused regression test for the Apple Valley-only grounding rules.
- Run all existing `tests/*.mjs` files and JavaScript syntax checks.
- Visually inspect levels 13-16 in the browser with no relevant console errors.
- Confirm at least one collectible and one task remain interactable after the visual-only adjustment.
