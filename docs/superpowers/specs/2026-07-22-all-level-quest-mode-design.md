# All-Level Quest Mode Design

## Goal

Extend the proven Mist Swamp quest flow to the rest of Cats & Owl's Diary so children always know who gives the mission, what to do next, where to turn it in, and when the score settlement is complete.

The player flow is:

`find the main NPC -> accept the quest -> follow visible objectives -> finish the existing gameplay -> return to the NPC -> turn in -> open the existing score settlement`

The implementation must preserve existing task mechanics, rewards, difficulty behavior, world-map routing, bosses, and settlement records.

## Scope

- Apply quest mode to 24 of the current 25 levels.
- Keep `森林课堂挑战` (Day 4) as the existing direct-answer level with no mandatory quest acceptance.
- Keep the five Mist Swamp levels behaviorally unchanged and compatible with their existing `mistQuest` configuration.
- Add lightweight quest configuration to Day 1-3, Day 5-7, Moonlight Lake, Apple Valley, and Forest Road.
- Reuse the current dialogue panel, interaction key, objective card, inventory, task state, rewards, difficulty system, and score settlement panel.
- Do not refactor the main gameplay loop or rewrite existing task kinds.
- Do not generate new art. Newly required guide NPCs must reuse registered transparent PNG assets with Canvas fallbacks.

## Quest state and player flow

Each participating level uses four quest states:

1. `locked`: the player has not accepted the quest.
2. `active`: the quest has been accepted and existing tasks may progress.
3. `ready`: all required existing gameplay tasks are complete and the player should return to the main NPC.
4. `settled`: completion dialogue has run and the normal score settlement may open.

Quest state remains separate from `task.done`. Existing tasks, inventory, boss phase state, rewards, and quiz results remain the only gameplay sources of truth.

Collectibles remain available while the quest is locked. Any item collected before acceptance remains in the inventory and immediately counts after acceptance. Task delivery, action tasks, escort completion, route mechanisms, sorting, road work, quizzes, and bosses cannot advance until the quest is active. Day 4 is exempt from this gate.

## Compatibility architecture

Use a small adapter rather than renaming the existing Mist Swamp system or creating chapter-specific copies.

- Existing Mist Swamp levels retain `mistQuest`.
- Other participating levels receive a `quest` configuration.
- A current-quest adapter reads `level.quest || level.mistQuest`.
- Shared quest helpers derive the mutable runtime state, dialogue mode, objective rows, current hint, NPC marker, readiness, turn-in, and settlement gate.
- Mist Swamp-only mechanics and difficulty branches remain guarded by `world === "mist_swamp"`.
- Existing non-quest task dispatch conditions remain unchanged; the adapter only adds an active-quest guard before progression and a settled-quest guard before final settlement.

Internal Mist Swamp DOM ids and CSS names may remain unchanged when renaming them would add risk. Visible copy must be chapter-neutral outside Mist Swamp.

## Level configuration

Each participating non-Mist level receives a small `quest` object:

```js
quest: {
  npcAnimal: "rabbit",
  introLines: ["..."],
  activeHint: "...",
  readyHint: "...",
  completeLines: ["..."],
  objectiveLabels: ["..."],
}
```

The quest NPC normally reuses an existing task. When a level has no suitable NPC, the configuration adds one optional `quest_giver` task. A `quest_giver`:

- is interactable and reachable;
- displays quest state markers;
- is excluded from required task counts, points, rewards, and settlement conditions;
- cannot complete itself as gameplay progress;
- uses an existing registered NPC renderer and Canvas fallback.

## Main NPC mapping

| Chapter / level | Main quest NPC | Source |
| --- | --- | --- |
| Day 1 `早晨上学路` | 兔老师 | existing `delivery` task |
| Day 2 `课间森林` | 蚂蚁 | existing `delivery` task |
| Day 3 `城市道路大冒险` | 猫头鹰校长 | existing `delivery` task |
| Day 4 `森林课堂挑战` | none | direct-answer exception |
| Day 5 `池塘勇气准备` | 刺猬同学 | existing `delivery` task |
| Day 6 `湿地跳跳路` | 跳跳兔 | existing `delivery` task |
| Day 7 `沼泽大 Boss` | 猫头鹰校长 | new optional `quest_giver`; Black Bear branch unchanged |
| `月光湖岸` | 水獭邮差 | existing `delivery` task |
| `湖心浮岛` | 小海龟 | existing `delivery` task |
| `水底花园` | 小海龟 | existing `delivery` task |
| `深海遗迹` | 章鱼博士 | existing `delivery` task |
| `尼斯湖怪巢穴` | 尼斯湖怪 | existing quiz/boss NPC anchor |
| `苹果谷入口` | Coco 小松鼠 | existing `delivery` task |
| `丰收果园` | 果园鼹鼠 | existing `delivery` task |
| `果篮整理站` | 小鸟邮差 | new optional `quest_giver` |
| `送给猫头鹰校长` | 猫头鹰校长 | existing `delivery` task |
| `森林公路入口` | 小海狸工程师 | new optional `quest_giver` |
| `弯弯森林小路` | 小海狸工程师 | new optional `quest_giver` |
| `护送小动物过路` | Nono 小刺猬 | existing `escort_npc` task |
| `橡果镇路口` | Coco 小松鼠 | existing `escort_npc` task |
| Mist Swamp five levels | existing approved NPC mapping | existing `mistQuest` anchors |

New guide NPC coordinates must be inside the playable safe area, clear of collectibles, task interaction radii, obstacles, exits, and the quest card.

## Dialogue behavior

Reuse the existing dialogue panel and interaction controls. Participating levels support:

- `quest_intro`: explains the story and ends with `接受任务`.
- `quest_active`: repeats current progress and the exact next action.
- `quest_ready`: provides completion dialogue and a `完成任务` action.
- `quest_after`: gives a short friendly response without another reward or settlement.

Existing NPC dialogue and quiz behavior remains available after the quest is accepted. When one NPC is both the quest anchor and a gameplay task, quest-state interaction takes priority only while locked or ready; during active play its existing task behavior remains authoritative.

Quest markers use the existing Canvas fallback:

- yellow `!`: available;
- gray `...`: active;
- gold `?`: ready to turn in;
- green check: settled.

## Objective card and guidance

Reuse the current Mist Swamp objective card as the shared quest card. It shows:

- NPC name and quest stage;
- up to three current objective rows;
- progress such as `红苹果 2/3`;
- one explicit next action;
- `查看下一步` on Easy;
- the guarded direct-turn-in fallback when eligible.

Hints must name the target and action. Prefer `去找小海狸工程师接任务`, `靠近破损路牌按 E`, or `回到水獭邮差身边完成任务` over generic text such as `继续探索`.

When more than three objectives exist, show unfinished objectives first. Boss levels show the current phase instead of listing every future phase. The card hides during dialogue, quiz, storybook, and score panels. Per-level compact styling prevents it from covering important props or NPCs on desktop and mobile.

## Gameplay and settlement gating

- Collecting items is allowed while locked.
- All task interactions and automatic task progress require `active`, except Day 4.
- Existing required tasks determine when gameplay is complete.
- Optional tasks, `quest_giver`, decorations, and already-excluded shared tasks never block readiness.
- When gameplay completes, set the quest to `ready` instead of opening settlement.
- Completed tasks, boss phases, inventory, escort positions, and route state remain unchanged while waiting for turn-in.
- Turn-in changes the quest to `settled`, applies existing rewards exactly once, and invokes the current settlement flow.
- Repeated dialogue after settlement cannot grant rewards, points, or score records again.

Boss compatibility rules:

- Black Bear receives only an Owl Principal quest wrapper; attack, health, shockwave, item use, completion, and reward branches are unchanged.
- Nessie continues to use its existing quiz and moon-boss mechanics; quest dialogue wraps the start and final turn-in.
- Mud Monster keeps its existing three phases, temporary-item safeguards, and reward behavior.

## Anti-stuck behavior

- Pre-collected items are never removed when a quest is accepted.
- An NPC already used or completed as a gameplay task remains interactable for turn-in.
- Escort NPCs turn in at their final safe-zone position rather than their start position.
- Boss turn-in anchors remain at a reachable position after completion.
- The direct-turn-in fallback appears only after all required gameplay is complete and the quest has remained ready for ten seconds.
- Easy exposes the fallback directly; other difficulties retain NPC turn-in unless an existing unrecoverable anchor condition is detected.
- The fallback runs the same guarded turn-in function and cannot bypass unfinished gameplay.
- Timer expiry does not erase completed objective progress while waiting for turn-in.

## Difficulty behavior

Quest acceptance and turn-in requirements are consistent across difficulties. Existing per-level difficulty changes remain unchanged.

- Easy: clearest hints, `查看下一步`, and ready-state fallback.
- Normal: persistent objectives and standard guidance.
- Hard/Crazy: existing timers, hazards, randomized layouts, boss counts, and phase requirements remain authoritative.

Quest mode must not make hard or crazy mechanics optional.

## Validation

Functional tests must verify:

- 24 participating levels transition `locked -> active -> ready -> settled`.
- Day 4 remains direct-answer and has no mandatory quest state.
- Every participating level resolves one reachable main NPC.
- New `quest_giver` tasks exist only in the four approved levels and are never required tasks.
- Collectibles picked up before acceptance remain and count after acceptance.
- Delivery, action, quiz, escort, sorting, road, route, and boss tasks do not progress while locked.
- Existing task kinds and task counts are not changed by quest configuration.
- Ready state waits for turn-in before score settlement.
- Rewards, points, and local score records occur only once.
- Escort turn-in uses the final safe zone.
- Black Bear, Nessie, and Mud Monster mechanics remain behaviorally unchanged.
- Easy, Normal, Hard, and Crazy can complete and settle representative levels from every chapter.
- Existing Mist Swamp quest tests continue passing without relaxed assertions.

Run:

```bash
node --check game.js
node --check world-map.js
node --check mist-swamp-map-entry.js
node --check mist-swamp-quiz-bank.js
node --test tests/*.test.mjs
git diff --check
```

Browser smoke-test at least one delivery level, one action-heavy level, one escort level, one sorting level, and all three existing boss families. Verify acceptance, visible progress, return guidance, turn-in, single settlement, mobile card placement, and zero console errors.

## Delivery strategy

Implement in two reviewable changes if the runtime diff becomes large:

1. Generic quest adapter, dialogue/HUD reuse, Day 1-7 excluding Day 4, and regression tests.
2. Moonlight Lake, Apple Valley, Forest Road configurations, guide NPCs, boss wrappers, and chapter smoke tests.

Both changes must keep the game playable and settle normally on their own. Do not open a PR until the complete requested all-level behavior has passed the full automated and browser validation suite.
