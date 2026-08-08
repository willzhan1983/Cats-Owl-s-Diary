/* Grade 1-2 easy questions for the selected easy difficulty. */
(function setupLowerGradeQuizBank() {
  if (typeof quizBank === "undefined") return;

  const bank = {
    math: [
      { id: "lower-math-001", category: "math", grade: 1, difficulty: "easy", question: "3 + 2 = ?", options: ["4", "5", "6", "7"], answer: 1 },
      { id: "lower-math-002", category: "math", grade: 1, difficulty: "easy", question: "9 - 4 = ?", options: ["3", "4", "5", "6"], answer: 2 },
      { id: "lower-math-003", category: "math", grade: 2, difficulty: "easy", question: "12 + 8 = ?", options: ["18", "20", "21", "22"], answer: 1 },
      { id: "lower-math-004", category: "math", grade: 2, difficulty: "easy", question: "18 颗橡果，每 3 颗一份，可以分几份？", options: ["5", "6", "7", "8"], answer: 1 },
    ],
    logic: [
      { id: "lower-logic-001", category: "logic", grade: 1, difficulty: "easy", question: "红、黄、红、黄，下一个颜色是？", options: ["红", "黄", "蓝", "绿"], answer: 0 },
      { id: "lower-logic-002", category: "logic", grade: 2, difficulty: "easy", question: "小猫在小狗前面，小鸟在小猫前面，谁最前面？", options: ["小鸟", "小猫", "小狗", "都一样"], answer: 0 },
      { id: "lower-logic-003", category: "logic", grade: 1, difficulty: "easy", question: "叶、花、叶、花，下一个图案是？", options: ["叶", "花", "树", "果篮"], answer: 0 },
      { id: "lower-logic-004", category: "logic", grade: 2, difficulty: "easy", question: "先拿篮子，再捡苹果，最后整理苹果。第一步是什么？", options: ["拿篮子", "捡苹果", "整理苹果", "回家"], answer: 0 },
    ],
    language: [
      { id: "lower-language-001", category: "language", grade: 1, difficulty: "easy", question: "“大”的反义词是？", options: ["小", "高", "快", "红"], answer: 0 },
      { id: "lower-language-002", category: "language", grade: 2, difficulty: "easy", question: "“高兴”的近义词是？", options: ["开心", "难过", "安静", "寒冷"], answer: 0 },
      { id: "lower-language-003", category: "language", grade: 1, difficulty: "easy", question: "“苹果树”中表示植物的是？", options: ["树", "苹果", "中", "的"], answer: 0 },
      { id: "lower-language-004", category: "language", grade: 2, difficulty: "easy", question: "“秋天到了，苹果成熟了。”这句话说的是哪一个季节？", options: ["秋天", "春天", "夏天", "冬天"], answer: 0 },
    ],
    english: [
      { id: "lower-english-001", category: "english", grade: 1, difficulty: "easy", question: "Which word means “猫”？", options: ["cat", "tree", "book", "sun"], answer: 0 },
      { id: "lower-english-002", category: "english", grade: 2, difficulty: "easy", question: "Choose the color word.", options: ["green", "run", "desk", "jump"], answer: 0 },
      { id: "lower-english-003", category: "english", grade: 1, difficulty: "easy", question: "Which word means “树”？", options: ["tree", "apple", "red", "box"], answer: 0 },
      { id: "lower-english-004", category: "english", grade: 2, difficulty: "easy", question: "Choose the word for “红色”.", options: ["red", "green", "golden", "basket"], answer: 0 },
    ],
  };

  Object.entries(bank).forEach(([key, questions]) => {
    if (!Array.isArray(quizBank[key])) quizBank[key] = [];
    const existing = new Set(quizBank[key].map((question) => question.id || question.question));
    questions.forEach((question) => {
      if (!existing.has(question.id) && !existing.has(question.question)) quizBank[key].push(question);
    });
  });
})();
