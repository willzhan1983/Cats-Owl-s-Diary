const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const homeScreen = document.getElementById("homeScreen");
const enterBtn = document.getElementById("enterBtn");
const roleButtons = document.querySelectorAll("[data-role]");
const difficultyButtons = document.querySelectorAll("[data-difficulty]");
const nicknameInput = document.getElementById("nicknameInput");
const startBtn = document.getElementById("startBtn");
const messageEl = document.getElementById("message");
const levelEl = document.getElementById("level");
const heartsEl = document.getElementById("hearts");
const timeEl = document.getElementById("time");
const difficultyEl = document.getElementById("difficulty");
const pointsEl = document.getElementById("points");
const tasksEl = document.getElementById("tasks");
const bagEl = document.getElementById("bag");
const recordsBtn = document.getElementById("recordsBtn");
const homeRecordsBtn = document.getElementById("homeRecordsBtn");
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
const storybookPanel = document.getElementById("storybookPanel");
const storybookImage = document.getElementById("storybookImage");
const storybookTitle = document.getElementById("storybookTitle");
const storybookCaption = document.getElementById("storybookCaption");
const storybookCloseBtn = document.getElementById("storybookCloseBtn");
const storybookStartBtn = document.getElementById("storybookStartBtn");
const scoreSummaryPanel = document.getElementById("scoreSummaryPanel");
const scoreSummaryTitle = document.getElementById("scoreSummaryTitle");
const scoreSummarySubtitle = document.getElementById("scoreSummarySubtitle");
const scoreSummaryStorybookImage = document.getElementById("scoreSummaryStorybookImage");
const scoreSummaryStats = document.getElementById("scoreSummaryStats");
const scoreSummaryCloseBtn = document.getElementById("scoreSummaryCloseBtn");
const scoreContinueBtn = document.getElementById("scoreContinueBtn");
const scoreRetryBtn = document.getElementById("scoreRetryBtn");
const scoreRecordsBtn = document.getElementById("scoreRecordsBtn");
const runHistoryPanel = document.getElementById("runHistoryPanel");
const runHistorySummary = document.getElementById("runHistorySummary");
const runHistoryList = document.getElementById("runHistoryList");
const runHistoryCloseBtn = document.getElementById("runHistoryCloseBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const APPLE_VALLEY_COLLECTIBLE_BOB = 1.5;
const MIST_CLEAR_TIME_BY_DIFFICULTY = { easy: null, normal: 12000, hard: 8000, crazy: 6000 };
const MUD_BUBBLE_COUNT_BY_DIFFICULTY = { easy: 2, normal: 3, hard: 4, crazy: 4 };
const BRIDGE_PLANK_COUNT_BY_DIFFICULTY = { easy: 2, normal: 2, hard: 3, crazy: 3 };
const MUSHROOM_SEQUENCE_LENGTH_BY_DIFFICULTY = { easy: 2, normal: 3, hard: 4, crazy: 4 };
const MUD_BUBBLE_WAVE_SIZE_BY_DIFFICULTY = { easy: 1, normal: 1, hard: 2, crazy: 2 };
const MIST_LANTERN_CHARGE_TIME_BY_DIFFICULTY = { easy: 1.2, normal: 2, hard: 2.5, crazy: 3 };
const SLEEPING_BRIDGE_REPAIR_ANCHOR = Object.freeze({ x: 570, y: 300 });
const SLEEPING_BRIDGE_LAMP_SLOTS = Object.freeze([
  Object.freeze({ x: 120, y: 115 }),
  Object.freeze({ x: 280, y: 105 }),
  Object.freeze({ x: 440, y: 115 }),
  Object.freeze({ x: 600, y: 100 }),
  Object.freeze({ x: 760, y: 95 }),
  Object.freeze({ x: 900, y: 110 }),
]);

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

const storybookPages = Array.from({ length: 10 }, (_, index) => {
  const page = String(index + 1).padStart(2, "0");
  return `./assets/storybook/storybook-page-${page}.png`;
});
const STORYBOOK_FALLBACK_PAGE = "./assets/storybook/fallback.png";
const storybookIntroPages = storybookPages.slice(1, -1);
const storybookVictoryPages = [storybookPages[0], storybookPages[storybookPages.length - 1]];

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
  moonlightShore: "./assets/bg/moonlight_shore.png",
  moonlitIsle: "./assets/bg/moonlit_isle.png",
  underwaterGarden: "./assets/bg/underwater_garden.png",
  deepSeaRuins: "./assets/bg/deep_sea_ruins.png",
  nessieLair: "./assets/bg/nessie_lair.png",
  appleValleyEntrance: "./assets/bg/apple_valley_entrance.png",
  harvestOrchard: "./assets/bg/harvest_orchard.png",
  basketSortingStation: "./assets/bg/basket_sorting_station.png",
  forestSchoolDelivery: "./assets/bg/forest_school_apple_delivery.png",
  forestRoadEntrance: "./assets/bg/forest_road_entrance.png",
  windingForestCrossroad: "./assets/bg/winding_forest_crossroad.png",
  escortForestPath: "./assets/bg/escort_forest_path.png",
  acornTownCrossroad: "./assets/bg/acorn_town_crossroad.png",
  mistSwampEntrance: "./assets/bg/mist_swamp_entrance.png",
  fireflyTrailPath: "./assets/bg/firefly_trail_path.png",
  sleepingWoodenBridge: "./assets/bg/sleeping_wooden_bridge.png",
  mistCoreClearing: "./assets/bg/mist_core_clearing.png",
  mudMonsterLair: "./assets/bg/mud_monster_lair.png",
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
  moonlightShore: ["./assets/bg/moonlight_shore.png", "./assets/v2/v2-bg-pond.png", "./assets/bg-level5-courage.jpg"],
  moonlitIsle: ["./assets/bg/moonlit_isle.png", "./assets/v2/v2-bg-wetland.png", "./assets/v2/v2-bg-pond.png"],
  underwaterGarden: ["./assets/bg/underwater_garden.png", "./assets/v2/v2-bg-pond.png", "./assets/v2/v2-bg-wetland.png"],
  deepSeaRuins: ["./assets/bg/deep_sea_ruins.png", "./assets/v2/v2-bg-swamp-boss.png", "./assets/v2/v2-bg-wetland.png"],
  nessieLair: ["./assets/bg/nessie_lair.png", "./assets/v2/v2-bg-swamp-boss.png", "./assets/bg-level6-boss.jpg"],
  appleValleyEntrance: ["./assets/bg/apple_valley_entrance.png", "./assets/bg-level2-forest.png", "./assets/v2/v2-forest-school-background.png"],
  harvestOrchard: ["./assets/bg/harvest_orchard.png", "./assets/bg-level2-forest.png", "./assets/v2/v2-forest-school-background.png"],
  basketSortingStation: ["./assets/bg/basket_sorting_station.png", "./assets/bg-level1-schoolyard.png", "./assets/bg-level2-forest.png"],
  forestSchoolDelivery: ["./assets/bg/forest_school_apple_delivery.png", "./assets/bg-level1-schoolyard.png", "./assets/v2/v2-forest-school-background.png"],
  forestRoadEntrance: ["./assets/bg/forest_road_entrance.png", "./assets/v2/v2-bg-city-road.png"],
  windingForestCrossroad: ["./assets/bg/winding_forest_crossroad.png", "./assets/v2/v2-bg-city-road.png"],
  escortForestPath: ["./assets/bg/escort_forest_path.png", "./assets/v2/v2-bg-city-road.png"],
  acornTownCrossroad: ["./assets/bg/acorn_town_crossroad.png", "./assets/v2/v2-bg-city-road.png"],
  mistSwampEntrance: ["./assets/bg/mist_swamp_entrance.png", "./assets/v2/v2-bg-swamp-boss.png", "./assets/v2/v2-bg-wetland.png"],
  fireflyTrailPath: ["./assets/bg/firefly_trail_path.png", "./assets/v2/v2-bg-wetland.png", "./assets/v2/v2-bg-pond.png"],
  sleepingWoodenBridge: ["./assets/bg/sleeping_wooden_bridge.png", "./assets/v2/v2-bg-pond.png", "./assets/v2/v2-bg-wetland.png"],
  mistCoreClearing: ["./assets/bg/mist_core_clearing.png", "./assets/v2/v2-bg-swamp-boss.png", "./assets/v2/v2-bg-wetland.png"],
  mudMonsterLair: ["./assets/bg/mud_monster_lair.png", "./assets/v2/v2-bg-swamp-boss.png", "./assets/bg-level6-boss.jpg"],
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

const MIST_SWAMP_NPC_RENDERERS = {
  fireflyGuide: typeof drawFirefly === "function" ? drawFirefly : () => drawMistSwampNpcFallback("萤火虫"),
  littleFrog: typeof drawFrog === "function" ? drawFrog : () => drawMistSwampNpcFallback("小青蛙"),
  swampSnail: typeof drawHedgehog === "function" ? drawHedgehog : () => drawMistSwampNpcFallback("沼泽蜗牛"),
  mistSpirit: typeof drawFirefly === "function" ? drawFirefly : () => drawMistSwampNpcFallback("迷雾精灵"),
  ruru: typeof drawSquirrel === "function" ? drawSquirrel : () => drawMistSwampNpcFallback("Ruru"),
  mudMonster: typeof drawMudMonster === "function" ? drawMudMonster : () => drawMistSwampNpcFallback("泥浆怪"),
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
  otter: { id: "otter", displayName: "水獭邮差", renderer: drawOtter, world: "moonlight_lake" },
  frog: { id: "frog", displayName: "青蛙老师", renderer: drawFrog, world: "moonlight_lake" },
  seagull: { id: "seagull", displayName: "海鸥侦察员", renderer: drawSeagull, world: "moonlight_lake" },
  coco: { id: "coco", displayName: "Coco 小松鼠", renderer: drawSquirrel, world: "apple_valley" },
  nono: { id: "nono", displayName: "Nono 小刺猬", renderer: drawHedgehog, world: "apple_valley" },
  birdPostman: { id: "birdPostman", displayName: "小鸟邮差", renderer: drawSeagull, world: "apple_valley" },
  moleFarmer: { id: "moleFarmer", displayName: "果园鼹鼠", renderer: drawHedgehog, world: "apple_valley" },
  owlPrincipal: { id: "owlPrincipal", displayName: "猫头鹰校长", renderer: () => drawOwl(0, 4, 0.92), world: "apple_valley" },
  beaver: { id: "beaver", displayName: "小海狸工程师", renderer: drawBeaver, world: "moonlight_lake" },
  clownfish: { id: "clownfish", displayName: "小丑鱼兄妹", renderer: drawClownfish, world: "moonlight_lake" },
  seaTurtle: { id: "seaTurtle", displayName: "小海龟", renderer: drawSeaTurtle, world: "moonlight_lake" },
  jellyfish: { id: "jellyfish", displayName: "发光水母", renderer: drawJellyfish, world: "moonlight_lake" },
  octopus: { id: "octopus", displayName: "章鱼博士", renderer: drawOctopus, world: "moonlight_lake" },
  seahorseGuard: { id: "seahorseGuard", displayName: "海马守卫", renderer: drawSeahorseGuard, world: "moonlight_lake" },
  lanternFish: { id: "lanternFish", displayName: "灯笼鱼", renderer: drawLanternFish, world: "moonlight_lake" },
  nessie: { id: "nessie", displayName: "尼斯湖怪", renderer: drawNessie, world: "moonlight_lake" },
  owl: { id: "owl", displayName: "Owlly / \u59da\u5934\u9e70", renderer: () => drawOwl(0, 4, 0.92), world: "forest_school" },
  boss: { id: "boss", displayName: "Black Bear", renderer: drawForestBoss, characterId: "blackBear", world: "dark_swamp" },
  fireflyGuide: { id: "fireflyGuide", displayName: "萤火虫向导", renderer: MIST_SWAMP_NPC_RENDERERS.fireflyGuide, world: "mist_swamp" },
  littleFrog: { id: "littleFrog", displayName: "小青蛙", renderer: MIST_SWAMP_NPC_RENDERERS.littleFrog, world: "mist_swamp" },
  swampSnail: { id: "swampSnail", displayName: "沼泽蜗牛", renderer: MIST_SWAMP_NPC_RENDERERS.swampSnail, world: "mist_swamp" },
  mistSpirit: { id: "mistSpirit", displayName: "迷雾精灵", renderer: MIST_SWAMP_NPC_RENDERERS.mistSpirit, world: "mist_swamp" },
  ruru: { id: "ruru", displayName: "Ruru 小浣熊", renderer: MIST_SWAMP_NPC_RENDERERS.ruru, world: "mist_swamp" },
  mudMonster: { id: "mudMonster", displayName: "沼泽泥浆怪", renderer: MIST_SWAMP_NPC_RENDERERS.mudMonster, world: "mist_swamp" },
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
  moonlight_lake: {
    id: "moonlight_lake",
    name: "月光湖",
    background: "moonlightShore",
    levels: [7, 8, 9, 10, 11],
    taskTypes: [TASK_TYPES.FETCH_ITEM, TASK_TYPES.HELP_NPC, TASK_TYPES.SIMPLE_PUZZLE, TASK_TYPES.BOSS_FIGHT],
    boss: "nessie",
  },
  apple_valley: {
    id: "apple_valley",
    name: "苹果谷",
    background: "appleValleyEntrance",
    levels: [12, 13, 14, 15],
    taskTypes: [TASK_TYPES.FETCH_ITEM, TASK_TYPES.HELP_NPC, TASK_TYPES.SIMPLE_PUZZLE],
  },
  forest_road: {
    id: "forest_road",
    name: "森林公路",
    background: "forestRoadEntrance",
    levels: [16, 17, 18, 19],
    taskTypes: [TASK_TYPES.FETCH_ITEM, TASK_TYPES.HELP_NPC, TASK_TYPES.SIMPLE_PUZZLE],
  },
  mist_swamp: {
    id: "mist_swamp",
    name: "迷雾沼泽",
    background: "mistSwampEntrance",
    levels: [],
    taskTypes: [TASK_TYPES.FETCH_ITEM, TASK_TYPES.HELP_NPC, TASK_TYPES.SIMPLE_PUZZLE, TASK_TYPES.BOSS_FIGHT],
    boss: "mudMonster",
  },
};

const dayNames = [
  "\u7b2c\u4e00\u5929",
  "\u7b2c\u4e8c\u5929",
  "\u7b2c\u4e09\u5929",
  "\u7b2c\u56db\u5929",
  "\u7b2c\u4e94\u5929",
  "\u7b2c\u516d\u5929",
  "\u7b2c\u4e03\u5929",
  "月光湖岸",
  "湖心浮岛",
  "水底花园",
  "深海遗迹",
  "尼斯湖怪巢穴",
  "苹果谷入口",
  "丰收果园",
  "果篮整理站",
  "送给猫头鹰校长",
  "森林公路入口",
  "弯弯森林小路",
  "护送小动物过路",
  "橡果镇路口",
  "迷雾沼泽入口",
  "萤火虫小径",
  "沉睡木桥",
  "迷雾核心",
  "沼泽泥浆怪",
];

const keys = new Set();
const touchDirs = new Set();
let lastFrame = performance.now();
let state;
let gameEntered = false;
let storybookIntroSeen = false;
let selectedRole = localStorage.getItem("catsOwlRole") || "cat";

const DIFFICULTY_STORAGE_KEY = "catsOwlDifficulty";
const DIFFICULTY_SETTINGS = {
  easy: { label: "简单", icon: "🌱", timeScale: 1.35, obstaclePenalty: 0, quizPenalty: 0, stopOnTimeout: false },
  normal: { label: "普通", icon: "🌼", timeScale: 1, obstaclePenalty: 2, quizPenalty: 3, stopOnTimeout: false },
  hard: { label: "困难", icon: "🔥", timeScale: 0.82, obstaclePenalty: 4, quizPenalty: 6, stopOnTimeout: false },
  crazy: { label: "疯狂", icon: "👑", timeScale: 0.65, obstaclePenalty: 6, quizPenalty: 10, stopOnTimeout: true },
};
const TIME_BONUS_BY_DIFFICULTY = {
  easy: 10,
  normal: 20,
  hard: 30,
  crazy: 50,
};
let selectedDifficulty = DIFFICULTY_SETTINGS[localStorage.getItem(DIFFICULTY_STORAGE_KEY)]
  ? localStorage.getItem(DIFFICULTY_STORAGE_KEY)
  : "normal";

const PLAYER_PROFILE_KEY = "catsOwlPlayerProfile";
const TOTAL_POINTS_KEY = "catsOwlTotalPoints";
const BEST_SCORE_KEY = "catsOwlBestScore";
const RUN_HISTORY_KEY = "catsOwlRunHistory";
const DEFAULT_NICKNAMES = ["小猫勇士", "月光探险家", "森林小帮手", "星星队长", "猫头鹰同学", "彩虹日记员"];
let playerProfile = loadPlayerProfile();
let totalPoints = readStoredNumber(TOTAL_POINTS_KEY);
let bestScore = readStoredNumber(BEST_SCORE_KEY);

const music = {
  ctx: null,
  master: null,
  audio: null,
  audioSrc: "",
  audioFailed: new Set(),
  timer: null,
  enabled: true,
  key: "",
  pattern: "",
  step: 0,
};

const MUSIC_BY_WORLD = {
  forest_school: "assets/audio/bgm_forest_school.mp3",
  moonlight_lake: "assets/audio/bgm_moonlight_lake.mp3",
  apple_valley: "assets/audio/bgm_apple_valley.mp3",
  forest_road: "assets/audio/bgm_forest_road.mp3",
  dark_swamp: "assets/audio/bgm_dark_swamp.mp3",
  boss: "assets/audio/bgm_boss.mp3",
};

const MUSIC_PATTERN_BY_WORLD = {
  forest_school: "happy",
  moonlight_lake: "moonlight",
  apple_valley: "harvest",
  forest_road: "road",
  dark_swamp: "danger",
  boss: "boss",
};

const MUSIC_WORLD_ALIASES = {
  mist_swamp: "dark_swamp",
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
    propDecorations: [],
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
      { type: "bush", x: 300, y: 408, r: 34 },
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
      actionTask(500, 320, "\u6d47\u82b1", "flower", "\u6309\u4e00\u4e0b\u7ad9\u4f4f\u5c31\u80fd\u6d47\u82b1"),
    ],
    puddles: [
      { x: 245, y: 335, r: 32 },
      { x: 628, y: 338, r: 34 },
      { x: 762, y: 372, r: 28 },
    ],
    obstacles: [
      { type: "bush", x: 558, y: 414, r: 38 },
      { type: "pit", x: 742, y: 412, r: 27 },
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
      item(285, 132, "lantern", "\u5c0f\u706f\u7b3c"),
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
      actionTask(720, 136, "\u70b9\u4eae\u6811\u706f", "light", "\u70b9\u4eae\u6811\u4e0a\u7684\u5c0f\u706f"),
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
    dialogueDisabled: true,
    time: 95,
    start: { x: 480, y: 430 },
    message: "\u7b2c\u56db\u5929\uff1a\u56de\u5230\u68ee\u6797\u6559\u5ba4\uff0c\u5b8c\u6210\u6570\u5b66\u3001\u79d1\u5b66\u3001\u8bed\u6587\u548c\u82f1\u6587\u5c0f\u6311\u6218\u3002",
    collectibles: [],
    tasks: [
      quizTask(138, 326, "\u6570\u5b66\u6811\u6869", "math", "\u7b97\u9898", "math"),
      quizTask(322, 138, "\u903b\u8f91\u661f\u661f\u724c", "logic", "\u627e\u89c4\u5f8b", "logic"),
      quizTask(500, 132, "\u79d1\u5b66\u82b1\u575b", "science", "\u770b\u4e00\u770b", "science"),
      quizTask(742, 160, "\u8bed\u6587\u6728\u724c", "language", "\u8ba4\u5b57", "language"),
      quizTask(812, 354, "\u82f1\u8bed\u62fc\u56fe\u684c", "english", "ABC", "english"),
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
      { type: "bush", x: 292, y: 404, r: 35 },
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
      actionTask(812, 238, "\u7ec8\u70b9\u65d7", "finish", "\u5230\u8fbe\u7ec8\u70b9\uff0c\u51c6\u5907\u9762\u5bf9\u9ed1\u718a\u602a"),
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
  {
    name: "月光湖岸",
    bg: "moonlightShore",
    world: "moonlight_lake",
    time: 92,
    start: { x: 116, y: 430 },
    message: "月光湖岸出现了奇怪的光，帮水獭邮差点亮湖边道路吧！",
    collectibles: [
      item(186, 360, "moonLamp", "月光灯"),
      item(332, 202, "boatPaddle", "小船桨"),
      item(560, 388, "shellBadge", "贝壳徽章"),
      item(734, 244, "bubbleStone", "发光水泡石"),
      item(830, 410, "potion", "\u7231\u5fc3\u836f\u6c34"),
    ],
    propDecorations: [
      propDecoration(468, 120, "moonLamp", 44, 58, "月光灯"),
      propDecoration(704, 334, "spiralShell", 42, 36, "螺旋贝壳"),
    ],
    tasks: [
      delivery(230, 302, "水獭邮差", "otter", "moonLamp", "请把月光灯放到湖岸石头旁。"),
      delivery(616, 226, "青蛙老师", "frog", ["boatPaddle", "shellBadge"], "请帮小船准备好船桨和贝壳徽章。"),
      quizTask(506, 338, "青蛙老师", "frog", "青蛙老师想考考你：湖面为什么能看到月亮？", {
        title: "月光科学题",
        question: "晚上湖面上看到月亮，是因为水面发生了什么？",
        options: ["反射", "燃烧", "下雨", "结冰"],
        answer: 0,
      }),
      actionTask(790, 332, "月光石柱", "moonPillar", "靠近月光石柱，让月光照向湖面。"),
    ],
    puddles: [
      { x: 280, y: 420, r: 28 },
      { x: 706, y: 386, r: 32 },
    ],
    obstacles: [
      { type: "current", x: 444, y: 374, r: 40, vx: 78, vy: -14 },
      { type: "moonPillar", x: 790, y: 332, r: 34 },
      { type: "pond", x: 548, y: 162, r: 34 },
    ],
  },
  {
    name: "湖心浮岛",
    bg: "moonlitIsle",
    world: "moonlight_lake",
    time: 96,
    start: { x: 122, y: 420 },
    message: "湖心浮岛的机关醒来了，跟着泡泡找到月光钥匙吧！",
    collectibles: [
      item(172, 166, "moonKey", "月光钥匙"),
      item(356, 398, "pearlOrb", "珍珠能量球"),
      item(530, 190, "coralKey", "珊瑚钥匙"),
      item(750, 380, "bubbleStone", "发光水泡石"),
    ],
    tasks: [
      delivery(298, 292, "青蛙老师", "frog", "bubbleStone", "唤醒泡泡升降点。"),
      delivery(608, 318, "小海龟", "seaTurtle", ["moonKey", "coralKey"], "打开浮岛小门。"),
      quizTask(704, 208, "水獭邮差", "otter", "水獭邮差想确认贝壳机关的顺序。", {
        title: "贝壳顺序题",
        question: "贝壳机关的顺序是：蓝色、黄色、粉色。第三个应该按哪个？",
        options: ["蓝色", "黄色", "粉色", "绿色"],
        answer: 2,
      }),
      actionTask(446, 170, "泡泡滑梯", "bubbleLift", "靠近泡泡滑梯，它会把你轻轻托起来。"),
    ],
    npcDecorations: [
      npcDecoration(848, 150, "seagull", 0.82, "海鸥侦察员"),
      npcDecoration(246, 344, "beaver", 0.82, "小海狸工程师"),
      npcDecoration(856, 332, "seahorseGuard", 0.9, "海马守卫"),
    ],
    puddles: [
      { x: 254, y: 238, r: 28 },
      { x: 678, y: 218, r: 32 },
    ],
    obstacles: [
      { type: "bubbleLift", x: 446, y: 170, r: 34, vy: -125 },
      { type: "current", x: 540, y: 388, r: 40, vx: 92, vy: 0 },
      { type: "whirlpool", x: 820, y: 262, r: 44 },
    ],
  },
  {
    name: "水底花园",
    bg: "underwaterGarden",
    world: "moonlight_lake",
    time: 100,
    start: { x: 126, y: 416 },
    message: "水底花园的海草缠在一起了，帮小海龟和发光水母整理花园吧！",
    collectibles: [
      item(198, 206, "divingHelmet", "泡泡潜水帽"),
      item(354, 386, "jellyfishCore", "水母灯芯"),
      item(558, 248, "seaweedScissors", "海草剪刀"),
      item(744, 166, "aquaGem", "海蓝宝石"),
      item(816, 398, "pearlOrb", "珍珠能量球"),
    ],
    tasks: [
      delivery(260, 320, "小海龟", "seaTurtle", "divingHelmet", "检查安全的潜水路线。"),
      delivery(620, 356, "发光水母", "jellyfish", ["jellyfishCore", "aquaGem"], "让水底花园重新发光。"),
      quizTask(486, 236, "发光水母", "jellyfish", "发光水母想考一个水底英语词。", {
        title: "水底英语题",
        question: "turtle 的中文意思是？",
        options: ["海龟", "月亮", "珍珠", "石头"],
        answer: 0,
      }),
      actionTask(760, 246, "珍珠机关", "pearlSwitch", "靠近珍珠机关，打开珊瑚门。"),
    ],
    npcDecorations: [
      npcDecoration(850, 282, "clownfish", 0.82, "小丑鱼兄妹"),
    ],
    puddles: [
      { x: 268, y: 178, r: 28 },
      { x: 690, y: 414, r: 30 },
    ],
    obstacles: [
      { type: "current", x: 428, y: 296, r: 46, vx: -78, vy: 24 },
      { type: "bubbleLift", x: 574, y: 180, r: 34, vy: -110 },
      { type: "pearlSwitch", x: 760, y: 246, r: 34 },
    ],
  },
  {
    name: "深海遗迹",
    bg: "deepSeaRuins",
    world: "moonlight_lake",
    time: 106,
    start: { x: 118, y: 430 },
    message: "深海遗迹里藏着古老符文，帮章鱼博士点亮遗迹吧！",
    collectibles: [
      item(180, 372, "deepRune", "深海符文"),
      item(336, 182, "spiralShell", "螺旋贝壳"),
      item(512, 412, "coralKey", "珊瑚钥匙"),
      item(690, 226, "pearlCrown", "深海珍珠王冠"),
      item(822, 372, "aquaGem", "海蓝宝石"),
    ],
    tasks: [
      delivery(278, 300, "章鱼博士", "octopus", ["deepRune", "spiralShell"], "读取遗迹上的图案。"),
      delivery(650, 336, "发光水母", "jellyfish", ["coralKey", "aquaGem"], "点亮遗迹里的灯。"),
      quizTask(520, 340, "章鱼博士", "octopus", "章鱼博士想请你分一分珍珠能量球。", {
        title: "深海数学题",
        question: "章鱼博士找到 12 个珍珠能量球，平均放进 3 个贝壳里，每个贝壳放几个？",
        options: ["3", "4", "6", "9"],
        answer: 1,
      }),
      actionTask(502, 188, "月光石柱", "moonPillar", "稳稳靠近月光石柱，让它保持发光。"),
    ],
    npcDecorations: [
      npcDecoration(828, 290, "lanternFish", 0.9, "灯笼鱼"),
    ],
    puddles: [
      { x: 238, y: 230, r: 30 },
      { x: 720, y: 430, r: 32 },
    ],
    obstacles: [
      { type: "whirlpool", x: 420, y: 346, r: 48 },
      { type: "current", x: 618, y: 236, r: 42, vx: 0, vy: 82 },
      { type: "moonPillar", x: 502, y: 188, r: 34 },
    ],
  },
  {
    name: "尼斯湖怪巢穴",
    bg: "nessieLair",
    world: "moonlight_lake",
    time: 118,
    start: { x: 480, y: 438 },
    message: "尼斯湖怪被黑暗泡泡困住了，先完成勇气问答，再帮它恢复正常！",
    collectibles: [
      item(92, 430, "pearlOrb", "珍珠能量球"),
      item(332, 218, "pearlOrb", "珍珠能量球"),
      item(642, 214, "pearlOrb", "珍珠能量球"),
      item(808, 382, "moonPearlBadge", "月光珍珠徽章"),
      item(880, 430, "potion", "\u7231\u5fc3\u836f\u6c34"),
    ],
    tasks: [
      quizTask(172, 318, "尼斯湖怪", "nessie", "尼斯湖怪想听听你会怎么帮助朋友。", {
        title: "勇气复习题",
        question: "如果朋友被黑暗泡泡影响了，我们应该怎么做？",
        options: ["帮助它恢复正常", "马上逃走不管它", "把湖水弄脏", "抢走它的王冠"],
        answer: 0,
      }),
      moonBossTask(480, 152),
    ],
    puddles: [
      { x: 266, y: 392, r: 30 },
      { x: 694, y: 392, r: 30 },
    ],
    obstacles: [
      { type: "moonPillar", x: 260, y: 200, r: 32, bossPart: "pillar" },
      { type: "moonPillar", x: 480, y: 190, r: 32, bossPart: "pillar" },
      { type: "moonPillar", x: 700, y: 200, r: 32, bossPart: "pillar" },
      { type: "pearlSwitch", x: 308, y: 346, r: 34 },
      { type: "pearlSwitch", x: 652, y: 346, r: 34 },
      { type: "whirlpool", x: 480, y: 292, r: 58, bossPart: "whirlpool" },
    ],
    darkBubbles: [
      { x: 332, y: 268, r: 24, broken: false },
      { x: 480, y: 228, r: 24, broken: false },
      { x: 628, y: 268, r: 24, broken: false },
    ],
  },
  {
    name: "苹果谷入口",
    bg: "appleValleyEntrance",
    world: "apple_valley",
    time: 86,
    start: { x: 600, y: 435 },
    message: "苹果谷丰收啦！先帮 Coco 小松鼠捡起掉在路边的红苹果吧。",
    collectibles: [
      item(164, 412, "appleBasket", "果篮"),
    ],
    tasks: [
      delivery(450, 410, "Coco 小松鼠", "coco", ["redApple", "redApple", "redApple"], "Coco 想先收好 3 个红苹果。"),
      quizTask(512, 316, "苹果英语木牌", "english", "木牌想考考 apple 的意思。", {
        title: "苹果谷英语题",
        question: "apple 的中文意思是？",
        options: ["苹果", "小猫", "月亮", "铅笔"],
        answer: 0,
      }),
      actionTask(728, 398, "整理入口木牌", "autumnLeaf", "站在入口木牌旁 1 秒，打开果园小门。"),
    ],
    puddles: [],
    obstacles: [
      { type: "appleTree", x: 336, y: 318, r: 38, drops: ["redApple", "redApple", "redApple"], shaken: false },
    ],
  },
  {
    name: "丰收果园",
    bg: "harvestOrchard",
    world: "apple_valley",
    time: 98,
    start: { x: 610, y: 435 },
    message: "果园里红苹果、青苹果都成熟了，帮果园鼹鼠一起摇树收果吧。",
    collectibles: [
      item(238, 358, "redApple", "红苹果"),
      item(412, 210, "greenApple", "青苹果"),
    ],
    tasks: [
      delivery(430, 300, "果园鼹鼠", "moleFarmer", ["greenApple", "greenApple"], "果园鼹鼠想记录青苹果的颜色变化。"),
      delivery(420, 415, "小鸟邮差", "birdPostman", ["redApple", "redApple"], "小鸟邮差要把 2 个红苹果送到整理站。"),
      quizTask(514, 342, "果园数学牌", "math", "算一算篮子里的苹果。", {
        title: "苹果谷数学题",
        question: "篮子里有 3 个苹果，又放进 4 个，一共有几个？",
        options: ["5", "6", "7", "8"],
        answer: 2,
      }),
    ],
    puddles: [
      { x: 214, y: 426, r: 27 },
      { x: 708, y: 406, r: 30 },
    ],
    obstacles: [
      { type: "appleTree", x: 286, y: 345, r: 42, drops: ["redApple", "redApple", "greenApple"], shaken: false },
      { type: "appleTree", x: 560, y: 314, r: 44, drops: ["redApple", "greenApple", "greenApple"], shaken: false },
      { type: "appleTree", x: 752, y: 355, r: 42, drops: ["redApple", "greenApple", "goldenApple"], shaken: false },
      { type: "pond", x: 570, y: 232, r: 32 },
      { type: "pit", x: 816, y: 400, r: 24 },
    ],
  },
  {
    name: "果篮整理站",
    bg: "basketSortingStation",
    world: "apple_valley",
    time: 104,
    start: { x: 510, y: 435 },
    message: "苹果要分进不同果篮，再做成送给学校的丰收礼物篮。",
    collectibles: [
      item(158, 182, "redApple", "红苹果"),
      item(274, 360, "redApple", "红苹果"),
      item(382, 184, "redApple", "红苹果"),
      item(528, 354, "greenApple", "青苹果"),
      item(648, 184, "greenApple", "青苹果"),
      item(804, 352, "greenApple", "青苹果"),
      item(460, 132, "goldenApple", "金苹果"),
      item(728, 236, "appleBasket", "果篮"),
    ],
    tasks: [
      sortBasket(262, 250, "红苹果篮", "redBasket", ["redApple", "redApple", "redApple"], "把红苹果放进红篮子里。"),
      sortBasket(626, 250, "青苹果篮", "greenBasket", ["greenApple", "greenApple", "greenApple"], "把青苹果放进绿篮子里。"),
      sortBasket(804, 240, "礼物果篮", "giftBasket", ["goldenApple", "appleBasket"], "把金苹果和果篮做成丰收礼物篮。", "giftAppleBasket"),
      quizTask(680, 320, "丰收语文牌", "language", "想一想“丰收”的意思。", {
        title: "苹果谷语文题",
        question: "“丰收”的意思更接近哪一个？",
        options: ["收获很多", "天气很冷", "走得很快", "睡觉很香"],
        answer: 0,
      }),
    ],
    puddles: [
      { x: 210, y: 420, r: 28 },
      { x: 706, y: 410, r: 28 },
    ],
    obstacles: [
      { type: "bush", x: 388, y: 390, r: 30 },
      { type: "pit", x: 590, y: 382, r: 26 },
    ],
  },
  {
    name: "送给猫头鹰校长",
    bg: "forestSchoolDelivery",
    world: "apple_valley",
    time: 92,
    start: { x: 520, y: 435 },
    message: "猫头鹰校长收到了丰收苹果，大家一起分享秋天的礼物！",
    collectibles: [
      item(224, 360, "giftAppleBasket", "礼物果篮"),
      item(612, 164, "harvestBadge", "丰收徽章"),
    ],
    tasks: [
      delivery(560, 330, "猫头鹰校长", "owlPrincipal", "giftAppleBasket", "把礼物果篮护送到猫头鹰校长这里。"),
      actionTask(468, 336, "苹果小推车", "appleCartStation", "拿到礼物果篮后，站在小推车旁让它跟着你出发。"),
      quizTask(730, 390, "分享理解题", "riddle", "想一想为什么要分享丰收苹果。", {
        title: "苹果谷理解题",
        question: "Coco 把苹果送到学校，是为了什么？",
        options: ["和大家分享", "把苹果藏起来", "让大家迷路", "把篮子扔掉"],
        answer: 0,
      }),
      delivery(660, 300, "Nono 小刺猬", "nono", "harvestBadge", "Nono 想把丰收徽章写进观察记录。"),
    ],
    puddles: [
      { x: 256, y: 424, r: 26 },
      { x: 632, y: 390, r: 30 },
    ],
    obstacles: [
      { type: "bush", x: 386, y: 420, r: 32 },
    ],
    escortCart: { type: "appleCart", x: 468, y: 336, active: false },
  },
  {
    name: "森林公路入口",
    bg: "forestRoadEntrance",
    world: "forest_road",
    time: 86,
    start: { x: 112, y: 430 },
    message: "森林公路入口被树枝、落叶和小石块挡住了，先试试清理道路。",
    collectibles: [],
    tasks: [
      roadClearTask(184, 406, "树枝堆", "branchPile", "正在清理树枝……", 0.9),
      roadClearTask(306, 338, "落叶堆", "leafPile", "正在清理落叶……", 1.1),
      roadClearTask(428, 404, "小石块", "roadStone", "正在搬开小石块……", 1),
      roadClearTask(548, 310, "树枝堆", "branchPile", "正在清理树枝……", 0.9),
      roadClearTask(656, 392, "落叶堆", "leafPile", "正在清理落叶……", 1.1),
      roadClearTask(744, 270, "小石块", "roadStone", "正在搬开小石块……", 1),
      roadClearTask(798, 354, "落叶堆", "leafPile", "正在清理落叶……", 1.1),
    ],
    puddles: [],
    obstacles: [],
  },
  {
    name: "弯弯森林小路",
    bg: "windingForestCrossroad",
    world: "forest_road",
    time: 92,
    start: { x: 118, y: 430 },
    message: "找到路牌碎片，修好破损路牌，再选择去橡果镇的路。",
    collectibles: [
      item(292, 350, "signPiece", "路牌碎片"),
    ],
    tasks: [
      directionSignTask(486, 260, "破损路牌", ["→ 橡果镇", "← 苹果谷", "↓ 森林学校"]),
      exitTask(816, 236, "correctExit", "去橡果镇的路"),
    ],
    exitAreas: [
      { x: 144, y: 246, r: 48, type: "wrongExit", label: "苹果谷方向", propKey: "appleValleyMapSign" },
      { x: 494, y: 412, r: 48, type: "wrongExit", label: "森林学校方向", propKey: "forestSchoolDirectionSign" },
    ],
    puddles: [],
    obstacles: [],
  },
  {
    name: "护送小动物过路",
    bg: "escortForestPath",
    world: "forest_road",
    time: 96,
    start: { x: 120, y: 430 },
    message: "小伙伴迷路了，靠近它，再跟着红绿灯节奏走到安全区。",
    collectibles: [],
    tasks: [
      escortNpcTask(238, 342, "迷路小伙伴", "nono", "safeZone"),
    ],
    safeZones: [
      { id: "safeZone", x: 792, y: 342, r: 60, label: "安全区" },
    ],
    trafficLights: [
      { x: 520, y: 190, state: "green", timer: 0 },
    ],
    crossingZones: [
      { x: 520, y: 338, w: 150, h: 118, lightIndex: 0 },
    ],
    puddles: [],
    obstacles: [],
  },
  {
    name: "橡果镇路口",
    bg: "acornTownCrossroad",
    world: "forest_road",
    time: 110,
    start: { x: 112, y: 430 },
    message: "最后路口要综合测试：清理大路障、放好路牌、护送小伙伴到橡果镇入口。",
    collectibles: [
      item(320, 358, "signPiece", "最终路牌碎片"),
    ],
    tasks: [
      roadClearTask(238, 346, "大路障", "branchPile", "正在清理树枝……", 1.2),
      directionSignTask(472, 250, "最终路牌", ["→ 橡果镇", "← 苹果谷", "↓ 森林学校"]),
      escortNpcTask(220, 408, "等候的小伙伴", "coco", "acornTownGate"),
      exitTask(812, 246, "correctExit", "橡果镇入口"),
    ],
    safeZones: [
      { id: "acornTownGate", x: 812, y: 246, r: 64, label: "橡果镇入口" },
    ],
    trafficLights: [
      { x: 608, y: 180, state: "green", timer: 0 },
    ],
    crossingZones: [
      { x: 608, y: 338, w: 150, h: 116, lightIndex: 0 },
    ],
    puddles: [],
    obstacles: [],
  },
  {
    name: "迷雾沼泽入口",
    bg: "mistSwampEntrance",
    world: "mist_swamp",
    time: 90,
    start: { x: 120, y: 390 },
    message: "跟随温柔的光，点亮迷雾沼泽入口。",
    mistQuest: {
      npcAnimal: "ruru",
      introLines: ["旧路被迷雾挡住啦。", "请收集萤火虫灯芯，点亮两盏雾灯，再回来告诉我。"],
      activeHint: "收集萤火虫灯芯，点亮入口的两盏雾灯。",
      readyHint: "入口的雾已经散开，回去告诉 Ruru。",
      completeLines: ["太棒啦，前面的旧路重新亮起来了！"],
      objectiveLabels: ["收集萤火虫灯芯", "点亮雾灯", "雾与光答题"],
    },
    collectibles: [
      item(250, 190, "fireflyCore", "萤火虫灯芯"),
      item(470, 330, "fireflyCore", "萤火虫灯芯"),
      item(730, 170, "fireflyCore", "萤火虫灯芯"),
    ],
    tasks: [
      mistLampTask(350, 220, "入口雾灯"),
      mistLampTask(650, 300, "深处雾灯"),
      { ...delivery(820, 390, "Ruru 小浣熊", "ruru", "fireflyCore", "确认旧路方向"), requiresActiveLamp: true },
    ],
    puddles: [],
    obstacles: [],
  },
  {
    name: "萤火虫小径",
    bg: "fireflyTrailPath",
    world: "mist_swamp",
    time: 95,
    start: { x: 110, y: 390 },
    message: "收集发光孢子，找到木桥钥匙。",
    mistQuest: {
      npcAnimal: "fireflyGuide",
      introLines: ["跟紧温暖的金色光点。", "收集四个发光孢子，并找到木桥钥匙。"],
      activeHint: "跟随真正的萤火虫路线，找齐发光孢子和木桥钥匙。",
      readyHint: "小径已经走通，回到萤火虫向导身边。",
      completeLines: ["你已经学会辨认真正的萤火虫路线啦！"],
      objectiveLabels: ["跟随真正光点", "收集发光孢子", "找到木桥钥匙"],
    },
    collectibles: [
      item(250, 330, "glowSpore", "发光孢子"),
      item(390, 210, "glowSpore", "发光孢子"),
      item(560, 350, "glowSpore", "发光孢子"),
      item(710, 220, "glowSpore", "发光孢子"),
      item(820, 360, "bridgeKey", "木桥钥匙"),
    ],
    tasks: [
      { x: 480, y: 150, name: "萤火虫小径", animal: "fireflyGuide", need: ["glowSpore", "glowSpore", "glowSpore", "glowSpore", "bridgeKey"], kind: "firefly_trail", done: false, progress: 0 },
    ],
    fireflyTrail: [
      { x: 210, y: 360 }, { x: 340, y: 275 }, { x: 480, y: 325 }, { x: 620, y: 235 }, { x: 760, y: 300 },
      { x: 500, y: 390, decoy: true }, { x: 590, y: 405, decoy: true },
    ],
    npcDecorations: [
      { kind: "swampSnail", x: 840, y: 180, scale: 0.82, label: "沼泽蜗牛" },
    ],
    puddles: [],
    obstacles: [{ type: "softMud", x: 520, y: 255, r: 38 }],
  },
  {
    name: "沉睡木桥",
    bg: "sleepingWoodenBridge",
    world: "mist_swamp",
    time: 100,
    start: { x: 120, y: 400 },
    message: "找齐木桥板，修好木桥，再带小青蛙去出口。",
    mistQuest: {
      npcAnimal: "littleFrog",
      introLines: ["木桥坏掉啦，我不敢过去。", "请找齐木桥板、修好桥，再带我去出口。"],
      activeHint: "找木桥板、修好木桥，再护送小青蛙到出口。",
      readyHint: "小青蛙已经安全到达，和它说说话吧。",
      completeLines: ["谢谢你修好木桥，还安全地带我过来了！"],
      objectiveLabels: ["收集木桥板", "修复木桥", "蘑菇灯顺序", "护送小青蛙"],
    },
    collectibles: [
      item(230, 180, "bridgePlank", "木桥板"),
      item(440, 350, "bridgePlank", "木桥板"),
      item(690, 170, "bridgePlank", "木桥板"),
    ],
    tasks: [
      mushroomLampTask(300, 150, "yellow", "黄色蘑菇灯"),
      mushroomLampTask(450, 150, "blue", "蓝色蘑菇灯"),
      mushroomLampTask(600, 150, "purple", "紫色蘑菇灯"),
      mushroomLampTask(800, 150, "green", "绿色蘑菇灯"),
      { x: SLEEPING_BRIDGE_REPAIR_ANCHOR.x, y: SLEEPING_BRIDGE_REPAIR_ANCHOR.y, name: "沉睡木桥", animal: "brokenBridge", need: ["bridgePlank", "bridgePlank", "bridgePlank"], kind: "broken_bridge", done: false, progress: 0 },
      escortNpcTask(680, 340, "小青蛙", "littleFrog", "mistBridgeExit"),
    ],
    mushroomSequence: ["yellow", "blue", "purple", "green"],
    safeZones: [
      { id: "mistBridgeExit", x: 830, y: 210, r: 80, label: "木桥出口" },
    ],
    puddles: [],
    obstacles: [],
  },
  {
    name: "迷雾核心",
    bg: "mistCoreClearing",
    world: "mist_swamp",
    time: 110,
    start: { x: 120, y: 390 },
    message: "收集光之孢子，帮助迷雾精灵恢复清醒。",
    mistQuest: {
      npcAnimal: "mistSpirit",
      introLines: ["迷雾核心被黑雾泡泡围住了。", "请收集光之孢子，点亮大雾灯，让这里重新发光。"],
      activeHint: "点亮大雾灯，依次清除黑雾泡泡，再安抚迷雾精灵。",
      readyHint: "迷雾精灵恢复清醒了，回去和它说话。",
      completeLines: ["谢谢你，沼泽重新亮起来了！"],
      objectiveLabels: ["收集光之孢子", "点亮大雾灯", "清除黑雾泡泡", "安抚迷雾精灵"],
    },
    collectibles: [
      item(180, 390, "lightSpore", "光之孢子"),
      item(480, 420, "lightSpore", "光之孢子"),
      item(820, 390, "lightSpore", "光之孢子"),
    ],
    tasks: [
      mistLampTask(250, 170, "大雾灯一", "lightSpore", "bigMistLamp"),
      mistLampTask(480, 130, "大雾灯二", "lightSpore", "bigMistLamp"),
      mistLampTask(710, 170, "大雾灯三", "lightSpore", "bigMistLamp"),
      mistBubbleTask(330, 330, "黑雾泡泡一"),
      mistBubbleTask(520, 350, "黑雾泡泡二"),
      mistBubbleTask(700, 330, "黑雾泡泡三"),
      { x: 810, y: 260, name: "迷雾精灵", animal: "mistSpirit", kind: "mist_core", done: false, progress: 0, reward: "fireflyLantern" },
    ],
    puddles: [],
    obstacles: [],
  },
  {
    name: "沼泽泥浆怪",
    bg: "mudMonsterLair",
    world: "mist_swamp",
    time: 120,
    start: { x: 120, y: 390 },
    message: "用光和知识帮助沼泽守护者。",
    mistQuest: {
      npcAnimal: "mudMonster",
      introLines: ["沼泽守护者被黑雾和泥浆困住了。", "先点亮三盏大雾灯，我们一起帮助它恢复清醒。"],
      activeHint: "按当前阶段完成点灯、清泡泡和灯笼充能。",
      readyHint: "守护者恢复平静了，去听听它想说什么。",
      completeLines: ["谢谢你！我会继续守护这片沼泽。"],
      objectiveLabels: ["同时点亮大雾灯", "清除泥浆泡泡", "灯笼充能与答题"],
    },
    collectibles: [
      item(190, 390, "lightSpore", "光之孢子"),
      item(450, 410, "lightSpore", "光之孢子"),
      item(690, 390, "lightSpore", "光之孢子"),
    ],
    tasks: [
      mistLampTask(250, 170, "大雾灯一", "lightSpore", "bigMistLamp"),
      mistLampTask(480, 130, "大雾灯二", "lightSpore", "bigMistLamp"),
      mistLampTask(710, 170, "大雾灯三", "lightSpore", "bigMistLamp"),
      mudBossTask(780, 230),
    ],
    puddles: [],
    obstacles: [{ type: "softMud", x: 540, y: 335, r: 48 }],
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
  "moonlight_lake",
  "moonlight_lake",
  "moonlight_lake",
  "moonlight_lake",
  "moonlight_lake",
];

levels.forEach((level, index) => {
  const worldId = level.world || LEVEL_WORLD_SEQUENCE[index] || "forest_school";
  level.id = level.id || `day_${index + 1}`;
  level.world = worldId;
  level.worldName = WORLD_MAP[worldId]?.name || worldId;
});

WORLD_MAP.apple_valley.levels = levels
  .map((level, index) => (level.world === "apple_valley" ? index : -1))
  .filter((index) => index >= 0);

WORLD_MAP.forest_road.levels = [16, 17, 18, 19];

WORLD_MAP.mist_swamp.levels = levels
  .map((level, index) => (level.world === "mist_swamp" ? index : -1))
  .filter((index) => index >= 0);

function levelBackgroundKey(level) {
  if (!level) return null;
  return level.bg || WORLD_MAP[level.world]?.background;
}

function isAppleValleyLevel() {
  return levels[state.levelIndex]?.world === "apple_valley";
}

function isMistSwampLevel() {
  return levels[state.levelIndex]?.world === "mist_swamp";
}

function isMistSwampSleepingBridgeLevel() {
  const level = levels[state.levelIndex];
  return level?.world === "mist_swamp" && level.name === "沉睡木桥";
}

function isMistSwampMistCoreLevel() {
  const level = levels[state.levelIndex];
  return level?.world === "mist_swamp" && level.name === "迷雾核心";
}

function createMistQuestState(level, tasks) {
  if (level?.world !== "mist_swamp" || !level.mistQuest) return null;
  const npcTask = tasks.find((task) => task.animal === level.mistQuest.npcAnimal);
  return {
    status: "locked",
    npcTaskId: npcTask?.id || null,
    readyAt: 0,
    lastProgressAt: performance.now(),
    progressSignature: "",
    pendingReward: null,
  };
}

function mistQuestNpcTask() {
  if (!isMistSwampLevel() || !state.mistQuest) return null;
  return state.tasksList.find((task) => task.id === state.mistQuest.npcTaskId) || null;
}

function isMistQuestNpc(task) {
  return !!task && !!state?.mistQuest && task.id === state.mistQuest.npcTaskId;
}

function mistQuestAllowsProgress() {
  return !state?.mistQuest || state.mistQuest.status === "active";
}

function acceptMistQuest() {
  if (!state?.mistQuest || state.mistQuest.status !== "locked") return false;
  state.mistQuest.status = "active";
  state.mistQuest.lastProgressAt = performance.now();
  messageEl.textContent = levels[state.levelIndex].mistQuest.activeHint;
  updateHud();
  return true;
}

function mistQuestGameplayComplete() {
  if (!state?.mistQuest || state.mistQuest.status !== "active") return false;
  const npc = mistQuestNpcTask();
  return requiredTasksForCurrentLevel().every((task) => {
    if (task !== npc || task.kind !== "delivery") return task.done;
    return missingNeeds(task.need).length === 0 && canTalkToMistSwampTask(task);
  });
}

function updateMistQuestReadiness() {
  if (!mistQuestGameplayComplete()) return false;
  state.mistQuest.status = "ready";
  state.mistQuest.readyAt = performance.now();
  messageEl.textContent = levels[state.levelIndex].mistQuest.readyHint;
  updateHud();
  return true;
}

function canSettleCurrentLevel(requiredTasks) {
  if (!requiredTasks.every((task) => task.done)) return false;
  return !state.mistQuest || state.mistQuest.status === "settled";
}

function isMistLampActive(task, now = performance.now()) {
  return !!task?.lit && (task.litUntil === null || task.litUntil > now);
}

function hasActiveMistLamp() {
  return isMistSwampLevel() && state.tasksList.some((task) => task.kind === "mist_lamp" && isMistLampActive(task));
}

function canTalkToMistSwampTask(task) {
  return !isMistSwampLevel() || !task?.requiresActiveLamp || selectedDifficulty === "easy" || hasActiveMistLamp();
}

function requiredTasksForCurrentLevel() {
  return isMistSwampSleepingBridgeLevel() ? state.tasksList.filter((task) => !task.optional) : state.tasksList;
}

function taskSystemType(kind) {
  if (kind === "boss") return TASK_TYPES.BOSS_FIGHT;
  if (kind === "mud_boss") return TASK_TYPES.BOSS_FIGHT;
  if (kind === "quiz") return TASK_TYPES.SIMPLE_PUZZLE;
  if (kind === "direction_sign" || kind === "exit_area") return TASK_TYPES.SIMPLE_PUZZLE;
  if (kind === "escort_npc") return TASK_TYPES.HELP_NPC;
  if (kind === "delivery" || kind === "sort_basket") return TASK_TYPES.HELP_NPC;
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

function npcDecoration(x, y, kind, scale = 1, label = "") {
  return { x, y, kind, scale, label };
}

function delivery(x, y, name, animal, need, speech) {
  return { x, y, name, animal, need: Array.isArray(need) ? need : [need], speech, kind: "delivery", done: false, progress: 0 };
}

function sortBasket(x, y, name, animal, need, speech, reward = null) {
  return { x, y, name, animal, need: Array.isArray(need) ? need : [need], speech, reward, kind: "sort_basket", done: false, progress: 0 };
}

function actionTask(x, y, name, animal, speech) {
  return { x, y, name, animal, speech, kind: "action", done: false, progress: 0 };
}

function roadClearTask(x, y, name, animal, speech, duration) {
  return { x, y, name, animal, speech, duration, kind: "road_clear", done: false, progress: 0 };
}

function directionSignTask(x, y, name, directions) {
  return {
    x,
    y,
    name,
    animal: "directionSign",
    need: ["signPiece"],
    speech: "收集路牌碎片后，按 E 修好路牌。",
    directions,
    kind: "direction_sign",
    done: false,
    progress: 0,
  };
}

function exitTask(x, y, animal, name) {
  return { x, y, name, animal, speech: "走到正确出口。", kind: "exit_area", done: false, progress: 0 };
}

function escortNpcTask(x, y, name, animal, safeZoneId) {
  return { x, y, name, animal, safeZoneId, speech: "靠近小伙伴，让它跟着你去安全区。", kind: "escort_npc", done: false, progress: 0, following: false };
}

function quizTask(x, y, name, animal, speech, quiz) {
  return { x, y, name, animal, speech, quizKey: typeof quiz === "string" ? quiz : null, quiz, kind: "quiz", done: false, progress: 0 };
}

function bossTask(x, y, name, animal, need, speech) {
  return { x, y, name, animal, need, speech, kind: "boss", done: false, progress: 0, hp: 9, maxHp: 9 };
}

function moonBossTask(x, y) {
  return {
    x,
    y,
    name: "尼斯湖怪",
    animal: "nessie",
    need: ["moonPearlBadge"],
    speech: "帮助尼斯湖怪清除黑暗漩涡。",
    kind: "moon_boss",
    done: false,
    progress: 0,
    phase: 1,
    phaseProgress: 0,
  };
}

function mistLampTask(x, y, name, need = "fireflyCore", animal = "light") {
  return { x, y, name, animal, need: [need], kind: "mist_lamp", done: false, progress: 0, lit: false, litUntil: 0 };
}

function mushroomLampTask(x, y, color, name) {
  return { x, y, color, name, animal: "mushroomLamp", kind: "mushroom_lamp", done: false, progress: 0, lit: false };
}

function mistBubbleTask(x, y, name, animal = "darkMistBubble") {
  return { x, y, name, animal, kind: "mist_bubble", done: false, progress: 0 };
}

function mudBubbleTask(x, y, index) {
  return { x, y, name: `泥浆泡泡${index + 1}`, animal: "mudBubble", kind: "mud_bubble", done: false, progress: 0, broken: false, active: false, bossPhase: 2, r: 24, phase: index * 0.8 };
}

function mudBossTask(x, y) {
  return { x, y, name: "沼泽泥浆怪", animal: "mudMonster", kind: "mud_boss", done: false, phase: 1, phaseProgress: 0, quizKey: "mistSwampBoss", quiz: null, reward: "mistGuardianBadge", speech: "点亮雾灯，帮泥浆怪恢复清醒。" };
}

function resetGame(levelIndex = 0, keepHearts = false) {
  const level = levels[levelIndex];
  const levelTime = levelTimeForDifficulty(level);
  if (gameEntered) preloadNearbyBackgrounds(levelIndex);
  closeQuiz();
  closeDialogue();
  state = {
    levelIndex,
    running: false,
    levelClear: false,
    gameComplete: false,
    time: levelTime,
    levelTime,
    timeExpiredNotified: false,
    levelSettled: false,
    runPoints: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    obstacleHits: 0,
    startedAt: new Date().toISOString(),
    hearts: keepHearts && state ? state.hearts : 0,
    tasks: 0,
    inventory: [],
    slowUntil: 0,
    puddleCooldownUntil: 0,
    priorityMessage: "",
    priorityMessageUntil: 0,
    bubbleLiftUntil: 0,
    activeBubbleLift: null,
    bubbleLiftCooldownUntil: 0,
    hurtCooldownUntil: 0,
    attackCooldownUntil: 0,
    bossAttackTimer: 0.9,
    hazards: [],
    projectiles: [],
    activeQuiz: null,
    activeDialogue: null,
    mistQuest: null,
    nearbyTask: null,
    nearbyMudBubble: null,
    nearbyAppleTree: null,
    storybookIntroPage: randomStorybookPage(storybookIntroPages),
    storybookVictoryPage: randomStorybookPage(storybookVictoryPages),
    shake: 0,
    player: { x: level.start.x, y: level.start.y, vx: 0, vy: 0, dir: 1, step: 0 },
    collectibles: level.collectibles.map((entry) => ({ ...entry })),
    tasksList: level.tasks.map((entry, index) => prepareTask(entry, level, index)),
    puddles: level.puddles.map((entry) => ({ ...entry })),
    obstacles: (level.obstacles || []).map((entry) => ({ ...entry })),
    escortCart: level.escortCart ? { ...level.escortCart } : null,
    safeZones: (level.safeZones || []).map((entry) => ({ ...entry })),
    trafficLights: (level.trafficLights || []).map((entry) => ({ ...entry })),
    crossingZones: (level.crossingZones || []).map((entry) => ({ ...entry })),
    exitAreas: (level.exitAreas || []).map((entry) => ({ ...entry })),
    propDecorations: (level.propDecorations || []).map((entry) => ({ ...entry })),
    npcDecorations: (level.npcDecorations || []).map((entry) => ({ ...entry })),
    darkBubbles: (level.darkBubbles || []).map((entry) => ({ ...entry })),
    fireflyTrail: (level.fireflyTrail || []).map((entry) => ({ ...entry, faded: false })),
    fireflyTrailIndex: 0,
    mushroomSequence: [...(level.mushroomSequence || [])],
    mushroomStep: 0,
    mistCoreBubbleIndex: 0,
    mistOpacity: level.world === "mist_swamp" ? 0.32 : 0,
    mistClearUntil: 0,
    mistPermanentClear: false,
    mudBubbles: [],
    lanternCharge: 0,
    lanternChargeRequired: MIST_LANTERN_CHARGE_TIME_BY_DIFFICULTY[selectedDifficulty] || 2,
    temporaryMistItems: [],
    sparkles: [],
    floaters: [],
    leaves: makeLeaves(levelIndex),
  };
  state.mistQuest = createMistQuestState(level, state.tasksList);
  if (isMistSwampSleepingBridgeLevel()) prepareSleepingBridgeLevel();
  if (level.world === "mist_swamp" && level.name === "沼泽泥浆怪") prepareMudBossLevel();
  updateHud();
  messageEl.textContent = isMistSwampSleepingBridgeLevel() && ["hard", "crazy"].includes(selectedDifficulty)
    ? "观察灯的位置，按黄 → 蓝 → 紫 → 绿点亮。"
    : level.message;
  startBtn.textContent = levelIndex === 0 ? text.start : text.next;
}

function randomSleepingBridgeLampSlots() {
  const slots = SLEEPING_BRIDGE_LAMP_SLOTS.map((slot) => ({ ...slot }));
  for (let index = slots.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [slots[index], slots[swapIndex]] = [slots[swapIndex], slots[index]];
  }
  return slots.slice(0, 4);
}

function placeSleepingBridgeMushroomLamps() {
  if (!isMistSwampSleepingBridgeLevel() || !["hard", "crazy"].includes(selectedDifficulty)) return;
  const slots = randomSleepingBridgeLampSlots();
  state.tasksList.filter((task) => task.kind === "mushroom_lamp").forEach((task, index) => {
    task.x = slots[index].x;
    task.y = slots[index].y;
  });
}

function sleepingBridgeNearbyPriority(task) {
  return isMistSwampSleepingBridgeLevel() && task.kind === "mushroom_lamp" && !task.done ? 1 : 0;
}

function prepareSleepingBridgeLevel() {
  if (!isMistSwampSleepingBridgeLevel()) return;
  const plankCount = BRIDGE_PLANK_COUNT_BY_DIFFICULTY[selectedDifficulty] || 2;
  const bridge = state.tasksList.find((task) => task.kind === "broken_bridge");
  if (bridge) bridge.need = Array(plankCount).fill("bridgePlank");
  const mushroomsOptional = selectedDifficulty === "easy" || selectedDifficulty === "normal";
  const sequenceLength = MUSHROOM_SEQUENCE_LENGTH_BY_DIFFICULTY[selectedDifficulty] || 3;
  state.mushroomSequence = state.mushroomSequence.slice(0, sequenceLength);
  state.tasksList.filter((task) => task.kind === "mushroom_lamp").forEach((task) => {
    task.optional = mushroomsOptional;
  });
  placeSleepingBridgeMushroomLamps();
  state.tasksList.filter((task) => task.mistSwampShared).forEach((task) => {
    if (task.done) return;
    task.done = true;
    state.tasks += 1;
  });
}

function prepareMudBossLevel() {
  if (!isMistSwampLevel()) return;
  const requiredBubbles = MUD_BUBBLE_COUNT_BY_DIFFICULTY[selectedDifficulty] || 3;
  const level = levels[state.levelIndex];
  state.mudBubbles = Array.from({ length: requiredBubbles }, (_, index) => prepareTask(
    mudBubbleTask(430 + (index % 2) * 210, 260 + Math.floor(index / 2) * 115, index),
    level,
    state.tasksList.length + index
  ));
  state.tasksList.push(...state.mudBubbles);
  const reachableSpores = state.collectibles.filter((entry) => entry.type === "lightSpore").length;
  for (let index = reachableSpores; index < 3; index += 1) {
    state.inventory.push("lightSpore");
    state.temporaryMistItems.push("lightSpore");
  }
  const hasLantern = state.collectibles.some((entry) => entry.type === "fireflyLantern") || state.inventory.includes("fireflyLantern");
  if (!hasLantern) {
    state.inventory.push("fireflyLantern");
    state.temporaryMistItems.push("fireflyLantern");
  }
}

function prepareTask(entry, level, index) {
  const task = { ...entry };
  task.id = task.id || `${level.bg || "level"}_${task.kind}_${task.animal}_${index}`;
  task.taskType = task.taskType || taskSystemType(task.kind);
  task.npc = task.npc || NPC_REGISTRY[task.animal]?.id || task.animal;
  task.characterId = task.characterId || NPC_REGISTRY[task.animal]?.characterId || null;
  const quizScope = task.mistSwampShared && level.world === "mist_swamp" ? level.world : level.id || level.bg || level.name;
  if (task.quizKey) task.quiz = randomQuiz(task.quizKey, quizScope);
  return task;
}

function randomQuiz(key) {
  const list = quizBank[key] || [];
  return list[Math.floor(Math.random() * list.length)] || quizBank.math[0];
}

function randomNickname() {
  return DEFAULT_NICKNAMES[Math.floor(Math.random() * DEFAULT_NICKNAMES.length)] || "小猫勇士";
}

function readStoredNumber(key) {
  const value = Number(localStorage.getItem(key));
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

function readStoredJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function nicknameLength(value) {
  return [...value].reduce((total, char) => total + (/[\u3400-\u9fff]/.test(char) ? 2 : 1), 0);
}

function limitNickname(value) {
  let result = "";
  for (const char of value) {
    const next = result + char;
    if (nicknameLength(next) > 24) break;
    result = next;
  }
  return result;
}

function sanitizeNickname(value) {
  const cleaned = String(value || "")
    .replace(/script/gi, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return limitNickname(cleaned) || randomNickname();
}

function savePlayerProfile(nickname) {
  const now = new Date().toISOString();
  playerProfile = {
    nickname: sanitizeNickname(nickname),
    createdAt: playerProfile?.createdAt || now,
    updatedAt: now,
  };
  localStorage.setItem(PLAYER_PROFILE_KEY, JSON.stringify(playerProfile));
  if (nicknameInput) nicknameInput.value = playerProfile.nickname;
}

function loadPlayerProfile() {
  const stored = readStoredJson(PLAYER_PROFILE_KEY, null);
  const now = new Date().toISOString();
  const profile = {
    nickname: sanitizeNickname(stored?.nickname || randomNickname()),
    createdAt: stored?.createdAt || now,
    updatedAt: stored?.updatedAt || now,
  };
  localStorage.setItem(PLAYER_PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

function difficultySettings() {
  return DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.normal;
}

function levelTimeForDifficulty(level) {
  return Math.max(20, Math.round(level.time * difficultySettings().timeScale));
}

function difficultyLabel() {
  const settings = difficultySettings();
  return `${settings.icon} ${settings.label}`;
}

function randomStorybookPage(pages) {
  return pages[Math.floor(Math.random() * pages.length)] || STORYBOOK_FALLBACK_PAGE;
}

function setStorybookImage(image, src) {
  if (!image) return;
  image.onerror = () => {
    image.onerror = null;
    image.src = STORYBOOK_FALLBACK_PAGE;
  };
  image.src = src || STORYBOOK_FALLBACK_PAGE;
}

function showStorybookIntroPage() {
  if (!storybookPanel || !storybookImage || !state) return;
  const pageName = dayNames[state.levelIndex] || `第${state.levelIndex + 1}天`;
  setStorybookImage(storybookImage, state.storybookIntroPage);
  storybookTitle.textContent = `${pageName}开场`;
  storybookCaption.textContent = "读完这一页，再开始任务。";
  storybookStartBtn.textContent = "开始任务";
  storybookPanel.hidden = false;
}

function closeStorybookPage(shouldStart = false) {
  if (!storybookPanel) return;
  storybookPanel.hidden = true;
  if (shouldStart) {
    storybookIntroSeen = true;
    startGame();
  }
}

function applyTimePenalty(kind, x, y) {
  if (!state) return 0;
  const amount = difficultySettings()[`${kind}Penalty`] || 0;
  if (!amount) return 0;
  state.time = Math.max(0, state.time - amount);
  addFloatingText(x, y - 58, `-${amount}\u79d2`, "#e84b3f");
  updateHud();
  return amount;
}

function addRunPoints(amount, x, y, label = `+${amount}`) {
  if (!state || !amount) return;
  state.runPoints += amount;
  if (Number.isFinite(x) && Number.isFinite(y)) addFloatingText(x, y - 68, label, "#f2ad31");
  updateHud();
}

function levelCompletionPoints() {
  let points = 30;
  if (selectedDifficulty === "hard") points += 15;
  if (selectedDifficulty === "crazy") points += 40;
  if (state.timeExpiredNotified && selectedDifficulty !== "crazy") points = Math.floor(points / 2);
  return points;
}

function levelTimeBonus() {
  if (!state || state.time <= 0) return 0;
  const maxTimeBonus = TIME_BONUS_BY_DIFFICULTY[selectedDifficulty] || TIME_BONUS_BY_DIFFICULTY.normal;
  const levelTime = state.levelTime || levels[state.levelIndex].time || 1;
  const timeLeft = Math.min(Math.max(0, state.time), levelTime);
  return Math.round((timeLeft / levelTime) * maxTimeBonus);
}

function saveRunHistory(record) {
  const history = readStoredJson(RUN_HISTORY_KEY, []);
  const nextHistory = Array.isArray(history) ? history : [];
  nextHistory.unshift(record);
  localStorage.setItem(RUN_HISTORY_KEY, JSON.stringify(nextHistory.slice(0, 50)));
}

function settleLevelRun(completed) {
  if (!state || state.levelSettled) return null;
  state.levelSettled = true;
  const completionBonus = completed ? levelCompletionPoints() : 0;
  const timeLeft = Math.max(0, state.time);
  const levelTime = state.levelTime || levels[state.levelIndex].time || 0;
  const timeBonus = completed ? levelTimeBonus() : 0;
  if (completionBonus) state.runPoints += completionBonus;
  if (timeBonus) state.runPoints += timeBonus;

  totalPoints += state.runPoints;
  bestScore = Math.max(bestScore, state.runPoints);
  localStorage.setItem(TOTAL_POINTS_KEY, String(totalPoints));
  localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  saveRunHistory({
    nickname: playerProfile.nickname,
    levelIndex: state.levelIndex,
    difficulty: selectedDifficulty,
    runPoints: state.runPoints,
    completed,
    timeLeft: Math.ceil(timeLeft),
    levelTime,
    timeBonus,
    correctAnswers: state.correctAnswers,
    wrongAnswers: state.wrongAnswers,
    obstacleHits: state.obstacleHits,
    startedAt: state.startedAt,
    finishedAt: new Date().toISOString(),
  });
  updateHud();
  return {
    completed,
    completionBonus,
    timeBonus,
    runPoints: state.runPoints,
    timeLeft: Math.ceil(timeLeft),
    levelTime,
    correctAnswers: state.correctAnswers,
    wrongAnswers: state.wrongAnswers,
    obstacleHits: state.obstacleHits,
  };
}

function levelDisplayName(levelIndex = state.levelIndex) {
  return dayNames[levelIndex] || levels[levelIndex]?.name || `第${levelIndex + 1}关`;
}

function readRunHistory() {
  const history = readStoredJson(RUN_HISTORY_KEY, []);
  return Array.isArray(history) ? history : [];
}

function formatFinishedAt(value) {
  if (!value) return "刚刚";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "刚刚";
  return date.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function addPanelStat(container, label, value) {
  const item = document.createElement("div");
  const labelEl = document.createElement("span");
  const valueEl = document.createElement("strong");
  labelEl.textContent = label;
  valueEl.textContent = String(value);
  item.append(labelEl, valueEl);
  container.appendChild(item);
}

function showScoreSummaryPanel(settlement, options = {}) {
  if (!settlement || !scoreSummaryPanel || !scoreSummaryStats) return;
  const failed = Boolean(options.failed);
  scoreSummaryTitle.textContent = failed ? "疯狂挑战失败" : "关卡完成";
  scoreSummarySubtitle.textContent = `${playerProfile.nickname} · ${levelDisplayName()} · ${difficultyLabel()}`;
  if (scoreSummaryStorybookImage) {
    scoreSummaryStorybookImage.hidden = failed;
    setStorybookImage(scoreSummaryStorybookImage, failed ? STORYBOOK_FALLBACK_PAGE : state.storybookVictoryPage);
  }
  scoreSummaryStats.replaceChildren();
  addPanelStat(scoreSummaryStats, "昵称", playerProfile.nickname);
  addPanelStat(scoreSummaryStats, "当前关卡", levelDisplayName());
  addPanelStat(scoreSummaryStats, "当前难度", difficultyLabel());
  addPanelStat(scoreSummaryStats, "本局积分", settlement.runPoints);
  if (!failed) {
    addPanelStat(scoreSummaryStats, "完成关卡奖励", `+${settlement.completionBonus}`);
    addPanelStat(scoreSummaryStats, "剩余时间奖励", `+${settlement.timeBonus}`);
  }
  addPanelStat(scoreSummaryStats, "答对题数量", settlement.correctAnswers);
  addPanelStat(scoreSummaryStats, "答错题数量", settlement.wrongAnswers);
  addPanelStat(scoreSummaryStats, "碰撞障碍次数", settlement.obstacleHits);
  addPanelStat(scoreSummaryStats, "剩余时间", `${settlement.timeLeft}秒`);
  addPanelStat(scoreSummaryStats, "总积分", totalPoints);
  addPanelStat(scoreSummaryStats, "最高分", bestScore);
  if (scoreContinueBtn) scoreContinueBtn.hidden = failed;
  if (scoreRetryBtn) scoreRetryBtn.textContent = failed ? "重试本关" : "再玩一次";
  scoreSummaryPanel.hidden = false;
}

function closeScoreSummaryPanel() {
  if (scoreSummaryPanel) scoreSummaryPanel.hidden = true;
}

function replayCurrentLevel() {
  const levelIndex = state.levelIndex;
  closeScoreSummaryPanel();
  resetGame(levelIndex, levelIndex > 0);
  state.running = true;
  startBtn.textContent = text.restart;
  messageEl.textContent = text.move;
  startMusicForLevel();
}

function continueNextLevel() {
  closeScoreSummaryPanel();
  startGame();
}

function renderRunHistory() {
  if (!runHistorySummary || !runHistoryList) return;
  const history = readRunHistory();
  runHistorySummary.textContent = `${playerProfile.nickname} · 总积分 ${totalPoints} · 最高分 ${bestScore} · ${history.length} 条记录`;
  runHistoryList.replaceChildren();
  if (!history.length) {
    const empty = document.createElement("p");
    empty.className = "run-history-empty";
    empty.textContent = "还没有本地记录。";
    runHistoryList.appendChild(empty);
    return;
  }
  history.slice(0, 10).forEach((record) => {
    const item = document.createElement("article");
    item.className = "run-history-item";
    const title = document.createElement("strong");
    title.textContent = `${levelDisplayName(record.levelIndex)} · ${record.completed ? "完成" : "未完成"}`;
    const meta = document.createElement("p");
    const difficulty = DIFFICULTY_SETTINGS[record.difficulty]?.label || record.difficulty || "普通";
    meta.textContent = `${difficulty} · 本局 ${record.runPoints || 0} 分 · 时间奖励 ${record.timeBonus || 0} · 剩余 ${record.timeLeft || 0}秒`;
    const details = document.createElement("p");
    details.textContent = `答对 ${record.correctAnswers || 0} / 答错 ${record.wrongAnswers || 0} · 碰撞 ${record.obstacleHits || 0} · ${formatFinishedAt(record.finishedAt)}`;
    item.append(title, meta, details);
    runHistoryList.appendChild(item);
  });
}

function openRunHistory() {
  renderRunHistory();
  if (runHistoryPanel) runHistoryPanel.hidden = false;
}

function closeRunHistory() {
  if (runHistoryPanel) runHistoryPanel.hidden = true;
}

function clearLocalScoreRecords() {
  if (!window.confirm("确定清除本地积分和历史记录吗？昵称会保留。")) return;
  localStorage.removeItem(TOTAL_POINTS_KEY);
  localStorage.removeItem(BEST_SCORE_KEY);
  localStorage.removeItem(RUN_HISTORY_KEY);
  totalPoints = 0;
  bestScore = 0;
  updateHud();
  renderRunHistory();
}

function startGame() {
  gameEntered = true;
  storybookIntroSeen = true;
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
  } else if ((state.time <= 0 && difficultySettings().stopOnTimeout) || state.gameComplete) {
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
  if (!storybookIntroSeen) showStorybookIntroPage();
}

function initAudio() {
  if (!music.enabled) return;
  if (!music.audio) {
    music.audio = new Audio();
    music.audio.loop = true;
    music.audio.preload = "auto";
    music.audio.volume = 0.28;
    music.audio.addEventListener("error", () => {
      if (!music.key) return;
      music.audioFailed.add(music.key);
      startSynthMusicForKey(music.key);
    });
  }
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
  if (!state) return;
  startMusicForKey(musicKeyForLevel(state.levelIndex));
}

function startMusicForWorld(worldId) {
  const key = MUSIC_WORLD_ALIASES[worldId] || worldId;
  startMusicForKey(MUSIC_BY_WORLD[key] ? key : "forest_school");
}

function startMusicForKey(key) {
  if (!music.enabled) return;
  initAudio();
  if (!music.ctx) return;
  if (music.key === key && (music.timer || (music.audio && !music.audio.paused))) return;
  stopMusic();
  music.key = key;
  const src = MUSIC_BY_WORLD[key];
  if (src && music.audio && !music.audioFailed.has(key)) {
    music.audioSrc = src;
    music.audio.src = src;
    music.audio.currentTime = 0;
    const playResult = music.audio.play();
    if (playResult?.catch) playResult.catch(() => startSynthMusicForKey(key));
    return;
  }
  startSynthMusicForKey(key);
}

function startSynthMusicForKey(key) {
  if (!music.enabled || !music.ctx) return;
  if (music.audio) music.audio.pause();
  const pattern = MUSIC_PATTERN_BY_WORLD[key] || "happy";
  if (music.pattern === pattern && music.timer) return;
  if (music.timer) window.clearInterval(music.timer);
  music.pattern = pattern;
  music.step = 0;
  playMusicStep();
  music.timer = window.setInterval(playMusicStep, pattern === "boss" ? 240 : 310);
}

function stopMusic() {
  if (music.audio) music.audio.pause();
  if (music.timer) {
    window.clearInterval(music.timer);
    music.timer = null;
  }
  music.key = "";
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
  return MUSIC_PATTERN_BY_WORLD[musicKeyForLevel(levelIndex)] || "happy";
}

function musicKeyForLevel(levelIndex) {
  const level = levels[levelIndex];
  if (level?.tasks?.some((task) => task.kind === "boss" || task.kind === "moon_boss")) return "boss";
  return MUSIC_BY_WORLD[level?.world] ? level.world : "forest_school";
}

function playMusicStep() {
  if (!music.enabled || !music.ctx || !music.master) return;
  const now = music.ctx.currentTime;
  const pattern = music.pattern || "happy";
  const notes = {
    happy: [523, 659, 784, 659, 698, 784, 880, 784],
    moonlight: [392, 494, 587, 659, 587, 494, 440, 392],
    harvest: [523, 587, 659, 784, 659, 587, 523, 659],
    road: [440, 523, 587, 523, 659, 587, 523, 440],
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
  const requiredTasks = state.tasksList ? requiredTasksForCurrentLevel() : levels[state.levelIndex].tasks;
  const target = requiredTasks.length;
  const completed = requiredTasks.filter((task) => task.done).length;
  levelEl.textContent = dayNames[state.levelIndex] || `\u7b2c${state.levelIndex + 1}\u5929`;
  heartsEl.textContent = state.hearts;
  timeEl.textContent = Math.max(0, Math.ceil(state.time));
  if (difficultyEl) difficultyEl.textContent = difficultyLabel();
  if (pointsEl) pointsEl.textContent = `${state.runPoints} / 总分 ${totalPoints}`;
  tasksEl.textContent = `${completed}/${target}`;
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
    if (difficultySettings().stopOnTimeout && !["ready", "settled"].includes(state.mistQuest?.status)) {
      state.running = false;
      const settlement = settleLevelRun(false);
      startBtn.textContent = text.again;
      messageEl.textContent = "\u75af\u72c2\u96be\u5ea6\u6311\u6218\u5931\u8d25\uff0c\u518d\u8bd5\u4e00\u6b21\uff01";
      showScoreSummaryPanel(settlement, { failed: true });
    } else if (!state.timeExpiredNotified) {
      state.timeExpiredNotified = true;
      messageEl.textContent = "\u65f6\u95f4\u5230\u5566\uff0c\u8fd8\u53ef\u4ee5\u7ee7\u7eed\u5b8c\u6210\u4efb\u52a1\uff0c\u5956\u52b1\u4f1a\u5c11\u4e00\u70b9\u3002";
    }
    updateHud();
    if (!state.running) return;
  }

  updatePlayer(dt);
  updateAppleCart(dt);
  updateForestRoadMechanisms(dt);
  updateMistSwampMechanisms(dt);
  updateUnderwaterMechanisms(dt);
  updateMoonBoss();
  updateBossHazards(dt);
  updateProjectiles(dt);
  checkPuddles();
  checkObstacles();
  checkCollectibles();
  checkTasks(dt);
  updateMistQuestReadiness();

  const requiredTasks = requiredTasksForCurrentLevel();
  if (requiredTasks.length > 0 && canSettleCurrentLevel(requiredTasks)) {
    state.running = false;
    stopMusic();
    const settlement = settleLevelRun(true);
    state.levelClear = true;
    if (state.levelIndex === levels.length - 1) {
      state.gameComplete = true;
      startBtn.textContent = text.again;
      messageEl.textContent =
        levels[state.levelIndex]?.world === "moonlight_lake"
          ? "尼斯湖怪恢复平静了，月光湖安全啦！"
          : text.allDone;
    } else {
      startBtn.textContent = text.next;
      messageEl.textContent =
        levels[state.levelIndex]?.world === "moonlight_lake"
          ? `${dayNames[state.levelIndex] || `\u7b2c${state.levelIndex + 1}\u5929`}\u5b8c\u6210\uff01\u51c6\u5907\u53bb\u4e0b\u4e00\u4e2a\u6708\u5149\u6e56\u5730\u70b9\u3002`
          : `${dayNames[state.levelIndex] || `\u7b2c${state.levelIndex + 1}\u5929`}\u5b8c\u6210\uff01\u51c6\u5907\u53bb\u4e0b\u4e00\u4e2a\u68ee\u6797\u89d2\u843d\u3002`;
    }
    if (settlement) {
      messageEl.textContent = `完成关卡 +${settlement.completionBonus}，剩余时间奖励 +${settlement.timeBonus}，本局积分 +${settlement.runPoints}！`;
      showScoreSummaryPanel(settlement);
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

function updateUnderwaterMechanisms(dt) {
  const p = state.player;
  const now = performance.now();
  const lifting = now < state.bubbleLiftUntil && state.activeBubbleLift;
  if (lifting) {
    const lift = state.activeBubbleLift;
    const liftSpeed = Math.max(90, Math.abs(lift.vy || -110) * 0.78);
    p.x = clamp(p.x + (lift.x - p.x) * 3 * dt, 58, canvas.width - 58);
    p.y = clamp(p.y - liftSpeed * dt, 92, canvas.height - 58);
    p.vy = Math.min(p.vy, -liftSpeed * 0.35);
  }

  for (const obstacle of state.obstacles) {
    if (obstacle.type === "bubbleLift") {
      if (distance(p, obstacle) >= obstacle.r + 55) continue;
      if (now >= state.bubbleLiftCooldownUntil && now >= state.bubbleLiftUntil) {
        state.activeBubbleLift = obstacle;
        state.bubbleLiftUntil = now + 1000;
        state.bubbleLiftCooldownUntil = now + 1800;
        burst(p.x, p.y, "#c9f7ff", 12);
        addFloatingText(p.x, p.y - 42, "泡泡升降", "#2f9dcc");
        messageEl.textContent = "\u6ce1\u6ce1\u6258\u8d77\u4f60\u5566\uff01";
      }
      continue;
    }
    if (distance(p, obstacle) >= obstacle.r + 24) continue;
    if (lifting && (obstacle.type === "current" || obstacle.type === "whirlpool")) continue;
    if (obstacle.type === "current") {
      p.x = clamp(p.x + (obstacle.vx || 70) * dt, 58, canvas.width - 58);
      p.y = clamp(p.y + (obstacle.vy || 0) * dt, 92, canvas.height - 58);
      if (now > state.puddleCooldownUntil) {
        state.puddleCooldownUntil = now + 520;
        addFloatingText(p.x, p.y - 42, "水流", "#5bc4e6");
        messageEl.textContent = "月光水流轻轻推着你前进。";
      }
    } else if (obstacle.type === "whirlpool" && !obstacle.closed) {
      state.slowUntil = now + 700;
      if (now > state.puddleCooldownUntil) {
        state.puddleCooldownUntil = now + 780;
        state.shake = 0.06;
        addFloatingText(p.x, p.y - 42, "漩涡", "#4d7bbf");
        messageEl.textContent = "漩涡让脚步慢了下来。";
      }
    }
  }
}

function updateMoonBoss() {
  const boss = state.tasksList.find((task) => task.kind === "moon_boss" && !task.done);
  if (!boss) return;
  const p = state.player;
  if (boss.phase === 1) {
    const pillar = state.obstacles.find((entry) => entry.type === "moonPillar" && entry.bossPart === "pillar" && !entry.lit && distance(p, entry) < entry.r + 30);
    if (pillar) {
      pillar.lit = true;
      boss.phaseProgress += 1;
      burst(pillar.x, pillar.y, "#dff6ff", 18);
      addFloatingText(pillar.x, pillar.y - 42, `${boss.phaseProgress}/3 石柱`, "#dff6ff");
      messageEl.textContent = "一根月光石柱亮起来了。";
      if (boss.phaseProgress >= 3) {
        boss.phase = 2;
        boss.phaseProgress = 0;
        messageEl.textContent = "第二步：收集 3 个珍珠能量球，放到漩涡旁。";
      }
    }
  } else if (boss.phase === 2) {
    const whirlpool = state.obstacles.find((entry) => entry.type === "whirlpool" && entry.bossPart === "whirlpool" && !entry.closed);
    const pearlCount = state.inventory.filter((type) => type === "pearlOrb").length;
    if (whirlpool && pearlCount >= 3 && distance(p, whirlpool) < whirlpool.r + 34) {
      consumeNeeds(["pearlOrb", "pearlOrb", "pearlOrb"]);
      whirlpool.closed = true;
      boss.phase = 3;
      burst(whirlpool.x, whirlpool.y, "#fff7df", 28);
      messageEl.textContent = "第三步：靠近黑暗泡泡，点击攻击把它们清除。";
    }
  } else if (boss.phase === 3 && state.darkBubbles.every((bubble) => bubble.broken)) {
    completeTask(boss, boss.x, boss.y);
    state.inventory.push("moonPearlBadge");
    burst(boss.x, boss.y, "#dff6ff", 44);
    messageEl.textContent = "尼斯湖怪恢复平静了，月光湖安全啦！";
  }
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
  state.nearbyAppleTree = null;
  for (const obstacle of state.obstacles) {
    const hit = distance(p, obstacle) < obstacle.r + 21;
    if (obstacle.type === "appleTree") {
      if (hit) {
        state.nearbyAppleTree = obstacle;
        messageEl.textContent = obstacle.shaken ? "这棵苹果树已经摇过啦。" : "按对话键摇一摇苹果树";
      }
      continue;
    }
    if (!hit || now < state.puddleCooldownUntil) continue;
    if (obstacle.type === "bush") {
      state.obstacleHits += 1;
      state.slowUntil = now + 520;
      state.puddleCooldownUntil = now + 720;
      const penalty = applyTimePenalty("obstacle", p.x, p.y);
      addFloatingText(p.x, p.y - 42, "\u704c\u6728\u6321\u8def", "#4f8b38");
      messageEl.textContent = penalty
        ? `\u704c\u6728\u6709\u70b9\u5bc6\uff0c\u6263\u9664 ${penalty} \u79d2\u3002`
        : "\u704c\u6728\u6709\u70b9\u5bc6\uff0c\u6162\u6162\u7a7f\u8fc7\u53bb\u3002";
    } else if (obstacle.type === "pit") {
      state.obstacleHits += 1;
      state.slowUntil = now + 850;
      state.puddleCooldownUntil = now + 980;
      state.shake = 0.08;
      const penalty = applyTimePenalty("obstacle", p.x, p.y);
      addFloatingText(p.x, p.y - 42, "\u5c0f\u5fc3\u571f\u5751", "#8b5b2b");
      messageEl.textContent = penalty
        ? `\u5dee\u70b9\u6389\u8fdb\u571f\u5751\uff0c\u6263\u9664 ${penalty} \u79d2\u3002`
        : "\u5dee\u70b9\u6389\u8fdb\u571f\u5751\uff0c\u5148\u7a33\u4e00\u7a33\u3002";
    } else if (obstacle.type === "pond") {
      state.obstacleHits += 1;
      state.slowUntil = now + 700;
      state.puddleCooldownUntil = now + 900;
      const penalty = applyTimePenalty("obstacle", p.x, p.y);
      burst(p.x, p.y, "#69a9d7", 4);
      addFloatingText(p.x, p.y - 42, "\u7ed5\u5f00\u6c34\u5858", "#277faf");
      messageEl.textContent = penalty
        ? `\u524d\u9762\u662f\u6c34\u5858\uff0c\u6263\u9664 ${penalty} \u79d2\u3002`
        : "\u524d\u9762\u662f\u6c34\u5858\uff0c\u8d70\u8fb9\u4e0a\u66f4\u5b89\u5168\u3002";
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

function shakeAppleTree(tree) {
  if (!tree || tree.type !== "appleTree" || tree.shaken) return false;
  tree.shaken = true;
  const drops = tree.drops || [];
  drops.forEach((type, index) => {
    const angle = -0.9 + index * 0.9;
    const radius = 34 + (index % 2) * 18;
    state.collectibles.push(
      item(
        clamp(tree.x + Math.cos(angle) * radius, 36, canvas.width - 36),
        clamp(tree.y + 78 + Math.sin(angle) * 18, 70, canvas.height - 40),
        type,
        itemLabel(type)
      )
    );
  });
  addRunPoints(3, tree.x, tree.y, "+3 丰收");
  burst(tree.x, tree.y + 12, "#ffd94a", 18);
  addFloatingText(tree.x, tree.y - 70, "苹果掉下来啦！", "#e84b3f");
  if (drops.length >= 3) addFloatingText(tree.x, tree.y - 96, "丰收连击！", "#f2ad31");
  messageEl.textContent = "苹果掉下来啦！";
  return true;
}

function updateAppleCart(dt) {
  const cart = state?.escortCart;
  if (!cart || !cart.active) return;
  const p = state.player;
  const targetX = p.x - 46 * p.dir;
  const targetY = p.y + 20;
  const follow = clamp(dt * 4, 0, 1);
  cart.x += (targetX - cart.x) * follow;
  cart.y += (targetY - cart.y) * follow;
}

function updateForestRoadMechanisms(dt) {
  if (levels[state.levelIndex]?.world !== "forest_road") return;
  updateTrafficLights(dt);
  updateEscortNpcs(dt);
  checkCrossingZones();
  checkExitAreas();
}

function updateMistSwampMechanisms(dt) {
  if (!isMistSwampLevel()) return;
  const now = performance.now();
  if (state.mistPermanentClear) state.mistOpacity = Math.max(0.06, state.mistOpacity - dt * 0.45);
  else if (hasActiveMistLamp()) state.mistOpacity = Math.max(0.08, state.mistOpacity - dt * 0.45);
  else state.mistOpacity = Math.min(0.32, state.mistOpacity + dt * 0.035);

  if (!mistQuestAllowsProgress()) return;

  const trailTask = state.tasksList.find((task) => task.kind === "firefly_trail" && !task.done);
  if (trailTask) {
    for (const point of state.fireflyTrail.filter((entry) => entry.decoy && !entry.faded)) {
      if (distance(state.player, point) < 36) {
        point.faded = true;
        if (selectedDifficulty !== "easy") {
          state.fireflyTrailIndex = Math.max(0, state.fireflyTrailIndex - 1);
          state.mistOpacity = Math.min(0.42, state.mistOpacity + 0.08);
        }
        messageEl.textContent = "这不是正确路线，再观察一下吧。这是一小段假光，找温暖的金色光点。";
      }
    }
    const correct = state.fireflyTrail.filter((entry) => !entry.decoy);
    const nextPoint = correct[state.fireflyTrailIndex];
    if (nextPoint && distance(state.player, nextPoint) < 42) {
      state.fireflyTrailIndex += 1;
      burst(nextPoint.x, nextPoint.y, "#ffe26a", 12);
    }
    if (state.fireflyTrailIndex >= correct.length) {
      if (missingNeeds(trailTask.need).length) messageEl.textContent = "再沿着光点找齐发光孢子和木桥钥匙吧。";
      else {
        consumeNeeds(trailTask.need);
        const trailEnd = correct[correct.length - 1];
        completeTask(trailTask, trailEnd.x, trailEnd.y);
      }
    }
  }

  if (isMistSwampSleepingBridgeLevel()) {
    const bridge = state.tasksList.find((task) => task.kind === "broken_bridge");
    if (bridge?.done) updateEscortNpcs(dt);
  }

  const mudBoss = state.tasksList.find((task) => task.kind === "mud_boss" && !task.done);
  state.nearbyMudBubble = null;
  if (mudBoss?.phase === 1) {
    const lamps = state.tasksList.filter((task) => task.kind === "mist_lamp");
    if (lamps.length === 3 && lamps.every((task) => isMistLampActive(task, now))) {
      mudBoss.phase = 2;
      activateNextMudBubbleWave();
      messageEl.textContent = "黑雾变淡了，泥浆怪露出了泥浆泡泡！";
    }
  } else if (mudBoss?.phase === 2) {
    for (const bubble of state.mudBubbles) {
      bubble.phase += dt * (selectedDifficulty === "crazy" ? 1.8 : 1.1);
      if (bubble.active && !bubble.done && distance(state.player, bubble) < bubble.r + 48) state.nearbyMudBubble = bubble;
    }
    if (state.mudBubbles.every((bubble) => bubble.done)) {
      mudBoss.phase = 3;
      messageEl.textContent = "第二步完成：带着萤火虫灯笼靠近泥浆核心。";
    } else if (!state.mudBubbles.some((bubble) => bubble.active && !bubble.done)) {
      activateNextMudBubbleWave();
    }
  } else if (mudBoss?.phase === 3) {
    const nearBoss = distance(state.player, mudBoss) < 86;
    if (nearBoss && state.inventory.includes("fireflyLantern")) {
      state.lanternCharge = Math.min(state.lanternChargeRequired, state.lanternCharge + dt);
      mudBoss.chargeReady = state.lanternCharge >= state.lanternChargeRequired;
      if (!mudBoss.chargeReady) messageEl.textContent = `萤火虫灯笼充能中：${Math.ceil(state.lanternChargeRequired - state.lanternCharge)}秒`;
      else messageEl.textContent = "灯笼充满光啦，按 E 开始最终答题。";
    } else if (!mudBoss.chargeReady) {
      state.lanternCharge = Math.max(0, state.lanternCharge - dt * 0.5);
    }
  }

  for (const mud of state.obstacles.filter((entry) => entry.type === "softMud")) {
    if (distance(state.player, mud) < mud.r + (selectedDifficulty === "hard" || selectedDifficulty === "crazy" ? 28 : 18)) {
      state.slowUntil = now + 160;
    }
  }
}

function activateNextMudBubbleWave() {
  if (!isMistSwampLevel()) return;
  const waveSize = MUD_BUBBLE_WAVE_SIZE_BY_DIFFICULTY[selectedDifficulty] || 1;
  state.mudBubbles.filter((bubble) => !bubble.done && !bubble.active).slice(0, waveSize).forEach((bubble) => {
    bubble.active = true;
  });
}

function updateTrafficLights(dt) {
  for (const light of state.trafficLights || []) {
    light.timer = (light.timer || 0) + dt;
    if (light.timer < 2) continue;
    light.timer = 0;
    light.state = light.state === "red" ? "green" : "red";
    addFloatingText(light.x, light.y - 48, light.state === "green" ? "绿灯" : "红灯", light.state === "green" ? "#3f8a2f" : "#e84b3f");
  }
}

function updateEscortNpcs(dt) {
  const p = state.player;
  for (const task of state.tasksList) {
    if (task.kind !== "escort_npc" || task.done) continue;
    if (!task.following && distance(p, task) < 62) {
      task.following = true;
      burst(task.x, task.y, "#ffd94a", 14);
      addFloatingText(task.x, task.y - 46, "小伙伴跟上来啦！", "#3f8a2f");
      messageEl.textContent = "小伙伴跟上来啦！";
    }
    if (!task.following) continue;
    const targetX = p.x - 54 * p.dir;
    const targetY = p.y + 10;
    const gap = distance(task, p);
    const follow = gap > 180 ? 1 : clamp(dt * 3.4, 0, 1);
    task.x += (targetX - task.x) * follow;
    task.y += (targetY - task.y) * follow;
    const safeZone = state.safeZones.find((zone) => zone.id === task.safeZoneId);
    if (safeZone && distance(task, safeZone) < safeZone.r + 24) {
      completeTask(task, safeZone.x, safeZone.y);
      messageEl.textContent = "到安全区啦！";
    }
  }
}

function checkCrossingZones() {
  const now = performance.now();
  if (now < state.puddleCooldownUntil) return;
  for (const zone of state.crossingZones || []) {
    if (!pointInRect(state.player, zone)) continue;
    const light = state.trafficLights?.[zone.lightIndex || 0];
    state.puddleCooldownUntil = now + 820;
    if (light?.state === "red") {
      addFloatingText(state.player.x, state.player.y - 42, "红灯", "#e84b3f");
      messageEl.textContent = "先等等，绿灯再走哦！";
    } else {
      addFloatingText(state.player.x, state.player.y - 42, "绿灯", "#3f8a2f");
      messageEl.textContent = "可以安全通过啦！";
    }
    state.priorityMessage = messageEl.textContent;
    state.priorityMessageUntil = now + 900;
    return;
  }
}

function checkExitAreas() {
  const now = performance.now();
  if (now < state.puddleCooldownUntil) return;
  for (const area of state.exitAreas || []) {
    if (distance(state.player, area) >= area.r + 16) continue;
    state.puddleCooldownUntil = now + 920;
    addFloatingText(area.x, area.y - 44, "再看看路牌", "#8b5b2b");
    messageEl.textContent = "这里好像不是去橡果镇的路。";
    return;
  }
}

function canUseEscortCart() {
  return Boolean(state?.escortCart?.active);
}

function updateBossHazards(dt) {
  if (!state.running || state.activeQuiz) return;
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
  if (!state.running || state.activeQuiz || state.activeDialogue) return;
  if (breakNearbyDarkBubble()) return;
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

function breakNearbyDarkBubble() {
  const boss = state.tasksList.find((task) => task.kind === "moon_boss" && task.phase === 3 && !task.done);
  if (!boss) return false;
  const now = performance.now();
  if (now < state.attackCooldownUntil) return true;
  const p = state.player;
  const bubble = state.darkBubbles.find((entry) => !entry.broken && distance(p, entry) < entry.r + 54);
  if (!bubble) {
    messageEl.textContent = "再靠近黑暗泡泡一点，然后点击攻击。";
    return true;
  }
  bubble.broken = true;
  state.attackCooldownUntil = now + 420;
  burst(bubble.x, bubble.y, "#a77cff", 24);
  addFloatingText(bubble.x, bubble.y - 36, "泡泡清除", "#d9c8ff");
  messageEl.textContent = "黑暗泡泡散开了，月光回来了。";
  return true;
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
        state.time = Math.min(state.levelTime + 8, state.time + 3);
      } else {
        state.inventory.push(entry.type);
        state.hearts += 1;
      }
      addRunPoints(1, entry.x, entry.y, "+1 积分");
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
  let nearestPriority = -1;
  for (const task of state.tasksList) {
    if (isMistSwampLevel() && task.kind === "mud_bubble" && (!task.active || task.done)) continue;
    const near = distance(p, task) < 58;
    if (near) {
      const dist = distance(p, task);
      const priority = sleepingBridgeNearbyPriority(task);
      if (priority > nearestPriority || (priority === nearestPriority && dist < nearestDistance)) {
        nearestPriority = priority;
        nearestDistance = dist;
        state.nearbyTask = task;
      }
    }
    const activeQuestMechanic = state.mistQuest?.status === "active" && ["mist_core", "mud_boss"].includes(task.kind);
    if (near && isMistQuestNpc(task) && !activeQuestMechanic) {
      const marker = state.mistQuest.status === "locked" ? "接任务" : state.mistQuest.status === "ready" ? "交任务" : "查看任务";
      messageEl.textContent = `按 E 和${task.name}对话（${marker}）。`;
      continue;
    }
    if (near && !mistQuestAllowsProgress()) {
      messageEl.textContent = `先去找${mistQuestNpcTask()?.name || "任务伙伴"}接任务。`;
      continue;
    }
    if (task.done) continue;
    if (!near) {
      task.progress = Math.max(0, task.progress - dt * 0.8);
      continue;
    }

    if (task.kind === "delivery" || task.kind === "sort_basket") {
      const missing = missingNeeds(task.need);
      if (task.kind === "sort_basket") {
        messageEl.textContent = missing.length ? `${task.name}\u9700\u8981\uff1a${needLabels(missing)}\u54e6\u3002` : `\u6309 E \u628a\u82f9\u679c\u653e\u8fdb${task.name}\u3002`;
      } else if (task.animal === "owlPrincipal" && !canUseEscortCart()) {
        messageEl.textContent = "先把礼物果篮放上小推车，再护送到校长这里。";
      } else {
        messageEl.textContent = missing.length
          ? `${task.name}\u9700\u8981\uff1a${needLabels(missing)}\u3002\u6309 E \u5bf9\u8bdd\u3002`
          : `${task.name}\u6b63\u7b49\u7740\u4f60\u3002\u6309 E \u5bf9\u8bdd\u540e\u4ea4\u7ed9TA\u3002`;
      }
      continue;
    }

    if (task.kind === "quiz") {
      messageEl.textContent = taskNearHint(task);
      continue;
    }

    if (isMistSwampLevel() && ["mist_lamp", "mushroom_lamp", "broken_bridge", "mist_bubble", "mud_bubble", "mist_core", "mud_boss", "firefly_trail"].includes(task.kind)) {
      if (task.kind === "firefly_trail") messageEl.textContent = "跟着萤火虫走吧！";
      else if (task.kind === "mud_bubble") messageEl.textContent = "按 E 清除泥浆泡泡。";
      else if (task.kind === "mud_boss") messageEl.textContent = task.phase === 3 ? "带着萤火虫灯笼，按 E 净化泥浆核心。" : task.speech;
      else messageEl.textContent = "按 E 互动";
      continue;
    }

    if (task.kind === "road_clear") {
      task.progress += dt / (task.duration || 1);
      messageEl.textContent = task.speech || "正在清理道路……";
      if (task.progress >= 1) {
        completeTask(task, task.x, task.y);
        messageEl.textContent = "道路变干净啦！";
      }
      continue;
    }

    if (task.kind === "direction_sign") {
      messageEl.textContent = missingNeeds(task.need).length ? "先找到路牌碎片。" : "按 E 修好路牌。";
      continue;
    }

    if (task.kind === "exit_area") {
      messageEl.textContent = "这条路通向橡果镇，走近一点就可以通过。";
      completeTask(task, task.x, task.y);
      continue;
    }

    if (task.kind === "escort_npc") {
      const bridgeReady = !isMistSwampSleepingBridgeLevel() || state.tasksList.some((entry) => entry.kind === "broken_bridge" && entry.done);
      messageEl.textContent = !bridgeReady
        ? "先修好木桥，小青蛙就会跟上来。"
        : task.following ? "小青蛙正在跟着你，带它去木桥出口。" : "靠近小青蛙，它会自动跟上来。";
      continue;
    }

    if (task.kind === "boss") {
      messageEl.textContent = firstBossWeapon()
        ? "\u6309 E \u542c\u63d0\u793a\uff0c\u518d\u6309\u7a7a\u683c\u6216\u70b9\u201c\u653b\u51fb\u201d\uff01"
        : "\u6309 E \u542c\u63d0\u793a\uff0c\u5148\u6536\u96c6\u52c7\u6c14\u661f\u3001\u9b54\u6cd5\u7b14\u6216\u5b88\u62a4\u4e66\uff01";
      continue;
    }

    if (task.kind === "moon_boss") {
      const hints = {
        1: "第一步：点亮 3 根月光石柱。",
        2: "第二步：收集 3 个珍珠能量球，放到漩涡旁。",
        3: "第三步：靠近黑暗泡泡，点击攻击把它们清除。",
      };
      messageEl.textContent = hints[task.phase] || task.speech;
      continue;
    }

    if (task.animal === "appleCartStation" && !state.inventory.includes("giftAppleBasket")) {
      messageEl.textContent = "\u5148\u62ff\u5230\u793c\u7269\u679c\u7bee\uff0c\u518d\u6765\u63a8\u5c0f\u8f66\u3002";
      continue;
    }

    task.progress += dt;
    messageEl.textContent = task.speech;
    if (task.progress >= 1.65) {
      completeTask(task, task.x, task.y);
    }
  }
  if (state.nearbyTask?.done && state.nearbyTask.kind === "direction_sign") {
    messageEl.textContent = state.nearbyTask.directions?.join("  ") || "→ 橡果镇";
  } else if (state.nearbyTask?.done && state.nearbyTask.kind === "road_clear") {
    messageEl.textContent = "\u9053\u8def\u53d8\u5e72\u51c0\u5566\uff01";
  } else if (isMistSwampSleepingBridgeLevel() && state.nearbyTask?.done && state.nearbyTask.kind === "broken_bridge") {
    messageEl.textContent = "木桥已经修好啦，可以安全通过了！";
  } else if (state.nearbyTask?.done) {
    messageEl.textContent = `${state.nearbyTask.name}\u5df2\u7ecf\u5f88\u5f00\u5fc3\u5566\u3002\u6309 E \u518d\u804a\u804a\u3002`;
  }
  if (state.priorityMessage && performance.now() < state.priorityMessageUntil) {
    messageEl.textContent = state.priorityMessage;
  } else if (state.priorityMessage) {
    state.priorityMessage = "";
  }
}

function grantTaskReward(task, x = task.x, y = task.y) {
  if (!task.reward || task.rewardGranted) return false;
  state.inventory.push(task.reward);
  task.rewardGranted = true;
  addFloatingText(x, y - 82, `+ ${itemLabel(task.reward)}`, "#f2ad31");
  return true;
}

function completeTask(task, x, y) {
  task.done = true;
  task.progress = 1;
  state.tasks += 1;
  state.hearts += 3;
  state.time = Math.min(state.levelTime + 8, state.time + 5);
  if (task.kind === "sort_basket") addRunPoints(10, x, y, "+10 sort");
  if (task.reward) {
    if (isMistQuestNpc(task) && state.mistQuest.status !== "settled") state.mistQuest.pendingReward = task.reward;
    else grantTaskReward(task, x, y);
  }
  if (task.animal === "appleCartStation" && state.escortCart) {
    state.escortCart.active = true;
    addFloatingText(x, y - 74, "\u5c0f\u63a8\u8f66\u51fa\u53d1\u5566\uff01", "#f2ad31");
    messageEl.textContent = "\u5c0f\u63a8\u8f66\u51fa\u53d1\u5566\uff01";
  }
  if (task.kind === "delivery" || task.kind === "action" || task.kind === "road_clear" || task.kind === "direction_sign" || task.kind === "exit_area" || task.kind === "escort_npc") {
    addRunPoints(10, x, y, "+10 积分");
  }
  burst(x, y, "#f46a5c", 18);
  addFloatingText(x, y - 54, "\u5e2e\u5fd9\u6210\u529f +3", "#e84b3f");
  messageEl.textContent = `${task.name}\u5f00\u5fc3\u5566\uff0c\u7231\u5fc3 +3\uff0c\u65f6\u95f4 +5\u3002`;
  if (task.kind === "road_clear") messageEl.textContent = "道路变干净啦！";
  if (task.kind === "direction_sign") messageEl.textContent = task.directions?.join("  ") || "→ 橡果镇";
  if (task.kind === "exit_area") messageEl.textContent = "找到去橡果镇的正确道路啦！";
  if (task.kind === "escort_npc") messageEl.textContent = "到安全区啦！";
  if (task.kind === "sort_basket") messageEl.textContent = sortBasketCompleteMessage(task);
  if (task.animal === "owlPrincipal") messageEl.textContent = "\u732b\u5934\u9e70\u6821\u957f\u6536\u5230\u4e86\u4e30\u6536\u793c\u7269\uff01";
  if (task.animal === "appleCartStation") messageEl.textContent = "\u5c0f\u63a8\u8f66\u51fa\u53d1\u5566\uff01";
}

function sortBasketCompleteMessage(task) {
  if (task.animal === "redBasket") return "\u7ea2\u82f9\u679c\u5206\u7c7b\u5b8c\u6210\uff01";
  if (task.animal === "greenBasket") return "\u7eff\u82f9\u679c\u5206\u7c7b\u5b8c\u6210\uff01";
  if (task.animal === "giftBasket") return "\u793c\u7269\u679c\u7bee\u51c6\u5907\u597d\u4e86\uff01";
  return `${task.name}\u5206\u7c7b\u5b8c\u6210\uff01`;
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
    redApple: "红苹果",
    greenApple: "青苹果",
    goldenApple: "金苹果",
    appleBasket: "果篮",
    giftAppleBasket: "礼物果篮",
    appleCart: "苹果小推车",
    harvestBadge: "丰收徽章",
    autumnLeaf: "秋叶",
    signPiece: "路牌碎片",
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
    moonLamp: "月光灯",
    boatPaddle: "小船桨",
    bubbleStone: "发光水泡石",
    divingHelmet: "泡泡潜水帽",
    moonKey: "月光钥匙",
    shellBadge: "贝壳徽章",
    pearlOrb: "珍珠能量球",
    coralKey: "珊瑚钥匙",
    jellyfishCore: "水母灯芯",
    seaweedScissors: "海草剪刀",
    deepRune: "深海符文",
    spiralShell: "螺旋贝壳",
    aquaGem: "海蓝宝石",
    pearlCrown: "深海珍珠王冠",
    moonPearlBadge: "月光珍珠徽章",
    fireflyCore: "萤火虫灯芯",
    mistLamp: "雾灯",
    glowSpore: "发光孢子",
    bridgePlank: "木桥板",
    bridgeKey: "木桥钥匙",
    mushroomLamp: "蘑菇灯",
    lightSpore: "光之孢子",
    mistBadge: "迷雾徽章",
    fireflyLantern: "萤火虫灯笼",
    darkMistBubble: "黑雾泡泡",
    mudBubble: "泥浆泡泡",
    mudCore: "泥浆核心",
    bigMistLamp: "大雾灯",
    mistGuardianBadge: "迷雾守护徽章",
  }[type] || type;
}

function quizDisplay(taskOrKind) {
  const key = typeof taskOrKind === "string" ? taskOrKind : taskOrKind?.quizKey || taskOrKind?.animal;
  return QUIZ_DISPLAY[key] || null;
}

function taskShortHint(task) {
  if (task.done) return "\u5b8c\u6210";
  if (task.kind === "quiz") return quizDisplay(task)?.short || task.speech;
  if (task.kind === "sort_basket") return "\u5206\u7c7b";
  if (task.kind === "road_clear") return task.progress > 0 ? "\u6e05\u7406\u4e2d" : "\u6e05\u7406";
  if (task.kind === "direction_sign") return missingNeeds(task.need).length ? "\u627e\u788e\u7247" : "\u4fee\u8def\u724c";
  if (task.kind === "exit_area") return "\u6b63\u786e\u51fa\u53e3";
  if (task.kind === "escort_npc") return task.following ? "\u53bb\u5b89\u5168\u533a" : "\u9760\u8fd1";
  if (task.kind === "delivery") return missingNeeds(task.need).length ? "\u5bf9\u8bdd" : "\u4ea4\u7ed9TA";
  if (task.kind === "boss") return "Boss";
  return "\u5e2e\u5fd9";
}

function taskNearHint(task) {
  if (task.done && task.kind === "direction_sign") return task.directions?.join("  ") || "→ 橡果镇";
  if (task.done && task.kind === "road_clear") return "\u9053\u8def\u53d8\u5e72\u51c0\u5566\uff01";
  if (task.done) return `${task.name}\u5df2\u5b8c\u6210\u3002\u6309 E \u518d\u804a\u804a\u3002`;
  if (task.kind === "quiz") return quizDisplay(task)?.near || "\u6309 E \u6311\u6218";
  if (task.kind === "sort_basket") {
    const missing = missingNeeds(task.need);
    return missing.length ? `${task.name}\u9700\u8981\uff1a${needLabels(missing)}\u54e6\u3002` : `\u6309 E \u653e\u8fdb${task.name}`;
  }
  if (task.kind === "delivery") {
    const missing = missingNeeds(task.need);
    if (task.animal === "owlPrincipal" && !canUseEscortCart()) return "\u5148\u8ba9\u5c0f\u63a8\u8f66\u8ddf\u7740\u4f60\u51fa\u53d1\u3002";
    return missing.length ? `${task.name}\u9700\u8981\uff1a${needLabels(missing)}\u3002\u6309 E \u5bf9\u8bdd\u3002` : "\u6309 E \u4ea4\u7ed9TA";
  }
  if (task.kind === "boss") return firstBossWeapon() ? "\u6309 E \u542c\u63d0\u793a\uff0c\u518d\u653b\u51fb\u3002" : "\u6309 E \u542c\u63d0\u793a\u3002";
  if (task.kind === "road_clear") return task.speech || "\u6b63\u5728\u6e05\u7406\u9053\u8def\u2026\u2026";
  if (task.kind === "direction_sign") return missingNeeds(task.need).length ? "\u5148\u627e\u8def\u724c\u788e\u7247" : "\u6309 E \u4fee\u8def\u724c";
  if (task.kind === "exit_area") return "\u6b63\u786e\u51fa\u53e3";
  if (task.kind === "escort_npc") return task.following ? "\u53bb\u5b89\u5168\u533a" : "\u9760\u8fd1\u5c0f\u4f19\u4f34";
  return "\u6309 E \u5bf9\u8bdd";
}

function shouldShowTaskHint(task) {
  return state.nearbyTask === task || state.activeDialogue?.task === task || ((task.kind === "action" || task.kind === "road_clear") && task.progress > 0.08);
}

function taskDialogueMode(task) {
  if (isMistQuestNpc(task)) {
    return {
      locked: "quest_intro",
      active: "quest_active",
      ready: "quest_ready",
      settled: "quest_after",
    }[state.mistQuest.status];
  }
  if (task.done) return "after";
  if (task.animal === "owlPrincipal" && !canUseEscortCart()) return "missing";
  if (task.kind === "delivery") return missingNeeds(task.need).length ? (task.dialogueSeen ? "missing" : "intro") : "ready";
  if (task.kind === "sort_basket") return missingNeeds(task.need).length ? (task.dialogueSeen ? "missing" : "intro") : "ready";
  if (task.kind === "quiz") return task.dialogueSeen ? "ready" : "intro";
  if (task.kind === "boss") return firstBossWeapon() ? "ready" : "missing";
  if (task.kind === "moon_boss") return "intro";
  return task.dialogueSeen ? "ready" : "intro";
}

function taskDialogueLines(task, mode) {
  if (isMistQuestNpc(task)) {
    const quest = levels[state.levelIndex].mistQuest;
    if (mode === "quest_intro") return quest.introLines;
    if (mode === "quest_active") return [quest.activeHint];
    if (mode === "quest_ready") return quest.completeLines;
    if (mode === "quest_after") return ["谢谢你，继续开心探索吧！"];
  }
  const library = task.dialogue || DIALOGUE_LIBRARY[task.animal] || {};
  if (library[mode]?.length) return library[mode];
  if (mode === "intro" && task.kind === "quiz") return [quizDisplay(task)?.dialogue || task.speech];
  if (mode === "intro") return [`${task.name}\uff1a${task.speech}`];
  if (mode === "missing" && task.animal === "owlPrincipal" && !canUseEscortCart()) return ["\u5148\u8ba9\u5c0f\u63a8\u8f66\u8ddf\u7740\u4f60\u51fa\u53d1\u3002"];
  if (mode === "missing" && task.need) return [`\u6211\u8fd8\u9700\u8981\uff1a${needLabels(missingNeeds(task.need))}\u3002`];
  if (mode === "ready" && task.kind === "sort_basket") return [`\u627e\u5230${needLabels(task.need)}\u4e86\uff0c\u653e\u8fdb\u6765\u5427\uff01`];
  if (mode === "ready" && task.kind === "delivery") return [`\u4f60\u5df2\u7ecf\u627e\u5230${needLabels(task.need)}\u5566\uff01`];
  if (mode === "ready" && task.kind === "quiz") return ["\u51c6\u5907\u597d\u4e86\u5417\uff1f\u6211\u4eec\u6765\u6311\u6218\u4e00\u9898\u5427\u3002"];
  if (mode === "complete") return ["\u8c22\u8c22\u4f60\uff01\u4efb\u52a1\u5b8c\u6210\u5566\u3002"];
  if (mode === "after") return ["\u8c22\u8c22\u4f60\uff0c\u4eca\u5929\u4e5f\u8981\u5f00\u5fc3\u5192\u9669\u54e6\uff01"];
  return [task.speech || "\u4f60\u597d\u5440\uff01"];
}

function dialogueRoleLabel(task) {
  if (task.kind === "delivery") return "\u9700\u8981\u5e2e\u5fd9";
  if (task.kind === "sort_basket") return "\u82f9\u679c\u5206\u7c7b";
  if (task.kind === "quiz") return "\u9898\u76ee\u6311\u6218";
  if (task.kind === "boss") return "Boss \u63d0\u793a";
  if (task.kind === "moon_boss") return "月光湖 Boss";
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
    coco: "C",
    nono: "N",
    birdPostman: "鸟",
    moleFarmer: "鼹",
    owlPrincipal: "校",
    otter: "O",
    frog: "F",
    seaTurtle: "T",
    jellyfish: "J",
    octopus: "8",
    nessie: "N",
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
  dialogueNextBtn.textContent = "下一句";
  dialogueGiveBtn.textContent = "交给TA";
  const questIntroDone = dialogue.mode === "quest_intro" && !hasNext;
  dialogueNextBtn.hidden = !hasNext && !questIntroDone;
  if (questIntroDone) dialogueNextBtn.textContent = "接受任务";
  const questReady = dialogue.mode === "quest_ready";
  dialogueGiveBtn.hidden = !(questReady || ((task.kind === "delivery" || task.kind === "sort_basket") && dialogue.mode === "ready" && !task.done));
  if (questReady) dialogueGiveBtn.textContent = "完成任务";
  dialogueQuizBtn.hidden = !(task.kind === "quiz" && !task.done && !hasNext);
}

function nextDialogueLine() {
  const dialogue = state?.activeDialogue;
  if (!dialogue) return;
  const task = dialogue.task;
  if (dialogue.index < dialogue.lines.length - 1) {
    dialogue.index += 1;
    renderDialogue();
  } else if (dialogue.mode === "quest_intro") {
    acceptMistQuest();
    state.activeDialogue = {
      taskId: task.id,
      task,
      speaker: task.name,
      lines: [levels[state.levelIndex].mistQuest.activeHint],
      index: 0,
      mode: "quest_active",
    };
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

function turnInMistQuest(task = mistQuestNpcTask()) {
  if (!isMistQuestNpc(task) || state.mistQuest.status !== "ready") return false;
  if (task.kind === "delivery" && !task.done) {
    if (missingNeeds(task.need).length || !canTalkToMistSwampTask(task)) return false;
    consumeNeeds(task.need);
    completeTask(task, task.x, task.y);
  }
  state.mistQuest.status = "settled";
  grantTaskReward(task, task.x, task.y);
  state.activeDialogue = {
    taskId: task.id,
    task,
    speaker: task.name,
    lines: levels[state.levelIndex].mistQuest.completeLines,
    index: 0,
    mode: "quest_after",
  };
  updateHud();
  renderDialogue();
  return true;
}

function finishDialogueDelivery() {
  const dialogue = state?.activeDialogue;
  const task = dialogue?.task;
  if (dialogue?.mode === "quest_ready") {
    turnInMistQuest(task);
    return;
  }
  if (!task || (task.kind !== "delivery" && task.kind !== "sort_basket") || task.done || missingNeeds(task.need).length) return;
  if (!canTalkToMistSwampTask(task)) {
    messageEl.textContent = "雾又浓起来了，先重新点亮一盏雾灯吧。";
    closeDialogue();
    return;
  }
  if (task.animal === "owlPrincipal" && !canUseEscortCart()) {
    messageEl.textContent = "\u5148\u8ba9\u5c0f\u63a8\u8f66\u8ddf\u7740\u4f60\u51fa\u53d1\u3002";
    closeDialogue();
    return;
  }
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
  if (isMistSwampLevel() && state.nearbyMudBubble) {
    const bubble = state.nearbyMudBubble;
    bubble.broken = true;
    bubble.active = false;
    completeTask(bubble, bubble.x, bubble.y);
    burst(bubble.x, bubble.y, "#a6d66f", 18);
    messageEl.textContent = "泥浆泡泡清除啦！";
    state.nearbyMudBubble = null;
    return;
  }
  if (state.nearbyAppleTree && !state.activeDialogue) {
    shakeAppleTree(state.nearbyAppleTree);
    return;
  }
  if (levels[state.levelIndex]?.dialogueDisabled === true) {
    const task = state.nearbyTask;
    if (!task || task.done) return;
    if (task.kind === "quiz") {
      openQuiz(task);
      return;
    }
    if (task.kind === "delivery") {
      const missing = missingNeeds(task.need);
      if (missing.length) {
        messageEl.textContent = `${task.name}\u9700\u8981\uff1a${needLabels(missing)}\u3002`;
        return;
      }
      consumeNeeds(task.need);
      completeTask(task, task.x, task.y);
      updateHud();
      return;
    }
    if (task.kind === "sort_basket") {
      const missing = missingNeeds(task.need);
      if (missing.length) {
        messageEl.textContent = `${task.name}\u9700\u8981\uff1a${needLabels(missing)}\u3002`;
        return;
      }
      consumeNeeds(task.need);
      completeTask(task, task.x, task.y);
      updateHud();
      return;
    }
    messageEl.textContent = taskNearHint(task);
    return;
  }
  if (state.activeDialogue) {
    nextDialogueLine();
    return;
  }
  const activeQuestMechanic = state.mistQuest?.status === "active" && ["mist_core", "mud_boss"].includes(state.nearbyTask?.kind);
  if (isMistQuestNpc(state.nearbyTask) && !activeQuestMechanic) {
    openDialogue(state.nearbyTask);
    return;
  }
  if (isMistSwampLevel() && interactMistSwampTask(state.nearbyTask)) return;
  if (state.nearbyTask?.kind === "direction_sign") {
    repairDirectionSign(state.nearbyTask);
    return;
  }
  if (state.nearbyTask && ["road_clear", "exit_area", "escort_npc"].includes(state.nearbyTask.kind)) {
    messageEl.textContent = taskNearHint(state.nearbyTask);
    return;
  }
  if (state.nearbyTask) {
    if (!canTalkToMistSwampTask(state.nearbyTask)) {
      messageEl.textContent = "雾又浓起来了，先重新点亮一盏雾灯吧。";
      return;
    }
    openDialogue(state.nearbyTask);
  }
}

function interactMistSwampTask(task) {
  if (!task) return false;
  if (!mistQuestAllowsProgress()) {
    messageEl.textContent = `先去找${mistQuestNpcTask()?.name || "任务伙伴"}接任务。`;
    return true;
  }
  if (task.kind === "mist_lamp") {
    if (task.done && isMistLampActive(task)) {
      messageEl.textContent = "雾灯还亮着，不需要重复放入灯芯。";
      return true;
    }
    const need = task.need?.[0];
    if (!task.done) {
      if (!state.inventory.includes(need)) {
        messageEl.textContent = `${task.name}需要${itemLabel(need)}。`;
        return true;
      }
      consumeNeeds([need]);
      completeTask(task, task.x, task.y);
    }
    task.lit = true;
    const clearTime = MIST_CLEAR_TIME_BY_DIFFICULTY[selectedDifficulty];
    task.litUntil = clearTime === null ? null : performance.now() + clearTime;
    if (clearTime === null) state.mistPermanentClear = true;
    else state.mistClearUntil = Math.max(state.mistClearUntil, task.litUntil);
    messageEl.textContent = "雾灯亮起来啦！";
    return true;
  }
  if (task.kind === "mushroom_lamp") {
    if (task.done) {
      messageEl.textContent = "蘑菇灯已经亮啦！";
      return true;
    }
    if (selectedDifficulty === "easy") {
      task.lit = true;
      completeTask(task, task.x, task.y);
      const litCount = state.tasksList.filter((entry) => entry.kind === "mushroom_lamp" && entry.lit).length;
      messageEl.textContent = litCount >= 2 ? "两盏蘑菇灯亮啦！可以继续去修桥。" : "再点亮一盏蘑菇灯就完成小挑战啦。";
      return true;
    }
    const expected = state.mushroomSequence[state.mushroomStep];
    if (task.color !== expected) {
      state.mushroomStep = 0;
      state.tasksList.filter((entry) => entry.kind === "mushroom_lamp").forEach((entry) => { entry.lit = false; });
      const hint = state.mushroomSequence.map((color) => ({ yellow: "黄", blue: "蓝", purple: "紫", green: "绿" })[color]).join(" → ");
      messageEl.textContent = `再看一看萤火虫提示哦。${hint}`;
      state.priorityMessage = messageEl.textContent;
      state.priorityMessageUntil = performance.now() + (selectedDifficulty === "crazy" ? 900 : 1800);
      return true;
    }
    task.lit = true;
    state.mushroomStep += 1;
    if (state.mushroomStep === state.mushroomSequence.length) {
      const sequenceColors = new Set(state.mushroomSequence);
      state.tasksList.filter((entry) => entry.kind === "mushroom_lamp" && sequenceColors.has(entry.color)).forEach((entry) => {
        if (!entry.done) completeTask(entry, entry.x, entry.y);
      });
      messageEl.textContent = "蘑菇灯都亮啦！";
      state.priorityMessage = messageEl.textContent;
      state.priorityMessageUntil = performance.now() + 1200;
    }
    return true;
  }
  if (task.kind === "broken_bridge") {
    state.priorityMessage = "";
    state.priorityMessageUntil = 0;
    if (task.done) {
      messageEl.textContent = "木桥已经修好啦，可以安全通过了！";
      return true;
    }
    const missingPlanks = missingNeeds(task.need).length;
    if (missingPlanks) {
      messageEl.textContent = `还需要 ${missingPlanks} 块木桥板。`;
      return true;
    }
    consumeNeeds(task.need);
    completeTask(task, task.x, task.y);
    messageEl.textContent = "木桥修好啦，可以安全通过了！";
    return true;
  }
  if (task.kind === "mist_bubble") {
    if (isMistSwampMistCoreLevel()) {
      const lamps = state.tasksList.filter((entry) => entry.kind === "mist_lamp");
      if (!lamps.every((entry) => entry.done)) {
        messageEl.textContent = "先点亮三盏大雾灯，泡泡才会显出真正顺序。";
        return true;
      }
      const bubbles = state.tasksList.filter((entry) => entry.kind === "mist_bubble");
      if (bubbles[state.mistCoreBubbleIndex] !== task) {
        state.mistOpacity = Math.min(0.42, state.mistOpacity + 0.05);
        messageEl.textContent = "这个泡泡还没亮，先找带金色光环的泡泡。";
        return true;
      }
      state.mistCoreBubbleIndex += 1;
    }
    completeTask(task, task.x, task.y);
    messageEl.textContent = "黑雾泡泡变成亮晶晶的水汽啦！";
    return true;
  }
  if (task.kind === "mist_core") {
    const prerequisites = state.tasksList.filter((entry) => entry.kind === "mist_lamp" || entry.kind === "mist_bubble");
    if (!prerequisites.every((entry) => entry.done)) {
      messageEl.textContent = "先点亮大雾灯并清除黑雾泡泡。";
      return true;
    }
    if (!state.inventory.includes("mistBadge")) state.inventory.push("mistBadge");
    completeTask(task, task.x, task.y);
    messageEl.textContent = "迷雾精灵恢复清醒啦！沼泽重新亮起来了。";
    return true;
  }
  if (task.kind === "mud_boss") {
    if (task.phase < 3) {
      messageEl.textContent = task.phase === 1 ? "第一步：点亮 3 盏大雾灯，驱散泥浆怪身边的黑雾。" : "第二步：清除泥浆泡泡，找到泥浆怪心里的光。";
      return true;
    }
    if (!state.inventory.includes("fireflyLantern")) {
      state.inventory.push("fireflyLantern");
      state.temporaryMistItems.push("fireflyLantern");
    }
    if (!task.chargeReady) {
      messageEl.textContent = `靠近泥浆核心，让灯笼持续充能 ${state.lanternChargeRequired} 秒。`;
      return true;
    }
    openQuiz(task);
    return true;
  }
  return false;
}

function repairDirectionSign(task) {
  if (!task || task.done) return;
  const missing = missingNeeds(task.need);
  if (missing.length) {
    messageEl.textContent = "先找到路牌碎片。";
    return;
  }
  consumeNeeds(task.need);
  completeTask(task, task.x, task.y);
  messageEl.textContent = task.directions?.join("  ") || "→ 橡果镇";
  addFloatingText(task.x, task.y - 62, "路牌修好啦！", "#3f8a2f");
  updateHud();
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
    state.correctAnswers += 1;
    addRunPoints(8, task.x, task.y, "+8 积分");
    closeQuiz();
    completeTask(task, task.x, task.y);
    if (isMistSwampLevel() && task.kind === "mud_boss") {
      messageEl.textContent = "泥浆怪安静下来了，它原来是在守护沼泽。";
    }
    return;
  }
  if (isMistSwampLevel() && task.kind === "mud_boss") {
    state.wrongAnswers += 1;
    state.lanternCharge = 0;
    task.chargeReady = false;
    closeQuiz();
    messageEl.textContent = "再想一想吧。泥浆怪没有生气，重新给灯笼充能就能再试。";
    updateHud();
    return;
  }
  state.wrongAnswers += 1;
  state.hearts = Math.max(0, state.hearts - 1);
  const penalty = applyTimePenalty("quiz", task.x, task.y);
  messageEl.textContent = penalty
    ? `\u518d\u60f3\u4e00\u4e0b\uff0c\u7b54\u9519\u6263\u9664 ${penalty} \u79d2\u3002`
    : "\u518d\u60f3\u4e00\u4e0b\uff0c\u8fd9\u9898\u5f88\u63a5\u8fd1\u7b54\u6848\u4e86\u3002";
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
  drawAppleValleyBackDepth();
  drawLandmarks();
  drawLeaves();
  drawSceneObjects();
  drawFireflyTrail();
  drawEscortCart();
  drawCollectibles();
  drawTasks();
  drawMudBubbles();
  drawMistFog();
  drawHazards();
  drawProjectiles();
  drawPlayer();
  drawParticles();
  drawAppleValleyForegroundDepth();
  if (!state.running && !state.levelClear && state.time === state.levelTime) drawStartHint();
  if (state.levelClear) drawLevelRibbon();
  ctx.restore();
}

function drawCoverImage(image, x, y, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
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
    drawCoverImage(image, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  } else if (levels[state.levelIndex]?.world === "moonlight_lake") {
    drawMoonlightLakeFallbackBackground();
  } else if (levels[state.levelIndex]?.world === "mist_swamp") {
    drawMistSwampFallbackBackground();
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

function drawAppleValleyBackDepth() {
  if (!isAppleValleyLevel()) return;
  const t = performance.now() / 1000;
  ctx.save();

  const glow = ctx.createRadialGradient(720, 76, 18, 720, 76, 430);
  glow.addColorStop(0, "rgba(255, 238, 150, 0.34)");
  glow.addColorStop(0.46, "rgba(255, 214, 118, 0.12)");
  glow.addColorStop(1, "rgba(255, 214, 118, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 0.24;
  ctx.fillStyle = "#7fb05a";
  ctx.beginPath();
  ctx.moveTo(0, 258);
  ctx.bezierCurveTo(160, 214, 250, 244, 374, 210);
  ctx.bezierCurveTo(536, 166, 694, 220, 960, 172);
  ctx.lineTo(960, 338);
  ctx.lineTo(0, 338);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#476b42";
  for (let i = 0; i < 9; i += 1) {
    const x = 34 + i * 112 + Math.sin(t * 0.18 + i) * 3;
    const y = 190 + (i % 3) * 18;
    ctx.beginPath();
    ctx.moveTo(x - 30, y + 70);
    ctx.quadraticCurveTo(x, y - 22, x + 34, y + 70);
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = "rgba(255, 247, 223, 0.75)";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(640 + i * 58, 16);
    ctx.lineTo(428 + i * 76, 330);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  const groundLight = ctx.createRadialGradient(480, 430, 30, 480, 430, 410);
  groundLight.addColorStop(0, "rgba(255, 234, 145, 0.18)");
  groundLight.addColorStop(1, "rgba(255, 234, 145, 0)");
  ctx.fillStyle = groundLight;
  ctx.fillRect(0, 250, canvas.width, canvas.height - 250);

  ctx.restore();
}

function drawAppleValleyForegroundDepth() {
  if (!isAppleValleyLevel()) return;
  const t = performance.now() / 1000;
  ctx.save();

  ctx.globalAlpha = 0.34;
  for (let i = 0; i < 16; i += 1) {
    const x = (i * 73 + Math.sin(t * 0.7 + i) * 6) % 990 - 15;
    const y = 510 + (i % 4) * 9;
    ctx.fillStyle = i % 2 ? "rgba(76, 125, 40, 0.58)" : "rgba(131, 184, 61, 0.52)";
    ctx.beginPath();
    ctx.ellipse(x, y, 26 + (i % 3) * 6, 8, -0.28 + (i % 4) * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.42;
  for (let i = 0; i < 11; i += 1) {
    const x = (i * 89 + Math.sin(t * 0.45 + i) * 8) % 960;
    const y = 112 + ((i * 47) % 330) + Math.sin(t + i) * 3;
    ctx.fillStyle = i % 3 === 0 ? "rgba(255, 236, 148, 0.62)" : "rgba(255, 179, 112, 0.34)";
    circle(x, y, 2.2 + (i % 3));
  }

  const vignette = ctx.createRadialGradient(480, 292, 190, 480, 292, 610);
  vignette.addColorStop(0, "rgba(255,255,255,0)");
  vignette.addColorStop(1, "rgba(67, 82, 42, 0.16)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.restore();
}

function drawMistSwampFallbackBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#9bb9b5");
  sky.addColorStop(0.52, "#759b88");
  sky.addColorStop(1, "#496f62");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(51, 91, 83, 0.72)";
  ctx.beginPath();
  ctx.ellipse(205, 405, 220, 92, -0.12, 0, Math.PI * 2);
  ctx.ellipse(760, 390, 250, 100, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(210, 240, 203, 0.34)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(70, 470);
  ctx.bezierCurveTo(250, 330, 460, 430, 560, 290);
  ctx.bezierCurveTo(690, 125, 820, 210, 920, 105);
  ctx.stroke();
  for (const [x, y] of [[150, 145], [330, 215], [540, 125], [720, 240], [860, 155]]) {
    ctx.fillStyle = "rgba(255, 226, 92, 0.22)";
    circle(x, y, 17);
    ctx.fillStyle = "#ffe26a";
    circle(x, y, 5);
  }
}

function drawMoonlightLakeFallbackBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#17163f");
  sky.addColorStop(0.48, "#253d76");
  sky.addColorStop(1, "#1f4c68");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(245, 242, 205, 0.95)";
  circle(742, 84, 42);
  ctx.fillStyle = "rgba(245, 242, 205, 0.22)";
  circle(742, 84, 66);

  const lake = ctx.createLinearGradient(0, 210, 0, canvas.height);
  lake.addColorStop(0, "rgba(48, 87, 142, 0.75)");
  lake.addColorStop(1, "rgba(18, 57, 91, 0.92)");
  ctx.fillStyle = lake;
  ctx.beginPath();
  ctx.moveTo(0, 218);
  ctx.bezierCurveTo(180, 190, 306, 242, 480, 214);
  ctx.bezierCurveTo(650, 188, 790, 220, 960, 198);
  ctx.lineTo(960, 540);
  ctx.lineTo(0, 540);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(245, 242, 205, 0.56)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(650 - i * 24, 180 + i * 42);
    ctx.quadraticCurveTo(742, 196 + i * 46, 834 + i * 16, 190 + i * 42);
    ctx.stroke();
  }

  ctx.fillStyle = "#303f5f";
  ctx.beginPath();
  ctx.moveTo(0, 410);
  ctx.bezierCurveTo(220, 354, 420, 402, 604, 360);
  ctx.bezierCurveTo(720, 334, 830, 360, 960, 330);
  ctx.lineTo(960, 540);
  ctx.lineTo(0, 540);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#72543d";
  roundRect(116, 330, 250, 18, 6);
  ctx.fill();
  for (const x of [138, 214, 292, 344]) {
    roundRect(x, 340, 14, 70, 5);
    ctx.fill();
  }

  ctx.strokeStyle = "#7b8f72";
  ctx.lineWidth = 5;
  for (const x of [52, 76, 620, 646, 680, 902, 928]) {
    ctx.beginPath();
    ctx.moveTo(x, 438);
    ctx.quadraticCurveTo(x - 12, 386, x + 6, 330);
    ctx.stroke();
  }

  ctx.fillStyle = "#52617d";
  circle(520, 392, 24);
  circle(560, 382, 15);
  ctx.fillStyle = "rgba(223, 246, 255, 0.7)";
  circle(452, 306, 14);
  ctx.fillStyle = "#6d5a4a";
  roundRect(446, 316, 12, 60, 5);
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
  drawForestRoadZones();
  if (isMistSwampSleepingBridgeLevel()) {
    for (const zone of state.safeZones || []) drawSafeZone(zone);
  }
  drawPropDecorations();
  drawNpcDecorations();
  drawDarkBubbles();
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

function drawNpcDecorations() {
  const decorations = state.npcDecorations || [];
  for (const entry of decorations) {
    ctx.save();
    ctx.translate(entry.x, entry.y);
    ctx.scale(entry.scale || 1, entry.scale || 1);
    drawAnimal(entry.kind);
    if (entry.label) {
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "800 10px Microsoft YaHei, Arial";
      ctx.textAlign = "center";
      fitText(entry.label, 0, 46, 92);
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
    const mistOnlyObstacle = obstacle.type === "softMud";
    const artKey = mistOnlyObstacle && !isMistSwampLevel() ? null : ART_PACK_OBSTACLE_KEYS[obstacle.type];
    if (artKey && drawObstacleArtPackImage(obstacle, artKey)) continue;
    if (obstacle.type === "pond") drawPond(obstacle.x, obstacle.y, obstacle.r);
    else if (obstacle.type === "bush") drawBush(obstacle.x, obstacle.y, obstacle.r);
    else if (obstacle.type === "pit") drawPit(obstacle.x, obstacle.y, obstacle.r);
    else if (obstacle.type === "current") drawMoonCurrent(obstacle);
    else if (obstacle.type === "bubbleLift") drawBubbleLift(obstacle);
    else if (obstacle.type === "whirlpool") drawWhirlpool(obstacle);
    else if (obstacle.type === "moonPillar") drawMoonPillar(obstacle);
    else if (obstacle.type === "pearlSwitch") drawPearlSwitch(obstacle);
    else if (obstacle.type === "appleTree") drawAppleTree(obstacle);
    else if (obstacle.type === "softMud" && isMistSwampLevel()) drawGroundPuddle({ ...obstacle, r: obstacle.r * 0.9 });
  }
}

function drawForestRoadZones() {
  if (levels[state.levelIndex]?.world !== "forest_road") return;
  for (const zone of state.crossingZones || []) drawCrossingZone(zone);
  for (const zone of state.safeZones || []) drawSafeZone(zone);
  for (const area of state.exitAreas || []) drawExitArea(area, false);
  for (const light of state.trafficLights || []) drawTrafficLight(light);
}

function drawCrossingZone(zone) {
  ctx.save();
  ctx.translate(zone.x, zone.y);
  if (drawPropImage(ctx, "zebraCrossing", -zone.w / 2, -zone.h / 2, zone.w, zone.h)) {
    ctx.restore();
    return;
  }
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  roundRect(-zone.w / 2, -zone.h / 2, zone.w, zone.h, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 4;
  for (let x = -zone.w / 2 + 18; x < zone.w / 2; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, -zone.h / 2 + 10);
    ctx.lineTo(x, zone.h / 2 - 10);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSafeZone(zone) {
  ctx.save();
  ctx.translate(zone.x, zone.y);
  ctx.fillStyle = "rgba(131,184,61,0.16)";
  circle(0, 0, zone.r);
  ctx.strokeStyle = "rgba(63,138,47,0.72)";
  ctx.lineWidth = 4;
  circleStroke(0, 0, zone.r);
  ctx.fillStyle = "#34563e";
  ctx.font = "900 12px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  if (!drawPropImage(ctx, "safeFlag", -30, -44, 60, 68)) fitText(zone.label || "安全区", 0, 5, zone.r * 1.6);
  fitText(zone.label || "安全区", 0, 44, zone.r * 1.8);
  ctx.restore();
}

function drawExitArea(area, correct) {
  ctx.save();
  ctx.translate(area.x, area.y);
  if (area.propKey && drawPropImage(ctx, area.propKey, -52, -78, 104, 118)) {
    ctx.restore();
    return;
  }
  ctx.fillStyle = correct ? "rgba(131,184,61,0.16)" : "rgba(246,211,123,0.14)";
  circle(0, 0, area.r);
  ctx.strokeStyle = correct ? "rgba(63,138,47,0.72)" : "rgba(139,91,43,0.55)";
  ctx.lineWidth = 3;
  circleStroke(0, 0, area.r);
  ctx.fillStyle = "#5b3212";
  ctx.font = "900 11px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  fitText(area.label || "出口", 0, 4, area.r * 1.7);
  ctx.restore();
}

function drawTrafficLight(light) {
  ctx.save();
  ctx.translate(light.x, light.y);
  if (drawPropImage(ctx, "trafficLight", -34, -66, 68, 118)) {
    const activeY = light.state === "red" ? -34 : 4;
    ctx.globalAlpha = 0.96;
    ctx.fillStyle = light.state === "red" ? "rgba(232,75,63,0.95)" : "rgba(111,180,71,0.95)";
    circle(0, activeY, 15);
    ctx.strokeStyle = light.state === "red" ? "rgba(255,235,210,0.92)" : "rgba(236,255,212,0.92)";
    ctx.lineWidth = 4;
    circleStroke(0, activeY, 19);
    ctx.globalAlpha = 0.86;
    ctx.fillStyle = light.state === "red" ? "#e84b3f" : "#4f9f33";
    ctx.font = "900 11px Microsoft YaHei, Arial";
    ctx.textAlign = "center";
    ctx.fillText(light.state === "red" ? "红灯" : "绿灯", 0, -72);
    ctx.restore();
    return;
  }
  ctx.fillStyle = "#5b3212";
  roundRect(-8, 18, 16, 78, 6);
  ctx.fill();
  ctx.fillStyle = "#293241";
  roundRect(-24, -54, 48, 78, 12);
  ctx.fill();
  ctx.fillStyle = light.state === "red" ? "#e84b3f" : "rgba(232,75,63,0.28)";
  circle(0, -32, 13);
  ctx.fillStyle = light.state === "green" ? "#6fb447" : "rgba(111,180,71,0.28)";
  circle(0, 3, 13);
  ctx.restore();
}

function drawEscortCart() {
  const cart = state?.escortCart;
  if (!cart || !cart.active) return;
  ctx.save();
  ctx.translate(cart.x, cart.y);
  ctx.scale(0.92, 0.92);
  drawAppleValleyGroundShadow(0, 40, 34, 7);
  drawAppleCart();
  ctx.restore();
}

function drawDarkBubbles() {
  for (const bubble of state.darkBubbles || []) {
    if (bubble.broken) continue;
    const t = performance.now() / 260 + bubble.x;
    ctx.save();
    ctx.translate(bubble.x, bubble.y + Math.sin(t) * 4);
    if (!drawEffectArtPackImage("darkBubble", -bubble.r - 12, -bubble.r - 12, bubble.r * 2 + 24, bubble.r * 2 + 24)) {
      ctx.fillStyle = "rgba(56, 36, 96, 0.52)";
      circle(0, 0, bubble.r + Math.sin(t) * 2);
      ctx.strokeStyle = "rgba(217, 200, 255, 0.75)";
      ctx.lineWidth = 3;
      circleStroke(0, 0, bubble.r + 5);
      ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
      circle(-7, -8, 5);
    }
    ctx.restore();
  }
}

function drawMoonCurrent(obstacle) {
  const t = performance.now() / 360;
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  ctx.rotate(Math.atan2(obstacle.vy || 0, obstacle.vx || 1));
  const pack = window.CATS_OWLS_ART_PACK_01;
  const image = pack?.get?.("effects", "moonlightCurrent");
  if (image && image.complete && image.naturalWidth > 0) {
    const width = obstacle.r * 3.2;
    const height = width * (image.naturalHeight / image.naturalWidth);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
    return;
  }
  ctx.strokeStyle = "rgba(91, 196, 230, 0.68)";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-obstacle.r * 1.1, i * 14);
    ctx.quadraticCurveTo(Math.sin(t + i) * 18, i * 14 - 12, obstacle.r * 1.1, i * 14);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBubbleLift(obstacle) {
  const t = performance.now() / 260;
  const active =
    state?.activeBubbleLift === obstacle &&
    performance.now() < (state?.bubbleLiftUntil || 0);
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  ctx.globalAlpha = active ? 0.46 : 0.26;
  ctx.fillStyle = "#c9f7ff";
  circle(0, 0, obstacle.r + 55);
  ctx.globalAlpha = active ? 0.95 : 0.58;
  ctx.strokeStyle = active ? "rgba(255,255,255,0.9)" : "rgba(201, 247, 255, 0.72)";
  ctx.lineWidth = active ? 4 : 2;
  circleStroke(0, 0, obstacle.r + 55);
  ctx.strokeStyle = "rgba(201, 247, 255, 0.72)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 7; i += 1) {
    const y = 42 - ((t + i * 17) % 94);
    circleStroke(Math.sin(t * 0.04 + i) * 18, y, 8 + (i % 3));
  }
  drawPropImage(ctx, "bubbleSlide", -obstacle.r - 18, -obstacle.r - 18, obstacle.r * 2 + 36, obstacle.r * 2 + 36);
  ctx.restore();
}

function drawWhirlpool(obstacle) {
  const t = performance.now() / 420;
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  ctx.globalAlpha = obstacle.closed ? 0.32 : 1;
  ctx.strokeStyle = obstacle.closed ? "rgba(255,247,223,0.7)" : "rgba(77, 123, 191, 0.82)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, obstacle.r * (0.35 + i * 0.22), t + i, t + Math.PI * 1.55 + i);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMoonPillar(obstacle) {
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  drawShadow(0, 28, 30, 8);
  const glow = obstacle.lit ? "rgba(223,246,255,0.55)" : "rgba(141,170,190,0.18)";
  ctx.fillStyle = glow;
  circle(0, -18, 38);
  ctx.fillStyle = obstacle.lit ? "#dff6ff" : "#8daabe";
  roundRect(-14, -46, 28, 72, 8);
  ctx.fill();
  ctx.fillStyle = "#fff7df";
  circle(0, -54, 10);
  ctx.restore();
}

function drawPearlSwitch(obstacle) {
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  drawShadow(0, 24, 32, 8);
  ctx.fillStyle = "#6c8bb5";
  roundRect(-26, 4, 52, 22, 8);
  ctx.fill();
  const pearl = ctx.createRadialGradient(-5, -10, 2, 0, -8, 22);
  pearl.addColorStop(0, "#ffffff");
  pearl.addColorStop(0.6, "#f7e8ff");
  pearl.addColorStop(1, "#91d7e9");
  ctx.fillStyle = pearl;
  circle(0, -8, 19);
  ctx.restore();
}

const ART_PACK_PROP_KEYS = {
  apple: "apple",
  redApple: "redApple",
  greenApple: "greenApple",
  goldenApple: "goldenApple",
  appleBasket: "appleBasket",
  giftAppleBasket: "giftAppleBasket",
  redAppleBasket: "redAppleBasket",
  greenAppleBasket: "greenAppleBasket",
  giftAppleBasket2: "giftAppleBasket2",
  appleCart: "appleCart",
  harvestBadge: "harvestBadge",
  autumnLeaf: "autumnLeaf",
  signPiece: "signPiece",
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
  moonLamp: "moonLamp",
  boatPaddle: "boatPaddle",
  moonKey: "moonKey",
  shellBadge: "shellBadge",
  seaweedScissors: "seaweedScissors",
  leafLamp: "leafLamp",
  hangingLantern: "hangingLantern",
  flowerBulbLamp: "flowerBulbLamp",
  divingHelmet: "bubbleDivingHelmet",
  bubbleStone: "bubbleStone",
  pearlOrb: "pearlOrb",
  coralKey: "coralKey",
  spiralShell: "spiralShell",
  jellyfishCore: "jellyfishCore",
  aquaGem: "aquaGem",
  deepRune: "deepRune",
  pearlCrown: "pearlCrown",
  moonPearlBadge: "moonPearl",
  lightSpore: "lightSpore",
  fireflyLantern: "fireflyLantern",
  mistBadge: "mistBadge",
  fireflyCore: "fireflyCore",
  glowSpore: "glowSpore",
  bridgePlank: "bridgePlank",
  bridgeKey: "bridgeKey",
  mistGuardianBadge: "mistGuardianBadge",
  branchPile: "roadBranchPile",
  leafPile: "leafPile",
  roadStone: "roadStonePile",
  safeFlag: "safeFlag",
};

const ART_PACK_OBSTACLE_KEYS = {
  pond: "pond",
  bush: "bush",
  pit: "pit",
  appleTree: "appleTree",
  stump: "stump",
  rock: "rock",
  moonPillar: "moonPillar",
  pearlSwitch: "pearlSwitch",
  whirlpool: "whirlpool",
  softMud: "softMud",
};

const ART_PACK_NPC_KEYS = {
  rabbit: "lily",
  squirrel: "coco",
  coco: "coco",
  hedgehog: "nono",
  nono: "nono",
  deer: "deer",
  ant: "ant",
  butterfly: "butterfly",
  fox: "fox",
  firefly: "firefly",
  owl: "owlPrincipal",
  owlPrincipal: "owlPrincipal",
  birdPostman: "birdPostman",
  moleFarmer: "moleFarmer",
  otter: "otterPostman",
  frog: "frogTeacher",
  seagull: "seagullScout",
  beaver: "beaverEngineer",
  clownfish: "clownfishTwins",
  jellyfish: "jellyfishLady",
  nessie: "nessieBoss",
  seaTurtle: "seaTurtle",
  octopus: "octopusDoctor",
  seahorseGuard: "seahorseGuard",
  lanternFish: "lanternFish",
  fireflyGuide: "fireflyGuide",
  littleFrog: "littleFrog",
  swampSnail: "swampSnail",
  ruru: "ruru",
  mudMonster: "mudMonster",
  mistSpirit: "mistSpirit",
};

const ART_PACK_SCENE_PROP_KEYS = {
  chest: "treasureChest",
  light: ["leafLamp", "flowerBulbLamp"],
  flower: "flowerBed",
  sign: "schoolSign",
  autumnLeaf: "autumnLeaf",
  spring: "bouncingMushroom",
  finish: "finishFlag",
  branchPile: "roadBranchPile",
  leafPile: "leafPile",
  roadStone: "roadStonePile",
  directionSign: "directionSign",
  correctExit: "safeFlag",
  bigMistLamp: "bigMistLamp",
  mistLamp: "mistLamp",
  brokenBridge: "brokenBridge",
};

const MIST_SWAMP_MUSHROOM_ART_KEYS = {
  yellow: "mushroomLampYellow",
  blue: "mushroomLampBlue",
  purple: "mushroomLampPurple",
  green: "mushroomLampGreen",
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
  otter: { x: 0, y: 12 },
  frog: { x: 0, y: 18 },
  seagull: { x: 0, y: 12 },
  beaver: { x: 0, y: 14 },
  clownfish: { x: 0, y: 10 },
  seaTurtle: { x: 0, y: 16 },
  jellyfish: { x: 0, y: 10 },
  octopus: { x: 0, y: 14 },
  seahorseGuard: { x: 0, y: 12 },
  lanternFish: { x: 0, y: 8 },
  nessie: { x: 0, y: 26 },
  owl: { x: 0, y: 8 },
  boss: { x: 0, y: 26 },
};

const ART_PACK_ITEM_BOUNDS = {
  apple: { x: -24, y: -28, w: 48, h: 48 },
  redApple: { x: -24, y: -28, w: 48, h: 48 },
  greenApple: { x: -24, y: -28, w: 48, h: 48 },
  goldenApple: { x: -24, y: -28, w: 48, h: 48 },
  appleBasket: { x: -34, y: -34, w: 68, h: 68 },
  giftAppleBasket: { x: -36, y: -36, w: 72, h: 72 },
  redAppleBasket: { x: -42, y: -42, w: 84, h: 84 },
  greenAppleBasket: { x: -42, y: -42, w: 84, h: 84 },
  giftAppleBasket2: { x: -44, y: -44, w: 88, h: 88 },
  appleCart: { x: -46, y: -38, w: 92, h: 76 },
  harvestBadge: { x: -28, y: -30, w: 56, h: 56 },
  autumnLeaf: { x: -24, y: -24, w: 48, h: 48 },
  signPiece: { x: -38, y: -35, w: 76, h: 70 },
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
  moonLamp: { x: -24, y: -36, w: 48, h: 72 },
  boatPaddle: { x: -32, y: -18, w: 64, h: 36 },
  moonKey: { x: -28, y: -30, w: 56, h: 56 },
  shellBadge: { x: -28, y: -30, w: 56, h: 56 },
  seaweedScissors: { x: -30, y: -30, w: 60, h: 60 },
  leafLamp: { x: -17, y: -23, w: 34, h: 46 },
  hangingLantern: { x: -17, y: -23, w: 34, h: 46 },
  flowerBulbLamp: { x: -16, y: -21, w: 32, h: 42 },
  flowerBed: { x: -43, y: -18, w: 86, h: 36 },
  schoolSign: { x: -40, y: -52, w: 80, h: 104 },
  bouncingMushroom: { x: -34, y: -48, w: 68, h: 96 },
  finishFlag: { x: -42, y: -72, w: 84, h: 120 },
  divingHelmet: { x: -30, y: -34, w: 60, h: 60 },
  bubbleStone: { x: -28, y: -30, w: 56, h: 56 },
  pearlOrb: { x: -27, y: -29, w: 54, h: 54 },
  coralKey: { x: -27, y: -29, w: 54, h: 54 },
  spiralShell: { x: -27, y: -29, w: 54, h: 54 },
  jellyfishCore: { x: -27, y: -29, w: 54, h: 54 },
  aquaGem: { x: -27, y: -29, w: 54, h: 54 },
  deepRune: { x: -27, y: -29, w: 54, h: 54 },
  pearlCrown: { x: -36, y: -34, w: 72, h: 64 },
  moonPearlBadge: { x: -28, y: -30, w: 56, h: 56 },
  roadBranchPile: { x: -48, y: -38, w: 96, h: 76 },
  leafPile: { x: -44, y: -36, w: 88, h: 72 },
  roadStonePile: { x: -42, y: -34, w: 84, h: 68 },
  directionSign: { x: -54, y: -70, w: 108, h: 120 },
  safeFlag: { x: -36, y: -56, w: 72, h: 92 },
  lightSpore: { x: -27, y: -29, w: 54, h: 54 },
  fireflyLantern: { x: -28, y: -38, w: 56, h: 72 },
  mistBadge: { x: -28, y: -30, w: 56, h: 56 },
  fireflyCore: { x: -25, y: -31, w: 50, h: 62 },
  glowSpore: { x: -27, y: -27, w: 54, h: 54 },
  bridgePlank: { x: -34, y: -16, w: 68, h: 32 },
  bridgeKey: { x: -28, y: -32, w: 56, h: 64 },
  mistGuardianBadge: { x: -30, y: -32, w: 60, h: 60 },
  bigMistLamp: { x: -42, y: -78, w: 84, h: 112 },
  mistLamp: { x: -32, y: -58, w: 64, h: 88 },
  brokenBridge: { x: -78, y: -55, w: 156, h: 110 },
  mushroomLampYellow: { x: -38, y: -60, w: 76, h: 76 },
  mushroomLampBlue: { x: -38, y: -60, w: 76, h: 76 },
  mushroomLampPurple: { x: -38, y: -60, w: 76, h: 76 },
  mushroomLampGreen: { x: -38, y: -60, w: 76, h: 76 },
};

const ART_PACK_OBSTACLE_BOUNDS = {
  pond: (r) => ({ x: -r * 1.72, y: -r * 0.98, w: r * 3.44, h: r * 1.96 }),
  bush: (r) => ({ x: -r * 1.08, y: -r * 0.96, w: r * 2.16, h: r * 1.92 }),
  pit: (r) => ({ x: -r * 1.2, y: -r * 0.82, w: r * 2.4, h: r * 1.64 }),
  appleTree: (r) => ({ x: -r * 1.95, y: -r * 2.25, w: r * 3.9, h: r * 3.9 }),
  stump: (r) => ({ x: -r, y: -r, w: r * 2, h: r * 2 }),
  rock: (r) => ({ x: -r, y: -r, w: r * 2, h: r * 2 }),
  moonPillar: (r) => ({ x: -r * 1.35, y: -r * 1.85, w: r * 2.7, h: r * 2.7 }),
  pearlSwitch: (r) => ({ x: -r * 1.25, y: -r * 1.25, w: r * 2.5, h: r * 2.5 }),
  whirlpool: (r) => ({ x: -r * 1.15, y: -r * 1.15, w: r * 2.3, h: r * 2.3 }),
  softMud: (r) => ({ x: -r * 1.6, y: -r * 0.82, w: r * 3.2, h: r * 1.64 }),
};

const ART_PACK_NPC_BOUNDS = {
  rabbit: { x: -36, y: -55, w: 72, h: 88 },
  squirrel: { x: -38, y: -55, w: 76, h: 88 },
  coco: { x: -38, y: -55, w: 76, h: 88 },
  hedgehog: { x: -38, y: -52, w: 76, h: 84 },
  nono: { x: -38, y: -52, w: 76, h: 84 },
  deer: { x: -38, y: -66, w: 76, h: 104 },
  ant: { x: -35, y: -58, w: 70, h: 92 },
  butterfly: { x: -48, y: -62, w: 96, h: 98 },
  fox: { x: -38, y: -62, w: 76, h: 100 },
  firefly: { x: -40, y: -62, w: 80, h: 98 },
  owl: { x: -44, y: -78, w: 88, h: 88 },
  owlPrincipal: { x: -44, y: -78, w: 88, h: 88 },
  birdPostman: { x: -44, y: -76, w: 88, h: 88 },
  moleFarmer: { x: -38, y: -52, w: 76, h: 84 },
  otter: { x: -44, y: -76, w: 88, h: 88 },
  frog: { x: -44, y: -76, w: 88, h: 88 },
  seagull: { x: -44, y: -76, w: 88, h: 88 },
  beaver: { x: -44, y: -76, w: 88, h: 88 },
  clownfish: { x: -44, y: -76, w: 88, h: 88 },
  jellyfish: { x: -44, y: -76, w: 88, h: 88 },
  seaTurtle: { x: -44, y: -76, w: 88, h: 88 },
  octopus: { x: -44, y: -76, w: 88, h: 88 },
  seahorseGuard: { x: -44, y: -76, w: 88, h: 88 },
  lanternFish: { x: -44, y: -76, w: 88, h: 88 },
  nessie: { x: -70, y: -100, w: 140, h: 140 },
  fireflyGuide: { x: -44, y: -76, w: 88, h: 96 },
  littleFrog: { x: -44, y: -70, w: 88, h: 88 },
  swampSnail: { x: -48, y: -70, w: 96, h: 88 },
  ruru: { x: -44, y: -74, w: 88, h: 96 },
  mudMonster: { x: -78, y: -112, w: 156, h: 156 },
  mistSpirit: { x: -48, y: -82, w: 96, h: 104 },
};

function drawArtPackImage(category, key, x, y, w, h) {
  const pack = window.CATS_OWLS_ART_PACK_01;
  const image = pack?.get?.(category, key);
  if (!image || !image.complete || image.naturalWidth <= 0) return false;
  ctx.drawImage(image, x, y, w, h);
  return true;
}

function drawGroundedArtPackImage(category, key, x, y, width, height) {
  const pack = window.CATS_OWLS_ART_PACK_01;
  const image = pack?.get?.(category, key);
  if (!image || !image.complete || image.naturalWidth <= 0) return false;
  const source = imageTransparentBounds(image);
  const scale = Math.min(width / source.w, height / source.h);
  const drawWidth = source.w * scale;
  const drawHeight = source.h * scale;
  ctx.drawImage(
    image,
    source.x,
    source.y,
    source.w,
    source.h,
    x + (width - drawWidth) / 2,
    y + height - drawHeight,
    drawWidth,
    drawHeight
  );
  return true;
}

function drawEffectArtPackImage(key, x, y, w, h) {
  return drawArtPackImage("effects", key, x, y, w, h);
}

function drawPropImage(ctxArg, key, x, y, width, height) {
  const pack = window.CATS_OWLS_ART_PACK_01;
  const image = pack?.get?.("props", key);
  if (image && image.complete && image.naturalWidth > 0) {
    const source = imageTransparentBounds(image);
    const scale = Math.min(width / source.w, height / source.h);
    const drawWidth = source.w * scale;
    const drawHeight = source.h * scale;
    ctxArg.drawImage(
      image,
      source.x,
      source.y,
      source.w,
      source.h,
      x + (width - drawWidth) / 2,
      y + (height - drawHeight) / 2,
      drawWidth,
      drawHeight
    );
    return true;
  }
  return false;
}

function imageTransparentBounds(image) {
  if (image._catsOwlTrimBounds) return image._catsOwlTrimBounds;
  const fallback = { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
  try {
    const buffer = document.createElement("canvas");
    buffer.width = image.naturalWidth;
    buffer.height = image.naturalHeight;
    const bufferCtx = buffer.getContext("2d", { willReadFrequently: true });
    bufferCtx.drawImage(image, 0, 0);
    const { data } = bufferCtx.getImageData(0, 0, buffer.width, buffer.height);
    let minX = buffer.width;
    let minY = buffer.height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < buffer.height; y += 1) {
      for (let x = 0; x < buffer.width; x += 1) {
        if (data[(y * buffer.width + x) * 4 + 3] <= 8) continue;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
    image._catsOwlTrimBounds = maxX >= 0 ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 } : fallback;
  } catch (error) {
    image._catsOwlTrimBounds = fallback;
  }
  return image._catsOwlTrimBounds;
}

function drawObstacleArtPackImage(obstacle, key) {
  const getBounds = ART_PACK_OBSTACLE_BOUNDS[key];
  if (!getBounds) return false;
  const bounds = getBounds(obstacle.r);
  const groundedAppleTree = obstacle.type === "appleTree" && isAppleValleyLevel();
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  if (groundedAppleTree) {
    drawAppleValleyGroundShadow(0, bounds.y + bounds.h + 2, obstacle.r * 1.18, Math.max(7, obstacle.r * 0.24));
  }
  if (obstacle.type === "moonPillar") {
    ctx.fillStyle = obstacle.lit ? "rgba(223,246,255,0.55)" : "rgba(141,170,190,0.18)";
    circle(0, -obstacle.r * 0.55, obstacle.r * 1.12);
  }
  if (obstacle.closed) ctx.globalAlpha = 0.36;
  const drawn = groundedAppleTree
    ? drawGroundedArtPackImage("obstacles", key, bounds.x, bounds.y, bounds.w, bounds.h)
    : drawArtPackImage("obstacles", key, bounds.x, bounds.y, bounds.w, bounds.h);
  ctx.restore();
  return drawn;
}

function drawItemArtPackImage(type) {
  const key = ART_PACK_PROP_KEYS[type];
  const bounds = ART_PACK_ITEM_BOUNDS[type];
  if (!key || !bounds) return false;
  if (window.ART_ASSETS?.props?.[key]) {
    if (isAppleValleyLevel()) {
      return drawGroundedArtPackImage("props", key, bounds.x, bounds.y, bounds.w, bounds.h);
    }
    return drawPropImage(ctx, key, bounds.x, bounds.y, bounds.w, bounds.h);
  }
  return drawArtPackImage("props", key, bounds.x, bounds.y, bounds.w, bounds.h);
}

function drawNpcArtPackImage(kind) {
  const key = ART_PACK_NPC_KEYS[kind];
  const bounds = ART_PACK_NPC_BOUNDS[kind];
  if (!key || !bounds) return false;
  if (isAppleValleyLevel()) {
    return drawGroundedArtPackImage("npc", key, bounds.x, bounds.y, bounds.w, bounds.h);
  }
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
  if (index === 1) {
    drawGroundFlowerBed(382, 414, 1);
  }
  if (index === 3) {
    drawGroundFlowerBed(500, 104, 0.74);
  }
}

function appleValleyTaskGroundShadow(task) {
  if (!isAppleValleyLevel()) return null;
  const npcBounds = ART_PACK_NPC_BOUNDS[task.animal];
  if (npcBounds) {
    return { y: npcBounds.y + npcBounds.h + 2, width: Math.max(22, npcBounds.w * 0.34), height: 6 };
  }
  if (task.kind === "sort_basket") return { y: 46, width: 31, height: 7 };
  if (task.kind === "quiz") return { y: 38, width: 27, height: 6 };
  if (task.animal === "appleCartStation") return { y: 40, width: 34, height: 7 };
  return null;
}

function drawCollectibles() {
  for (const entry of state.collectibles) {
    if (entry.taken) continue;
    const t = performance.now() / 260 + entry.x;
    const bobAmplitude = isAppleValleyLevel() ? APPLE_VALLEY_COLLECTIBLE_BOB : 5;
    const bob = entry.type === "potion" ? Math.sin(t) * 1.4 : Math.sin(t) * bobAmplitude;
    const scale = 1 + Math.sin(t) * 0.04;
    const grounded = isAppleValleyLevel();
    ctx.save();
    ctx.translate(entry.x, entry.y);
    if (grounded) drawAppleValleyGroundShadow(0, 25, entry.type === "potion" ? 20 : 31, 8);
    ctx.translate(0, bob);
    if (entry.type !== "potion") drawCollectibleGlow(t);
    if (!grounded) drawItemShadow(0, 25, entry.type === "potion" ? 20 : 31, 8);
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
  else if (type === "redApple") drawAppleVariant("#ff9589", "#e84b3f", "#b92f2d");
  else if (type === "greenApple") drawAppleVariant("#d8f08a", "#8fbd3a", "#4d7d28");
  else if (type === "goldenApple") drawAppleVariant("#fff2a8", "#ffd94a", "#d38c18");
  else if (type === "appleBasket") drawAppleBasket(false);
  else if (type === "giftAppleBasket") drawAppleBasket(true);
  else if (type === "appleCart") drawAppleCart();
  else if (type === "harvestBadge") drawHarvestBadge();
  else if (type === "autumnLeaf") drawAutumnLeaf();
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
  else drawMoonItem(type);
}

function drawTasks() {
  for (const task of state.tasksList) {
    if (task.kind === "road_clear" && task.done) continue;
    if (isMistSwampLevel() && task.kind === "mud_bubble") continue;
    ctx.save();
    const t = performance.now() / 360 + task.x * 0.03;
    const groundedNpc = isAppleValleyLevel() && task.kind === "delivery" && NPC_REGISTRY[task.animal]?.world === "apple_valley";
    const idleAmplitude = isAppleValleyLevel() ? 1 : 2.2;
    const idleBob = task.done || task.kind === "boss" || groundedNpc ? 0 : Math.sin(t) * idleAmplitude;
    const idleScale = task.done || task.kind === "boss" || groundedNpc ? 1 : 1 + Math.sin(t + 0.8) * 0.018;
    const groundShadow = appleValleyTaskGroundShadow(task);
    ctx.translate(task.x, task.y);
    if (groundShadow) drawAppleValleyGroundShadow(0, groundShadow.y, groundShadow.width, groundShadow.height);
    ctx.translate(0, idleBob);
    ctx.scale(idleScale, idleScale);
    ctx.globalAlpha = task.done ? 0.58 : 1;
    drawSpeech(task);
    if (isMistSwampLevel() && task.kind === "mushroom_lamp") drawMistSwampMushroomLamp(task);
    else if (isMistSwampLevel() && task.kind === "mist_lamp" && task.animal !== "bigMistLamp") {
      const bounds = ART_PACK_ITEM_BOUNDS.mistLamp;
      if (!drawPropImage(ctx, "mistLamp", bounds.x, bounds.y, bounds.w, bounds.h)) drawAnimal(task.animal);
    }
    else drawAnimal(task.animal);
    drawMudBossCore(task);
    if (isMistSwampLevel() && task.kind === "mist_lamp" && isMistLampActive(task)) {
      ctx.globalAlpha = 0.72;
      ctx.strokeStyle = "#ffe26a";
      ctx.lineWidth = 5;
      circleStroke(0, -8, task.animal === "bigMistLamp" ? 42 : 30);
    }
    if (isMistSwampMistCoreLevel() && task.kind === "mist_bubble" && !task.done) {
      const bubbles = state.tasksList.filter((entry) => entry.kind === "mist_bubble");
      if (bubbles[state.mistCoreBubbleIndex] === task) {
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = "#ffe26a";
        ctx.lineWidth = 4;
        circleStroke(0, 0, 34);
      }
    }
    if ((task.kind === "action" || task.kind === "road_clear") && !task.done) {
      drawTaskProgress(task.kind === "road_clear" ? task.progress * 1.65 : task.progress);
    }
    if (task.kind === "boss" && !task.done) drawBossProgress(task.progress);
    ctx.restore();
  }
}

function drawFireflyTrail() {
  if (!isMistSwampLevel()) return;
  const correct = state.fireflyTrail.filter((entry) => !entry.decoy);
  const pulse = 0.78 + Math.sin(performance.now() / 260) * 0.18;
  state.fireflyTrail.forEach((point) => {
    if (point.faded) return;
    const active = !point.decoy && correct[state.fireflyTrailIndex] === point;
    ctx.save();
    ctx.globalAlpha = point.decoy ? 0.48 : pulse;
    ctx.fillStyle = active ? "rgba(255, 226, 106, 0.42)" : point.decoy ? "rgba(132, 211, 163, 0.2)" : "rgba(255, 226, 106, 0.22)";
    circle(point.x, point.y, active ? 20 : 12);
    ctx.fillStyle = point.decoy ? "#84d3a3" : "#ffe26a";
    circle(point.x, point.y, active ? 6 : 4);
    ctx.restore();
  });
}

function drawMudBubbles() {
  if (!isMistSwampLevel()) return;
  const mudBoss = state.tasksList.find((task) => task.kind === "mud_boss");
  if (mudBoss?.phase < 2) return;
  for (const bubble of state.mudBubbles) {
    if (bubble.broken || !bubble.active) continue;
    const bob = Math.sin(bubble.phase) * 5;
    ctx.save();
    ctx.translate(bubble.x, bubble.y + bob);
    if (!drawEffectArtPackImage("mudBubble", -bubble.r * 1.35, -bubble.r * 1.35, bubble.r * 2.7, bubble.r * 2.7)) {
      ctx.fillStyle = "rgba(92, 112, 57, 0.78)";
      circle(0, 0, bubble.r);
      ctx.strokeStyle = "rgba(218, 239, 151, 0.8)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawMistFog() {
  if (!isMistSwampLevel() || state.mistOpacity <= 0) return;
  ctx.save();
  ctx.fillStyle = `rgba(103, 126, 142, ${state.mistOpacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
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

const QUIZ_SIGN_ART_KEYS = {
  math: "quizSignMath",
  logic: "quizSignLogic",
  science: "quizSignScience",
  language: "quizSignLanguage",
  english: "quizSignEnglish",
  riddle: "quizSignRiddle",
};

function drawQuizStandArt(kind, fallbackColor, fallbackLabel) {
  const artKey = QUIZ_SIGN_ART_KEYS[kind];
  if (artKey) {
    const drawn = isAppleValleyLevel()
      ? drawGroundedArtPackImage("props", artKey, -36, -44, 72, 80)
      : drawArtPackImage("props", artKey, -36, -44, 72, 80);
    if (drawn) return;
  }
  drawQuizStand(fallbackColor, fallbackLabel);
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
  else if (kind === "redBasket" || kind === "greenBasket" || kind === "giftBasket") drawSortBasket(kind);
  else if (kind === "appleCartStation") drawAppleCart();
  else if (kind === "light") drawTreeLight();
  else if (kind === "spring") drawSpringMushroom();
  else if (kind === "finish") drawFinishFlag();
  else if (kind === "branchPile") drawMiniPropFallback({ type: "branchPile", width: 88, height: 54, label: "树枝" });
  else if (kind === "leafPile") drawMiniPropFallback({ type: "leafPile", width: 82, height: 52, label: "落叶" });
  else if (kind === "roadStone") drawMiniPropFallback({ type: "roadStone", width: 78, height: 48, label: "石块" });
  else if (kind === "directionSign") drawMiniPropFallback({ type: "directionSign", width: 96, height: 72, label: "路牌" });
  else if (kind === "correctExit") drawMiniPropFallback({ type: "correctExit", width: 74, height: 56, label: "出口" });
  else if (kind === "mushroomLamp") drawMushroomLamp();
  else if (kind === "bigMistLamp") drawBigMistLamp();
  else if (kind === "darkMistBubble") {
    if (!drawEffectArtPackImage("darkMistBubble", -34, -34, 68, 68)) drawDarkMistBubble();
  }
  else if (kind === "brokenBridge") drawMiniPropFallback({ type: "brokenBridge", width: 96, height: 58, label: "木桥" });
  else if (kind === "math") drawQuizStandArt("math", "#ffd75e", quizDisplay("math")?.sign || "\u7b97\u9898");
  else if (kind === "logic") drawQuizStandArt("logic", "#fff2a8", quizDisplay("logic")?.sign || "\u89c4\u5f8b");
  else if (kind === "science") drawQuizStandArt("science", "#83b83d", quizDisplay("science")?.sign || "\u89c2\u5bdf");
  else if (kind === "language") drawQuizStandArt("language", "#f6d77b", quizDisplay("language")?.sign || "\u8ba4\u5b57");
  else if (kind === "english") drawQuizStandArt("english", "#2f9dcc", quizDisplay("english")?.sign || "ABC");
  else if (kind === "riddle") drawQuizStandArt("riddle", "#f59a8b", quizDisplay("riddle")?.sign || "\u731c\u8c1c");
}

function drawMushroomLamp() {
  ctx.fillStyle = "#f4ead0";
  roundRect(-6, -4, 12, 30, 5);
  ctx.fill();
  ctx.fillStyle = "#8a70c2";
  ctx.beginPath();
  ctx.arc(0, -5, 24, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
}

function drawMistSwampMushroomLamp(task) {
  const key = MIST_SWAMP_MUSHROOM_ART_KEYS[task.color];
  const bounds = ART_PACK_ITEM_BOUNDS[key];
  if (!key || !bounds || !drawPropImage(ctx, key, bounds.x, bounds.y, bounds.w, bounds.h)) drawMushroomLamp();
}

function drawMudBossCore(task) {
  if (!isMistSwampLevel() || task.kind !== "mud_boss" || task.phase < 3 || task.done) return;
  const pulse = 0.82 + Math.sin(performance.now() / 260) * 0.08;
  ctx.save();
  ctx.translate(0, -22);
  ctx.scale(pulse, pulse);
  if (!drawEffectArtPackImage("mudCore", -36, -36, 72, 72)) drawMoonItem("mudCore");
  ctx.restore();
}

function drawBigMistLamp() {
  ctx.fillStyle = "#556f65";
  roundRect(-18, -28, 36, 56, 8);
  ctx.fill();
  ctx.fillStyle = "#ffe26a";
  circle(0, -2, 13);
}

function drawDarkMistBubble() {
  ctx.fillStyle = "rgba(92, 75, 119, 0.78)";
  circle(0, 0, 25);
  ctx.strokeStyle = "#c9b7e8";
  ctx.lineWidth = 3;
  ctx.stroke();
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

function drawAppleVariant(highlight, mid, dark) {
  drawItemShadow(0, 22, 20, 5);
  const apple = ctx.createRadialGradient(-7, -5, 4, 0, 4, 24);
  apple.addColorStop(0, highlight);
  apple.addColorStop(0.62, mid);
  apple.addColorStop(1, dark);
  ctx.fillStyle = apple;
  circle(-8, 4, 15);
  circle(8, 4, 15);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  circle(-8, -4, 4);
  ctx.fillStyle = "#75431f";
  roundRect(-2, -18, 5, 16, 3);
  ctx.fill();
  ctx.fillStyle = "#78b84b";
  ctx.beginPath();
  ctx.ellipse(10, -16, 11, 6, -0.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawAppleBasket(gift = false) {
  drawItemShadow(0, 24, 28, 6);
  ctx.strokeStyle = "#8b572a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, -3, 25, Math.PI * 1.08, Math.PI * 1.92);
  ctx.stroke();
  const basket = ctx.createLinearGradient(0, -8, 0, 24);
  basket.addColorStop(0, "#d79a4b");
  basket.addColorStop(1, "#8f5428");
  ctx.fillStyle = basket;
  roundRect(-30, -6, 60, 34, 9);
  ctx.fill();
  ctx.strokeStyle = "rgba(91,55,30,0.4)";
  ctx.lineWidth = 2;
  for (const x of [-18, 0, 18]) {
    ctx.beginPath();
    ctx.moveTo(x, -3);
    ctx.lineTo(x + 4, 24);
    ctx.stroke();
  }
  drawTinyApple(-14, -10, "#e84b3f");
  drawTinyApple(3, -14, gift ? "#ffd94a" : "#8fbd3a");
  drawTinyApple(18, -8, "#e84b3f");
  if (gift) {
    ctx.fillStyle = "#f6d77b";
    roundRect(-6, 4, 12, 24, 3);
    ctx.fill();
    roundRect(-30, 10, 60, 8, 3);
    ctx.fill();
  }
}

function drawTinyApple(x, y, color) {
  ctx.fillStyle = color;
  circle(x - 4, y, 7);
  circle(x + 4, y, 7);
  ctx.fillStyle = "#75431f";
  roundRect(x - 1, y - 12, 3, 9, 2);
  ctx.fill();
}

function drawAppleCart() {
  if (drawGroundedArtPackImage("props", "appleCart", -46, -38, 92, 76)) return;
  drawItemShadow(0, 25, 32, 7);
  ctx.strokeStyle = "#6b3b20";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(24, -12);
  ctx.lineTo(42, -24);
  ctx.stroke();
  ctx.fillStyle = "#b86b32";
  roundRect(-36, -16, 62, 30, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(91,55,30,0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();
  drawTinyApple(-18, -20, "#e84b3f");
  drawTinyApple(0, -24, "#8fbd3a");
  drawTinyApple(16, -20, "#ffd94a");
  ctx.fillStyle = "#3b2a1c";
  circle(-20, 20, 8);
  circle(18, 20, 8);
  ctx.fillStyle = "#f6d77b";
  circle(-20, 20, 3);
  circle(18, 20, 3);
}

function drawHarvestBadge() {
  drawItemShadow(0, 22, 20, 5);
  ctx.fillStyle = "#ffd94a";
  star(0, -2, 26);
  ctx.fill();
  ctx.fillStyle = "#e84b3f";
  circle(0, -2, 11);
  ctx.fillStyle = "#fff7df";
  ctx.font = "900 14px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  ctx.fillText("丰", 0, 3);
}

function drawAutumnLeaf() {
  drawItemShadow(0, 18, 18, 4);
  ctx.fillStyle = "#d9782f";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 27, -0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8b4b20";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-13, 16);
  ctx.lineTo(13, -17);
  ctx.stroke();
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

function drawAppleValleyGroundShadow(x, y, width, height) {
  ctx.save();
  ctx.fillStyle = "rgba(83, 57, 31, 0.34)";
  ctx.beginPath();
  ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
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
  if (
    levels[state.levelIndex]?.world === "apple_valley" &&
    ["redApple", "greenApple", "goldenApple", "appleBasket", "giftAppleBasket", "harvestBadge", "autumnLeaf"].includes(entry.type)
  ) {
    return;
  }
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

function drawMoonItem(type) {
  const color = itemColor(type);
  ctx.save();
  ctx.fillStyle = "rgba(223, 246, 255, 0.34)";
  circle(0, 0, 28);
  ctx.fillStyle = color;
  if (type.includes("Key")) {
    roundRect(-22, -5, 32, 10, 5);
    ctx.fill();
    circle(-22, 0, 11);
    ctx.fillStyle = "#fff7df";
    circle(-22, 0, 5);
    ctx.fillStyle = color;
    roundRect(8, -11, 7, 10, 2);
    roundRect(18, -11, 7, 10, 2);
  } else if (type.includes("Badge") || type === "pearlCrown") {
    star(0, -3, 22);
    ctx.fillStyle = "#fff7df";
    circle(0, -3, 8);
  } else if (type.includes("Orb") || type.includes("Gem") || type.includes("Core") || type.includes("Stone")) {
    const gem = ctx.createRadialGradient(-7, -8, 2, 0, 0, 24);
    gem.addColorStop(0, "#ffffff");
    gem.addColorStop(0.55, color);
    gem.addColorStop(1, "#4d7bbf");
    ctx.fillStyle = gem;
    circle(0, 0, 20);
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    circle(-7, -8, 5);
  } else if (type === "boatPaddle" || type === "seaweedScissors") {
    ctx.rotate(type === "boatPaddle" ? -0.62 : 0.35);
    roundRect(-26, -4, 52, 8, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(28, 0, 12, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "divingHelmet") {
    ctx.beginPath();
    ctx.arc(0, 0, 22, Math.PI, 0);
    ctx.lineTo(22, 16);
    ctx.lineTo(-22, 16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#dff6ff";
    circle(0, -2, 10);
  } else if (type === "spiralShell") {
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 17, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff7df";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-2, 0, 13, 0.2, Math.PI * 1.8);
    ctx.stroke();
  } else {
    roundRect(-15, -24, 30, 48, 8);
    ctx.fill();
    ctx.fillStyle = "#fff7df";
    circle(0, -26, 10);
  }
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

function drawOtter() {
  drawMoonNpc("#9b6a42", "#f1c28b", "otter");
}

function drawFrog() {
  drawMoonNpc("#62b95d", "#d8f08d", "frog");
}

function drawSeagull() {
  drawMoonNpc("#f4f7fb", "#6da8d9", "fish");
}

function drawBeaver() {
  drawMoonNpc("#8a5a38", "#f1c28b", "otter");
}

function drawClownfish() {
  drawMoonNpc("#ff8a3d", "#fff7df", "fish");
}

function drawSeaTurtle() {
  drawMoonNpc("#4f9b7d", "#f1d78b", "turtle");
}

function drawJellyfish() {
  drawMoonNpc("#b98cff", "#f7e8ff", "jelly");
}

function drawOctopus() {
  drawMoonNpc("#d27ac2", "#ffd1ef", "octopus");
}

function drawSeahorseGuard() {
  drawMoonNpc("#dca15f", "#fff0ba", "seahorse");
}

function drawLanternFish() {
  drawMoonNpc("#4f8ec7", "#ffe77a", "fish");
}

function drawNessie() {
  drawMoonNpc("#5477c7", "#dff6ff", "nessie");
}

function drawMoonNpc(bodyColor, accentColor, kind) {
  const t = performance.now() / 360;
  drawShadow(0, 34, kind === "nessie" ? 64 : 34, 8);
  ctx.save();
  ctx.translate(0, Math.sin(t) * 1.8);
  ctx.fillStyle = bodyColor;
  if (kind === "nessie") {
    ctx.beginPath();
    ctx.ellipse(0, 8, 46, 28, 0, 0, Math.PI * 2);
    ctx.ellipse(34, -24, 20, 28, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(12, -4);
    ctx.quadraticCurveTo(28, -30, 38, -44);
    ctx.stroke();
  } else if (kind === "jelly") {
    ctx.beginPath();
    ctx.ellipse(0, -10, 28, 24, 0, Math.PI, 0);
    ctx.lineTo(28, 8);
    ctx.quadraticCurveTo(0, 22, -28, 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 4;
    for (const x of [-16, -6, 6, 16]) {
      ctx.beginPath();
      ctx.moveTo(x, 8);
      ctx.quadraticCurveTo(x + Math.sin(t + x) * 8, 26, x, 38);
      ctx.stroke();
    }
  } else if (kind === "octopus") {
    circle(0, -5, 27);
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 6;
    for (let i = 0; i < 6; i += 1) {
      const x = -24 + i * 10;
      ctx.beginPath();
      ctx.moveTo(x, 15);
      ctx.quadraticCurveTo(x + Math.sin(t + i) * 8, 30, x + 6, 40);
      ctx.stroke();
    }
  } else if (kind === "turtle") {
    ctx.beginPath();
    ctx.ellipse(0, 4, 32, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accentColor;
    circle(30, -2, 12);
    ctx.fillStyle = bodyColor;
    circle(-24, 20, 8);
    circle(20, 20, 8);
  } else if (kind === "fish") {
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-52, -18);
    ctx.lineTo(-52, 18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = accentColor;
    circle(24, -12, 9);
  } else if (kind === "seahorse") {
    ctx.beginPath();
    ctx.ellipse(4, 8, 20, 30, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -28, 18, 16, 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-8, 24);
    ctx.quadraticCurveTo(-30, 38, -12, 48);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.ellipse(0, 4, 26, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    if (kind === "frog") {
      circle(-14, -20, 9);
      circle(14, -20, 9);
    } else {
      ctx.beginPath();
      ctx.ellipse(24, 10, 10, 26, -0.65, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.ellipse(0, 9, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  drawFace(kind === "nessie" ? 34 : 0, kind === "nessie" ? -28 : -4);
  ctx.restore();
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

function drawMudMonster() {
  const pulse = 1 + Math.sin(performance.now() / 420) * 0.03;
  ctx.save();
  ctx.scale(pulse, pulse);
  drawShadow(0, 34, 92, 18);
  const body = ctx.createLinearGradient(0, -48, 0, 38);
  body.addColorStop(0, "#829b59");
  body.addColorStop(1, "#5f6f3d");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, 54, 46, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-18, -12, 13, 16, 0, 0, Math.PI * 2);
  ctx.ellipse(18, -12, 13, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#30422c";
  circle(-16, -10, 6);
  circle(16, -10, 6);
  ctx.strokeStyle = "#30422c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 5, 15, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.fillStyle = "#ffd94a";
  circle(-48, -46, 4);
  circle(46, -38, 4);
  circle(2, -58, 3);
  ctx.restore();
}

function drawMistSwampNpcFallback(label) {
  ctx.save();
  drawShadow(0, 25, 52, 12);
  ctx.fillStyle = "#75906a";
  circle(0, 0, 28);
  ctx.fillStyle = "#fff8df";
  circle(-9, -6, 7);
  circle(9, -6, 7);
  ctx.fillStyle = "#30422c";
  circle(-8, -5, 3);
  circle(8, -5, 3);
  ctx.fillStyle = "#fff8df";
  ctx.font = "700 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, 0, 44);
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

function drawAppleTree(tree) {
  const t = performance.now() / 420 + tree.x;
  ctx.save();
  ctx.translate(tree.x, tree.y);
  drawShadow(0, 58, tree.r * 1.25, 13);
  ctx.fillStyle = "#7a4a28";
  roundRect(-12, 4, 24, 62, 10);
  ctx.fill();
  ctx.fillStyle = tree.shaken ? "#76a84a" : "#5fa13d";
  circle(-28, -12 + Math.sin(t) * 1.5, 34);
  circle(16, -18 + Math.cos(t) * 1.5, 38);
  circle(38, 12, 31);
  circle(-8, 16, 39);
  if (!tree.shaken) {
    drawTinyApple(-28, -20, "#e84b3f");
    drawTinyApple(12, -32, "#8fbd3a");
    drawTinyApple(34, 2, "#e84b3f");
  }
  ctx.fillStyle = "rgba(255,247,223,0.9)";
  roundRect(-34, -70, 68, 22, 7);
  ctx.fill();
  ctx.fillStyle = "#5b3212";
  ctx.font = "900 10px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  fitText(tree.shaken ? "\u5df2\u6447" : "\u6447\u4e00\u6447", 0, -55, 58);
  ctx.restore();
}

function drawSortBasket(kind) {
  const imageKey = {
    redBasket: "redAppleBasket",
    greenBasket: "greenAppleBasket",
    giftBasket: "giftAppleBasket2",
  }[kind];
  if (imageKey) {
    const drawn = isAppleValleyLevel()
      ? drawGroundedArtPackImage("props", imageKey, -44, -44, 88, 88)
      : drawPropImage(ctx, imageKey, -44, -44, 88, 88);
    if (drawn) return;
  }

  const color =
    kind === "redBasket" ? "#e84b3f" : kind === "greenBasket" ? "#6fb447" : kind === "giftBasket" ? "#ffd94a" : "#b86b32";
  ctx.save();
  drawAppleBasket(kind === "giftBasket");
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = color;
  roundRect(-31, -4, 62, 12, 5);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff7df";
  ctx.font = "900 12px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  ctx.fillText(kind === "redBasket" ? "\u7ea2" : kind === "greenBasket" ? "\u7eff" : "\u793c", 0, 5);
  ctx.restore();
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
    redApple: "#e84b3f",
    greenApple: "#8fbd3a",
    goldenApple: "#ffd94a",
    appleBasket: "#b86b32",
    giftAppleBasket: "#f6d77b",
    appleCart: "#b86b32",
    harvestBadge: "#ffd94a",
    autumnLeaf: "#d9782f",
    signPiece: "#8b5b2b",
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
    moonLamp: "#dff6ff",
    boatPaddle: "#c78645",
    bubbleStone: "#91d7e9",
    divingHelmet: "#d8b15f",
    moonKey: "#dff6ff",
    shellBadge: "#f7e8ff",
    pearlOrb: "#fff7df",
    coralKey: "#ff8d68",
    jellyfishCore: "#c69cff",
    seaweedScissors: "#6fb447",
    deepRune: "#4d7bbf",
    spiralShell: "#f7c7d7",
    aquaGem: "#5bc4e6",
    pearlCrown: "#f4d35e",
    moonPearlBadge: "#d9c8ff",
  }[type] || "#ffd94a";
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointInRect(point, rect) {
  return Math.abs(point.x - rect.x) <= rect.w / 2 && Math.abs(point.y - rect.y) <= rect.h / 2;
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
storybookCloseBtn?.addEventListener("click", () => closeStorybookPage(false));
storybookStartBtn?.addEventListener("click", () => closeStorybookPage(true));

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

function syncDifficultyButtons() {
  difficultyButtons.forEach((button) => {
    const isSelected = button.dataset.difficulty === selectedDifficulty;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
}

function syncPlayerProfileInput() {
  if (nicknameInput) nicknameInput.value = playerProfile.nickname;
}

function setDifficulty(difficulty, resetIdleLevel = true) {
  if (!DIFFICULTY_SETTINGS[difficulty]) return;
  selectedDifficulty = difficulty;
  localStorage.setItem(DIFFICULTY_STORAGE_KEY, selectedDifficulty);
  syncDifficultyButtons();
  if (state && !state.running && resetIdleLevel) resetGame(state.levelIndex, state.levelIndex > 0);
  else if (state) updateHud();
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRole = button.dataset.role || "cat";
    localStorage.setItem("catsOwlRole", selectedRole);
    syncRoleButtons();
  });
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => setDifficulty(button.dataset.difficulty || "normal"));
});

nicknameInput?.addEventListener("input", () => {
  const limited = limitNickname(nicknameInput.value.replace(/[<>]/g, ""));
  if (nicknameInput.value !== limited) nicknameInput.value = limited;
  if (limited.trim()) savePlayerProfile(limited);
});

nicknameInput?.addEventListener("change", () => savePlayerProfile(nicknameInput.value));
nicknameInput?.addEventListener("blur", () => savePlayerProfile(nicknameInput.value));

window.catsOwlDifficulty = {
  get: () => selectedDifficulty,
  set: (difficulty) => setDifficulty(difficulty),
  settings: DIFFICULTY_SETTINGS,
};

window.CatsOwlMusic = {
  playWorld: (worldId) => startMusicForWorld(worldId),
  playLevel: (levelIndex) => startMusicForKey(musicKeyForLevel(levelIndex)),
  current: () => ({ key: music.key, pattern: music.pattern, audioSrc: music.audioSrc }),
  stop: stopMusic,
  tracks: MUSIC_BY_WORLD,
};

startBtn.addEventListener("click", startGame);
recordsBtn?.addEventListener("click", openRunHistory);
homeRecordsBtn?.addEventListener("click", openRunHistory);
scoreRecordsBtn?.addEventListener("click", openRunHistory);
scoreSummaryCloseBtn?.addEventListener("click", closeScoreSummaryPanel);
scoreContinueBtn?.addEventListener("click", continueNextLevel);
scoreRetryBtn?.addEventListener("click", replayCurrentLevel);
runHistoryCloseBtn?.addEventListener("click", closeRunHistory);
clearHistoryBtn?.addEventListener("click", clearLocalScoreRecords);

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
syncDifficultyButtons();
syncPlayerProfileInput();
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
