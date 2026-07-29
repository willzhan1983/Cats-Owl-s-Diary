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
  carts: 1, basketNeed: 0, quizzes: 1,
});
assert.deepEqual(row("crazy", "acorn_post_office"), {
  difficulty: "crazy", levelId: "acorn_post_office", time: 80, realAcorns: 0, fakeAcorns: 0,
  letters: 5, fakeFragments: 0, mailboxes: 5, decoyMailboxes: 2, blockers: 0, orders: 0,
  carts: 2, basketNeed: 0, quizzes: 1,
});
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
    return [entry.time, entry.orders, entry.carts];
  }),
  [[145, 2, 0], [125, 2, 1], [110, 3, 1], [95, 3, 2]]
);
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((difficulty) => {
    const entry = row(difficulty, "acorn_notice_board");
    return [entry.time, entry.fakeFragments, entry.carts, entry.quizzes];
  }),
  [[150, 0, 0, 1], [130, 0, 1, 1], [115, 1, 1, 1], [100, 2, 2, 1]]
);

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
    openQuiz(quiz);
    const lockedQuiz = { active: state.activeQuiz !== null, message: messageEl.textContent };
    state.tasksList.filter((task) => task.kind !== "quiz" && !task.optional).forEach((task) => { task.done = true; });
    openQuiz(quiz);
    const unlockedQuiz = state.activeQuiz === quiz;
    answerQuiz(quiz, quiz.quiz.answer);

    resetGame(levels.findIndex((level) => level.id === "acorn_post_office"));
    state.time = 100;
    const cart = state.townCarts[0];
    cart.x = state.player.x;
    cart.y = state.player.y;
    updateTownCarts(0);
    updateTownCarts(0);

    return {
      inventoryBeforeWrong,
      wrongAction,
      decoyAction,
      lockedQuiz,
      unlockedQuiz,
      quizDone: quiz.done,
      cartTime: state.time,
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
  unlockedQuiz: true,
  quizDone: true,
  cartTime: 95,
  requiredCount: 6,
  totalCount: 8,
});

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
