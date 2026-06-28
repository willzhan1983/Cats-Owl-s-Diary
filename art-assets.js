(function () {
  window.ENABLE_ART_PACK_01 = window.ENABLE_ART_PACK_01 !== false;
  window.ART_ASSETS = window.ART_ASSETS || {};

  window.ART_ASSETS.props = {
    leafBroom: "assets/props/leaf_broom.png",
    flowerSeeds: "assets/props/flower_seeds.png",
    pencil: "assets/props/pencil.png",
    bell: "assets/props/bell.png",
    leafLamp: "assets/props/leaf_lamp.png",
    hangingLantern: "assets/props/hanging_lantern.png",
    map: "assets/props/map.png",
    treasureChest: "assets/props/treasure_chest.png",
    magicPencil: "assets/props/magic_pencil.png",
    flowerBulbLamp: "assets/props/flower_bulb_lamp.png",
    flowerBed: "assets/props/flower_bed.png",
    treeStringLights: "assets/props/tree_string_lights.png",
    antLeaf: "assets/props/ant_leaf.png",
    antStick: "assets/props/ant_stick.png",
    antFlower: "assets/props/ant_flower.png",
    puddle: "assets/props/puddle.png",
    lampPost: "assets/props/lamp_post.png",
    lantern: "assets/props/lantern.png",
    schoolSign: "assets/props/school_sign.png",
    bouncingMushroom: "assets/props/bouncing_mushroom.png",
    finishFlag: "assets/props/finish_flag.png",
  };

  const registry = {
    npc: {
      lily: "./assets/asset-pack-01/npc/lily.png",
      coco: "./assets/asset-pack-01/npc/coco.png",
      nono: "./assets/asset-pack-01/npc/nono.png",
      dodo: "./assets/asset-pack-01/npc/dodo.png",
      ruru: "./assets/asset-pack-01/npc/ruru.png",
      deer: "./assets/asset-pack-01/npc/deer.png",
      ant: "./assets/asset-pack-01/npc/ant.png",
      butterfly: "./assets/asset-pack-01/npc/butterfly.png",
      fox: "./assets/asset-pack-01/npc/fox.png",
      firefly: "./assets/asset-pack-01/npc/firefly.png",
      owlPrincipal: "./assets/asset-pack-01/npc/owl_principal.png",
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
      leafBroom: window.ART_ASSETS.props.leafBroom,
      flowerSeeds: window.ART_ASSETS.props.flowerSeeds,
      pencil: window.ART_ASSETS.props.pencil,
      bell: window.ART_ASSETS.props.bell,
      leafLamp: window.ART_ASSETS.props.leafLamp,
      hangingLantern: window.ART_ASSETS.props.hangingLantern,
      map: window.ART_ASSETS.props.map,
      treasureChest: window.ART_ASSETS.props.treasureChest,
      magicPencil: window.ART_ASSETS.props.magicPencil,
      flowerBulbLamp: window.ART_ASSETS.props.flowerBulbLamp,
      flowerBed: window.ART_ASSETS.props.flowerBed,
      treeStringLights: window.ART_ASSETS.props.treeStringLights,
      antLeaf: window.ART_ASSETS.props.antLeaf,
      antStick: window.ART_ASSETS.props.antStick,
      antFlower: window.ART_ASSETS.props.antFlower,
      puddle: window.ART_ASSETS.props.puddle,
      lampPost: window.ART_ASSETS.props.lampPost,
      lantern: window.ART_ASSETS.props.lantern,
      schoolSign: window.ART_ASSETS.props.schoolSign,
      bouncingMushroom: window.ART_ASSETS.props.bouncingMushroom,
      finishFlag: window.ART_ASSETS.props.finishFlag,
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
