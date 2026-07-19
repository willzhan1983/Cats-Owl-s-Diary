import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../game.js", import.meta.url), "utf8");
const mistQuizSource = readFileSync(new URL("../mist-swamp-quiz-bank.js", import.meta.url), "utf8");
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
  assert.equal(bridgeSetup.completedMushrooms, 0);
  assert.equal(bridgeSetup.completedTasks, 1);
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
assert.equal(stableBridgeRepair.tasksAfterRepair, 1);
assert.equal(stableBridgeRepair.tasksAfterRepeat, 1);
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
  ({ followedBeforeRepair, followedAfterRepair, frogDone: frogTask.done, frogX: frogTask.x, frogY: frogTask.y, bridgeDone: frogBridge.done, safeZone: state.safeZones[0], completedTasks: requiredTasksForCurrentLevel().filter((task) => task.done).length, totalTasks: requiredTasksForCurrentLevel().length });
`, runtime);
assert.equal(frogEscort.followedBeforeRepair, false);
assert.equal(frogEscort.followedAfterRepair, true);
assert.equal(frogEscort.frogDone, true, JSON.stringify(frogEscort));
assert.equal(frogEscort.completedTasks, frogEscort.totalTasks);

const timedLampRelight = vm.runInContext(`
  selectedDifficulty = "normal";
  performance.now = () => 100;
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "迷雾沼泽入口"));
  const timedLamp = state.tasksList.find((task) => task.kind === "mist_lamp");
  state.inventory.push("fireflyCore");
  interactMistSwampTask(timedLamp);
  const firstLitUntil = timedLamp.litUntil;
  const tasksAfterFirstLight = state.tasks;
  performance.now = () => firstLitUntil + 1;
  updateMistSwampMechanisms(0.016);
  const expired = !isMistLampActive(timedLamp);
  interactMistSwampTask(timedLamp);
  ({ expired, relit: isMistLampActive(timedLamp), consumedOnce: state.inventory.length === 0, tasksAfterFirstLight, tasksAfterRelight: state.tasks });
`, runtime);
assert.deepEqual(plain(timedLampRelight), { expired: true, relit: true, consumedOnce: true, tasksAfterFirstLight: 1, tasksAfterRelight: 1 });

const easyLampIsPermanent = vm.runInContext(`
  selectedDifficulty = "easy";
  performance.now = () => 100;
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "迷雾沼泽入口"));
  const permanentLamp = state.tasksList.find((task) => task.kind === "mist_lamp");
  state.inventory.push("fireflyCore");
  interactMistSwampTask(permanentLamp);
  performance.now = () => 99999999;
  ({ litUntil: permanentLamp.litUntil, active: isMistLampActive(permanentLamp) });
`, runtime);
assert.deepEqual(plain(easyLampIsPermanent), { litUntil: null, active: true });

const entranceNeedsActiveLight = vm.runInContext(`
  selectedDifficulty = "normal";
  performance.now = () => 100;
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "迷雾沼泽入口"));
  const ruru = state.tasksList.find((task) => task.animal === "ruru");
  const entranceLamp = state.tasksList.find((task) => task.kind === "mist_lamp");
  state.inventory.push("fireflyCore", "fireflyCore");
  const blocked = !canTalkToMistSwampTask(ruru);
  interactMistSwampTask(entranceLamp);
  ({ blocked, allowedAfterLight: canTalkToMistSwampTask(ruru) });
`, runtime);
assert.deepEqual(plain(entranceNeedsActiveLight), { blocked: true, allowedAfterLight: true });

const decoyRollback = vm.runInContext(`
  selectedDifficulty = "hard";
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "萤火虫小径"));
  state.fireflyTrailIndex = 3;
  const hardDecoy = state.fireflyTrail.find((point) => point.decoy);
  state.player.x = hardDecoy.x;
  state.player.y = hardDecoy.y;
  const before = { x: state.player.x, y: state.player.y, inventory: state.inventory.length };
  updateMistSwampMechanisms(0.016);
  ({ index: state.fireflyTrailIndex, faded: hardDecoy.faded, fog: state.mistOpacity, samePosition: state.player.x === before.x && state.player.y === before.y, sameInventory: state.inventory.length === before.inventory });
`, runtime);
assert.equal(decoyRollback.index, 2);
assert.equal(decoyRollback.faded, true);
assert.ok(decoyRollback.fog > 0.32);
assert.equal(decoyRollback.samePosition, true);
assert.equal(decoyRollback.sameInventory, true);

const easyDecoyDoesNotRollback = vm.runInContext(`
  selectedDifficulty = "easy";
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "萤火虫小径"));
  state.fireflyTrailIndex = 3;
  const easyDecoy = state.fireflyTrail.find((point) => point.decoy);
  state.player.x = easyDecoy.x;
  state.player.y = easyDecoy.y;
  updateMistSwampMechanisms(0.016);
  state.fireflyTrailIndex;
`, runtime);
assert.equal(easyDecoyDoesNotRollback, 3);

for (const [difficulty, sequenceLength, required] of [["easy", 2, false], ["normal", 3, false], ["hard", 4, true], ["crazy", 4, true]]) {
  const setup = vm.runInContext(`
    selectedDifficulty = "${difficulty}";
    resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沉睡木桥"));
    ({ length: state.mushroomSequence.length, optional: state.tasksList.filter((task) => task.kind === "mushroom_lamp").every((task) => task.optional === true) });
  `, runtime);
  assert.equal(setup.length, sequenceLength, `${difficulty} mushroom sequence length`);
  assert.equal(setup.optional, !required, `${difficulty} mushroom requirement`);
}

const mistCoreOrder = vm.runInContext(`
  selectedDifficulty = "normal";
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "迷雾核心"));
  const coreLamps = state.tasksList.filter((task) => task.kind === "mist_lamp");
  state.inventory.push("lightSpore", "lightSpore", "lightSpore");
  coreLamps.forEach((lamp) => interactMistSwampTask(lamp));
  const coreBubbles = state.tasksList.filter((task) => task.kind === "mist_bubble");
  interactMistSwampTask(coreBubbles[1]);
  const wrongBlocked = !coreBubbles[1].done && state.mistCoreBubbleIndex === 0;
  coreBubbles.forEach((bubble) => interactMistSwampTask(bubble));
  ({ wrongBlocked, allDone: coreBubbles.every((bubble) => bubble.done), index: state.mistCoreBubbleIndex });
`, runtime);
assert.deepEqual(plain(mistCoreOrder), { wrongBlocked: true, allDone: true, index: 3 });

for (const [difficulty, activeAtOnce] of [["easy", 1], ["normal", 1], ["hard", 2], ["crazy", 2]]) {
  const bossWave = vm.runInContext(`
    selectedDifficulty = "${difficulty}";
    performance.now = () => 100;
    resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沼泽泥浆怪"));
    var bossWaveLamps = state.tasksList.filter((task) => task.kind === "mist_lamp");
    state.inventory.push("lightSpore", "lightSpore", "lightSpore");
    bossWaveLamps.forEach((lamp) => interactMistSwampTask(lamp));
    updateMistSwampMechanisms(0.016);
    ({ phase: state.tasksList.find((task) => task.kind === "mud_boss").phase, active: state.mudBubbles.filter((bubble) => bubble.active && !bubble.done).length });
  `, runtime);
  assert.deepEqual(plain(bossWave), { phase: 2, active: activeAtOnce }, `${difficulty} boss wave`);
}

const bossNeedsConcurrentLamps = vm.runInContext(`
  selectedDifficulty = "normal";
  performance.now = () => 100;
  resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沼泽泥浆怪"));
  const concurrentLamps = state.tasksList.filter((task) => task.kind === "mist_lamp");
  state.inventory.push("lightSpore", "lightSpore", "lightSpore");
  interactMistSwampTask(concurrentLamps[0]);
  performance.now = () => concurrentLamps[0].litUntil + 1;
  interactMistSwampTask(concurrentLamps[1]);
  interactMistSwampTask(concurrentLamps[2]);
  updateMistSwampMechanisms(0.016);
  state.tasksList.find((task) => task.kind === "mud_boss").phase;
`, runtime);
assert.equal(bossNeedsConcurrentLamps, 1);

for (const [difficulty, seconds] of [["easy", 1.2], ["normal", 2], ["hard", 2.5], ["crazy", 3]]) {
  const charge = vm.runInContext(`
    selectedDifficulty = "${difficulty}";
    resetGame(levels.findIndex((level) => level.world === "mist_swamp" && level.name === "沼泽泥浆怪"));
    var chargeBoss = state.tasksList.find((task) => task.kind === "mud_boss");
    chargeBoss.phase = 3;
    state.player.x = chargeBoss.x;
    state.player.y = chargeBoss.y;
    updateMistSwampMechanisms(${seconds - 0.1});
    var chargeReadyBefore = chargeBoss.chargeReady === true;
    updateMistSwampMechanisms(0.11);
    ({ before: chargeReadyBefore, ready: chargeBoss.chargeReady, required: state.lanternChargeRequired });
  `, runtime);
  assert.deepEqual(plain(charge), { before: false, ready: true, required: seconds }, `${difficulty} lantern charge`);
}

const functionalRuntime = loadGameRuntime();
vm.runInContext(mistQuizSource, functionalRuntime, { filename: "mist-swamp-quiz-bank.js" });
const fiveLevelCompletion = vm.runInContext(`
  selectedDifficulty = "normal";
  var completionResults = [];
  var settleCurrentMistLevel = () => {
    scoreSummaryPanel.hidden = true;
    state.running = true;
    update(0);
    completionResults.push({ name: levels[state.levelIndex].name, clear: state.levelClear, settled: state.levelSettled, panel: !scoreSummaryPanel.hidden, pending: requiredTasksForCurrentLevel().filter((task) => !task.done).map((task) => task.kind + ":" + task.name) });
  };

  resetGame(levels.findIndex((level) => level.name === "迷雾沼泽入口"));
  state.inventory.push("fireflyCore", "fireflyCore", "fireflyCore");
  state.tasksList.filter((task) => task.kind === "mist_lamp").forEach((task) => interactMistSwampTask(task));
  var entranceRuru = state.tasksList.find((task) => task.animal === "ruru");
  consumeNeeds(entranceRuru.need);
  completeTask(entranceRuru, entranceRuru.x, entranceRuru.y);
  var entranceQuiz = state.tasksList.find((task) => task.kind === "quiz");
  answerQuiz(entranceQuiz, entranceQuiz.quiz.answer);
  settleCurrentMistLevel();

  resetGame(levels.findIndex((level) => level.name === "萤火虫小径"));
  state.inventory.push("glowSpore", "glowSpore", "glowSpore", "glowSpore", "bridgeKey");
  state.fireflyTrailIndex = state.fireflyTrail.filter((point) => !point.decoy).length;
  updateMistSwampMechanisms(0.016);
  var trailQuiz = state.tasksList.find((task) => task.kind === "quiz");
  answerQuiz(trailQuiz, trailQuiz.quiz.answer);
  settleCurrentMistLevel();

  selectedDifficulty = "hard";
  resetGame(levels.findIndex((level) => level.name === "沉睡木桥"));
  state.mushroomSequence.forEach((color) => interactMistSwampTask(state.tasksList.find((task) => task.kind === "mushroom_lamp" && task.color === color)));
  var fullBridge = state.tasksList.find((task) => task.kind === "broken_bridge");
  state.inventory.push("bridgePlank", "bridgePlank", "bridgePlank");
  interactMistSwampTask(fullBridge);
  var fullFrog = state.tasksList.find((task) => task.animal === "littleFrog");
  fullFrog.following = true;
  state.player.x = 884;
  state.player.y = 200;
  fullFrog.x = 830;
  fullFrog.y = 210;
  updateEscortNpcs(0.016);
  settleCurrentMistLevel();

  selectedDifficulty = "normal";
  resetGame(levels.findIndex((level) => level.name === "迷雾核心"));
  state.inventory.push("lightSpore", "lightSpore", "lightSpore");
  state.tasksList.filter((task) => task.kind === "mist_lamp").forEach((task) => interactMistSwampTask(task));
  state.tasksList.filter((task) => task.kind === "mist_bubble").forEach((task) => interactMistSwampTask(task));
  var coreQuiz = state.tasksList.find((task) => task.kind === "quiz");
  answerQuiz(coreQuiz, coreQuiz.quiz.answer);
  var fullCore = state.tasksList.find((task) => task.kind === "mist_core");
  interactMistSwampTask(fullCore);
  settleCurrentMistLevel();

  performance.now = () => 100;
  resetGame(levels.findIndex((level) => level.name === "沼泽泥浆怪"));
  state.inventory.push("lightSpore", "lightSpore", "lightSpore");
  state.tasksList.filter((task) => task.kind === "mist_lamp").forEach((task) => interactMistSwampTask(task));
  updateMistSwampMechanisms(0.016);
  var fullBoss = state.tasksList.find((task) => task.kind === "mud_boss");
  state.running = true;
  while (fullBoss.phase === 2) {
    var activeBubble = state.mudBubbles.find((bubble) => bubble.active && !bubble.done);
    state.player.x = activeBubble.x;
    state.player.y = activeBubble.y;
    updateMistSwampMechanisms(0.016);
    talkToNearbyTask();
    updateMistSwampMechanisms(0.016);
  }
  state.player.x = fullBoss.x;
  state.player.y = fullBoss.y;
  updateMistSwampMechanisms(state.lanternChargeRequired + 0.01);
  interactMistSwampTask(fullBoss);
  answerQuiz(fullBoss, (fullBoss.quiz.answer + 1) % fullBoss.quiz.options.length);
  var wrongOnlyResetCharge = fullBoss.phase === 3 && !fullBoss.done && state.lanternCharge === 0;
  updateMistSwampMechanisms(state.lanternChargeRequired + 0.01);
  interactMistSwampTask(fullBoss);
  answerQuiz(fullBoss, fullBoss.quiz.answer);
  settleCurrentMistLevel();
  ({ completionResults, wrongOnlyResetCharge, bossReward: state.inventory.includes("mistGuardianBadge") });
`, functionalRuntime);
assert.equal(fiveLevelCompletion.wrongOnlyResetCharge, true);
assert.equal(fiveLevelCompletion.bossReward, true);
assert.deepEqual(Array.from(fiveLevelCompletion.completionResults, (result) => plain(result)), [
  { name: "迷雾沼泽入口", clear: true, settled: true, panel: true, pending: [] },
  { name: "萤火虫小径", clear: true, settled: true, panel: true, pending: [] },
  { name: "沉睡木桥", clear: true, settled: true, panel: true, pending: [] },
  { name: "迷雾核心", clear: true, settled: true, panel: true, pending: [] },
  { name: "沼泽泥浆怪", clear: true, settled: true, panel: true, pending: [] },
]);

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
