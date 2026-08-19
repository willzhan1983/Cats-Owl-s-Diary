/* Difficulty-aware Riverside Dock quiz pool with stable same-run assignments. */
(function setupRiversideDockQuizBank(globalScope) {
  if (typeof quizBank === "undefined" || typeof levels === "undefined") return;

  const KEY = "riversideDockShared";
  const catalog = [
    { id: "rd-easy-math-1", category: "math", difficulty: "easy", question: "找到 2 块木板，又找到 1 块，一共有几块？", options: ["2", "3", "4", "5"], answer: 1 },
    { id: "rd-easy-math-2", category: "math", difficulty: "easy", question: "一只小船需要 1 支船桨，两只小船共需要几支？", options: ["1", "2", "3", "4"], answer: 1 },
    { id: "rd-easy-science-1", category: "science", difficulty: "easy", question: "在水边玩耍时，哪种做法更安全？", options: ["和大人一起并远离深水", "独自走进深水", "站在湿滑石头上跳", "把救生圈藏起来"], answer: 0 },
    { id: "rd-easy-language-1", category: "language", difficulty: "easy", question: "“先看水位，再等绿灯”中，第一步是什么？", options: ["看水位", "等绿灯", "扔包裹", "跑过桥"], answer: 0 },
    { id: "rd-easy-english-1", category: "english", difficulty: "easy", question: "boat 的中文意思是？", options: ["小船", "木桥", "绳子", "码头"], answer: 0 },
    { id: "rd-easy-english-2", category: "english", difficulty: "easy", question: "river 的中文意思是？", options: ["森林", "河流", "山顶", "学校"], answer: 1 },

    { id: "rd-normal-math-1", category: "math", difficulty: "normal", question: "4 块桥板平均放在 2 处，每处几块？", options: ["1", "2", "3", "4"], answer: 1 },
    { id: "rd-normal-math-2", category: "math", difficulty: "normal", question: "还剩 120 秒，用了 35 秒，还剩多少秒？", options: ["75", "80", "85", "95"], answer: 2 },
    { id: "rd-normal-science-1", category: "science", difficulty: "normal", question: "木头通常能浮在水面，主要因为它的平均密度怎样？", options: ["比水小", "比水大很多", "和石头一样", "与水无关"], answer: 0 },
    { id: "rd-normal-language-1", category: "language", difficulty: "normal", question: "路线是“向右、向上、到码头”，正确顺序是？", options: ["右、上、码头", "上、右、码头", "码头、右、上", "右、码头、上"], answer: 0 },
    { id: "rd-normal-english-1", category: "english", difficulty: "normal", question: "Which word means “船桨”?", options: ["paddle", "bridge", "river", "safe"], answer: 0 },
    { id: "rd-normal-english-2", category: "english", difficulty: "normal", question: "Which word means “安全的”?", options: ["safe", "broken", "deep", "fast"], answer: 0 },

    { id: "rd-hard-math-1", category: "math", difficulty: "hard", question: "短、中、长桥板分别长 2、3、4 米，总长多少米？", options: ["7", "8", "9", "10"], answer: 2 },
    { id: "rd-hard-math-2", category: "math", difficulty: "hard", question: "125 秒内两次错误各扣 3 秒，还剩多少秒？", options: ["116", "117", "118", "119"], answer: 3 },
    { id: "rd-hard-science-1", category: "science", difficulty: "hard", question: "河水受太阳照射变成水蒸气，这个过程叫作什么？", options: ["蒸发", "凝结", "结冰", "沉淀"], answer: 0 },
    { id: "rd-hard-language-1", category: "language", difficulty: "hard", question: "“水位安全以后才能确认绿灯”说明两个步骤是什么关系？", options: ["有先后顺序", "完全无关", "可以随意省略", "必须倒着做"], answer: 0 },
    { id: "rd-hard-english-1", category: "english", difficulty: "hard", question: "Choose the correct sentence for “这座桥是安全的”。", options: ["The bridge is safe.", "The river is a paddle.", "The boat is a rope.", "Safe is broken."], answer: 0 },
    { id: "rd-hard-science-2", category: "science", difficulty: "hard", question: "发现河水突然上涨时，最合适的做法是？", options: ["回到高处安全区", "立刻下水", "站到桥边拍水", "独自划船"], answer: 0 },

    { id: "rd-crazy-math-1", category: "math", difficulty: "crazy", question: "6 块木板每块长 125 厘米，总长多少厘米？", options: ["625", "700", "750", "800"], answer: 2 },
    { id: "rd-crazy-math-2", category: "math", difficulty: "crazy", question: "110 秒内错 3 次，每次扣 5 秒，还剩多少秒？", options: ["90", "95", "100", "105"], answer: 1 },
    { id: "rd-crazy-science-1", category: "science", difficulty: "crazy", question: "救生圈能帮助人在水面保持漂浮，主要利用了什么？", options: ["浮力", "磁力", "静电", "声音"], answer: 0 },
    { id: "rd-crazy-language-1", category: "language", difficulty: "crazy", question: "“观察水位—确认信号—携带包裹—安全渡河”的第三步是？", options: ["观察水位", "确认信号", "携带包裹", "安全渡河"], answer: 2 },
    { id: "rd-crazy-english-1", category: "english", difficulty: "crazy", question: "Which instruction means “等绿灯再过桥”?", options: ["Wait for the green light before crossing.", "Throw the paddle into the river.", "Run when the light is red.", "Leave the package behind."], answer: 0 },
    { id: "rd-crazy-science-2", category: "science", difficulty: "crazy", question: "雨水进入河流，河水蒸发形成水蒸气，之后最可能发生什么？", options: ["水蒸气凝结成云", "河流变成木板", "云变成绳子", "救生圈沉入土里"], answer: 0 },
  ];

  const runState = { id: 0, difficulty: null, bag: [], assignments: new Map() };

  function shuffled(list) {
    const copy = list.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function cloneQuestion(question) {
    return question ? { ...question, options: [...question.options] } : null;
  }

  function shuffleOptions(question) {
    const options = shuffled(question.options.map((option, index) => ({ option, index })));
    return {
      ...question,
      options: options.map((entry) => entry.option),
      answer: options.findIndex((entry) => entry.index === question.answer),
    };
  }

  function poolFor(difficulty) {
    const modes = ["easy", "normal", "hard", "crazy"];
    const target = modes.includes(difficulty) ? difficulty : "normal";
    for (let rank = modes.indexOf(target); rank >= 0; rank -= 1) {
      const pool = catalog.filter((entry) => entry.difficulty === modes[rank]);
      if (pool.length) return pool;
    }
    return catalog.slice(0, 6);
  }

  function beginRun(difficulty = "normal") {
    const normalized = ["easy", "normal", "hard", "crazy"].includes(difficulty) ? difficulty : "normal";
    runState.id += 1;
    runState.difficulty = normalized;
    runState.bag = shuffled(poolFor(normalized));
    runState.assignments.clear();
    return runState.id;
  }

  function assign(levelId, difficulty = "normal") {
    if (runState.difficulty !== difficulty || !runState.id) beginRun(difficulty);
    const key = `${runState.id}:${runState.difficulty}:${levelId}`;
    if (!runState.assignments.has(key)) {
      if (!runState.bag.length) runState.bag = shuffled(poolFor(runState.difficulty));
      runState.assignments.set(key, shuffleOptions(runState.bag.pop()));
    }
    return cloneQuestion(runState.assignments.get(key));
  }

  function runSnapshot() {
    return {
      id: runState.id,
      difficulty: runState.difficulty,
      assignedLevels: runState.assignments.size,
      remaining: runState.bag.length,
    };
  }

  if (!Array.isArray(quizBank[KEY])) quizBank[KEY] = [];
  const existingIds = new Set(quizBank[KEY].map((entry) => entry.id));
  for (const question of catalog) {
    if (!existingIds.has(question.id)) quizBank[KEY].push(question);
  }

  const placements = {
    riverside_dock_entrance: { x: 650, y: 410, name: "码头路线题", animal: "language" },
    riverside_paddle_search: { x: 620, y: 408, name: "水流观察题", animal: "english" },
    riverside_bridge_repair: { x: 820, y: 408, name: "木桥工程题", animal: "math" },
    riverside_safe_crossing: { x: 690, y: 408, name: "安全渡河题", animal: "science" },
  };
  for (const level of levels.filter((entry) => entry.world === "riverside_dock")) {
    if (level.tasks.some((task) => task.riversideDockShared)) continue;
    const placement = placements[level.id];
    if (!placement) continue;
    level.tasks.push({
      ...placement,
      id: `rd_quiz_${level.id}`,
      speech: "完成码头任务后，回答一道四年级题。",
      quizKey: KEY,
      quiz: null,
      kind: "quiz",
      requiresCoreTasks: true,
      riversideDockShared: true,
      done: false,
      progress: 0,
    });
  }

  function refreshCurrentRiversideLevel() {
    if (typeof state === "undefined" || !state || typeof resetGame !== "function") return;
    const level = levels[state.levelIndex];
    if (level?.world !== "riverside_dock") return;
    const wasRunning = state.running;
    resetGame(state.levelIndex, state.hearts > 0);
    if (wasRunning) {
      state.running = true;
      startBtn.textContent = text.restart;
    }
  }

  globalScope.CATS_OWLS_RIVERSIDE_DOCK_QUIZ = Object.freeze({
    key: KEY,
    beginRun,
    assign,
    runSnapshot,
    catalog: Object.freeze(catalog.map((entry) => Object.freeze({ ...entry, options: Object.freeze([...entry.options]) }))),
  });
  refreshCurrentRiversideLevel();
})(typeof window !== "undefined" ? window : globalThis);
