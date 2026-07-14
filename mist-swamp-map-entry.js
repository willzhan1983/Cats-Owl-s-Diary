/* World-map entry behavior for the Mist Swamp chapter. */
(function setupMistSwampMapEntry() {
  const MIST_SWAMP_WORLD_ID = "mist_swamp";

  function mistSwampStartIndex() {
    const gameLevels = window.CATS_OWLS_GAME_DATA?.levels || levels;
    return gameLevels.findIndex((level) => level.world === MIST_SWAMP_WORLD_ID);
  }

  function openMistSwamp() {
    const levelIndex = mistSwampStartIndex();
    if (levelIndex < 0 || !levels[levelIndex]) return;
    const keepHearts = Boolean(state && state.hearts > 0);
    gameEntered = true;
    document.getElementById("homeScreen")?.classList.add("is-hidden");
    const panel = document.getElementById("worldMapPanel");
    if (panel) panel.hidden = true;
    resetGame(levelIndex, keepHearts);
    startBtn.textContent = text.start;
    messageEl.textContent = "已从世界地图进入迷雾沼泽篇。";
    preloadNearbyBackgrounds(levelIndex);
  }

  function addMistSwampStartButton() {
    const detail = document.getElementById("worldMapDetail");
    const active = document.querySelector(`#worldMapGrid [data-region="${MIST_SWAMP_WORLD_ID}"][aria-pressed="true"]`);
    if (!detail || !active || detail.querySelector("[data-mist-swamp-start]")) return;
    const actions = detail.querySelector(".world-detail-actions") || detail;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.mistSwampStart = "true";
    button.textContent = "进入迷雾沼泽篇";
    button.style.marginLeft = "8px";
    button.style.minHeight = "36px";
    button.style.padding = "0 14px";
    button.style.borderRadius = "8px";
    button.style.border = "2px solid rgba(74, 101, 95, 0.28)";
    button.style.background = "linear-gradient(180deg, #fff4a8, #9ed9b3)";
    button.style.color = "#29483d";
    button.style.fontWeight = "900";
    actions.appendChild(button);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-mist-swamp-start]")) {
      event.preventDefault();
      openMistSwamp();
      return;
    }
    if (event.target.closest(`#worldMapGrid [data-region="${MIST_SWAMP_WORLD_ID}"]`)) {
      window.setTimeout(addMistSwampStartButton, 0);
    }
  });
})();
