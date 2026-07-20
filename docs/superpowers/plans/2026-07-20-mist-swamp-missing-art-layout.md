# Mist Swamp Missing Art and Layout Implementation Plan

1. Add the six 512 x 512 transparent PNG assets and an automated transparency
   test. Verify the focused test fails before the files exist, then passes.
2. Register the assets and render mushroom lamps, broken bridge, soft mud, and
   Boss phase-3 mud core with existing canvas fallbacks preserved. Add focused
   source tests before implementation.
3. Add decorative `swampSnail` and update the approved Level 3-5 coordinates.
   Add source/runtime tests before implementation.
4. Run syntax checks, all Node tests, `git diff --check`, and browser smoke tests
   for Mist Swamp Levels 1-5. Confirm zero console errors and unchanged gameplay.

