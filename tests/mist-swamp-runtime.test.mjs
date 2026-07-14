import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../game.js", import.meta.url), "utf8");

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
  vm.runInContext(source, context, { filename: "game.js" });
  return context;
}

const runtime = loadGameRuntime();
const levels = runtime.CATS_OWLS_GAME_DATA.levels;
const mistLevels = levels.filter((level) => level.world === "mist_swamp");
const advancedKinds = new Set(["mist_lamp", "firefly_trail", "mushroom_lamp", "broken_bridge", "mist_bubble", "mud_bubble", "mist_core", "mud_boss"]);
const completableKinds = new Set(["delivery", "quiz", "escort_npc", ...advancedKinds]);

assert.equal(mistLevels.length, 5);
for (const level of mistLevels) {
  assert.ok(level.tasks.some((task) => task.done === false && completableKinds.has(task.kind)), `${level.name} should have a completable task`);
}

const fireflyLevel = mistLevels.find((level) => level.name === "萤火虫小径");
assert.deepEqual(
  Array.from(fireflyLevel.tasks).filter((task) => task.animal === "fireflyGuide").map((task) => task.kind),
  ["firefly_trail"]
);

for (const level of levels.filter((entry) => entry.world !== "mist_swamp")) {
  assert.equal(level.tasks.some((task) => advancedKinds.has(task.kind)), false, `${level.name} should not use Mist Swamp task kinds`);
}

const bossOwners = Array.from(levels)
  .filter((level) => level.tasks.some((task) => task.kind === "mud_boss"))
  .map((level) => level.name);
assert.deepEqual(bossOwners, ["沼泽泥浆怪"]);

const normalBossTasks = vm.runInContext(`
  selectedDifficulty = "normal";
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沼泽泥浆怪"));
  state.tasksList.map((task) => ({ kind: task.kind, animal: task.animal }));
`, runtime);
assert.equal(normalBossTasks.filter((task) => task.kind === "mist_lamp" && task.animal === "bigMistLamp").length, 3);
assert.equal(normalBossTasks.filter((task) => task.kind === "mud_bubble").length, 3);
assert.equal(normalBossTasks.filter((task) => task.kind === "mud_boss").length, 1);
assert.equal(normalBossTasks.some((task) => task.kind === "delivery" && task.animal === "mudMonster"), false);
assert.equal(normalBossTasks.some((task) => task.kind === "big_mist_lamp"), false);

const bubbleCounts = {};
for (const [difficulty, expected] of Object.entries({ easy: 2, normal: 3, hard: 4, crazy: 4 })) {
  bubbleCounts[difficulty] = vm.runInContext(`
    selectedDifficulty = "${difficulty}";
    resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沼泽泥浆怪"));
    state.tasksList.filter((task) => task.kind === "mud_bubble").length;
  `, runtime);
  assert.equal(bubbleCounts[difficulty], expected);
}

const trailCompletesAfterItems = vm.runInContext(`
  selectedDifficulty = "normal";
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "萤火虫小径"));
  state.fireflyTrailIndex = state.fireflyTrail.filter((point) => !point.decoy).length;
  state.inventory.push("glowSpore", "glowSpore", "glowSpore", "glowSpore", "bridgeKey");
  updateMistSwampMechanisms(0.016);
  state.tasksList.find((task) => task.kind === "firefly_trail").done;
`, runtime);
assert.equal(trailCompletesAfterItems, true);

const wrongMushroomFeedback = vm.runInContext(`
  selectedDifficulty = "hard";
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沉睡木桥"));
  interactMistSwampTask(state.tasksList.find((task) => task.kind === "mushroom_lamp" && task.color === "blue"));
  ({ step: state.mushroomStep, priorityMessage: state.priorityMessage, priorityMessageUntil: state.priorityMessageUntil });
`, runtime);
assert.equal(wrongMushroomFeedback.step, 0);
assert.match(wrongMushroomFeedback.priorityMessage, /^再看一看萤火虫提示哦。/);
assert.ok(wrongMushroomFeedback.priorityMessageUntil > 0);

for (const [difficulty, plankCount] of Object.entries({ easy: 2, normal: 2, hard: 3, crazy: 3 })) {
  const bridgeSetup = vm.runInContext(`
    selectedDifficulty = "${difficulty}";
    resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沉睡木桥"));
    state.tasksList.push({ kind: "quiz", mistSwampShared: true, done: false });
    prepareSleepingBridgeLevel();
    ({
      plankCount: state.tasksList.find((task) => task.kind === "broken_bridge").need.length,
      completedMushrooms: state.tasksList.filter((task) => task.kind === "mushroom_lamp" && task.done).length,
      completedTasks: state.tasks,
      sharedQuizDone: state.tasksList.find((task) => task.mistSwampShared).done,
      safeZone: state.safeZones.find((zone) => zone.id === "mistBridgeExit"),
      frog: state.tasksList.find((task) => task.animal === "littleFrog"),
    });
  `, runtime);
  assert.equal(bridgeSetup.plankCount, plankCount, `${difficulty} plank requirement`);
  assert.equal(bridgeSetup.completedMushrooms, difficulty === "easy" || difficulty === "normal" ? 4 : 0);
  assert.equal(bridgeSetup.completedTasks, difficulty === "easy" || difficulty === "normal" ? 5 : 1);
  assert.equal(bridgeSetup.sharedQuizDone, true);
  assert.deepEqual(
    bridgeSetup.safeZone && { id: bridgeSetup.safeZone.id, x: bridgeSetup.safeZone.x, y: bridgeSetup.safeZone.y, r: bridgeSetup.safeZone.r },
    { id: "mistBridgeExit", x: 830, y: 210, r: 80 }
  );
  assert.equal(bridgeSetup.frog.kind, "escort_npc");
  assert.equal(bridgeSetup.frog.safeZoneId, "mistBridgeExit");
}

const stableBridgeRepair = vm.runInContext(`
  selectedDifficulty = "easy";
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沉睡木桥"));
  const bridge = state.tasksList.find((task) => task.kind === "broken_bridge");
  state.inventory.push("bridgePlank");
  interactMistSwampTask(bridge);
  const blockedWithOne = !bridge.done;
  state.inventory.push("bridgePlank");
  interactMistSwampTask(bridge);
  const tasksAfterRepair = state.tasks;
  state.priorityMessage = "蘑菇灯都亮啦！";
  state.priorityMessageUntil = 999;
  interactMistSwampTask(bridge);
  state.player.x = bridge.x;
  state.player.y = bridge.y;
  checkTasks(0.016);
  ({ blockedWithOne, done: bridge.done, planksLeft: state.inventory.filter((item) => item === "bridgePlank").length, tasksAfterRepair, tasksAfterRepeat: state.tasks, message: messageEl.textContent });
`, runtime);
assert.equal(stableBridgeRepair.blockedWithOne, true);
assert.equal(stableBridgeRepair.done, true);
assert.equal(stableBridgeRepair.planksLeft, 0);
assert.equal(stableBridgeRepair.tasksAfterRepair, 5);
assert.equal(stableBridgeRepair.tasksAfterRepeat, 5);
assert.match(stableBridgeRepair.message, /已经修好/);

const frogEscort = vm.runInContext(`
  selectedDifficulty = "normal";
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沉睡木桥"));
  const frogBridge = state.tasksList.find((task) => task.kind === "broken_bridge");
  const frogTask = state.tasksList.find((task) => task.animal === "littleFrog");
  state.player.x = frogTask.x;
  state.player.y = frogTask.y;
  updateMistSwampMechanisms(0.016);
  const followedBeforeRepair = frogTask.following;
  state.inventory.push("bridgePlank", "bridgePlank");
  interactMistSwampTask(frogBridge);
  updateMistSwampMechanisms(0.016);
  const followedAfterRepair = frogTask.following;
  state.player.x = 830;
  state.player.y = 210;
  frogTask.x = 830;
  frogTask.y = 210;
  updateMistSwampMechanisms(0.016);
  ({ followedBeforeRepair, followedAfterRepair, frogDone: frogTask.done, frogX: frogTask.x, frogY: frogTask.y, bridgeDone: frogBridge.done, safeZone: state.safeZones[0], completedTasks: state.tasks, totalTasks: state.tasksList.length });
`, runtime);
assert.equal(frogEscort.followedBeforeRepair, false);
assert.equal(frogEscort.followedAfterRepair, true);
assert.equal(frogEscort.frogDone, true, JSON.stringify(frogEscort));
assert.equal(frogEscort.completedTasks, frogEscort.totalTasks);

const legacyTaskKindCounts = Array.from(levels)
  .filter((level) => level.world !== "mist_swamp")
  .flatMap((level) => Array.from(level.tasks, (task) => task.kind))
  .reduce((counts, kind) => ({ ...counts, [kind]: (counts[kind] || 0) + 1 }), {});
assert.deepEqual(legacyTaskKindCounts, {
  action: 12,
  boss: 1,
  delivery: 25,
  direction_sign: 2,
  escort_npc: 2,
  exit_area: 2,
  moon_boss: 1,
  quiz: 15,
  road_clear: 8,
  sort_basket: 3,
});

for (const id of ["fireflyGuide", "littleFrog", "swampSnail", "mistSpirit", "ruru", "mudMonster"]) {
  assert.equal(typeof runtime.CATS_OWLS_GAME_DATA.NPC_REGISTRY[id].renderer, "function", `${id} renderer should be callable`);
}
