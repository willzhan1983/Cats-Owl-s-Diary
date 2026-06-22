// V3.4 strong integration loader
(() => {
  const request = new XMLHttpRequest();
  request.open("GET", `./game.js?v=v34-${Date.now()}`, false);
  request.send(null);
  if (request.status < 200 || request.status >= 300) throw new Error(`Unable to load game.js: ${request.status}`);

  const source = request.responseText;

  const helper = `function drawAssetCentered(key, x, y, width, height) {
  const image = window.getGameAsset ? window.getGameAsset(key) : null;
  if (!image) return false;
  ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
  return true;
}

function drawHeroCompanion(walk) {
  const bob = Math.sin(performance.now() / 420) * 5;
  ctx.save();
  ctx.translate(58, -40 + bob);
  drawShadow(0, 52, 24, 6);
  if (!drawAssetCentered("owllyFly", 0, 0, 60, 66)) drawOwl(0, 4, 0.92, walk, 20);
  ctx.restore();
}

`;

  const heroDrawPlayer = `${helper}function drawPlayer() {
  const p = state.player;
  const speed = Math.hypot(p.vx, p.vy);
  const walk = Math.sin(p.step);
  const bounce = speed > 12 ? walk * 3 : Math.sin(performance.now() / 600) * 1.1;
  const key = selectedRole === "owl" ? (speed > 12 ? "owllyFly" : "owllyIdle") : (state.levelClear ? "mimiHappy" : speed > 12 ? "mimiWalk" : "mimiIdle");
  ctx.save();
  ctx.translate(p.x, p.y + bounce);
  if (p.dir < 0) ctx.scale(-1, 1);
  drawShadow(2, 28, selectedRole === "owl" ? 48 : 58, 12);
  const w = selectedRole === "owl" ? 74 : 76;
  const h = selectedRole === "owl" ? 82 : 88;
  if (!drawAssetCentered(key, 0, -22, w, h)) {
    if (selectedRole === "owl") drawOwl(0, 2, 1.08, walk, speed);
    else drawCat(0, 0, walk, speed);
  }
  if (selectedRole !== "owl") drawHeroCompanion(walk);
  ctx.restore();
}

function drawCat`;

  const artDrawItem = `function drawItem(type) {
  const map = { apple: "apple", courageStar: "courageStar", magicPencil: "magicPencil", guardBook: "guardBook", potion: "potion" };
  const size = { apple: [76,76], courageStar: [80,80], magicPencil: [84,84], guardBook: [82,82], potion: [72,86] }[type];
  if (map[type] && size && drawAssetCentered(map[type], 0, 0, size[0], size[1])) return;
  ctx.fillStyle = "#ffd75e";
  star(0, 0, 24);
}

function drawTasks`;

  const artDrawAnimal = `function drawAnimal(kind) {
  const map = { rabbit: "lily", squirrel: "coco", hedgehog: "nono", fox: "ruru", ant: "dodo", boss: "blackBear", owl: "owllyIdle" };
  const size = kind === "boss" ? [126,126] : [66,78];
  if (map[kind] && drawAssetCentered(map[kind], 0, 0, size[0], size[1])) return;
  if (kind === "boss") drawForestBoss();
  else if (kind === "owl") drawOwl(0, 4, 0.92);
  else drawRabbit();
}

function drawPlayer`;

  const pond = `function drawPond(x, y, r) {
  if (drawAssetCentered("pond", x, y, r * 3.7, r * 2.35)) return;
  ctx.fillStyle = "rgba(72,183,211,.9)";
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.7, r * .9, -.08, 0, Math.PI * 2);
  ctx.fill();
}

function drawBush`;

  const bush = `function drawBush(x, y, r) {
  if (drawAssetCentered("bush", x, y, r * 3.25, r * 2.35)) return;
  ctx.fillStyle = "#6fb447";
  circle(x, y, r);
}

function drawPit`;

  const pit = `function drawPit(x, y, r) {
  if (drawAssetCentered("pit", x, y, r * 3.35, r * 2.25)) return;
  ctx.fillStyle = "#6b4328";
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.2, r * .75, .08, 0, Math.PI * 2);
  ctx.fill();
}

function drawGrassTufts`;

  let patched = source;
  patched = patched.replace(/function drawPlayer\(\) \{[\s\S]*?\n\}\n\nfunction drawCat/, heroDrawPlayer);
  patched = patched.replace(/function drawItem\(type\) \{[\s\S]*?\n\}\n\nfunction drawTasks/, artDrawItem);
  patched = patched.replace(/function drawAnimal\(kind\) \{[\s\S]*?\n\}\n\nfunction drawPlayer/, artDrawAnimal);
  patched = patched.replace(/function drawPond\(x, y, r\) \{[\s\S]*?\n\}\n\nfunction drawBush/, pond);
  patched = patched.replace(/function drawBush\(x, y, r\) \{[\s\S]*?\n\}\n\nfunction drawPit/, bush);
  patched = patched.replace(/function drawPit\(x, y, r\) \{[\s\S]*?\n\}\n\nfunction drawGrassTufts/, pit);
  window.eval(`${patched}\n//# sourceURL=cats-owls-game-v34.js`);
})();
