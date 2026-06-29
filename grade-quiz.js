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
    state.tasksList?.forEach((task) => {
      if (task.kind === "quiz" && task.quizKey) task.quiz = randomQuiz(task.quizKey);
    });
  }

  randomQuiz = function randomDifficultyQuiz(key) {
    return pickQuizForDifficulty(quizBank[key] || [], getQuizDifficultyForSelectedMode());
  };

  window.catsOwlQuizDifficulty = {
    get: getQuizDifficultyForSelectedMode,
    normalize: normalizeQuizDifficulty,
    filter: filterQuizByDifficulty,
    pick: pickQuizForDifficulty,
  };

  refreshCurrentQuizTasks();
})();
