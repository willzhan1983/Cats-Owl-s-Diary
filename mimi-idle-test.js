// Safe Mimi idle PNG render test.
// This only overrides the visible cat player drawing and falls back to the original drawPlayer if anything fails.
(() => {
  const mimiIdle = new Image();
  mimiIdle.decoding = "async";
  mimiIdle.src = "./assets/asset-pack-01/characters/mimi/idle.png";

  const originalDrawPlayer = typeof drawPlayer === "function" ? drawPlayer : null;
  if (!originalDrawPlayer) return;

  drawPlayer = function drawPlayerWithMimiIdleTest() {
    try {
      if (typeof selectedRole !== "undefined" && selectedRole === "owl") {
        originalDrawPlayer();
        return;
      }

      if (!mimiIdle.complete || !mimiIdle.naturalWidth || !state || !state.player || !ctx) {
        originalDrawPlayer();
        return;
      }

      const p = state.player;
      const speed = Math.hypot(p.vx || 0, p.vy || 0);
      const bounce = speed > 12 ? Math.sin(p.step || 0) * 3 : Math.sin(performance.now() / 600) * 1.1;

      ctx.save();
      ctx.translate(p.x, p.y + bounce);
      if (p.dir < 0) ctx.scale(-1, 1);

      if (typeof drawShadow === "function") drawShadow(2, 28, 58, 12);

      const width = 82;
      const height = 82;
      ctx.drawImage(mimiIdle, -width / 2, -62, width, height);

      ctx.restore();
    } catch (error) {
      originalDrawPlayer();
    }
  };
})();
