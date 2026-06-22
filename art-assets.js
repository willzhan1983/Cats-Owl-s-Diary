// V3.3 safe art asset overlay for collectibles and obstacles
// It tries SVG assets first and falls back to the original canvas drawings.
(() => {
  const assetSources = {
    apple: "./assets/props/apple.svg",
    courageStar: "./assets/props/courage-star.svg",
    magicPencil: "./assets/props/magic-pencil.svg",
    guardBook: "./assets/props/guard-book.svg",
    potion: "./assets/props/potion.svg",
    pond: "./assets/props/pond.svg",
    bush: "./assets/props/bush.svg",
    pit: "./assets/props/pit.svg",
  };

  const images = {};
  Object.entries(assetSources).forEach(([key, src]) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    images[key] = image;
  });

  function ready(key) {
    const image = images[key];
    return image && image.complete && image.naturalWidth > 0;
  }

  function drawAsset(key, x, y, width, height) {
    if (!ready(key)) return false;
    ctx.drawImage(images[key], x - width / 2, y - height / 2, width, height);
    return true;
  }

  const originalDrawItem = window.drawItem;
  window.drawItem = function drawItemWithAssets(type) {
    const sizeMap = {
      apple: [74, 74],
      courageStar: [78, 78],
      magicPencil: [82, 82],
      guardBook: [78, 78],
      potion: [64, 78],
    };
    const size = sizeMap[type];
    if (size && drawAsset(type, 0, 0, size[0], size[1])) return;
    originalDrawItem(type);
  };

  const originalDrawPond = window.drawPond;
  window.drawPond = function drawPondWithAsset(x, y, r) {
    if (drawAsset("pond", x, y, r * 3.3, r * 2.2)) return;
    originalDrawPond(x, y, r);
  };

  const originalDrawBush = window.drawBush;
  window.drawBush = function drawBushWithAsset(x, y, r) {
    if (drawAsset("bush", x, y, r * 3.1, r * 2.2)) return;
    originalDrawBush(x, y, r);
  };

  const originalDrawPit = window.drawPit;
  window.drawPit = function drawPitWithAsset(x, y, r) {
    if (drawAsset("pit", x, y, r * 3.2, r * 2.2)) return;
    originalDrawPit(x, y, r);
  };
})();
