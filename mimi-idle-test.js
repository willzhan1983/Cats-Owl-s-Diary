// Safe Mimi idle PNG render test - V2
// Only replaces the visible cat player render.
// Falls back to original drawPlayer if anything fails.

(() => {
  const mimiIdle = new Image();
  mimiIdle.decoding = "async";
  mimiIdle.src = "./assets/asset-pack-01/characters/mimi/idle.png?v=3";

  const originalDrawPlayer = typeof drawPlayer === "function" ? drawPlayer : null;
  if (!originalDrawPlayer) return;

  drawPlayer = function drawPlayerWithMimiIdleTest() {
    try {
      // Keep the original render when Owlly is selected.
      if (typeof selectedRole !== "undefined" && selectedRole === "owl") {
        originalDrawPlayer();
        return;
      }

      // Fall back until the image/runtime is ready.
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

      // Contact shadow for stronger grounding.
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.beginPath();
      ctx.ellipse(2, 22, 20, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Slight squash gives the sprite more weight.
      ctx.save();
      ctx.scale(1.02, 0.98);

      const width = 84;
      const height = 84;
      const yFix = -68;

      ctx.drawImage(mimiIdle, -width / 2, yFix, width, height);
      ctx.restore();

      ctx.restore();
    } catch (error) {
      originalDrawPlayer();
    }
  };
})();
