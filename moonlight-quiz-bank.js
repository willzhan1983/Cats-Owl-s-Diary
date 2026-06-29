/* Shared Moonlight Lake quiz bank and quiz task injection.
 * Loaded after game.js and grade-quiz.js so Moonlight Lake can reuse the
 * grade-aware randomQuiz picker without editing the core level system.
 */
(function setupMoonlightSharedQuizBank() {
  if (typeof quizBank === "undefined" || typeof levels === "undefined") return;

  const MOONLIGHT_WORLD_ID = "moonlight_lake";
  const MOONLIGHT_QUIZ_KEY = "moonlightShared";

  const moonlightQuestions = [
    { grade: 3, difficulty: "medium", title: "月光湖共享题库", question: "月光湖边有 24 颗珍珠，分给 3 只小海龟，每只分几颗？", options: ["6", "7", "8", "9"], answer: 2 },
    { grade: 3, difficulty: "medium", title: "月光湖共享题库", question: "如果贝壳顺序是蓝、黄、粉、蓝、黄、粉，下一个颜色是？", options: ["蓝", "黄", "粉", "绿"], answer: 0 },
    { grade: 3, difficulty: "medium", title: "月光湖共享题库", question: "下列哪个词最适合描写月光？", options: ["皎洁", "吵闹", "粗糙", "炎热"], answer: 0 },
    { grade: 3, difficulty: "medium", title: "Moonlight Quiz", question: "Which word means “珍珠” in English?", options: ["pearl", "shell", "lake", "moon"], answer: 0 },
    { grade: 3, difficulty: "medium", title: "月光湖共享题库", question: "小鱼需要水母灯照路，水母灯属于什么？", options: ["光源", "食物", "地图", "桥"], answer: 0 },
    { grade: 3, difficulty: "medium", title: "月光湖共享题库", question: "Mimi 从湖岸走到码头用了 12 分钟，返回用了 13 分钟，一共用了几分钟？", options: ["22", "23", "24", "25"], answer: 3 },

    { grade: 4, difficulty: "hard", title: "月光湖进阶题库", question: "36 个泡泡石，每 4 个点亮一根月光柱，可以点亮几根？", options: ["7", "8", "9", "10"], answer: 2 },
    { grade: 4, difficulty: "hard", title: "月光湖进阶题库", question: "一个长方形码头长 16 米，宽 5 米，周长是多少米？", options: ["21", "42", "80", "160"], answer: 1 },
    { grade: 4, difficulty: "hard", title: "月光湖进阶题库", question: "水流方向为东，Mimi 被水流推着向右移动，地图上通常表示什么方向？", options: ["东", "西", "南", "北"], answer: 0 },
    { grade: 4, difficulty: "hard", title: "月光湖进阶题库", question: "“月光像银纱一样铺在湖面上。”这句话用了什么修辞？", options: ["比喻", "排比", "反问", "设问"], answer: 0 },
    { grade: 4, difficulty: "hard", title: "Moonlight Quiz", question: "Choose the correct sentence.", options: ["The turtle swims slowly.", "The turtle swim slowly.", "The turtle swimming slowly.", "The turtle are slow."], answer: 0 },
    { grade: 4, difficulty: "hard", title: "月光湖进阶题库", question: "贝壳机关顺序是 2、4、8、16，下一个数是？", options: ["20", "24", "30", "32"], answer: 3 },

    { grade: 5, difficulty: "hard", title: "月光湖高阶题库", question: "4.8 + 3.75 = ?", options: ["7.55", "8.45", "8.55", "9.55"], answer: 2 },
    { grade: 5, difficulty: "hard", title: "月光湖高阶题库", question: "1/2 + 1/3 = ?", options: ["2/5", "3/5", "5/6", "1"], answer: 2 },
    { grade: 5, difficulty: "hard", title: "月光湖高阶题库", question: "平行四边形海草园底 14 米，高 6 米，面积是多少平方米？", options: ["20", "40", "84", "168"], answer: 2 },
    { grade: 5, difficulty: "hard", title: "月光湖高阶题库", question: "如果所有会发光的生物都能照亮路，灯笼鱼会发光，可以推出什么？", options: ["灯笼鱼能照亮路", "灯笼鱼不会游泳", "所有鱼都会发光", "月亮在水底"], answer: 0 },
    { grade: 5, difficulty: "hard", title: "月光湖高阶题库", question: "“波光粼粼”常用来形容什么？", options: ["水面闪光", "道路泥泞", "声音巨大", "天气炎热"], answer: 0 },
    { grade: 5, difficulty: "hard", title: "Moonlight Quiz", question: "Owlly stayed near the lake ___ it was too dark underwater.", options: ["because", "but", "or", "so that not"], answer: 0 },

    { grade: 6, difficulty: "expert", title: "月光湖六年级挑战", question: "一个数的 30% 是 24，这个数是多少？", options: ["60", "72", "80", "90"], answer: 2 },
    { grade: 6, difficulty: "expert", title: "月光湖六年级挑战", question: "珍珠球和月光石数量比是 3:5，总数 64，珍珠球有多少个？", options: ["18", "24", "30", "40"], answer: 1 },
    { grade: 6, difficulty: "expert", title: "月光湖六年级挑战", question: "圆形漩涡半径 5 米，面积约是多少平方米？π 取 3.14", options: ["31.4", "62.8", "78.5", "157"], answer: 2 },
    { grade: 6, difficulty: "expert", title: "月光湖六年级挑战", question: "解方程：2x + 15 = 47，x = ?", options: ["12", "14", "16", "31"], answer: 2 },
    { grade: 6, difficulty: "expert", title: "月光湖六年级挑战", question: "“既然水流变急，我们就先关闭漩涡。”句中“既然”表示什么关系？", options: ["前提或因果", "并列", "选择", "重复"], answer: 0 },
    { grade: 6, difficulty: "expert", title: "Moonlight Quiz", question: "Choose the passive sentence.", options: ["The pearl crown was found by Mimi.", "Mimi found was the crown.", "The crown found Mimi.", "Found the pearl crown Mimi."], answer: 0 },

    { minGrade: 4, maxGrade: 6, difficulty: "hard", title: "月光湖混合挑战", question: "水循环中，湖水受热变成水蒸气的过程叫做什么？", options: ["蒸发", "凝固", "沉淀", "磁化"], answer: 0 },
    { minGrade: 4, maxGrade: 6, difficulty: "hard", title: "月光湖混合挑战", question: "月亮本身不发光，我们看到月光主要是因为它反射了谁的光？", options: ["太阳", "地球", "湖水", "星星"], answer: 0 },
    { minGrade: 4, maxGrade: 6, difficulty: "hard", title: "月光湖混合挑战", question: "三枚符文 A、B、C 中，A 必须在 B 前，C 在 A 后。哪种顺序可能正确？", options: ["A-C-B", "B-A-C", "C-B-A", "B-C-A"], answer: 0 },
    { minGrade: 4, maxGrade: 6, difficulty: "hard", title: "月光湖混合挑战", question: "“湖面恢复了平静。”这句话中的谓语是？", options: ["恢复了", "湖面", "平静", "了"], answer: 0 },
    { minGrade: 4, maxGrade: 6, difficulty: "hard", title: "Moonlight Quiz", question: "Which word is closest in meaning to “difficult”?", options: ["hard", "easy", "early", "quiet"], answer: 0 },
    { minGrade: 4, maxGrade: 6, difficulty: "hard", title: "月光湖混合挑战", question: "如果不收集珍珠就不能关闭漩涡。现在漩涡关闭了，最可能说明什么？", options: ["已经收集了珍珠", "没有珍珠", "湖水消失了", "不能推理"], answer: 0 },
  ];

  const moonlightCategoryQuestions = {
    math: [moonlightQuestions[0], moonlightQuestions[5], moonlightQuestions[6], moonlightQuestions[7], moonlightQuestions[12], moonlightQuestions[13], moonlightQuestions[14], moonlightQuestions[18], moonlightQuestions[19], moonlightQuestions[20], moonlightQuestions[21]],
    logic: [moonlightQuestions[1], moonlightQuestions[8], moonlightQuestions[11], moonlightQuestions[15], moonlightQuestions[26], moonlightQuestions[29]],
    science: [moonlightQuestions[4], moonlightQuestions[24], moonlightQuestions[25]],
    language: [moonlightQuestions[2], moonlightQuestions[9], moonlightQuestions[16], moonlightQuestions[22], moonlightQuestions[27]],
    english: [moonlightQuestions[3], moonlightQuestions[10], moonlightQuestions[17], moonlightQuestions[23], moonlightQuestions[28]],
  };

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

  appendUniqueQuestions(MOONLIGHT_QUIZ_KEY, moonlightQuestions);
  Object.entries(moonlightCategoryQuestions).forEach(([key, questions]) => appendUniqueQuestions(key, questions));

  const moonlightQuizPlacements = [
    { level: "Moonlight Shore", x: 446, y: 246, name: "月光贝壳题", animal: "shellBadge", speech: "答对一道题，贝壳会照亮湖岸。" },
    { level: "Moonlit Isle", x: 706, y: 166, name: "湖心月光题", animal: "moonPillar", speech: "答对一道题，月光石柱会更亮。" },
    { level: "Underwater Garden", x: 446, y: 146, name: "水底花园题", animal: "jellyfish", speech: "答对一道题，水母灯会闪闪发光。" },
    { level: "Deep Sea Ruins", x: 786, y: 160, name: "深海符文题", animal: "deepRune", speech: "答对一道题，遗迹符文会显示路线。" },
    { level: "Nessie's Lair", x: 480, y: 248, name: "Nessie 净化题", animal: "nessie", speech: "答对一道题，黑暗泡泡会变弱。" },
  ];

  function moonlightQuizTask({ x, y, name, animal, speech }) {
    return {
      x,
      y,
      name,
      animal,
      speech,
      quizKey: MOONLIGHT_QUIZ_KEY,
      quiz: null,
      kind: "quiz",
      done: false,
      progress: 0,
      moonlightShared: true,
    };
  }

  moonlightQuizPlacements.forEach((placement) => {
    const level = levels.find((entry) => entry.world === MOONLIGHT_WORLD_ID && entry.name === placement.level);
    if (!level || !Array.isArray(level.tasks)) return;
    const alreadyAdded = level.tasks.some((task) => task.moonlightShared || task.quizKey === MOONLIGHT_QUIZ_KEY);
    if (!alreadyAdded) level.tasks.push(moonlightQuizTask(placement));
  });

  window.CATS_OWLS_MOONLIGHT_QUIZ = {
    key: MOONLIGHT_QUIZ_KEY,
    count: moonlightQuestions.length,
    sharedCategories: Object.keys(moonlightCategoryQuestions),
  };
})();
