/* Guarded world-map entry for the Riverside Dock chapter. */
(function setupRiversideDockMapEntry() {
  const WORLD_ID = "riverside_dock";

  function startIndex() {
    if (!Array.isArray(levels)) return -1;
    return levels.findIndex((level) => level.world === WORLD_ID);
  }

  function isUnlocked() {
    return Boolean(window.CATS_OWLS_PROGRESS?.isWorldUnlocked(WORLD_ID));
  }

  function openRiversideDock() {
    const levelIndex = startIndex();
    if (!isUnlocked() || levelIndex < 0 || !levels[levelIndex]) return;
    const keepHearts = Boolean(state && state.hearts > 0);
    gameEntered = true;
    document.getElementById("homeScreen")?.classList.add("is-hidden");
    const panel = document.getElementById("worldMapPanel");
    if (panel) panel.hidden = true;
    resetGame(levelIndex, keepHearts, { startRiversideDockChapter: true });
    startBtn.textContent = text.start;
    messageEl.textContent = "已从世界地图进入河畔码头篇，点击开始检查安全路线。";
    preloadNearbyBackgrounds(levelIndex);
  }

  function addEntryAction() {
    const detail = document.getElementById("worldMapDetail");
    const active = document.querySelector('#worldMapGrid [data-region="riverside_dock"][aria-pressed="true"]');
    if (!detail || !active || detail.querySelector("[data-riverside-dock-start]")) return;
    if (!isUnlocked()) {
      const note = document.createElement("p");
      note.textContent = "完成橡果镇公告板任务后解锁河畔码头。";
      detail.appendChild(note);
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.riversideDockStart = "true";
    button.textContent = "进入河畔码头篇";
    (detail.querySelector(".world-detail-actions") || detail).appendChild(button);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-riverside-dock-start]")) {
      event.preventDefault();
      openRiversideDock();
      return;
    }
    if (event.target.closest('#worldMapGrid [data-region="riverside_dock"]')) {
      window.setTimeout(addEntryAction, 0);
    }
  });
})();
