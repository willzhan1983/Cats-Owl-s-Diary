/* Pure Riverside Dock difficulty and recovery rules shared by browser and tests. */
(function setupRiversideDockRules(globalScope) {
  const TIMES = Object.freeze({
    riverside_dock_entrance: Object.freeze({ easy: 170, normal: 150, hard: 130, crazy: 120 }),
    riverside_paddle_search: Object.freeze({ easy: 145, normal: 125, hard: 110, crazy: 95 }),
    riverside_bridge_repair: Object.freeze({ easy: 155, normal: 135, hard: 120, crazy: 105 }),
    riverside_safe_crossing: Object.freeze({ easy: 160, normal: 140, hard: 125, crazy: 110 }),
  });
  const ROUTES = Object.freeze({
    easy: Object.freeze(["right", "dock"]),
    normal: Object.freeze(["right", "up", "dock"]),
    hard: Object.freeze(["right", "up", "dock"]),
    crazy: Object.freeze(["right", "up", "dock"]),
  });
  const ROUTE_LABELS = Object.freeze({ right: "向右", up: "向上", dock: "码头" });
  const PENALTIES = Object.freeze({ easy: 0, normal: 0, hard: 4, crazy: 6 });
  const WATER_WINDOWS = Object.freeze({ easy: 0.72, normal: 0.58, hard: 0.4, crazy: 0.28 });
  const SIGNAL_WINDOWS = Object.freeze({ easy: 0.5, normal: 0.5, hard: 0.44, crazy: 0.36 });

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

  function routeHintFor(mode) {
    return `路线提示：${routeFor(mode).map((choice) => ROUTE_LABELS[choice]).join(" → ")}`;
  }

  function waterWindowFor(mode) {
    return WATER_WINDOWS[normalizedMode(mode)];
  }

  function signalWindowFor(mode) {
    return SIGNAL_WINDOWS[normalizedMode(mode)];
  }

  function bridgeResetsOnMistake(mode) {
    return normalizedMode(mode) !== "hard";
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
    routeHintFor,
    waterWindowFor,
    signalWindowFor,
    bridgeResetsOnMistake,
    advanceSequence,
    canCross,
  });
})(typeof window !== "undefined" ? window : globalThis);
