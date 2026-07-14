# Mist Swamp Chapter Design

## Goal

Add a five-level Mist Swamp / 迷雾沼泽 chapter after Forest Road without restructuring the existing game flow. The chapter remains child-friendly while adding timed fog, route observation, memory sequencing, bridge repair, staged purification, and a non-damaging mechanism Boss.

## Scope

The chapter appends these levels after all existing levels:

1. 迷雾沼泽入口
2. 萤火虫小径
3. 沉睡木桥
4. 迷雾核心
5. 沼泽泥浆怪

The implementation adds only Mist Swamp data, task kinds, update/draw branches, a separate quiz bank, a separate world-map entry script, Canvas fallback art, and focused tests. It does not refactor shared movement, difficulty, quiz, score-summary, or world-map structures.

Delivery is split into two reviewable changes because the complete chapter is too large for one safe PR:

- PR A — Mist Swamp base chapter, five traversable level definitions, world-map entry, Canvas backgrounds, isolated quiz bank, basic Mist Swamp-only placeholder tasks, completion, and score settlement. It does not implement any advanced mechanism state machine.
- PR B — timed fog, decoy fireflies, four-color mushroom memory, Mist Core mechanisms, and the three-phase Swamp Mud Monster Boss.

PR A must prove the priority path `能进入 → 能完成 → 能结算` for all five levels before PR B adds advanced effects. Any placeholder task reserved for PR B is explicitly named and guarded as Mist Swamp-only. PR B is based on PR A and must preserve the completion path after each mechanism is added.

## Data and chapter routing

- Append the five level objects and five `dayNames`; do not insert them between existing levels.
- Add `WORLD_MAP.mist_swamp` to the runtime map in `game.js`. Its initial `levels` value is empty, then it is always derived with `levels.map(... level.world === "mist_swamp" ...)`; no Mist Swamp index may be hard-coded.
- Reuse and update the reserved `mist_swamp` node in `world-map.js`; do not create a second node.
- Add `mist-swamp-map-entry.js`, following the existing chapter-entry pattern and resolving its starting index from `window.CATS_OWLS_GAME_DATA.levels`.
- Add `mist-swamp-quiz-bank.js` with the isolated key `mistSwampShared`. It must not modify `appleValleyShared` or `moonlightShared`.

## Backgrounds, labels, and NPCs

Add background keys `mistSwampEntrance`, `fireflyTrailPath`, `sleepingWoodenBridge`, `mistCoreClearing`, and `mudMonsterLair`. Missing PNGs intentionally use Mist Swamp-specific Canvas fallbacks; no image generation or image editing is part of this change.

Add the requested item labels once, reusing existing names where present. Register `fireflyGuide`, `littleFrog`, `swampSnail`, `mistSpirit`, `ruru`, and `mudMonster` with existing Canvas renderers where suitable. `mudMonster` uses a new rounded, large-eyed `drawMudMonster` fallback.

All new task `kind` values use snake_case, including `mist_lamp`, `firefly_trail`, `mushroom_lamp`, `broken_bridge`, `mist_core`, and `mud_boss`. All new item and prop keys use camelCase, including `fireflyCore`, `mistLamp`, `mushroomLamp`, `bigMistLamp`, and `mudBubble`.

## Level mechanics

### 1. 迷雾沼泽入口

The player gathers three `fireflyCore`, lights two `mist_lamp` tasks, talks to Ruru, and completes one Mist Swamp quiz. Each lamp accepts either `fireflyCore` or `glowSpore` and displays `雾灯亮起来啦！`.

Fog is a blue-gray overlay drawn over the world and below the UI. A lit lamp clears fog for the current difficulty duration:

```js
const MIST_CLEAR_TIME_BY_DIFFICULTY = {
  easy: null,
  normal: 12000,
  hard: 8000,
  crazy: 6000,
};
```

`null` is the explicit permanent-clear state for easy difficulty; it is not converted to a large approximate duration. On other difficulties, fog opacity eases back after the timer expires rather than snapping. Lamps can be relit without adding another required task completion. The overlay remains light enough to see navigation and never covers DOM UI.

### 2. 萤火虫小径

The level contains a correct trail and one short decoy branch, four `glowSpore`, child-friendly `softMud`, and `bridgeKey` at the correct endpoint. Approaching the guide displays `跟着萤火虫走吧！`.

The next correct light point glows brighter. A decoy point looks plausible until approached, then turns gray and fades with `这不是正确路线，再观察一下吧。`; it applies no time, heart, or position penalty. The decoy remains close to the correct route, never ends in an obstacle pocket or dead corner, and visibly reconnects to the safe path. Correct points advance in order. If the player is far from the next point, its movement pauses. Reaching the correct endpoint completes the trail task.

### 3. 沉睡木桥

The player collects three `bridgePlank`, completes a four-color mushroom memory task, repairs `brokenBridge`, and escorts `littleFrog` across.

Four mushroom lamps use yellow, blue, purple, and green. At the start of the puzzle they demonstrate one four-step sequence. The player then activates the colors in that order. A wrong choice displays `再看一看萤火虫提示哦。`, resets only the current sequence attempt, and replays the demonstration. Completion displays `蘑菇灯都亮啦！`. The bridge consumes three planks and displays `木桥修好啦，可以安全通过了！`.

### 4. 迷雾核心

The player gathers three `lightSpore`, lights three `bigMistLamp`, clears three stationary or gently floating `darkMistBubble`, and approaches `mistSpirit`. These are non-damaging interactions. Completing all prerequisites displays `迷雾精灵恢复清醒啦！沼泽重新亮起来了。` and awards `mistBadge` plus `fireflyLantern`.

### 5. 沼泽泥浆怪

The `mud_boss` is a mechanism Boss and never directly damages the player.

- Phase 1: collect/use `lightSpore` to light three `bigMistLamp`. The level contains at least three reachable spores; if entry state cannot satisfy the phase, reset grants only the missing number as temporary level-only `lightSpore`. Completion displays `黑雾变淡了，泥浆怪露出了泥浆泡泡！`.
- Phase 2: clear nearby `mudBubble` objects with the existing interaction key. Attack-key support may be added only if it can reuse the current stable attack action without changing its behavior. Required bubble counts are easy 2, normal 3, hard 4, crazy 4. Bubbles float slowly; crazy only increases their speed slightly. Completion advances to the core.
- Phase 3: with `fireflyLantern` in inventory, interact with the Boss core to open one isolated final quiz. The Boss level contains a reachable `fireflyLantern`; if entry state still lacks one, reset grants a temporary level-only lantern so the level cannot deadlock. A correct answer completes `mud_boss`, awards `mistGuardianBadge` as a distinct Level 5 reward, and displays `泥浆怪安静下来了，它原来是在守护沼泽。`.

The arena may contain `softMud`. Hard and crazy enlarge its slowing radius slightly. There is no health damage, irreversible item loss, or failure state that can trap a child.

## Interaction and state boundaries

New task kinds are handled by narrow branches in the existing update, interaction, hint, completion, and drawing dispatchers. New per-level arrays and counters are copied into `state` during `resetGame`; no global task-flow rewrite is allowed.

Every Mist Swamp update, interaction, fog, movement, and drawing mechanism begins behind `levels[state.levelIndex]?.world === "mist_swamp"`. Existing Day 1–7, Moonlight Lake, Apple Valley, Forest Road, score settlement, difficulty code, `boss`, and `moon_boss` behavior remains unchanged. If an unavoidable shared dispatcher is edited, the change only appends an explicitly guarded Mist Swamp branch and does not modify any existing condition or branch body. All completion paths use the existing `completeTask` and level-completion logic so the local score summary continues to appear normally.

## Quiz coverage

`mistSwampShared` contains at least five questions covering lamp-count math, the meaning of `迷雾`, English `fog` / `light` / `bridge`, firefly light science, and color-order logic. The Boss final quiz belongs to the same isolated bank and can select hard/crazy entries only on those difficulties.

## Testing and acceptance

Add focused Node tests before implementation. Tests must initially fail because Mist Swamp is absent, then pass after implementation. They cover:

- five appended names and five Mist Swamp level objects;
- derived `WORLD_MAP.mist_swamp.levels`, Boss registration, and Boss task type;
- background keys, labels, NPCs, key copy, and rewards;
- fog duration table and relighting path;
- correct/decoy firefly trail behavior and no-penalty copy;
- four-color mushroom memory sequence and reset copy;
- bridge repair and four-stage core prerequisites;
- three Boss phases and difficulty bubble counts;
- isolated quiz bank and map entry script loading;
- unchanged existing chapter-entry tests.

Tests also assert that the Boss level supplies or grants enough `lightSpore` and `fireflyLantern`, Level 4 and Level 5 rewards are distinct, easy fog uses the explicit permanent state, decoy coordinates stay inside the safe play area and near the correct path, new task kinds are snake_case, new item/prop keys are camelCase, and every new mechanism has an explicit Mist Swamp world guard.

After PR A and again after PR B, verification runs `npm test` when available and otherwise `node --test tests/*.test.mjs`, plus `node --check game.js`, `node --check world-map.js`, `node --check mist-swamp-map-entry.js`, and `node --check mist-swamp-quiz-bank.js`. Before either PR is opened, browser smoke testing enters every Mist Swamp level, completes it, confirms the score panel appears, and checks that Black Bear and Nessie still load without console errors.
