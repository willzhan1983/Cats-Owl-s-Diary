# Acorn Town Chapter Design

## Goal

Add a complete four-level `acorn_town` chapter after Forest Road. The chapter uses one child-readable central plaza, a warm autumn acorn storybook style, difficulty-aware multi-step tasks, and one randomized fourth-grade quiz at the end of each level.

Completing the fourth level unlocks Riverside Dock.

## Confirmed Direction

- Chapter structure: four independent levels following the existing world/level model.
- Map layout: one central plaza shared by all four levels.
- Visual style: warm autumn acorn storybook.
- Core tasks: mail delivery, lost-acorn search, market trading, and notice-board route finding.
- Difficulty: task complexity, distractors, timing, and penalties scale with the existing difficulty setting.
- Quiz rule: the chapter-ending quiz must be answered correctly before a level completes.
- Art workflow: Image Gen creates new background and prop art; Codex only organizes, validates, and integrates the resulting files.

## Non-Goals

- Do not refactor unrelated worlds or the core level engine.
- Do not create a continuous open-world hub.
- Do not create four nearly identical town backgrounds.
- Do not redraw existing Ruru, Coco, or Owlly assets.
- Do not remove current Canvas/image fallbacks.
- Do not unlock or implement Riverside Dock gameplay in this chapter.

## World and Level Flow

The world id is `acorn_town`. The chapter is unlocked after Forest Road and contains these levels in order:

1. `橡果镇邮局`
2. `寻找丢失的橡果`
3. `橡果集市兑换`
4. `小镇公告板`

Each level follows the same completion flow:

1. Load the shared plaza background and level-specific NPCs, props, obstacles, and task data.
2. Read the active difficulty profile and instantiate the matching task counts, distractors, timer, and penalties.
3. Complete every non-quiz task.
4. Activate one randomized Acorn Town quiz task for the selected difficulty.
5. Answer correctly to complete the level and save progression.
6. Unlock the next Acorn Town level; level four unlocks Riverside Dock.

The quiz remains visibly unavailable until all non-quiz tasks are complete. Approaching it early shows a short instruction to finish the town tasks first.

## Shared Scene Layout

All four levels use `assets/bg/acorn_town_plaza.png`.

The background is a 1672 x 941 PNG containing:

- a broad central plaza and readable walking route;
- the post office in the upper-left area;
- the market in the upper-right area;
- acorn trees and a collection area in the lower-left area;
- the notice-board area and Riverside Dock exit in the lower-right area;
- clear empty ground around all interactive targets;
- no UI, baked-in task props, characters, or Chinese text.

Different NPC placement, interactive props, obstacles, and open areas distinguish the levels without changing the base background.

## Level Design

### 1. 橡果镇邮局

Ruru asks the player to deliver letters around the plaza.

- Normal baseline: collect and deliver three letters using recipient portrait and color hints.
- Crazy maximum: deliver five letters while avoiding similar recipients, two decoy mailboxes, and moving town carts.
- A letter only completes when delivered to its matching recipient.
- A wrong delivery returns the letter to inventory so the level cannot deadlock.
- Hard and Crazy wrong deliveries subtract time according to the difficulty table.

Reward: `邮差徽章`.

### 2. 寻找丢失的橡果

Coco asks the player to recover acorns and return them to the acorn basket.

- Normal baseline: find six acorns; two require clearing leaf piles first.
- Crazy maximum: find ten acorns, ignore three visual decoys, and clear three blocking props.
- Decoys provide a clear “这不是真橡果” response and never enter inventory.
- The basket accepts only real acorns.

Reward: `橡果 x5`.

### 3. 橡果集市兑换

Coco runs a market stall where the player completes resource orders.

- Normal baseline: complete two visible orders using acorns and existing red/green apples.
- Crazy maximum: complete three sequential orders, track remaining inventory, and choose the correct exchange.
- The order card always shows the required quantities.
- A wrong exchange returns all offered items; Hard and Crazy subtract time.
- Completing all orders awards one travel star.

Reward: `旅行星星`.

### 4. 小镇公告板

Owlly asks the player to repair the board and identify the route to Riverside Dock.

- Normal baseline: collect four valid fragments, place them in order, read the route clue, and choose the dock exit.
- Crazy maximum: six fragments are visible, two are decoys, the route clue must be remembered, and moving carts obstruct the path to three possible exits.
- A decoy fragment never occupies a valid board slot.
- A wrong exit returns the player to the plaza; Hard and Crazy subtract time.
- The correct exit completes the chapter and unlocks Riverside Dock.

Reward: `解锁河畔码头`.

## Difficulty Profiles

The approved Normal and Crazy designs are the chapter baselines. Existing Easy and Hard modes interpolate between them so the chapter remains compatible with the current four-difficulty system.

| Difficulty | Task scaling | Hints and distractors | Wrong-action penalty |
| --- | --- | --- | --- |
| Easy | Normal task counts | Persistent hints, no decoy mailboxes or fake fragments | 0 seconds |
| Normal | Approved Normal counts | Full initial hints, low obstacle count | 0 seconds |
| Hard | Intermediate counts and obstacles | One or two distractors, route hint remains visible | 3 seconds |
| Crazy | Approved Crazy counts | Maximum distractors, moving obstacles, memory route | 5 seconds |

Exact task scaling:

| Level | Easy | Normal | Hard | Crazy |
| --- | --- | --- | --- | --- |
| 橡果镇邮局 | 3 letters, 0 decoy mailboxes, 0 carts | 3 letters, 0 decoy mailboxes, 1 cart | 4 letters, 1 decoy mailbox, 1 cart | 5 letters, 2 decoy mailboxes, 2 carts |
| 寻找丢失的橡果 | 6 real acorns, 0 decoys, 1 leaf pile | 6 real acorns, 0 decoys, 2 leaf piles | 8 real acorns, 2 decoys, 2 blockers | 10 real acorns, 3 decoys, 3 blockers |
| 橡果集市兑换 | Orders A and B, 0 carts | Orders A and B, 1 cart | Orders A, B, and C, 1 cart | Orders A, B, and C, 2 carts |
| 小镇公告板 | 4 valid fragments, 0 decoys, pinned route hint, 0 carts | 4 valid fragments, 0 decoys, board route hint, 1 cart | 4 valid fragments, 1 decoy, persistent board hint, 1 cart | 4 valid fragments, 2 decoys, memory-only route, 2 carts |

The market recipes are fixed:

- Order A: two acorns and one red apple.
- Order B: three acorns and one green apple.
- Order C: two acorns, one red apple, and one green apple.

Level timers:

| Level | Easy | Normal | Hard | Crazy |
| --- | ---: | ---: | ---: | ---: |
| 橡果镇邮局 | 130 s | 110 s | 95 s | 80 s |
| 寻找丢失的橡果 | 140 s | 120 s | 105 s | 90 s |
| 橡果集市兑换 | 145 s | 125 s | 110 s | 95 s |
| 小镇公告板 | 150 s | 130 s | 115 s | 100 s |

Moving-obstacle collision uses the same penalty as other wrong actions and has a one-second cooldown to prevent repeated instant deductions.

## Quiz Design

Add `acorn-town-quiz-bank.js` using the existing shared randomized quiz pattern.

- Key: `acornTownShared`.
- Total: 24 questions.
- Distribution: six each for `easy`, `normal`, `hard`, and `crazy`.
- Topics: fourth-grade arithmetic, reading order instructions, English words used in the town, logical matching, inventory counting, and safe route choices.
- Each question has four options and one explicit answer index.
- Each level receives one Acorn Town quiz task.
- The selected quiz must match the active difficulty. Selection follows the current quiz randomizer, so a later level or restart may draw a previously seen question.

## Assets

### New background

- `assets/bg/acorn_town_plaza.png`

### New transparent props and items

- `assets/props/acorn_postbox.png`
- `assets/items/acorn_letter.png`
- `assets/items/acorn.png`
- `assets/items/fake_acorn.png`
- `assets/items/acorn_basket.png`
- `assets/props/acorn_exchange_stall.png`
- `assets/props/acorn_order_board.png`
- `assets/items/travel_star.png`
- `assets/props/acorn_notice_board_broken.png`
- `assets/props/acorn_notice_board_repaired.png`
- `assets/items/acorn_notice_fragment.png`
- `assets/props/acorn_town_cart.png`
- `assets/props/riverside_dock_sign.png`

All new prop/item files use lowercase English names, transparent RGBA PNG, complete silhouettes, clean edges, and consistent scale within their category. They contain no embedded text. The background is opaque; props and items are transparent.

Existing Ruru, Coco, Owlly, red-apple, and green-apple assets are reused.

## Code Structure

- `game.js`
  - Register the shared Acorn Town background and prop/item paths with fallbacks.
  - Add four `acorn_town` level definitions.
  - Add only the task behavior needed for market trading, notice-fragment distractors, difficulty profiles, wrong-action penalties, moving carts, and end-of-level quiz gating.
  - Map the four new level indices to `WORLD_MAP.acorn_town.levels`.
- `acorn-town-map-entry.js`
  - Follow the Apple Valley and Forest Road entry-file pattern.
  - Enter the first Acorn Town level from the world map.
  - Respect stored progression and prevent entry before Forest Road completion.
- `acorn-town-quiz-bank.js`
  - Register the 24-question pool.
  - Inject exactly one gated quiz task into each Acorn Town level.
- `index.html`
  - Load the map-entry and quiz-bank scripts after their existing dependencies.
- `world-map.js`
  - Keep the current Acorn Town story metadata.
  - Update runtime level/unlock data only where needed for the implemented chapter.

Task definitions remain data-driven. Difficulty selection changes configuration values at reset time rather than duplicating four copies of each level.

## Failure and Recovery Behavior

- Missing images use existing Canvas or alternate-image fallbacks; a missing asset must never produce a blank screen.
- Wrong delivery, exchange, fragment, or exit actions display a specific message.
- Items rejected by a target return to the player or remain collectible.
- Moving obstacles cannot remove inventory or permanently trap the player.
- Timer expiration uses the existing fail/restart flow.
- Restarting a level restores its task data, distractors, timer, inventory, and quiz state.
- Completed-world progression is saved through the current persistence mechanism.

## Verification

Automated checks must cover:

- Acorn Town has exactly four ordered levels.
- The world-map entry unlocks only after Forest Road completion.
- Easy, Normal, Hard, and Crazy resolve to the specified timers, counts, distractors, and penalties.
- Each level receives exactly one gated Acorn Town quiz task.
- The question bank contains six valid questions per difficulty.
- Wrong deliveries and exchanges return items without deadlocking.
- Decoy acorns and notice fragments cannot satisfy valid objectives.
- The fourth level unlocks Riverside Dock.
- Every declared asset path exists, and every new prop/item PNG has an alpha channel.

Manual browser verification must include:

- complete Normal play-through of all four levels;
- complete Crazy play-through of all four levels;
- one wrong-action recovery check per level;
- timer-failure and restart checks;
- background and transparent-prop rendering;
- no console errors and no blank-screen fallback failures;
- world-map transition from Forest Road to Acorn Town and from Acorn Town to Riverside Dock.

## Acceptance Criteria

The chapter is complete when:

- all four Acorn Town levels are playable and ordered correctly;
- the central plaza is readable and uses the confirmed warm autumn style;
- difficulty changes both cognitive and operational challenge;
- the final fourth-grade quiz is required and difficulty-matched;
- every new game prop is a transparent, directly usable PNG;
- all automated and manual verification above passes;
- existing Forest Road and earlier chapters still work.
