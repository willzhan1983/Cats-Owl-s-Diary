/* World-map entry behavior for the Apple Valley chapter. */
(function setupAppleValleyMapEntry() {
  const APPLE_VALLEY_WORLD_ID = "apple_valley";

  function appleValleyStartIndex() {
    if (!Array.isArray(levels)) return 12;
    const index = levels.findIndex((level) => level.world === APPLE_VALLEY_WORLD_ID);
    return index >= 0 ? index : 12;
  }

  function openAppleValley() {
    const levelIndex = appleValleyStartIndex();
    if (!levels[levelIndex]) return;
    const keepHearts = Boolean(state && state.hearts > 0);
    gameEntered = true;
    document.getElementById("homeScreen")?.classList.add("is-hidden");
    const panel = document.getElementById("worldMapPanel");
    if (panel) panel.hidden = true;
    resetGame(levelIndex, keepHearts);
    startBtn.textContent = text.start;
    messageEl.textContent = "已从世界地图进入苹果谷篇，点击开始帮助 Coco 收苹果。";
    preloadNearbyBackgrounds(levelIndex);
  }

  function addAppleValleyStartButton() {
    const detail = document.getElementById("worldMapDetail");
    const activeAppleValley = document.querySelector(`#worldMapGrid [data-region="${APPLE_VALLEY_WORLD_ID}"][aria-pressed="true"]`);
    if (!detail || !activeAppleValley || detail.querySelector("[data-apple-valley-start]")) return;

    const actions = detail.querySelector(".world-detail-actions") || detail;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.appleValleyStart = "true";
    button.textContent = "进入苹果谷篇";
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
    if (event.target.closest("[data-apple-valley-start]")) {
      event.preventDefault();
      openAppleValley();
      return;
    }
    if (event.target.closest(`#worldMapGrid [data-region="${APPLE_VALLEY_WORLD_ID}"]`)) {
      window.setTimeout(addAppleValleyStartButton, 0);
    }
  });
})();
