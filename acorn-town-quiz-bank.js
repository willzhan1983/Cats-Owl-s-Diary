/* Difficulty-aware Acorn Town quiz pool and one gated quiz task per level. */
(function setupAcornTownQuizBank() {
  if (typeof quizBank === "undefined" || typeof levels === "undefined") return;

  const ACORN_TOWN_QUIZ_KEY = "acornTownShared";
  const acornTownQuestions = [
    { difficulty: "easy", title: "橡果镇基础题", question: "acorn 的中文意思是？", options: ["橡果", "苹果", "信件", "小桥"], answer: 0 },
    { difficulty: "easy", title: "橡果镇基础题", question: "Coco 找到 2 颗橡果，又找到 3 颗，一共有几颗？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "easy", title: "橡果镇基础题", question: "红色信件应该送到哪里？", options: ["红色收件人图标的邮箱", "没有图标的箱子", "橡果篮", "公告板"], answer: 0 },
    { difficulty: "easy", title: "橡果镇基础题", question: "收集到的橡果应该放进什么？", options: ["橡果篮", "河里", "路牌后面", "空邮箱"], answer: 0 },
    { difficulty: "easy", title: "橡果镇基础题", question: "带有桥和河流图案的路牌最可能通向哪里？", options: ["河畔码头", "苹果谷", "森林学校", "沼泽深处"], answer: 0 },
    { difficulty: "easy", title: "橡果镇基础题", question: "回答最后一题前应该先做什么？", options: ["完成小镇任务", "走进错误出口", "丢掉信件", "撞小推车"], answer: 0 },

    { difficulty: "normal", title: "橡果镇普通题", question: "已经送了 3 封信，还有 2 封，一共需要送几封？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "normal", title: "橡果镇普通题", question: "6 颗橡果平均分成 2 组，每组几颗？", options: ["2", "3", "4", "5"], answer: 1 },
    { difficulty: "normal", title: "Acorn Town Quiz", question: "Which word means “信”?", options: ["letter", "market", "bridge", "basket"], answer: 0 },
    { difficulty: "normal", title: "橡果镇普通题", question: "订单 A 需要什么？", options: ["2 颗橡果和 1 个红苹果", "3 颗橡果和 1 个青苹果", "1 颗橡果和 2 个红苹果", "只要 1 个青苹果"], answer: 0 },
    { difficulty: "normal", title: "橡果镇普通题", question: "信件送到错误邮箱时，最合适的做法是？", options: ["重新核对收件提示", "把信丢掉", "继续投错", "拆掉邮箱"], answer: 0 },
    { difficulty: "normal", title: "橡果镇普通题", question: "公告碎片编号是 1、2、3、4，正确顺序是？", options: ["1、2、3、4", "4、3、2、1", "2、4、1、3", "3、1、4、2"], answer: 0 },

    { difficulty: "hard", title: "橡果镇困难题", question: "有 8 颗橡果，用掉 3 颗，还剩几颗？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "hard", title: "橡果镇困难题", question: "订单 A 用 2 颗橡果，订单 B 用 3 颗，两单共用几颗？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "hard", title: "橡果镇困难题", question: "4 块正确碎片和 1 块干扰碎片放在一起，一共看到几块？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "hard", title: "Acorn Town Challenge", question: "Which word means “市集”?", options: ["market", "letter", "acorn", "route"], answer: 0 },
    { difficulty: "hard", title: "橡果镇困难题", question: "路线是“向右、向上、再向右”，正确顺序是？", options: ["右、上、右", "上、右、上", "右、右、下", "左、上、右"], answer: 0 },
    { difficulty: "hard", title: "橡果镇困难题", question: "确认收件人时，哪两项信息最有用？", options: ["名字和图标", "天气和时间", "篮子和小车", "树叶和石头"], answer: 0 },

    { difficulty: "crazy", title: "橡果镇综合挑战", question: "订单 A、B、C 分别用 2、3、2 颗橡果，一共用几颗？", options: ["5", "6", "7", "8"], answer: 2 },
    { difficulty: "crazy", title: "橡果镇综合挑战", question: "10 颗真橡果和 3 个假橡果放在一起，一共看到几个？", options: ["10", "11", "12", "13"], answer: 3 },
    { difficulty: "crazy", title: "橡果镇综合挑战", question: "剩余 95 秒，两次错误各扣 5 秒，还剩多少秒？", options: ["80", "85", "90", "95"], answer: 1 },
    { difficulty: "crazy", title: "橡果镇综合挑战", question: "看见 6 块公告碎片，其中 2 块是干扰项，正确碎片有几块？", options: ["3", "4", "5", "6"], answer: 1 },
    { difficulty: "crazy", title: "橡果镇综合挑战", question: "路线提示关闭后，怎样最容易找到码头？", options: ["按刚才记住的顺序走", "随便选一个出口", "一直撞小推车", "把碎片丢掉"], answer: 0 },
    { difficulty: "crazy", title: "橡果镇综合挑战", question: "完成橡果镇关卡的完整顺序是？", options: ["完成任务、找路线、回答题目", "回答题目、丢掉道具、回起点", "先选错路、再撞小车、最后答题", "只完成一项任务"], answer: 0 },
  ];

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
      quizKey: ACORN_TOWN_QUIZ_KEY,
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

  appendUniqueQuestions(ACORN_TOWN_QUIZ_KEY, acornTownQuestions);
  for (const placement of placements) {
    const level = levels.find((entry) => entry.world === "acorn_town" && entry.name === placement.level);
    if (!level || level.tasks.some((task) => task.acornTownShared)) continue;
    level.tasks.push(acornTownQuizTask(placement));
  }

  window.CATS_OWLS_ACORN_TOWN_QUIZ = Object.freeze({
    key: ACORN_TOWN_QUIZ_KEY,
    count: quizBank[ACORN_TOWN_QUIZ_KEY].length,
  });

  refreshCurrentAcornTownLevel();
})();
