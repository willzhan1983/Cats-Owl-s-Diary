/* Pure Acorn Town difficulty rules shared by the browser and Node tests. */
(function setupAcornTownRules(globalScope) {
  const DIFFICULTIES = ["easy", "normal", "hard", "crazy"];
  const TIMES = Object.freeze({
    acorn_post_office: Object.freeze({ easy: 130, normal: 110, hard: 95, crazy: 80 }),
    acorn_hunt: Object.freeze({ easy: 140, normal: 120, hard: 105, crazy: 90 }),
    acorn_market: Object.freeze({ easy: 145, normal: 125, hard: 110, crazy: 95 }),
    acorn_notice_board: Object.freeze({ easy: 150, normal: 130, hard: 115, crazy: 100 }),
  });
  const WRONG_ACTION_PENALTIES = Object.freeze({ easy: 0, normal: 0, hard: 3, crazy: 5 });
  const TRAFFIC = Object.freeze({
    easy: Object.freeze({ count: 1, speed: 48 }),
    normal: Object.freeze({ count: 2, speed: 64 }),
    hard: Object.freeze({ count: 3, speed: 80 }),
    crazy: Object.freeze({ count: 4, speed: 96 }),
  });
  const BONUS_POINTS = 10;

  function difficultyRank(mode) {
    const rank = DIFFICULTIES.indexOf(mode);
    return rank >= 0 ? rank : 1;
  }

  function visibleAtDifficulty(entry, mode) {
    return difficultyRank(mode) >= difficultyRank(entry?.minDifficulty || "easy");
  }

  function timeFor(levelId, mode) {
    return TIMES[levelId]?.[mode] || TIMES[levelId]?.normal || 110;
  }

  function wrongActionPenalty(mode) {
    return WRONG_ACTION_PENALTIES[mode] ?? WRONG_ACTION_PENALTIES.normal;
  }

  function trafficFor(mode) {
    const traffic = TRAFFIC[mode] || TRAFFIC.normal;
    return { count: traffic.count, speed: traffic.speed };
  }

  function bonusPoints() {
    return BONUS_POINTS;
  }

  function coreTasksDone(tasks) {
    return tasks
      .filter((task) => task.kind !== "quiz" && !task.optional)
      .every((task) => task.done);
  }

  globalScope.CATS_OWLS_ACORN_TOWN_RULES = Object.freeze({
    difficultyRank,
    visibleAtDifficulty,
    timeFor,
    wrongActionPenalty,
    trafficFor,
    bonusPoints,
    coreTasksDone,
  });
})(typeof window !== "undefined" ? window : globalThis);
