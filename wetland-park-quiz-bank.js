/* Difficulty-aware Wetland Park quiz pool with stable same-run assignments. */
(function setupWetlandParkQuizBank(globalScope) {
  if (typeof quizBank === "undefined" || typeof levels === "undefined") return;

  const KEY = "wetlandParkShared";
  const catalog = [
    { id: "wp-e1", category: "math", difficulty: "easy", question: "点亮 2 座瞭望台，又点亮 1 盏灯，一共点亮几处？", options: ["2", "3", "4", "5"], answer: 1 },
    { id: "wp-e2", category: "english", difficulty: "easy", question: "fog 的中文意思是？", options: ["迷雾", "荷叶", "小船", "木桥"], answer: 0 },
    { id: "wp-e3", category: "language", difficulty: "easy", question: "先看水纹，再看风向，第一步是什么？", options: ["看水纹", "看风向", "跳浮木", "开水闸"], answer: 0 },
    { id: "wp-e4", category: "logic", difficulty: "easy", question: "湿地里的小鸭迷路了，应该先做什么？", options: ["找安全路线", "跑进深水", "关掉灯", "扔掉地图"], answer: 0 },
    { id: "wp-e5", category: "reading", difficulty: "easy", question: "“等水流变缓再跳”提醒我们什么？", options: ["注意时机", "一直快跑", "不看水面", "跳进深水"], answer: 0 },
    { id: "wp-e6", category: "english", difficulty: "easy", question: "reed 的中文意思是？", options: ["芦苇", "石头", "帽子", "月亮"], answer: 0 },
    { id: "wp-n1", category: "math", difficulty: "normal", question: "3 盏净化灯每盏需要 2 颗光点，一共需要几颗？", options: ["5", "6", "7", "8"], answer: 1 },
    { id: "wp-n2", category: "english", difficulty: "normal", question: "Which word means “湿地”？", options: ["wetland", "bridge", "paddle", "cloud"], answer: 0 },
    { id: "wp-n3", category: "language", difficulty: "normal", question: "水纹、风向、鸟影三个线索的作用是？", options: ["判断路线", "计算分数", "装饰背包", "改变颜色"], answer: 0 },
    { id: "wp-n4", category: "logic", difficulty: "normal", question: "要让光线经过晶座，应该怎样做？", options: ["调整反光镜", "把晶座藏起", "踩进深水", "关掉所有灯"], answer: 0 },
    { id: "wp-n5", category: "reading", difficulty: "normal", question: "“已点亮的灯不熄灭”说明失败后怎样？", options: ["保留已完成进度", "必须从头开始", "失去所有道具", "不能再尝试"], answer: 0 },
    { id: "wp-n6", category: "math", difficulty: "normal", question: "两条安全路线各有 4 个落点，一共有几个落点？", options: ["6", "7", "8", "9"], answer: 2 },
    { id: "wp-h1", category: "math", difficulty: "hard", question: "水流每 15 秒变缓一次，45 秒内会变缓几次？", options: ["2", "3", "4", "5"], answer: 1 },
    { id: "wp-h2", category: "english", difficulty: "hard", question: "Choose the safe instruction.", options: ["Wait for calm water before jumping.", "Jump into deep water alone.", "Turn off the lookout light.", "Ignore the fog."], answer: 0 },
    { id: "wp-h3", category: "language", difficulty: "hard", question: "“观察—判断—行动”最强调什么？", options: ["先后顺序", "随意猜测", "重复返回", "忽略提示"], answer: 0 },
    { id: "wp-h4", category: "logic", difficulty: "hard", question: "巨鳄被迷雾困住，正确做法是？", options: ["帮助净化迷雾", "攻击巨鳄", "躲开所有伙伴", "破坏晶核"], answer: 0 },
    { id: "wp-h5", category: "reading", difficulty: "hard", question: "如果风向改变，最合理的下一步是？", options: ["重新观察鸟影和水纹", "沿旧方向冲刺", "关掉瞭望台", "忽略变化"], answer: 0 },
    { id: "wp-h6", category: "math", difficulty: "hard", question: "5 段光路中已有 3 段正确，还差几段？", options: ["1", "2", "3", "4"], answer: 1 },
    { id: "wp-c1", category: "math", difficulty: "crazy", question: "4 面镜子每面转动 3 次，最多需要几次转动？", options: ["7", "10", "12", "14"], answer: 2 },
    { id: "wp-c2", category: "english", difficulty: "crazy", question: "Which sentence means “迷雾正在散开”？", options: ["The fog is clearing.", "The reed is sleeping.", "The bridge is a duck.", "The water is a map."], answer: 0 },
    { id: "wp-c3", category: "language", difficulty: "crazy", question: "“水流、雾团、浮木”依次出现时，应优先依据什么行动？", options: ["当前的安全提示", "上一次的猜测", "道具颜色", "计分高低"], answer: 0 },
    { id: "wp-c4", category: "logic", difficulty: "crazy", question: "净化晶核应在什么时候使用？", options: ["三轮净化完成、迷雾核心出现后", "进入地图前", "灯未点亮时", "随时丢进水里"], answer: 0 },
    { id: "wp-c5", category: "reading", difficulty: "crazy", question: "“错误路线会回到检查点”给玩家的帮助是？", options: ["可以根据线索重新尝试", "永远无法前进", "失去关卡资格", "跳过所有任务"], answer: 0 },
    { id: "wp-c6", category: "math", difficulty: "crazy", question: "安全窗口每次持续 8 秒，连续 3 次一共持续多少秒？", options: ["16", "20", "24", "28"], answer: 2 },
  ];
  const runState = { id: 0, difficulty: null, bag: [], assignments: new Map(), recentIds: [] };
  const modes = ["easy", "normal", "hard", "crazy"];
  const shuffled = (items) => items.slice().sort(() => Math.random() - 0.5);
  const clone = (question) => ({ ...question, options: [...question.options] });
  function poolFor(difficulty) {
    for (let rank = modes.indexOf(modes.includes(difficulty) ? difficulty : "normal"); rank >= 0; rank -= 1) {
      const pool = catalog.filter((question) => question.difficulty === modes[rank]);
      if (pool.length) return pool;
    }
    return catalog;
  }
  function beginRun(difficulty = "normal") {
    runState.id += 1;
    runState.difficulty = modes.includes(difficulty) ? difficulty : "normal";
    runState.bag = shuffled(poolFor(runState.difficulty));
    runState.assignments.clear();
    return runState.id;
  }
  function assign(levelId, difficulty = "normal") {
    if (!runState.id || runState.difficulty !== difficulty) beginRun(difficulty);
    const key = `${runState.id}:${levelId}`;
    if (!runState.assignments.has(key)) {
      if (!runState.bag.length) runState.bag = shuffled(poolFor(runState.difficulty));
      const question = clone(runState.bag.pop());
      const choices = shuffled(question.options.map((option, index) => ({ option, index })));
      question.options = choices.map((choice) => choice.option);
      question.answer = choices.findIndex((choice) => choice.index === question.answer);
      runState.assignments.set(key, question);
    }
    return clone(runState.assignments.get(key));
  }
  function runSnapshot() { return { id: runState.id, difficulty: runState.difficulty, assignedLevels: runState.assignments.size }; }
  quizBank[KEY] ||= [];
  const known = new Set(quizBank[KEY].map((question) => question.id));
  catalog.forEach((question) => { if (!known.has(question.id)) quizBank[KEY].push(question); });
  for (const level of levels.filter((entry) => entry.world === "wetland_park")) {
    if (!level.tasks.some((task) => task.wetlandParkShared)) level.tasks.push({ x: 800, y: 400, id: `wp_quiz_${level.id}`, name: "湿地观察题", animal: "logic", speech: "完成任务后回答一道湿地观察题。", quizKey: KEY, quiz: null, kind: "quiz", requiresCoreTasks: true, wetlandParkShared: true, done: false, progress: 0 });
  }
  globalScope.CATS_OWLS_WETLAND_PARK_QUIZ = Object.freeze({ key: KEY, beginRun, assign, runSnapshot, catalog: Object.freeze(catalog.map((question) => Object.freeze(clone(question)))) });
  globalScope.CATS_OWLS_REFRESH_WETLAND_PARK_QUIZ?.();
})(typeof window !== "undefined" ? window : globalThis);
