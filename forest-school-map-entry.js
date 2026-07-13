/* World-map entry behavior for the Forest School chapter. */
(function setupForestSchoolMapEntry() {
  const FOREST_SCHOOL_WORLD_ID = "forest_school";

  function openForestSchool() {
    if (!levels[0]) return;
    const keepHearts = Boolean(state && state.hearts > 0);
    gameEntered = true;
    document.getElementById("homeScreen")?.classList.add("is-hidden");
    const panel = document.getElementById("worldMapPanel");
    if (panel) panel.hidden = true;
    resetGame(0, keepHearts);
    startBtn.textContent = text.start;
    messageEl.textContent = "已从世界地图进入森林学校篇，点击开始帮助小伙伴。";
    preloadNearbyBackgrounds(0);
  }

  function addForestSchoolStartButton() {
    const detail = document.getElementById("worldMapDetail");
    const activeForestSchool = document.querySelector(`#worldMapGrid [data-region="${FOREST_SCHOOL_WORLD_ID}"][aria-pressed="true"]`);
    if (!detail || !activeForestSchool || detail.querySelector("[data-forest-school-start]")) return;

    const actions = detail.querySelector(".world-detail-actions") || detail;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.forestSchoolStart = "true";
    button.textContent = "进入森林学校篇";
    button.style.marginLeft = "8px";
    button.style.minHeight = "36px";
    button.style.padding = "0 14px";
    button.style.borderRadius = "8px";
    button.style.border = "2px solid rgba(77,125,40,0.26)";
    button.style.background = "linear-gradient(180deg, #eef8ca, #b8dd78)";
    button.style.color = "#34563e";
    button.style.fontWeight = "900";
    actions.appendChild(button);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-forest-school-start]")) {
      event.preventDefault();
      openForestSchool();
      return;
    }
    if (event.target.closest(`#worldMapGrid [data-region="${FOREST_SCHOOL_WORLD_ID}"]`)) {
      window.setTimeout(addForestSchoolStartButton, 0);
    }
  });
})();
