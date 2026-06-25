(function () {
  window.ENABLE_ART_PACK_01 = window.ENABLE_ART_PACK_01 !== false;

  const registry = {
    npc: {
      lily: "./assets/asset-pack-01/npc/lily.png",
      coco: "./assets/asset-pack-01/npc/coco.png",
      nono: "./assets/asset-pack-01/npc/nono.png",
      dodo: "./assets/asset-pack-01/npc/dodo.png",
      ruru: "./assets/asset-pack-01/npc/ruru.png",
    },
    boss: {
      blackBear: "./assets/asset-pack-01/boss/black-bear/idle.png",
    },
    props: {
      apple: "./assets/asset-pack-01/props/apple.png",
      book: "./assets/asset-pack-01/props/guard-book.png",
      guardBook: "./assets/asset-pack-01/props/guard-book.png",
      courageStar: "./assets/asset-pack-01/props/courage-star.png",
      potion: "./assets/asset-pack-01/props/potion.png",
    },
    obstacles: {
      pond: "./assets/asset-pack-01/obstacles/pond.png",
      bush: "./assets/asset-pack-01/obstacles/bush.png",
      pit: "./assets/asset-pack-01/obstacles/pit.png",
      stump: "./assets/asset-pack-01/obstacles/stump.png",
      rock: "./assets/asset-pack-01/obstacles/rock.png",
    },
  };

  const images = {};

  function preload(category, key, src) {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    images[`${category}:${key}`] = image;
  }

  Object.entries(registry).forEach(([category, entries]) => {
    Object.entries(entries).forEach(([key, src]) => preload(category, key, src));
  });

  window.CATS_OWLS_ART_PACK_01 = {
    get(category, key) {
      if (!window.ENABLE_ART_PACK_01) return null;
      return images[`${category}:${key}`] || null;
    },
    registry,
  };

  document.documentElement.dataset.artPack01 = "ready";
})();
