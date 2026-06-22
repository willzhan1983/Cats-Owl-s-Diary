// V0.3/V0.4 Cats & Owl's Diary life, world map, NPC and diary overlay
(() => {
  const WORLD_SCENES = [
    {
      key: "school",
      icon: "🏫",
      name: "森林学校",
      desc: "小猫和猫头鹰开始写日记的地方。",
      line: "今天从森林学校出发，看看谁需要帮忙吧。",
      diary: "我们在森林学校整理了今天的计划，小猫负责发现故事，猫头鹰负责写进日记。",
      npcs: ["🐰 Lily 想找回花篮", "🐿️ Coco 正在收集橡果"],
    },
    {
      key: "orchard",
      icon: "🍎",
      name: "苹果谷",
      desc: "收集苹果、勇气星和魔法铅笔。",
      line: "苹果谷有很多跳跳小路，慢慢来更安全。",
      diary: "今天我们在苹果谷帮助朋友收集苹果，风里都是甜甜的味道。",
      npcs: ["🦔 Nono 够不到苹果", "🐦 Bibi 找到一片羽毛"],
    },
    {
      key: "lake",
      icon: "🌊",
      name: "月光湖",
      desc: "湖泊、荷叶、漂流瓶和萤火虫。",
      line: "月光湖边可能漂来新的日记页。",
      diary: "湖面亮晶晶的，我们捡到一张湿湿的日记页，猫头鹰把它小心夹进本子里。",
      npcs: ["🦆 Dodo 发现漂流瓶", "🐸 Frogy 知道荷叶秘密"],
    },
    {
      key: "wetland",
      icon: "🦆",
      name: "湿地公园",
      desc: "芦苇、木栈道和稀有鸟类。",
      line: "湿地公园要轻轻走，不要打扰休息的小鸟。",
      diary: "我们沿着湿地木栈道前进，看见白鹭从芦苇间飞过。",
      npcs: ["🦢 Swan 守护浅水区", "🦩 Flora 丢了一根粉色羽毛"],
    },
    {
      key: "swamp",
      icon: "🐸",
      name: "迷雾沼泽",
      desc: "发光蘑菇、浮桥和隐藏故事。",
      line: "迷雾沼泽有点神秘，猫头鹰会提醒小猫慢慢走。",
      diary: "沼泽里的雾像棉花一样飘着，我们听见了老乌龟讲很久以前的故事。",
      npcs: ["🐢 Toto 讲古老故事", "🍄 Mumu 夜晚会发光"],
    },
    {
      key: "road",
      icon: "🚗",
      name: "森林公路",
      desc: "未来跑酷玩法入口。",
      line: "森林公路以后可以做晨跑和躲避障碍小游戏。",
      diary: "今天我们看见一条通向远方的公路，也许下一次可以来一场森林晨跑。",
      npcs: ["🐕 Buddy 想比赛跑步", "🚧 Sign 提醒小心滚木"],
    },
    {
      key: "town",
      icon: "🏙️",
      name: "橡果镇",
      desc: "动物城市、咖啡馆、邮局和小商店。",
      line: "橡果镇可以扩展服装、家具和装饰系统。",
      diary: "我们第一次来到橡果镇，街角的咖啡馆闻起来暖暖的。",
      npcs: ["🐻 Bear 开了咖啡馆", "🦝 Ruru 经营森林小店"],
    },
    {
      key: "pier",
      icon: "🌉",
      name: "河畔码头",
      desc: "小船、桥梁、风车和漂流瓶。",
      line: "河畔码头以后可以坐船去新区域。",
      diary: "小船轻轻碰着码头，猫头鹰说河流也会把故事带到远方。",
      npcs: ["🐟 Fifi 看见闪光物", "🛶 Boat 等待下一次旅行"],
    },
    {
      key: "mountain",
      icon: "⛰️",
      name: "星光山",
      desc: "观星台、流星雨和最终日记。",
      line: "星光山适合放在后期，作为完成大日记后的奖励地图。",
      diary: "星光山上可以看到最亮的星星，我们约好完成更多日记后再回来。",
      npcs: ["🦉 Ollie 想看星星", "⭐ Star 等待完整日记"],
    },
  ];

  const buddyLines = [
    "小猫：猫头鹰，我们今天写什么日记呀？",
    "猫头鹰：每一天都值得被记录。",
    "小猫：森林里好像有新发现！",
    "猫头鹰：我已经准备好日记本了。",
    "小猫：我们一起去帮助朋友吧！",
  ];

  function $(selector) {
    return document.querySelector(selector);
  }

  function showBubble(text, x, y) {
    let bubble = $(".life-bubble");
    if (!bubble) {
      bubble = document.createElement("div");
      bubble.className = "life-bubble";
      document.body.appendChild(bubble);
    }
    bubble.textContent = text;
    bubble.style.left = `${Math.max(24, Math.min(window.innerWidth - 24, x))}px`;
    bubble.style.top = `${Math.max(90, Math.min(window.innerHeight - 16, y))}px`;
    bubble.classList.add("is-showing");
    window.clearTimeout(bubble._timer);
    bubble._timer = window.setTimeout(() => bubble.classList.remove("is-showing"), 2600);
  }

  function sparkle(x, y) {
    ["✨", "❤️", "⭐"].forEach((icon, index) => {
      const s = document.createElement("div");
      s.className = "life-sparkle";
      s.textContent = icon;
      s.style.left = `${x + index * 20 - 20}px`;
      s.style.top = `${y - index * 6}px`;
      document.body.appendChild(s);
      window.setTimeout(() => s.remove(), 1100);
    });
  }

  function showDiary(text) {
    let toast = $(".diary-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "diary-toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `📔 ${text}`;
    toast.classList.add("is-showing");
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => toast.classList.remove("is-showing"), 4200);
  }

  function createWorldPanel() {
    if ($("#worldPanel")) return;

    const openBtn = document.createElement("button");
    openBtn.className = "world-fab";
    openBtn.type = "button";
    openBtn.textContent = "🗺️ 世界地图";
    document.body.appendChild(openBtn);

    const panel = document.createElement("section");
    panel.id = "worldPanel";
    panel.className = "world-panel";
    panel.setAttribute("aria-label", "Cats & Owl's Diary 世界地图");
    panel.innerHTML = `
      <button class="world-close" type="button" aria-label="关闭世界地图">×</button>
      <h2>小猫与猫头鹰的世界地图</h2>
      <div class="world-grid"></div>
      <p class="world-note">提示：现在先作为世界观和日记入口，后续可以逐步接入真实关卡。</p>
    `;
    document.body.appendChild(panel);

    const grid = panel.querySelector(".world-grid");
    WORLD_SCENES.forEach((scene) => {
      const card = document.createElement("button");
      card.className = "world-card";
      card.type = "button";
      card.innerHTML = `
        <div class="world-card-icon">${scene.icon}</div>
        <div class="world-card-name">${scene.name}</div>
        <div class="world-card-desc">${scene.desc}</div>
      `;
      card.addEventListener("click", () => {
        const rect = card.getBoundingClientRect();
        showBubble(scene.line, rect.left + rect.width / 2, rect.top + 8);
        sparkle(rect.left + rect.width / 2, rect.top + 54);
        showDiary(scene.diary);
        const message = $("#message");
        if (message) message.textContent = `${scene.icon} ${scene.name}：${scene.npcs.join("，")}`;
      });
      grid.appendChild(card);
    });

    openBtn.addEventListener("click", () => panel.classList.add("is-open"));
    panel.querySelector(".world-close").addEventListener("click", () => panel.classList.remove("is-open"));
    panel.addEventListener("click", (event) => {
      if (event.target === panel) panel.classList.remove("is-open");
    });
  }

  function enhanceBuddyInteraction() {
    const canvas = $("#gameCanvas");
    if (!canvas) return;
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const line = buddyLines[Math.floor(Math.random() * buddyLines.length)];
      showBubble(line, event.clientX, Math.max(rect.top + 94, event.clientY));
      sparkle(event.clientX, event.clientY);
    });
  }

  function hookDiaryProgress() {
    const level = $("#level");
    const tasks = $("#tasks");
    if (!level || !tasks) return;
    let last = `${level.textContent}-${tasks.textContent}`;
    window.setInterval(() => {
      const current = `${level.textContent}-${tasks.textContent}`;
      if (current !== last) {
        last = current;
        if (/3\/3|4\/4|5\/5|6\/6|1\/1/.test(tasks.textContent)) {
          showDiary(`${level.textContent}完成啦，小猫和猫头鹰把今天的故事写进了日记。`);
        }
      }
    }, 900);
  }

  function initLifeOverlay() {
    createWorldPanel();
    enhanceBuddyInteraction();
    hookDiaryProgress();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLifeOverlay);
  } else {
    initLifeOverlay();
  }
})();
