# Background fallback coverage

`background-fixes.js` appends an inline SVG fallback for every runtime background key. Original PNG/JPG paths remain first in the candidate list. If a remote/static asset fails to load, the game falls back to a generated SVG instead of the generic canvas background.

Covered keys:

- schoolyard
- forestSchool
- forest
- adventure
- classroom
- courage
- cityRoad
- riverTown
- pondSide
- wetland
- boss
- swampBoss
- darkSwamp
- moonlightShore
- moonlitIsle
- underwaterGarden
- deepSeaRuins
- nessieLair

Manual check:

1. Hard refresh the game.
2. Start several Forest School levels.
3. Enter Moonlight Lake from the world map.
4. Confirm the map never drops to the generic canvas fallback background when an image asset fails.
