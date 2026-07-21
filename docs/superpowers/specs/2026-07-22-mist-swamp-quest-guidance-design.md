# Mist Swamp Quest Guidance Design

## Goal

Make all five Mist Swamp levels understandable without changing their core mechanics. Players should meet one main NPC, accept the level quest, see clear step-by-step guidance, finish the existing objectives, return to the NPC, receive the existing reward, and then open the normal score settlement panel.

The experience must remain child-friendly and must not create a new way to become stuck.

## Scope

- Apply only when `levels[state.levelIndex]?.world === "mist_swamp"`.
- Cover the five existing levels: `迷雾沼泽入口`, `萤火虫小径`, `沉睡木桥`, `迷雾核心`, and `沼泽泥浆怪`.
- Reuse the current dialogue panel, NPC art, interaction key, task mechanics, rewards, difficulty system, and score settlement panel.
- Do not change Day 1-7, Moonlight Lake, Apple Valley, Forest Road, existing boss branches, shared quiz behavior, or world-map structure.
- Do not add a general quest journal or refactor the main game flow.

## Player flow

Each level uses four quest states:

1. `locked`: the player has not accepted the quest.
2. `active`: the quest is accepted and existing objectives can progress.
3. `ready`: all required objectives are complete and the player should return to the NPC.
4. `settled`: the NPC has delivered the completion dialogue and the normal score panel may open.

The level flow is:

`find NPC -> talk -> accept -> follow HUD objectives -> finish existing mechanics -> return to NPC -> completion dialogue -> reward -> normal settlement`

Collectibles remain available while the quest is `locked`. A child who explores first keeps every collected item, and those items count immediately after accepting the quest. Task interactions and automatic task progress do not advance until the quest is `active`.

## Reuse of existing NPC tasks

No new gameplay task kind is required. Each level's existing main NPC task becomes the quest conversation anchor while retaining its current task kind and completion behavior:

| Level | Quest NPC | Existing anchor |
| --- | --- | --- |
| 迷雾沼泽入口 | Ruru 小浣熊 | `delivery` / `ruru` |
| 萤火虫小径 | 萤火虫向导 | `firefly_trail` / `fireflyGuide` |
| 沉睡木桥 | 小青蛙 | `escort_npc` / `littleFrog` |
| 迷雾核心 | 迷雾精灵 | `mist_core` / `mistSpirit` |
| 沼泽泥浆怪 | 沼泽泥浆怪 | `mud_boss` / `mudMonster` |

Quest state is separate from `task.done`. This prevents conversation state from changing existing task-kind semantics.

## Level configuration

Each Mist Swamp level receives a small `mistQuest` configuration containing:

- `npcAnimal`: identifies the existing anchor task.
- `introLines`: two or three short lines explaining the story and objectives.
- `activeHint`: the default current-step hint.
- `readyHint`: tells the player to return to the NPC.
- `completeLines`: the completion conversation.
- `objectiveLabels`: player-facing labels for existing required tasks.

Runtime state contains only the mutable fields needed for the current level:

```js
state.mistQuest = {
  status: "locked",
  npcTaskId: "...",
  readyAt: 0,
  lastProgressAt: 0,
};
```

Objective progress is derived from existing collectibles, inventory, tasks, and boss phase state. It is not stored as a second source of truth.

## Dialogue behavior

The existing dialogue panel gains Mist Swamp-only modes:

- `quest_intro`: show the opening lines and an `接受任务` action.
- `quest_active`: repeat the current objective and progress.
- `quest_ready`: show the completion lines and a `完成任务` action.
- `quest_after`: provide a short friendly replay line after settlement.

Opening and closing dialogue continues to use the existing `E` key and buttons. Existing dialogue behavior outside Mist Swamp is unchanged.

Do not add a second dialogue UI. On the last intro line, relabel the existing next/action button to `接受任务`. In `quest_ready`, reuse the existing delivery action button with the label `完成任务`.

The NPC marker communicates state:

- Yellow `!`: quest available.
- Gray `...`: quest active.
- Gold `?`: quest ready to turn in.
- Green check mark: quest settled.

Markers are drawn above the existing NPC task renderer and use Canvas fallback text if no separate art exists.

## Quest HUD

Add one small Mist Swamp-only quest card near the existing HUD. It shows:

- NPC name.
- Current stage.
- Up to three visible objectives with progress, such as `收集木桥板 1/2`.
- One explicit next action, such as `去找小青蛙`, `按 E 修复木桥`, or `返回迷雾精灵交付任务`.
- A `查看下一步` action on Easy difficulty.

The card must not cover the score panel, dialogue panel, quiz panel, or mobile controls. It hides after settlement.

When the quest has not progressed for about eight seconds, show one contextual hint. Do not repeat the hint continuously. While `locked` and `ready`, draw a child-friendly trail of soft light points toward the NPC so an off-screen quest giver or turn-in NPC can still be found.

## Five-level content

### 1. 迷雾沼泽入口 — Ruru 小浣熊

- Intro: Ruru explains that the old road is blocked and asks the player to collect firefly cores and light the mist lamps.
- HUD: collect firefly cores, light the two mist lamps, and complete the existing fog-and-light challenge.
- Ready hint: `入口的雾已经散开，回去告诉 Ruru。`
- Completion: `太棒啦，前面的旧路重新亮起来了！`
- Existing delivery prerequisites remain authoritative.

### 2. 萤火虫小径 — 萤火虫向导

- Intro: follow the true light trail and do not follow the short decoy trail.
- HUD: follow the correct trail, collect four glow spores, and find the bridge key.
- The next route point remains clearly indicated when the player stops progressing.
- Completion: `你已经学会辨认真正的萤火虫路线啦！`

### 3. 沉睡木桥 — 小青蛙

- Intro: collect the required planks, repair the bridge, and escort the frog to the exit.
- Easy and Normal keep mushroom lamps optional; Hard and Crazy show the required color sequence in the quest card.
- When the frog reaches `mistBridgeExit`, the frog remains at the exit and immediately becomes the turn-in NPC. The player does not return to the frog's original position.
- Completion: `谢谢你修好木桥，还安全地带我过来了！`

### 4. 迷雾核心 — 迷雾精灵

- Intro: collect light spores, light the big mist lamps, clear the dark mist bubbles, and restore the core.
- The HUD reveals one phase at a time instead of displaying every objective at once.
- After restoration, the same mist spirit becomes the friendly turn-in NPC.
- Keep the existing `fireflyLantern` reward and grant it only once.

### 5. 沼泽泥浆怪 — 沼泽泥浆怪

- Intro: the guardian is trapped rather than hostile; the opening dialogue explains the first lamp phase.
- The HUD shows only the current boss phase: light lamps, clear bubbles, then charge the lantern and answer the final quiz.
- When purification completes, the same boss changes to a friendly turn-in NPC at its current reachable position.
- Preserve the temporary `lightSpore` and `fireflyLantern` safeguards.
- Keep only the existing `mistGuardianBadge` final reward; do not duplicate `fireflyLantern`.

## Settlement gating

Existing required tasks continue to determine whether the gameplay objectives are complete. For Mist Swamp only:

- When every required task is done, set `state.mistQuest.status` to `ready` instead of opening the score panel.
- The completed gameplay state must not be reset while awaiting turn-in.
- The NPC `完成任务` action sets the status to `settled`, applies any existing task reward exactly once, and invokes the existing settlement flow.
- Repeated conversation after settlement cannot grant rewards or open a second score record.

No existing settlement condition or branch outside `world === "mist_swamp"` is modified.

## Anti-stuck behavior

- Collected items are never removed when the quest is accepted.
- Completed mechanisms are never reset when the quest becomes `ready`.
- The next-step hint names the exact object and action instead of only saying `按 E 互动`.
- After ten seconds in `ready`, show a `直接完成任务` fallback action in the quest card. It performs the same guarded turn-in operation as the NPC and is always optional.
- The fallback does not bypass unfinished gameplay objectives.
- If the level timer expires, completed objective progress remains intact and the player can still turn in the quest.
- NPC anchors and the ready-state guidance trail must stay inside the existing playable safe area.

## Difficulty behavior

- Easy: includes `查看下一步`, the clearest route hint, and existing optional mushroom-lamp behavior.
- Normal: shows persistent objective progress and normal route hints.
- Hard and Crazy: preserve timed fog, randomized lamp positions, required mushroom sequence, boss bubble counts, and lantern-charge timing.
- Quest acceptance and turn-in requirements are identical across difficulties.

The guidance layer must not reduce or bypass existing Hard/Crazy mechanics.

## Validation

Add functional runtime coverage for:

- All five levels transition through `locked -> active -> ready -> settled`.
- Each quest finds the intended existing NPC task.
- Collectibles picked up before acceptance remain in inventory and count after acceptance.
- Mechanisms do not progress while the quest is locked.
- Objective progress and next-step text match actual existing task state.
- Every level waits for NPC turn-in before score settlement.
- The ten-second direct-turn-in fallback appears only after all objectives are complete.
- Level 3 turns in at the frog's exit position.
- Level 4 grants `fireflyLantern` once.
- Level 5 preserves temporary-resource safeguards and grants `mistGuardianBadge` once.
- Easy, Normal, Hard, and Crazy can complete and settle all five levels.
- Advanced task kinds remain Mist Swamp-only.
- Existing chapter task kinds and settlement behavior remain unchanged.

Run:

```bash
node --check game.js
node --check world-map.js
node --check mist-swamp-map-entry.js
node --check mist-swamp-quiz-bank.js
node --test tests/*.test.mjs
git diff --check
```

Browser smoke-test all five Mist Swamp levels and verify:

- the quest NPC can be found and spoken to;
- objectives are understandable and progress correctly;
- return guidance appears;
- NPC turn-in and fallback turn-in both settle normally;
- all four difficulties remain completable;
- the score panel opens once per level;
- console errors remain zero.
