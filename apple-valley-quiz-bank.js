/* Shared Apple Valley quiz bank and quiz task injection. */
(function setupAppleValleySharedQuizBank() {
  if (typeof quizBank === "undefined" || typeof levels === "undefined") return;

  const APPLE_VALLEY_WORLD_ID = "apple_valley";
  const APPLE_VALLEY_QUIZ_KEY = "appleValleyShared";
  const DIFFICULTIES = ["easy", "normal", "hard", "crazy"];
  const FALLBACK_ORDER = {
    easy: ["easy", "normal", "hard", "crazy"],
    normal: ["normal", "easy", "hard", "crazy"],
    hard: ["hard", "normal", "crazy", "easy"],
    crazy: ["crazy", "hard", "normal", "easy"],
  };

  const appleValleyQuestions = [
    q("av-easy-001", "easy", "english", "apple 的中文意思是？", ["苹果", "小猫", "月亮", "铅笔"], 0),
    q("av-easy-002", "easy", "math", "Coco 捡到 1 个苹果，又捡到 2 个，一共有几个？", ["2", "3", "4", "5"], 1),
    q("av-easy-003", "easy", "sorting", "红苹果应该放进哪个篮子？", ["红苹果篮", "青苹果篮", "石头篮", "书包"], 0),
    q("av-easy-004", "easy", "english", "green apple 更接近哪一种？", ["青苹果", "金苹果", "红苹果", "月亮"], 0),
    q("av-easy-005", "easy", "language", "“丰收”的意思更接近哪一个？", ["收获很多", "天气很冷", "走得很快", "睡觉很香"], 0),
    q("av-easy-006", "easy", "story", "Coco 是苹果谷里的谁？", ["小松鼠", "猫头鹰校长", "小鸟邮差", "果园鼹鼠"], 0),
    q("av-easy-007", "easy", "math", "树下有 2 个红苹果，又掉下 1 个红苹果，现在有几个？", ["1", "2", "3", "4"], 2),
    q("av-easy-008", "easy", "english", "basket 的中文意思是？", ["篮子", "树", "红色", "学校"], 0),
    q("av-easy-009", "easy", "science", "苹果树先开花，后来最可能结出什么？", ["苹果", "贝壳", "月亮", "书包"], 0),
    q("av-easy-010", "easy", "sorting", "青苹果应该放进哪个篮子？", ["青苹果篮", "红苹果篮", "玩具盒", "水坑"], 0),
    q("av-easy-011", "easy", "language", "秋天果园里苹果成熟了，这叫？", ["丰收", "冬眠", "迷路", "下雪"], 0),
    q("av-easy-012", "easy", "story", "把苹果送给猫头鹰校长，最像哪件事？", ["分享", "躲藏", "浪费", "吵架"], 0),

    q("av-normal-001", "normal", "math", "篮子里有 3 个苹果，又放进 4 个，一共有几个？", ["5", "6", "7", "8"], 2),
    q("av-normal-002", "normal", "math", "2 个红苹果加 3 个青苹果，一共有几个苹果？", ["4", "5", "6", "7"], 1),
    q("av-normal-003", "normal", "english", "Which word means “篮子”?", ["basket", "apple", "harvest", "map"], 0),
    q("av-normal-004", "normal", "map", "果园地图上，先到入口，再到果园，最后去学校，这表示什么？", ["路线顺序", "苹果颜色", "天气变化", "篮子大小"], 0),
    q("av-normal-005", "normal", "story", "Coco 把苹果送到学校，是为了什么？", ["和大家分享", "把苹果藏起来", "让大家迷路", "把篮子扔掉"], 0),
    q("av-normal-006", "normal", "sorting", "如果青苹果放错到红篮子里，最应该怎么做？", ["重新分类", "扔掉篮子", "停止收获", "把地图藏起来"], 0),
    q("av-normal-007", "normal", "math", "一棵树掉下 2 个苹果，两棵一样的树会掉几个？", ["2", "3", "4", "5"], 2),
    q("av-normal-008", "normal", "math", "6 个苹果平均分给 Coco 和 Nono，每人几个？", ["2", "3", "4", "6"], 1),
    q("av-normal-009", "normal", "english", "tree 的中文意思是？", ["树", "篮子", "金色", "红色"], 0),
    q("av-normal-010", "normal", "science", "种子发芽最需要哪两样？", ["水和阳光", "糖和玩具", "雪和石头", "月亮和铅笔"], 0),
    q("av-normal-011", "normal", "sorting", "红苹果 2 个、青苹果 2 个，一共要放进几个分类篮？", ["1 个", "2 个", "3 个", "4 个"], 1),
    q("av-normal-012", "normal", "language", "“金苹果”里的“金”主要说明什么？", ["颜色像金色", "苹果会唱歌", "苹果很冷", "篮子很轻"], 0),

    q("av-hard-001", "hard", "math", "3 个篮子，每个篮子放 4 个苹果，一共能放几个苹果？", ["7", "10", "12", "14"], 2),
    q("av-hard-002", "hard", "math", "红篮有 5 个苹果，青篮比红篮少 2 个，两个篮子一共有几个？", ["7", "8", "9", "10"], 1),
    q("av-hard-003", "hard", "sorting", "红苹果 4 个，青苹果 3 个，金苹果 1 个。只把红苹果和青苹果分类，一共分类几个？", ["4", "7", "8", "9"], 1),
    q("av-hard-004", "hard", "math", "如果每 2 个苹果装一小袋，10 个苹果可以装几袋？", ["4", "5", "6", "8"], 1),
    q("av-hard-005", "hard", "map", "果园地图说：桥在入口右边，学校在桥后面。要去学校应先到哪里？", ["桥", "池塘", "红篮", "月光湖"], 0),
    q("av-hard-006", "hard", "english", "Which sentence is correct?", ["We share the harvest.", "We shares the harvest.", "We sharing harvest.", "We is harvest."], 0),
    q("av-hard-007", "hard", "math", "摇树掉下 3 个红苹果和 2 个青苹果，又捡到 1 个金苹果，一共几个？", ["5", "6", "7", "8"], 1),
    q("av-hard-008", "hard", "average", "12 个苹果平均放进 3 个篮子，每篮几个？", ["3", "4", "5", "6"], 1),
    q("av-hard-009", "hard", "sorting", "礼物篮需要 1 个金苹果和 1 个果篮。现在有 2 个金苹果、3 个果篮，最多做几个礼物篮？", ["1", "2", "3", "5"], 1),
    q("av-hard-010", "hard", "science", "苹果树从种子长大，正确顺序是？", ["种子-小苗-开花-结果", "苹果-月亮-小苗-开花", "篮子-种子-书包-结果", "开花-种子-小苗-结果"], 0),
    q("av-hard-011", "hard", "language", "“丰收礼物篮”最适合送给大家，因为它代表？", ["感谢和分享", "迷路和害怕", "藏起来", "只给自己"], 0),
    q("av-hard-012", "hard", "english", "golden apple means which one?", ["金苹果", "青苹果", "红苹果", "空篮子"], 0),

    q("av-crazy-001", "crazy", "math", "红苹果 6 个，青苹果 4 个，金苹果 2 个。每个礼物篮要 1 个金苹果和 3 个普通苹果，最多能做几个礼物篮？", ["1", "2", "3", "4"], 1),
    q("av-crazy-002", "crazy", "math", "Coco 先给学校 5 个苹果，又把剩下的一半 3 个给 Nono。Coco 原来有几个苹果？", ["8", "10", "11", "12"], 2),
    q("av-crazy-003", "crazy", "sorting", "红篮只能放红苹果，青篮只能放青苹果，礼物篮要金苹果。如果一个苹果不能进红篮也不能进青篮，最可能是？", ["金苹果", "红苹果", "青苹果", "空篮子"], 0),
    q("av-crazy-004", "crazy", "map", "果园地图顺序是入口、果园、整理站、学校。Mimi 已到整理站，下一站应该去哪里？", ["学校", "入口", "果园", "月光湖"], 0),
    q("av-crazy-005", "crazy", "math", "一棵树掉 2 个红苹果和 1 个青苹果，三棵一样的树一共掉几个苹果？", ["6", "7", "8", "9"], 3),
    q("av-crazy-006", "crazy", "language", "If harvest means collecting many ripe fruits, which action best shows a harvest?", ["Sorting full apple baskets", "Hiding an empty basket", "Closing the orchard map", "Leaving apples on the road"], 0),
    q("av-crazy-007", "crazy", "average", "18 个苹果平均分给 3 个朋友后，又给校长 2 个，还剩几个？", ["4", "6", "8", "10"], 0),
    q("av-crazy-008", "crazy", "science", "如果今年阳光、水分都合适，苹果树最可能怎样？", ["更容易开花结果", "马上变成石头", "不能长叶子", "只长出贝壳"], 0),
  ];

  const previousRandomQuiz = typeof randomQuiz === "function" ? randomQuiz : null;
  const previousResetGame = typeof resetGame === "function" ? resetGame : null;
  const appleValleyBags = Object.create(null);
  let currentLevelUsedIds = new Set();

  function q(id, difficulty, topic, question, options, answer) {
    const titleMap = {
      easy: "苹果谷基础题",
      normal: "苹果谷普通题",
      hard: "苹果谷困难题",
      crazy: "苹果谷挑战题",
    };
    return { id, title: titleMap[difficulty], question, options, answer, difficulty, topic };
  }

  function appendUniqueQuestions(key, questions) {
    if (!Array.isArray(quizBank[key])) quizBank[key] = [];
    const existingIds = new Set(quizBank[key].map((question) => question.id).filter(Boolean));
    const existingQuestions = new Set(quizBank[key].map((question) => question.question));
    questions.forEach((question) => {
      if (existingIds.has(question.id) || existingQuestions.has(question.question)) return;
      quizBank[key].push(question);
      if (question.id) existingIds.add(question.id);
      existingQuestions.add(question.question);
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
      .map((task, index) => ({
        id: task.quiz.id || `av-fixed-${String(index + 1).padStart(3, "0")}`,
        topic: task.quiz.topic || "story",
        difficulty: task.quiz.difficulty || difficultyForFixedQuestion(task.quiz.question),
        ...task.quiz,
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

  function selectedDifficulty() {
    return window.catsOwlQuizDifficulty?.get?.() || window.catsOwlDifficulty?.get?.() || "normal";
  }

  function normalizeDifficulty(value) {
    return DIFFICULTIES.includes(value) ? value : "normal";
  }

  function questionsForDifficulty(difficulty) {
    return (quizBank[APPLE_VALLEY_QUIZ_KEY] || []).filter((question) => question.difficulty === difficulty);
  }

  function shuffle(list) {
    const result = list.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  }

  function appleValleyRandomQuiz() {
    const mode = normalizeDifficulty(selectedDifficulty());
    const fallbackOrder = FALLBACK_ORDER[mode] || FALLBACK_ORDER.normal;

    for (const difficulty of fallbackOrder) {
      if (!appleValleyBags[difficulty]?.length) {
        appleValleyBags[difficulty] = shuffle(
          questionsForDifficulty(difficulty).filter((question) => !currentLevelUsedIds.has(question.id))
        );
      }
      while (appleValleyBags[difficulty].length) {
        const question = appleValleyBags[difficulty].pop();
        if (!question?.id || currentLevelUsedIds.has(question.id)) continue;
        currentLevelUsedIds.add(question.id);
        return question;
      }
    }

    currentLevelUsedIds = new Set();
    return previousRandomQuiz ? previousRandomQuiz(APPLE_VALLEY_QUIZ_KEY) : quizBank.math?.[0];
  }

  function installAppleValleyRandomQuiz() {
    if (!previousRandomQuiz) return;
    randomQuiz = function randomQuizWithAppleValleyBag(key) {
      if (key === APPLE_VALLEY_QUIZ_KEY) return appleValleyRandomQuiz();
      return previousRandomQuiz(key);
    };
  }

  function installAppleValleyResetTracking() {
    if (!previousResetGame) return;
    resetGame = function resetGameWithAppleValleyQuizTracking(...args) {
      currentLevelUsedIds = new Set();
      return previousResetGame.apply(this, args);
    };
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
  installAppleValleyRandomQuiz();
  installAppleValleyResetTracking();

  window.CATS_OWLS_APPLE_VALLEY_QUIZ = {
    key: APPLE_VALLEY_QUIZ_KEY,
    count: quizBank[APPLE_VALLEY_QUIZ_KEY].length,
    difficulties: quizBank[APPLE_VALLEY_QUIZ_KEY].reduce((counts, question) => {
      const difficulty = question.difficulty || "normal";
      counts[difficulty] = (counts[difficulty] || 0) + 1;
      return counts;
    }, {}),
    randomMode: "session-shuffle-bag",
  };

  refreshCurrentAppleValleyLevel();
})();
