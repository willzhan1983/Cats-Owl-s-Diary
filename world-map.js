(function () {
  const CHARACTER_REGISTRY = {
    mimi: { name: "Mimi", role: "主角", description: "白色小猫，蓝色蝴蝶结，主控角色。" },
    owlly: { name: "Owlly", role: "伙伴", description: "粉色猫头鹰，圆眼镜，日记伙伴和地图引导。" },
    lily: { name: "Lily", role: "NPC", description: "小兔子，森林学校与花园任务。" },
    coco: { name: "Coco", role: "NPC", description: "小松鼠，苹果谷与橡果任务。" },
    nono: { name: "Nono", role: "NPC", description: "小刺猬，图书、作业本、知识任务。" },
    dodo: { name: "Dodo", role: "NPC", description: "小鸭，湖边、码头、湿地任务。" },
    ruru: { name: "Ruru", role: "NPC", description: "小浣熊，森林公路、橡果镇、探险队长。" },
    black_bear: { name: "Black Bear", role: "Boss", description: "黑熊怪，迷雾沼泽 Boss，后期揭示为森林守护者。" },
  };

  const VISUAL_REFERENCE_PLAN = {
    note: "这些图片只作为设计参考，不在游戏运行时加载。",
    files: [
      "docs/visual-reference/characters-lineup.png",
      "docs/visual-reference/props-obstacles.png",
      "docs/visual-reference/world-regions.png",
    ],
  };

  const WORLD_MAP = {
    starlight_mountain: {
      name: "星光山",
      emoji: "⛰️",
      type: "mountain",
      description: "Mimi 和 Owlly 登上星光山，完成森林日记。黑熊怪也被大家理解，成为森林真正的守护者。",
      background: "assets/bg-level6-boss.jpg",
      npcs: ["owlly", "black_bear"],
      neighbors: ["mist_swamp"],
      unlocked: false,
      unlockCondition: "完成迷雾沼泽真相任务",
      position: { column: 2, row: 1 },
      theme: "结局区域、最终日记、星光碎片",
      previous: "迷雾沼泽",
      next: "结局",
      tasks: [
        { id: "sm_collect_starlight", name: "收集星光碎片", npc: "owlly", gameplay: "收集碎片", reward: "星光碎片 x5" },
        { id: "sm_finish_diary", name: "完成最终日记", npc: "owlly", gameplay: "汇总之前任务成果", reward: "完整日记" },
        { id: "sm_thank_guardian", name: "感谢森林守护者", npc: "black_bear", gameplay: "与黑熊对话", reward: "守护者徽章" },
        { id: "sm_unlock_ending", name: "解锁结局", npc: "mimi", gameplay: "完成最终动画", reward: "游戏结局" },
      ],
    },
    mist_swamp: {
      name: "迷雾沼泽",
      emoji: "🌫️",
      type: "swamp",
      description: "迷雾沼泽看起来危险，黑熊怪似乎是 Boss。随着任务推进，Mimi 和 Owlly 发现黑熊其实在守护森林。",
      background: "assets/v2/v2-bg-swamp-boss.png",
      npcs: ["black_bear", "owlly"],
      neighbors: ["starlight_mountain", "forest_school", "wetland_park"],
      unlocked: false,
      unlockCondition: "完成湿地公园迷雾线索任务",
      position: { column: 2, row: 2 },
      theme: "Boss 区域、真相揭示、勇气任务",
      previous: "森林学校 / 湿地公园线索",
      next: "星光山",
      tasks: [
        { id: "ms_clear_mist", name: "清理迷雾", npc: "owlly", gameplay: "收集光源清除雾气", reward: "光源道具" },
        { id: "ms_find_courage_star", name: "寻找勇气星星", npc: "owlly", gameplay: "找到隐藏星星", reward: "勇气星星" },
        { id: "ms_meet_black_bear", name: "遇见黑熊怪", npc: "black_bear", gameplay: "Boss 前置剧情", reward: "黑熊真相线索" },
        { id: "ms_guardian_truth", name: "理解森林守护者", npc: "black_bear", gameplay: "对话 / 任务选择", reward: "解锁星光山" },
      ],
    },
    moonlight_lake: {
      name: "月光湖",
      emoji: "🌊",
      type: "lake",
      description: "月光湖边出现奇怪涟漪，Dodo 发现一页日记漂到了湖边。Mimi 和 Owlly 需要帮忙找回日记页并修好小木桥。",
      background: "assets/v2/v2-bg-pond.png",
      npcs: ["dodo", "owlly"],
      neighbors: ["forest_school"],
      unlocked: true,
      unlockCondition: "完成森林学校基础任务",
      position: { column: 1, row: 3 },
      theme: "湖边探索、日记页、轻解谜",
      previous: "森林学校",
      next: "森林学校、湿地线索",
      tasks: [
        { id: "ml_lost_diary_page", name: "找湖边日记页", npc: "dodo", gameplay: "在湖边寻找漂来的日记页", reward: "日记页 x1" },
        { id: "ml_fix_bridge", name: "修小木桥", npc: "dodo", gameplay: "收集木板或树枝修桥", reward: "解锁码头线索" },
        { id: "ml_avoid_pond", name: "避开水坑", npc: "owlly", gameplay: "引导玩家绕开水坑区域", reward: "速度恢复道具" },
        { id: "ml_find_water_pencil", name: "找水边铅笔", npc: "dodo", gameplay: "在湖边草丛中寻找铅笔", reward: "铅笔道具" },
      ],
    },
    forest_school: {
      name: "森林学校",
      emoji: "🏫",
      type: "school",
      description: "Mimi 和 Owlly 在森林学校开始新一天的森林日记。Lily、Coco 和 Nono 都遇到了小麻烦，需要帮忙找作业本、送苹果、找铅笔。",
      background: "assets/bg-level1-schoolyard.png",
      npcs: ["lily", "coco", "nono", "owlly"],
      neighbors: ["moonlight_lake", "apple_valley", "mist_swamp", "forest_road"],
      unlocked: true,
      unlockCondition: "默认解锁",
      position: { column: 2, row: 3 },
      theme: "新手引导、基础任务、日记起点",
      previous: "无",
      next: "月光湖、苹果谷、森林公路、迷雾沼泽",
      tasks: [
        { id: "fs_homework_book", name: "找作业本", npc: "nono", gameplay: "在学校区域寻找作业本", reward: "日记页 x1" },
        { id: "fs_send_apple", name: "送苹果", npc: "coco", gameplay: "把苹果送给 Lily", reward: "爱心 x1" },
        { id: "fs_find_pencil", name: "找铅笔", npc: "lily", gameplay: "在草地或教室附近找铅笔", reward: "铅笔道具" },
        { id: "fs_help_friends", name: "帮助小动物", npc: "owlly", gameplay: "完成任意两个 NPC 小任务", reward: "解锁月光湖和苹果谷" },
      ],
    },
    apple_valley: {
      name: "苹果谷",
      emoji: "🍎",
      type: "valley",
      description: "苹果谷丰收了，但 Coco 搬不动这么多苹果。Mimi 帮忙收集苹果、整理果篮，并把苹果送回森林学校。",
      background: "assets/bg-level2-forest.png",
      npcs: ["coco", "owlly"],
      neighbors: ["forest_school", "acorn_town"],
      unlocked: true,
      unlockCondition: "完成森林学校基础任务",
      position: { column: 3, row: 3 },
      theme: "收集任务、送苹果、轻资源玩法",
      previous: "森林学校",
      next: "森林学校、橡果镇伏笔",
      tasks: [
        { id: "av_collect_apples", name: "收集苹果", npc: "coco", gameplay: "收集指定数量苹果", reward: "苹果 x3" },
        { id: "av_send_apples", name: "送苹果回学校", npc: "coco", gameplay: "把苹果送回森林学校", reward: "爱心 x1" },
        { id: "av_sort_basket", name: "整理果篮", npc: "coco", gameplay: "简单排序小游戏", reward: "果篮徽章" },
        { id: "av_find_golden_apple", name: "找金苹果", npc: "owlly", gameplay: "找隐藏苹果", reward: "解锁橡果镇线索" },
      ],
    },
    forest_road: {
      name: "森林公路",
      emoji: "🚗",
      type: "road",
      description: "森林公路被石头和树枝挡住，Ruru 正在巡逻。Mimi 需要帮忙清理道路、修好路牌，才能前往橡果镇。",
      background: "assets/v2/v2-bg-city-road.png",
      npcs: ["ruru", "owlly"],
      neighbors: ["forest_school", "acorn_town"],
      unlocked: true,
      unlockCondition: "完成森林学校基础任务",
      position: { column: 2, row: 4 },
      theme: "过渡地图、障碍清理、护送任务",
      previous: "森林学校",
      next: "橡果镇",
      tasks: [
        { id: "fr_clear_rocks", name: "清理石头", npc: "ruru", gameplay: "移除路上石块障碍", reward: "解锁公路通行" },
        { id: "fr_fix_sign", name: "修路牌", npc: "ruru", gameplay: "找回路牌碎片", reward: "地图碎片" },
        { id: "fr_escort_friend", name: "护送朋友过路", npc: "ruru", gameplay: "护送小动物到安全区域", reward: "爱心 x1" },
        { id: "fr_find_road_map", name: "找路线图", npc: "owlly", gameplay: "在路边寻找地图", reward: "解锁橡果镇" },
      ],
    },
    acorn_town: {
      name: "橡果镇",
      emoji: "🏙️",
      type: "town",
      description: "橡果镇是森林居民的小镇。Mimi 和 Owlly 在这里看到任务公告板，发现河畔码头的桥坏了，需要继续前往码头帮忙。",
      background: "assets/v2/v2-bg-city-road.png",
      npcs: ["ruru", "coco", "owlly"],
      neighbors: ["forest_road", "riverside_dock"],
      unlocked: false,
      unlockCondition: "完成森林公路任务",
      position: { column: 2, row: 5 },
      theme: "小镇任务、公告板、道具兑换",
      previous: "森林公路",
      next: "河畔码头",
      tasks: [
        { id: "at_deliver_letter", name: "送信", npc: "ruru", gameplay: "把信送给指定 NPC", reward: "邮差徽章" },
        { id: "at_find_acorns", name: "找丢失的橡果", npc: "coco", gameplay: "收集橡果", reward: "橡果 x5" },
        { id: "at_trade_items", name: "兑换道具", npc: "coco", gameplay: "用苹果或橡果兑换道具", reward: "药水 / 星星" },
        { id: "at_notice_board", name: "查看公告板", npc: "owlly", gameplay: "阅读新任务提示", reward: "解锁码头任务" },
      ],
    },
    riverside_dock: {
      name: "河畔码头",
      emoji: "🌉",
      type: "dock",
      description: "河畔码头的桥坏了。Dodo 需要 Mimi 帮忙找船桨、修桥，才能继续前往湿地公园。",
      background: "assets/v2/v2-bg-pond.png",
      npcs: ["dodo", "ruru", "owlly"],
      neighbors: ["acorn_town", "wetland_park"],
      unlocked: false,
      unlockCondition: "完成橡果镇公告板任务",
      position: { column: 2, row: 6 },
      theme: "桥、船、通往湿地",
      previous: "橡果镇",
      next: "湿地公园",
      tasks: [
        { id: "rd_fix_bridge", name: "修桥", npc: "dodo", gameplay: "收集木板修桥", reward: "解锁湿地公园" },
        { id: "rd_find_paddle", name: "找船桨", npc: "dodo", gameplay: "在码头附近找船桨", reward: "船桨道具" },
        { id: "rd_deliver_package", name: "送包裹", npc: "ruru", gameplay: "将包裹送到码头", reward: "爱心 x1" },
        { id: "rd_check_water", name: "检查水位", npc: "owlly", gameplay: "阅读提示判断安全路线", reward: "湿地通行证" },
      ],
    },
    wetland_park: {
      name: "湿地公园",
      emoji: "🦆",
      type: "wetland",
      description: "湿地公园出现异常迷雾。Dodo 和 Nono 发现迷雾似乎来自更北边的沼泽区域，Mimi 和 Owlly 准备前往调查。",
      background: "assets/v2/v2-bg-wetland.png",
      npcs: ["dodo", "nono", "owlly"],
      neighbors: ["riverside_dock", "mist_swamp"],
      unlocked: false,
      unlockCondition: "完成河畔码头修桥任务",
      position: { column: 2, row: 7 },
      theme: "生态保护、隐藏任务、迷雾线索",
      previous: "河畔码头",
      next: "迷雾沼泽",
      tasks: [
        { id: "wp_protect_wetland", name: "保护湿地", npc: "dodo", gameplay: "清理垃圾或障碍", reward: "湿地徽章" },
        { id: "wp_find_pencil", name: "找水边铅笔", npc: "nono", gameplay: "在芦苇附近找铅笔", reward: "铅笔道具" },
        { id: "wp_help_duck_home", name: "帮小鸭回家", npc: "dodo", gameplay: "护送小鸭回到水边", reward: "爱心 x1" },
        { id: "wp_mist_clue", name: "找到迷雾线索", npc: "owlly", gameplay: "发现来自沼泽的迷雾", reward: "解锁迷雾沼泽" },
      ],
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

  function getCharacterName(id) {
    return CHARACTER_REGISTRY[id]?.name || id;
  }

  function listText(values) {
    return values && values.length ? values.join("、") : "等待发现";
  }

  function getTaskObjective(task) {
    return task.objective || task.gameplay || "等待任务接入";
  }

  function renderTaskList(tasks) {
    return tasks
      .map(
        (task) => `
          <li class="world-task-card">
            <div class="world-task-title">
              <strong>${task.name}</strong>
              <code>${task.id}</code>
            </div>
            <dl class="world-task-meta">
              <div><dt>NPC</dt><dd>${getCharacterName(task.npc)}</dd></div>
              <div><dt>Objective</dt><dd>${getTaskObjective(task)}</dd></div>
              <div><dt>Reward</dt><dd>${task.reward}</dd></div>
            </dl>
          </li>
        `
      )
      .join("");
  }

  function renderNpcList(npcs) {
    return npcs
      .map((id) => {
        const character = CHARACTER_REGISTRY[id];
        return `<li><strong>${getCharacterName(id)}</strong><span>${character?.role || "NPC"} · ${character?.description || "等待补充"}</span></li>`;
      })
      .join("");
  }

  function renderReferenceList() {
    return VISUAL_REFERENCE_PLAN.files.map((file) => `<li>${file}</li>`).join("");
  }

  function renderMapOverview() {
    const detail = document.getElementById("worldMapDetail");
    if (!detail) return;

    detail.innerHTML = `
      <div class="world-detail-heading">
        <span class="world-detail-emoji" aria-hidden="true">📖</span>
        <div>
          <h3>任务详情</h3>
          <p>点击左侧区域，查看那一天的朋友和任务。</p>
        </div>
      </div>
      <p class="world-detail-copy">这里是安全的世界地图资料面板，只展示后续关卡设计，不会切换当前游戏关卡。</p>
      <section class="world-reference-section" aria-label="视觉参考计划">
        <h4>视觉参考</h4>
        <p>${VISUAL_REFERENCE_PLAN.note}</p>
        <ul>${renderReferenceList()}</ul>
      </section>
    `;
  }

  function renderRegionDetail(regionId) {
    const detail = document.getElementById("worldMapDetail");
    const region = WORLD_MAP[regionId] || WORLD_MAP.forest_school;
    if (!detail || !region) return;

    detail.innerHTML = `
      <div class="world-detail-actions">
        <button type="button" class="world-detail-back" data-world-detail-back>返回地图</button>
      </div>
      <div class="world-detail-heading">
        <span class="world-detail-emoji" aria-hidden="true">${region.emoji}</span>
        <div>
          <h3>${region.name}</h3>
          <p>${region.unlocked ? "已开放区域" : "后续解锁区域"} · ${region.theme}</p>
        </div>
      </div>
      <p class="world-detail-copy">${region.description}</p>
      <dl class="world-detail-list">
        <div><dt>区域名称</dt><dd>${region.emoji} ${region.name}</dd></div>
        <div><dt>Unlock status</dt><dd>${region.unlocked ? "已解锁 / Unlocked" : "未解锁 / Locked"}；${region.unlockCondition}</dd></div>
        <div><dt>解锁条件</dt><dd>${region.unlockCondition}</dd></div>
        <div><dt>Background image path</dt><dd>${region.background}</dd></div>
        <div><dt>Connected / next regions</dt><dd>${listText(region.neighbors.map((id) => WORLD_MAP[id]?.name || id))}；下一阶段：${region.next}</dd></div>
      </dl>
      <section class="world-npc-section" aria-label="${region.name}NPC 列表">
        <h4>NPC List</h4>
        <ul>${renderNpcList(region.npcs)}</ul>
      </section>
      <section class="world-task-section" aria-label="${region.name}任务表">
        <h4>Task List</h4>
        <ul>${renderTaskList(region.tasks)}</ul>
      </section>
      <section class="world-reference-section" aria-label="视觉参考计划">
        <h4>视觉参考</h4>
        <p>${VISUAL_REFERENCE_PLAN.note}</p>
        <ul>${renderReferenceList()}</ul>
      </section>
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

    map.onclick = (event) => {
      const node = event.target.closest("[data-region]");
      if (!node) return;
      map.querySelectorAll("[data-region]").forEach((entry) => entry.setAttribute("aria-pressed", "false"));
        node.setAttribute("aria-pressed", "true");
        renderRegionDetail(node.dataset.region);
    };

    renderMapOverview();
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
      if (event.target.closest("[data-world-detail-back]")) {
        document.querySelectorAll("#worldMapGrid [data-region]").forEach((entry) => entry.setAttribute("aria-pressed", "false"));
        renderMapOverview();
      }
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !document.getElementById("worldMapPanel")?.hidden) closeWorldMap();
    });
  }

  window.WorldMapSystem = {
    WORLD_MAP,
    MAP_CONNECTIONS,
    CHARACTER_REGISTRY,
    VISUAL_REFERENCE_PLAN,
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
