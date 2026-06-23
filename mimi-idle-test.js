// Safe Mimi idle SVG render test - V4
// Only replaces the visible cat player render.
// Falls back to original drawPlayer if anything fails.

(() => {
  const mimiIdle = new Image();
  mimiIdle.decoding = "async";
  mimiIdle.src = "./assets/asset-pack-01/characters/mimi/idle.png?v=7";

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
      const walk = Math.sin(p.step || 0);
      const breathe = Math.sin(performance.now() / 600) * 1.2;
      const bounce = speed > 12 ? walk * 2.5 : breathe;

      ctx.save();
      ctx.translate(p.x, p.y + bounce);

      if (p.dir < 0) ctx.scale(-1, 1);

      // Grounding contact shadow.
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(2, 24, 22, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Small squash for weight and a less flat sticker feel.
      ctx.save();
      ctx.scale(1.03, 0.98);

      const width = 90;
      const height = 90;
      const yFix = -72;

      ctx.drawImage(mimiIdle, -width / 2, yFix, width, height);
      ctx.restore();

      ctx.restore();
    } catch (error) {
      originalDrawPlayer();
    }
  };
})();
