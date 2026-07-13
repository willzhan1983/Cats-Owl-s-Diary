/* World-map entry behavior for the Forest Road chapter. */
(function setupForestRoadMapEntry() {
  const FOREST_ROAD_WORLD_ID = "forest_road";

  function forestRoadStartIndex() {
    if (!Array.isArray(levels)) return 16;
    const index = levels.findIndex((level) => level.world === FOREST_ROAD_WORLD_ID);
    return index >= 0 ? index : 16;
  }

  function openForestRoad() {
    const levelIndex = forestRoadStartIndex();
    if (!levels[levelIndex]) return;
    const keepHearts = Boolean(state && state.hearts > 0);
    gameEntered = true;
    document.getElementById("homeScreen")?.classList.add("is-hidden");
    const panel = document.getElementById("worldMapPanel");
    if (panel) panel.hidden = true;
    resetGame(levelIndex, keepHearts);
    startBtn.textContent = text.start;
    messageEl.textContent = "已从世界地图进入森林公路篇，点击开始清理道路。";
    preloadNearbyBackgrounds(levelIndex);
  }

  function addForestRoadStartButton() {
    const detail = document.getElementById("worldMapDetail");
    const activeForestRoad = document.querySelector(`#worldMapGrid [data-region="${FOREST_ROAD_WORLD_ID}"][aria-pressed="true"]`);
    if (!detail || !activeForestRoad || detail.querySelector("[data-forest-road-start]")) return;

    const actions = detail.querySelector(".world-detail-actions") || detail;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.forestRoadStart = "true";
    button.textContent = "进入森林公路篇";
    button.style.marginLeft = "8px";
    button.style.minHeight = "36px";
    button.style.padding = "0 14px";
    button.style.borderRadius = "8px";
    button.style.border = "2px solid rgba(139,87,42,0.26)";
    button.style.background = "linear-gradient(180deg, #fff2a8, #f0b75a)";
    button.style.color = "#5b3212";
    button.style.fontWeight = "900";
    actions.appendChild(button);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-forest-road-start]")) {
      event.preventDefault();
      openForestRoad();
      return;
    }
    if (event.target.closest(`#worldMapGrid [data-region="${FOREST_ROAD_WORLD_ID}"]`)) {
      window.setTimeout(addForestRoadStartButton, 0);
    }
  });
})();
