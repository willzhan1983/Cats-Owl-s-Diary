// Mimi render - FORCE PNG ONLY (minimal safe version)
(() => {
  const img = new Image();
  img.src = "./assets/asset-pack-01/characters/mimi/idle.png?v=999";

  const original = window.drawPlayer;
  if (!original) return;

  window.drawPlayer = function () {
    try {
      if (typeof selectedRole !== "undefined" && selectedRole === "owl") {
        return original();
      }

      if (!img.complete || !img.naturalWidth || !state || !state.player || !ctx) {
        return original();
      }

      const p = state.player;

      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.dir < 0) ctx.scale(-1, 1);

      // NO shadow, NO animation, PURE TEST
      ctx.drawImage(img, -44, -88, 88, 88);

      ctx.restore();
    } catch (e) {
      return original();
    }
  };
})();