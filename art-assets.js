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
    moonPillar: "assets/props/moon_pillar.png",
    bubbleSlide: "assets/props/bubble_slide.png",
    pearlSwitch: "assets/props/pearl_switch.png",
    moonLamp: "assets/items/moon_lamp.png",
    boatPaddle: "assets/items/boat_paddle.png",
    moonKey: "assets/items/moon_key.png",
    shellBadge: "assets/items/shell_badge.png",
    bubbleDivingHelmet: "assets/items/bubble_diving_helmet.png",
    bubbleStone: "assets/items/bubble_stone.png",
    pearlOrb: "assets/items/pearl_orb.png",
    coralKey: "assets/items/coral_key.png",
    spiralShell: "assets/items/spiral_shell.png",
    seaweedScissors: "assets/items/seaweed_scissors.png",
    jellyfishCore: "assets/items/jellyfish_core.png",
    aquaGem: "assets/items/aqua_gem.png",
    deepRune: "assets/items/deep_rune.png",
    moonPearl: "assets/items/moon_pearl.png",
    redApple: "assets/items/red_apple.png",
    greenApple: "assets/items/green_apple.png",
    goldenApple: "assets/items/golden_apple.png",
    appleBasket: "assets/items/apple_basket.png",
    giftAppleBasket: "assets/items/gift_apple_basket.png",
    harvestBadge: "assets/items/harvest_badge.png",
    appleCart: "assets/items/apple_cart.png",
    autumnLeaf: "assets/items/autumn_leaf.png",
  };

  const registry = {
    npc: {
      lily: "./assets/asset-pack-01/npc/lily.png",
      coco: "./assets/npc/coco_squirrel.png",
      nono: "./assets/npc/nono_hedgehog.png",
      dodo: "./assets/asset-pack-01/npc/dodo.png",
      ruru: "./assets/asset-pack-01/npc/ruru.png",
      deer: "./assets/asset-pack-01/npc/deer.png",
      ant: "./assets/asset-pack-01/npc/ant.png",
      butterfly: "./assets/asset-pack-01/npc/butterfly.png",
      fox: "./assets/asset-pack-01/npc/fox.png",
      firefly: "./assets/asset-pack-01/npc/firefly.png",
      owlPrincipal: "./assets/npc/owl_principal.png",
      birdPostman: "./assets/npc/bird_postman.png",
      moleFarmer: "./assets/npc/mole_farmer.png",
      otterPostman: "./assets/npc/otter_postman.png",
      frogTeacher: "./assets/npc/frog_teacher.png",
      seagullScout: "./assets/npc/seagull_scout.png",
      beaverEngineer: "./assets/npc/beaver_engineer.png",
      clownfishTwins: "./assets/npc/clownfish_twins.png",
      jellyfishLady: "./assets/npc/jellyfish_lady.png",
      nessieBoss: "./assets/npc/nessie_boss.png",
      seaTurtle: "./assets/npc/sea_turtle.png",
      octopusDoctor: "./assets/npc/octopus_doctor.png",
      seahorseGuard: "./assets/npc/seahorse_guard.png",
      lanternFish: "./assets/npc/lantern_fish.png",
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
      moonPillar: window.ART_ASSETS.props.moonPillar,
      bubbleSlide: window.ART_ASSETS.props.bubbleSlide,
      pearlSwitch: window.ART_ASSETS.props.pearlSwitch,
      moonLamp: window.ART_ASSETS.props.moonLamp,
      boatPaddle: window.ART_ASSETS.props.boatPaddle,
      moonKey: window.ART_ASSETS.props.moonKey,
      shellBadge: window.ART_ASSETS.props.shellBadge,
      bubbleDivingHelmet: window.ART_ASSETS.props.bubbleDivingHelmet,
      bubbleStone: window.ART_ASSETS.props.bubbleStone,
      pearlOrb: window.ART_ASSETS.props.pearlOrb,
      coralKey: window.ART_ASSETS.props.coralKey,
      spiralShell: window.ART_ASSETS.props.spiralShell,
      seaweedScissors: window.ART_ASSETS.props.seaweedScissors,
      jellyfishCore: window.ART_ASSETS.props.jellyfishCore,
      aquaGem: window.ART_ASSETS.props.aquaGem,
      deepRune: window.ART_ASSETS.props.deepRune,
      moonPearl: window.ART_ASSETS.props.moonPearl,
      redApple: window.ART_ASSETS.props.redApple,
      greenApple: window.ART_ASSETS.props.greenApple,
      goldenApple: window.ART_ASSETS.props.goldenApple,
      appleBasket: window.ART_ASSETS.props.appleBasket,
      giftAppleBasket: window.ART_ASSETS.props.giftAppleBasket,
      harvestBadge: window.ART_ASSETS.props.harvestBadge,
      appleCart: window.ART_ASSETS.props.appleCart,
      autumnLeaf: window.ART_ASSETS.props.autumnLeaf,
    },
    obstacles: {
      pond: "./assets/asset-pack-01/obstacles/pond.png",
      bush: "./assets/asset-pack-01/obstacles/bush.png",
      pit: "./assets/asset-pack-01/obstacles/pit.png",
      stump: "./assets/asset-pack-01/obstacles/stump.png",
      rock: "./assets/asset-pack-01/obstacles/rock.png",
      moonPillar: "./assets/props/moon_pillar.png",
      pearlSwitch: "./assets/props/pearl_switch.png",
      whirlpool: "./assets/effects/whirlpool.png",
      appleTree: "./assets/props/apple_tree.png",
    },
    effects: {
      darkBubble: "./assets/effects/dark_bubble.png",
      moonlightCurrent: "./assets/effects/moonlight_current.png",
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
