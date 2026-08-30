/* Guarded world-map entry for the Wetland Park chapter. */
(function setupWetlandParkMapEntry() {
  const WORLD_ID = "wetland_park";
  function startIndex() { return Array.isArray(levels) ? levels.findIndex((level) => level.world === WORLD_ID) : -1; }
  function isUnlocked() { return Boolean(window.CATS_OWLS_PROGRESS?.isWorldUnlocked(WORLD_ID)); }
  function openWetlandPark() {
    const levelIndex = startIndex();
    if (!isUnlocked() || levelIndex < 0 || !levels[levelIndex]) return;
    const keepHearts = Boolean(state && state.hearts > 0);
    gameEntered = true;
    document.getElementById("homeScreen")?.classList.add("is-hidden");
    const panel = document.getElementById("worldMapPanel");
    if (panel) panel.hidden = true;
    resetGame(levelIndex, keepHearts, { startWetlandParkChapter: true });
    startBtn.textContent = text.start;
    messageEl.textContent = "已从世界地图进入湿地公园篇，点击开始跟随 Lumi 探索迷雾。";
    preloadNearbyBackgrounds(levelIndex);
  }
  function addEntryAction() {
    const detail = document.getElementById("worldMapDetail");
    const active = document.querySelector('#worldMapGrid [data-region="wetland_park"][aria-pressed="true"]');
    if (!detail || !active || detail.querySelector("[data-wetland-park-start]")) return;
    if (!isUnlocked()) { const note = document.createElement("p"); note.textContent = "完成河畔码头安全渡河后解锁湿地公园。"; detail.appendChild(note); return; }
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.wetlandParkStart = "true";
    button.textContent = "进入湿地公园篇";
    (detail.querySelector(".world-detail-actions") || detail).appendChild(button);
  }
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-wetland-park-start]")) { event.preventDefault(); openWetlandPark(); return; }
    if (event.target.closest('#worldMapGrid [data-region="wetland_park"]')) window.setTimeout(addEntryAction, 0);
  });
})();
