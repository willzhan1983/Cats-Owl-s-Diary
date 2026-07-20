/* Difficulty-aware Mist Swamp quiz pool and one quiz task per level. */
(function setupMistSwampQuizBank() {
  if (typeof quizBank === "undefined" || typeof levels === "undefined") return;

  const MIST_SWAMP_WORLD_ID = "mist_swamp";
  const MIST_SWAMP_QUIZ_KEY = "mistSwampShared";
  const questions = [
    { difficulty: "easy", title: "雾灯数学题", question: "已经点亮 1 盏雾灯，再点亮 2 盏，一共有几盏？", options: ["2", "3", "4", "5"], answer: 1 },
    { difficulty: "easy", title: "迷雾语文题", question: "“迷雾”最接近下面哪个意思？", options: ["让远处看不清的雾", "明亮的阳光", "清澈的河水", "整齐的木桥"], answer: 0 },
    { difficulty: "easy", title: "孢子数学题", question: "路边有 2 个发光孢子，又找到 2 个，一共有几个？", options: ["3", "4", "5", "6"], answer: 1 },
    { difficulty: "easy", title: "光亮英语题", question: "英文 light 是什么意思？", options: ["光", "雾", "桥", "泥"], answer: 0 },
    { difficulty: "normal", title: "沼泽英语题", question: "英文 fog 是什么意思？", options: ["桥", "光", "雾", "灯"], answer: 2 },
    { difficulty: "normal", title: "萤火虫科学题", question: "萤火虫为什么能在夜里被看到？", options: ["身体会发光", "翅膀会下雨", "脚会变长", "会搬木桥"], answer: 0 },
    { difficulty: "normal", title: "木桥英语题", question: "英文 bridge 是什么意思？", options: ["沼泽", "木桥", "雾灯", "萤火虫"], answer: 1 },
    { difficulty: "normal", title: "安全探索题", question: "雾很浓时，怎样探索更安全？", options: ["跟着发光线索慢慢走", "闭着眼睛快跑", "跳进软泥里", "关掉所有灯"], answer: 0 },
    { difficulty: "hard", title: "颜色逻辑题", question: "顺序是黄、蓝、紫、绿，蓝色后面是什么？", options: ["黄", "紫", "绿", "红"], answer: 1 },
    { difficulty: "hard", title: "雾灯计算题", question: "3 盏雾灯每盏需要 1 个光之孢子，一共需要几个？", options: ["1", "2", "3", "4"], answer: 2 },
    { difficulty: "hard", title: "路线判断题", question: "真萤火虫依次经过黄、蓝、紫三个光点，第二个光点是什么颜色？", options: ["黄", "蓝", "紫", "绿"], answer: 1 },
    { difficulty: "hard", title: "光线科学题", question: "点亮雾灯后为什么更容易看清道路？", options: ["有更多光照到道路和物体上", "雾会变成木板", "泥浆会飞走", "桥会自己移动"], answer: 0 },
    { difficulty: "crazy", title: "沼泽综合题", question: "light 是光，bridge 是桥。哪一项是“用光照亮桥”？", options: ["Use light on the bridge", "Hide the bridge", "Turn off every light", "Make more fog"], answer: 0 },
    { difficulty: "crazy", title: "循环顺序题", question: "黄、蓝、紫、绿重复排列，第 7 个颜色是什么？", options: ["黄", "蓝", "紫", "绿"], answer: 2 },
    { difficulty: "crazy", title: "孢子综合题", question: "有 4 个光之孢子，用掉 3 个后又找到 2 个，还剩几个？", options: ["2", "3", "4", "5"], answer: 1 },
    { difficulty: "crazy", title: "探索英语题", question: "Follow the light across the bridge 最接近哪个意思？", options: ["跟着光走过木桥", "关灯躲在桥下", "把木桥藏起来", "制造更多迷雾"], answer: 0 },
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
    { difficulty: "normal", title: "守护者观察题", question: "发现守护者被黑雾包住时，第一步应该做什么？", options: ["观察线索并点亮雾灯", "马上逃走", "拆掉木桥", "吹灭所有灯"], answer: 0 },
    { difficulty: "normal", title: "守护者安抚题", question: "泥浆怪安静下来后，怎样帮助它更合适？", options: ["温柔安抚并继续净化", "向它扔泥巴", "把它独自留下", "关掉萤火虫灯笼"], answer: 0 },
    { difficulty: "hard", title: "守护者判断题", question: "帮助被困住的沼泽守护者，最重要的是什么？", options: ["观察线索并温柔净化", "直接伤害它", "关掉所有灯", "把桥拆掉"], answer: 0 },
    { difficulty: "hard", title: "净化顺序题", question: "净化泥浆怪的正确顺序是什么？", options: ["点亮雾灯、清除泡泡、使用灯笼", "先拆桥再关灯", "先制造迷雾再逃走", "只收集木板"], answer: 0 },
    { difficulty: "hard", title: "友善判断题", question: "为什么不应该用强力攻击对付泥浆怪？", options: ["它是被黑雾困住的守护者", "它不会移动", "木桥太短", "萤火虫不喜欢数学"], answer: 0 },
    { difficulty: "crazy", title: "守护者综合题", question: "雾灯、光之孢子和萤火虫灯笼的共同作用是什么？", options: ["带来光并驱散黑雾", "制造更多泥浆", "藏起正确路线", "让木桥消失"], answer: 0 },
    { difficulty: "crazy", title: "最终阶段题", question: "三盏大雾灯已亮、泥浆泡泡已清除，下一步是什么？", options: ["用萤火虫灯笼为核心充能", "重新弄灭三盏灯", "跳进软泥", "离开沼泽"], answer: 0 },
    { difficulty: "crazy", title: "安全善意题", question: "哪种做法既安全又能帮助守护者？", options: ["避开软泥、跟随光点并完成净化", "闭眼冲进泥浆", "破坏所有雾灯", "把发光孢子藏起来"], answer: 0 },
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
