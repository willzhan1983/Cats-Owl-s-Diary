// V3.4 strong integration loader
// Loads the original game.js source, patches the real drawPlayer() function, then evaluates it.
(() => {
  const request = new XMLHttpRequest();
  request.open("GET", `./game.js?v=hero-${Date.now()}`, false);
  request.send(null);

  if (request.status < 200 || request.status >= 300) {
    throw new Error(`Unable to load game.js: ${request.status}`);
  }

  const source = request.responseText;
  const heroDrawPlayer = `function drawPlayer() {
  const p = state.player;
  const speed = Math.hypot(p.vx, p.vy);
  const walk = Math.sin(p.step);
  const bounce = speed > 12 ? walk * 3 : Math.sin(performance.now() / 600) * 1.1;
  ctx.save();
  ctx.translate(p.x, p.y + bounce);
  if (p.dir < 0) ctx.scale(-1, 1);
  const spriteKey = getHeroSpriteKey(speed);
  const heroImage = window.getGameAsset ? window.getGameAsset(spriteKey) : null;
  if (heroImage) {
    drawShadow(2, 28, selectedRole === "owl" ? 48 : 58, 12);
    drawHeroImage(heroImage, spriteKey, walk, speed);
    if (selectedRole !== "owl") drawOwllyCompanion(walk);
  } else if (selectedRole === "owl") {
    drawOwl(0, 2, 1.08, walk, speed);
  } else {
    drawCat(0, 0, walk, speed);
  }
  ctx.restore();
}

function getHeroSpriteKey(speed) {
  if (selectedRole === "owl") {
    if (state.levelClear) return "owllyWrite";
    return speed > 12 ? "owllyFly" : "owllyIdle";
  }
  if (state.levelClear) return "mimiHappy";
  return speed > 12 ? "mimiWalk" : "mimiIdle";
}

function drawHeroImage(image, spriteKey, walk, speed) {
  const isOwl = spriteKey.startsWith("owlly");
  const width = isOwl ? 74 : 76;
  const height = isOwl ? 82 : 88;
  const y = isOwl ? -62 + Math.sin(performance.now() / 420) * 2 : -64;
  ctx.save();
  if (speed > 12 && !isOwl) ctx.rotate(Math.sin(walk) * 0.035);
  ctx.drawImage(image, -width / 2, y, width, height);
  ctx.restore();
}

function drawOwllyCompanion(walk) {
  const image = window.getGameAsset
    ? window.getGameAsset("owllyFly") || window.getGameAsset("owllyIdle")
    : null;
  if (!image) return;
  const bob = Math.sin(performance.now() / 420) * 5;
  ctx.save();
  ctx.translate(58, -40 + bob);
  drawShadow(0, 52, 24, 6);
  ctx.rotate(Math.sin(walk) * 0.04);
  ctx.drawImage(image, -30, -28, 60, 66);
  ctx.restore();
}

function drawCat`;

  const patched = source.replace(/function drawPlayer\(\) \{[\s\S]*?\n\}\n\nfunction drawCat/, heroDrawPlayer);

  if (patched === source) {
    console.warn("V3.4 hero patch did not match drawPlayer(); falling back to original game.js.");
  }

  window.eval(`${patched}\n//# sourceURL=cats-owls-game-v34.js`);
})();
