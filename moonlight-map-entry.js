/* World-map entry behavior for the Moonlight Lake chapter.
 * Keeps Moonlight Lake as an optional map destination instead of forcing it
 * immediately after the original main story ending.
 */
(function setupMoonlightMapEntry() {
  const MAIN_STORY_END_LEVEL = 6;
  const MOONLIGHT_WORLD_ID = "moonlight_lake";

  function moonlightStartIndex() {
    if (!Array.isArray(levels)) return 7;
    const index = levels.findIndex((level) => level.world === MOONLIGHT_WORLD_ID);
    return index >= 0 ? index : 7;
  }

  function openMoonlightLake() {
    const levelIndex = moonlightStartIndex();
    if (!levels[levelIndex]) return;
    const keepHearts = Boolean(state && state.levelIndex >= MAIN_STORY_END_LEVEL && state.hearts > 0);
    gameEntered = true;
    document.getElementById("homeScreen")?.classList.add("is-hidden");
    const panel = document.getElementById("worldMapPanel");
    if (panel) panel.hidden = true;
    resetGame(levelIndex, keepHearts);
    startBtn.textContent = text.start;
    messageEl.textContent = "已从世界地图进入月光湖篇，点击开始探索月光湖岸。";
    preloadNearbyBackgrounds(levelIndex);
  }

  function addMoonlightStartButton() {
    const detail = document.getElementById("worldMapDetail");
    const activeMoonlight = document.querySelector(`#worldMapGrid [data-region="${MOONLIGHT_WORLD_ID}"][aria-pressed="true"]`);
    if (!detail || !activeMoonlight || detail.querySelector("[data-moonlight-start]")) return;

    const actions = detail.querySelector(".world-detail-actions") || detail;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.moonlightStart = "true";
    button.textContent = "进入月光湖篇";
    button.style.marginLeft = "8px";
    button.style.minHeight = "36px";
    button.style.padding = "0 14px";
    button.style.borderRadius = "8px";
    button.style.border = "2px solid rgba(31,110,165,0.24)";
    button.style.background = "linear-gradient(180deg, #dff6ff, #8fd6ff)";
    button.style.color = "#174866";
    button.style.fontWeight = "900";
    actions.appendChild(button);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-moonlight-start]")) {
      event.preventDefault();
      openMoonlightLake();
      return;
    }
    if (event.target.closest(`#worldMapGrid [data-region="${MOONLIGHT_WORLD_ID}"]`)) {
      window.setTimeout(addMoonlightStartButton, 0);
    }
  });

  startBtn.addEventListener(
    "click",
    (event) => {
      if (!state?.levelClear || state.levelIndex !== MAIN_STORY_END_LEVEL) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      messageEl.textContent = "主线完成！请从世界地图进入月光湖篇。";
      window.WorldMapSystem?.openWorldMap?.();
      window.setTimeout(() => {
        const moonlightNode = document.querySelector(`#worldMapGrid [data-region="${MOONLIGHT_WORLD_ID}"]`);
        moonlightNode?.click();
        addMoonlightStartButton();
      }, 0);
    },
    true
  );
})();
