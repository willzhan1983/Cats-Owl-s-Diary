/* Background fallback system for all game maps.
 * Keeps the original image paths first, then appends a lightweight SVG fallback.
 * This prevents the game from dropping back to the generic canvas background
 * when a PNG/JPG asset is slow, cached badly, or temporarily unavailable.
 */
(function applyBackgroundFixes() {
  function svgDataUri(title, theme) {
    const palette = {
      school: { sky1: "#dff7ff", sky2: "#ecffd8", ground: "#9dd56d", road: "#efd56f", main: "#7abd43", accent: "#f7de77" },
      forest: { sky1: "#d8f7df", sky2: "#bdeca8", ground: "#73bc49", road: "#d8c06a", main: "#4f9a35", accent: "#f6a04d" },
      road: { sky1: "#dff0ff", sky2: "#c7e4ff", ground: "#9bc47a", road: "#9ca3ad", main: "#4f8b38", accent: "#ffd25f" },
      classroom: { sky1: "#fff3cf", sky2: "#f6dfab", ground: "#e7c786", road: "#f7e0a0", main: "#7ab84e", accent: "#5f8dd3" },
      pond: { sky1: "#d9f9ff", sky2: "#bde8d0", ground: "#8dcd75", road: "#b8e6f6", main: "#43a8c6", accent: "#ffd96a" },
      wetland: { sky1: "#d7f7ef", sky2: "#b8dfb5", ground: "#76b66a", road: "#9bd5c8", main: "#3b8c72", accent: "#f0d36a" },
      swamp: { sky1: "#d6e6f7", sky2: "#9fb3c8", ground: "#5f8061", road: "#6a5f7c", main: "#405b47", accent: "#d6e67c" },
      moon: { sky1: "#cfe8ff", sky2: "#dcd6ff", ground: "#8cc8bc", road: "#dfe6ff", main: "#3f7cad", accent: "#fff0a8" },
      underwater: { sky1: "#bcefff", sky2: "#69c7df", ground: "#3fa4bd", road: "#8ae7e6", main: "#197a9a", accent: "#ffd0e6" },
      ruins: { sky1: "#bdd4ff", sky2: "#446a9c", ground: "#315477", road: "#526a87", main: "#233f61", accent: "#9ee8ff" },
      lair: { sky1: "#b5cdf7", sky2: "#243a64", ground: "#172b4d", road: "#3f557b", main: "#1d3157", accent: "#d9ecff" },
    }[theme] || { sky1: "#e5f7ff", sky2: "#d6f0cc", ground: "#8fcb67", road: "#ecd577", main: "#5da34a", accent: "#ffd76f" };

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540" role="img" aria-label="${title}">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${palette.sky1}"/>
            <stop offset="1" stop-color="${palette.sky2}"/>
          </linearGradient>
          <linearGradient id="road" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="${palette.road}" stop-opacity=".78"/>
            <stop offset="1" stop-color="#fff1a8" stop-opacity=".72"/>
          </linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
        </defs>
        <rect width="960" height="540" fill="url(#sky)"/>
        <ellipse cx="480" cy="548" rx="610" ry="126" fill="${palette.ground}" opacity=".55"/>
        <path d="M70 450 C190 360 250 276 380 264 C505 252 548 312 675 292 C762 278 824 224 900 166" fill="none" stroke="url(#road)" stroke-width="48" stroke-linecap="round"/>
        <g opacity=".22" fill="#fff">
          <circle cx="154" cy="86" r="34"/><circle cx="206" cy="74" r="24"/><circle cx="748" cy="88" r="30"/><circle cx="802" cy="76" r="20"/>
        </g>
        <g transform="translate(480 98)">
          <rect x="-120" y="88" width="240" height="130" rx="20" fill="${palette.accent}" opacity=".9"/>
          <path d="M-150 94 L0 8 L150 94 Z" fill="${palette.main}"/>
          <text x="0" y="72" text-anchor="middle" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="28" font-weight="800" fill="#295b3b">${title}</text>
          <rect x="-34" y="145" width="56" height="73" rx="14" fill="${palette.main}" opacity=".9"/>
          <rect x="70" y="118" width="48" height="46" rx="10" fill="#fff7dd" opacity=".9"/>
        </g>
        <g transform="translate(128 230)">
          <rect x="-18" y="68" width="36" height="112" rx="12" fill="#8c5b28"/>
          <circle cx="-42" cy="36" r="62" fill="${palette.main}" opacity=".9"/>
          <circle cx="25" cy="25" r="75" fill="${palette.main}" opacity=".82"/>
          <circle cx="78" cy="62" r="58" fill="${palette.main}" opacity=".78"/>
        </g>
        <g transform="translate(816 236)">
          <rect x="-18" y="70" width="36" height="108" rx="12" fill="#8c5b28"/>
          <circle cx="-42" cy="38" r="62" fill="${palette.main}" opacity=".86"/>
          <circle cx="24" cy="25" r="74" fill="${palette.main}" opacity=".8"/>
          <circle cx="76" cy="68" r="58" fill="${palette.main}" opacity=".76"/>
        </g>
        <g opacity=".55">
          <circle cx="158" cy="366" r="5" fill="#ffcf65"/><circle cx="274" cy="310" r="5" fill="#ef8e8e"/><circle cx="642" cy="214" r="5" fill="#ffcf65"/><circle cx="790" cy="356" r="5" fill="#ef8e8e"/>
          <ellipse cx="480" cy="364" rx="86" ry="18" fill="#2b4d34" opacity=".18" filter="url(#soft)"/>
        </g>
      </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const fallbackByKey = {
    schoolyard: svgDataUri("森林学校", "school"),
    forestSchool: svgDataUri("森林学校", "school"),
    forest: svgDataUri("课间森林", "forest"),
    adventure: svgDataUri("冒险小路", "road"),
    classroom: svgDataUri("森林课堂", "classroom"),
    courage: svgDataUri("池塘勇气路", "pond"),
    cityRoad: svgDataUri("城市道路", "road"),
    riverTown: svgDataUri("河畔小镇", "road"),
    pondSide: svgDataUri("池塘小路", "pond"),
    wetland: svgDataUri("湿地跳跳路", "wetland"),
    boss: svgDataUri("星光山", "swamp"),
    swampBoss: svgDataUri("迷雾沼泽", "swamp"),
    darkSwamp: svgDataUri("黑熊沼泽", "swamp"),
    moonlightShore: svgDataUri("月光湖岸", "moon"),
    moonlitIsle: svgDataUri("湖心浮岛", "moon"),
    underwaterGarden: svgDataUri("水底花园", "underwater"),
    deepSeaRuins: svgDataUri("深海遗迹", "ruins"),
    nessieLair: svgDataUri("Nessie 巢穴", "lair"),
  };

  function withFallback(key) {
    const fallback = fallbackByKey[key];
    if (!fallback || typeof backgroundSources === "undefined") return;

    const currentSource = backgroundSources[key];
    const configured = typeof backgroundSourceCandidates !== "undefined" && Array.isArray(backgroundSourceCandidates[key])
      ? backgroundSourceCandidates[key]
      : [];
    const candidates = [...configured];
    if (currentSource && !candidates.includes(currentSource)) candidates.unshift(currentSource);
    if (!candidates.includes(fallback)) candidates.push(fallback);

    backgroundSources[key] = currentSource || fallback;
    if (typeof backgroundSourceCandidates !== "undefined") backgroundSourceCandidates[key] = candidates;
    if (typeof backgrounds !== "undefined") delete backgrounds[key];
  }

  Object.keys(fallbackByKey).forEach(withFallback);

  if (typeof ensureBackground === "function") {
    ["schoolyard", "forest", "classroom", "pondSide", "wetland", "swampBoss", "moonlightShore", "underwaterGarden", "nessieLair"].forEach(ensureBackground);
  }

  window.CATS_OWLS_BACKGROUND_FALLBACKS = Object.keys(fallbackByKey);
})();
