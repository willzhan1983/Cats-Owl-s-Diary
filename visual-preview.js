// Safe visual preview layer for V3.4 art assets.
// This does not modify game logic. It simply places the new character art visibly into the game UI.
(() => {
  function ensureStyles() {
    if (document.getElementById("visual-preview-style")) return;
    const style = document.createElement("style");
    style.id = "visual-preview-style";
    style.textContent = `
      .canvas-wrap { position: relative; }
      .visual-preview-layer {
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 18px;
        z-index: 8;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        pointer-events: none;
      }
      .preview-heroes {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 22px;
        background: rgba(255, 247, 223, 0.82);
        border: 3px solid rgba(255, 255, 255, 0.85);
        box-shadow: 0 12px 28px rgba(45, 80, 50, 0.2);
        backdrop-filter: blur(6px);
      }
      .preview-heroes img {
        display: block;
        height: 104px;
        width: auto;
        filter: drop-shadow(0 8px 8px rgba(35, 55, 40, .22));
        animation: previewFloat 2.2s ease-in-out infinite;
      }
      .preview-heroes img:nth-child(2) {
        height: 88px;
        animation-delay: .28s;
      }
      .preview-npcs {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 10px;
        border-radius: 18px;
        background: rgba(255, 247, 223, 0.76);
        border: 2px solid rgba(255, 255, 255, 0.85);
        box-shadow: 0 10px 22px rgba(45, 80, 50, 0.16);
      }
      .preview-npcs img {
        display: block;
        width: 46px;
        height: 46px;
        object-fit: contain;
        border-radius: 999px;
        background: rgba(255,255,255,.6);
        filter: drop-shadow(0 5px 5px rgba(35, 55, 40, .18));
      }
      .preview-note {
        position: absolute;
        left: 38px;
        bottom: 142px;
        z-index: 9;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255, 247, 223, .92);
        color: #34563e;
        font: 900 13px Microsoft YaHei, Arial, sans-serif;
        box-shadow: 0 8px 18px rgba(45,80,50,.15);
        pointer-events: none;
      }
      @keyframes previewFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      @media (max-width: 720px) {
        .visual-preview-layer { left: 10px; right: 10px; bottom: 10px; }
        .preview-heroes img { height: 82px; }
        .preview-heroes img:nth-child(2) { height: 70px; }
        .preview-npcs { display: none; }
        .preview-note { left: 20px; bottom: 110px; font-size: 12px; }
      }
    `;
    document.head.appendChild(style);
  }

  function addPreviewLayer() {
    const wrap = document.querySelector(".canvas-wrap");
    if (!wrap || document.querySelector(".visual-preview-layer")) return;

    ensureStyles();

    const note = document.createElement("div");
    note.className = "preview-note";
    note.textContent = "V3.4 美术预览：Mimi 与 Owlly 已进入界面";

    const layer = document.createElement("div");
    layer.className = "visual-preview-layer";
    layer.innerHTML = `
      <div class="preview-heroes" aria-hidden="true">
        <img src="./assets/characters/mimi/happy.svg" alt="" />
        <img src="./assets/characters/owlly/fly.svg" alt="" />
      </div>
      <div class="preview-npcs" aria-hidden="true">
        <img src="./assets/npc/lily.svg" alt="" />
        <img src="./assets/npc/coco.svg" alt="" />
        <img src="./assets/npc/nono.svg" alt="" />
        <img src="./assets/npc/dodo.svg" alt="" />
        <img src="./assets/npc/ruru.svg" alt="" />
        <img src="./assets/boss/black-bear/idle.svg" alt="" />
      </div>
    `;

    wrap.appendChild(note);
    wrap.appendChild(layer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addPreviewLayer);
  } else {
    addPreviewLayer();
  }
})();
