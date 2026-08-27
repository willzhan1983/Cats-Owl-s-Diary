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
    { id: "rd-easy-math-3", category: "math", difficulty: "easy", question: "码头上有 3 卷绳子，又拿来 2 卷，一共有几卷？", options: ["4", "5", "6", "7"], answer: 1 },
    { id: "rd-easy-math-4", category: "math", difficulty: "easy", question: "有 5 块桥板，用掉 2 块，还剩几块？", options: ["2", "3", "4", "5"], answer: 1 },
    { id: "rd-easy-science-2", category: "science", difficulty: "easy", question: "看到水边的救生圈，应该怎么做？", options: ["放在容易拿到的安全位置", "拿来当球踢", "丢进草丛", "藏到包里"], answer: 0 },
    { id: "rd-easy-science-3", category: "science", difficulty: "easy", question: "红灯亮着时，应该怎么做？", options: ["停下等待", "快跑通过", "跳进水里", "把灯关掉"], answer: 0 },
    { id: "rd-easy-language-2", category: "language", difficulty: "easy", question: "水流变快了，应该先做什么？", options: ["回到岸边安全处", "马上下水", "站到湿石头上", "追着水跑"], answer: 0 },
    { id: "rd-easy-english-3", category: "english", difficulty: "easy", question: "paddle 的中文意思是？", options: ["船桨", "雨伞", "路牌", "石头"], answer: 0 },

    { id: "rd-normal-math-1", category: "math", difficulty: "normal", question: "4 块桥板平均放在 2 处，每处几块？", options: ["1", "2", "3", "4"], answer: 1 },
    { id: "rd-normal-math-2", category: "math", difficulty: "normal", question: "还剩 120 秒，用了 35 秒，还剩多少秒？", options: ["75", "80", "85", "95"], answer: 2 },
    { id: "rd-normal-science-1", category: "science", difficulty: "normal", question: "木头通常能浮在水面，主要因为它的平均密度怎样？", options: ["比水小", "比水大很多", "和石头一样", "与水无关"], answer: 0 },
    { id: "rd-normal-language-1", category: "language", difficulty: "normal", question: "路线是“向右、向上、到码头”，正确顺序是？", options: ["右、上、码头", "上、右、码头", "码头、右、上", "右、码头、上"], answer: 0 },
    { id: "rd-normal-english-1", category: "english", difficulty: "normal", question: "Which word means “船桨”?", options: ["paddle", "bridge", "river", "safe"], answer: 0 },
    { id: "rd-normal-english-2", category: "english", difficulty: "normal", question: "Which word means “安全的”?", options: ["safe", "broken", "deep", "fast"], answer: 0 },
    { id: "rd-normal-math-3", category: "math", difficulty: "normal", question: "3 条小船每条配 2 支船桨，一共需要几支？", options: ["5", "6", "7", "8"], answer: 1 },
    { id: "rd-normal-math-4", category: "math", difficulty: "normal", question: "长桥板 8 米，短桥板 3 米，它们相差多少米？", options: ["4", "5", "6", "11"], answer: 1 },
    { id: "rd-normal-science-2", category: "science", difficulty: "normal", question: "准备渡河前，最先需要确认什么？", options: ["水位是否安全", "包裹颜色", "云朵形状", "鞋带长短"], answer: 0 },
    { id: "rd-normal-science-3", category: "science", difficulty: "normal", question: "救生圈放入水中通常会浮起来，说明它怎样？", options: ["能受到浮力作用", "没有重量", "会发光", "能自己游泳"], answer: 0 },
    { id: "rd-normal-language-2", category: "language", difficulty: "normal", question: "先固定短桥板，再固定中桥板，下一步应是？", options: ["固定长桥板", "拆掉短桥板", "马上渡河", "把绳子扔掉"], answer: 0 },
    { id: "rd-normal-english-3", category: "english", difficulty: "normal", question: "Which word means “木桥”?", options: ["bridge", "boat", "rope", "light"], answer: 0 },

    { id: "rd-hard-math-1", category: "math", difficulty: "hard", question: "短、中、长桥板分别长 2、3、4 米，总长多少米？", options: ["7", "8", "9", "10"], answer: 2 },
    { id: "rd-hard-math-2", category: "math", difficulty: "hard", question: "125 秒内两次错误各扣 3 秒，还剩多少秒？", options: ["116", "117", "118", "119"], answer: 3 },
    { id: "rd-hard-science-1", category: "science", difficulty: "hard", question: "河水受太阳照射变成水蒸气，这个过程叫作什么？", options: ["蒸发", "凝结", "结冰", "沉淀"], answer: 0 },
    { id: "rd-hard-language-1", category: "language", difficulty: "hard", question: "“水位安全以后才能确认绿灯”说明两个步骤是什么关系？", options: ["有先后顺序", "完全无关", "可以随意省略", "必须倒着做"], answer: 0 },
    { id: "rd-hard-english-1", category: "english", difficulty: "hard", question: "Choose the correct sentence for “这座桥是安全的”。", options: ["The bridge is safe.", "The river is a paddle.", "The boat is a rope.", "Safe is broken."], answer: 0 },
    { id: "rd-hard-science-2", category: "science", difficulty: "hard", question: "发现河水突然上涨时，最合适的做法是？", options: ["回到高处安全区", "立刻下水", "站到桥边拍水", "独自划船"], answer: 0 },
    { id: "rd-hard-math-3", category: "math", difficulty: "hard", question: "一段木桥长 3 米，另一段长 250 厘米，两段一共长多少厘米？", options: ["500", "530", "550", "650"], answer: 2 },
    { id: "rd-hard-math-4", category: "math", difficulty: "hard", question: "修桥用了 4 块 5 米长板和 3 块 4 米短板，长板总长比短板总长多几米？", options: ["2", "4", "6", "8"], answer: 3 },
    { id: "rd-hard-science-3", category: "science", difficulty: "hard", question: "水蒸气遇冷变成小水滴，这个过程叫作什么？", options: ["凝结", "蒸发", "融化", "过滤"], answer: 0 },
    { id: "rd-hard-language-2", category: "language", difficulty: "hard", question: "“水位安全、绿灯亮起后再渡河”这句话强调了什么？", options: ["两个条件都满足再行动", "只看水位就够了", "只看绿灯就够了", "可以边走边判断"], answer: 0 },
    { id: "rd-hard-english-2", category: "english", difficulty: "hard", question: "Choose the correct instruction for “请把包裹带到对岸”。", options: ["Take the package across the river.", "Throw the package away.", "Leave the boat in the tree.", "Close the river."], answer: 0 },
    { id: "rd-hard-science-4", category: "science", difficulty: "hard", question: "为什么湿滑的桥面要慢慢走？", options: ["可以减少滑倒风险", "能让桥变长", "会让水位下降", "能把红灯变绿"], answer: 0 },

    { id: "rd-crazy-math-1", category: "math", difficulty: "crazy", question: "6 块木板每块长 125 厘米，总长多少厘米？", options: ["625", "700", "750", "800"], answer: 2 },
    { id: "rd-crazy-math-2", category: "math", difficulty: "crazy", question: "110 秒内错 3 次，每次扣 5 秒，还剩多少秒？", options: ["90", "95", "100", "105"], answer: 1 },
    { id: "rd-crazy-science-1", category: "science", difficulty: "crazy", question: "救生圈能帮助人在水面保持漂浮，主要利用了什么？", options: ["浮力", "磁力", "静电", "声音"], answer: 0 },
    { id: "rd-crazy-language-1", category: "language", difficulty: "crazy", question: "“观察水位—确认信号—携带包裹—安全渡河”的第三步是？", options: ["观察水位", "确认信号", "携带包裹", "安全渡河"], answer: 2 },
    { id: "rd-crazy-english-1", category: "english", difficulty: "crazy", question: "Which instruction means “等绿灯再过桥”?", options: ["Wait for the green light before crossing.", "Throw the paddle into the river.", "Run when the light is red.", "Leave the package behind."], answer: 0 },
    { id: "rd-crazy-science-2", category: "science", difficulty: "crazy", question: "雨水进入河流，河水蒸发形成水蒸气，之后最可能发生什么？", options: ["水蒸气凝结成云", "河流变成木板", "云变成绳子", "救生圈沉入土里"], answer: 0 },
    { id: "rd-crazy-math-3", category: "math", difficulty: "crazy", question: "4 段桥面每段长 180 厘米，桥面总长多少厘米？", options: ["540", "620", "720", "820"], answer: 2 },
    { id: "rd-crazy-math-4", category: "math", difficulty: "crazy", question: "渡河倒计时 150 秒，检查水位用 28 秒、确认信号用 17 秒，还剩多少秒？", options: ["95", "100", "105", "115"], answer: 2 },
    { id: "rd-crazy-science-3", category: "science", difficulty: "crazy", question: "木头能浮在水面，而石头通常下沉，主要和什么有关？", options: ["物体与水的密度比较", "物体的颜色", "天气冷热", "名字长短"], answer: 0 },
    { id: "rd-crazy-science-4", category: "science", difficulty: "crazy", question: "下雨后河水可能上涨，最合理的安全安排是？", options: ["重新检查水位再决定是否渡河", "忽略水位照常通过", "站在河边比谁跳得远", "把警示牌盖住"], answer: 0 },
    { id: "rd-crazy-language-2", category: "language", difficulty: "crazy", question: "按“检查水位、确认绿灯、带好包裹、渡河”的顺序，确认绿灯排第几步？", options: ["第一步", "第二步", "第三步", "第四步"], answer: 1 },
    { id: "rd-crazy-english-2", category: "english", difficulty: "crazy", question: "Which sentence correctly explains the safety rule?", options: ["Cross only when the water is safe and the light is green.", "Cross faster when the light is red.", "A rope makes deep water safe.", "Leave the package in the river."], answer: 0 },
  ];

  const runState = { id: 0, difficulty: null, bag: [], assignments: new Map(), recentIds: [] };

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

  function newBag(difficulty) {
    const pool = poolFor(difficulty);
    const unusedRecently = pool.filter((entry) => !runState.recentIds.includes(entry.id));
    return shuffled(unusedRecently.length ? unusedRecently : pool);
  }

  function remember(question) {
    runState.recentIds = [question.id, ...runState.recentIds.filter((id) => id !== question.id)].slice(0, 8);
  }

  function beginRun(difficulty = "normal") {
    const normalized = ["easy", "normal", "hard", "crazy"].includes(difficulty) ? difficulty : "normal";
    runState.id += 1;
    runState.difficulty = normalized;
    runState.bag = newBag(normalized);
    runState.assignments.clear();
    return runState.id;
  }

  function assign(levelId, difficulty = "normal") {
    if (runState.difficulty !== difficulty || !runState.id) beginRun(difficulty);
    const key = `${runState.id}:${runState.difficulty}:${levelId}`;
    if (!runState.assignments.has(key)) {
      if (!runState.bag.length) runState.bag = newBag(runState.difficulty);
      const question = shuffleOptions(runState.bag.pop());
      remember(question);
      runState.assignments.set(key, question);
    }
    return cloneQuestion(runState.assignments.get(key));
  }

  function runSnapshot() {
    return {
      id: runState.id,
      difficulty: runState.difficulty,
      assignedLevels: runState.assignments.size,
      remaining: runState.bag.length,
      recentIds: [...runState.recentIds],
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
    } else startBtn.textContent = text.start;
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
