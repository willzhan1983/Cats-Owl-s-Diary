import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const rulesSource = readFileSync(new URL("../acorn-town-rules.js", import.meta.url), "utf8");
const gameSource = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const gradeQuizSource = readFileSync(new URL("../grade-quiz.js", import.meta.url), "utf8");
const acornQuizSource = readFileSync(new URL("../acorn-town-quiz-bank.js", import.meta.url), "utf8");
const plain = (value) => JSON.parse(JSON.stringify(value));

function loadGameRuntime() {
  const noop = () => {};
  const gradient = { addColorStop: noop };
  const canvasContext = new Proxy({}, {
    get(_target, key) {
      if (key === "measureText") return (text) => ({ width: String(text).length * 8 });
      if (key === "createLinearGradient" || key === "createRadialGradient") return () => gradient;
      return noop;
    },
    set: () => true,
  });
  const elements = new Map();
  function element(id = "") {
    if (elements.has(id)) return elements.get(id);
    const value = {
      id,
      width: id === "gameCanvas" ? 960 : 0,
      height: id === "gameCanvas" ? 540 : 0,
      hidden: false,
      value: "",
      textContent: "",
      innerHTML: "",
      dataset: {},
      style: {},
      classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
      addEventListener: noop,
      appendChild: noop,
      append: noop,
      replaceChildren: noop,
      setAttribute: noop,
      removeAttribute: noop,
      querySelector: () => null,
      querySelectorAll: () => [],
      getContext: () => canvasContext,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 960, height: 540 }),
    };
    elements.set(id, value);
    return value;
  }
  class TestImage {
    constructor() {
      this.complete = false;
      this.naturalWidth = 1;
      this.naturalHeight = 1;
    }
    addEventListener() {}
  }
  const storage = new Map();
  const context = {
    console,
    Image: TestImage,
    URLSearchParams,
    performance: { now: () => 0 },
    requestAnimationFrame: noop,
    setTimeout: noop,
    clearTimeout: noop,
    setInterval: () => 1,
    clearInterval: noop,
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
    document: {
      getElementById: element,
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => element(`created-${elements.size}`),
      addEventListener: noop,
    },
    location: { search: "" },
    addEventListener: noop,
    confirm: () => true,
  };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(rulesSource, context, { filename: "acorn-town-rules.js" });
  vm.runInContext(gameSource, context, { filename: "game.js" });
  vm.runInContext(gradeQuizSource, context, { filename: "grade-quiz.js" });
  vm.runInContext(acornQuizSource, context, { filename: "acorn-town-quiz-bank.js" });
  return context;
}

const runtime = loadGameRuntime();
const matrix = vm.runInContext(`
  (() => {
    const result = [];
    for (const difficulty of ["easy", "normal", "hard", "crazy"]) {
      selectedDifficulty = difficulty;
      for (const levelId of ["acorn_post_office", "acorn_hunt", "acorn_market", "acorn_notice_board"]) {
        resetGame(levels.findIndex((level) => level.id === levelId));
        result.push({
          difficulty,
          levelId,
          time: state.time,
          realAcorns: state.collectibles.filter((entry) => entry.type === "acorn").length,
          fakeAcorns: state.collectibles.filter((entry) => entry.decoy).length,
          letters: state.collectibles.filter((entry) => entry.type.startsWith("acornLetter")).length,
          fakeFragments: state.collectibles.filter((entry) => entry.fragmentDecoy).length,
          mailboxes: state.tasksList.filter((task) => task.kind === "matched_delivery").length,
          decoyMailboxes: state.tasksList.filter((task) => task.kind === "decoy_target").length,
          blockers: state.tasksList.filter((task) => task.kind === "road_clear").length,
          orders: state.tasksList.filter((task) => task.kind === "market_trade").length,
          carts: state.townCarts.length,
          cartSpeeds: [...new Set(state.townCarts.map((cart) => cart.speed))],
          basketNeed: state.tasksList.find((task) => task.id === "hunt_basket")?.need.length || 0,
          quizzes: state.tasksList.filter((task) => task.kind === "quiz").length,
        });
      }
    }
    return result;
  })();
`, runtime);

const rows = plain(matrix);
const row = (difficulty, levelId) => rows.find((entry) => entry.difficulty === difficulty && entry.levelId === levelId);

assert.deepEqual(row("normal", "acorn_post_office"), {
  difficulty: "normal", levelId: "acorn_post_office", time: 110, realAcorns: 0, fakeAcorns: 0,
  letters: 3, fakeFragments: 0, mailboxes: 3, decoyMailboxes: 0, blockers: 0, orders: 0,
  carts: 2, cartSpeeds: [64], basketNeed: 0, quizzes: 1,
});
assert.deepEqual(row("crazy", "acorn_post_office"), {
  difficulty: "crazy", levelId: "acorn_post_office", time: 80, realAcorns: 0, fakeAcorns: 0,
  letters: 5, fakeFragments: 0, mailboxes: 5, decoyMailboxes: 2, blockers: 0, orders: 0,
  carts: 4, cartSpeeds: [96], basketNeed: 0, quizzes: 1,
});
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((difficulty) => {
    const entry = row(difficulty, "acorn_post_office");
    return [entry.carts, entry.cartSpeeds];
  }),
  [[1, [48]], [2, [64]], [3, [80]], [4, [96]]]
);
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((difficulty) => {
    const entry = row(difficulty, "acorn_hunt");
    return [entry.time, entry.realAcorns, entry.fakeAcorns, entry.blockers, entry.basketNeed];
  }),
  [[140, 6, 0, 1, 6], [120, 6, 0, 2, 6], [105, 8, 2, 2, 8], [90, 10, 3, 3, 10]]
);
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((difficulty) => {
    const entry = row(difficulty, "acorn_market");
    return [entry.carts, entry.cartSpeeds];
  }),
  [[1, [48]], [2, [64]], [3, [80]], [4, [96]]]
);
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((difficulty) => {
    const entry = row(difficulty, "acorn_notice_board");
    return [entry.carts, entry.cartSpeeds];
  }),
  [[1, [48]], [2, [64]], [3, [80]], [4, [96]]]
);
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((difficulty) => {
    const entry = row(difficulty, "acorn_hunt");
    return [entry.carts, entry.cartSpeeds];
  }),
  [[1, [48]], [2, [64]], [3, [80]], [4, [96]]]
);

const quizRunRuntime = loadGameRuntime();
const quizRunResetBehavior = plain(vm.runInContext(`
  (() => {
    selectedDifficulty = "normal";
    const nonAcornIndex = WORLD_MAP.forest_road.levels[0];
    const postOfficeIndex = levels.findIndex((level) => level.id === "acorn_post_office");
    const huntIndex = levels.findIndex((level) => level.id === "acorn_hunt");
    const marketIndex = levels.findIndex((level) => level.id === "acorn_market");
    const api = CATS_OWLS_ACORN_TOWN_QUIZ;
    const currentPair = () => {
      const task = state.tasksList.find((entry) => entry.acornTownShared);
      return {
        core: task.quiz.question,
        bonus: task.bonusQuiz?.question || null,
      };
    };

    resetGame(nonAcornIndex);
    const beforeEntry = api.runSnapshot();
    resetGame(postOfficeIndex);
    const firstEntry = api.runSnapshot();
    const firstPair = currentPair();

    resetGame(postOfficeIndex);
    const restarted = api.runSnapshot();
    const restartPair = currentPair();

    resetGame(huntIndex);
    const withinTown = api.runSnapshot();
    const preservedPair = api.assign("acorn_post_office", "normal");

    resetGame(nonAcornIndex);
    resetGame(marketIndex);
    const reentry = api.runSnapshot();

    return {
      beforeEntry,
      firstEntry,
      firstPair,
      restarted,
      restartPair,
      withinTown,
      preservedPair: {
        core: preservedPair.core.question,
        bonus: preservedPair.bonus?.question || null,
      },
      reentry,
    };
  })();
`, quizRunRuntime));

assert.ok(quizRunResetBehavior.firstEntry.id > quizRunResetBehavior.beforeEntry.id);
assert.equal(quizRunResetBehavior.firstEntry.assignedLevels, 1);
assert.equal(quizRunResetBehavior.restarted.id, quizRunResetBehavior.firstEntry.id);
assert.deepEqual(quizRunResetBehavior.restartPair, quizRunResetBehavior.firstPair);
assert.equal(quizRunResetBehavior.withinTown.id, quizRunResetBehavior.firstEntry.id);
assert.equal(quizRunResetBehavior.withinTown.assignedLevels, 2);
assert.deepEqual(quizRunResetBehavior.preservedPair, quizRunResetBehavior.firstPair);
assert.ok(quizRunResetBehavior.reentry.id > quizRunResetBehavior.firstEntry.id);
assert.equal(quizRunResetBehavior.reentry.assignedLevels, 1);

const routeSafety = vm.runInContext(`
  (() => {
    selectedDifficulty = "crazy";
    return levels
      .filter((level) => level.world === "acorn_town")
      .map((level) => {
        const prepared = prepareAcornTownLevel(level);
        return {
          levelId: level.id,
          insideBounds: prepared.townCarts.every((cart) =>
            cart.minX >= 28 && cart.maxX <= 932 && cart.y >= 80 && cart.y <= 460
          ),
          startSafe: prepared.townCarts.every((cart) =>
            Math.hypot(cart.x - level.start.x, cart.y - level.start.y) >= 72
          ),
          reversalsSafe: prepared.townCarts.every((cart) =>
            prepared.tasks
              .filter((task) => !task.optional)
              .every((task) =>
                Math.hypot(cart.minX - task.x, cart.y - task.y) >= 56 &&
                Math.hypot(cart.maxX - task.x, cart.y - task.y) >= 56
              )
          ),
        };
      });
  })();
`, runtime);

assert.ok(plain(routeSafety).every((entry) =>
  entry.insideBounds && entry.startSafe && entry.reversalsSafe
));

const behavior = vm.runInContext(`
  (() => {
    selectedDifficulty = "crazy";
    resetGame(levels.findIndex((level) => level.id === "acorn_post_office"));
    state.time = 100;
    state.inventory.push("acornLetterRuru");
    const inventoryBeforeWrong = [...state.inventory];
    applyAcornTownWrongAction(0, 0, "错了");
    const wrongAction = { time: state.time, inventory: [...state.inventory] };
    const decoy = state.tasksList.find((task) => task.kind === "decoy_target");
    finishMatchedDelivery(decoy);
    const decoyAction = { time: state.time, inventory: [...state.inventory] };

    const quiz = state.tasksList.find((task) => task.kind === "quiz");
    const lockedQuizAlpha = taskRenderAlpha(quiz);
    openQuiz(quiz);
    const lockedQuiz = { active: state.activeQuiz !== null, message: messageEl.textContent };
    state.tasksList.filter((task) => task.kind !== "quiz" && !task.optional).forEach((task) => { task.done = true; });
    openQuiz(quiz);
    const unlockedQuiz = state.activeQuiz === quiz;
    answerQuiz(quiz, quiz.quiz.answer);

    const trafficCollisions = [];
    for (const difficulty of ["easy", "normal", "hard", "crazy"]) {
      selectedDifficulty = difficulty;
      resetGame(levels.findIndex((level) => level.id === "acorn_post_office"));
      state.time = 100;
      state.hearts = 3;
      state.inventory.push("acornLetterRuru");
      const cart = state.townCarts[0];
      cart.x = state.player.x;
      cart.y = state.player.y;
      updateTownCarts(0);
      const afterFirstHit = state.time;
      updateTownCarts(0);
      trafficCollisions.push({
        difficulty,
        time: afterFirstHit,
        cooldownTime: state.time,
        hearts: state.hearts,
        inventory: [...state.inventory],
      });
    }

    return {
      inventoryBeforeWrong,
      wrongAction,
      decoyAction,
      lockedQuiz,
      lockedQuizAlpha,
      unlockedQuiz,
      quizDone: quiz.done,
      trafficCollisions,
      requiredCount: requiredTasksForCurrentLevel().length,
      totalCount: state.tasksList.length,
    };
  })();
`, runtime);

assert.deepEqual(plain(behavior), {
  inventoryBeforeWrong: ["acornLetterRuru"],
  wrongAction: { time: 95, inventory: ["acornLetterRuru"] },
  decoyAction: { time: 90, inventory: ["acornLetterRuru"] },
  lockedQuiz: { active: false, message: "先完成小镇任务，再来回答最后一题。" },
  lockedQuizAlpha: 0.42,
  unlockedQuiz: true,
  quizDone: true,
  trafficCollisions: [
    { difficulty: "easy", time: 100, cooldownTime: 100, hearts: 3, inventory: ["acornLetterRuru"] },
    { difficulty: "normal", time: 98, cooldownTime: 98, hearts: 3, inventory: ["acornLetterRuru"] },
    { difficulty: "hard", time: 96, cooldownTime: 96, hearts: 3, inventory: ["acornLetterRuru"] },
    { difficulty: "crazy", time: 94, cooldownTime: 94, hearts: 3, inventory: ["acornLetterRuru"] },
  ],
  requiredCount: 6,
  totalCount: 8,
});

const bonusFlow = vm.runInContext(`
  (() => {
    selectedDifficulty = "normal";
    resetGame(levels.findIndex((level) => level.id === "acorn_post_office"));
    const task = state.tasksList.find((entry) => entry.acornTownShared);
    state.tasksList.filter((entry) => entry !== task && !entry.optional).forEach((entry) => { entry.done = true; });
    answerQuiz(task, task.quiz.answer);
    const startTime = state.time;
    const offered = {
      taskDone: task.done,
      status: state.acornBonusStatus,
      canSettle: canSettleCurrentLevel(requiredTasksForCurrentLevel()),
    };
    skipAcornTownBonus();
    const skipped = {
      status: state.acornBonusStatus,
      canSettle: canSettleCurrentLevel(requiredTasksForCurrentLevel()),
      time: state.time,
    };

    resetGame(levels.findIndex((level) => level.id === "acorn_post_office"));
    const correctTask = state.tasksList.find((entry) => entry.acornTownShared);
    state.tasksList.filter((entry) => entry !== correctTask && !entry.optional).forEach((entry) => { entry.done = true; });
    answerQuiz(correctTask, correctTask.quiz.answer);
    openAcornTownBonusQuiz(correctTask);
    const beforeBonusPoints = state.runPoints;
    answerQuiz(correctTask, correctTask.bonusQuiz.answer, "bonus");
    const correct = {
      status: state.acornBonusStatus,
      gained: state.runPoints - beforeBonusPoints,
      time: state.time,
    };

    resetGame(levels.findIndex((level) => level.id === "acorn_post_office"));
    const wrongTask = state.tasksList.find((entry) => entry.acornTownShared);
    state.tasksList.filter((entry) => entry !== wrongTask && !entry.optional).forEach((entry) => { entry.done = true; });
    answerQuiz(wrongTask, wrongTask.quiz.answer);
    openAcornTownBonusQuiz(wrongTask);
    const beforeWrong = { time: state.time, hearts: state.hearts };
    const wrongIndex = (wrongTask.bonusQuiz.answer + 1) % wrongTask.bonusQuiz.options.length;
    answerQuiz(wrongTask, wrongIndex, "bonus");
    const wrong = {
      status: state.acornBonusStatus,
      time: state.time,
      hearts: state.hearts,
      beforeWrong,
    };

    return { startTime, offered, skipped, correct, wrong };
  })();
`, runtime);

assert.deepEqual(plain(bonusFlow.offered), {
  taskDone: true,
  status: "offered",
  canSettle: false,
});
assert.deepEqual(plain(bonusFlow.skipped), {
  status: "resolved",
  canSettle: true,
  time: bonusFlow.startTime,
});
assert.equal(bonusFlow.correct.status, "resolved");
assert.equal(bonusFlow.correct.gained, 10);
assert.equal(bonusFlow.wrong.status, "resolved");
assert.equal(bonusFlow.wrong.time, bonusFlow.wrong.beforeWrong.time);
assert.equal(bonusFlow.wrong.hearts, bonusFlow.wrong.beforeWrong.hearts);

const progression = vm.runInContext(`
  (() => {
    const before = {
      acornTown: isWorldUnlocked("acorn_town"),
      dock: isWorldUnlocked("riverside_dock"),
    };
    markWorldCompleted("forest_road");
    const afterRoad = isWorldUnlocked("acorn_town");
    markWorldCompleted("acorn_town");
    return {
      before,
      afterRoad,
      afterTown: isWorldUnlocked("riverside_dock"),
      completed: [...completedWorlds()].sort(),
    };
  })();
`, runtime);

assert.deepEqual(plain(progression), {
  before: { acornTown: false, dock: false },
  afterRoad: true,
  afterTown: true,
  completed: ["acorn_town", "forest_road"],
});

const transition = vm.runInContext(`
  (() => {
    const forestRoadEnd = WORLD_MAP.forest_road.levels[WORLD_MAP.forest_road.levels.length - 1];
    return {
      next: nextPlayableLevelIndex(forestRoadEnd),
      acornTownStart: WORLD_MAP.acorn_town.levels[0],
    };
  })();
`, runtime);

assert.deepEqual(plain(transition), {
  next: transition.acornTownStart,
  acornTownStart: transition.acornTownStart,
});

const rewards = vm.runInContext(`
  (() => {
    const result = [];
    for (const difficulty of ["easy", "normal", "hard", "crazy"]) {
      selectedDifficulty = difficulty;
      for (const levelId of ["acorn_post_office", "acorn_hunt", "acorn_market"]) {
        resetGame(levels.findIndex((level) => level.id === levelId));
        grantAcornTownLevelReward();
        result.push({ difficulty, levelId, inventory: [...state.inventory] });
      }
    }
    return result;
  })();
`, runtime);

for (const reward of plain(rewards)) {
  if (reward.levelId === "acorn_post_office") assert.deepEqual(reward.inventory, ["postmanBadge"]);
  if (reward.levelId === "acorn_hunt") assert.deepEqual(reward.inventory, Array(5).fill("acorn"));
  if (reward.levelId === "acorn_market") assert.deepEqual(reward.inventory, ["travelStar"]);
}

const routeHints = vm.runInContext(`
  (() => {
    selectedDifficulty = "normal";
    resetGame(levels.findIndex((level) => level.id === "acorn_notice_board"));
    revealAcornTownRouteHint();
    const normal = {
      visible: acornTownRouteHintVisible(),
      until: state.acornRouteHintUntil,
    };

    selectedDifficulty = "crazy";
    resetGame(levels.findIndex((level) => level.id === "acorn_notice_board"));
    revealAcornTownRouteHint();
    const crazyStart = {
      visible: acornTownRouteHintVisible(),
      until: state.acornRouteHintUntil,
    };
    performance.now = () => 6000;
    const crazyExpired = acornTownRouteHintVisible();
    return { normal, crazyStart, crazyExpired };
  })();
`, runtime);

assert.deepEqual(plain(routeHints), {
  normal: { visible: true, until: null },
  crazyStart: { visible: true, until: 5000 },
  crazyExpired: false,
});
