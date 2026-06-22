// V3.4 shared visual asset loader
// Keeps art paths in one place and exposes safe lookup helpers for runtime patches.
(() => {
  window.GAME_ASSETS = {
    mimiIdle: "./assets/characters/mimi/idle.svg",
    mimiWalk: "./assets/characters/mimi/walk.svg",
    mimiHappy: "./assets/characters/mimi/happy.svg",
    mimiPortrait: "./assets/characters/mimi/portrait.svg",
    owllyIdle: "./assets/characters/owlly/idle.svg",
    owllyFly: "./assets/characters/owlly/fly.svg",
    owllyWrite: "./assets/characters/owlly/write.svg",
    owllyPortrait: "./assets/characters/owlly/portrait.svg",
  };

  window.gameImages = window.gameImages || {};

  window.loadGameAssets = function loadGameAssets() {
    Object.entries(window.GAME_ASSETS).forEach(([key, src]) => {
      if (window.gameImages[key]) return;
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      window.gameImages[key] = image;
    });
  };

  window.getGameAsset = function getGameAsset(key) {
    const image = window.gameImages && window.gameImages[key];
    if (image && image.complete && image.naturalWidth > 0) return image;
    return null;
  };

  window.loadGameAssets();
})();
