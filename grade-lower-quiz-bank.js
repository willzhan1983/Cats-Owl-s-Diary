/* Grade 1-2 question bank extension for easy mode. */
(function addGradeLowerQuizBank() {
  if (typeof quizBank === "undefined") return;

  const bank = {
    math: [
      { id: "lower-math-001", category: "math", grade: 1, difficulty: "easy", title: "一年级数学小题", question: "3 + 2 = ?", options: ["4", "5", "6", "7"], answer: 1 },
      { id: "lower-math-002", category: "math", grade: 1, difficulty: "easy", title: "一年级数学小题", question: "9 - 4 = ?", options: ["3", "4", "5", "6"], answer: 2 },
      { id: "lower-math-003", category: "math", grade: 2, difficulty: "easy", title: "二年级数学小题", question: "12 + 8 = ?", options: ["18", "20", "21", "22"], answer: 1 },
      { id: "lower-math-004", category: "math", grade: 2, difficulty: "easy", title: "二年级数学小题", question: "18 颗橡果，每 3 颗一份，可以分几份？", options: ["5", "6", "7", "8"], answer: 1 },
    ],
    logic: [
      { id: "lower-logic-001", category: "logic", grade: 1, difficulty: "easy", title: "一年级观察小题", question: "红、黄、红、黄，下一个颜色是？", options: ["红", "黄", "蓝", "绿"], answer: 0 },
      { id: "lower-logic-002", category: "logic", grade: 2, difficulty: "easy", title: "二年级观察小题", question: "小猫在小狗前面，小鸟在小猫前面，谁最前面？", options: ["小鸟", "小猫", "小狗", "都一样"], answer: 0 },
    ],
    science: [
      { id: "lower-science-001", category: "science", grade: 1, difficulty: "easy", title: "一年级科学小题", question: "植物长大最需要哪两样？", options: ["水和阳光", "石头和纸", "鞋子和书", "月亮和笔"], answer: 0 },
      { id: "lower-science-002", category: "science", grade: 2, difficulty: "easy", title: "二年级科学小题", question: "下雨后路面通常会怎样？", options: ["变湿", "变成火", "变透明", "变成糖"], answer: 0 },
    ],
    language: [
      { id: "lower-language-001", category: "language", grade: 1, difficulty: "easy", title: "一年级语文小题", question: "“大”的反义词是？", options: ["小", "高", "快", "红"], answer: 0 },
      { id: "lower-language-002", category: "language", grade: 2, difficulty: "easy", title: "二年级语文小题", question: "“高兴”的近义词是？", options: ["开心", "难过", "安静", "寒冷"], answer: 0 },
    ],
    english: [
      { id: "lower-english-001", category: "english", grade: 1, difficulty: "easy", title: "Grade 1 English", question: "Which word means “猫”？", options: ["cat", "tree", "book", "sun"], answer: 0 },
      { id: "lower-english-002", category: "english", grade: 2, difficulty: "easy", title: "Grade 2 English", question: "Choose the color word.", options: ["green", "run", "desk", "jump"], answer: 0 },
    ],
    riddle: [
      { id: "lower-riddle-001", category: "logic", grade: 1, difficulty: "easy", title: "一年级谜语小题", question: "一口咬掉牛尾巴，猜一字。", options: ["告", "午", "生", "土"], answer: 0 },
      { id: "lower-riddle-002", category: "logic", grade: 2, difficulty: "easy", title: "二年级谜语小题", question: "日月在一起，猜一字。", options: ["明", "早", "晴", "星"], answer: 0 },
    ],
  };

  Object.entries(bank).forEach(([key, questions]) => {
    if (!Array.isArray(quizBank[key])) quizBank[key] = [];
    const existing = new Set(quizBank[key].map((question) => question.id || question.question));
    questions.forEach((question) => {
      if (existing.has(question.id) || existing.has(question.question)) return;
      quizBank[key].push(question);
      existing.add(question.id);
      existing.add(question.question);
    });
  });
})();
