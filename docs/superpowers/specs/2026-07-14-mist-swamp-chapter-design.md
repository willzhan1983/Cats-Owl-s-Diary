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

## Data and chapter routing

- Append the five level objects and five `dayNames`; do not insert them between existing levels.
- Add `WORLD_MAP.mist_swamp` to the runtime map in `game.js`. Derive its level indices from `level.world === "mist_swamp"` so later additions cannot leave a stale hard-coded index.
- Reuse and update the reserved `mist_swamp` node in `world-map.js`; do not create a second node.
- Add `mist-swamp-map-entry.js`, following the existing chapter-entry pattern and resolving its starting index from `window.CATS_OWLS_GAME_DATA.levels`.
- Add `mist-swamp-quiz-bank.js` with the isolated key `mistSwampShared`. It must not modify `appleValleyShared` or `moonlightShared`.

## Backgrounds, labels, and NPCs

Add background keys `mistSwampEntrance`, `fireflyTrailPath`, `sleepingWoodenBridge`, `mistCoreClearing`, and `mudMonsterLair`. Missing PNGs intentionally use Mist Swamp-specific Canvas fallbacks; no image generation or image editing is part of this change.

Add the requested item labels once, reusing existing names where present. Register `fireflyGuide`, `littleFrog`, `swampSnail`, `mistSpirit`, `ruru`, and `mudMonster` with existing Canvas renderers where suitable. `mudMonster` uses a new rounded, large-eyed `drawMudMonster` fallback.

## Level mechanics

### 1. 迷雾沼泽入口

The player gathers three `fireflyCore`, lights two `mist_lamp` tasks, talks to Ruru, and completes one Mist Swamp quiz. Each lamp accepts either `fireflyCore` or `glowSpore` and displays `雾灯亮起来啦！`.

Fog is a blue-gray overlay drawn over the world and below the UI. A lit lamp clears fog for the current difficulty duration:

```js
const MIST_CLEAR_TIME_BY_DIFFICULTY = {
  easy: 999999,
  normal: 12000,
  hard: 8000,
  crazy: 6000,
};
```

After the timer expires, fog opacity eases back rather than snapping. Lamps can be relit without adding another required task completion. The overlay remains light enough to see navigation and never covers DOM UI.

### 2. 萤火虫小径

The level contains a correct trail and one decoy branch, four `glowSpore`, child-friendly `softMud`, and `bridgeKey` at the correct endpoint. Approaching the guide displays `跟着萤火虫走吧！`.

The next correct light point glows brighter. A decoy point looks plausible until approached, then turns gray and fades with `这不是正确路线，再观察一下吧。`; it applies no time, heart, or position penalty. Correct points advance in order. If the player is far from the next point, its movement pauses. Reaching the correct endpoint completes the trail task.

### 3. 沉睡木桥

The player collects three `bridgePlank`, completes a four-color mushroom memory task, repairs `brokenBridge`, and escorts `littleFrog` across.

Four mushroom lamps use yellow, blue, purple, and green. At the start of the puzzle they demonstrate one four-step sequence. The player then activates the colors in that order. A wrong choice displays `再看一看萤火虫提示哦。`, resets only the current sequence attempt, and replays the demonstration. Completion displays `蘑菇灯都亮啦！`. The bridge consumes three planks and displays `木桥修好啦，可以安全通过了！`.

### 4. 迷雾核心

The player gathers three `lightSpore`, lights three `bigMistLamp`, clears three stationary or gently floating `darkMistBubble`, and approaches `mistSpirit`. These are non-damaging interactions. Completing all prerequisites displays `迷雾精灵恢复清醒啦！沼泽重新亮起来了。` and awards `mistBadge` plus `fireflyLantern`.

### 5. 沼泽泥浆怪

The `mud_boss` is a mechanism Boss and never directly damages the player.

- Phase 1: collect/use `lightSpore` to light three `bigMistLamp`. Completion displays `黑雾变淡了，泥浆怪露出了泥浆泡泡！`.
- Phase 2: clear nearby `mudBubble` objects using interaction or attack. Required bubble counts are easy 2, normal 3, hard 4, crazy 4. Bubbles float slowly; crazy only increases their speed slightly. Completion advances to the core.
- Phase 3: with `fireflyLantern` in inventory, interact with the Boss core to open one isolated final quiz. A correct answer completes `mud_boss`, awards `mistBadge`, and displays `泥浆怪安静下来了，它原来是在守护沼泽。`.

The arena may contain `softMud`. Hard and crazy enlarge its slowing radius slightly. There is no health damage, irreversible item loss, or failure state that can trap a child.

## Interaction and state boundaries

New task kinds are handled by narrow branches in the existing update, interaction, hint, completion, and drawing dispatchers. New per-level arrays and counters are copied into `state` during `resetGame`; no global task-flow rewrite is allowed.

Mist Swamp mechanisms run only when `levels[state.levelIndex].world === "mist_swamp"`. Existing `boss` and `moon_boss` branches remain unchanged. All completion paths use the existing `completeTask` and level-completion logic so the local score summary continues to appear normally.

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

Final verification runs all `tests/*.test.mjs`, `node --check game.js`, `node --check world-map.js`, `node --check mist-swamp-map-entry.js`, and `node --check mist-swamp-quiz-bank.js`. Browser smoke testing enters each Mist Swamp level and checks that the score panel remains reachable, with explicit spot checks that Black Bear and Nessie code paths still load without console errors.

