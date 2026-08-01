# Acorn Town Difficulty and Quiz Expansion Design

## Goal

Increase the replay value and difficulty range of the four playable Acorn Town levels without adding an NPC quest system, new maps, or new art.

The enhancement has two focused parts:

1. Scale moving vehicle count and speed by difficulty.
2. Expand the difficulty-aware quiz pool and prevent question repetition across the four Acorn Town days in one chapter run.

## Confirmed Scope

- Keep the existing four levels:
  - `acorn_post_office`
  - `acorn_hunt`
  - `acorn_market`
  - `acorn_notice_board`
- Keep the existing mail delivery, acorn hunt, market order, notice board, route, decoy, and final quiz mechanics.
- Add moving vehicles to all four Acorn Town levels.
- Scale vehicle count, speed, and collision time penalty by difficulty.
- Expand the quiz bank from 24 to exactly 48 questions.
- Draw one required question and one optional bonus riddle per level.
- Prevent repeated questions across the four days of one Acorn Town chapter run.
- Keep existing fallback behavior so missing optional data cannot block a level or cause a blank screen.

## Non-goals

- No NPC quest acceptance, staged NPC task card, NPC following, or return-to-NPC hand-in flow.
- No changes to Forest Road, Mist Swamp, Apple Valley, Moonlight Lake, or the base adventure.
- No new background, character, vehicle, prop, or UI art.
- No general-purpose quest-engine refactor.
- No heart loss from vehicle collisions.
- No cloud save or cross-device quiz history.

## Vehicle Difficulty Design

Each Acorn Town level defines four horizontal vehicle route templates. Difficulty determines how many templates are active and the shared speed used by those vehicles.

| Difficulty | Active vehicles | Vehicle speed | Collision time penalty | Heart penalty |
| --- | ---: | ---: | ---: | ---: |
| Easy | 1 | 48 px/s | 0 seconds | 0 |
| Normal | 2 | 64 px/s | 2 seconds | 0 |
| Hard | 3 | 80 px/s | 4 seconds | 0 |
| Crazy | 4 | 96 px/s | 6 seconds | 0 |

### Route requirements

- Each level provides four distinct horizontal routes.
- Vehicles use separated lanes and alternating starting directions.
- A vehicle spawn point must be at least 72 pixels from the player start.
- Vehicle reversal points must not overlap a required task interaction point within 56 pixels.
- Routes may cross normal player travel paths because avoidance is the intended challenge.
- Vehicles remain within the safe Canvas bounds.
- The existing one-second collision cooldown remains in place so one contact cannot apply penalties every frame.

### Collision behavior

On collision:

- Apply the current difficulty's obstacle time penalty.
- Push the player away from the vehicle's direction of travel.
- Show the existing short warning message and feedback.
- Do not remove hearts or inventory.
- Do not reset completed tasks.

## Quiz Content Design

The Acorn Town quiz bank contains exactly 48 questions: 12 per difficulty.

Each difficulty pool contains:

- 8 required-question candidates.
- 4 optional bonus riddles.

This supports four levels with one unique required question and one unique bonus riddle per level without exhausting either pool.

### Content mix

- Fourth-grade arithmetic and multi-step word problems.
- Chinese reading, meaning, order, and information selection.
- Basic English vocabulary connected to the chapter.
- Logic, routes, patterns, and short-term memory.
- Child-appropriate daily-life and road-safety knowledge.
- A smaller bonus-riddle group with one clear correct answer.

### Difficulty standards

#### Easy

- One-step arithmetic.
- Direct word meaning.
- Obvious visual or story clues.
- Clearly different distractors.

#### Normal

- Two-step arithmetic.
- Sequence and grouping.
- Simple route or story comprehension.
- Plausible but distinguishable distractors.

#### Hard

- Multi-step arithmetic.
- Information filtering.
- Close numerical or semantic distractors.
- Route understanding without copying the answer directly from the prompt.

#### Crazy

- Combined arithmetic and logic.
- Short-term route or order recall.
- Closely matched distractors.
- Questions that require checking more than one condition.

All questions must:

- Have exactly four non-empty, distinct options.
- Have one valid zero-based answer index.
- Be tagged with `difficulty` and `mode`.
- Avoid ambiguous wording or more than one defensible answer.
- Remain appropriate for a ten-year-old player.

## Randomization and Non-repetition

Quiz selection uses a chapter-run shuffle bag instead of independent random choice.

### Quiz modes

- `core`: required question.
- `bonus`: optional reward riddle.

Each difficulty and mode has its own shuffled bag. The selector assigns questions using:

- Difficulty.
- Quiz mode.
- Acorn Town level ID.
- Current chapter-run identifier.

### Assignment rules

1. Starting a new Acorn Town chapter run shuffles the current difficulty's `core` and `bonus` bags.
2. Each level receives one question from each bag.
3. Once a question is assigned or displayed, it is considered used for that chapter run.
4. Replaying or restarting the same level reuses its existing assignments and does not consume new questions.
5. The four levels therefore use eight different questions in total.
6. Changing difficulty starts a fresh set of bags for the new difficulty.
7. Starting the Acorn Town chapter again creates a new shuffle order.
8. Repetition is prohibited within one four-level chapter run, but a later run may contain questions seen in an earlier run.

### Fallback behavior

- If a filtered pool is missing, use the existing safe shared quiz fallback.
- If a bag is unexpectedly exhausted, rebuild it from the valid pool while excluding the most recently displayed question.
- A missing bonus pool hides the bonus option and allows normal completion.
- A missing required pool must never block the level; the safe fallback remains required and answerable.

## Required and Bonus Question Flow

The required question remains locked until the level's existing core tasks are complete.

After the required answer is correct:

1. Present two actions:
   - `挑战奖励谜题`
   - `直接完成关卡`
2. Choosing `直接完成关卡` settles the level normally.
3. Choosing `挑战奖励谜题` displays the level's assigned bonus question.
4. A correct bonus answer awards 10 additional run points.
5. A wrong bonus answer gives no bonus, applies no additional time penalty, and still allows the level to complete.
6. The optional question never changes world unlock requirements or completion state.

Required-question mistakes continue using the existing difficulty-specific quiz time penalty.

## Component Boundaries

### `game.js`

- Store four route templates on each Acorn Town level.
- Activate the correct number of vehicles for the selected difficulty.
- Apply the difficulty speed table during Acorn Town level preparation.
- Preserve the existing collision cooldown, knockback, and time-penalty flow.
- Add the small required-to-bonus completion transition without changing other worlds' quiz behavior.

### `acorn-town-rules.js`

- Own immutable Acorn Town vehicle count, speed, and bonus-point values.
- Provide small lookup helpers with a Normal-difficulty fallback.

### `acorn-town-quiz-bank.js`

- Own the 48 validated question records.
- Separate `core` and `bonus` records.
- Own the chapter-run shuffle bags and per-level assignments.
- Expose a narrow API for starting a run and retrieving the assigned question.

### `tests/acorn-town-*.test.mjs`

- Extend the existing data, runtime, and mechanics tests.
- Add isolated quiz shuffle-bag tests.
- Do not weaken or remove existing assertions.

## Data Flow

1. The player selects a difficulty.
2. Entering Acorn Town starts or resumes the chapter-run quiz state for that difficulty.
3. `resetGame` prepares the current level.
4. Acorn Town preparation activates the first N vehicle templates and applies the difficulty speed.
5. The quiz-bank module assigns stable `core` and `bonus` questions to the level.
6. Normal gameplay updates vehicles and collision feedback.
7. Core tasks unlock the required question.
8. A correct required answer opens the bonus-or-finish choice.
9. The optional result is recorded in run points, then normal level settlement continues.

## Testing and Acceptance Criteria

### Automated vehicle tests

- All four Acorn Town levels produce exactly 1, 2, 3, and 4 vehicles on Easy, Normal, Hard, and Crazy.
- Active vehicle speeds are exactly 48, 64, 80, and 96 pixels per second.
- A collision applies 0, 2, 4, or 6 seconds of time penalty by difficulty.
- A collision never reduces hearts or removes inventory.
- Collision cooldown prevents repeated penalties within one second.
- Spawn and reversal positions satisfy the player-start and task-point safety distances.
- Every vehicle remains inside Canvas bounds.

### Automated quiz tests

- The quiz bank contains exactly 48 unique question strings.
- Every difficulty contains 8 `core` and 4 `bonus` questions.
- Every question has four distinct options and a valid answer index.
- Four consecutive levels receive eight different questions in one run.
- Restarting a level preserves that level's two assignments.
- A new run reshuffles while maintaining uniqueness.
- Difficulty changes only draw from the selected difficulty.
- Missing required data uses the safe fallback.
- Missing bonus data does not block completion.
- Correct bonus answers add exactly 10 points.
- Wrong or skipped bonus questions do not apply a time penalty and do not block completion.

### Regression and manual checks

- Run the complete Node test suite.
- Run JavaScript syntax checks for changed runtime files.
- Manually play all four Acorn Town levels on Easy and Crazy.
- Confirm Easy has one slow vehicle and Crazy has four fast vehicles.
- Confirm all eight displayed questions are different within one chapter run.
- Confirm restarting a level does not change its assigned questions.
- Confirm the level completes after skipping or answering the bonus riddle.
- Confirm other worlds' quiz and collision behavior is unchanged.

## Files Expected to Change

- `game.js`
- `acorn-town-rules.js`
- `acorn-town-quiz-bank.js`
- `tests/acorn-town-rules.test.mjs`
- `tests/acorn-town-runtime.test.mjs`
- `tests/acorn-town-quiz-bank.test.mjs`
- One new focused shuffle-bag or difficulty test file if the existing files become unclear.

No asset files are required.
