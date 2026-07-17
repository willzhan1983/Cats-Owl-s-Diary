/* Difficulty-aware quiz picking. */
(function setupDifficultyAwareQuizzes() {
  if (typeof quizBank === "undefined" || typeof randomQuiz !== "function") return;

  const STORAGE_KEY = "catsOwlDifficulty";
  const DIFFICULTIES = ["easy", "normal", "hard", "crazy"];
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
  const FALLBACK_ORDER = {
    easy: ["easy"],
    normal: ["normal", "easy"],
    hard: ["hard", "normal", "easy"],
    crazy: ["crazy", "hard", "normal", "easy"],
  };
  const quizBags = new Map();
  const lastQuestionByBag = new Map();

  function normalizeMode(value) {
    return DIFFICULTIES.includes(value) ? value : "normal";
  }

  function numericGrade(value) {
    const grade = Number(value);
    return Number.isFinite(grade) ? Math.max(1, Math.min(6, Math.round(grade))) : null;
  }

  function difficultyFromGrade(question) {
    const grade = numericGrade(question.grade);
    if (grade) {
      if (grade <= 2) return "easy";
      if (grade <= 4) return "normal";
      return "hard";
    }

    const min = numericGrade(question.minGrade);
    const max = numericGrade(question.maxGrade);
    if (!min && !max) return "normal";

    const low = min || max;
    const high = max || min;
    const midpoint = (low + high) / 2;
    if (midpoint <= 2) return "easy";
    if (midpoint <= 4) return "normal";
    return "hard";
  }

  function normalizeQuizDifficulty(question) {
    const raw = String(question?.difficulty || "").trim().toLowerCase();
    return DIFFICULTY_ALIASES[raw] || difficultyFromGrade(question || {});
  }

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

  function pickQuizForDifficulty(list, selectedDifficulty) {
    const { candidates } = questionsForSelectedMode(list, selectedDifficulty);
    return candidates[Math.floor(Math.random() * candidates.length)] || quizBank.math?.[0];
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

  function pickQuizWithoutRepeats(list, selectedDifficulty, key, scope) {
    const { candidates, difficulty } = questionsForSelectedMode(list, selectedDifficulty);
    const fallback = quizBank.math?.[0];
    if (!candidates.length) return shuffleQuizOptions(fallback);

    const bagKey = `${scope || "global"}\u0000${key}\u0000${difficulty}`;
    let bag = quizBags.get(bagKey);
    if (!bag?.length) {
      bag = shuffle(candidates);
      const lastQuestion = lastQuestionByBag.get(bagKey);
      if (bag.length > 1 && questionId(bag[bag.length - 1]) === lastQuestion) {
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      }
      quizBags.set(bagKey, bag);
    }

    const question = bag.pop();
    lastQuestionByBag.set(bagKey, questionId(question));
    return shuffleQuizOptions(question);
  }

  function refreshCurrentQuizTasks() {
    if (typeof state === "undefined" || !state) return;
    const level = typeof levels === "undefined" ? null : levels[state.levelIndex];
    const scope = level?.id || level?.bg || level?.name;
    state.tasksList?.forEach((task) => {
      if (task.kind === "quiz" && task.quizKey) task.quiz = randomQuiz(task.quizKey, scope);
    });
  }

  randomQuiz = function randomDifficultyQuiz(key, scope) {
    return pickQuizWithoutRepeats(quizBank[key] || [], getQuizDifficultyForSelectedMode(), key, scope);
  };

  window.catsOwlQuizDifficulty = {
    get: getQuizDifficultyForSelectedMode,
    normalize: normalizeQuizDifficulty,
    filter: filterQuizByDifficulty,
    pick: pickQuizForDifficulty,
  };

  refreshCurrentQuizTasks();
})();
