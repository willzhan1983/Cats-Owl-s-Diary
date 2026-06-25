(function () {
  const WORLD_MAP = {
    starlight_mountain: {
      name: "星光山",
      emoji: "⛰️",
      type: "mountain",
      description: "世界最高处，夜晚可以看到星星。Owlly 会在这里完成最终日记。",
      background: "assets/bg-level6-boss.jpg",
      npcs: ["Owlly"],
      tasks: ["收集星光碎片", "完成最终日记"],
      neighbors: ["mist_swamp"],
      unlocked: false,
      position: { column: 2, row: 1 },
    },
    mist_swamp: {
      name: "迷雾沼泽",
      emoji: "🌫️",
      type: "swamp",
      description: "被迷雾覆盖的神秘区域，黑熊怪守护着这里。",
      background: "assets/v2/v2-bg-swamp-boss.png",
      npcs: ["Black Bear"],
      tasks: ["清理迷雾", "寻找勇气星星", "理解黑熊怪的真相"],
      neighbors: ["starlight_mountain", "forest_school"],
      unlocked: false,
      position: { column: 2, row: 2 },
    },
    moonlight_lake: {
      name: "月光湖",
      emoji: "🌊",
      type: "lake",
      description: "安静的湖边区域，适合寻找遗失物和解谜。",
      background: "assets/v2/v2-bg-pond.png",
      npcs: ["Dodo"],
      tasks: ["找回湖边日记页", "帮助小鸭 Dodo", "修理小木桥"],
      neighbors: ["forest_school"],
      unlocked: true,
      position: { column: 1, row: 3 },
    },
    forest_school: {
      name: "森林学校",
      emoji: "🏫",
      type: "school",
      description: "Mimi 和 Owlly 的起点，也是森林朋友们学习和生活的地方。",
      background: "assets/bg-level1-schoolyard.png",
      npcs: ["Mimi", "Owlly", "Lily", "Coco", "Nono"],
      tasks: ["找作业本", "送苹果", "找铅笔", "帮助小动物"],
      neighbors: ["moonlight_lake", "apple_valley", "mist_swamp", "forest_road"],
      unlocked: true,
      position: { column: 2, row: 3 },
    },
    apple_valley: {
      name: "苹果谷",
      emoji: "🍎",
      type: "valley",
      description: "长满苹果树的山谷，Coco 经常在这里收集果实。",
      background: "assets/bg-level2-forest.png",
      npcs: ["Coco"],
      tasks: ["送苹果", "收集苹果", "帮助松鼠 Coco 整理果篮"],
      neighbors: ["forest_school"],
      unlocked: true,
      position: { column: 3, row: 3 },
    },
    forest_road: {
      name: "森林公路",
      emoji: "🚗",
      type: "road",
      description: "连接森林学校和橡果镇的道路，Ruru 会在这里巡逻。",
      background: "assets/v2/v2-bg-city-road.png",
      npcs: ["Ruru"],
      tasks: ["修路牌", "清理障碍物", "护送朋友过路"],
      neighbors: ["forest_school", "acorn_town"],
      unlocked: true,
      position: { column: 2, row: 4 },
    },
    acorn_town: {
      name: "橡果镇",
      emoji: "🏙️",
      type: "town",
      description: "森林居民的小镇，有商店、邮差和任务公告板。",
      background: "assets/v2/v2-bg-city-road.png",
      npcs: ["Ruru", "Coco"],
      tasks: ["送信", "兑换物品", "寻找丢失的橡果"],
      neighbors: ["forest_road", "riverside_dock"],
      unlocked: false,
      position: { column: 2, row: 5 },
    },
    riverside_dock: {
      name: "河畔码头",
      emoji: "🌉",
      type: "dock",
      description: "通往湿地公园的码头，可以遇到水边的朋友。",
      background: "assets/v2/v2-bg-pond.png",
      npcs: ["Dodo"],
      tasks: ["修桥", "送包裹", "找到船桨"],
      neighbors: ["acorn_town", "wetland_park"],
      unlocked: false,
      position: { column: 2, row: 6 },
    },
    wetland_park: {
      name: "湿地公园",
      emoji: "🦆",
      type: "wetland",
      description: "Dodo 最喜欢的湿地区域，有芦苇、水鸟和隐藏任务。",
      background: "assets/v2/v2-bg-wetland.png",
      npcs: ["Dodo", "Nono"],
      tasks: ["保护湿地", "寻找水边铅笔", "帮助小鸭回家"],
      neighbors: ["riverside_dock"],
      unlocked: false,
      position: { column: 2, row: 7 },
    },
  };

  const REGION_ORDER = [
    "starlight_mountain",
    "mist_swamp",
    "moonlight_lake",
    "forest_school",
    "apple_valley",
    "forest_road",
    "acorn_town",
    "riverside_dock",
    "wetland_park",
  ];

  const MAP_CONNECTIONS = [
    { from: "starlight_mountain", to: "mist_swamp", direction: "vertical" },
    { from: "mist_swamp", to: "forest_school", direction: "vertical" },
    { from: "moonlight_lake", to: "forest_school", direction: "horizontal-left" },
    { from: "forest_school", to: "apple_valley", direction: "horizontal-right" },
    { from: "forest_school", to: "forest_road", direction: "vertical" },
    { from: "forest_road", to: "acorn_town", direction: "vertical" },
    { from: "acorn_town", to: "riverside_dock", direction: "vertical" },
    { from: "riverside_dock", to: "wetland_park", direction: "vertical" },
  ];

  function listText(values) {
    return values && values.length ? values.join("、") : "等待发现";
  }

  function renderRegionDetail(regionId) {
    const detail = document.getElementById("worldMapDetail");
    const region = WORLD_MAP[regionId] || WORLD_MAP.forest_school;
    if (!detail || !region) return;

    detail.innerHTML = `
      <div class="world-detail-heading">
        <span class="world-detail-emoji" aria-hidden="true">${region.emoji}</span>
        <div>
          <h3>${region.name}</h3>
          <p>${region.unlocked ? "已开放区域" : "后续解锁区域"}</p>
        </div>
      </div>
      <p class="world-detail-copy">${region.description}</p>
      <dl class="world-detail-list">
        <div><dt>朋友</dt><dd>${listText(region.npcs)}</dd></div>
        <div><dt>任务</dt><dd>${listText(region.tasks)}</dd></div>
        <div><dt>背景</dt><dd>${region.background}</dd></div>
        <div><dt>相邻</dt><dd>${listText(region.neighbors.map((id) => WORLD_MAP[id]?.name || id))}</dd></div>
      </dl>
    `;
  }

  function createNode(regionId) {
    const region = WORLD_MAP[regionId];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `world-node world-node--${region.type}`;
    button.dataset.region = regionId;
    button.style.gridColumn = region.position.column;
    button.style.gridRow = region.position.row;
    button.setAttribute("aria-pressed", regionId === "forest_school" ? "true" : "false");
    button.innerHTML = `
      <span class="world-node-emoji" aria-hidden="true">${region.emoji}</span>
      <span class="world-node-name">${region.name}</span>
      <span class="world-node-lock">${region.unlocked ? "可探索" : "未解锁"}</span>
    `;
    return button;
  }

  function createConnection(connection) {
    const from = WORLD_MAP[connection.from];
    const to = WORLD_MAP[connection.to];
    const line = document.createElement("span");
    line.className = `world-path world-path--${connection.direction}`;
    line.setAttribute("aria-hidden", "true");

    if (connection.direction === "horizontal-left") {
      line.style.gridColumn = "1 / 3";
      line.style.gridRow = from.position.row;
    } else if (connection.direction === "horizontal-right") {
      line.style.gridColumn = "2 / 4";
      line.style.gridRow = from.position.row;
    } else {
      line.style.gridColumn = from.position.column;
      line.style.gridRow = `${Math.min(from.position.row, to.position.row)} / ${Math.max(from.position.row, to.position.row) + 1}`;
    }

    return line;
  }

  function renderWorldMap() {
    const map = document.getElementById("worldMapGrid");
    if (!map) return;

    map.innerHTML = "";
    MAP_CONNECTIONS.forEach((connection) => map.appendChild(createConnection(connection)));
    REGION_ORDER.forEach((regionId) => map.appendChild(createNode(regionId)));

    map.addEventListener("click", (event) => {
      const node = event.target.closest("[data-region]");
      if (!node) return;
      map.querySelectorAll("[data-region]").forEach((entry) => entry.setAttribute("aria-pressed", "false"));
      node.setAttribute("aria-pressed", "true");
      renderRegionDetail(node.dataset.region);
    });

    renderRegionDetail("forest_school");
  }

  function openWorldMap() {
    const panel = document.getElementById("worldMapPanel");
    if (!panel) return;
    panel.hidden = false;
    renderWorldMap();
    panel.querySelector("[data-world-close]")?.focus();
  }

  function closeWorldMap() {
    const panel = document.getElementById("worldMapPanel");
    if (!panel) return;
    panel.hidden = true;
    document.getElementById("worldMapBtn")?.focus();
  }

  function bindWorldMap() {
    document.getElementById("worldMapBtn")?.addEventListener("click", openWorldMap);
    document.querySelectorAll("[data-world-close]").forEach((button) => {
      button.addEventListener("click", closeWorldMap);
    });
    document.getElementById("worldMapPanel")?.addEventListener("click", (event) => {
      if (event.target.id === "worldMapPanel") closeWorldMap();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !document.getElementById("worldMapPanel")?.hidden) closeWorldMap();
    });
  }

  window.WorldMapSystem = {
    WORLD_MAP,
    MAP_CONNECTIONS,
    renderWorldMap,
    openWorldMap,
    closeWorldMap,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindWorldMap);
  } else {
    bindWorldMap();
  }
})();
