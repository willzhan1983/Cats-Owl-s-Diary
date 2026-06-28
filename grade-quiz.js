/* Grade selector and grade-aware quiz picking. */
(function setupGradeAwareQuizzes() {
  if (typeof quizBank === "undefined") return;

  const STORAGE_KEY = "catsOwlGrade";
  const DEFAULT_GRADE = 3;
  const gradeButtons = document.querySelectorAll("[data-grade]");

  function clampGrade(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return DEFAULT_GRADE;
    return Math.max(1, Math.min(6, Math.round(number)));
  }

  let selectedGrade = clampGrade(localStorage.getItem(STORAGE_KEY) || DEFAULT_GRADE);

  function questionMinGrade(question) {
    return clampGrade(question.minGrade || question.grade || 1);
  }

  function questionMaxGrade(question) {
    return clampGrade(question.maxGrade || question.grade || 6);
  }

  function questionMatchesGrade(question) {
    if (!question.grade && !question.minGrade && !question.maxGrade) {
      return selectedGrade <= 3 && !["hard", "expert"].includes(question.difficulty);
    }
    return questionMinGrade(question) <= selectedGrade && selectedGrade <= questionMaxGrade(question);
  }

  function syncGradeButtons() {
    gradeButtons.forEach((button) => {
      const grade = clampGrade(button.dataset.grade);
      const selected = grade === selectedGrade;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function pickQuestion(list) {
    const exact = list.filter((question) => Number(question.grade) === selectedGrade);
    const matched = list.filter(questionMatchesGrade);
    const candidates = exact.length ? exact : matched.length ? matched : list;
    return candidates[Math.floor(Math.random() * candidates.length)] || quizBank.math[0];
  }

  randomQuiz = function randomGradeQuiz(key) {
    const list = quizBank[key] || [];
    return pickQuestion(list);
  };

  function rerollCurrentQuizLevel() {
    if (typeof state === "undefined" || !state || state.running) return;
    const hasQuiz = state.tasksList?.some((task) => task.kind === "quiz");
    if (!hasQuiz || typeof resetGame !== "function") return;
    resetGame(state.levelIndex, state.levelIndex > 0);
    if (typeof messageEl !== "undefined") {
      messageEl.textContent = `已切换为小学${selectedGrade}年级题库，点击开始继续挑战。`;
    }
  }

  function setSelectedGrade(grade, reroll = true) {
    selectedGrade = clampGrade(grade);
    localStorage.setItem(STORAGE_KEY, String(selectedGrade));
    syncGradeButtons();
    if (reroll) rerollCurrentQuizLevel();
  }

  gradeButtons.forEach((button) => {
    button.addEventListener("click", () => setSelectedGrade(button.dataset.grade));
  });

  window.catsOwlQuizGrade = {
    get: () => selectedGrade,
    set: (grade) => setSelectedGrade(grade),
  };

  syncGradeButtons();
  rerollCurrentQuizLevel();
})();
