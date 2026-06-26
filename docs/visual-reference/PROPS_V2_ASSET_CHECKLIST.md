# Props V2 Asset Checklist

These sheets are visual references only for now:

- `forest-trail-elements.png`
- `fantasy-tools-and-ornaments.png`

The current files look like transparent sheets, but the checkerboard is baked into the image pixels and the alpha channel is fully opaque. Because of that, the assets were not split automatically. Use real individual transparent PNG files before connecting them to game runtime rendering.

## Required Individual Files

| File | Registry key | Current gameplay use |
| --- | --- | --- |
| `assets/props-v2/leaf_broom.png` | `leafBroom` | Existing item type: `leaf` |
| `assets/props-v2/flower_seeds.png` | `flowerSeeds` | Existing item type: `seed` |
| `assets/props-v2/pencil.png` | `pencil` | Existing item type: `pencil` |
| `assets/props-v2/bell.png` | `bell` | Existing item type: `bell` |
| `assets/props-v2/leaf_lamp.png` | `leafLamp` | Decoration only for now |
| `assets/props-v2/hanging_lantern.png` | `hangingLantern` | Possible item type: `lantern` |
| `assets/props-v2/map.png` | `map` | Existing item type: `map` |
| `assets/props-v2/treasure_chest.png` | `treasureChest` | Not connected yet |
| `assets/props-v2/magic_pencil.png` | `magicPencil` | Existing item type: `magicPencil` |
| `assets/props-v2/flower_bed.png` | `flowerBed` | Decoration only for now |
| `assets/props-v2/tree_string_lights.png` | `treeStringLights` | Decoration only for now |
| `assets/props-v2/ant_leaf.png` | `antLeaf` | Decoration only for now |
| `assets/props-v2/ant_stick.png` | `antStick` | Decoration only for now |
| `assets/props-v2/ant_flower.png` | `antFlower` | Decoration only for now |
| `assets/props-v2/puddle.png` | `puddle` | Decoration only for now |
| `assets/props-v2/lamp_post.png` | `lampPost` | Decoration only for now |
| `assets/props-v2/lantern.png` | `lantern` | Possible item type: `lantern` |

## Safe Runtime Plan

1. Replace the reference sheets with true transparent individual PNG files.
2. Add the files under `assets/props-v2/`.
3. Extend `art-assets.js` with a `propsV2` registry only after the files exist.
4. Connect only existing gameplay item types first: `pencil`, `leaf`, `seed`, `bell`, `lantern`, `map`, and `magicPencil`.
5. Keep all old canvas drawings as fallback.
