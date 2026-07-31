/* Guarded world-map entry for the Acorn Town chapter. */
(function setupAcornTownMapEntry() {
  const WORLD_ID = "acorn_town";

  function startIndex() {
    if (!Array.isArray(levels)) return -1;
    return levels.findIndex((level) => level.world === WORLD_ID);
  }

  function isUnlocked() {
    return Boolean(window.CATS_OWLS_PROGRESS?.isWorldUnlocked("acorn_town"));
  }

  function openAcornTown() {
    const levelIndex = startIndex();
    if (!isUnlocked() || levelIndex < 0 || !levels[levelIndex]) return;
    const keepHearts = Boolean(state && state.hearts > 0);
    gameEntered = true;
    document.getElementById("homeScreen")?.classList.add("is-hidden");
    const panel = document.getElementById("worldMapPanel");
    if (panel) panel.hidden = true;
    resetGame(levelIndex, keepHearts, { startAcornTownChapter: true });
    startBtn.textContent = text.start;
    messageEl.textContent = "已从世界地图进入橡果镇篇，点击开始帮助镇上的朋友。";
    preloadNearbyBackgrounds(levelIndex);
  }

  function addEntryAction() {
    const detail = document.getElementById("worldMapDetail");
    const active = document.querySelector('#worldMapGrid [data-region="acorn_town"][aria-pressed="true"]');
    if (!detail || !active || detail.querySelector("[data-acorn-town-start]")) return;
    if (!isUnlocked()) {
      const note = document.createElement("p");
      note.textContent = "完成森林公路后解锁橡果镇。";
      detail.appendChild(note);
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.acornTownStart = "true";
    button.textContent = "进入橡果镇篇";
    (detail.querySelector(".world-detail-actions") || detail).appendChild(button);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-acorn-town-start]")) {
      event.preventDefault();
      openAcornTown();
      return;
    }
    if (event.target.closest('#worldMapGrid [data-region="acorn_town"]')) {
      window.setTimeout(addEntryAction, 0);
    }
  });
})();
