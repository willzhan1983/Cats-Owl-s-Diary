# Task 1 report: Wetland-only runtime contract

## Status

DONE_WITH_CONCERNS

## Files changed

- `game.js`
  - Added the difficulty configuration helper.
  - Added the Wetland adventure-state factory with the exact guarded state fields and empty defaults.
  - Merged the adventure state into Wetland quest reset state.
  - Kept the Wetland mechanism update entry world- and level-guarded.
  - Updated the Wetland wrong-action handler to restore the supplied/default checkpoint and apply the specified penalties.
- `tests/wetland-park-mechanics.test.mjs`
  - Added the Task 1 runtime contract assertions.
- `task-1-report.md`
  - This report.

Pre-existing uncommitted changes in `game.js`, `tests/wetland-park-quest.test.mjs`, `tests/wetland-park-runtime.test.mjs`, and the dynamic-adventure plan were preserved and were not reset, stashed, or discarded.

## Tests and exact results

Command: `node --check game.js`

Result: passed with no output.

Command: `node --test tests/wetland-park-mechanics.test.mjs`

Result:

```text
✔ tests/wetland-park-mechanics.test.mjs (33.275917ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 36.568334
```

Command: `node --test tests/wetland-park-quest.test.mjs tests/wetland-park-runtime.test.mjs`

Result: both tests passed; 2 tests, 0 failures.

Command: `git diff --check`

Result: passed with no output.

## Self-review

- The new adventure factory returns only `checkpoint`, `hintViews`, `routeIndex`, `routeVisibleUntil`, `patrols`, `platforms`, `mirrorAngles`, `mirrorMistHits`, and `boss`.
- Non-Wetland levels receive empty defaults from the factory, while `createWetlandQuestState` remains `null` outside Wetland Park.
- The mechanism update remains guarded by `isWetlandParkLevel()`, quest-state presence, and the existing Drift Crossing level id.
- Wrong-action penalties floor time, score, and hearts at zero, then restore the selected checkpoint before showing feedback and updating the HUD.

## Concerns

- The worktree contained pre-existing Wetland implementation edits. They remain in the same `game.js` commit because the requested Task 1 runtime functions share that file; unrelated pre-existing test and plan files were not staged.
- Browser smoke testing was not requested for this contract-only change and was not run.

## Commit

Implementation commit: `5c7e0ee39335c76276dc03d4c5ba79f4eff33ff3`
