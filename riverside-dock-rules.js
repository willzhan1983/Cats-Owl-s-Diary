/* Pure Riverside Dock difficulty and recovery rules shared by browser and tests. */
(function setupRiversideDockRules(globalScope) {
  const TIMES = Object.freeze({
    riverside_dock_entrance: Object.freeze({ easy: 140, normal: 120, hard: 105, crazy: 90 }),
    riverside_paddle_search: Object.freeze({ easy: 145, normal: 125, hard: 110, crazy: 95 }),
    riverside_bridge_repair: Object.freeze({ easy: 155, normal: 135, hard: 120, crazy: 105 }),
    riverside_safe_crossing: Object.freeze({ easy: 160, normal: 140, hard: 125, crazy: 110 }),
  });
  const ROUTES = Object.freeze({
    easy: Object.freeze(["right", "dock"]),
    normal: Object.freeze(["right", "up", "dock"]),
    hard: Object.freeze(["right", "up", "dock"]),
    crazy: Object.freeze(["right", "up", "right", "dock"]),
  });
  const PENALTIES = Object.freeze({ easy: 0, normal: 0, hard: 3, crazy: 5 });
  const WATER_WINDOWS = Object.freeze({ easy: 0.72, normal: 0.58, hard: 0.46, crazy: 0.34 });

  function normalizedMode(mode) {
    return Object.hasOwn(ROUTES, mode) ? mode : "normal";
  }

  function timeFor(levelId, mode) {
    const times = TIMES[levelId];
    return times?.[normalizedMode(mode)] || times?.normal || 120;
  }

  function wrongActionPenalty(mode) {
    return PENALTIES[normalizedMode(mode)];
  }

  function routeFor(mode) {
    return [...ROUTES[normalizedMode(mode)]];
  }

  function waterWindowFor(mode) {
    return WATER_WINDOWS[normalizedMode(mode)];
  }

  function advanceSequence(expected, progress, choice) {
    const sequence = Array.isArray(expected) ? expected : [];
    const current = Number.isInteger(progress) && progress >= 0 ? progress : 0;
    if (sequence[current] !== choice) return { progress: 0, complete: false, reset: true };
    const next = current + 1;
    return { progress: next, complete: next >= sequence.length, reset: false };
  }

  function canCross({ waterSafe, signalGreen, hasPackage } = {}) {
    return waterSafe === true && signalGreen === true && hasPackage === true;
  }

  globalScope.CATS_OWLS_RIVERSIDE_DOCK_RULES = Object.freeze({
    timeFor,
    wrongActionPenalty,
    routeFor,
    waterWindowFor,
    advanceSequence,
    canCross,
  });
})(typeof window !== "undefined" ? window : globalThis);
