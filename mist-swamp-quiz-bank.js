/* Difficulty-aware Mist Swamp quiz pool and one quiz task per level. */
(function setupMistSwampQuizBank() {
  if (typeof quizBank === "undefined" || typeof levels === "undefined") return;

  const MIST_SWAMP_WORLD_ID = "mist_swamp";
  const MIST_SWAMP_QUIZ_KEY = "mistSwampShared";
  const questions = [
    { difficulty: "easy", title: "雾灯数学题", question: "已经点亮 1 盏雾灯，再点亮 2 盏，一共有几盏？", options: ["2", "3", "4", "5"], answer: 1 },
    { difficulty: "easy", title: "迷雾语文题", question: "“迷雾”最接近下面哪个意思？", options: ["让远处看不清的雾", "明亮的阳光", "清澈的河水", "整齐的木桥"], answer: 0 },
    { difficulty: "normal", title: "沼泽英语题", question: "英文 fog 是什么意思？", options: ["桥", "光", "雾", "灯"], answer: 2 },
    { difficulty: "normal", title: "萤火虫科学题", question: "萤火虫为什么能在夜里被看到？", options: ["身体会发光", "翅膀会下雨", "脚会变长", "会搬木桥"], answer: 0 },
    { difficulty: "hard", title: "颜色逻辑题", question: "顺序是黄、蓝、紫、绿，蓝色后面是什么？", options: ["黄", "紫", "绿", "红"], answer: 1 },
    { difficulty: "crazy", title: "沼泽综合题", question: "light 是光，bridge 是桥。哪一项是“用光照亮桥”？", options: ["Use light on the bridge", "Hide the bridge", "Turn off every light", "Make more fog"], answer: 0 },
  ];
  const placements = [
    { level: "迷雾沼泽入口", x: 180, y: 300, name: "入口雾灯题", animal: "math" },
    { level: "萤火虫小径", x: 650, y: 390, name: "萤火虫观察题", animal: "science" },
    { level: "沉睡木桥", x: 350, y: 390, name: "木桥知识题", animal: "english" },
    { level: "迷雾核心", x: 500, y: 210, name: "迷雾核心题", animal: "language" },
  ];

  if (!Array.isArray(quizBank[MIST_SWAMP_QUIZ_KEY])) quizBank[MIST_SWAMP_QUIZ_KEY] = [];
  const existing = new Set(quizBank[MIST_SWAMP_QUIZ_KEY].map((question) => question.question));
  questions.forEach((question) => {
    if (!existing.has(question.question)) quizBank[MIST_SWAMP_QUIZ_KEY].push(question);
  });
  quizBank.mistSwampBoss = [
    { difficulty: "normal", title: "守护者理解题", question: "泥浆怪被黑雾困住了，我们应该怎么做？", options: ["帮助它恢复正常", "把沼泽弄得更脏", "抢走它的灯笼", "不理它"], answer: 0 },
    { difficulty: "hard", title: "守护者判断题", question: "帮助被困住的沼泽守护者，最重要的是什么？", options: ["观察线索并温柔净化", "直接伤害它", "关掉所有灯", "把桥拆掉"], answer: 0 },
    { difficulty: "crazy", title: "守护者综合题", question: "雾灯、光之孢子和萤火虫灯笼的共同作用是什么？", options: ["带来光并驱散黑雾", "制造更多泥浆", "藏起正确路线", "让木桥消失"], answer: 0 },
  ];

  placements.forEach((placement) => {
    const level = levels.find((entry) => entry.world === MIST_SWAMP_WORLD_ID && entry.name === placement.level);
    if (!level || level.tasks.some((task) => task.mistSwampShared)) return;
    level.tasks.push({
      x: placement.x,
      y: placement.y,
      name: placement.name,
      animal: placement.animal,
      speech: "完成一道迷雾沼泽小问题。",
      quizKey: MIST_SWAMP_QUIZ_KEY,
      quiz: null,
      kind: "quiz",
      done: false,
      progress: 0,
      mistSwampShared: true,
    });
  });

  function refreshCurrentMistSwampLevel() {
    if (typeof state === "undefined" || !state || typeof resetGame !== "function") return;
    if (levels[state.levelIndex]?.world !== MIST_SWAMP_WORLD_ID) return;
    const wasRunning = state.running;
    resetGame(state.levelIndex, state.levelIndex > 0);
    if (wasRunning) {
      state.running = true;
      state.introSeen = true;
      startBtn.textContent = text.restart;
    }
  }

  window.CATS_OWLS_MIST_SWAMP_QUIZ = {
    key: MIST_SWAMP_QUIZ_KEY,
    count: quizBank[MIST_SWAMP_QUIZ_KEY].length,
  };

  refreshCurrentMistSwampLevel();
})();
