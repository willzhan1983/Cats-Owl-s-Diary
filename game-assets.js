// V3.4 shared visual asset loader
// Keeps art paths in one place and exposes safe lookup helpers for runtime patches.
(() => {
  window.GAME_ASSETS = {
    mimiIdle: "./assets/characters/mimi/v6/idle.png",
    mimiWalk: "./assets/characters/mimi/v6/walk_1.png",
    mimiHappy: "./assets/characters/mimi/v6/happy.png",
    mimiPortrait: "./assets/characters/mimi/portrait.svg",
    owllyIdle: "./assets/characters/owlly/v6/idle.png",
    owllyFly: "./assets/characters/owlly/v6/fly_1.png",
    owllyWrite: "./assets/characters/owlly/write.svg",
    owllyPortrait: "./assets/characters/owlly/portrait.svg",
    lily: "./assets/npc/lily.svg",
    coco: "./assets/npc/coco.svg",
    nono: "./assets/npc/nono.svg",
    dodo: "./assets/npc/dodo.svg",
    ruru: "./assets/npc/ruru.svg",
    blackBear: "./assets/boss/black-bear/idle.svg",
    apple: "./assets/props/apple.svg",
    courageStar: "./assets/props/courage-star.svg",
    magicPencil: "./assets/props/magic-pencil.svg",
    guardBook: "./assets/props/guard-book.svg",
    potion: "./assets/props/potion.svg",
    pond: "./assets/props/pond.svg",
    bush: "./assets/props/bush.svg",
    pit: "./assets/props/pit.svg",
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
