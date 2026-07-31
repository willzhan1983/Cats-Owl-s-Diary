/* Difficulty-aware Acorn Town quiz pool and one gated quiz task per level. */
(function setupAcornTownQuizBank() {
  if (typeof quizBank === "undefined" || typeof levels === "undefined") return;

  const ACORN_TOWN_CORE_KEY = "acornTownCore";
  const ACORN_TOWN_BONUS_KEY = "acornTownBonus";
  const existingCoreQuestions = [
    { difficulty: "easy", mode: "core", title: "橡果镇基础题", question: "acorn 的中文意思是？", options: ["橡果", "苹果", "信件", "小桥"], answer: 0 },
    { difficulty: "easy", mode: "core", title: "橡果镇基础题", question: "Coco 找到 2 颗橡果，又找到 3 颗，一共有几颗？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "easy", mode: "core", title: "橡果镇基础题", question: "红色信件应该送到哪里？", options: ["红色收件人图标的邮箱", "没有图标的箱子", "橡果篮", "公告板"], answer: 0 },
    { difficulty: "easy", mode: "core", title: "橡果镇基础题", question: "收集到的橡果应该放进什么？", options: ["橡果篮", "河里", "路牌后面", "空邮箱"], answer: 0 },
    { difficulty: "easy", mode: "core", title: "橡果镇基础题", question: "带有桥和河流图案的路牌最可能通向哪里？", options: ["河畔码头", "苹果谷", "森林学校", "沼泽深处"], answer: 0 },
    { difficulty: "easy", mode: "core", title: "橡果镇基础题", question: "回答最后一题前应该先做什么？", options: ["完成小镇任务", "走进错误出口", "丢掉信件", "撞小推车"], answer: 0 },

    { difficulty: "normal", mode: "core", title: "橡果镇普通题", question: "已经送了 3 封信，还有 2 封，一共需要送几封？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "normal", mode: "core", title: "橡果镇普通题", question: "6 颗橡果平均分成 2 组，每组几颗？", options: ["2", "3", "4", "5"], answer: 1 },
    { difficulty: "normal", mode: "core", title: "Acorn Town Quiz", question: "Which word means “信”?", options: ["letter", "market", "bridge", "basket"], answer: 0 },
    { difficulty: "normal", mode: "core", title: "橡果镇普通题", question: "订单 A 需要什么？", options: ["2 颗橡果和 1 个红苹果", "3 颗橡果和 1 个青苹果", "1 颗橡果和 2 个红苹果", "只要 1 个青苹果"], answer: 0 },
    { difficulty: "normal", mode: "core", title: "橡果镇普通题", question: "信件送到错误邮箱时，最合适的做法是？", options: ["重新核对收件提示", "把信丢掉", "继续投错", "拆掉邮箱"], answer: 0 },
    { difficulty: "normal", mode: "core", title: "橡果镇普通题", question: "公告碎片编号是 1、2、3、4，正确顺序是？", options: ["1、2、3、4", "4、3、2、1", "2、4、1、3", "3、1、4、2"], answer: 0 },

    { difficulty: "hard", mode: "core", title: "橡果镇困难题", question: "有 8 颗橡果，用掉 3 颗，还剩几颗？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "hard", mode: "core", title: "橡果镇困难题", question: "订单 A 用 2 颗橡果，订单 B 用 3 颗，两单共用几颗？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "hard", mode: "core", title: "橡果镇困难题", question: "4 块正确碎片和 1 块干扰碎片放在一起，一共看到几块？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "hard", mode: "core", title: "Acorn Town Challenge", question: "Which word means “市集”?", options: ["market", "letter", "acorn", "route"], answer: 0 },
    { difficulty: "hard", mode: "core", title: "橡果镇困难题", question: "路线是“向右、向上、再向右”，正确顺序是？", options: ["右、上、右", "上、右、上", "右、右、下", "左、上、右"], answer: 0 },
    { difficulty: "hard", mode: "core", title: "橡果镇困难题", question: "确认收件人时，哪两项信息最有用？", options: ["名字和图标", "天气和时间", "篮子和小车", "树叶和石头"], answer: 0 },

    { difficulty: "crazy", mode: "core", title: "橡果镇综合挑战", question: "订单 A、B、C 分别用 2、3、2 颗橡果，一共用几颗？", options: ["5", "6", "7", "8"], answer: 2 },
    { difficulty: "crazy", mode: "core", title: "橡果镇综合挑战", question: "10 颗真橡果和 3 个假橡果放在一起，一共看到几个？", options: ["10", "11", "12", "13"], answer: 3 },
    { difficulty: "crazy", mode: "core", title: "橡果镇综合挑战", question: "剩余 95 秒，两次错误各扣 5 秒，还剩多少秒？", options: ["80", "85", "90", "95"], answer: 1 },
    { difficulty: "crazy", mode: "core", title: "橡果镇综合挑战", question: "看见 6 块公告碎片，其中 2 块是干扰项，正确碎片有几块？", options: ["3", "4", "5", "6"], answer: 1 },
    { difficulty: "crazy", mode: "core", title: "橡果镇综合挑战", question: "路线提示关闭后，怎样最容易找到码头？", options: ["按刚才记住的顺序走", "随便选一个出口", "一直撞小推车", "把碎片丢掉"], answer: 0 },
    { difficulty: "crazy", mode: "core", title: "橡果镇综合挑战", question: "完成橡果镇关卡的完整顺序是？", options: ["完成任务、找路线、回答题目", "回答题目、丢掉道具、回起点", "先选错路、再撞小车、最后答题", "只完成一项任务"], answer: 0 },
  ];

  const additionalCoreQuestions = [
    { difficulty: "easy", mode: "core", title: "橡果镇基础题", question: "一辆小推车开来时，最安全的做法是？", options: ["先停下并让车通过", "站在车道中间", "追着小车跑", "闭眼向前走"], answer: 0 },
    { difficulty: "easy", mode: "core", title: "橡果镇基础题", question: "3 封信送完 1 封，还剩几封？", options: ["1", "2", "3", "4"], answer: 1 },
    { difficulty: "normal", mode: "core", title: "橡果镇普通题", question: "每个篮子放 3 颗橡果，2 个篮子共放几颗？", options: ["5", "6", "7", "8"], answer: 1 },
    { difficulty: "normal", mode: "core", title: "Acorn Town Quiz", question: "Which word means “码头”?", options: ["dock", "letter", "market", "forest"], answer: 0 },
    { difficulty: "hard", mode: "core", title: "橡果镇困难题", question: "12 颗橡果平均放进 3 个篮子，每篮几颗？", options: ["3", "4", "5", "6"], answer: 1 },
    { difficulty: "hard", mode: "core", title: "橡果镇困难题", question: "先向右走 2 格，再向上走 1 格，最后向右走 2 格，一共走几格？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "crazy", mode: "core", title: "橡果镇综合挑战", question: "4 辆车每辆间隔 3 秒通过，第一辆通过后到第四辆通过共间隔几秒？", options: ["6", "9", "12", "15"], answer: 1 },
    { difficulty: "crazy", mode: "core", title: "橡果镇综合挑战", question: "订单要 8 颗橡果，已有 3 颗，又找到 2 颗，还缺几颗？", options: ["2", "3", "4", "5"], answer: 1 },
  ];

  const bonusQuestions = [
    { difficulty: "easy", mode: "bonus", title: "奖励谜题", question: "小小果实穿棕衣，松鼠见了最欢喜。它是什么？", options: ["橡果", "石头", "信封", "树叶"], answer: 0 },
    { difficulty: "easy", mode: "bonus", title: "奖励谜题", question: "有门没有房，信件肚里藏。它是什么？", options: ["邮箱", "果篮", "路牌", "小桥"], answer: 0 },
    { difficulty: "easy", mode: "bonus", title: "奖励谜题", question: "四四方方一张纸，写好名字去旅行。它是什么？", options: ["信件", "苹果", "车轮", "橡果"], answer: 0 },
    { difficulty: "easy", mode: "bonus", title: "奖励谜题", question: "站在路边不说话，箭头帮你指方向。它是什么？", options: ["路牌", "邮箱", "篮子", "叶子"], answer: 0 },
    { difficulty: "normal", mode: "bonus", title: "奖励谜题", question: "什么东西越分享，大家拥有得越多？", options: ["快乐", "石头", "空盒", "泥巴"], answer: 0 },
    { difficulty: "normal", mode: "bonus", title: "奖励谜题", question: "什么“车”不在路上跑，只在电脑里帮你装商品？", options: ["购物车图标", "火车", "汽车", "自行车"], answer: 0 },
    { difficulty: "normal", mode: "bonus", title: "奖励谜题", question: "一条路有三个箭头：右、上、右。第二个箭头指向哪里？", options: ["上", "下", "左", "右"], answer: 0 },
    { difficulty: "normal", mode: "bonus", title: "奖励谜题", question: "两颗橡果加两颗橡果，哪一个选项不是总数？", options: ["5", "4", "四", "2+2"], answer: 0 },
    { difficulty: "hard", mode: "bonus", title: "奖励谜题", question: "我不是鸟，却能带着消息飞到朋友手里。我是什么？", options: ["信件", "橡果", "小车", "路灯"], answer: 0 },
    { difficulty: "hard", mode: "bonus", title: "奖励谜题", question: "一张四方纸剪掉一个角，新的图形一共有几个角？", options: ["5", "3", "4", "2"], answer: 0 },
    { difficulty: "hard", mode: "bonus", title: "奖励谜题", question: "一辆车从左向右开，掉头后方向是什么？", options: ["从右向左", "继续向右", "向上", "不移动"], answer: 0 },
    { difficulty: "hard", mode: "bonus", title: "奖励谜题", question: "3 个订单各用 2 颗橡果，再退回 1 颗，实际用了几颗？", options: ["5", "6", "4", "7"], answer: 0 },
    { difficulty: "crazy", mode: "bonus", title: "奖励谜题", question: "四辆车依次编号 1、2、3、4，奇数车向右，哪两辆向右？", options: ["1 和 3", "2 和 4", "1 和 2", "3 和 4"], answer: 0 },
    { difficulty: "crazy", mode: "bonus", title: "奖励谜题", question: "路线右、上、右倒着读是什么？", options: ["右、上、右", "左、下、左", "上、右、右", "右、右、上"], answer: 0 },
    { difficulty: "crazy", mode: "bonus", title: "奖励谜题", question: "8 颗橡果拿走一半，再放回 1 颗，现在有几颗？", options: ["5", "4", "6", "3"], answer: 0 },
    { difficulty: "crazy", mode: "bonus", title: "奖励谜题", question: "甲车比乙车快，乙车比丙车快，哪辆最慢？", options: ["丙车", "乙车", "甲车", "一样快"], answer: 0 },
  ];

  const catalog = [...existingCoreQuestions, ...additionalCoreQuestions, ...bonusQuestions];
  const coreQuestions = catalog.filter((entry) => entry.mode === "core");
  const bonusPool = catalog.filter((entry) => entry.mode === "bonus");
  const runState = {
    id: 0,
    difficulty: null,
    bags: { core: [], bonus: [] },
    assignments: new Map(),
  };

  function shuffled(list) {
    const copy = list.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function cloneQuestion(question) {
    if (!question) return null;
    return { ...question, options: [...question.options] };
  }

  function shuffleOptions(question) {
    if (!question?.options?.length) return cloneQuestion(question);
    const indexed = question.options.map((option, index) => ({ option, index }));
    const options = shuffled(indexed);
    return {
      ...question,
      options: options.map((entry) => entry.option),
      answer: options.findIndex((entry) => entry.index === question.answer),
    };
  }

  function poolFor(difficulty, mode) {
    const key = mode === "bonus" ? ACORN_TOWN_BONUS_KEY : ACORN_TOWN_CORE_KEY;
    return (quizBank[key] || []).filter((entry) =>
      entry.difficulty === difficulty && entry.mode === mode
    );
  }

  function beginRun(difficulty = "normal") {
    const normalized = ["easy", "normal", "hard", "crazy"].includes(difficulty) ? difficulty : "normal";
    runState.id += 1;
    runState.difficulty = normalized;
    runState.bags = {
      core: shuffled(poolFor(normalized, "core")),
      bonus: shuffled(poolFor(normalized, "bonus")),
    };
    runState.assignments.clear();
    return runState.id;
  }

  function safeFallback(mode) {
    if (mode === "bonus") return null;
    const preferred = catalog.find((entry) =>
      entry.difficulty === runState.difficulty && entry.mode === mode
    );
    return shuffleOptions(preferred || quizBank.math?.[0]);
  }

  function draw(mode) {
    const question = runState.bags[mode]?.pop();
    return shuffleOptions(question) || safeFallback(mode);
  }

  function assign(levelId, difficulty = "normal") {
    if (runState.difficulty !== difficulty) beginRun(difficulty);
    const key = `${runState.id}:${runState.difficulty}:${levelId}`;
    if (!runState.assignments.has(key)) {
      runState.assignments.set(key, {
        core: draw("core"),
        bonus: draw("bonus"),
      });
    }
    const assignment = runState.assignments.get(key);
    return {
      core: cloneQuestion(assignment.core),
      bonus: cloneQuestion(assignment.bonus),
    };
  }

  function runSnapshot() {
    return {
      id: runState.id,
      difficulty: runState.difficulty,
      assignedLevels: runState.assignments.size,
      remainingCore: runState.bags.core.length,
      remainingBonus: runState.bags.bonus.length,
    };
  }

  const placements = [
    { level: "橡果镇邮局", x: 468, y: 430, name: "邮局四年级题" },
    { level: "寻找丢失的橡果", x: 472, y: 430, name: "橡果观察题" },
    { level: "橡果集市兑换", x: 468, y: 430, name: "集市计算题" },
    { level: "小镇公告板", x: 470, y: 430, name: "码头路线题" },
  ];

  function appendUniqueQuestions(key, questions) {
    if (!Array.isArray(quizBank[key])) quizBank[key] = [];
    const existing = new Set(quizBank[key].map((question) => question.question));
    for (const question of questions) {
      if (existing.has(question.question)) continue;
      quizBank[key].push(question);
      existing.add(question.question);
    }
  }

  function acornTownQuizTask(placement) {
    return {
      x: placement.x,
      y: placement.y,
      name: placement.name,
      animal: "riddle",
      speech: "完成小镇任务后，回答一道四年级题。",
      quizKey: ACORN_TOWN_CORE_KEY,
      quiz: null,
      kind: "quiz",
      requiresCoreTasks: true,
      done: false,
      progress: 0,
      acornTownShared: true,
    };
  }

  function refreshCurrentAcornTownLevel() {
    if (typeof state === "undefined" || !state) return;
    const level = levels[state.levelIndex];
    if (level?.world !== "acorn_town" || typeof resetGame !== "function") return;
    const wasRunning = state.running;
    resetGame(state.levelIndex, state.levelIndex > 0);
    if (wasRunning) {
      state.running = true;
      startBtn.textContent = text.restart;
    }
  }

  appendUniqueQuestions(ACORN_TOWN_CORE_KEY, coreQuestions);
  appendUniqueQuestions(ACORN_TOWN_BONUS_KEY, bonusPool);
  for (const placement of placements) {
    const level = levels.find((entry) => entry.world === "acorn_town" && entry.name === placement.level);
    if (!level || level.tasks.some((task) => task.acornTownShared)) continue;
    level.tasks.push(acornTownQuizTask(placement));
  }

  window.CATS_OWLS_ACORN_TOWN_QUIZ = {
    coreKey: ACORN_TOWN_CORE_KEY,
    bonusKey: ACORN_TOWN_BONUS_KEY,
    count: catalog.length,
    beginRun,
    assign,
    runSnapshot,
    catalog: Object.freeze(catalog.map((entry) => Object.freeze({
      ...entry,
      options: Object.freeze([...entry.options]),
    }))),
  };

  refreshCurrentAcornTownLevel();
})();
