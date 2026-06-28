const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const homeScreen = document.getElementById("homeScreen");
const enterBtn = document.getElementById("enterBtn");
const roleButtons = document.querySelectorAll("[data-role]");
const startBtn = document.getElementById("startBtn");
const messageEl = document.getElementById("message");
const levelEl = document.getElementById("level");
const heartsEl = document.getElementById("hearts");
const timeEl = document.getElementById("time");
const tasksEl = document.getElementById("tasks");
const bagEl = document.getElementById("bag");
const soundBtn = document.getElementById("soundBtn");
const attackBtn = document.getElementById("attackBtn");
const quizPanel = document.getElementById("quizPanel");
const quizTitle = document.getElementById("quizTitle");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const dialoguePanel = document.getElementById("dialoguePanel");
const dialogueAvatar = document.getElementById("dialogueAvatar");
const dialogueName = document.getElementById("dialogueName");
const dialogueRole = document.getElementById("dialogueRole");
const dialogueText = document.getElementById("dialogueText");
const dialogueCloseBtn = document.getElementById("dialogueCloseBtn");
const dialogueNextBtn = document.getElementById("dialogueNextBtn");
const dialogueGiveBtn = document.getElementById("dialogueGiveBtn");
const dialogueQuizBtn = document.getElementById("dialogueQuizBtn");
const dialogueBtn = document.getElementById("dialogueBtn");

const text = {
  start: "\u5f00\u59cb",
  restart: "\u91cd\u6765",
  next: "\u4e0b\u4e00\u5173",
  again: "\u518d\u73a9",
  intro: "\u5e2e\u5c0f\u732b\u548c\u732b\u5934\u9e70\u5b8c\u6210\u68ee\u6797\u5b66\u6821\u4efb\u52a1\u3002",
  move: "\u65b9\u5411\u952e\u6216\u5c4f\u5e55\u6309\u94ae\u79fb\u52a8\uff0c\u770b\u770b\u8c01\u9700\u8981\u5e2e\u5fd9\u3002",
  puddle: "\u8e29\u5230\u5c0f\u6c34\u5751\uff0c\u6162\u4e00\u70b9\u70b9\u3002",
  timeUp: "\u65f6\u95f4\u5230\u5566\uff0c\u518d\u8bd5\u4e00\u6b21\u3002",
  allDone: "\u5927 Boss \u88ab\u6253\u8d25\u5566\uff0c\u68ee\u6797\u5b66\u6821\u6062\u590d\u660e\u4eae\uff01",
};

const backgroundSources = {
  schoolyard: "./assets/bg-level1-schoolyard.png",
  forest: "./assets/bg-level2-forest.png",
  adventure: "./assets/bg-level3-adventure.png",
  classroom: "./assets/bg-level4-classroom.png",
  courage: "./assets/bg-level5-courage.jpg",
  boss: "./assets/bg-level6-boss.jpg",
  cityRoad: "./assets/v2/v2-bg-city-road.png",
  pondSide: "./assets/v2/v2-bg-pond.png",
  wetland: "./assets/v2/v2-bg-wetland.png",
  swampBoss: "./assets/v2/v2-bg-swamp-boss.png",
  forestSchool: "./assets/bg-level1-schoolyard.png",
  riverTown: "./assets/v2/v2-bg-city-road.png",
  darkSwamp: "./assets/v2/v2-bg-swamp-boss.png",
};

const backgroundSourceCandidates = {
  schoolyard: ["./assets/bg-level1-schoolyard.png", "./assets/v2/v2-forest-school-background.png"],
  forest: ["./assets/bg-level2-forest.png", "./assets/v2/v2-forest-school-background.png"],
  cityRoad: ["./assets/v2/v2-bg-city-road.png", "./assets/bg-level3-adventure.png"],
  classroom: ["./assets/bg-level4-classroom.png", "./assets/bg-level1-schoolyard.png"],
  pondSide: ["./assets/v2/v2-bg-pond.png", "./assets/bg-level5-courage.jpg"],
  wetland: ["./assets/v2/v2-bg-wetland.png", "./assets/v2/v2-bg-pond.png"],
  swampBoss: ["./assets/v2/v2-bg-swamp-boss.png", "./assets/bg-level6-boss.jpg"],
  adventure: ["./assets/bg-level3-adventure.png", "./assets/v2/v2-bg-city-road.png"],
  courage: ["./assets/bg-level5-courage.jpg", "./assets/v2/v2-bg-pond.png"],
  boss: ["./assets/bg-level6-boss.jpg", "./assets/v2/v2-bg-swamp-boss.png"],
  forestSchool: ["./assets/bg-level1-schoolyard.png", "./assets/v2/v2-forest-school-background.png"],
  riverTown: ["./assets/v2/v2-bg-city-road.png", "./assets/v2/v2-bg-pond.png"],
  darkSwamp: ["./assets/v2/v2-bg-swamp-boss.png", "./assets/v2/v2-bg-wetland.png"],
};

const backgrounds = {};
const backgroundCandidateIndex = {};
const characterSheet = new Image();
characterSheet.decoding = "async";
characterSheet.src = "./assets/v2/v2-main-character-spritesheet-3d-clean.png";

const PLAYER_CHARACTER_ASSETS = {
  cat: {
    displayName: "Mimi / \u8a79\u6d9e\u513f",
    characterId: "mimi",
    idle: ["./assets/characters/mimi/v5/idle.png"],
    walk: [
      "./assets/characters/mimi/v5/walk_1.png",
      "./assets/characters/mimi/v5/walk_2.png",
      "./assets/characters/mimi/v5/walk_3.png",
      "./assets/characters/mimi/v5/walk_4.png",
    ],
    jump: ["./assets/characters/mimi/v5/jump.png"],
    happy: ["./assets/characters/mimi/v5/happy.png"],
    sit: [],
    thinking: [],
    holdDiary: [],
  },
  owl: {
    displayName: "Owlly / \u59da\u5934\u9e70",
    characterId: "owlly",
    idle: ["./assets/characters/owlly/v5/idle.png"],
    walk: [
      "./assets/characters/owlly/v5/fly_1.png",
      "./assets/characters/owlly/v5/fly_2.png",
      "./assets/characters/owlly/v5/fly_3.png",
    ],
    jump: ["./assets/characters/owlly/v5/fly_2.png"],
    write: ["./assets/characters/owlly/v5/write.png"],
    happy: ["./assets/characters/owlly/v5/happy.png"],
    nod: [],
    thinking: [],
    turnAround: [],
    wink: [],
  },
};

const LEGACY_PLAYER_CHARACTER_ASSETS = {
  cat: {
    idle: ["./assets/characters/mimi/idle.svg"],
    walk: ["./assets/characters/mimi/walk.svg", "./assets/characters/mimi/idle.svg"],
    jump: ["./assets/characters/mimi/walk.svg"],
    happy: ["./assets/characters/mimi/happy.svg"],
  },
  owl: {
    idle: ["./assets/characters/owlly/idle.svg"],
    walk: ["./assets/characters/owlly/fly.svg", "./assets/characters/owlly/idle.svg"],
    jump: ["./assets/characters/owlly/fly.svg"],
    happy: ["./assets/characters/owlly/idle.svg"],
  },
};

const PLAYER_DRAW_SIZE = {
  cat: { width: 74, height: 94, footOffsetY: 24 },
  owl: { width: 78, height: 88, footOffsetY: 22 },
};

const PLAYER_DISPLAY_NAMES = {
  cat: "Mimi / \u8a79\u6d9e\u513f",
  owl: "Owlly / \u59da\u5934\u9e70",
};

const playerImages = {};
const legacyPlayerImages = {};

function mappedImage(src) {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  return image;
}

const CHARACTER_REGISTRY = {
  mimi: {
    id: "mimi",
    name: "Mimi",
    displayName: "Mimi / \u8a79\u6d9e\u513f",
    role: "player",
    species: "white_cat",
    asset: "./assets/characters/mimi/v5/idle.png",
    image: mappedImage("./assets/characters/mimi/v5/idle.png"),
  },
  owlly: {
    id: "owlly",
    name: "Owlly",
    displayName: "Owlly / \u59da\u5934\u9e70",
    role: "companion",
    species: "owl",
    asset: "./assets/characters/owlly/v5/idle.png",
    image: mappedImage("./assets/characters/owlly/v5/idle.png"),
  },
  blackBear: {
    id: "blackBear",
    name: "Black Bear",
    role: "boss",
    species: "bear",
    asset: "./assets/boss/black-bear/idle.svg",
    image: mappedImage("./assets/boss/black-bear/idle.svg"),
  },
};

const TASK_TYPES = {
  FETCH_ITEM: "fetch_item",
  HELP_NPC: "help_npc",
  SIMPLE_PUZZLE: "simple_puzzle",
  BOSS_FIGHT: "boss_fight",
};

const PROP_USAGE_POLICY = {
  taskItem: "only appears in levels where the task needs it",
  decoration: "appears sparingly when it fits the scene",
  reward: "appears in reward or hidden-object scenes",
  keyItem: "appears only for route, story, or unlock moments",
};

const NPC_REGISTRY = {
  deer: { id: "deer", displayName: "\u5c0f\u9e7f", renderer: drawDeer, world: "forest_school" },
  squirrel: { id: "squirrel", displayName: "\u677e\u9f20", renderer: drawSquirrel, world: "forest_school" },
  rabbit: { id: "rabbit", displayName: "\u5154\u8001\u5e08", renderer: drawRabbit, world: "forest_school" },
  ant: { id: "ant", displayName: "\u8682\u8681", renderer: drawAnt, world: "forest_school" },
  butterfly: { id: "butterfly", displayName: "\u8774\u8776", renderer: drawButterfly, world: "forest_school" },
  fox: { id: "fox", displayName: "\u5c0f\u72d0", renderer: drawFox, world: "river_town" },
  firefly: { id: "firefly", displayName: "\u8424\u706b\u866b", renderer: drawFirefly, world: "river_town" },
  hedgehog: { id: "hedgehog", displayName: "\u523a\u732c\u540c\u5b66", renderer: drawHedgehog, world: "river_town" },
  owl: { id: "owl", displayName: "Owlly / \u59da\u5934\u9e70", renderer: () => drawOwl(0, 4, 0.92), world: "forest_school" },
  boss: { id: "boss", displayName: "Black Bear", renderer: drawForestBoss, characterId: "blackBear", world: "dark_swamp" },
};

const DIALOGUE_LIBRARY = {
  deer: {
    intro: ["你好呀，我今天想吃一个甜甜的苹果。"],
    missing: ["如果你看到红红的苹果，可以带给我吗？"],
    ready: ["你找到苹果啦！可以给我吗？"],
    complete: ["谢谢你！苹果真甜。"],
    after: ["谢谢 Mimi / 詹涞儿 和 Owlly / 姚头鹰！"],
  },
  squirrel: {
    intro: ["我的铅笔不见了，今天还要写森林日记呢。"],
    missing: ["铅笔可能掉在路边了。"],
    ready: ["这就是我的铅笔！太好了。"],
    complete: ["谢谢你，我可以继续写日记啦。"],
    after: ["今天的森林日记会写下你的名字。"],
  },
  rabbit: {
    intro: ["同学们的作业本要收齐啦。"],
    missing: ["我还需要作业本和一个奖励苹果。"],
    ready: ["你都带来了，真细心。"],
    complete: ["森林学校为你加一颗爱心！"],
    after: ["谢谢你，今天也要开心学习哦。"],
  },
  ant: {
    intro: ["叶子把路挡住了，我需要一把叶子扫帚。"],
    missing: ["小小的扫帚，可以帮大忙。"],
    ready: ["这把叶子扫帚正合适。"],
    complete: ["路又干净啦，谢谢你！"],
  },
  butterfly: {
    intro: ["花园想开花，需要花种和叶子扫帚。"],
    missing: ["有花种和扫帚，花园就会变漂亮。"],
    ready: ["太好了，花园要开花啦。"],
    complete: ["花香飘起来了，谢谢你！"],
  },
  fox: {
    intro: ["我的小铃铛不见了，听不到叮铃声啦。"],
    missing: ["如果看到小铃铛，请带给我。"],
    ready: ["叮铃铃！这就是我的铃铛。"],
    complete: ["谢谢你，我又能听到清脆的声音啦。"],
  },
  firefly: {
    intro: ["天有点暗，我想找到一盏小灯笼。"],
    missing: ["有了灯笼，夜路就不怕啦。"],
    ready: ["灯笼亮起来了，好温暖。"],
    complete: ["谢谢你帮我点亮小路。"],
  },
  owl: {
    intro: ["回家的路线要看清楚，地图很重要。"],
    missing: ["请帮我找地图和奖励苹果。"],
    ready: ["路线清楚啦，准备回森林学校。"],
    complete: ["谢谢你，冒险路线更安全了。"],
  },
  hedgehog: {
    intro: ["我有点害怕，需要一颗勇气星。"],
    missing: ["勇气星会让我更勇敢。"],
    ready: ["这颗勇气星亮晶晶的。"],
    complete: ["我不害怕了，谢谢你！"],
  },
  chest: {
    intro: ["想打开我，需要魔法铅笔和守护书。"],
    missing: ["把两个宝贝都带来，我就会打开。"],
    ready: ["魔法准备好了，要打开宝箱吗？"],
    complete: ["咔哒，宝箱打开啦！"],
  },
  boss: {
    missing: ["黑熊怪很强，我们要先收集勇气星、魔法铅笔或守护书。"],
    ready: ["准备好了吗？按攻击键，把道具发射出去！"],
    after: ["黑熊怪已经被打败，森林又亮起来啦。"],
  },
};

const WORLD_MAP = {
  forest_school: {
    id: "forest_school",
    name: "Forest School",
    background: "forestSchool",
    levels: [0, 1, 3],
    taskTypes: [TASK_TYPES.FETCH_ITEM, TASK_TYPES.HELP_NPC, TASK_TYPES.SIMPLE_PUZZLE],
  },
  river_town: {
    id: "river_town",
    name: "River Town",
    background: "riverTown",
    levels: [2, 4, 5],
    taskTypes: [TASK_TYPES.FETCH_ITEM, TASK_TYPES.HELP_NPC, TASK_TYPES.SIMPLE_PUZZLE],
  },
  dark_swamp: {
    id: "dark_swamp",
    name: "Dark Swamp",
    background: "darkSwamp",
    levels: [6],
    taskTypes: [TASK_TYPES.FETCH_ITEM, TASK_TYPES.BOSS_FIGHT],
    boss: "blackBear",
  },
};

const dayNames = ["\u7b2c\u4e00\u5929", "\u7b2c\u4e8c\u5929", "\u7b2c\u4e09\u5929", "\u7b2c\u56db\u5929", "\u7b2c\u4e94\u5929", "\u7b2c\u516d\u5929", "\u7b2c\u4e03\u5929"];

const keys = new Set();
const touchDirs = new Set();
let lastFrame = performance.now();
let state;
let gameEntered = false;
let selectedRole = localStorage.getItem("catsOwlRole") || "cat";

const music = {
  ctx: null,
  master: null,
  timer: null,
  enabled: true,
  pattern: "",
  step: 0,
};

function ensureBackground(key) {
  if (!key || backgrounds[key]) return backgrounds[key];
  const candidates = (backgroundSourceCandidates[key] || [backgroundSources[key]]).filter(Boolean);
  if (!candidates.length) return null;
  backgroundCandidateIndex[key] = 0;
  const image = new Image();
  image.decoding = "async";
  image.onerror = () => {
    const nextIndex = (backgroundCandidateIndex[key] || 0) + 1;
    const nextSource = candidates[nextIndex];
    if (!nextSource) return;
    backgroundCandidateIndex[key] = nextIndex;
    image.src = nextSource;
  };
  image.src = candidates[0];
  backgrounds[key] = image;
  return image;
}

function preloadNearbyBackgrounds(levelIndex) {
  const current = levelBackgroundKey(levels[levelIndex]);
  const next = levelBackgroundKey(levels[levelIndex + 1]);
  ensureBackground(current);
  window.setTimeout(() => ensureBackground(next), 800);
}

const quizBank = {
  math: [
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "27 + 16 = ?", options: ["33", "41", "43", "45"], answer: 2 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "9 \u00d7 4 = ?", options: ["32", "36", "38", "40"], answer: 1 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "56 - 19 = ?", options: ["35", "36", "37", "39"], answer: 2 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "48 \u00f7 6 = ?", options: ["6", "7", "8", "9"], answer: 2 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "\u4e00\u672c\u4e66 12 \u9875\uff0c\u770b\u4e86 5 \u9875\uff0c\u8fd8\u5269\u51e0\u9875\uff1f", options: ["5", "6", "7", "8"], answer: 2 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "18 + 24 - 9 = ?", options: ["31", "32", "33", "34"], answer: 2 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "6 \u00d7 7 - 8 = ?", options: ["32", "34", "36", "40"], answer: 1 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "3 \u4e2a\u7bee\u5b50\uff0c\u6bcf\u4e2a 8 \u4e2a\u82f9\u679c\uff0c\u4e00\u5171\u51e0\u4e2a\uff1f", options: ["18", "21", "24", "28"], answer: 2 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "1 \u7c73 = \u51e0\u5398\u7c73\uff1f", options: ["10", "50", "100", "1000"], answer: 2 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "96 \u00f7 8 + 7 = ?", options: ["17", "18", "19", "20"], answer: 2 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "125 + 236 = ?", options: ["351", "361", "371", "381"], answer: 1 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "\u4e00\u5305\u7cd6 36 \u9897\uff0c\u5e73\u5747\u5206\u7ed9 4 \u4eba\uff0c\u6bcf\u4eba\u51e0\u9897\uff1f", options: ["8", "9", "10", "12"], answer: 1 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "3 \u65f6 = \u51e0\u5206\u949f\uff1f", options: ["30", "90", "120", "180"], answer: 3 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "240 - 86 = ?", options: ["144", "154", "164", "174"], answer: 1 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "15 \u00d7 6 = ?", options: ["80", "85", "90", "96"], answer: 2 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "\u4e00\u4e2a\u6b63\u65b9\u5f62\u8fb9\u957f 6 \u5398\u7c73\uff0c\u5468\u957f\u662f\uff1f", options: ["12", "18", "24", "36"], answer: 2 },
    { title: "\u6570\u5b66\u5c0f\u6e38\u620f", question: "\u4ece 3\u30016\u30019\u300112 \u770b\uff0c\u4e0b\u4e00\u4e2a\u6570\u662f\uff1f", options: ["13", "14", "15", "18"], answer: 2 },
  ],
  logic: [
    { title: "\u68ee\u6797\u903b\u8f91\u9898", question: "\u82f9\u679c\u3001\u4e66\u3001\u94c5\u7b14\u6309\u987a\u5e8f\u91cd\u590d\uff0c\u4e0b\u4e00\u4e2a\u662f\uff1f", options: ["\u82f9\u679c", "\u4e66", "\u94c5\u7b14", "\u836f\u6c34"], answer: 0 },
    { title: "\u68ee\u6797\u903b\u8f91\u9898", question: "\u5c0f\u732b\u6bd4\u5154\u5b50\u65e9\u5230\uff0c\u5154\u5b50\u6bd4\u677e\u9f20\u65e9\u5230\uff0c\u8c01\u6700\u665a\uff1f", options: ["\u5c0f\u732b", "\u5154\u5b50", "\u677e\u9f20", "\u90fd\u4e00\u6837"], answer: 2 },
    { title: "\u68ee\u6797\u903b\u8f91\u9898", question: "\u4e24\u9897\u661f\u6362\u4e00\u672c\u4e66\uff0c\u56db\u9897\u661f\u80fd\u6362\u51e0\u672c\u4e66\uff1f", options: ["1", "2", "3", "4"], answer: 1 },
    { title: "\u68ee\u6797\u903b\u8f91\u9898", question: "\u5982\u679c\u4e0b\u96e8\u5c31\u5e26\u4f1e\u3002\u4eca\u5929\u4e0b\u96e8\uff0c\u5e94\u8be5\u5e26\u4ec0\u4e48\uff1f", options: ["\u4f1e", "\u706f\u7b3c", "\u94c3\u94db", "\u5730\u56fe"], answer: 0 },
    { title: "\u68ee\u6797\u903b\u8f91\u9898", question: "\u7ea2\u82b1\u5728\u84dd\u82b1\u5de6\u8fb9\uff0c\u9ec4\u82b1\u5728\u84dd\u82b1\u53f3\u8fb9\uff0c\u4e2d\u95f4\u662f\uff1f", options: ["\u7ea2\u82b1", "\u84dd\u82b1", "\u9ec4\u82b1", "\u6811"], answer: 1 },
    { title: "\u68ee\u6797\u903b\u8f91\u9898", question: "\u4e00\u6761\u8def\u53ea\u80fd\u5411\u5317\u6216\u5411\u4e1c\u8d70\uff0c\u54ea\u4e2a\u65b9\u5411\u4e0d\u80fd\u9009\uff1f", options: ["\u5317", "\u4e1c", "\u5357", "\u5411\u524d"], answer: 2 },
    { title: "\u68ee\u6797\u903b\u8f91\u9898", question: "\u9e7f\u3001\u5154\u3001\u677e\u9f20\u90fd\u662f\u52a8\u7269\uff0c\u54ea\u4e2a\u4e0d\u662f\u540c\u4e00\u7c7b\uff1f", options: ["\u9e7f", "\u5154", "\u677e\u9f20", "\u94c5\u7b14"], answer: 3 },
    { title: "\u68ee\u6797\u903b\u8f91\u9898", question: "\u4ece\u5c0f\u5230\u5927\u6392\uff1a\u6811\u82d7\u3001\u5927\u6811\u3001\u79cd\u5b50\uff0c\u7b2c\u4e00\u4e2a\u662f\uff1f", options: ["\u5927\u6811", "\u6811\u82d7", "\u79cd\u5b50", "\u6811\u5c4b"], answer: 2 },
  ],
  science: [
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u690d\u7269\u8fdb\u884c\u5149\u5408\u4f5c\u7528\uff0c\u4e3b\u8981\u9700\u8981\u9633\u5149\u3001\u6c34\u548c\u4ec0\u4e48\uff1f", options: ["\u6c27\u6c14", "\u4e8c\u6c27\u5316\u78b3", "\u7802\u5b50", "\u94c1\u5757"], answer: 1 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u54ea\u4e2a\u7269\u4f53\u6700\u5bb9\u6613\u88ab\u78c1\u94c1\u5438\u4f4f\uff1f", options: ["\u6728\u5934", "\u7eb8\u7247", "\u94c1\u9489", "\u6a61\u76ae"], answer: 2 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u6c34\u53d8\u6210\u6c34\u84b8\u6c14\u7684\u8fc7\u7a0b\u53eb\u4ec0\u4e48\uff1f", options: ["\u84b8\u53d1", "\u7ed3\u51b0", "\u53d1\u5149", "\u6c89\u964d"], answer: 0 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u5730\u7403\u4e0a\u767d\u5929\u548c\u9ed1\u591c\u4ea4\u66ff\uff0c\u4e3b\u8981\u56e0\u4e3a\u5730\u7403\u5728\u505a\u4ec0\u4e48\uff1f", options: ["\u81ea\u8f6c", "\u5531\u6b4c", "\u53d8\u8272", "\u957f\u5927"], answer: 0 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u4e0b\u9762\u54ea\u4e2a\u662f\u6606\u866b\uff1f", options: ["\u8718\u86db", "\u8774\u8776", "\u5c0f\u9c7c", "\u8717\u725b"], answer: 1 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u58f0\u97f3\u80fd\u5728\u54ea\u91cc\u4f20\u64ad\uff1f", options: ["\u7a7a\u6c14\u4e2d", "\u771f\u7a7a\u4e2d", "\u6ca1\u6709\u5730\u65b9", "\u53ea\u5728\u7eb8\u4e0a"], answer: 0 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u98df\u7269\u94fe\u4e2d\uff0c\u9752\u8349\u901a\u5e38\u5c5e\u4e8e\u4ec0\u4e48\uff1f", options: ["\u751f\u4ea7\u8005", "\u6d88\u8d39\u8005", "\u673a\u5668", "\u77f3\u5934"], answer: 0 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u6708\u4eae\u672c\u8eab\u4f1a\u53d1\u5149\u5417\uff1f", options: ["\u4f1a", "\u4e0d\u4f1a\uff0c\u53cd\u5c04\u592a\u9633\u5149", "\u53ea\u5728\u767d\u5929\u4f1a", "\u53ea\u5728\u4e0b\u96e8\u65f6\u4f1a"], answer: 1 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u54ea\u4e2a\u662f\u54fa\u4e73\u52a8\u7269\uff1f", options: ["\u91d1\u9c7c", "\u9752\u86d9", "\u5c0f\u732b", "\u8774\u8776"], answer: 2 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u79cd\u5b50\u53d1\u82bd\u6700\u9700\u8981\u4ec0\u4e48\uff1f", options: ["\u6c34\u548c\u7a7a\u6c14", "\u94c1\u5757", "\u73bb\u7483", "\u6a61\u76ae"], answer: 0 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u592a\u9633\u662f\u5730\u7403\u4e0a\u54ea\u79cd\u80fd\u91cf\u7684\u91cd\u8981\u6765\u6e90\uff1f", options: ["\u5149\u548c\u70ed", "\u58f0\u97f3", "\u77f3\u5934", "\u6c99\u5b50"], answer: 0 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u6c34\u5728 0\u2103 \u5de6\u53f3\u901a\u5e38\u4f1a\u53d8\u6210\u4ec0\u4e48\uff1f", options: ["\u51b0", "\u706b", "\u7eb8", "\u6728\u5934"], answer: 0 },
    { title: "\u79d1\u5b66\u5c0f\u6e38\u620f", question: "\u54ea\u4e2a\u5668\u5b98\u5e2e\u52a9\u6211\u4eec\u547c\u5438\uff1f", options: ["\u80ba", "\u94c5\u7b14", "\u4e66\u5305", "\u6811\u53f6"], answer: 0 },
  ],
  language: [
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u4e0b\u9762\u54ea\u4e2a\u8bcd\u548c\u201c\u5feb\u4e50\u201d\u610f\u601d\u6700\u63a5\u8fd1\uff1f", options: ["\u96be\u8fc7", "\u9ad8\u5174", "\u5b89\u9759", "\u5e72\u51c0"], answer: 1 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u201c\u68ee\u201d\u5b57\u7531\u51e0\u4e2a\u201c\u6728\u201d\u7ec4\u6210\uff1f", options: ["1\u4e2a", "2\u4e2a", "3\u4e2a", "4\u4e2a"], answer: 2 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u4e0b\u9762\u54ea\u4e2a\u662f\u91cf\u8bcd\uff1f", options: ["\u4e00\u53ea\u732b", "\u5f88\u9ad8", "\u8dd1\u5f97\u5feb", "\u7eff\u8272"], answer: 0 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u201c\u6e05\u6f88\u201d\u901a\u5e38\u7528\u6765\u5f62\u5bb9\u4ec0\u4e48\uff1f", options: ["\u6c34", "\u77f3\u5934", "\u978b\u5b50", "\u94c5\u7b14"], answer: 0 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u201c\u8ba4\u771f\u201d\u7684\u53cd\u4e49\u8bcd\u66f4\u63a5\u8fd1\u54ea\u4e2a\uff1f", options: ["\u9a6c\u864e", "\u52aa\u529b", "\u4ed4\u7ec6", "\u9ad8\u5174"], answer: 0 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u4e0b\u9762\u54ea\u4e2a\u6210\u8bed\u8868\u793a\u201c\u975e\u5e38\u5feb\u201d\uff1f", options: ["\u6162\u6761\u65af\u7406", "\u98ce\u9a70\u7535\u63a3", "\u4e00\u5fc3\u4e00\u610f", "\u4e94\u989c\u516d\u8272"], answer: 1 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u201c\u732b\u5934\u9e70\u5728\u6811\u4e0a\u770b\u4e66\u3002\u201d\u8fd9\u53e5\u8bdd\u7684\u52a8\u4f5c\u662f\uff1f", options: ["\u6811", "\u770b", "\u4e66", "\u732b\u5934\u9e70"], answer: 1 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u201c\u5c0f\u732b\u8f7b\u8f7b\u5730\u8d70\u8fc7\u8349\u5730\u3002\u201d\u4fee\u9970\u201c\u8d70\u201d\u7684\u8bcd\u662f\uff1f", options: ["\u5c0f\u732b", "\u8f7b\u8f7b\u5730", "\u8349\u5730", "\u8d70\u8fc7"], answer: 1 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u201c\u6d53\u5bc6\u201d\u66f4\u5e38\u7528\u6765\u5f62\u5bb9\u54ea\u4e2a\uff1f", options: ["\u5934\u53d1", "\u94c3\u94db", "\u6570\u5b66", "\u65f6\u95f4"], answer: 0 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u201c\u5174\u9ad8\u91c7\u70c8\u201d\u8868\u793a\u5fc3\u60c5\u600e\u4e48\u6837\uff1f", options: ["\u9ad8\u5174", "\u5bb3\u6015", "\u751f\u6c14", "\u56f0\u4e86"], answer: 0 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u201c\u5b89\u9759\u201d\u7684\u8fd1\u4e49\u8bcd\u662f\uff1f", options: ["\u5b81\u9759", "\u5435\u95f9", "\u5feb\u901f", "\u660e\u4eae"], answer: 0 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u54ea\u4e2a\u53e5\u5b50\u9700\u8981\u95ee\u53f7\uff1f", options: ["\u4eca\u5929\u5929\u6c14\u771f\u597d", "\u4f60\u5403\u996d\u4e86\u5417", "\u6211\u559c\u6b22\u68ee\u6797", "\u5c0f\u9e1f\u5728\u5531\u6b4c"], answer: 1 },
    { title: "\u8bed\u6587\u5c0f\u6e38\u620f", question: "\u201c\u4ed6\u50cf\u5c0f\u9e1f\u4e00\u6837\u5feb\u6d3b\u3002\u201d\u7528\u4e86\u4ec0\u4e48\u4fee\u8f9e\uff1f", options: ["\u6bd4\u55bb", "\u6392\u6bd4", "\u53cd\u95ee", "\u5938\u5f20"], answer: 0 },
  ],
  english: [
    { title: "English Mini Game", question: "Which sentence is correct?", options: ["I am a cat.", "I is a cat.", "I are a cat.", "I be a cat."], answer: 0 },
    { title: "English Mini Game", question: "Which word means \u201c\u732b\u5934\u9e70\u201d?", options: ["cat", "owl", "book", "tree"], answer: 1 },
    { title: "English Mini Game", question: "What color is an apple usually?", options: ["red", "desk", "run", "book"], answer: 0 },
    { title: "English Mini Game", question: "Which word means \u201c\u5b66\u6821\u201d?", options: ["school", "water", "star", "fox"], answer: 0 },
    { title: "English Mini Game", question: "Choose the plural of book.", options: ["bookes", "books", "bookies", "book"], answer: 1 },
    { title: "English Mini Game", question: "Which word is a verb?", options: ["run", "green", "apple", "desk"], answer: 0 },
    { title: "English Mini Game", question: "She ___ happy.", options: ["am", "is", "are", "be"], answer: 1 },
    { title: "English Mini Game", question: "Which means \u201c\u94c5\u7b14\u201d?", options: ["pencil", "puddle", "flower", "bear"], answer: 0 },
    { title: "English Mini Game", question: "They ___ friends.", options: ["am", "is", "are", "be"], answer: 2 },
    { title: "English Mini Game", question: "Choose the opposite of big.", options: ["small", "tall", "fast", "happy"], answer: 0 },
    { title: "English Mini Game", question: "Choose the past tense of go.", options: ["goed", "went", "goes", "going"], answer: 1 },
    { title: "English Mini Game", question: "A ___ has pages.", options: ["book", "pond", "star", "fox"], answer: 0 },
    { title: "English Mini Game", question: "Which word is an animal?", options: ["rabbit", "yellow", "jump", "desk"], answer: 0 },
    { title: "English Mini Game", question: "We ___ to school.", options: ["go", "goes", "is", "am"], answer: 0 },
  ],
  riddle: [
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u4e00\u5929\u4e00\u70b9\u70b9\uff0c\u4f1a\u53d8\u6210\u4ec0\u4e48\u5b57\uff1f", options: ["\u65e6", "\u660e", "\u65e7", "\u65e9"], answer: 0 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u4e09\u4e2a\u201c\u4eba\u201d\u5728\u4e00\u8d77\uff0c\u662f\u4ec0\u4e48\u5b57\uff1f", options: ["\u4ece", "\u4f17", "\u5927", "\u592b"], answer: 1 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u4e00\u53e3\u54ac\u6389\u725b\u5c3e\u5df4\uff0c\u662f\u4ec0\u4e48\u5b57\uff1f", options: ["\u544a", "\u725b", "\u751f", "\u5348"], answer: 0 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u4e0a\u8fb9\u6bdb\uff0c\u4e0b\u8fb9\u6bdb\uff0c\u4e2d\u95f4\u4e00\u9897\u9ed1\u8461\u8404\uff0c\u662f\u4ec0\u4e48\uff1f", options: ["\u773c\u775b", "\u8033\u6735", "\u9f3b\u5b50", "\u5634\u5df4"], answer: 0 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u5341\u4e2a\u54e5\u54e5\u529b\u6c14\u5927\uff0c\u4ec0\u4e48\u5b57\uff1f", options: ["\u514b", "\u534f", "\u7530", "\u53e4"], answer: 1 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u65e5\u6708\u540c\u8f89\uff0c\u662f\u4ec0\u4e48\u5b57\uff1f", options: ["\u660e", "\u6674", "\u65e9", "\u661f"], answer: 0 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u4e00\u8fb9\u7eff\uff0c\u4e00\u8fb9\u7ea2\uff0c\u4e00\u8fb9\u6015\u6c34\uff0c\u4e00\u8fb9\u6015\u866b\u3002\u731c\u4e00\u5b57\uff1f", options: ["\u79cb", "\u660e", "\u6797", "\u597d"], answer: 0 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u4e00\u70b9\u4e00\u6a2a\u957f\uff0c\u4e00\u6487\u5230\u5357\u6d0b\uff0c\u662f\u4ec0\u4e48\u5b57\uff1f", options: ["\u5e7f", "\u5382", "\u6587", "\u5927"], answer: 0 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u56db\u9762\u90fd\u662f\u5c71\uff0c\u5c71\u5c71\u90fd\u76f8\u8fde\uff0c\u662f\u4ec0\u4e48\u5b57\uff1f", options: ["\u7530", "\u56de", "\u5cb3", "\u5c71"], answer: 0 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u4e24\u68f5\u6811\u5e76\u6392\u7ad9\uff0c\u662f\u4ec0\u4e48\u5b57\uff1f", options: ["\u6797", "\u68ee", "\u672c", "\u672b"], answer: 0 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u4e00\u4e2a\u4eba\u9760\u7740\u6728\u5934\u4f11\u606f\uff0c\u662f\u4ec0\u4e48\u5b57\uff1f", options: ["\u4f11", "\u4f53", "\u6797", "\u4ec1"], answer: 0 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u4e00\u5927\u4e00\u5c0f\u6392\u4e00\u8d77\uff0c\u662f\u4ec0\u4e48\u5b57\uff1f", options: ["\u5c16", "\u592a", "\u5929", "\u592b"], answer: 0 },
    { title: "\u731c\u5b57\u8c1c\u5c0f\u6e38\u620f", question: "\u95e8\u91cc\u6709\u4e2a\u4eba\uff0c\u662f\u4ec0\u4e48\u5b57\uff1f", options: ["\u95ea", "\u95ee", "\u95f4", "\u95fb"], answer: 0 },
  ],
};

const QUIZ_DISPLAY = {
  math: {
    name: "\u6570\u5b66\u6811\u6869",
    short: "\u7b97\u9898",
    near: "\u6309 E \u7b97\u4e00\u7b97",
    dialogue: "\u6765\u5e2e\u6211\u7b97\u4e00\u9053\u6570\u5b66\u9898\u5427\u3002",
    sign: "\u7b97\u9898",
  },
  logic: {
    name: "\u903b\u8f91\u661f\u661f\u724c",
    short: "\u627e\u89c4\u5f8b",
    near: "\u6309 E \u627e\u89c4\u5f8b",
    dialogue: "\u89c2\u5bdf\u4e00\u4e0b\uff0c\u7b54\u6848\u85cf\u5728\u89c4\u5f8b\u91cc\u3002",
    sign: "\u89c4\u5f8b",
  },
  science: {
    name: "\u79d1\u5b66\u82b1\u575b",
    short: "\u770b\u4e00\u770b",
    near: "\u6309 E \u89c2\u5bdf",
    dialogue: "\u4ed4\u7ec6\u89c2\u5bdf\u82b1\u56ed\u91cc\u7684\u5c0f\u79d8\u5bc6\u3002",
    sign: "\u89c2\u5bdf",
  },
  language: {
    name: "\u8bed\u6587\u6728\u724c",
    short: "\u8ba4\u5b57",
    near: "\u6309 E \u8ba4\u4e00\u8ba4",
    dialogue: "\u8fd9\u4e2a\u6c49\u5b57\u4f60\u8ba4\u8bc6\u5417\uff1f",
    sign: "\u8ba4\u5b57",
  },
  english: {
    name: "\u82f1\u8bed\u62fc\u56fe\u684c",
    short: "ABC",
    near: "\u6309 E \u8bfb\u4e00\u8bfb",
    dialogue: "\u4e00\u8d77\u8bfb\u4e00\u4e2a\u82f1\u6587\u5c0f\u5355\u8bcd\u5427\u3002",
    sign: "ABC",
  },
  riddle: {
    name: "\u731c\u5b57\u8c1c\u5c0f\u724c",
    short: "\u731c\u8c1c",
    near: "\u6309 E \u731c\u8c1c\u8bed",
    dialogue: "\u6765\u731c\u4e00\u4e2a\u5c0f\u8c1c\u8bed\u3002",
    sign: "\u731c\u8c1c",
  },
};

const levels = [
  {
    name: "\u65e9\u6668\u4e0a\u5b66\u8def",
    bg: "schoolyard",
    time: 62,
    start: { x: 468, y: 430 },
    message: "\u7b2c\u4e00\u5929\uff1a\u628a\u82f9\u679c\u3001\u94c5\u7b14\u548c\u4f5c\u4e1a\u672c\u9001\u5230\u90bb\u5c45\u624b\u91cc\u3002",
    collectibles: [
      item(180, 150, "book", "\u4f5c\u4e1a\u672c"),
      item(748, 154, "apple", "\u82f9\u679c"),
      item(430, 245, "pencil", "\u94c5\u7b14"),
      item(260, 386, "apple", "\u82f9\u679c"),
    ],
    propDecorations: [
      propDecoration(125, 332, "map", 42, 34, "\u5730\u56fe"),
      propDecoration(385, 186, "bell", 30, 30, "\u5c0f\u94c3\u94db"),
      propDecoration(612, 240, "leafLamp", 34, 46, "\u53f6\u5b50\u706f"),
    ],
    tasks: [
      delivery(198, 322, "\u5c0f\u9e7f", "deer", "apple", "\u60f3\u5403\u82f9\u679c"),
      delivery(790, 298, "\u677e\u9f20", "squirrel", "pencil", "\u627e\u94c5\u7b14"),
      delivery(486, 178, "\u5154\u8001\u5e08", "rabbit", ["book", "apple"], "\u6536\u4f5c\u4e1a\u548c\u5956\u52b1\u82f9\u679c"),
    ],
    puddles: [
      { x: 448, y: 358, r: 30 },
      { x: 588, y: 305, r: 38 },
      { x: 810, y: 420, r: 30 },
    ],
    obstacles: [
      { type: "bush", x: 300, y: 430, r: 34 },
      { type: "pit", x: 690, y: 340, r: 25 },
    ],
  },
  {
    name: "\u8bfe\u95f4\u68ee\u6797",
    bg: "forest",
    time: 68,
    start: { x: 480, y: 420 },
    message: "\u7b2c\u4e8c\u5929\uff1a\u6536\u96c6\u5c0f\u5de5\u5177\uff0c\u5e2e\u90bb\u5c45\u4fee\u597d\u5c0f\u9ebb\u70e6\u3002",
    collectibles: [
      item(164, 230, "leaf", "\u53f6\u5b50\u626b\u5e1a"),
      item(292, 130, "seed", "\u82b1\u79cd"),
      item(520, 160, "bell", "\u5c0f\u94c3\u94db"),
      item(735, 238, "leaf", "\u53f6\u5b50\u626b\u5e1a"),
      item(820, 420, "seed", "\u82b1\u79cd"),
    ],
    tasks: [
      delivery(162, 382, "\u8682\u8681", "ant", "leaf", "\u8def\u88ab\u53f6\u5b50\u6321\u4f4f"),
      delivery(384, 414, "\u8774\u8776", "butterfly", ["seed", "leaf"], "\u82b1\u5703\u9700\u8981\u82b1\u79cd\u548c\u53f6\u5b50\u626b\u5e1a"),
      delivery(805, 306, "\u5c0f\u72d0", "fox", "bell", "\u94c3\u94db\u4e0d\u89c1\u4e86"),
      actionTask(380, 410, "\u6d47\u82b1", "flower", "\u6309\u4e00\u4e0b\u7ad9\u4f4f\u5c31\u80fd\u6d47\u82b1"),
    ],
    puddles: [
      { x: 245, y: 335, r: 32 },
      { x: 628, y: 338, r: 34 },
      { x: 762, y: 372, r: 28 },
    ],
    obstacles: [
      { type: "bush", x: 558, y: 414, r: 38 },
      { type: "pit", x: 742, y: 438, r: 27 },
      { type: "pond", x: 272, y: 206, r: 34 },
    ],
  },
  {
    name: "\u57ce\u5e02\u9053\u8def\u5927\u5192\u9669",
    bg: "cityRoad",
    time: 78,
    start: { x: 480, y: 438 },
    message: "\u7b2c\u4e09\u5929\uff1a\u8d70\u51fa\u68ee\u6797\u6765\u5230\u57ce\u5e02\u9053\u8def\uff0c\u5e2e\u8ff7\u8def\u7684\u670b\u53cb\u56de\u5bb6\u3002",
    collectibles: [
      item(190, 116, "lantern", "\u5c0f\u706f\u7b3c"),
      item(365, 215, "map", "\u5730\u56fe"),
      item(535, 350, "potion", "\u7231\u5fc3\u836f\u6c34"),
      item(610, 145, "apple", "\u82f9\u679c"),
      item(768, 395, "map", "\u5730\u56fe"),
      item(205, 410, "lantern", "\u5c0f\u706f\u7b3c"),
      item(690, 280, "apple", "\u82f9\u679c"),
    ],
    tasks: [
      delivery(132, 318, "\u8424\u706b\u866b", "firefly", "lantern", "\u60f3\u627e\u5230\u706f"),
      delivery(820, 232, "\u5c0f\u72f8", "fox", ["map", "lantern"], "\u653e\u5b66\u8ff7\u8def\u4e86\uff0c\u9700\u8981\u5730\u56fe\u548c\u706f\u7b3c"),
      delivery(170, 144, "\u6821\u957f", "owl", ["apple", "map"], "\u5956\u52b1\u82f9\u679c\u548c\u56de\u5bb6\u5730\u56fe"),
      actionTask(512, 390, "\u6574\u7406\u6821\u724c", "sign", "\u628a\u5b66\u6821\u724c\u64e6\u4eae"),
      actionTask(720, 112, "\u70b9\u4eae\u6811\u706f", "light", "\u70b9\u4eae\u6811\u4e0a\u7684\u5c0f\u706f"),
    ],
    puddles: [
      { x: 290, y: 286, r: 34 },
      { x: 574, y: 232, r: 30 },
      { x: 836, y: 430, r: 32 },
      { x: 132, y: 444, r: 27 },
    ],
    obstacles: [
      { type: "bush", x: 410, y: 360, r: 36 },
      { type: "pit", x: 718, y: 226, r: 28 },
      { type: "pond", x: 612, y: 438, r: 34 },
    ],
  },
  {
    name: "\u68ee\u6797\u8bfe\u5802\u6311\u6218",
    bg: "classroom",
    time: 95,
    start: { x: 480, y: 430 },
    message: "\u7b2c\u56db\u5929\uff1a\u56de\u5230\u68ee\u6797\u6559\u5ba4\uff0c\u5b8c\u6210\u6570\u5b66\u3001\u79d1\u5b66\u3001\u8bed\u6587\u548c\u82f1\u6587\u5c0f\u6311\u6218\u3002",
    collectibles: [],
    tasks: [
      quizTask(138, 326, "\u6570\u5b66\u6811\u6869", "math", "\u7b97\u9898", "math"),
      quizTask(322, 138, "\u903b\u8f91\u661f\u661f\u724c", "logic", "\u627e\u89c4\u5f8b", "logic"),
      quizTask(500, 98, "\u79d1\u5b66\u82b1\u575b", "science", "\u770b\u4e00\u770b", "science"),
      quizTask(742, 160, "\u8bed\u6587\u6728\u724c", "language", "\u8ba4\u5b57", "language"),
      quizTask(836, 354, "\u82f1\u8bed\u62fc\u56fe\u684c", "english", "ABC", "english"),
      quizTask(462, 408, "\u731c\u5b57\u8c1c\u5c0f\u724c", "riddle", "\u731c\u8c1c", "riddle"),
    ],
    puddles: [
      { x: 248, y: 360, r: 28 },
      { x: 654, y: 322, r: 30 },
    ],
    obstacles: [
      { type: "bush", x: 612, y: 420, r: 33 },
      { type: "pit", x: 244, y: 224, r: 24 },
    ],
  },
  {
    name: "\u6c60\u5858\u52c7\u6c14\u51c6\u5907",
    bg: "pondSide",
    time: 88,
    start: { x: 465, y: 430 },
    message: "\u7b2c\u4e94\u5929\uff1a\u6765\u5230\u6c60\u5858\u5c0f\u8def\uff0c\u5148\u6536\u96c6\u52c7\u6c14\u661f\u3001\u9b54\u6cd5\u94c5\u7b14\u548c\u5b88\u62a4\u4e66\u3002",
    collectibles: [
      item(188, 150, "courageStar", "\u52c7\u6c14\u661f"),
      item(446, 218, "magicPencil", "\u9b54\u6cd5\u94c5\u7b14"),
      item(704, 150, "guardBook", "\u5b88\u62a4\u4e66"),
      item(248, 414, "potion", "\u7231\u5fc3\u836f\u6c34"),
      item(812, 394, "courageStar", "\u52c7\u6c14\u661f"),
    ],
    tasks: [
      delivery(164, 328, "\u523a\u732c\u540c\u5b66", "hedgehog", "courageStar", "\u60f3\u8981\u4e00\u9897\u52c7\u6c14\u661f"),
      delivery(512, 392, "\u6811\u6869\u5b9d\u7bb1", "chest", ["magicPencil", "guardBook"], "\u5b9d\u7bb1\u9700\u8981\u9b54\u6cd5\u94c5\u7b14\u548c\u5b88\u62a4\u4e66"),
      actionTask(760, 250, "\u6253\u5f00\u5c0f\u8def", "sign", "\u7ad9\u4f4f\u4e00\u4f1a\u513f\uff0c\u6253\u5f00\u901a\u5f80 Boss \u6811\u6d1e\u7684\u8def"),
    ],
    puddles: [
      { x: 332, y: 314, r: 31 },
      { x: 630, y: 348, r: 30 },
      { x: 842, y: 438, r: 26 },
    ],
    obstacles: [
      { type: "bush", x: 292, y: 424, r: 35 },
      { type: "pit", x: 590, y: 224, r: 26 },
      { type: "pond", x: 746, y: 350, r: 35 },
    ],
  },
  {
    name: "\u6e7f\u5730\u8df3\u8df3\u8def",
    bg: "wetland",
    time: 82,
    start: { x: 132, y: 438 },
    message: "\u7b2c\u516d\u5929\uff1a\u8dd1\u8fc7\u6e7f\u5730\u6728\u6808\u9053\uff0c\u8eb2\u5f00\u6c34\u5858\u3001\u6ce5\u5730\u548c\u704c\u6728\uff0c\u51b2\u5230\u7ec8\u70b9\u65d7\uff01",
    collectibles: [
      item(198, 360, "apple", "\u52a0\u6cb9\u82f9\u679c"),
      item(318, 228, "courageStar", "\u8df3\u8df3\u661f"),
      item(486, 404, "potion", "\u7231\u5fc3\u836f\u6c34"),
      item(618, 210, "courageStar", "\u52c7\u6c14\u661f"),
      item(792, 362, "guardBook", "\u901a\u5173\u624b\u518c"),
    ],
    tasks: [
      actionTask(292, 360, "\u5f39\u8df3\u8611\u83c7", "spring", "\u7ad9\u4f4f\u4e00\u4f1a\uff0c\u5f39\u8fc7\u5c0f\u571f\u5751"),
      delivery(580, 362, "\u8df3\u8df3\u5154", "rabbit", "courageStar", "\u6211\u9700\u8981\u4e00\u9897\u8df3\u8df3\u661f"),
      actionTask(842, 238, "\u7ec8\u70b9\u65d7", "finish", "\u5230\u8fbe\u7ec8\u70b9\uff0c\u51c6\u5907\u9762\u5bf9\u9ed1\u718a\u602a"),
    ],
    puddles: [
      { x: 230, y: 436, r: 28 },
      { x: 508, y: 312, r: 32 },
      { x: 748, y: 438, r: 30 },
    ],
    obstacles: [
      { type: "pit", x: 376, y: 392, r: 28 },
      { type: "bush", x: 516, y: 282, r: 30 },
      { type: "pond", x: 660, y: 342, r: 35 },
      { type: "pit", x: 812, y: 334, r: 25 },
    ],
  },
  {
    name: "\u6cbc\u6cfd\u5927 Boss",
    bg: "swampBoss",
    time: 95,
    start: { x: 480, y: 438 },
    message: "\u7b2c\u4e03\u5929\uff1a\u8fdb\u5165\u6cbc\u6cfd\u8fb9\u7f18\uff0c\u6536\u96c6\u9053\u5177\u8fdc\u7a0b\u653b\u51fb\u9ed1\u718a\u602a\uff0c\u8eb2\u5f00\u9707\u6ce2\uff01",
    collectibles: [
      item(176, 392, "courageStar", "\u52c7\u6c14\u661f"),
      item(306, 218, "courageStar", "\u52c7\u6c14\u661f"),
      item(446, 196, "magicPencil", "\u9b54\u6cd5\u94c5\u7b14"),
      item(620, 316, "magicPencil", "\u9b54\u6cd5\u94c5\u7b14"),
      item(548, 420, "magicPencil", "\u9b54\u6cd5\u94c5\u7b14"),
      item(760, 382, "guardBook", "\u5b88\u62a4\u4e66"),
      item(314, 286, "potion", "\u7231\u5fc3\u836f\u6c34"),
    ],
    tasks: [
      bossTask(480, 150, "\u9ed1\u718a\u602a Boss", "boss", ["courageStar", "magicPencil", "guardBook"], "\u9760\u8fd1 Boss \u4f7f\u7528\u9053\u5177\u6d88\u8017\u8840\u6761"),
    ],
    puddles: [
      { x: 260, y: 394, r: 30 },
      { x: 646, y: 318, r: 34 },
      { x: 820, y: 350, r: 28 },
    ],
    obstacles: [
      { type: "bush", x: 228, y: 330, r: 34 },
      { type: "pit", x: 412, y: 394, r: 30 },
      { type: "pond", x: 720, y: 438, r: 38 },
    ],
  },
];

const LEVEL_WORLD_SEQUENCE = [
  "forest_school",
  "forest_school",
  "river_town",
  "forest_school",
  "river_town",
  "river_town",
  "dark_swamp",
];

levels.forEach((level, index) => {
  const worldId = level.world || LEVEL_WORLD_SEQUENCE[index] || "forest_school";
  level.id = level.id || `day_${index + 1}`;
  level.world = worldId;
  level.worldName = WORLD_MAP[worldId]?.name || worldId;
});

function levelBackgroundKey(level) {
  if (!level) return null;
  return level.bg || WORLD_MAP[level.world]?.background;
}

function taskSystemType(kind) {
  if (kind === "boss") return TASK_TYPES.BOSS_FIGHT;
  if (kind === "quiz") return TASK_TYPES.SIMPLE_PUZZLE;
  if (kind === "delivery") return TASK_TYPES.HELP_NPC;
  return TASK_TYPES.FETCH_ITEM;
}

window.CATS_OWLS_GAME_DATA = Object.freeze({
  WORLD_MAP,
  CHARACTER_REGISTRY,
  NPC_REGISTRY,
  TASK_TYPES,
  levels,
});

function item(x, y, type, label) {
  return { x, y, type, label, taken: false };
}

function propDecoration(x, y, type, width, height, label) {
  return { x, y, type, width, height, label };
}

function delivery(x, y, name, animal, need, speech) {
  return { x, y, name, animal, need: Array.isArray(need) ? need : [need], speech, kind: "delivery", done: false, progress: 0 };
}

function actionTask(x, y, name, animal, speech) {
  return { x, y, name, animal, speech, kind: "action", done: false, progress: 0 };
}

function quizTask(x, y, name, animal, speech, quiz) {
  return { x, y, name, animal, speech, quizKey: typeof quiz === "string" ? quiz : null, quiz, kind: "quiz", done: false, progress: 0 };
}

function bossTask(x, y, name, animal, need, speech) {
  return { x, y, name, animal, need, speech, kind: "boss", done: false, progress: 0, hp: 9, maxHp: 9 };
}

function resetGame(levelIndex = 0, keepHearts = false) {
  const level = levels[levelIndex];
  if (gameEntered) preloadNearbyBackgrounds(levelIndex);
  closeQuiz();
  closeDialogue();
  state = {
    levelIndex,
    running: false,
    levelClear: false,
    gameComplete: false,
    time: level.time,
    hearts: keepHearts && state ? state.hearts : 0,
    tasks: 0,
    inventory: [],
    slowUntil: 0,
    puddleCooldownUntil: 0,
    hurtCooldownUntil: 0,
    attackCooldownUntil: 0,
    bossAttackTimer: 0.9,
    hazards: [],
    projectiles: [],
    activeQuiz: null,
    activeDialogue: null,
    nearbyTask: null,
    shake: 0,
    player: { x: level.start.x, y: level.start.y, vx: 0, vy: 0, dir: 1, step: 0 },
    collectibles: level.collectibles.map((entry) => ({ ...entry })),
    tasksList: level.tasks.map((entry, index) => prepareTask(entry, level, index)),
    puddles: level.puddles.map((entry) => ({ ...entry })),
    obstacles: (level.obstacles || []).map((entry) => ({ ...entry })),
    propDecorations: (level.propDecorations || []).map((entry) => ({ ...entry })),
    sparkles: [],
    floaters: [],
    leaves: makeLeaves(levelIndex),
  };
  updateHud();
  messageEl.textContent = level.message;
  startBtn.textContent = levelIndex === 0 ? text.start : text.next;
}

function prepareTask(entry, level, index) {
  const task = { ...entry };
  task.id = task.id || `${level.bg || "level"}_${task.kind}_${task.animal}_${index}`;
  task.taskType = task.taskType || taskSystemType(task.kind);
  task.npc = task.npc || NPC_REGISTRY[task.animal]?.id || task.animal;
  task.characterId = task.characterId || NPC_REGISTRY[task.animal]?.characterId || null;
  if (task.quizKey) task.quiz = randomQuiz(task.quizKey);
  return task;
}

function randomQuiz(key) {
  const list = quizBank[key] || [];
  return list[Math.floor(Math.random() * list.length)] || quizBank.math[0];
}

function startGame() {
  gameEntered = true;
  preloadNearbyBackgrounds(state.levelIndex);
  initAudio();
  if (state.running) {
    resetGame(state.levelIndex, state.levelIndex > 0);
    state.running = true;
    startBtn.textContent = text.restart;
    messageEl.textContent = text.move;
    startMusicForLevel();
    return;
  }

  if (state.levelClear) {
    const nextLevel = state.levelIndex + 1;
    if (nextLevel >= levels.length) {
      resetGame(0, false);
    } else {
      resetGame(nextLevel, true);
    }
  } else if (state.time <= 0 || state.gameComplete) {
    resetGame(0, false);
  }

  state.running = true;
  state.levelClear = false;
  startBtn.textContent = text.restart;
  messageEl.textContent = text.move;
  startMusicForLevel();
}

function enterGame() {
  gameEntered = true;
  preloadNearbyBackgrounds(state.levelIndex);
  homeScreen.classList.add("is-hidden");
  const roleName = PLAYER_DISPLAY_NAMES[selectedRole] || PLAYER_DISPLAY_NAMES.cat;
  messageEl.textContent = `\u70b9\u51fb\u5f00\u59cb\uff0c\u548c ${roleName} \u4e00\u8d77\u51fa\u53d1\u3002`;
}

function initAudio() {
  if (!music.enabled) return;
  if (!music.ctx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    music.ctx = new AudioContext();
    music.master = music.ctx.createGain();
    music.master.gain.value = 0.08;
    music.master.connect(music.ctx.destination);
  }
  if (music.ctx.state === "suspended") music.ctx.resume();
}

function startMusicForLevel() {
  if (!music.enabled || !music.ctx) return;
  const pattern = musicPatternForLevel(state.levelIndex);
  if (music.pattern === pattern && music.timer) return;
  stopMusic();
  music.pattern = pattern;
  music.step = 0;
  playMusicStep();
  music.timer = window.setInterval(playMusicStep, pattern === "boss" ? 240 : 310);
}

function stopMusic() {
  if (music.timer) {
    window.clearInterval(music.timer);
    music.timer = null;
  }
  music.pattern = "";
}

function toggleSound() {
  music.enabled = !music.enabled;
  soundBtn.textContent = music.enabled ? "\u266b" : "\u2715";
  if (!music.enabled) {
    stopMusic();
    return;
  }
  initAudio();
  if (state.running) startMusicForLevel();
}

function musicPatternForLevel(levelIndex) {
  if (levelIndex >= levels.length - 1) return "boss";
  if (levelIndex >= levels.length - 2) return "danger";
  if (levelIndex >= 2) return "adventure";
  return "happy";
}

function playMusicStep() {
  if (!music.enabled || !music.ctx || !music.master) return;
  const now = music.ctx.currentTime;
  const pattern = music.pattern || "happy";
  const notes = {
    happy: [523, 659, 784, 659, 698, 784, 880, 784],
    adventure: [392, 523, 587, 659, 587, 523, 440, 523],
    danger: [330, 392, 440, 392, 349, 392, 330, 294],
    boss: [196, 220, 196, 247, 185, 220, 165, 196],
  }[pattern];
  const note = notes[music.step % notes.length];
  const isBass = pattern === "boss" && music.step % 2 === 0;
  playTone(note, now, isBass ? 0.22 : 0.16, isBass ? "sawtooth" : "triangle", isBass ? 0.08 : 0.05);
  if (pattern !== "boss" && music.step % 4 === 0) playTone(note / 2, now, 0.18, "sine", 0.025);
  if (pattern === "boss" && music.step % 4 === 0) playNoise(now, 0.12);
  music.step += 1;
}

function playTone(freq, time, duration, type, volume) {
  const osc = music.ctx.createOscillator();
  const gain = music.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(volume, time + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  osc.connect(gain);
  gain.connect(music.master);
  osc.start(time);
  osc.stop(time + duration + 0.02);
}

function playNoise(time, duration) {
  const buffer = music.ctx.createBuffer(1, music.ctx.sampleRate * duration, music.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const source = music.ctx.createBufferSource();
  const gain = music.ctx.createGain();
  source.buffer = buffer;
  gain.gain.value = 0.035;
  source.connect(gain);
  gain.connect(music.master);
  source.start(time);
}

function updateHud() {
  const target = state.tasksList ? state.tasksList.length : levels[state.levelIndex].tasks.length;
  levelEl.textContent = dayNames[state.levelIndex] || `\u7b2c${state.levelIndex + 1}\u5929`;
  heartsEl.textContent = state.hearts;
  timeEl.textContent = Math.max(0, Math.ceil(state.time));
  tasksEl.textContent = `${state.tasks}/${target}`;
  bagEl.textContent = state.inventory.length ? needLabels(state.inventory.slice(0, 3)) : "\u7a7a";
}

function pressed(dir) {
  return keys.has(dir) || touchDirs.has(dir);
}

function update(dt) {
  updateParticles(dt);
  updateLeaves(dt);
  if (!state.running) return;
  if (state.activeQuiz) return;
  if (state.activeDialogue) return;

  state.time -= dt;
  if (state.time <= 0) {
    state.time = 0;
    state.running = false;
    startBtn.textContent = text.again;
    messageEl.textContent = text.timeUp;
    updateHud();
    return;
  }

  updatePlayer(dt);
  updateBossHazards(dt);
  updateProjectiles(dt);
  checkPuddles();
  checkObstacles();
  checkCollectibles();
  checkTasks(dt);

  const target = state.tasksList.length;
  if (state.tasks >= target) {
    state.running = false;
    stopMusic();
    state.levelClear = true;
    if (state.levelIndex === levels.length - 1) {
      state.gameComplete = true;
      startBtn.textContent = text.again;
      messageEl.textContent = text.allDone;
    } else {
      startBtn.textContent = text.next;
      messageEl.textContent = `${dayNames[state.levelIndex] || `\u7b2c${state.levelIndex + 1}\u5929`}\u5b8c\u6210\uff01\u51c6\u5907\u53bb\u4e0b\u4e00\u4e2a\u68ee\u6797\u89d2\u843d\u3002`;
    }
    burst(canvas.width / 2, 180, "#ffd94a", 26);
  }

  updateHud();
}

function updatePlayer(dt) {
  const p = state.player;
  let ax = 0;
  let ay = 0;
  if (pressed("left")) ax -= 1;
  if (pressed("right")) ax += 1;
  if (pressed("up")) ay -= 1;
  if (pressed("down")) ay += 1;

  const hasInput = ax !== 0 || ay !== 0;
  const len = Math.hypot(ax, ay) || 1;
  const slowed = performance.now() < state.slowUntil;
  const targetSpeed = slowed ? 120 : 230;
  const targetVx = (ax / len) * targetSpeed;
  const targetVy = (ay / len) * targetSpeed;
  const ease = hasInput ? 0.22 : 0.14;
  p.vx += (targetVx - p.vx) * ease;
  p.vy += (targetVy - p.vy) * ease;
  if (!hasInput && Math.hypot(p.vx, p.vy) < 4) {
    p.vx = 0;
    p.vy = 0;
  }
  if (Math.abs(p.vx) > 5) p.dir = Math.sign(p.vx);
  p.step += Math.hypot(p.vx, p.vy) * dt * 0.055;
  p.x = clamp(p.x + p.vx * dt, 58, canvas.width - 58);
  p.y = clamp(p.y + p.vy * dt, 92, canvas.height - 58);
}

function checkPuddles() {
  const p = state.player;
  const now = performance.now();
  if (now < state.puddleCooldownUntil) return;
  for (const puddle of state.puddles) {
    if (distance(p, puddle) < puddle.r + 22) {
      state.slowUntil = now + 520;
      state.puddleCooldownUntil = now + 950;
      state.shake = 0.08;
      addFloatingText(p.x, p.y - 42, "\u5c0f\u5fc3\u6c34\u5751", "#277faf");
      burst(p.x, p.y, "#69a9d7", 5);
      messageEl.textContent = text.puddle;
      break;
    }
  }
}

function checkObstacles() {
  const p = state.player;
  const now = performance.now();
  for (const obstacle of state.obstacles) {
    const hit = distance(p, obstacle) < obstacle.r + 21;
    if (!hit || now < state.puddleCooldownUntil) continue;
    if (obstacle.type === "bush") {
      state.slowUntil = now + 520;
      state.puddleCooldownUntil = now + 720;
      addFloatingText(p.x, p.y - 42, "\u704c\u6728\u6321\u8def", "#4f8b38");
      messageEl.textContent = "\u704c\u6728\u6709\u70b9\u5bc6\uff0c\u6162\u6162\u7a7f\u8fc7\u53bb\u3002";
    } else if (obstacle.type === "pit") {
      state.slowUntil = now + 850;
      state.puddleCooldownUntil = now + 980;
      state.shake = 0.08;
      addFloatingText(p.x, p.y - 42, "\u5c0f\u5fc3\u571f\u5751", "#8b5b2b");
      messageEl.textContent = "\u5dee\u70b9\u6389\u8fdb\u571f\u5751\uff0c\u5148\u7a33\u4e00\u7a33\u3002";
    } else if (obstacle.type === "pond") {
      state.slowUntil = now + 700;
      state.puddleCooldownUntil = now + 900;
      burst(p.x, p.y, "#69a9d7", 4);
      addFloatingText(p.x, p.y - 42, "\u7ed5\u5f00\u6c34\u5858", "#277faf");
      messageEl.textContent = "\u524d\u9762\u662f\u6c34\u5858\uff0c\u8d70\u8fb9\u4e0a\u66f4\u5b89\u5168\u3002";
    } else if (obstacle.type === "spring") {
      state.puddleCooldownUntil = now + 680;
      p.vx += p.dir * 120;
      p.vy -= 95;
      state.shake = 0.04;
      burst(p.x, p.y, "#ffd94a", 7);
      addFloatingText(p.x, p.y - 42, "\u8df3\uff01", "#f2ad31");
      messageEl.textContent = "\u5f39\u8df3\u8611\u83c7\u628a\u5c0f\u4f19\u4f34\u9001\u5411\u524d\u65b9\uff01";
    }
    break;
  }
}

function updateBossHazards(dt) {
  if (state.levelIndex !== levels.length - 1 || !state.running || state.activeQuiz) return;
  const boss = state.tasksList.find((task) => task.kind === "boss" && !task.done);
  if (!boss) return;

  state.bossAttackTimer -= dt;
  if (state.bossAttackTimer <= 0) {
    state.bossAttackTimer = 1.35;
    spawnBossHazard(boss);
  }

  const p = state.player;
  const now = performance.now();
  state.hazards = state.hazards.filter((hazard) => {
    hazard.life -= dt;
    hazard.x += hazard.vx * dt;
    hazard.y += hazard.vy * dt;
    hazard.r += hazard.grow * dt;
    const hit = distance(p, hazard) < hazard.r + 20;
    if (hit && now > state.hurtCooldownUntil) {
      state.hurtCooldownUntil = now + 1000;
      state.hearts = Math.max(0, state.hearts - 2);
      state.slowUntil = now + 680;
      state.shake = 0.1;
      addFloatingText(p.x, p.y - 45, "-2", "#e84b3f");
      messageEl.textContent = "\u88ab\u9ed1\u718a\u602a\u7684\u62cd\u5730\u9707\u6ce2\u78b0\u5230\u4e86\uff0c\u5584\u826f\u503c -2\uff01";
      burst(p.x, p.y, "#8b5b2b", 8);
      return false;
    }
    return hazard.life > 0;
  });
}

function spawnBossHazard(boss) {
  const p = state.player;
  const angle = Math.atan2(p.y - boss.y, p.x - boss.x);
  const speed = 105;
  state.hazards.push({
    x: boss.x,
    y: boss.y + 28,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: 12,
    grow: 5,
    life: 2.5,
  });
}

function shootBossWeapon() {
  if (!state.running || state.levelIndex !== levels.length - 1 || state.activeQuiz || state.activeDialogue) return;
  const now = performance.now();
  if (now < state.attackCooldownUntil) return;
  const boss = state.tasksList.find((task) => task.kind === "boss" && !task.done);
  if (!boss) return;
  const weapon = firstBossWeapon();
  if (!weapon) {
    messageEl.textContent = "\u6ca1\u6709\u53ef\u53d1\u5c04\u7684\u9053\u5177\uff0c\u5148\u53bb\u6536\u96c6\u5427\uff01";
    return;
  }
  consumeNeeds([weapon]);
  state.attackCooldownUntil = now + 420;
  const p = state.player;
  const angle = Math.atan2(boss.y - p.y, boss.x - p.x);
  state.projectiles.push({
    x: p.x,
    y: p.y - 18,
    vx: Math.cos(angle) * 390,
    vy: Math.sin(angle) * 390,
    type: weapon,
    r: 12,
    life: 1.45,
  });
  messageEl.textContent = `\u53d1\u5c04${itemLabel(weapon)}\uff01`;
}

function updateProjectiles(dt) {
  if (!state.projectiles.length) return;
  const boss = state.tasksList.find((task) => task.kind === "boss" && !task.done);
  state.projectiles = state.projectiles.filter((shot) => {
    shot.life -= dt;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    if (boss && distance(shot, boss) < 58) {
      const damage = bossDamage(shot.type);
      boss.hp = Math.max(0, boss.hp - damage);
      burst(boss.x, boss.y, itemColor(shot.type), 22);
      addFloatingText(boss.x, boss.y - 80, `-${damage}`, "#ffd94a");
      if (boss.hp <= 0) {
        completeTask(boss, boss.x, boss.y);
        burst(boss.x, boss.y, "#ffd94a", 44);
      }
      return false;
    }
    return shot.life > 0 && shot.x > -40 && shot.x < canvas.width + 40 && shot.y > -40 && shot.y < canvas.height + 40;
  });
}

function checkCollectibles() {
  const p = state.player;
  for (const entry of state.collectibles) {
    if (!entry.taken && distance(p, entry) < 42) {
      entry.taken = true;
      if (entry.type === "potion") {
        state.hearts += 2;
        state.time = Math.min(levels[state.levelIndex].time + 8, state.time + 3);
      } else {
        state.inventory.push(entry.type);
        state.hearts += 1;
      }
      burst(entry.x, entry.y, itemColor(entry.type), 12);
      addFloatingText(entry.x, entry.y - 36, `+ ${entry.label}`, "#3f8a2f");
      messageEl.textContent =
        entry.type === "potion"
          ? "\u559d\u5230\u7231\u5fc3\u836f\u6c34\uff0c\u72b6\u6001\u66f4\u597d\u5566\u3002"
          : `\u6361\u5230${entry.label}\uff0c\u53bb\u5e2e\u52a9\u9700\u8981\u5b83\u7684\u90bb\u5c45\u5427\u3002`;
    }
  }
}

function checkTasks(dt) {
  const p = state.player;
  state.nearbyTask = null;
  let nearestDistance = Infinity;
  for (const task of state.tasksList) {
    const near = distance(p, task) < 58;
    if (near) {
      const dist = distance(p, task);
      if (dist < nearestDistance) {
        nearestDistance = dist;
        state.nearbyTask = task;
      }
    }
    if (task.done) continue;
    if (!near) {
      task.progress = Math.max(0, task.progress - dt * 0.8);
      continue;
    }

    if (task.kind === "delivery") {
      const missing = missingNeeds(task.need);
      messageEl.textContent = missing.length
        ? `${task.name}\u9700\u8981\uff1a${needLabels(missing)}\u3002\u6309 E \u5bf9\u8bdd\u3002`
        : `${task.name}\u6b63\u7b49\u7740\u4f60\u3002\u6309 E \u5bf9\u8bdd\u540e\u4ea4\u7ed9TA\u3002`;
      continue;
    }

    if (task.kind === "quiz") {
      messageEl.textContent = taskNearHint(task);
      continue;
    }

    if (task.kind === "boss") {
      messageEl.textContent = firstBossWeapon()
        ? "\u6309 E \u542c\u63d0\u793a\uff0c\u518d\u6309\u7a7a\u683c\u6216\u70b9\u201c\u653b\u51fb\u201d\uff01"
        : "\u6309 E \u542c\u63d0\u793a\uff0c\u5148\u6536\u96c6\u52c7\u6c14\u661f\u3001\u9b54\u6cd5\u7b14\u6216\u5b88\u62a4\u4e66\uff01";
      continue;
    }

    task.progress += dt;
    messageEl.textContent = task.speech;
    if (task.progress >= 1.65) {
      completeTask(task, task.x, task.y);
    }
  }
  if (state.nearbyTask?.done) {
    messageEl.textContent = `${state.nearbyTask.name}\u5df2\u7ecf\u5f88\u5f00\u5fc3\u5566\u3002\u6309 E \u518d\u804a\u804a\u3002`;
  }
}

function completeTask(task, x, y) {
  task.done = true;
  task.progress = 1;
  state.tasks += 1;
  state.hearts += 3;
  state.time = Math.min(levels[state.levelIndex].time + 8, state.time + 5);
  burst(x, y, "#f46a5c", 18);
  addFloatingText(x, y - 54, "\u5e2e\u5fd9\u6210\u529f +3", "#e84b3f");
  messageEl.textContent = `${task.name}\u5f00\u5fc3\u5566\uff0c\u7231\u5fc3 +3\uff0c\u65f6\u95f4 +5\u3002`;
}

function missingNeeds(needs) {
  const remaining = [...state.inventory];
  const missing = [];
  for (const need of needs) {
    const idx = remaining.indexOf(need);
    if (idx >= 0) remaining.splice(idx, 1);
    else missing.push(need);
  }
  return missing;
}

function consumeNeeds(needs) {
  for (const need of needs) {
    const idx = state.inventory.indexOf(need);
    if (idx >= 0) state.inventory.splice(idx, 1);
  }
}

function firstBossWeapon() {
  return ["courageStar", "magicPencil", "guardBook"].find((type) => state.inventory.includes(type));
}

function bossDamage(type) {
  return {
    courageStar: 2,
    magicPencil: 3,
    guardBook: 2,
  }[type] || 1;
}

function needLabels(needs) {
  return needs.map((need) => itemLabel(need)).join(" + ");
}

function itemLabel(type) {
  return {
    apple: "\u82f9\u679c",
    book: "\u4e66\u672c",
    pencil: "\u94c5\u7b14",
    leaf: "\u53f6\u5b50\u626b\u5e1a",
    seed: "\u82b1\u79cd",
    bell: "\u5c0f\u94c3\u94db",
    lantern: "\u706f\u7b3c",
    map: "\u5730\u56fe",
    potion: "\u7231\u5fc3\u836f\u6c34",
    courageStar: "\u52c7\u6c14\u661f",
    magicPencil: "\u9b54\u6cd5\u94c5\u7b14",
    guardBook: "\u5b88\u62a4\u4e66",
  }[type] || type;
}

function quizDisplay(taskOrKind) {
  const key = typeof taskOrKind === "string" ? taskOrKind : taskOrKind?.quizKey || taskOrKind?.animal;
  return QUIZ_DISPLAY[key] || null;
}

function taskShortHint(task) {
  if (task.done) return "\u5b8c\u6210";
  if (task.kind === "quiz") return quizDisplay(task)?.short || task.speech;
  if (task.kind === "delivery") return missingNeeds(task.need).length ? "\u5bf9\u8bdd" : "\u4ea4\u7ed9TA";
  if (task.kind === "boss") return "Boss";
  return "\u5e2e\u5fd9";
}

function taskNearHint(task) {
  if (task.done) return `${task.name}\u5df2\u5b8c\u6210\u3002\u6309 E \u518d\u804a\u804a\u3002`;
  if (task.kind === "quiz") return quizDisplay(task)?.near || "\u6309 E \u6311\u6218";
  if (task.kind === "delivery") {
    const missing = missingNeeds(task.need);
    return missing.length ? `${task.name}\u9700\u8981\uff1a${needLabels(missing)}\u3002\u6309 E \u5bf9\u8bdd\u3002` : "\u6309 E \u4ea4\u7ed9TA";
  }
  if (task.kind === "boss") return firstBossWeapon() ? "\u6309 E \u542c\u63d0\u793a\uff0c\u518d\u653b\u51fb\u3002" : "\u6309 E \u542c\u63d0\u793a\u3002";
  return "\u6309 E \u5bf9\u8bdd";
}

function shouldShowTaskHint(task) {
  return state.nearbyTask === task || state.activeDialogue?.task === task || (task.kind === "action" && task.progress > 0.08);
}

function taskDialogueMode(task) {
  if (task.done) return "after";
  if (task.kind === "delivery") return missingNeeds(task.need).length ? (task.dialogueSeen ? "missing" : "intro") : "ready";
  if (task.kind === "quiz") return task.dialogueSeen ? "ready" : "intro";
  if (task.kind === "boss") return firstBossWeapon() ? "ready" : "missing";
  return task.dialogueSeen ? "ready" : "intro";
}

function taskDialogueLines(task, mode) {
  const library = task.dialogue || DIALOGUE_LIBRARY[task.animal] || {};
  if (library[mode]?.length) return library[mode];
  if (mode === "intro" && task.kind === "quiz") return [quizDisplay(task)?.dialogue || task.speech];
  if (mode === "intro") return [`${task.name}\uff1a${task.speech}`];
  if (mode === "missing" && task.need) return [`\u6211\u8fd8\u9700\u8981\uff1a${needLabels(missingNeeds(task.need))}\u3002`];
  if (mode === "ready" && task.kind === "delivery") return [`\u4f60\u5df2\u7ecf\u627e\u5230${needLabels(task.need)}\u5566\uff01`];
  if (mode === "ready" && task.kind === "quiz") return ["\u51c6\u5907\u597d\u4e86\u5417\uff1f\u6211\u4eec\u6765\u6311\u6218\u4e00\u9898\u5427\u3002"];
  if (mode === "complete") return ["\u8c22\u8c22\u4f60\uff01\u4efb\u52a1\u5b8c\u6210\u5566\u3002"];
  if (mode === "after") return ["\u8c22\u8c22\u4f60\uff0c\u4eca\u5929\u4e5f\u8981\u5f00\u5fc3\u5192\u9669\u54e6\uff01"];
  return [task.speech || "\u4f60\u597d\u5440\uff01"];
}

function dialogueRoleLabel(task) {
  if (task.kind === "delivery") return "\u9700\u8981\u5e2e\u5fd9";
  if (task.kind === "quiz") return "\u9898\u76ee\u6311\u6218";
  if (task.kind === "boss") return "Boss \u63d0\u793a";
  return "\u573a\u666f\u5e2e\u5fd9";
}

function dialogueAvatarFallback(task) {
  return {
    deer: "\u9e7f",
    squirrel: "\u677e",
    rabbit: "\u5154",
    ant: "\u8681",
    butterfly: "\u8776",
    fox: "\u72d0",
    firefly: "\u5149",
    hedgehog: "\u523a",
    owl: "\u9e70",
    chest: "\u7bb1",
    boss: "\u718a",
  }[task.animal] || task.name.slice(0, 1);
}

function setDialogueAvatar(task) {
  if (!dialogueAvatar) return;
  dialogueAvatar.innerHTML = "";
  const artKey = typeof ART_PACK_NPC_KEYS !== "undefined" ? ART_PACK_NPC_KEYS[task.animal] : null;
  const image =
    (task.animal === "boss" && window.CATS_OWLS_ART_PACK_01?.get("boss", "blackBear")) ||
    (artKey && window.CATS_OWLS_ART_PACK_01?.get("npc", artKey));
  if (image && image.complete && image.naturalWidth > 0) {
    const avatar = document.createElement("img");
    avatar.alt = task.name;
    avatar.src = image.src;
    dialogueAvatar.appendChild(avatar);
    return;
  }
  dialogueAvatar.textContent = dialogueAvatarFallback(task);
}

function openDialogue(task) {
  if (!task || !dialoguePanel) return;
  const mode = taskDialogueMode(task);
  task.dialogueSeen = true;
  state.activeDialogue = {
    taskId: task.id,
    task,
    speaker: task.name,
    lines: taskDialogueLines(task, mode),
    index: 0,
    mode,
  };
  keys.clear();
  touchDirs.clear();
  renderDialogue();
}

function renderDialogue() {
  const dialogue = state?.activeDialogue;
  if (!dialogue || !dialoguePanel) return;
  const task = dialogue.task;
  dialoguePanel.hidden = false;
  dialogueName.textContent = dialogue.speaker;
  dialogueRole.textContent = dialogueRoleLabel(task);
  dialogueText.textContent = dialogue.lines[dialogue.index] || "";
  setDialogueAvatar(task);
  const hasNext = dialogue.index < dialogue.lines.length - 1;
  dialogueNextBtn.hidden = !hasNext;
  dialogueGiveBtn.hidden = !(task.kind === "delivery" && dialogue.mode === "ready" && !task.done);
  dialogueQuizBtn.hidden = !(task.kind === "quiz" && !task.done && !hasNext);
}

function nextDialogueLine() {
  const dialogue = state?.activeDialogue;
  if (!dialogue) return;
  if (dialogue.index < dialogue.lines.length - 1) {
    dialogue.index += 1;
    renderDialogue();
  } else if (!dialogueGiveBtn.hidden) {
    finishDialogueDelivery();
  } else if (!dialogueQuizBtn.hidden) {
    startDialogueQuiz();
  } else {
    closeDialogue();
  }
}

function closeDialogue() {
  if (dialoguePanel) dialoguePanel.hidden = true;
  if (state) state.activeDialogue = null;
}

function finishDialogueDelivery() {
  const dialogue = state?.activeDialogue;
  const task = dialogue?.task;
  if (!task || task.kind !== "delivery" || task.done || missingNeeds(task.need).length) return;
  consumeNeeds(task.need);
  completeTask(task, task.x, task.y);
  state.activeDialogue = {
    taskId: task.id,
    task,
    speaker: task.name,
    lines: taskDialogueLines(task, "complete"),
    index: 0,
    mode: "complete",
  };
  updateHud();
  renderDialogue();
}

function startDialogueQuiz() {
  const task = state?.activeDialogue?.task;
  if (!task || task.kind !== "quiz" || task.done) return;
  closeDialogue();
  openQuiz(task);
}

function talkToNearbyTask() {
  if (!state?.running || state.activeQuiz) return;
  if (state.activeDialogue) {
    nextDialogueLine();
    return;
  }
  if (state.nearbyTask) openDialogue(state.nearbyTask);
}

function openQuiz(task) {
  if (state.activeQuiz === task) return;
  closeDialogue();
  state.activeQuiz = task;
  quizTitle.textContent = task.quiz.title;
  quizQuestion.textContent = task.quiz.question;
  quizOptions.innerHTML = "";
  task.quiz.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerQuiz(task, index));
    quizOptions.appendChild(button);
  });
  quizPanel.hidden = false;
}

function answerQuiz(task, index) {
  if (index === task.quiz.answer) {
    closeQuiz();
    completeTask(task, task.x, task.y);
    return;
  }
  state.hearts = Math.max(0, state.hearts - 1);
  messageEl.textContent = "\u518d\u60f3\u4e00\u4e0b\uff0c\u8fd9\u9898\u5f88\u63a5\u8fd1\u7b54\u6848\u4e86\u3002";
  addFloatingText(task.x, task.y - 54, "\u518d\u8bd5\u4e00\u6b21", "#277faf");
  updateHud();
}

function closeQuiz() {
  if (quizPanel) quizPanel.hidden = true;
  if (quizOptions) quizOptions.innerHTML = "";
  if (state) state.activeQuiz = null;
}

function updateParticles(dt) {
  if (!state) return;
  state.shake = Math.max(0, state.shake - dt);
  state.sparkles = state.sparkles.filter((s) => {
    s.life -= dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.vy += 18 * dt;
    return s.life > 0;
  });
  state.floaters = state.floaters.filter((f) => {
    f.life -= dt;
    f.y -= dt * 34;
    return f.life > 0;
  });
}

function updateLeaves(dt) {
  if (!state) return;
  for (const leaf of state.leaves) {
    leaf.y += leaf.speed * dt;
    leaf.x += Math.sin(performance.now() / 700 + leaf.phase) * dt * 18;
    leaf.rot += dt * leaf.spin;
    if (leaf.y > canvas.height + 18) {
      leaf.y = -20;
      leaf.x = (leaf.x * 1.7 + 131) % canvas.width;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  if (state && state.shake > 0) {
    const shake = state.shake * 18;
    ctx.translate(Math.sin(performance.now() / 24) * shake, Math.cos(performance.now() / 32) * shake);
  }
  drawBackground();
  drawLandmarks();
  drawLeaves();
  drawSceneObjects();
  drawCollectibles();
  drawTasks();
  drawHazards();
  drawProjectiles();
  drawPlayer();
  drawParticles();
  if (!state.running && !state.levelClear && state.time === levels[state.levelIndex].time) drawStartHint();
  if (state.levelClear) drawLevelRibbon();
  ctx.restore();
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#dff5f6");
  sky.addColorStop(0.48, "#eaf8d8");
  sky.addColorStop(1, "#a7db75");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const image = gameEntered ? ensureBackground(levelBackgroundKey(levels[state.levelIndex])) : null;
  if (image && image.complete && image.naturalWidth) {
    ctx.save();
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  } else {
    drawTree(90, 135, 1.15);
    drawTree(850, 125, 1.05);
    drawTree(760, 360, 0.75);
    drawTree(205, 420, 0.66);
    drawSchool();
    drawPath();
  }

  const vignette = ctx.createRadialGradient(480, 280, 160, 480, 280, 620);
  vignette.addColorStop(0, "rgba(255,255,255,0)");
  vignette.addColorStop(1, "rgba(38,65,50,0.16)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(36, 65, 52, 0.08)";
  ctx.beginPath();
  ctx.ellipse(480, 536, 520, 70, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPath() {
  ctx.strokeStyle = "rgba(238, 193, 90, 0.46)";
  ctx.lineWidth = 44;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(78, 450);
  ctx.bezierCurveTo(250, 350, 300, 170, 520, 250);
  ctx.bezierCurveTo(705, 315, 735, 210, 884, 182);
  ctx.stroke();
}

function drawSchool() {
  ctx.fillStyle = "#f6d77b";
  roundRect(362, 96, 248, 128, 18);
  ctx.fill();
  ctx.fillStyle = "#96bd45";
  ctx.beginPath();
  ctx.moveTo(342, 112);
  ctx.lineTo(486, 42);
  ctx.lineTo(630, 112);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#7bb543";
  roundRect(451, 151, 66, 73, 8);
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  roundRect(392, 126, 45, 38, 8);
  roundRect(535, 126, 45, 38, 8);
  ctx.fill();
  ctx.fillStyle = "#34563e";
  ctx.font = "900 24px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  ctx.fillText("\u68ee\u6797\u5b66\u6821", 486, 92);
}

function drawTree(x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = "#8b5b2b";
  roundRect(-14, 42, 28, 95, 10);
  ctx.fill();
  ctx.fillStyle = "#6fb447";
  circle(-36, 22, 46);
  circle(12, 0, 55);
  circle(50, 42, 42);
  ctx.fillStyle = "#e84b3f";
  circle(-10, 34, 8);
  circle(33, 23, 7);
  ctx.restore();
}

function drawLeaves() {
  for (const leaf of state.leaves) {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.rot);
    ctx.globalAlpha = 0.42;
    ctx.fillStyle = leaf.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, leaf.size * 1.5, leaf.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawSceneObjects() {
  drawObstacles();
  drawPropDecorations();
  for (const puddle of state.puddles) drawGroundPuddle(puddle);

  for (let i = 0; i < 30; i += 1) {
    const x = (i * 127) % 930 + 16;
    const y = ((i * 83) % 380) + 120;
    ctx.fillStyle = i % 2 ? "#f6c95f" : "#f59a8b";
    circle(x, y, 4);
  }
}

function drawGroundPuddle(puddle) {
  const t = performance.now() / 520 + puddle.x * 0.05;
  const stretch = 1 + Math.sin(t) * 0.025;
  const tilt = Math.sin(puddle.x * 0.17) * 0.18;
  ctx.save();
  ctx.translate(puddle.x, puddle.y);
  ctx.rotate(tilt);
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(44, 74, 54, 0.16)";
  ctx.beginPath();
  ctx.ellipse(0, puddle.r * 0.18, puddle.r * 1.6, puddle.r * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();

  const water = ctx.createRadialGradient(-puddle.r * 0.32, -puddle.r * 0.12, 2, 0, 0, puddle.r * 1.55);
  water.addColorStop(0, "rgba(210, 244, 238, 0.58)");
  water.addColorStop(0.62, "rgba(82, 161, 177, 0.34)");
  water.addColorStop(1, "rgba(31, 95, 116, 0.12)");
  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.ellipse(0, 0, puddle.r * 1.36 * stretch, puddle.r * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(-puddle.r * 0.12, -puddle.r * 0.04, puddle.r * 0.72, puddle.r * 0.18, -0.08, 0.08 * Math.PI, 0.92 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

function drawPropDecorations() {
  const decorations = state.propDecorations || [];
  for (const prop of decorations) {
    ctx.save();
    ctx.translate(prop.x, prop.y);
    drawItemShadow(0, prop.height * 0.5, prop.width * 0.36, Math.max(4, prop.height * 0.08));
    if (!drawPropImage(ctx, prop.type, -prop.width / 2, -prop.height / 2, prop.width, prop.height)) {
      drawMiniPropFallback(prop);
    }
    ctx.restore();
  }
}

function drawMiniPropFallback(prop) {
  ctx.save();
  ctx.fillStyle = "rgba(246, 211, 101, 0.9)";
  roundRect(-prop.width / 2, -prop.height / 2, prop.width, prop.height, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(139,91,43,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#34563e";
  ctx.font = "900 9px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  fitText(prop.label || prop.type, 0, prop.height / 2 + 12, Math.max(36, prop.width + 10));
  ctx.restore();
}

function drawObstacles() {
  for (const obstacle of state.obstacles) {
    const artKey = ART_PACK_OBSTACLE_KEYS[obstacle.type];
    if (artKey && drawObstacleArtPackImage(obstacle, artKey)) continue;
    if (obstacle.type === "pond") drawPond(obstacle.x, obstacle.y, obstacle.r);
    else if (obstacle.type === "bush") drawBush(obstacle.x, obstacle.y, obstacle.r);
    else if (obstacle.type === "pit") drawPit(obstacle.x, obstacle.y, obstacle.r);
  }
}

const ART_PACK_PROP_KEYS = {
  apple: "apple",
  book: "book",
  pencil: "pencil",
  leaf: "leafBroom",
  seed: "flowerSeeds",
  bell: "bell",
  lantern: "hangingLantern",
  map: "map",
  guardBook: "guardBook",
  courageStar: "courageStar",
  magicPencil: "magicPencil",
  potion: "potion",
  treasureChest: "treasureChest",
  leafLamp: "leafLamp",
  hangingLantern: "hangingLantern",
  flowerBulbLamp: "flowerBulbLamp",
};

const ART_PACK_OBSTACLE_KEYS = {
  pond: "pond",
  bush: "bush",
  pit: "pit",
  stump: "stump",
  rock: "rock",
};

const ART_PACK_NPC_KEYS = {
  rabbit: "lily",
  squirrel: "coco",
  hedgehog: "nono",
  deer: "deer",
  ant: "ant",
  butterfly: "butterfly",
  fox: "fox",
  firefly: "firefly",
  owl: "owlPrincipal",
};

const ART_PACK_SCENE_PROP_KEYS = {
  chest: "treasureChest",
  light: ["leafLamp", "flowerBulbLamp"],
  flower: "flowerBed",
};

const NPC_VISUAL_OFFSETS = {
  deer: { x: 0, y: 14 },
  squirrel: { x: 0, y: 10 },
  rabbit: { x: 0, y: 24 },
  ant: { x: 0, y: 14 },
  butterfly: { x: 0, y: 6 },
  fox: { x: 0, y: 12 },
  firefly: { x: 0, y: 4 },
  hedgehog: { x: 0, y: 10 },
  owl: { x: 0, y: 8 },
  boss: { x: 0, y: 26 },
};

const ART_PACK_ITEM_BOUNDS = {
  apple: { x: -24, y: -28, w: 48, h: 48 },
  book: { x: -27, y: -29, w: 54, h: 54 },
  pencil: { x: -24, y: -11, w: 48, h: 22 },
  leaf: { x: -23, y: -23, w: 46, h: 46 },
  seed: { x: -16, y: -16, w: 32, h: 32 },
  bell: { x: -15, y: -15, w: 30, h: 30 },
  lantern: { x: -17, y: -23, w: 34, h: 46 },
  map: { x: -21, y: -17, w: 42, h: 34 },
  guardBook: { x: -27, y: -29, w: 54, h: 54 },
  courageStar: { x: -27, y: -29, w: 54, h: 54 },
  magicPencil: { x: -27, y: -13, w: 54, h: 26 },
  potion: { x: -22, y: -30, w: 44, h: 54 },
  treasureChest: { x: -24, y: -20, w: 48, h: 40 },
  leafLamp: { x: -17, y: -23, w: 34, h: 46 },
  hangingLantern: { x: -17, y: -23, w: 34, h: 46 },
  flowerBulbLamp: { x: -16, y: -21, w: 32, h: 42 },
  flowerBed: { x: -43, y: -18, w: 86, h: 36 },
};

const ART_PACK_OBSTACLE_BOUNDS = {
  pond: (r) => ({ x: -r * 1.72, y: -r * 0.98, w: r * 3.44, h: r * 1.96 }),
  bush: (r) => ({ x: -r * 1.08, y: -r * 0.96, w: r * 2.16, h: r * 1.92 }),
  pit: (r) => ({ x: -r * 1.2, y: -r * 0.82, w: r * 2.4, h: r * 1.64 }),
  stump: (r) => ({ x: -r, y: -r, w: r * 2, h: r * 2 }),
  rock: (r) => ({ x: -r, y: -r, w: r * 2, h: r * 2 }),
};

const ART_PACK_NPC_BOUNDS = {
  rabbit: { x: -36, y: -55, w: 72, h: 88 },
  squirrel: { x: -38, y: -55, w: 76, h: 88 },
  hedgehog: { x: -38, y: -52, w: 76, h: 84 },
  deer: { x: -38, y: -66, w: 76, h: 104 },
  ant: { x: -35, y: -58, w: 70, h: 92 },
  butterfly: { x: -48, y: -62, w: 96, h: 98 },
  fox: { x: -38, y: -62, w: 76, h: 100 },
  firefly: { x: -40, y: -62, w: 80, h: 98 },
  owl: { x: -44, y: -78, w: 88, h: 88 },
};

function drawArtPackImage(category, key, x, y, w, h) {
  const pack = window.CATS_OWLS_ART_PACK_01;
  const image = pack?.get?.(category, key);
  if (!image || !image.complete || image.naturalWidth <= 0) return false;
  ctx.drawImage(image, x, y, w, h);
  return true;
}

function drawPropImage(ctxArg, key, x, y, width, height) {
  const pack = window.CATS_OWLS_ART_PACK_01;
  const image = pack?.get?.("props", key);
  if (image && image.complete && image.naturalWidth > 0) {
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    ctxArg.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
    return true;
  }
  return false;
}

function drawObstacleArtPackImage(obstacle, key) {
  const getBounds = ART_PACK_OBSTACLE_BOUNDS[key];
  if (!getBounds) return false;
  const bounds = getBounds(obstacle.r);
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  const drawn = drawArtPackImage("obstacles", key, bounds.x, bounds.y, bounds.w, bounds.h);
  ctx.restore();
  return drawn;
}

function drawItemArtPackImage(type) {
  const key = ART_PACK_PROP_KEYS[type];
  const bounds = ART_PACK_ITEM_BOUNDS[type];
  if (!key || !bounds) return false;
  if (window.ART_ASSETS?.props?.[key]) {
    return drawPropImage(ctx, key, bounds.x, bounds.y, bounds.w, bounds.h);
  }
  return drawArtPackImage("props", key, bounds.x, bounds.y, bounds.w, bounds.h);
}

function drawNpcArtPackImage(kind) {
  const key = ART_PACK_NPC_KEYS[kind];
  const bounds = ART_PACK_NPC_BOUNDS[kind];
  if (!key || !bounds) return false;
  return drawArtPackImage("npc", key, bounds.x, bounds.y, bounds.w, bounds.h);
}

function drawScenePropArtPackImage(kind) {
  const keys = ART_PACK_SCENE_PROP_KEYS[kind];
  const candidates = Array.isArray(keys) ? keys : [keys];
  for (const key of candidates) {
    const bounds = ART_PACK_ITEM_BOUNDS[key];
    if (key && bounds && drawPropImage(ctx, key, bounds.x, bounds.y, bounds.w, bounds.h)) return true;
  }
  return false;
}

function drawPond(x, y, r) {
  const pulse = 1 + Math.sin(performance.now() / 520 + x) * 0.025;
  ctx.save();
  drawShadow(x, y + r * 0.36, r * 1.28, r * 0.18);
  const moss = ctx.createRadialGradient(x - r * 0.25, y - r * 0.2, 2, x, y, r * 1.7);
  moss.addColorStop(0, "rgba(116, 158, 82, 0.42)");
  moss.addColorStop(1, "rgba(50, 95, 44, 0.14)");
  ctx.fillStyle = moss;
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.12, r * 1.72, r * 0.94, -0.08, 0, Math.PI * 2);
  ctx.fill();
  const water = ctx.createRadialGradient(x - r * 0.3, y - r * 0.25, 4, x, y, r * 1.4);
  water.addColorStop(0, "rgba(195, 238, 239, 0.92)");
  water.addColorStop(0.58, "rgba(69, 157, 177, 0.86)");
  water.addColorStop(1, "rgba(38, 103, 123, 0.88)");
  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.45 * pulse, r * 0.82, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x - r * 0.18, y - r * 0.14, r * 0.55, r * 0.18, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(99, 116, 82, 0.55)";
  for (let i = 0; i < 5; i += 1) {
    const a = i * 1.25;
    circle(x + Math.cos(a) * r * 1.28, y + Math.sin(a) * r * 0.68, 3 + (i % 2));
  }
  drawGrassTufts(x, y + r * 0.56, r);
  ctx.restore();
}

function drawBush(x, y, r) {
  ctx.save();
  drawShadow(x, y + r * 0.42, r * 1.05, r * 0.18);
  const colors = ["#315f31", "#467b38", "#669d48", "#7cb85a"];
  for (let i = 0; i < 11; i += 1) {
    const angle = (Math.PI * 2 * i) / 11;
    const bx = x + Math.cos(angle) * r * (i % 3 === 0 ? 0.5 : 0.32);
    const by = y + Math.sin(angle) * r * 0.24;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.ellipse(bx, by, r * (i % 2 ? 0.34 : 0.42), r * (i % 2 ? 0.24 : 0.31), angle, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  circle(x - r * 0.22, y - r * 0.24, r * 0.13);
  ctx.fillStyle = "rgba(49, 95, 49, 0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.45, r * 0.95, r * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(246, 201, 95, 0.72)";
  circle(x + r * 0.28, y - r * 0.12, 2.5);
  circle(x - r * 0.36, y + r * 0.03, 2);
  drawGrassTufts(x, y + r * 0.48, r * 0.8);
  ctx.restore();
}

function drawPit(x, y, r) {
  ctx.save();
  drawShadow(x, y + r * 0.18, r * 1.05, r * 0.18);
  const dirt = ctx.createRadialGradient(x - r * 0.15, y - r * 0.25, 4, x, y, r);
  dirt.addColorStop(0, "rgba(159, 112, 64, 0.9)");
  dirt.addColorStop(0.58, "rgba(102, 70, 43, 0.92)");
  dirt.addColorStop(1, "rgba(45, 34, 27, 0.96)");
  ctx.fillStyle = dirt;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.15, r * 0.72, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(174, 132, 72, 0.58)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.2, r * 0.78, 0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(122, 86, 50, 0.28)";
  for (let i = 0; i < 4; i += 1) {
    circle(x - r * 0.7 + i * r * 0.42, y - r * 0.4 + (i % 2) * r * 0.18, 3);
  }
  ctx.fillStyle = "rgba(103, 145, 68, 0.45)";
  ctx.beginPath();
  ctx.ellipse(x - r * 0.86, y + r * 0.18, r * 0.26, r * 0.08, -0.2, 0, Math.PI * 2);
  ctx.ellipse(x + r * 0.84, y - r * 0.1, r * 0.22, r * 0.07, 0.25, 0, Math.PI * 2);
  ctx.fill();
  drawGrassTufts(x, y + r * 0.46, r * 0.72);
  ctx.restore();
}

function drawGrassTufts(x, y, r) {
  ctx.save();
  ctx.strokeStyle = "rgba(74, 126, 56, 0.62)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  for (let i = 0; i < 5; i += 1) {
    const bx = x - r * 0.65 + i * r * 0.32;
    const h = 7 + (i % 3) * 2;
    ctx.beginPath();
    ctx.moveTo(bx, y);
    ctx.lineTo(bx - 4, y - h);
    ctx.moveTo(bx, y);
    ctx.lineTo(bx + 3, y - h * 0.85);
    ctx.stroke();
  }
  ctx.restore();
}

function drawConcreteSchool(x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  drawShadow(0, 112, 150, 18);
  const wall = ctx.createLinearGradient(0, -80, 0, 70);
  wall.addColorStop(0, "#f8dc8a");
  wall.addColorStop(1, "#c68642");
  ctx.fillStyle = wall;
  roundRect(-118, -56, 236, 128, 16);
  ctx.fill();
  ctx.fillStyle = "#8bc34d";
  ctx.beginPath();
  ctx.moveTo(-138, -52);
  ctx.lineTo(0, -126);
  ctx.lineTo(138, -52);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#6eaa3d";
  roundRect(-62, 8, 54, 64, 8);
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  roundRect(26, -28, 38, 30, 6);
  roundRect(76, -28, 38, 30, 6);
  roundRect(-106, -28, 38, 30, 6);
  ctx.fill();
  ctx.fillStyle = "#6b4a31";
  roundRect(-94, 76, 188, 14, 6);
  ctx.fill();
  ctx.fillStyle = "#315f3e";
  roundRect(-44, -106, 88, 30, 8);
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  ctx.font = "900 16px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  ctx.fillText("\u68ee\u6797\u5b66\u6821", 0, -85);
  ctx.restore();
}

function drawGroundFlowerBed(x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  drawShadow(0, 32, 82, 14);
  ctx.fillStyle = "#7a4b2a";
  ctx.beginPath();
  ctx.ellipse(0, 12, 78, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d7b06a";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, 12, 86, 36, 0, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 7; i += 1) {
    const px = -54 + i * 18;
    const py = 4 + Math.sin(i) * 7;
    ctx.strokeStyle = "#4f8b38";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px, py + 18);
    ctx.lineTo(px, py - 8);
    ctx.stroke();
    ctx.fillStyle = i % 2 ? "#ffd75e" : "#f59a8b";
    circle(px, py - 12, 8);
  }
  ctx.restore();
}

function drawPotionStump(x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  drawShadow(0, 26, 48, 11);
  const stump = ctx.createLinearGradient(0, -26, 0, 30);
  stump.addColorStop(0, "#a96835");
  stump.addColorStop(1, "#6b3b20");
  ctx.fillStyle = stump;
  roundRect(-38, -10, 76, 38, 12);
  ctx.fill();
  ctx.fillStyle = "#c78645";
  ctx.beginPath();
  ctx.ellipse(0, -12, 38, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(92,53,27,0.45)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -12, 23, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawLandmarks() {
  const index = state.levelIndex;
  if (index === 0) {
    drawConcreteSchool(464, 116, 0.78);
  }
  if (index === 1) {
    drawGroundFlowerBed(382, 414, 1);
  }
  if (index === 3) {
    drawConcreteSchool(490, 128, 0.58);
    drawGroundFlowerBed(500, 104, 0.74);
  }
}

function drawCollectibles() {
  for (const entry of state.collectibles) {
    if (entry.taken) continue;
    const t = performance.now() / 260 + entry.x;
    const bob = entry.type === "potion" ? Math.sin(t) * 1.4 : Math.sin(t) * 5;
    const scale = 1 + Math.sin(t) * 0.04;
    ctx.save();
    ctx.translate(entry.x, entry.y + bob);
    if (entry.type !== "potion") drawCollectibleGlow(t);
    drawItemShadow(0, 25, entry.type === "potion" ? 20 : 31, 8);
    ctx.scale(scale, scale);
    drawCollectibleSparkles(t, entry.type);
    drawItem(entry.type);
    drawMiniLabel(entry);
    ctx.restore();
  }
}

function drawItem(type) {
  if (drawItemArtPackImage(type)) return;
  if (type === "apple") drawApple();
  else if (type === "book") drawBook("#2f9dcc");
  else if (type === "pencil") drawPencil();
  else if (type === "leaf") drawLeafBroom();
  else if (type === "seed") drawSeed();
  else if (type === "bell") drawBell();
  else if (type === "lantern") drawLantern();
  else if (type === "map") drawMap();
  else if (type === "potion") drawPotion();
  else if (type === "courageStar") drawCourageStar();
  else if (type === "magicPencil") drawMagicPencil();
  else if (type === "guardBook") drawGuardBook();
}

function drawTasks() {
  for (const task of state.tasksList) {
    ctx.save();
    const t = performance.now() / 360 + task.x * 0.03;
    const idleBob = task.done || task.kind === "boss" ? 0 : Math.sin(t) * 2.2;
    const idleScale = task.done || task.kind === "boss" ? 1 : 1 + Math.sin(t + 0.8) * 0.018;
    ctx.translate(task.x, task.y + idleBob);
    ctx.scale(idleScale, idleScale);
    ctx.globalAlpha = task.done ? 0.58 : 1;
    drawSpeech(task);
    drawAnimal(task.animal);
    if (task.kind === "action" && !task.done) drawTaskProgress(task.progress);
    if (task.kind === "boss" && !task.done) drawBossProgress(task.progress);
    ctx.restore();
  }
}

function drawHazards() {
  for (const hazard of state.hazards) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(0.72, hazard.life / 2));
    ctx.fillStyle = "rgba(91, 58, 36, 0.45)";
    ctx.beginPath();
    ctx.ellipse(hazard.x, hazard.y, hazard.r * 1.35, hazard.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 217, 74, 0.65)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(hazard.x, hazard.y, hazard.r + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawProjectiles() {
  for (const shot of state.projectiles) {
    ctx.save();
    ctx.translate(shot.x, shot.y);
    const angle = Math.atan2(shot.vy, shot.vx);
    ctx.rotate(angle);
    ctx.fillStyle = itemColor(shot.type);
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.ellipse(-18, 0, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.rotate(-angle);
    ctx.scale(0.72, 0.72);
    drawItem(shot.type);
    ctx.restore();
  }
}

function drawSpeech(task) {
  if (!shouldShowTaskHint(task)) return;
  const label = task.done ? "\u5b8c\u6210" : taskShortHint(task);
  const width = Math.max(48, Math.min(82, 24 + label.length * 14));
  ctx.fillStyle = task.done ? "rgba(236, 255, 226, 0.9)" : "rgba(255, 247, 223, 0.88)";
  roundRect(-width / 2, -70, width, 26, 8);
  ctx.fill();
  ctx.strokeStyle = task.done ? "rgba(111, 180, 71, 0.58)" : "rgba(218, 156, 78, 0.42)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#34563e";
  ctx.font = "900 11px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  fitText(label, 0, -53, width - 12);
}

function drawTaskProgress(progress) {
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  roundRect(-30, 34, 60, 9, 5);
  ctx.fill();
  ctx.fillStyle = "#83b83d";
  roundRect(-30, 34, 60 * clamp(progress / 1.65, 0, 1), 9, 5);
  ctx.fill();
}

function drawBossProgress(progress) {
  ctx.fillStyle = "rgba(255,247,223,0.94)";
  roundRect(-90, 56, 180, 34, 10);
  ctx.fill();
  const boss = state.tasksList.find((task) => task.kind === "boss");
  const ratio = boss ? boss.hp / boss.maxHp : 1;
  ctx.fillStyle = "#5b3212";
  ctx.font = "900 10px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  ctx.fillText("\u9ed1\u718a\u602a\u8840\u91cf", 0, 67);
  ctx.fillStyle = "#7d2b2a";
  roundRect(-74, 70, 148, 10, 5);
  ctx.fill();
  ctx.fillStyle = ratio > 0.35 ? "#e84b3f" : "#ff8a3d";
  roundRect(-74, 70, 148 * clamp(ratio, 0, 1), 10, 5);
  ctx.fill();
  ctx.fillStyle = "#ffd94a";
  roundRect(-74, 83, 148 * clamp(progress / 0.9, 0, 1), 5, 3);
  ctx.fill();
}

function drawAnimal(kind) {
  const visualOffset = NPC_VISUAL_OFFSETS[kind];
  if (visualOffset) ctx.translate(visualOffset.x, visualOffset.y);
  if (drawNpcArtPackImage(kind)) return;
  if (drawScenePropArtPackImage(kind)) return;
  const npc = NPC_REGISTRY[kind];
  if (npc?.renderer) {
    npc.renderer();
    return;
  }
  if (kind === "deer") drawDeer();
  else if (kind === "squirrel") drawSquirrel();
  else if (kind === "rabbit") drawRabbit();
  else if (kind === "ant") drawAnt();
  else if (kind === "butterfly") drawButterfly();
  else if (kind === "fox") drawFox();
  else if (kind === "flower") drawFlowerPatch();
  else if (kind === "firefly") drawFirefly();
  else if (kind === "hedgehog") drawHedgehog();
  else if (kind === "chest") drawTreasureChest();
  else if (kind === "boss") drawForestBoss();
  else if (kind === "owl") drawOwl(0, 4, 0.92);
  else if (kind === "sign") drawSign();
  else if (kind === "light") drawTreeLight();
  else if (kind === "spring") drawSpringMushroom();
  else if (kind === "finish") drawFinishFlag();
  else if (kind === "math") drawQuizStand("#ffd75e", quizDisplay("math")?.sign || "\u7b97\u9898");
  else if (kind === "logic") drawQuizStand("#fff2a8", quizDisplay("logic")?.sign || "\u89c4\u5f8b");
  else if (kind === "science") drawQuizStand("#83b83d", quizDisplay("science")?.sign || "\u89c2\u5bdf");
  else if (kind === "language") drawQuizStand("#f6d77b", quizDisplay("language")?.sign || "\u8ba4\u5b57");
  else if (kind === "english") drawQuizStand("#2f9dcc", quizDisplay("english")?.sign || "ABC");
  else if (kind === "riddle") drawQuizStand("#f59a8b", quizDisplay("riddle")?.sign || "\u731c\u8c1c");
}

function drawPlayer() {
  const p = state.player;
  const speed = Math.hypot(p.vx, p.vy);
  const walk = Math.sin(p.step);
  const bounce = speed > 12 ? walk * 3 : Math.sin(performance.now() / 600) * 1.1;
  const role = selectedRole === "owl" ? "owl" : "cat";
  const action = performance.now() < state.attackCooldownUntil ? "happy" : speed > 8 ? "walk" : "idle";
  ctx.save();
  ctx.translate(p.x, p.y + bounce);
  if (p.dir < 0) ctx.scale(-1, 1);
  drawShadow(2, 25, 58, 12);
  if (drawPlayerSprite(role, action, speed, p.step)) {
    ctx.restore();
    return;
  }
  if (drawLegacyPlayerSprite(role, action, speed, p.step)) {
    ctx.restore();
    return;
  }
  if (drawV2CharacterSprite(role === "owl" ? "owl" : "cat", speed, 1, p.step)) {
    ctx.restore();
    return;
  }
  if (role === "owl") {
    drawOwl(0, 2, 1.08, walk, speed, p.step);
  } else {
    drawCat(0, 0, walk, speed, p.step);
  }
  ctx.restore();
}

function preloadPlayerAssets() {
  preloadPlayerAssetGroup(PLAYER_CHARACTER_ASSETS, playerImages);
  preloadPlayerAssetGroup(LEGACY_PLAYER_CHARACTER_ASSETS, legacyPlayerImages);
}

function preloadPlayerAssetGroup(assetGroup, imageStore) {
  Object.entries(assetGroup).forEach(([role, actions]) => {
    imageStore[role] = imageStore[role] || {};
    Object.entries(actions).forEach(([action, sources]) => {
      if (!Array.isArray(sources)) return;
      imageStore[role][action] = imageStore[role][action] || [];
      sources.forEach((src, index) => {
        if (imageStore[role][action][index]) return;
        const image = new Image();
        image.decoding = "async";
        image.onerror = () => console.warn(`Missing player asset: ${src}`);
        image.src = src;
        imageStore[role][action][index] = image;
      });
    });
  });
}

function getPlayerFrames(role, action, imageStore = playerImages) {
  const roleImages = imageStore[role] || {};
  const frames = roleImages[action] || [];
  const ready = frames.filter(isImageReady);
  if (ready.length) return ready;
  const idleFrames = roleImages.idle || [];
  return idleFrames.filter(isImageReady);
}

function getPlayerFrame(role, action, frameIndex, imageStore = playerImages) {
  const frames = getPlayerFrames(role, action, imageStore);
  if (!frames.length) return null;
  return frames[frameIndex % frames.length];
}

function drawPlayerSprite(role, action, speed, step, imageStore = playerImages) {
  const frames = getPlayerFrames(role, action, imageStore);
  if (!frames.length) return false;
  const frameDuration = role === "owl" ? 135 : 150;
  const moving = speed > 8;
  const frameIndex = moving ? Math.floor(performance.now() / frameDuration) : 0;
  const frame = getPlayerFrame(role, action, frameIndex, imageStore);
  if (!frame) return false;
  const size = PLAYER_DRAW_SIZE[role] || PLAYER_DRAW_SIZE.cat;
  const sway = moving ? Math.sin(step * 0.85) * 1.8 : 0;
  ctx.save();
  ctx.rotate(sway * 0.006);
  ctx.drawImage(frame, -size.width / 2, -size.height + size.footOffsetY, size.width, size.height);
  ctx.restore();
  return true;
}

function drawLegacyPlayerSprite(role, action, speed, step) {
  return drawPlayerSprite(role, action, speed, step, legacyPlayerImages);
}

function isImageReady(image) {
  return image.complete && image.naturalWidth > 0;
}

function drawCharacterAsset(characterId, width, height, y) {
  const entry = CHARACTER_REGISTRY[characterId];
  if (!entry || !isImageReady(entry.image)) return false;
  ctx.drawImage(entry.image, -width / 2, y, width, height);
  return true;
}

function v2SpriteFrame(role, speed, step = 0) {
  const now = performance.now();
  const attacking = state && now < state.attackCooldownUntil;
  const moving = speed > 8;
  if (role === "cat") {
    if (attacking) return { row: 0, col: 6 };
    if (moving) return { row: 1, col: Math.floor(step * 1.15) % 6 };
    return { row: 0, col: Math.floor(now / 650) % 2 };
  }
  if (attacking) return { row: 2, col: 6 };
  if (moving) return { row: 3, col: Math.floor(step * 1.05) % 6 };
  return { row: 2, col: Math.floor(now / 700) % 2 };
}

function v2SpriteCrop(role, frame, cellW, cellH) {
  const attacking = frame.col >= 6;
  if (role === "cat") {
    if (attacking) return { x: 4, y: 48, w: cellW - 8, h: cellH - 58 };
    if (frame.row === 1) return { x: 20, y: 24, w: cellW - 40, h: cellH - 34 };
    return { x: 26, y: 52, w: cellW - 52, h: cellH - 62 };
  }
  if (attacking) return { x: 4, y: 14, w: cellW - 8, h: cellH - 26 };
  if (frame.row === 3) return { x: 20, y: 18, w: cellW - 40, h: cellH - 42 };
  return { x: 24, y: 20, w: cellW - 48, h: cellH - 40 };
}

function drawV2CharacterSprite(role, speed, scale = 1, step = 0) {
  if (!isImageReady(characterSheet)) return false;
  const cellW = characterSheet.naturalWidth / 8;
  const cellH = characterSheet.naturalHeight / 4;
  const frame = v2SpriteFrame(role, speed, step);
  const crop = v2SpriteCrop(role, frame, cellW, cellH);
  const drawW = role === "cat" ? 70 * scale : 66 * scale;
  const drawH = role === "cat" ? 94 * scale : 86 * scale;
  const drawY = role === "cat" ? -72 * scale : -64 * scale;
  const lean = clamp(speed / 260, 0, 1) * (role === "cat" ? 0.05 : 0.035);
  ctx.save();
  ctx.rotate(lean);
  ctx.drawImage(
    characterSheet,
    frame.col * cellW + crop.x,
    frame.row * cellH + crop.y,
    crop.w,
    crop.h,
    -drawW / 2,
    drawY,
    drawW,
    drawH
  );
  ctx.restore();
  return true;
}

function drawCat(x, y, walk = 0, speed = 0, step = 0) {
  ctx.save();
  ctx.translate(x, y);
  if (speed < 8 && drawCharacterAsset("mimi", 72, 92, -72)) {
    ctx.restore();
    return;
  }
  if (drawV2CharacterSprite("cat", speed, 1, step)) {
    ctx.restore();
    return;
  }
  const wiggle = speed > 12 ? Math.sin(walk) * 1.2 : Math.sin(performance.now() / 520) * 0.55;
  const blink = speed > 90 && walk > 0.6;
  const face = ctx.createRadialGradient(-8, -20, 3, 0, -8, 36);
  face.addColorStop(0, "#ffffff");
  face.addColorStop(0.78, "#fff8e6");
  face.addColorStop(1, "#ead9ab");
  ctx.fillStyle = face;
  ctx.strokeStyle = "#d9c99b";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-20, -18 + wiggle * 0.2);
  ctx.lineTo(-12, -38 - wiggle * 0.4);
  ctx.lineTo(-3, -20);
  ctx.lineTo(16, -20);
  ctx.lineTo(25, -38 + wiggle * 0.4);
  ctx.lineTo(28, -15 - wiggle * 0.15);
  ctx.quadraticCurveTo(31, 14, 2, 24);
  ctx.quadraticCurveTo(-28, 14, -20, -18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffd6df";
  ctx.beginPath();
  ctx.moveTo(-12, -32);
  ctx.lineTo(-9, -24);
  ctx.lineTo(-5, -21);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(24, -32);
  ctx.lineTo(21, -24);
  ctx.lineTo(17, -21);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(216,188,116,0.58)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(3, -7, 29, 0.28 * Math.PI, 0.72 * Math.PI);
  ctx.stroke();

  drawCatBow(5 + wiggle * 0.1, -42 + wiggle * 0.3, 1 + Math.sin(walk) * 0.04);
  ctx.fillStyle = "#263b32";
  if (blink) {
    roundRect(-13, -9, 9, 3, 2);
    roundRect(7, -9, 9, 3, 2);
    ctx.fill();
  } else {
    circle(-9, -10, 4);
    circle(10, -10, 4);
    ctx.fillStyle = "#ffffff";
    circle(-10, -12, 1.4);
    circle(9, -12, 1.4);
  }
  ctx.fillStyle = "rgba(244,126,139,0.28)";
  circle(-18, 0, 4);
  circle(20, 0, 4);
  ctx.fillStyle = "#f59a8b";
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(-4, 0);
  ctx.lineTo(4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#263b32";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(0, 7, -8, 9);
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(0, 7, 8, 9);
  ctx.stroke();

  ctx.strokeStyle = "rgba(216,188,116,0.72)";
  ctx.lineWidth = 1.3;
  ctx.lineCap = "round";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 15, -3);
    ctx.lineTo(side * 26, -7);
    ctx.moveTo(side * 16, 2);
    ctx.lineTo(side * 28, 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCatBow(x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.rotate(Math.sin(performance.now() / 420) * 0.035);
  const bow = ctx.createLinearGradient(0, -7, 0, 7);
  bow.addColorStop(0, "#5bc4e6");
  bow.addColorStop(1, "#1f8ec4");
  ctx.fillStyle = bow;
  roundRect(-19, -6, 17, 12, 4);
  roundRect(2, -6, 17, 12, 4);
  ctx.fill();
  ctx.fillStyle = "#176a9e";
  circle(0, 0, 4);
  ctx.strokeStyle = "rgba(255,255,255,0.52)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-15, -3);
  ctx.lineTo(-7, -1);
  ctx.moveTo(15, -3);
  ctx.lineTo(7, -1);
  ctx.stroke();
  ctx.restore();
}

function drawOwl(x, y, scale = 1, walk = 0, speed = 0, step = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  if (speed < 8 && drawCharacterAsset("owlly", 68, 86, -64)) {
    ctx.restore();
    return;
  }
  if (drawV2CharacterSprite("owl", speed, 1, step)) {
    ctx.restore();
    return;
  }
  const flap = speed > 18 ? Math.sin(walk * 1.4) * 4 : Math.sin(performance.now() / 500) * 2;
  const owlBody = ctx.createRadialGradient(-8, -20, 4, 0, -4, 33);
  owlBody.addColorStop(0, "#68c94f");
  owlBody.addColorStop(0.62, "#3f9b38");
  owlBody.addColorStop(1, "#286f31");
  ctx.fillStyle = "#327f30";
  ctx.beginPath();
  ctx.ellipse(-22, -4 + flap * 0.2, 9, 23, -0.8, 0, Math.PI * 2);
  ctx.ellipse(22, -4 - flap * 0.2, 9, 23, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.translate(0, flap * 0.12);
  ctx.fillStyle = owlBody;
  ctx.beginPath();
  ctx.ellipse(0, -8, 27, 33, 0, 0, Math.PI * 2);
  ctx.fill();
  const belly = ctx.createLinearGradient(0, -14, 0, 25);
  belly.addColorStop(0, "#fff06a");
  belly.addColorStop(1, "#e8bd38");
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.ellipse(0, 4, 15, 19, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  circle(-10, -16, 11);
  circle(10, -16, 11);
  ctx.strokeStyle = "#f3c13b";
  ctx.lineWidth = 3;
  circleStroke(-10, -16, 12);
  circleStroke(10, -16, 12);
  ctx.strokeStyle = "#805b27";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(2, -17);
  ctx.lineTo(-2, -17);
  ctx.stroke();
  ctx.fillStyle = "#263b32";
  circle(-10, -16, 4);
  circle(10, -16, 4);
  ctx.fillStyle = "#ffffff";
  circle(-12, -18, 1.5);
  circle(9, -18, 1.5);
  ctx.fillStyle = "#e9882d";
  ctx.beginPath();
  ctx.moveTo(-4, -7);
  ctx.lineTo(5, -7);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f6df58";
  circle(0, -42, 7);
  ctx.fillStyle = "#fff06a";
  circle(-5, -38, 4);
  circle(5, -38, 4);
  ctx.restore();
}

function drawParticles() {
  for (const s of state.sparkles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, s.life / s.maxLife);
    ctx.fillStyle = s.color;
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot + s.life * 5);
    star(0, 0, s.size);
    ctx.restore();
  }
  for (const f of state.floaters) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, f.life / 1.05);
    ctx.fillStyle = f.color;
    ctx.font = "900 17px Microsoft YaHei, Arial";
    ctx.textAlign = "center";
    ctx.fillText(f.label, f.x, f.y);
    ctx.restore();
  }
}

function drawStartHint() {
  ctx.fillStyle = "rgba(255, 247, 223, 0.9)";
  roundRect(300, 218, 360, 96, 8);
  ctx.fill();
  ctx.fillStyle = "#3f8a2f";
  ctx.textAlign = "center";
  ctx.font = "900 25px Microsoft YaHei, Arial";
  ctx.fillText("\u70b9\u51fb\u5f00\u59cb\u4e0a\u5b66", 480, 253);
  ctx.font = "800 16px Microsoft YaHei, Arial";
  ctx.fillText("\u65b9\u5411\u952e / WASD / \u5c4f\u5e55\u6309\u94ae\u79fb\u52a8", 480, 282);
}

function drawLevelRibbon() {
  ctx.fillStyle = "rgba(255, 247, 223, 0.92)";
  roundRect(276, 202, 408, 118, 8);
  ctx.fill();
  ctx.fillStyle = "#e84b3f";
  ctx.textAlign = "center";
  ctx.font = "900 30px Microsoft YaHei, Arial";
  ctx.fillText(state.gameComplete ? "\u901a\u5173\u6210\u529f\uff01" : "\u5173\u5361\u5b8c\u6210\uff01", 480, 244);
  ctx.fillStyle = "#3f8a2f";
  ctx.font = "900 18px Microsoft YaHei, Arial";
  const line = state.gameComplete ? "\u5c0f\u732b\u548c\u732b\u5934\u9e70\u5b8c\u6210\u4e86\u68ee\u6797\u5b66\u6821\u7684\u4e00\u5929" : "\u70b9\u51fb\u4e0b\u4e00\u5173\u7ee7\u7eed\u5e2e\u5fd9";
  ctx.fillText(line, 480, 282);
}

function drawApple() {
  drawItemShadow(0, 22, 20, 5);
  const apple = ctx.createRadialGradient(-7, -5, 4, 0, 4, 24);
  apple.addColorStop(0, "#ff8878");
  apple.addColorStop(0.6, "#e84b3f");
  apple.addColorStop(1, "#b92f2d");
  ctx.fillStyle = apple;
  circle(-8, 4, 15);
  circle(8, 4, 15);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  circle(-8, -4, 4);
  ctx.fillStyle = "#75431f";
  roundRect(-2, -18, 5, 16, 3);
  ctx.fill();
  ctx.fillStyle = "#78b84b";
  ctx.beginPath();
  ctx.ellipse(10, -16, 11, 6, -0.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawBook(color) {
  drawItemShadow(0, 24, 24, 5);
  const cover = ctx.createLinearGradient(-22, -18, 22, 18);
  cover.addColorStop(0, "#5bc4e6");
  cover.addColorStop(1, color);
  ctx.fillStyle = cover;
  roundRect(-23, -18, 44, 36, 7);
  ctx.fill();
  ctx.strokeStyle = "rgba(36,65,52,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#f6d77b";
  roundRect(-23, -10, 5, 20, 3);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  roundRect(-17, -12, 14, 24, 4);
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  circle(-10, -3, 5);
  ctx.fillStyle = "#2f9dcc";
  circle(-12, -5, 1.2);
  circle(-8, -5, 1.2);
  ctx.strokeStyle = "#2f9dcc";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.arc(-10, -2, 2.6, 0.1, Math.PI - 0.1);
  ctx.stroke();
  ctx.strokeStyle = "#fff7df";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(0, 18);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 1.4;
  for (const y of [-8, -2, 4]) {
    ctx.beginPath();
    ctx.moveTo(6, y);
    ctx.lineTo(15, y + 1);
    ctx.stroke();
  }
}

function drawPencil() {
  drawItemShadow(0, 16, 26, 4);
  ctx.rotate(-0.7);
  const pencil = ctx.createLinearGradient(-24, -7, 16, 7);
  pencil.addColorStop(0, "#fff18a");
  pencil.addColorStop(1, "#e9ad35");
  ctx.fillStyle = pencil;
  roundRect(-24, -7, 40, 14, 5);
  ctx.fill();
  ctx.strokeStyle = "rgba(139,91,43,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#f6d77b";
  roundRect(-18, -7, 6, 14, 1);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-19, -3);
  ctx.lineTo(12, -3);
  ctx.stroke();
  ctx.fillStyle = "#f1c28b";
  ctx.beginPath();
  ctx.moveTo(16, -7);
  ctx.lineTo(30, 0);
  ctx.lineTo(16, 7);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#244134";
  ctx.beginPath();
  ctx.moveTo(26, -2.5);
  ctx.lineTo(32, 0);
  ctx.lineTo(26, 2.5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f59a8b";
  roundRect(-30, -7, 7, 14, 3);
  ctx.fill();
}

function drawItemShadow(x, y, w, h) {
  ctx.save();
  ctx.fillStyle = "rgba(33, 55, 40, 0.18)";
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCollectibleGlow(t) {
  ctx.save();
  ctx.globalAlpha = 0.2 + Math.sin(t) * 0.04;
  ctx.fillStyle = "#fff7b0";
  star(0, -4, 28);
  ctx.restore();
}

function drawCollectibleSparkles(t, type) {
  if (type === "potion") return;
  ctx.save();
  ctx.globalAlpha = 0.6 + Math.sin(t * 1.7) * 0.18;
  ctx.fillStyle = "#fff7df";
  const a = t * 0.7;
  star(Math.cos(a) * 25, -10 + Math.sin(a) * 16, 4);
  star(Math.cos(a + Math.PI) * 23, -7 + Math.sin(a + Math.PI) * 14, 3);
  ctx.restore();
}

function drawMiniLabel(entry) {
  if (entry.type === "potion") return;
  ctx.save();
  ctx.fillStyle = "rgba(255, 247, 223, 0.88)";
  roundRect(-26, 31, 52, 16, 7);
  ctx.fill();
  ctx.fillStyle = "#34563e";
  ctx.font = "900 9px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  fitText(entry.label, 0, 42, 46);
  ctx.restore();
}

function drawPotion() {
  drawPotionStump(0, 14, 0.48);
  const bottle = ctx.createLinearGradient(0, -34, 0, 16);
  bottle.addColorStop(0, "#fff7ff");
  bottle.addColorStop(0.45, "#ff8fb0");
  bottle.addColorStop(1, "#d93672");
  ctx.fillStyle = bottle;
  roundRect(-10, -30, 20, 42, 7);
  ctx.fill();
  ctx.fillStyle = "#8a4a2a";
  roundRect(-7, -40, 14, 10, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  roundRect(-6, -24, 5, 25, 3);
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  ctx.beginPath();
  ctx.moveTo(0, -7);
  ctx.bezierCurveTo(-12, -18, -22, -2, 0, 10);
  ctx.bezierCurveTo(22, -2, 12, -18, 0, -7);
  ctx.fill();
}

function drawCourageStar() {
  ctx.save();
  ctx.fillStyle = "rgba(255, 217, 74, 0.35)";
  star(0, 0, 30);
  const shine = ctx.createRadialGradient(-6, -7, 2, 0, 0, 23);
  shine.addColorStop(0, "#fff8b6");
  shine.addColorStop(0.5, "#ffd94a");
  shine.addColorStop(1, "#f0a83a");
  ctx.fillStyle = shine;
  star(0, 0, 22);
  ctx.strokeStyle = "rgba(139,91,43,0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#fff7a8";
  star(-4, -5, 9);
  ctx.fillStyle = "#8b5b2b";
  circle(-6, 2, 2);
  circle(6, 2, 2);
  ctx.strokeStyle = "#8b5b2b";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 6, 5, 0.15, Math.PI - 0.15);
  ctx.stroke();
  ctx.restore();
}

function drawMagicPencil() {
  ctx.save();
  ctx.rotate(-0.55);
  const body = ctx.createLinearGradient(-28, -8, 14, 8);
  body.addColorStop(0, "#dff6ff");
  body.addColorStop(0.45, "#8fd6ff");
  body.addColorStop(1, "#318fd1");
  ctx.fillStyle = body;
  roundRect(-28, -8, 42, 16, 6);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  roundRect(-22, -5, 22, 4, 3);
  ctx.fill();
  ctx.fillStyle = "#ffd75e";
  roundRect(-18, -8, 18, 16, 2);
  ctx.fill();
  ctx.fillStyle = "#f59a8b";
  ctx.beginPath();
  ctx.moveTo(14, -8);
  ctx.lineTo(31, 0);
  ctx.lineTo(14, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#244134";
  ctx.beginPath();
  ctx.moveTo(27, -2);
  ctx.lineTo(33, 0);
  ctx.lineTo(27, 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#ffd94a";
  star(-25, 10, 7);
}

function drawGuardBook() {
  ctx.save();
  const cover = ctx.createLinearGradient(-24, -20, 24, 20);
  cover.addColorStop(0, "#2f9dcc");
  cover.addColorStop(1, "#1f6ea5");
  ctx.fillStyle = cover;
  roundRect(-25, -20, 50, 40, 7);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  roundRect(-19, -14, 15, 28, 4);
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(12, -4);
  ctx.quadraticCurveTo(10, 10, 0, 16);
  ctx.quadraticCurveTo(-10, 10, -12, -4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-2, -18);
  ctx.lineTo(-2, 18);
  ctx.stroke();
  ctx.restore();
}

function drawLeafBroom() {
  ctx.fillStyle = "#8b5b2b";
  roundRect(-3, -24, 6, 42, 3);
  ctx.fill();
  const straw = ctx.createLinearGradient(-20, 2, 20, 25);
  straw.addColorStop(0, "#ffe08a");
  straw.addColorStop(0.55, "#f2c65f");
  straw.addColorStop(1, "#d99a35");
  ctx.fillStyle = straw;
  ctx.beginPath();
  ctx.moveTo(-20, 4);
  ctx.lineTo(20, 4);
  ctx.lineTo(9, 25);
  ctx.lineTo(-9, 25);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(139,91,43,0.42)";
  ctx.lineWidth = 2;
  for (const x of [-11, -4, 4, 11]) {
    ctx.beginPath();
    ctx.moveTo(x, 7);
    ctx.lineTo(x * 0.45, 23);
    ctx.stroke();
  }
}

function drawSeed() {
  ctx.fillStyle = "#fff7df";
  roundRect(-18, -17, 36, 34, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(139,91,43,0.25)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#8b5b2b";
  circle(-6, -2, 4);
  circle(7, 4, 4);
  ctx.fillStyle = "#78b84b";
  ctx.beginPath();
  ctx.ellipse(4, -9, 10, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(52,86,62,0.45)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-3, -6);
  ctx.quadraticCurveTo(3, -13, 13, -11);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  circle(-10, -10, 3);
}

function drawBell() {
  const bell = ctx.createLinearGradient(-18, -20, 18, 18);
  bell.addColorStop(0, "#fff09a");
  bell.addColorStop(0.55, "#ffd75e");
  bell.addColorStop(1, "#e9882d");
  ctx.fillStyle = bell;
  ctx.beginPath();
  ctx.moveTo(-18, 12);
  ctx.quadraticCurveTo(-14, -20, 0, -20);
  ctx.quadraticCurveTo(14, -20, 18, 12);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(139,91,43,0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  circle(-7, -8, 4);
  ctx.fillStyle = "#e9882d";
  circle(0, 16, 5);
  ctx.strokeStyle = "#8b5b2b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-7, -20);
  ctx.quadraticCurveTo(0, -31, 7, -20);
  ctx.stroke();
  ctx.strokeStyle = "rgba(139,91,43,0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-12, 7);
  ctx.quadraticCurveTo(0, 12, 12, 7);
  ctx.stroke();
}

function drawLantern() {
  const lantern = ctx.createLinearGradient(-17, -17, 17, 17);
  lantern.addColorStop(0, "#ff9a75");
  lantern.addColorStop(0.55, "#f46a5c");
  lantern.addColorStop(1, "#b83a34");
  ctx.fillStyle = lantern;
  roundRect(-17, -17, 34, 34, 10);
  ctx.fill();
  ctx.strokeStyle = "#8b5b2b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-12, -20);
  ctx.quadraticCurveTo(0, -31, 12, -20);
  ctx.stroke();
  ctx.fillStyle = "#ffd94a";
  roundRect(-9, -8, 18, 20, 7);
  ctx.fill();
  ctx.fillStyle = "rgba(255,247,176,0.55)";
  circle(0, 2, 13);
  ctx.strokeStyle = "rgba(255,247,223,0.55)";
  ctx.lineWidth = 1.5;
  for (const x of [-7, 0, 7]) {
    ctx.beginPath();
    ctx.moveTo(x, -13);
    ctx.lineTo(x * 0.5, 15);
    ctx.stroke();
  }
}

function drawMap() {
  ctx.fillStyle = "#fff7df";
  ctx.beginPath();
  ctx.moveTo(-24, -16);
  ctx.lineTo(-8, -21);
  ctx.lineTo(9, -15);
  ctx.lineTo(24, -20);
  ctx.lineTo(24, 16);
  ctx.lineTo(7, 21);
  ctx.lineTo(-9, 15);
  ctx.lineTo(-24, 20);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(139,91,43,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = "#83b83d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-14, 8);
  ctx.bezierCurveTo(-4, -8, 11, 11, 18, -8);
  ctx.stroke();
  ctx.fillStyle = "#e84b3f";
  circle(18, -8, 4);
}

function drawDeer() {
  drawShadow(0, 28, 30, 7);
  const fur = ctx.createRadialGradient(-9, -7, 3, 0, 6, 30);
  fur.addColorStop(0, "#f2c078");
  fur.addColorStop(0.68, "#d89a57");
  fur.addColorStop(1, "#a96d39");
  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.ellipse(0, 3, 25, 23, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  circle(-9, -4, 3);
  circle(9, -5, 3);
  circle(-1, 5, 2);
  ctx.fillStyle = "#f2c078";
  roundRect(-18, -30, 12, 22, 7);
  roundRect(6, -30, 12, 22, 7);
  ctx.fill();
  ctx.fillStyle = "#fff1ca";
  ctx.beginPath();
  ctx.ellipse(0, 11, 13, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8b5b2b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-14, -18);
  ctx.lineTo(-26, -36);
  ctx.moveTo(-25, -34);
  ctx.lineTo(-31, -41);
  ctx.moveTo(14, -18);
  ctx.lineTo(26, -36);
  ctx.moveTo(25, -34);
  ctx.lineTo(31, -41);
  ctx.stroke();
  drawFace(0, 1);
  ctx.fillStyle = "#55331f";
  circle(0, 9, 3);
  ctx.strokeStyle = "#5bc4e6";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-14, 18);
  ctx.quadraticCurveTo(0, 26, 14, 18);
  ctx.stroke();
}

function drawSquirrel() {
  drawShadow(4, 31, 30, 7);
  const sway = Math.sin(performance.now() / 260) * 1.5;
  const fur = ctx.createRadialGradient(-8, -7, 4, 10, 8, 42);
  fur.addColorStop(0, "#f0a15c");
  fur.addColorStop(0.62, "#c9793b");
  fur.addColorStop(1, "#8e4f29");
  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.ellipse(0, 6, 20, 24, 0, 0, Math.PI * 2);
  ctx.ellipse(29, 0, 17, 34, 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,224,154,0.62)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(29, 1, 17, -1.1, 1.1);
  ctx.stroke();
  ctx.strokeStyle = "rgba(95,48,24,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(28, 0, 25, -1.28, 1.18);
  ctx.stroke();
  ctx.fillStyle = "#f2c078";
  ctx.beginPath();
  ctx.ellipse(0, 12, 11, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c9793b";
  circle(-13, -12, 8);
  circle(12, -12, 8);
  ctx.fillStyle = "#2f8fc7";
  ctx.beginPath();
  ctx.ellipse(0, -22 + sway * 0.15, 18, 7, 0, Math.PI, 0);
  ctx.quadraticCurveTo(13, -27, 2, -31);
  ctx.quadraticCurveTo(-12, -29, -17, -22 + sway * 0.15);
  ctx.fill();
  ctx.fillStyle = "#ffd75e";
  roundRect(-4, -32, 8, 4, 2);
  ctx.fill();
  drawFace(0, -1);
  ctx.fillStyle = "#6b3b20";
  circle(0, 7, 3);
  ctx.strokeStyle = "#8b5b2b";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(12, 8);
  ctx.lineTo(32, 24 + sway);
  ctx.stroke();
  ctx.fillStyle = "#f2c65f";
  ctx.beginPath();
  ctx.moveTo(31, 18 + sway);
  ctx.lineTo(45, 27 + sway);
  ctx.lineTo(27, 31 + sway);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#8b5b2b";
  ctx.beginPath();
  ctx.ellipse(-14, 17, 7, 10, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f2c078";
  circle(-16, 14, 2);
}

function drawRabbit() {
  drawShadow(0, 31, 30, 7);
  const hop = Math.sin(performance.now() / 330) * 1.2;
  const fur = ctx.createRadialGradient(-8, -18, 5, 0, 10, 42);
  fur.addColorStop(0, "#fff7fb");
  fur.addColorStop(0.72, "#f4d9e9");
  fur.addColorStop(1, "#d9a9c4");
  ctx.fillStyle = fur;
  roundRect(-17, -42 - hop, 12, 42, 8);
  roundRect(6, -42 + hop, 12, 42, 8);
  ctx.fill();
  ctx.fillStyle = "#f8c0d9";
  roundRect(-13, -35 - hop, 5, 27, 4);
  roundRect(10, -35 + hop, 5, 27, 4);
  ctx.fill();
  ctx.fillStyle = "#f4d9e9";
  ctx.beginPath();
  ctx.ellipse(0, 8, 23, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f6a9c7";
  ctx.beginPath();
  ctx.moveTo(-18, 11);
  ctx.quadraticCurveTo(0, 27, 18, 11);
  ctx.lineTo(14, 31);
  ctx.lineTo(-14, 31);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#fff7df";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, 20);
  ctx.lineTo(10, 20);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.48)";
  circle(-8, -2, 5);
  drawFace(0, 8);
  ctx.fillStyle = "#fff7df";
  circle(0, 18, 5);
  ctx.fillStyle = "#5bc4e6";
  roundRect(-12, 27, 24, 7, 4);
  ctx.fill();
  ctx.fillStyle = "#8b5b2b";
  roundRect(15, 9, 10, 16, 4);
  ctx.fill();
  ctx.fillStyle = "#f6d77b";
  roundRect(17, 11, 7, 12, 3);
  ctx.fill();
}

function drawAnt() {
  drawShadow(1, 25, 29, 5);
  ctx.fillStyle = "#6b4a31";
  circle(-14, 4, 11);
  circle(2, 2, 13);
  circle(18, 2, 10);
  ctx.fillStyle = "#2b2018";
  circle(22, -1, 2);
  circle(14, -1, 2);
  ctx.strokeStyle = "#6b4a31";
  ctx.lineWidth = 3;
  for (const x of [-8, 5, 16]) {
    ctx.beginPath();
    ctx.moveTo(x, 10);
    ctx.lineTo(x - 10, 24);
    ctx.moveTo(x, 10);
    ctx.lineTo(x + 9, 24);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(22, -9);
  ctx.lineTo(30, -18);
  ctx.moveTo(17, -10);
  ctx.lineTo(18, -21);
  ctx.stroke();
}

function drawButterfly() {
  const flap = Math.sin(performance.now() / 180) * 0.18;
  drawShadow(0, 24, 22, 5);
  ctx.fillStyle = "#f59a8b";
  ctx.beginPath();
  ctx.ellipse(-14, -6, 15, 23, -0.6 - flap, 0, Math.PI * 2);
  ctx.ellipse(14, -6, 15, 23, 0.6 + flap, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd75e";
  circle(-12, -8, 5);
  circle(12, -8, 5);
  ctx.fillStyle = "#513b63";
  roundRect(-3, -20, 6, 40, 3);
  ctx.fill();
}

function drawFox() {
  drawShadow(0, 31, 34, 7);
  const tailWag = Math.sin(performance.now() / 260) * 0.12;
  const fur = ctx.createRadialGradient(-10, -16, 4, 0, 7, 38);
  fur.addColorStop(0, "#ff9a55");
  fur.addColorStop(0.62, "#d96f35");
  fur.addColorStop(1, "#9b4926");
  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.moveTo(-24, -12);
  ctx.lineTo(-8, -30);
  ctx.lineTo(0, -14);
  ctx.lineTo(10, -30);
  ctx.lineTo(26, -10);
  ctx.quadraticCurveTo(20, 20, 0, 24);
  ctx.quadraticCurveTo(-23, 17, -24, -12);
  ctx.fill();
  ctx.fillStyle = "#d96f35";
  ctx.beginPath();
  ctx.ellipse(31, 11, 13, 28, -0.45 + tailWag, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff1ca";
  ctx.beginPath();
  ctx.ellipse(36, 20, 8, 14, -0.45 + tailWag, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff1ca";
  ctx.beginPath();
  ctx.moveTo(-10, 2);
  ctx.lineTo(10, 2);
  ctx.lineTo(0, 18);
  ctx.closePath();
  ctx.fill();
  drawFace(0, 0);
  ctx.fillStyle = "#4c2a1d";
  circle(0, 6, 3);
  ctx.fillStyle = "#2f9dcc";
  roundRect(-12, 22, 24, 8, 4);
  ctx.fill();
  ctx.save();
  ctx.rotate(-0.16);
  ctx.fillStyle = "#fff7df";
  roundRect(-24, 8, 17, 20, 3);
  ctx.fill();
  ctx.strokeStyle = "#2f9dcc";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawFlowerPatch() {
  drawGroundFlowerBed(0, 4, 0.42);
}

function drawFirefly() {
  drawShadow(0, 27, 20, 5);
  ctx.fillStyle = "rgba(210,246,255,0.48)";
  ctx.beginPath();
  ctx.ellipse(-9, -8, 10, 17, -0.45, 0, Math.PI * 2);
  ctx.ellipse(9, -8, 10, 17, 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6b4a31";
  ctx.beginPath();
  ctx.ellipse(0, -5, 10, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 217, 74, 0.55)";
  circle(0, 13, 18 + Math.sin(performance.now() / 180) * 3);
  ctx.fillStyle = "#ffd94a";
  circle(0, 13, 10);
  ctx.strokeStyle = "#6b4a31";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-5, -17);
  ctx.lineTo(-13, -27);
  ctx.moveTo(5, -17);
  ctx.lineTo(13, -27);
  ctx.stroke();
}

function drawHedgehog() {
  drawShadow(0, 30, 30, 7);
  const blink = Math.sin(performance.now() / 700) > 0.92;
  const spikes = ctx.createRadialGradient(-8, -8, 4, 0, 8, 34);
  spikes.addColorStop(0, "#b08a62");
  spikes.addColorStop(0.58, "#8b6a4a");
  spikes.addColorStop(1, "#5b422f");
  ctx.fillStyle = spikes;
  ctx.beginPath();
  for (let i = 0; i < 14; i += 1) {
    const angle = Math.PI + (i / 13) * Math.PI;
    const r = i % 2 ? 27 : 20;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r + 8;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.quadraticCurveTo(22, 25, 0, 27);
  ctx.quadraticCurveTo(-24, 24, -26, 8);
  ctx.fill();
  ctx.fillStyle = "#f0c38a";
  ctx.beginPath();
  ctx.ellipse(4, 8, 18, 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  circle(-3, 0, 4);
  if (blink) {
    ctx.strokeStyle = "#263b32";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, 4);
    ctx.lineTo(1, 4);
    ctx.moveTo(11, 4);
    ctx.lineTo(17, 4);
    ctx.stroke();
  } else {
    drawFace(4, 4);
    ctx.strokeStyle = "#263b32";
    ctx.lineWidth = 1.6;
    circleStroke(-4, 4, 6);
    circleStroke(12, 4, 6);
    ctx.beginPath();
    ctx.moveTo(2, 4);
    ctx.lineTo(6, 4);
    ctx.stroke();
  }
  ctx.fillStyle = "#4c2a1d";
  circle(14, 10, 3);
  ctx.fillStyle = "#6fb447";
  roundRect(-12, 20, 20, 6, 3);
  ctx.fill();
  ctx.fillStyle = "#f6d77b";
  roundRect(15, 12, 14, 18, 3);
  ctx.fill();
  ctx.strokeStyle = "#8b5b2b";
  ctx.lineWidth = 1.4;
  ctx.stroke();
}

function drawTreasureChest() {
  drawShadow(0, 31, 40, 8);
  ctx.fillStyle = "#8b5b2b";
  roundRect(-34, -8, 68, 36, 8);
  ctx.fill();
  ctx.fillStyle = "#c78645";
  roundRect(-34, -26, 68, 24, 10);
  ctx.fill();
  ctx.strokeStyle = "#ffd75e";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(0, 27);
  ctx.moveTo(-32, -4);
  ctx.lineTo(32, -4);
  ctx.stroke();
  ctx.fillStyle = "#ffd75e";
  roundRect(-8, 4, 16, 13, 4);
  ctx.fill();
}

function drawForestBoss() {
  const pulse = 1 + Math.sin(performance.now() / 260) * 0.03;
  ctx.save();
  ctx.scale(pulse, pulse);
  if (drawArtPackImage("boss", "blackBear", -64, -66, 128, 148)) {
    ctx.restore();
    return;
  }
  if (drawCharacterAsset("blackBear", 128, 148, -66)) {
    ctx.restore();
    return;
  }
  drawShadow(0, 82, 82, 17);
  const body = ctx.createRadialGradient(-18, -38, 8, 0, 8, 88);
  body.addColorStop(0, "#4b4039");
  body.addColorStop(0.55, "#26211f");
  body.addColorStop(1, "#100f0e");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 20, 52, 66, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#211c1a";
  circle(-30, -43, 18);
  circle(30, -43, 18);
  const head = ctx.createRadialGradient(-12, -50, 5, 0, -32, 54);
  head.addColorStop(0, "#4f453e");
  head.addColorStop(0.7, "#24201e");
  head.addColorStop(1, "#11100f");
  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.ellipse(0, -24, 46, 43, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  ctx.beginPath();
  ctx.ellipse(0, -12, 22, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd94a";
  circle(-15, -31, 5);
  circle(15, -31, 5);
  ctx.fillStyle = "#2b2018";
  circle(-14, -31, 2);
  circle(16, -31, 2);
  ctx.fillStyle = "#1b1513";
  circle(0, -14, 6);
  ctx.strokeStyle = "#7b4a29";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-42, 8);
  ctx.lineTo(-72, 38);
  ctx.moveTo(42, 8);
  ctx.lineTo(72, 38);
  ctx.stroke();
  ctx.fillStyle = "#fff7df";
  for (const x of [-79, -70, 70, 79]) {
    ctx.beginPath();
    ctx.moveTo(x, 42);
    ctx.lineTo(x + (x < 0 ? 4 : -4), 54);
    ctx.lineTo(x + (x < 0 ? 9 : -9), 43);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = "#1b1513";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -6, 12, 0.15, Math.PI - 0.15);
  ctx.stroke();
  ctx.restore();
}

function drawSign() {
  ctx.fillStyle = "#8b5b2b";
  roundRect(-4, -2, 8, 40, 4);
  ctx.fill();
  ctx.fillStyle = "#f6d77b";
  roundRect(-38, -34, 76, 32, 8);
  ctx.fill();
  ctx.fillStyle = "#34563e";
  ctx.font = "900 14px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  ctx.fillText("\u5b66\u6821", 0, -13);
}

function drawTreeLight() {
  ctx.fillStyle = "#8b5b2b";
  roundRect(-9, -4, 18, 44, 8);
  ctx.fill();
  ctx.fillStyle = "#69b94b";
  circle(0, -20, 30);
  ctx.fillStyle = "rgba(255, 217, 74, 0.65)";
  circle(0, -20, 13 + Math.sin(performance.now() / 160) * 3);
}

function drawSpringMushroom() {
  const bounce = Math.sin(performance.now() / 170) * 2;
  ctx.save();
  ctx.translate(0, bounce);
  drawShadow(0, 31, 34, 7);
  ctx.fillStyle = "#fff1ca";
  roundRect(-12, 0, 24, 30, 9);
  ctx.fill();
  const cap = ctx.createLinearGradient(0, -32, 0, 4);
  cap.addColorStop(0, "#ff8d68");
  cap.addColorStop(1, "#d94b3b");
  ctx.fillStyle = cap;
  ctx.beginPath();
  ctx.ellipse(0, -4, 34, 22, 0, Math.PI, 0);
  ctx.quadraticCurveTo(20, 10, 0, 11);
  ctx.quadraticCurveTo(-20, 10, -34, -4);
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  circle(-15, -9, 5);
  circle(3, -16, 6);
  circle(18, -3, 4);
  ctx.fillStyle = "#f2ad31";
  star(0, -39, 8);
  ctx.restore();
}

function drawFinishFlag() {
  drawShadow(0, 31, 33, 7);
  ctx.fillStyle = "#8b5b2b";
  roundRect(-4, -44, 8, 74, 4);
  ctx.fill();
  const flag = ctx.createLinearGradient(2, -42, 42, -10);
  flag.addColorStop(0, "#ffd94a");
  flag.addColorStop(1, "#f46a5c");
  ctx.fillStyle = flag;
  ctx.beginPath();
  ctx.moveTo(4, -42);
  ctx.lineTo(46, -32);
  ctx.lineTo(4, -18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  star(20, -31, 6);
  ctx.fillStyle = "#6fb447";
  ctx.beginPath();
  ctx.ellipse(-11, 25, 18, 6, -0.2, 0, Math.PI * 2);
  ctx.ellipse(13, 25, 18, 6, 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawQuizStand(color, label) {
  drawShadow(0, 31, 34, 7);
  ctx.fillStyle = "#8b5b2b";
  roundRect(-4, -2, 8, 36, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(91, 58, 36, 0.24)";
  ctx.beginPath();
  ctx.ellipse(0, 32, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  roundRect(-28, -34, 56, 32, 7);
  ctx.fill();
  ctx.strokeStyle = "rgba(91, 58, 36, 0.52)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#244134";
  ctx.font = "900 12px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  fitText(label, 0, -14, 46);
  ctx.fillStyle = "#ffd94a";
  star(22, -30, 5);
}

function drawFace(dx = 0, dy = 0) {
  ctx.fillStyle = "#263b32";
  circle(dx - 8, dy, 3);
  circle(dx + 8, dy, 3);
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  circle(dx - 9, dy - 1, 1);
  circle(dx + 7, dy - 1, 1);
  ctx.fillStyle = "rgba(245,128,137,0.32)";
  circle(dx - 15, dy + 6, 4);
  circle(dx + 15, dy + 6, 4);
  ctx.strokeStyle = "#263b32";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(dx, dy + 6, 5, 0.15, Math.PI - 0.15);
  ctx.stroke();
}

function drawShadow(x, y, w, h) {
  ctx.fillStyle = "rgba(39, 65, 52, 0.18)";
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastFrame) / 1000);
  lastFrame = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function makeLeaves(levelIndex) {
  const count = 13 + levelIndex * 5;
  const colors = ["#83b83d", "#f6c95f", "#f59a8b", "#6fb447"];
  return Array.from({ length: count }, (_, i) => ({
    x: (i * 73 + 40) % canvas.width,
    y: (i * 97 + 20) % canvas.height,
    speed: 10 + ((i * 11) % 20),
    size: 4 + (i % 4),
    spin: 0.4 + (i % 5) * 0.2,
    phase: i * 0.8,
    rot: i,
    color: colors[i % colors.length],
  }));
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 40 + ((i * 17) % 70);
    const life = 0.45 + (i % 5) * 0.08;
    state.sparkles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 20,
      color,
      size: 5 + (i % 4),
      rot: i,
      life,
      maxLife: life,
    });
  }
}

function addFloatingText(x, y, label, color) {
  state.floaters.push({ x, y, label, color, life: 1.05 });
}

function itemColor(type) {
  return {
    apple: "#e84b3f",
    book: "#2f9dcc",
    pencil: "#ffd75e",
    leaf: "#f2c65f",
    seed: "#78b84b",
    bell: "#ffd75e",
    lantern: "#f46a5c",
    map: "#83b83d",
    courageStar: "#ffd94a",
    magicPencil: "#8fd6ff",
    guardBook: "#2f9dcc",
    potion: "#ff8fb0",
  }[type] || "#ffd94a";
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function circleStroke(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function fitText(label, x, y, maxWidth) {
  if (ctx.measureText(label).width <= maxWidth) {
    ctx.fillText(label, x, y);
    return;
  }
  let text = label;
  while (text.length > 2 && ctx.measureText(`${text}\u2026`).width > maxWidth) {
    text = text.slice(0, -1);
  }
  ctx.fillText(`${text}\u2026`, x, y);
}

function star(x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 ? r * 0.44 : r;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function roundRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

const keyMap = {
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
};

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state?.activeDialogue) {
    closeDialogue();
    event.preventDefault();
    return;
  }
  if ((event.key === "Enter" || event.key === "e" || event.key === "E") && state?.activeDialogue) {
    nextDialogueLine();
    event.preventDefault();
    return;
  }
  if (event.key === "e" || event.key === "E") {
    talkToNearbyTask();
    event.preventDefault();
    return;
  }
  if (event.code === "Space") {
    shootBossWeapon();
    event.preventDefault();
    return;
  }
  const dir = keyMap[event.key];
  if (!dir) return;
  keys.add(dir);
  event.preventDefault();
});

window.addEventListener("keyup", (event) => {
  const dir = keyMap[event.key];
  if (!dir) return;
  keys.delete(dir);
});

enterBtn.addEventListener("click", enterGame);
soundBtn.addEventListener("click", toggleSound);
attackBtn.addEventListener("click", shootBossWeapon);
dialogueBtn?.addEventListener("click", talkToNearbyTask);
dialogueCloseBtn?.addEventListener("click", closeDialogue);
dialogueNextBtn?.addEventListener("click", nextDialogueLine);
dialogueGiveBtn?.addEventListener("click", finishDialogueDelivery);
dialogueQuizBtn?.addEventListener("click", startDialogueQuiz);

document.querySelectorAll("[data-dir]").forEach((button) => {
  const dir = button.dataset.dir;
  button.addEventListener("pointerdown", (event) => {
    touchDirs.add(dir);
    button.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });
  button.addEventListener("pointerup", (event) => {
    touchDirs.delete(dir);
    event.preventDefault();
  });
  button.addEventListener("pointercancel", () => touchDirs.delete(dir));
  button.addEventListener("lostpointercapture", () => touchDirs.delete(dir));
});

window.addEventListener("blur", () => {
  touchDirs.clear();
});

function syncRoleButtons() {
  roleButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.role === selectedRole);
  });
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRole = button.dataset.role || "cat";
    localStorage.setItem("catsOwlRole", selectedRole);
    syncRoleButtons();
  });
});

startBtn.addEventListener("click", startGame);

function initialLevelFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const level = params.get("level");
  if (level === "last" || level === "boss") return levels.length - 1;
  const number = Number(level);
  if (Number.isInteger(number)) return clamp(number - 1, 0, levels.length - 1);
  return 0;
}

const initialLevel = initialLevelFromUrl();
preloadPlayerAssets();
syncRoleButtons();
if (initialLevel > 0 || new URLSearchParams(window.location.search).get("play") === "1") {
  gameEntered = true;
}
resetGame(initialLevel);
if (initialLevel > 0) {
  homeScreen.classList.add("is-hidden");
  messageEl.textContent = levels[initialLevel].message;
  preloadNearbyBackgrounds(initialLevel);
}
if (new URLSearchParams(window.location.search).get("play") === "1") {
  homeScreen.classList.add("is-hidden");
  state.running = true;
  startBtn.textContent = text.restart;
  preloadNearbyBackgrounds(initialLevel);
}
requestAnimationFrame(loop);
