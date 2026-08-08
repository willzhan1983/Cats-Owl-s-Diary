/* Shared Apple Valley quiz bank and quiz task injection.
 * Loaded after game.js and grade-quiz.js so Apple Valley can reuse the
 * difficulty-aware randomQuiz picker without editing the core level system.
 */
(function setupAppleValleySharedQuizBank() {
  if (typeof quizBank === "undefined" || typeof levels === "undefined") return;

  const APPLE_VALLEY_WORLD_ID = "apple_valley";
  const APPLE_VALLEY_QUIZ_KEY = "appleValleyShared";

  const appleValleyQuestions = [
    { difficulty: "easy", title: "苹果谷基础题", question: "apple 的中文意思是？", options: ["苹果", "小猫", "月亮", "铅笔"], answer: 0 },
    { difficulty: "easy", title: "苹果谷基础题", question: "Coco 捡到 1 个苹果，又捡到 2 个，一共有几个？", options: ["2", "3", "4", "5"], answer: 1 },
    { difficulty: "easy", title: "苹果谷基础题", question: "红苹果应该放进哪个篮子？", options: ["红苹果篮", "青苹果篮", "石头篮", "书包"], answer: 0 },
    { difficulty: "easy", title: "苹果谷基础题", question: "green apple 更接近哪一种？", options: ["青苹果", "金苹果", "红苹果", "月亮"], answer: 0 },
    { difficulty: "easy", title: "苹果谷基础题", question: "“丰收”的意思更接近哪一个？", options: ["收获很多", "天气很冷", "走得很快", "睡觉很香"], answer: 0 },
    { difficulty: "easy", title: "苹果谷基础题", question: "Coco 是苹果谷里的谁？", options: ["小松鼠", "猫头鹰校长", "小鸟邮差", "果园鼹鼠"], answer: 0 },

    { difficulty: "normal", title: "苹果谷普通题", question: "篮子里有 3 个苹果，又放进 4 个，一共有几个？", options: ["5", "6", "7", "8"], answer: 2 },
    { difficulty: "normal", title: "苹果谷普通题", question: "2 个红苹果加 3 个青苹果，一共有几个苹果？", options: ["4", "5", "6", "7"], answer: 1 },
    { difficulty: "normal", title: "Apple Valley Quiz", question: "Which word means “篮子”?", options: ["basket", "apple", "harvest", "map"], answer: 0 },
    { difficulty: "normal", title: "苹果谷普通题", question: "果园地图上，先到入口，再到果园，最后去学校，这表示什么？", options: ["路线顺序", "苹果颜色", "天气变化", "篮子大小"], answer: 0 },
    { difficulty: "normal", title: "苹果谷普通题", question: "Coco 把苹果送到学校，是为了什么？", options: ["和大家分享", "把苹果藏起来", "让大家迷路", "把篮子扔掉"], answer: 0 },
    { difficulty: "normal", title: "苹果谷普通题", question: "如果青苹果放错到红篮子里，最应该怎么做？", options: ["重新分类", "扔掉篮子", "停止收获", "把地图藏起来"], answer: 0 },

    { difficulty: "hard", title: "苹果谷困难题", question: "3 个篮子，每个篮子放 4 个苹果，一共能放几个苹果？", options: ["7", "10", "12", "14"], answer: 2 },
    { difficulty: "hard", title: "苹果谷困难题", question: "红篮有 5 个苹果，青篮比红篮少 2 个，两个篮子一共有几个？", options: ["7", "8", "9", "10"], answer: 1 },
    { difficulty: "hard", title: "苹果谷困难题", question: "红苹果 4 个，青苹果 3 个，金苹果 1 个。只把红苹果和青苹果分类，一共分类几个？", options: ["4", "7", "8", "9"], answer: 1 },
    { difficulty: "hard", title: "苹果谷困难题", question: "如果每 2 个苹果装一小袋，10 个苹果可以装几袋？", options: ["4", "5", "6", "8"], answer: 1 },
    { difficulty: "hard", title: "苹果谷困难题", question: "果园地图说：桥在入口右边，学校在桥后面。要去学校应先到哪里？", options: ["桥", "池塘", "红篮", "月光湖"], answer: 0 },
    { difficulty: "hard", title: "Apple Valley Quiz", question: "Which sentence is correct?", options: ["We share the harvest.", "We shares the harvest.", "We sharing harvest.", "We is harvest."], answer: 0 },

    { difficulty: "crazy", title: "苹果谷挑战题", question: "红苹果 6 个，青苹果 4 个，金苹果 2 个。每个礼物篮要 1 个金苹果和 3 个普通苹果，最多能做几个礼物篮？", options: ["1", "2", "3", "4"], answer: 1 },
    { difficulty: "crazy", title: "苹果谷挑战题", question: "Coco 先给学校 5 个苹果，又把剩下的一半 3 个给 Nono。Coco 原来有几个苹果？", options: ["8", "10", "11", "12"], answer: 2 },
    { difficulty: "crazy", title: "苹果谷挑战题", question: "红篮只能放红苹果，青篮只能放青苹果，礼物篮要金苹果。如果一个苹果不能进红篮也不能进青篮，最可能是？", options: ["金苹果", "红苹果", "青苹果", "空篮子"], answer: 0 },
    { difficulty: "crazy", title: "苹果谷挑战题", question: "果园地图顺序是入口、果园、整理站、学校。Mimi 已到整理站，下一站应该去哪里？", options: ["学校", "入口", "果园", "月光湖"], answer: 0 },
    { difficulty: "crazy", title: "苹果谷挑战题", question: "一棵树掉 2 个红苹果和 1 个青苹果，三棵一样的树一共掉几个苹果？", options: ["6", "7", "8", "9"], answer: 3 },
    { difficulty: "crazy", title: "Apple Valley Challenge", question: "If harvest means collecting many ripe fruits, which action best shows a harvest?", options: ["Sorting full apple baskets", "Hiding an empty basket", "Closing the orchard map", "Leaving apples on the road"], answer: 0 },
  ];

  function appendUniqueQuestions(key, questions) {
    if (!Array.isArray(quizBank[key])) quizBank[key] = [];
    const existingQuestions = new Set(quizBank[key].map((question) => question.question));
    questions.forEach((question) => {
      if (!existingQuestions.has(question.question)) {
        quizBank[key].push(question);
        existingQuestions.add(question.question);
      }
    });
  }

  function difficultyForFixedQuestion(question) {
    if (question === "apple 的中文意思是？") return "easy";
    if (question === "篮子里有 3 个苹果，又放进 4 个，一共有几个？") return "normal";
    if (question === "“丰收”的意思更接近哪一个？") return "easy";
    if (question === "Coco 把苹果送到学校，是为了什么？") return "normal";
    return "normal";
  }

  function fixedAppleValleyQuestions() {
    return levels
      .filter((level) => level.world === APPLE_VALLEY_WORLD_ID)
      .flatMap((level) => level.tasks || [])
      .filter((task) => task.kind === "quiz" && task.quiz && Array.isArray(task.quiz.options))
      .map((task) => ({
        ...task.quiz,
        difficulty: task.quiz.difficulty || difficultyForFixedQuestion(task.quiz.question),
      }));
  }

  function normalizeAppleValleyQuizTasks() {
    levels.forEach((level) => {
      if (level.world !== APPLE_VALLEY_WORLD_ID || !Array.isArray(level.tasks)) return;
      level.tasks.forEach((task) => {
        if (task.kind !== "quiz") return;
        task.quizKey = APPLE_VALLEY_QUIZ_KEY;
        task.quiz = null;
        task.appleValleyShared = true;
      });
    });
  }

  function refreshCurrentAppleValleyLevel() {
    if (typeof state === "undefined" || !state || state.running) return;
    const level = levels[state.levelIndex];
    if (level?.world !== APPLE_VALLEY_WORLD_ID || typeof resetGame !== "function") return;
    resetGame(state.levelIndex, state.levelIndex > 0);
  }

  appendUniqueQuestions(APPLE_VALLEY_QUIZ_KEY, appleValleyQuestions);
  appendUniqueQuestions(APPLE_VALLEY_QUIZ_KEY, fixedAppleValleyQuestions());
  normalizeAppleValleyQuizTasks();

  window.CATS_OWLS_APPLE_VALLEY_QUIZ = {
    key: APPLE_VALLEY_QUIZ_KEY,
    count: quizBank[APPLE_VALLEY_QUIZ_KEY].length,
    difficulties: quizBank[APPLE_VALLEY_QUIZ_KEY].reduce((counts, question) => {
      const difficulty = question.difficulty || "normal";
      counts[difficulty] = (counts[difficulty] || 0) + 1;
      return counts;
    }, {}),
  };

  refreshCurrentAppleValleyLevel();
})();
