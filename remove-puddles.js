/* Remove generic puddles/water pits that do not match the current game style.
 * Keeps Moonlight Lake's intentional water mechanics such as current,
 * bubbleLift, whirlpool, moonPillar, and pearlSwitch.
 */
(function removeGenericPuddles() {
  const REMOVED_OBSTACLE_TYPES = new Set(["pond"]);

  function cleanLevel(level) {
    if (!level) return;
    level.puddles = [];
    if (Array.isArray(level.obstacles)) {
      level.obstacles = level.obstacles.filter((obstacle) => !REMOVED_OBSTACLE_TYPES.has(obstacle.type));
    }
  }

  function cleanState() {
    if (typeof state === "undefined" || !state) return;
    state.puddles = [];
    if (Array.isArray(state.obstacles)) {
      state.obstacles = state.obstacles.filter((obstacle) => !REMOVED_OBSTACLE_TYPES.has(obstacle.type));
    }
  }

  if (Array.isArray(levels)) levels.forEach(cleanLevel);
  cleanState();

  checkPuddles = function checkPuddlesDisabled() {};

  const originalResetGame = resetGame;
  resetGame = function resetGameWithoutPuddles(levelIndex = 0, keepHearts = false) {
    cleanLevel(levels?.[levelIndex]);
    originalResetGame(levelIndex, keepHearts);
    cleanState();
  };

  window.CATS_OWLS_PUDDLES_DISABLED = true;
})();
