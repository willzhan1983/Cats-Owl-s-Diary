/* Difficulty-aware quiz picking. */
(function setupDifficultyAwareQuizzes() {
  if (typeof quizBank === "undefined" || typeof randomQuiz !== "function") return;

  const STORAGE_KEY = "catsOwlDifficulty";
  const DIFFICULTIES = ["easy", "normal", "hard", "crazy"];
  const DIFFICULTY_BY_GRADE = {
    1: "easy",
    2: "easy",
    3: "normal",
    4: "hard",
    5: "crazy",
    6: "crazy",
  };
  const GRADES_BY_DIFFICULTY = { easy: 2, normal: 3, hard: 4, crazy: 5 };
  const DIFFICULTY_ALIASES = {
    easy: "easy",
    simple: "easy",
    basic: "easy",
    normal: "normal",
    medium: "normal",
    hard: "hard",
    difficult: "hard",
    crazy: "crazy",
    expert: "crazy",
    challenge: "crazy",
  };
  const CATEGORY_ALIASES = {
    average: "math",
    map: "logic",
    riddle: "logic",
    science: "logic",
    sorting: "logic",
    story: "reading",
  };
  const CATEGORIES = ["math", "english", "language", "reading", "logic"];
  const FALLBACK_ORDER = {
    easy: ["easy"],
    normal: ["normal", "easy"],
    hard: ["hard", "normal", "easy"],
    crazy: ["crazy", "hard", "normal", "easy"],
  };
  const quizBags = new Map();
  const lastQuestionByBag = new Map();
  const usedQuestionKeysByScope = new Map();

  function normalizeMode(value) {
    return DIFFICULTIES.includes(value) ? value : "normal";
  }

  function numericGrade(value) {
    const grade = Number(value);
    return Number.isFinite(grade) ? Math.max(1, Math.min(6, Math.round(grade))) : null;
  }

  function difficultyFromGrade(question) {
    const grade = numericGrade(question.grade);
    if (grade) return DIFFICULTY_BY_GRADE[grade] || "normal";

    const min = numericGrade(question.minGrade);
    const max = numericGrade(question.maxGrade);
    if (!min && !max) return null;

    const low = min || max;
    const high = max || min;
    if (high <= 2) return "easy";
    if (low >= 5) return "crazy";
    if (low >= 4) return "hard";
    return "normal";
  }

  function normalizeQuizDifficulty(question) {
    const raw = String(question?.difficulty || "").trim().toLowerCase();
    const gradeDifficulty = difficultyFromGrade(question || {});
    return gradeDifficulty || DIFFICULTY_ALIASES[raw] || "normal";
  }

  function normalizeQuizCategory(question, key) {
    const raw = String(question?.category || question?.topic || key || "").trim().toLowerCase();
    if (CATEGORIES.includes(raw)) return raw;
    return CATEGORY_ALIASES[raw] || "reading";
  }

  function normalizeQuestion(question, key, index) {
    if (!question || typeof question !== "object") return null;
    question.id = String(question.id || `${key}-${index + 1}`);
    question.category = normalizeQuizCategory(question, key);
    question.difficulty = normalizeQuizDifficulty(question);
    question.grade = numericGrade(question.grade) || GRADES_BY_DIFFICULTY[question.difficulty];
    return question;
  }

  Object.entries(quizBank).forEach(([key, list]) => {
    if (!Array.isArray(list)) return;
    list.forEach((question, index) => normalizeQuestion(question, key, index));
  });

  function getQuizDifficultyForSelectedMode() {
    const selected = window.catsOwlDifficulty?.get?.() || localStorage.getItem(STORAGE_KEY);
    return normalizeMode(selected);
  }

  function filterQuizByDifficulty(list, selectedDifficulty) {
    return list.filter((question) => normalizeQuizDifficulty(question) === selectedDifficulty);
  }

  function shuffle(list) {
    const result = list.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  }

  function questionId(question) {
    return String(question?.id || question?.question || "");
  }

  function questionKey(question) {
    return String(question?.question || questionId(question));
  }

  function shuffleQuizOptions(question) {
    if (!question || !Array.isArray(question.options) || question.options.length < 2) return question;
    const indexedOptions = question.options.map((option, index) => ({ option, index }));
    let shuffled = shuffle(indexedOptions);
    if (shuffled.every((entry, index) => entry.index === index)) {
      shuffled = [...shuffled.slice(1), shuffled[0]];
    }
    return {
      ...question,
      options: shuffled.map((entry) => entry.option),
      answer: shuffled.findIndex((entry) => entry.index === question.answer),
    };
  }

  function questionsForSelectedMode(list, selectedDifficulty) {
    const source = Array.isArray(list) ? list : [];
    const mode = normalizeMode(selectedDifficulty);
    const fallbackOrder = FALLBACK_ORDER[mode] || FALLBACK_ORDER.normal;
    for (const difficulty of fallbackOrder) {
      const candidates = filterQuizByDifficulty(source, difficulty);
      if (candidates.length) return { candidates, difficulty };
    }
    return { candidates: source, difficulty: "any" };
  }

  function pickQuizWithoutRepeats(list, selectedDifficulty, key, scope) {
    const { candidates, difficulty } = questionsForSelectedMode(list, selectedDifficulty);
    const fallback = quizBank.math?.[0];
    if (!candidates.length) return shuffleQuizOptions(fallback);

    const bagKey = `${scope || "global"}\u0000${key}\u0000${difficulty}`;
    const scopeKey = scope || "global";
    let usedQuestionKeys = usedQuestionKeysByScope.get(scopeKey);
    if (!usedQuestionKeys) {
      usedQuestionKeys = new Set();
      usedQuestionKeysByScope.set(scopeKey, usedQuestionKeys);
    }
    let bag = quizBags.get(bagKey);
    if (!bag?.length) {
      const available = candidates.filter((question) => !usedQuestionKeys.has(questionKey(question)));
      if (!available.length) candidates.forEach((question) => usedQuestionKeys.delete(questionKey(question)));
      bag = shuffle(available.length ? available : candidates);
      const lastQuestion = lastQuestionByBag.get(bagKey);
      if (bag.length > 1 && questionId(bag[bag.length - 1]) === lastQuestion) {
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      }
      quizBags.set(bagKey, bag);
    }
    const question = bag.pop();
    lastQuestionByBag.set(bagKey, questionId(question));
    usedQuestionKeys.add(questionKey(question));
    return shuffleQuizOptions(question);
  }

  function pickQuizForDifficulty(list, selectedDifficulty) {
    const source = Array.isArray(list) ? list : [];
    const mode = normalizeMode(selectedDifficulty);
    const fallbackOrder = FALLBACK_ORDER[mode] || FALLBACK_ORDER.normal;

    for (const difficulty of fallbackOrder) {
      const candidates = filterQuizByDifficulty(source, difficulty);
      if (candidates.length) return candidates[Math.floor(Math.random() * candidates.length)];
    }

    return source[Math.floor(Math.random() * source.length)] || quizBank.math?.[0];
  }

  function refreshCurrentQuizTasks() {
    if (typeof state === "undefined" || !state) return;
    const level = typeof levels === "undefined" ? null : levels[state.levelIndex];
    const levelScope = level?.id || level?.bg || level?.name;
    state.tasksList?.forEach((task) => {
      if (task.kind === "quiz" && task.quizKey) task.quiz = randomQuiz(task.quizKey, levelScope);
    });
  }

  randomQuiz = function randomDifficultyQuiz(key, scope) {
    return pickQuizWithoutRepeats(quizBank[key] || [], getQuizDifficultyForSelectedMode(), key, scope);
  };

  window.catsOwlQuizDifficulty = {
    get: getQuizDifficultyForSelectedMode,
    grades: { ...DIFFICULTY_BY_GRADE },
    normalize: normalizeQuizDifficulty,
    filter: filterQuizByDifficulty,
    pick: pickQuizForDifficulty,
  };

  refreshCurrentQuizTasks();
})();
