// V3.1 Cats & Owl's Diary mobile touch, NPC cards and diary overlay
(() => {
  const WORLD_SCENES = [
    {
      key: "school",
      icon: "🏫",
      name: "森林学校",
      desc: "小猫和猫头鹰开始写日记的地方。",
      line: "今天从森林学校出发，看看谁需要帮忙吧。",
      diary: "我们在森林学校整理了今天的计划，小猫负责发现故事，猫头鹰负责写进日记。",
      npcs: [
        { icon: "🐰", name: "Lily", role: "兔兔同学", line: "谢谢你陪我聊天！我们一起加油吧！" },
        { icon: "🐿️", name: "Coco", role: "松鼠同学", line: "我把橡果藏在教室旁边了。" },
      ],
    },
    {
      key: "orchard",
      icon: "🍎",
      name: "苹果谷",
      desc: "收集苹果、勇气星和魔法铅笔。",
      line: "苹果谷有很多跳跳小路，慢慢来更安全。",
      diary: "今天我们在苹果谷帮助朋友收集苹果，风里都是甜甜的味道。",
      npcs: [
        { icon: "🦔", name: "Nono", role: "刺猬同学", line: "苹果太高了，我够不到。" },
        { icon: "🐦", name: "Bibi", role: "小鸟同学", line: "我找到一片漂亮羽毛！" },
      ],
    },
    {
      key: "lake",
      icon: "🌊",
      name: "月光湖",
      desc: "湖泊、荷叶、漂流瓶和萤火虫。",
      line: "月光湖边可能漂来新的日记页。",
      diary: "湖面亮晶晶的，我们捡到一张湿湿的日记页，猫头鹰把它小心夹进本子里。",
      npcs: [
        { icon: "🦆", name: "Dodo", role: "小鸭朋友", line: "湖面上漂来了一页日记。" },
        { icon: "🐸", name: "Frogy", role: "青蛙朋友", line: "呱！荷叶下面有秘密。" },
      ],
    },
    {
      key: "wetland",
      icon: "🦆",
      name: "湿地公园",
      desc: "芦苇、木栈道和稀有鸟类。",
      line: "湿地公园要轻轻走，不要打扰休息的小鸟。",
      diary: "我们沿着湿地木栈道前进，看见白鹭从芦苇间飞过。",
      npcs: [
        { icon: "🦢", name: "Swan", role: "天鹅姐姐", line: "请安静一点，白鹭正在休息。" },
        { icon: "🦩", name: "Flora", role: "火烈鸟朋友", line: "我丢了一根粉色羽毛。" },
      ],
    },
    {
      key: "swamp",
      icon: "🐸",
      name: "迷雾沼泽",
      desc: "发光蘑菇、浮桥和隐藏故事。",
      line: "迷雾沼泽有点神秘，猫头鹰会提醒小猫慢慢走。",
      diary: "沼泽里的雾像棉花一样飘着，我们听见了老乌龟讲很久以前的故事。",
      npcs: [
        { icon: "🐢", name: "Toto", role: "老乌龟", line: "慢慢走，沼泽里藏着古老故事。" },
        { icon: "🍄", name: "Mumu", role: "发光蘑菇", line: "夜晚我会发光哦。" },
      ],
    },
    {
      key: "road",
      icon: "🚗",
      name: "森林公路",
      desc: "未来跑酷玩法入口。",
      line: "森林公路以后可以做晨跑和躲避障碍小游戏。",
      diary: "今天我们看见一条通向远方的公路，也许下一次可以来一场森林晨跑。",
      npcs: [
        { icon: "🐕", name: "Buddy", role: "跑步伙伴", line: "这里以后可以参加森林晨跑！" },
        { icon: "🚧", name: "Sign", role: "路牌", line: "小心树枝和滚木。" },
      ],
    },
    {
      key: "town",
      icon: "🏙️",
      name: "橡果镇",
      desc: "动物城市、咖啡馆、邮局和小商店。",
      line: "橡果镇可以扩展服装、家具和装饰系统。",
      diary: "我们第一次来到橡果镇，街角的咖啡馆闻起来暖暖的。",
      npcs: [
        { icon: "🐻", name: "Bear", role: "咖啡馆老板", line: "欢迎来到橡果镇咖啡馆。" },
        { icon: "🦝", name: "Ruru", role: "森林商人", line: "我的小店可以买装饰哦。" },
      ],
    },
    {
      key: "pier",
      icon: "🌉",
      name: "河畔码头",
      desc: "小船、桥梁、风车和漂流瓶。",
      line: "河畔码头以后可以坐船去新区域。",
      diary: "小船轻轻碰着码头，猫头鹰说河流也会把故事带到远方。",
      npcs: [
        { icon: "🐟", name: "Fifi", role: "小鱼朋友", line: "河里有闪闪发光的东西。" },
        { icon: "🛶", name: "Boat", role: "小木船", line: "以后可以坐船去新地方。" },
      ],
    },
    {
      key: "mountain",
      icon: "⛰️",
      name: "星光山",
      desc: "观星台、流星雨和最终日记。",
      line: "星光山适合放在后期，作为完成大日记后的奖励地图。",
      diary: "星光山上可以看到最亮的星星，我们约好完成更多日记后再回来。",
      npcs: [
        { icon: "🦉", name: "Ollie", role: "猫头鹰好友", line: "这里可以看到最亮的星星。" },
        { icon: "⭐", name: "Star", role: "星星", line: "完成日记后再回来吧。" },
      ],
    },
  ];

  const buddyLines = [
    "小猫：猫头鹰，我们今天写什么日记呀？",
    "猫头鹰：每一天都值得被记录。",
    "小猫：森林里好像有新发现！",
    "猫头鹰：我已经准备好日记本了。",
    "小猫：我们一起去帮助朋友吧！",
  ];

  const prefersTouch = matchMedia("(hover: none), (pointer: coarse)").matches;

  function $(selector) {
    return document.querySelector(selector);
  }

  function bindTap(element, handler) {
    if (!element) return;
    let lastTouch = 0;
    element.addEventListener(
      "pointerup",
      (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        lastTouch = performance.now();
        event.preventDefault();
        event.stopPropagation();
        handler(event);
      },
      { passive: false }
    );
    element.addEventListener("click", (event) => {
      if (performance.now() - lastTouch < 650) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      handler(event);
    });
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
    bubble.style.top = `${Math.max(96, Math.min(window.innerHeight - 16, y))}px`;
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
    toast.textContent = `📔 ${text}`;
    toast.classList.add("is-showing");
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => toast.classList.remove("is-showing"), 4200);
  }

  function showNpcModal(npc, scene) {
    let modal = $(".npc-modal");
    if (!modal) {
      modal = document.createElement("section");
      modal.className = "npc-modal";
      modal.setAttribute("aria-label", "NPC 对话");
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="npc-modal-card">
        <div class="npc-modal-heart">❤️ 好感度 +1</div>
        <div class="npc-modal-avatar" aria-hidden="true">${npc.icon}</div>
        <h3>${npc.name}</h3>
        <p class="npc-modal-role">${npc.role} · ${scene.name}</p>
        <p class="npc-modal-line">${npc.line}</p>
        <button class="npc-modal-close" type="button">知道了</button>
      </div>
    `;
    modal.classList.add("is-open");
    sparkle(window.innerWidth / 2, window.innerHeight / 2);
    bindTap(modal.querySelector(".npc-modal-close"), () => modal.classList.remove("is-open"));
    bindTap(modal, (event) => {
      if (event.target === modal) modal.classList.remove("is-open");
    });
  }

  function createNpcStrip(scene, target) {
    const strip = document.createElement("div");
    strip.className = "npc-strip";
    scene.npcs.forEach((npc) => {
      const card = document.createElement("button");
      card.className = "npc-chip";
      card.type = "button";
      card.innerHTML = `
        <span class="npc-chip-avatar">${npc.icon}</span>
        <span><strong>${npc.name}</strong><small>${npc.role}</small></span>
      `;
      bindTap(card, (event) => {
        const rect = card.getBoundingClientRect();
        showBubble(npc.line, rect.left + rect.width / 2, rect.top + 8);
        showNpcModal(npc, scene);
        const message = $("#message");
        if (message) message.textContent = `${scene.icon} ${scene.name}：${npc.name} 说：${npc.line}`;
        event.stopPropagation();
      });
      strip.appendChild(card);
    });
    target.appendChild(strip);
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
      <p class="world-note">点击场景可以看故事，点击动物头像可以对话。下一版会把这些位置接入真实关卡。</p>
    `;
    document.body.appendChild(panel);

    const grid = panel.querySelector(".world-grid");
    WORLD_SCENES.forEach((scene) => {
      const card = document.createElement("button");
      card.className = "world-card";
      card.type = "button";
      card.innerHTML = `
        <div class="world-card-art" aria-hidden="true"><span>${scene.icon}</span></div>
        <div class="world-card-name">${scene.name}</div>
        <div class="world-card-desc">${scene.desc}</div>
      `;
      createNpcStrip(scene, card);
      bindTap(card, () => {
        const rect = card.getBoundingClientRect();
        showBubble(scene.line, rect.left + rect.width / 2, rect.top + 16);
        sparkle(rect.left + rect.width / 2, rect.top + 70);
        showDiary(scene.diary);
        const message = $("#message");
        if (message) message.textContent = `${scene.icon} ${scene.name}：${scene.npcs.map((npc) => `${npc.icon}${npc.name}`).join("，")}`;
      });
      grid.appendChild(card);
    });

    bindTap(openBtn, () => panel.classList.add("is-open"));
    bindTap(panel.querySelector(".world-close"), () => panel.classList.remove("is-open"));
    bindTap(panel, (event) => {
      if (event.target === panel) panel.classList.remove("is-open");
    });
  }

  function enhanceBuddyInteraction() {
    const canvas = $("#gameCanvas");
    if (!canvas) return;
    canvas.addEventListener(
      "pointerup",
      (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if ($("#worldPanel.is-open") || $(".npc-modal.is-open")) return;
        const rect = canvas.getBoundingClientRect();
        const line = buddyLines[Math.floor(Math.random() * buddyLines.length)];
        showBubble(line, event.clientX, Math.max(rect.top + 94, event.clientY));
        sparkle(event.clientX, event.clientY);
      },
      { passive: true }
    );
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
    document.documentElement.classList.toggle("is-touch-device", prefersTouch);
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
