/* Country Explorer — vanilla JS + Leaflet + Turf.js honeycomb + heatmap */

const BRAND_COLORS = {
  "Domino's": "#3B5BFE",
  "KFC": "#E53935",
  "McDonald's": "#F9A825",
  "Nando's": "#FF6D00",
  "Papa Johns": "#43A047",
  "Subway": "#00897B"
};

// Major cities per region with approximate coords for fly-to
const REGION_CITIES = {
  "East (England)": [
    { name: "Norwich", lat: 52.6309, lon: 1.2974 },
    { name: "Cambridge", lat: 52.2053, lon: 0.1218 },
    { name: "Ipswich", lat: 52.0567, lon: 1.1482 },
    { name: "Luton", lat: 51.8787, lon: -0.4200 },
    { name: "Southend", lat: 51.5406, lon: 0.7077 },
    { name: "Colchester", lat: 51.8959, lon: 0.8919 },
    { name: "Chelmsford", lat: 51.7356, lon: 0.4685 },
    { name: "Peterborough", lat: 52.5695, lon: -0.2405 },
    { name: "Basildon", lat: 51.5761, lon: 0.4886 },
    { name: "Bedford", lat: 52.1356, lon: -0.4668 }
  ],
  "East Midlands (England)": [
    { name: "Nottingham", lat: 52.9548, lon: -1.1581 },
    { name: "Leicester", lat: 52.6369, lon: -1.1398 },
    { name: "Derby", lat: 52.9225, lon: -1.4746 },
    { name: "Northampton", lat: 52.2405, lon: -0.9027 },
    { name: "Lincoln", lat: 53.2307, lon: -0.5406 },
    { name: "Mansfield", lat: 53.1472, lon: -1.1987 },
    { name: "Chesterfield", lat: 53.2350, lon: -1.4210 },
    { name: "Corby", lat: 52.4914, lon: -0.6965 },
    { name: "Loughborough", lat: 52.7721, lon: -1.2064 },
    { name: "Kettering", lat: 52.3969, lon: -0.7230 }
  ],
  "London": [
    { name: "City of London", lat: 51.5155, lon: -0.0922 },
    { name: "Westminster", lat: 51.4975, lon: -0.1357 },
    { name: "Camden", lat: 51.5517, lon: -0.1588 },
    { name: "Croydon", lat: 51.3762, lon: -0.0982 },
    { name: "Ealing", lat: 51.5130, lon: -0.3089 },
    { name: "Bromley", lat: 51.4039, lon: 0.0198 },
    { name: "Enfield", lat: 51.6538, lon: -0.0799 },
    { name: "Barnet", lat: 51.6252, lon: -0.1517 },
    { name: "Lewisham", lat: 51.4535, lon: -0.0205 },
    { name: "Hackney", lat: 51.5450, lon: -0.0553 }
  ],
  "North East (England)": [
    { name: "Newcastle", lat: 54.9783, lon: -1.6178 },
    { name: "Sunderland", lat: 54.9069, lon: -1.3838 },
    { name: "Middlesbrough", lat: 54.5742, lon: -1.2350 },
    { name: "Gateshead", lat: 54.9527, lon: -1.6039 },
    { name: "Darlington", lat: 54.5235, lon: -1.5527 },
    { name: "Hartlepool", lat: 54.6863, lon: -1.2129 },
    { name: "Durham", lat: 54.7753, lon: -1.5849 },
    { name: "South Shields", lat: 55.0004, lon: -1.4320 },
    { name: "Stockton", lat: 54.5680, lon: -1.3140 },
    { name: "Blyth", lat: 55.1260, lon: -1.5084 }
  ],
  "North West (England)": [
    { name: "Manchester", lat: 53.4808, lon: -2.2426 },
    { name: "Liverpool", lat: 53.4084, lon: -2.9916 },
    { name: "Preston", lat: 53.7632, lon: -2.7031 },
    { name: "Bolton", lat: 53.5785, lon: -2.4299 },
    { name: "Blackpool", lat: 53.8175, lon: -3.0357 },
    { name: "Warrington", lat: 53.3900, lon: -2.5970 },
    { name: "Wigan", lat: 53.5445, lon: -2.6325 },
    { name: "Stockport", lat: 53.4106, lon: -2.1575 },
    { name: "Blackburn", lat: 53.7500, lon: -2.4847 },
    { name: "Burnley", lat: 53.7893, lon: -2.2479 }
  ],
  "South East (England)": [
    { name: "Brighton", lat: 50.8225, lon: -0.1372 },
    { name: "Reading", lat: 51.4543, lon: -0.9781 },
    { name: "Southampton", lat: 50.9097, lon: -1.4044 },
    { name: "Portsmouth", lat: 50.8198, lon: -1.0880 },
    { name: "Oxford", lat: 51.7520, lon: -1.2577 },
    { name: "Milton Keynes", lat: 52.0406, lon: -0.7594 },
    { name: "Slough", lat: 51.5105, lon: -0.5950 },
    { name: "Maidstone", lat: 51.2724, lon: 0.5290 },
    { name: "Guildford", lat: 51.2362, lon: -0.5704 },
    { name: "Canterbury", lat: 51.2802, lon: 1.0789 }
  ],
  "South West (England)": [
    { name: "Bristol", lat: 51.4545, lon: -2.5879 },
    { name: "Plymouth", lat: 50.3755, lon: -4.1427 },
    { name: "Exeter", lat: 50.7184, lon: -3.5339 },
    { name: "Bournemouth", lat: 50.7192, lon: -1.8808 },
    { name: "Swindon", lat: 51.5558, lon: -1.7797 },
    { name: "Gloucester", lat: 51.8642, lon: -2.2382 },
    { name: "Bath", lat: 51.3811, lon: -2.3590 },
    { name: "Cheltenham", lat: 51.8994, lon: -2.0783 },
    { name: "Taunton", lat: 51.0157, lon: -3.1004 },
    { name: "Torquay", lat: 50.4619, lon: -3.5253 }
  ],
  "West Midlands (England)": [
    { name: "Birmingham", lat: 52.4862, lon: -1.8904 },
    { name: "Coventry", lat: 52.4068, lon: -1.5197 },
    { name: "Wolverhampton", lat: 52.5870, lon: -2.1288 },
    { name: "Stoke-on-Trent", lat: 53.0027, lon: -2.1794 },
    { name: "Dudley", lat: 52.5085, lon: -2.0816 },
    { name: "Walsall", lat: 52.5860, lon: -1.9829 },
    { name: "Solihull", lat: 52.4130, lon: -1.7838 },
    { name: "Telford", lat: 52.6766, lon: -2.4469 },
    { name: "Worcester", lat: 52.1920, lon: -2.2216 },
    { name: "Hereford", lat: 52.0565, lon: -2.7160 }
  ],
  "Yorkshire and The Humber": [
    { name: "Leeds", lat: 53.8008, lon: -1.5491 },
    { name: "Sheffield", lat: 53.3811, lon: -1.4701 },
    { name: "Bradford", lat: 53.7960, lon: -1.7594 },
    { name: "Hull", lat: 53.7457, lon: -0.3367 },
    { name: "York", lat: 53.9600, lon: -1.0873 },
    { name: "Huddersfield", lat: 53.6458, lon: -1.7850 },
    { name: "Doncaster", lat: 53.5228, lon: -1.1285 },
    { name: "Wakefield", lat: 53.6830, lon: -1.4977 },
    { name: "Rotherham", lat: 53.4327, lon: -1.3568 },
    { name: "Halifax", lat: 53.7248, lon: -1.8658 }
  ]
};

const REGION_CENTERS = {
  "East (England)": { lat: 52.2, lon: 0.5, zoom: 8 },
  "East Midlands (England)": { lat: 52.8, lon: -1.1, zoom: 8 },
  "London": { lat: 51.51, lon: -0.12, zoom: 10 },
  "North East (England)": { lat: 54.8, lon: -1.5, zoom: 8.5 },
  "North West (England)": { lat: 53.6, lon: -2.6, zoom: 8 },
  "South East (England)": { lat: 51.3, lon: -0.5, zoom: 8 },
  "South West (England)": { lat: 51.0, lon: -3.0, zoom: 7.5 },
  "West Midlands (England)": { lat: 52.5, lon: -2.0, zoom: 8.5 },
  "Yorkshire and The Humber": { lat: 53.7, lon: -1.3, zoom: 8 }
};

const ENGLAND_VIEW = { lat: 52.8, lon: -1.5, zoom: 6.5 };

// Regional population estimates (ONS mid-2023)
const REGION_POPULATION = {
  "East (England)": 6_350_000,
  "East Midlands (England)": 4_880_000,
  "London": 8_800_000,
  "North East (England)": 2_650_000,
  "North West (England)": 7_420_000,
  "South East (England)": 9_290_000,
  "South West (England)": 5_710_000,
  "West Midlands (England)": 5_950_000,
  "Yorkshire and The Humber": 5_480_000
};
const ENGLAND_TOTAL_POPULATION = Object.values(REGION_POPULATION).reduce((s, v) => s + v, 0);

// Estimated delivery profile by chain (heuristic, not actual ops data)
const DELIVERY_PROFILE = {
  "Domino's":   { baseKm: 3.8, urbanKm: 2.4, suburbanKm: 3.4, ruralKm: 4.8, weight: 1.15 },
  "Papa Johns": { baseKm: 3.6, urbanKm: 2.3, suburbanKm: 3.2, ruralKm: 4.5, weight: 1.10 },
  "McDonald's": { baseKm: 3.0, urbanKm: 2.0, suburbanKm: 2.8, ruralKm: 4.0, weight: 1.00 },
  "KFC":        { baseKm: 3.1, urbanKm: 2.1, suburbanKm: 2.9, ruralKm: 4.1, weight: 1.00 },
  "Subway":     { baseKm: 2.6, urbanKm: 1.8, suburbanKm: 2.5, ruralKm: 3.5, weight: 0.90 },
  "Nando's":    { baseKm: 3.2, urbanKm: 2.2, suburbanKm: 3.0, ruralKm: 4.2, weight: 0.95 }
};

function getUrbanBand(popDensity) {
  if (popDensity >= 3000) return "urban";
  if (popDensity >= 800) return "suburban";
  return "rural";
}

function getRadiusForBrand(brand, popDensity) {
  const profile = DELIVERY_PROFILE[brand] || { baseKm: 3.2, urbanKm: 2.2, suburbanKm: 3.0, ruralKm: 4.2, weight: 1.0 };
  const band = getUrbanBand(popDensity);
  if (band === "urban") return profile.urbanKm;
  if (band === "suburban") return profile.suburbanKm;
  return profile.ruralKm;
}

const state = {
  selectedBrands: new Set(),
  metric: "coverage",
  coverageView: "coverage",
  selectedRegion: null,
  selectedCity: null,
  expandedRegion: null,
  metrics: null,
  regionsGeojson: null,
  locationsGeojson: null,
  lsoaGeojson: null,
  lsoaMetrics: null,
  lsoaCentroids: null,
  map: null,
  regionsLayer: null,
  locationsLayer: null,
  hexLayer: null,
  hexDebounce: null,
  heatmapMode: false,
  primaryBrand: null,
  compareMode: "all",
  secondaryBrand: null,
  compareEnabled: false,
  compareBrand: null,
  compareHexLayer: null,
  baseBrand: null,
  coverageThreshold: 0.35,
  showOnlyCovered: false,
  country: "england",
  regionSort: "density",
  // Spatial index for fast viewport queries
  _pointIndex: null,
  _lsoaIndex: null,
  _lsoaById: null,
  _canvasRenderer: null
};

const fmtInt = x => new Intl.NumberFormat("en-GB").format(x);
const fmtPct = x => (x * 100).toFixed(1) + "%";
const fmtGBP = x => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(x);

async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Failed: ${path}`);
  return r.json();
}

// ── Hex colors ──
function hexFillDensity(count, max, pop, maxPop) {
  if (!max || count === 0) {
    if (pop > 0 && maxPop > 0) {
      const t = Math.min(1, pop / maxPop);
      return `hsla(220,40%,${94 - 12 * t}%,${0.08 + 0.18 * t})`;
    }
    return "hsla(220,30%,94%,0.06)";
  }
  const raw = Math.min(1, count / max);
  const t = Math.pow(raw, 0.6);
  const l = 92 - 52 * t;
  const a = 0.25 + 0.6 * t;
  return `hsla(220,85%,${l}%,${a})`;
}
function hexStrokeDensity(count, max, pop, maxPop) {
  if (!max || count === 0) {
    if (pop > 0 && maxPop > 0) {
      const t = Math.min(1, pop / maxPop);
      return `rgba(59,91,254,${0.06 + 0.15 * t})`;
    }
    return "rgba(59,91,254,0.08)";
  }
  const raw = Math.min(1, count / max);
  const t = Math.pow(raw, 0.6);
  return `rgba(59,91,254,${0.1 + 0.55 * t})`;
}

const COMPARE_LAYER_STYLE = {
  baseOnlyFill: "rgba(59,91,254,0.42)",
  baseOnlyStroke: "rgba(59,91,254,0.95)",
  compareOnlyFill: "rgba(255,122,26,0.38)",
  compareOnlyStroke: "rgba(255,122,26,0.98)",
  sharedFill: "rgba(156,102,180,0.42)",
  sharedStroke: "rgba(156,102,180,0.98)",
  noCoverageFill: "rgba(160,170,190,0.06)",
  noCoverageStroke: "rgba(160,170,190,0.12)"
};

function hexFillCoverageMode(value, max, mode, pop, maxPop) {
  if (!max || value === 0 || value == null || Number.isNaN(value)) {
    if (pop > 0 && maxPop > 0) {
      const t = Math.min(1, pop / maxPop);
      return `hsla(220,40%,${94 - 12 * t}%,${0.08 + 0.18 * t})`;
    }
    return "hsla(220,30%,94%,0.06)";
  }

  let t = Math.min(1, value / max);

  if (mode === "coverage") t = Math.pow(t, 0.7);
  if (mode === "covered_pop") t = Math.pow(t, 0.55);
  if (mode === "overlap") t = Math.pow(t, 0.8);

  const l = 92 - 52 * t;
  const a = 0.25 + 0.6 * t;
  return `hsla(220,85%,${l}%,${a})`;
}

function hexStrokeCoverageMode(value, max, mode, pop, maxPop) {
  if (!max || value === 0 || value == null || Number.isNaN(value)) {
    if (pop > 0 && maxPop > 0) {
      const t = Math.min(1, pop / maxPop);
      return `rgba(59,91,254,${0.06 + 0.15 * t})`;
    }
    return "rgba(59,91,254,0.08)";
  }

  let t = Math.min(1, value / max);

  if (mode === "coverage") t = Math.pow(t, 0.7);
  if (mode === "covered_pop") t = Math.pow(t, 0.55);
  if (mode === "overlap") t = Math.pow(t, 0.8);

  return `rgba(59,91,254,${0.1 + 0.55 * t})`;
}

function hexFillHeatmap(ratio) {
  if (isNaN(ratio)) return "hsla(0,0%,90%,0.08)";
  const t = Math.max(0, Math.min(1, ratio));
  if (t < 0.5) {
    const p = t / 0.5;
    const h = p * 60;
    return `hsla(${h},90%,${50 - 8 * (1 - p)}%,${0.35 + 0.15 * (1 - p)})`;
  } else {
    const p = (t - 0.5) / 0.5;
    const h = 60 + p * 60;
    return `hsla(${h},75%,${45 - 5 * p}%,${0.3 + 0.2 * p})`;
  }
}
function hexStrokeHeatmap(ratio) {
  if (isNaN(ratio)) return "rgba(0,0,0,0.05)";
  const t = Math.max(0, Math.min(1, ratio));
  if (t < 0.5) return `rgba(229,57,53,${0.2 + 0.15 * (1 - t * 2)})`;
  return `rgba(76,175,80,${0.2 + 0.15 * ((t - 0.5) * 2)})`;
}

function cellSizeForZoom(zoom) {
  const focused = !!state.selectedRegion;

  if (focused) {
    if (zoom >= 14) return 0.35;
    if (zoom >= 13) return 0.55;
    if (zoom >= 12) return 0.8;
    if (zoom >= 11) return 1.1;
    if (zoom >= 10) return 1.6;
    if (zoom >= 9) return 2.6;
    if (zoom >= 8) return 4;
    return 6;
  }

  if (zoom >= 14) return 0.6;
  if (zoom >= 13) return 0.9;
  if (zoom >= 12) return 1.2;
  if (zoom >= 11) return 1.8;
  if (zoom >= 10) return 2.5;
  if (zoom >= 9) return 4;
  if (zoom >= 8) return 6;
  if (zoom >= 7) return 9;
  return 15;
}

// ── Country handling ──
function setCountry(country) {
  state.country = country;
  const isEngland = country === "england";
  document.getElementById("noDataOverlay").classList.toggle("hidden", isEngland);
  document.getElementById("mapLegend").classList.toggle("hidden", !isEngland);

  ["kpiSection", "brandsSection", "regionTableSection", "heatmapSection", "deepreviewContent"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.opacity = isEngland ? "1" : "0.3";
      el.style.pointerEvents = isEngland ? "auto" : "none";
    });

  if (isEngland) {
    state.map.flyTo([ENGLAND_VIEW.lat, ENGLAND_VIEW.lon], ENGLAND_VIEW.zoom, { duration: 1.2 });
    if (state.regionsLayer) state.regionsLayer.addTo(state.map);
    buildHexLayer();
  } else {
    if (state.hexLayer) { state.hexLayer.remove(); state.hexLayer = null; }
    if (state.locationsLayer) { state.locationsLayer.remove(); state.locationsLayer = null; }
    if (state.regionsLayer) state.regionsLayer.remove();
    state.selectedRegion = null;
    state.selectedCity = null;
    state.expandedRegion = null;
  }
}

// ── Tab switching ──
function setTab(tab) {
  document.querySelectorAll(".sidebar-btn[data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.getElementById("overviewContent").classList.toggle("hidden", tab !== "overview");
  document.getElementById("deepreviewContent").classList.toggle("hidden", tab !== "deepreview");
  if ((tab === "overview" || tab === "deepreview") && state.map) setTimeout(() => state.map.invalidateSize(), 100);
}

// ── Build brand list ──
function buildBrandList() {
  const wrap = document.getElementById("brandList");
  wrap.innerHTML = "";
  state.selectedBrands = new Set(state.metrics.brands);

  const allEl = document.createElement("div");
  allEl.className = "brand-pill active";
  allEl.id = "brandAllPill";
  allEl.innerHTML = `
    <span class="brand-dot" style="background:linear-gradient(135deg,#3B5BFE,#22C1F1)"></span>
    <span class="brand-name">All</span>
    <span class="brand-count" data-brand="__all__">${fmtInt(Object.values(state.metrics.brand_totals).reduce((a, b) => a + b, 0))}</span>
  `;
  allEl.onclick = () => setAllBrands(state.metrics.brands);
  wrap.appendChild(allEl);

  state.metrics.brands.forEach(b => {
    const total = state.metrics.brand_totals[b] || 0;
    const el = document.createElement("div");
    el.className = "brand-pill";
    el.dataset.brand = b;
    el.innerHTML = `
      <span class="brand-dot" style="background:${BRAND_COLORS[b] || '#3B5BFE'}"></span>
      <span class="brand-name">${b}</span>
      <span class="brand-count" data-brand="${b}">${fmtInt(total)}</span>
    `;
    el.onclick = () => {
      if (state.selectedBrands.size === state.metrics.brands.length) {
        state.selectedBrands = new Set([b]);
        document.querySelectorAll(".brand-pill").forEach(pill => {
          const name = pill.dataset.brand;
          if (!name) return;
          pill.classList.toggle("inactive", name !== b);
        });
      } else if (state.selectedBrands.has(b)) {
        if (state.selectedBrands.size > 1) {
          state.selectedBrands.delete(b);
          el.classList.add("inactive");
        }
      } else {
        state.selectedBrands.add(b);
        el.classList.remove("inactive");
      }
      const allPill = document.getElementById("brandAllPill");
      if (allPill) allPill.classList.toggle("active", state.selectedBrands.size === state.metrics.brands.length);
      state.selectedCity = null;
      refreshAll();
    };
    wrap.appendChild(el);
  });
}

function setAllBrands(brands) {
  state.selectedBrands = new Set(brands);
  document.querySelectorAll(".brand-pill").forEach(el => {
    const name = el.dataset.brand;
    if (!name) return;
    el.classList.toggle("inactive", !state.selectedBrands.has(name));
  });
  const allPill = document.getElementById("brandAllPill");
  if (allPill) allPill.classList.toggle("active", state.selectedBrands.size === state.metrics.brands.length);
  state.selectedCity = null;
  refreshAll();
}

// ── Build selectors ──
function buildBrandSelects() {
  const primary = document.getElementById("primaryBrandSelect");
  const secondary = document.getElementById("secondaryBrandSelect");
  state.metrics.brands.forEach(b => {
    const o1 = document.createElement("option");
    o1.value = b; o1.textContent = b;
    primary.appendChild(o1);
    const o2 = document.createElement("option");
    o2.value = b; o2.textContent = b;
    secondary.appendChild(o2);
  });
  state.primaryBrand = state.metrics.brands[0];
  state.secondaryBrand = state.metrics.brands[1];
  state.compareBrand = state.metrics.brands.find(b => b !== state.primaryBrand) || state.metrics.brands[1];
  primary.value = state.primaryBrand;
  secondary.value = state.compareBrand || state.secondaryBrand;
}

const selectedArr = () => Array.from(state.selectedBrands);

function isCoverageCompareMode() {
  return !state.heatmapMode &&
    state.compareEnabled &&
    selectedArr().length === 1 &&
    !!state.compareBrand;
}

function isLSOAReady() {
  return !!(state.lsoaGeojson && state.lsoaMetrics);
}

function getActiveMapBrands() {
  const selected = selectedArr();

  if (state.heatmapMode && state.primaryBrand) {
    if (state.compareMode === "pick" && state.secondaryBrand) {
      return [state.primaryBrand, state.secondaryBrand];
    }
    return [state.primaryBrand, ...state.metrics.brands.filter(b => b !== state.primaryBrand)];
  }

  if (isCoverageCompareMode()) {
    return [selected[0], state.compareBrand].filter(Boolean);
  }

  return selected;
}

function regionNameFromFeature(feature) {
  return feature?.properties?.rgn24nm || feature?.properties?.name || null;
}

function isHexInSelectedRegion(hex) {
  if (!state.selectedRegion) return true;
  const cx = hex.properties?._cx ?? hex._cx;
  const cy = hex.properties?._cy ?? hex._cy;
  if (cx == null || cy == null) return false;
  return fastRegionLookup(cx, cy) === state.selectedRegion;
}

function getRegionPopulation(regionName) {
  return state.metrics?.region_population_2023?.[regionName] || REGION_POPULATION[regionName] || 0;
}

function getRegionArea(regionName) {
  return state.metrics?.region_area_km2?.[regionName] || 1;
}

// ── Spatial index for fast point lookups ──
function buildSpatialIndex() {
  // Simple grid-based spatial index
  const cellSize = 0.5; // degrees
  const index = {};
  state.locationsGeojson.features.forEach(f => {
    const [lon, lat] = f.geometry.coordinates;
    const key = `${Math.floor(lon / cellSize)},${Math.floor(lat / cellSize)}`;
    if (!index[key]) index[key] = [];
    index[key].push(f);
  });
  state._pointIndex = { cellSize, index };
}

function getPointsInBounds(bounds, brandFilter, regionFilter) {
  if (!state._pointIndex) return [];
  const { cellSize, index } = state._pointIndex;
  const w = bounds.getWest(), e = bounds.getEast(), s = bounds.getSouth(), n = bounds.getNorth();
  const minX = Math.floor(w / cellSize), maxX = Math.floor(e / cellSize);
  const minY = Math.floor(s / cellSize), maxY = Math.floor(n / cellSize);
  const results = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const bucket = index[`${x},${y}`];
      if (!bucket) continue;
      for (const f of bucket) {
        const p = f.properties;
        if (brandFilter && !brandFilter.has(p.brand)) continue;
        if (regionFilter && p.region !== regionFilter) continue;
        const [lon, lat] = f.geometry.coordinates;
        if (lon >= w && lon <= e && lat >= s && lat <= n) results.push(f);
      }
    }
  }
  return results;
}

// ── LSOA indexing ──
function buildLSOASpatialIndex() {
  if (!state.lsoaGeojson?.features?.length) return;

  const cellSize = 0.2;
  const index = {};
  const byId = {};

  state.lsoaGeojson.features.forEach(f => {
    const props = f.properties || {};
    const id = props.lsoa_code || props.LSOA21CD || props.lsoa21cd || props.code;
    if (!id) return;

    let cx, cy;
    if (props.centroid_lon != null && props.centroid_lat != null) {
      cx = Number(props.centroid_lon);
      cy = Number(props.centroid_lat);
    } else if (f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon") {
      const centroid = turf.centroid(f);
      cx = centroid.geometry.coordinates[0];
      cy = centroid.geometry.coordinates[1];
    } else {
      return;
    }

    f.properties._cx = cx;
    f.properties._cy = cy;
    byId[id] = f;

    const key = `${Math.floor(cx / cellSize)},${Math.floor(cy / cellSize)}`;
    if (!index[key]) index[key] = [];
    index[key].push(f);
  });

  state._lsoaIndex = { cellSize, index };
  state._lsoaById = byId;
}

function getLSOAsInBounds(bounds, regionFilter = null) {
  if (!state._lsoaIndex) return [];

  const { cellSize, index } = state._lsoaIndex;
  const w = bounds.getWest();
  const e = bounds.getEast();
  const s = bounds.getSouth();
  const n = bounds.getNorth();

  const minX = Math.floor(w / cellSize);
  const maxX = Math.floor(e / cellSize);
  const minY = Math.floor(s / cellSize);
  const maxY = Math.floor(n / cellSize);

  const out = [];
  const seen = new Set();

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const bucket = index[`${x},${y}`];
      if (!bucket) continue;
      for (const f of bucket) {
        const id = f.properties?.lsoa_code || f.properties?.LSOA21CD || f.properties?.lsoa21cd || f.properties?.code;
        if (!id || seen.has(id)) continue;

        const cx = f.properties._cx;
        const cy = f.properties._cy;
        if (cx < w || cx > e || cy < s || cy > n) continue;

        if (regionFilter) {
          const region = fastRegionLookup(cx, cy);
          if (region !== regionFilter) continue;
        }

        seen.add(id);
        out.push(f);
      }
    }
  }

  return out;
}

function getLSOAPopulation(feature) {
  const p = feature.properties || {};
  return Number(
    p.population ?? p.pop_2023 ?? p.pop_2022 ?? p.total_population ?? p.Population ?? 0
  ) || 0;
}

function getLSOAAreaKm2(feature) {
  const p = feature.properties || {};
  if (p.area_km2 != null) return Number(p.area_km2) || 0;
  if (p.area_m2 != null) return (Number(p.area_m2) || 0) / 1e6;
  try {
    return turf.area(feature) / 1e6;
  } catch {
    return 0;
  }
}

function getLSOADensity(feature) {
  const p = feature.properties || {};
  if (p.pop_density != null) return Number(p.pop_density) || 0;
  const pop = getLSOAPopulation(feature);
  const area = getLSOAAreaKm2(feature);
  return area > 0 ? pop / area : 0;
}

// ── Compute unlocated stores (in metrics but missing from GeoJSON) ──
function computeUnlocatedStores() {
  const geojsonCounts = {}; // { region: { brand: count } }
  state.locationsGeojson.features.forEach(f => {
    const p = f.properties;
    if (!p.region) return;
    if (!geojsonCounts[p.region]) geojsonCounts[p.region] = {};
    geojsonCounts[p.region][p.brand] = (geojsonCounts[p.region][p.brand] || 0) + 1;
  });

  const unlocated = {}; // { region: { brand: count, _total: n } }
  let totalUnlocated = 0;
  state.metrics.regions.forEach(r => {
    const metricCounts = state.metrics.region_brand_counts[r] || {};
    const geoCounts = geojsonCounts[r] || {};
    unlocated[r] = { _total: 0 };
    state.metrics.brands.forEach(b => {
      const diff = Math.max(0, (metricCounts[b] || 0) - (geoCounts[b] || 0));
      unlocated[r][b] = diff;
      unlocated[r]._total += diff;
      totalUnlocated += diff;
    });
  });

  state.unlocatedStores = unlocated;
  state.totalUnlocated = totalUnlocated;

  // Also count city-null stores per region (have coords but no city — useful for city-level analysis)
  const cityNull = {};
  state.locationsGeojson.features.forEach(f => {
    const p = f.properties;
    const city = (p.city || "").trim();
    if (!city || city === "Unknown") {
      if (!cityNull[p.region]) cityNull[p.region] = { _total: 0 };
      cityNull[p.region][p.brand] = (cityNull[p.region][p.brand] || 0) + 1;
      cityNull[p.region]._total++;
    }
  });
  state.cityNullStores = cityNull;

  console.log(`📊 Unlocated stores (no coords): ${totalUnlocated} across ${Object.keys(unlocated).length} regions`);
  const cityNullTotal = Object.values(cityNull).reduce((s, r) => s + r._total, 0);
  console.log(`📊 City-null stores (have coords, no city): ${cityNullTotal}`);
}

function initMap() {
  const map = L.map('map', { zoomControl: true, zoomSnap: 0.5 });
  state.map = map;
  map.setView([ENGLAND_VIEW.lat, ENGLAND_VIEW.lon], ENGLAND_VIEW.zoom);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18, attribution: '© OpenStreetMap © CARTO'
  }).addTo(map);

  state.regionsLayer = L.geoJSON(state.regionsGeojson, {
    style: () => ({ weight: 1.2, color: "rgba(0,0,0,0.1)", fillColor: "transparent", fillOpacity: 0 }),
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name;
      layer.on('click', () => {
        state.selectedRegion = (state.selectedRegion === name) ? null : name;
        state.selectedCity = null;
        document.getElementById("regionSelect").value = state.selectedRegion || "";
        document.getElementById("citySelect") && (document.getElementById("citySelect").value = "");
        buildCitySelect(state.selectedRegion);
        flyToRegion(state.selectedRegion);
        refreshAll();
      });
      layer.bindTooltip(name.replace(" (England)", ""), { sticky: true });
    }
  }).addTo(map);

  buildHexLayer();

  // Faster debounce + rebuild on both zoom and pan at high zoom
  map.on('zoomend', () => {
    clearTimeout(state.hexDebounce);
    state.hexDebounce = setTimeout(() => {
      buildHexLayer();
      rebuildLocationsLayer();
    }, 60);
  });
  map.on('moveend', () => {
    if (map.getZoom() >= 7.5) {
      clearTimeout(state.hexDebounce);
      state.hexDebounce = setTimeout(() => {
        buildHexLayer();
        rebuildLocationsLayer();
      }, 80);
    }
  });
}

function flyToRegion(region) {
  if (!state.map) return;
  if (!region) {
    state.map.flyTo([ENGLAND_VIEW.lat, ENGLAND_VIEW.lon], ENGLAND_VIEW.zoom, { duration: 1 });
    return;
  }
  const center = REGION_CENTERS[region];
  if (center) state.map.flyTo([center.lat, center.lon], center.zoom, { duration: 1 });
}

function flyToCity(cityName, region) {
  if (!state.map) return;
  const cities = REGION_CITIES[region] || [];
  const city = cities.find(c => c.name === cityName);
  if (city) state.map.flyTo([city.lat, city.lon], 13, { duration: 1 });
}

// ── Fast region lookup cache ──
// Pre-computes a grid mapping lat/lon cells to region names
let _regionGridCache = null;
function buildRegionGrid() {
  if (_regionGridCache) return _regionGridCache;
  const step = 0.1; // ~11km resolution
  const grid = {};
  // Sample points across England bounding box
  for (let lat = 49.5; lat <= 56; lat += step) {
    for (let lon = -6; lon <= 2; lon += step) {
      const pt = turf.point([lon, lat]);
      for (const region of state.regionsGeojson.features) {
        if (turf.booleanPointInPolygon(pt, region)) {
          const key = `${Math.floor(lon / step)},${Math.floor(lat / step)}`;
          grid[key] = region.properties.rgn24nm || region.properties.name || '';
          break;
        }
      }
    }
  }
  _regionGridCache = { step, grid };
  return _regionGridCache;
}

function fastRegionLookup(lon, lat) {
  const rg = buildRegionGrid();
  const key = `${Math.floor(lon / rg.step)},${Math.floor(lat / rg.step)}`;
  return rg.grid[key] || null;
}

// Fast population estimate using cached region lookup (no turf calls per hex)
function fastEstimatePopulation(hexAreaKm2, lon, lat) {
  const regionName = fastRegionLookup(lon, lat);
  if (regionName) {
    const regionPop = REGION_POPULATION[regionName] || 0;
    const regionArea = state.metrics.region_area_km2[regionName] || 1;
    return Math.round((hexAreaKm2 / regionArea) * regionPop);
  }
  const totalArea = Object.values(state.metrics.region_area_km2).reduce((s, v) => s + v, 0);
  return Math.round((hexAreaKm2 / totalArea) * ENGLAND_TOTAL_POPULATION);
}

function fastEstimateUnlocated(hexAreaKm2, lon, lat, brandFilter) {
  if (!state.unlocatedStores) return 0;
  const regionName = fastRegionLookup(lon, lat);
  if (!regionName) return 0;
  const regionPop = REGION_POPULATION[regionName] || 1;
  const regionArea = state.metrics.region_area_km2[regionName] || 1;
  const hexPop = Math.round((hexAreaKm2 / regionArea) * regionPop);
  const unlocated = state.unlocatedStores[regionName] || {};
  let relevantUnlocated = 0;
  if (brandFilter) {
    brandFilter.forEach(b => { relevantUnlocated += (unlocated[b] || 0); });
  } else {
    relevantUnlocated = unlocated._total || 0;
  }
  return relevantUnlocated * (hexPop / regionPop);
}

// ── Assign points to hex cells via centroid-based binning ──
// Instead of turf.pointsWithinPolygon per hex (O(H*P)), we assign each point
// to the nearest hex centroid in O(P) time.
function binPointsToHexes(hexGrid, locations) {
  // Build a lookup: for each hex, compute centroid
  const hexCentroids = [];
  hexGrid.features.forEach((hex, i) => {
    const coords = hex.geometry.coordinates[0];
    // Approximate centroid by averaging vertices (faster than turf.centroid)
    let cx = 0, cy = 0;
    const n = coords.length - 1; // last vertex = first
    for (let j = 0; j < n; j++) { cx += coords[j][0]; cy += coords[j][1]; }
    cx /= n; cy /= n;
    hex._cx = cx; hex._cy = cy; hex._idx = i;
    hexCentroids.push({ cx, cy, idx: i });
  });

  // Compute hex grid spacing from first two hex centroids
  // For a hex grid, we can use a simple nearest-centroid approach
  // Build a spatial hash of hex centroids for O(1) lookups
  const hexBuckets = {};
  // Estimate cell spacing from hex grid
  let spacing = 0.1;
  if (hexGrid.features.length >= 2) {
    const h0 = hexGrid.features[0], h1 = hexGrid.features[1];
    spacing = Math.max(
      Math.abs(h0._cx - h1._cx),
      Math.abs(h0._cy - h1._cy)
    ) || 0.1;
  }
  const bucketSize = spacing * 2;

  hexCentroids.forEach(({ cx, cy, idx }) => {
    const bx = Math.floor(cx / bucketSize);
    const by = Math.floor(cy / bucketSize);
    const key = `${bx},${by}`;
    if (!hexBuckets[key]) hexBuckets[key] = [];
    hexBuckets[key].push({ cx, cy, idx });
  });

  // For each point, find nearest hex centroid
  const hexPoints = new Array(hexGrid.features.length);
  for (let i = 0; i < hexPoints.length; i++) hexPoints[i] = [];

  locations.forEach(f => {
    const [lon, lat] = f.geometry.coordinates;
    const bx = Math.floor(lon / bucketSize);
    const by = Math.floor(lat / bucketSize);

    let bestDist = Infinity, bestIdx = -1;
    // Check 3x3 neighborhood
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const bucket = hexBuckets[`${bx + dx},${by + dy}`];
        if (!bucket) continue;
        for (const { cx, cy, idx } of bucket) {
          const d = (lon - cx) * (lon - cx) + (lat - cy) * (lat - cy);
          if (d < bestDist) { bestDist = d; bestIdx = idx; }
        }
      }
    }
    if (bestIdx >= 0) hexPoints[bestIdx].push(f);
  });

  return hexPoints;
}

function getBrandCountsForPoints(points) {
  const counts = {};
  points.forEach(f => {
    const b = f.properties.brand;
    counts[b] = (counts[b] || 0) + 1;
  });
  return counts;
}

function getHexCentroid(hex) {
  const coords = hex.geometry.coordinates[0];
  let cx = 0, cy = 0;
  const n = coords.length - 1;
  for (let j = 0; j < n; j++) {
    cx += coords[j][0];
    cy += coords[j][1];
  }
  return [cx / n, cy / n];
}

function getBrandCoverageThreshold(brand) {
  const byBrand = {
    "Domino's": 0.34,
    "Papa Johns": 0.33,
    "McDonald's": 0.30,
    "KFC": 0.30,
    "Subway": 0.28,
    "Nando's": 0.29
  };
  return byBrand[brand] ?? state.coverageThreshold ?? 0.30;
}

function getCoverageConfidence(contributingStores, estPop, regionName) {
  let score = 0;
  if (contributingStores >= 3) score += 0.45;
  else if (contributingStores >= 2) score += 0.32;
  else if (contributingStores >= 1) score += 0.18;

  if (estPop >= 3000) score += 0.2;
  else if (estPop >= 1000) score += 0.12;

  const unlocatedTotal = regionName && state.unlocatedStores?.[regionName]?._total
    ? state.unlocatedStores[regionName]._total
    : 0;

  if (unlocatedTotal === 0) score += 0.2;
  else if (unlocatedTotal < 5) score += 0.12;
  else if (unlocatedTotal < 15) score += 0.05;

  return Math.max(0, Math.min(1, score));
}

function getNearbyStoresForHex(cx, cy, searchRadiusKm, brandFilter, regionFilter) {
  // crude bbox prefilter before exact distance check
  const latPad = searchRadiusKm / 111;
  const lonPad = searchRadiusKm / (111 * Math.max(0.2, Math.cos(cy * Math.PI / 180)));

  const bounds = L.latLngBounds(
    [cy - latPad, cx - lonPad],
    [cy + latPad, cx + lonPad]
  );

  const candidates = getPointsInBounds(bounds, brandFilter, regionFilter);
  const center = turf.point([cx, cy]);

  return candidates.filter(f => {
    const d = turf.distance(center, turf.point(f.geometry.coordinates), { units: "kilometers" });
    return d <= searchRadiusKm;
  });
}

function computeLSOACoverageForBrand(brand, bounds, regionFilter = null) {
  const lsoas = getLSOAsInBounds(bounds, regionFilter);
  const brandFilter = new Set([brand]);
  const maxSearchRadiusKm = 7;

  return lsoas.map(f => {
    const cx = f.properties._cx;
    const cy = f.properties._cy;
    const estPop = getLSOAPopulation(f);
    const areaKm2 = Math.max(0.01, getLSOAAreaKm2(f));
    const nearbyStores = getNearbyStoresForHex(cx, cy, maxSearchRadiusKm, brandFilter, regionFilter);
    const coverage = computeCoverageFromNearbyStores(cx, cy, estPop, areaKm2, nearbyStores);
    const regionName = fastRegionLookup(cx, cy);
    const threshold = getBrandCoverageThreshold(brand);

    const clone = JSON.parse(JSON.stringify(f));
    clone.properties._cx = cx;
    clone.properties._cy = cy;
    clone.properties.brand = brand;
    clone.properties.estPop = estPop;
    clone.properties.areaKm2 = areaKm2;
    clone.properties.coveragePct = coverage.coveragePct || 0;
    clone.properties.coveredPop = coverage.coveredPop || 0;
    clone.properties.coveredAreaKm2 = coverage.coveredAreaKm2 || 0;
    clone.properties.overlapIndex = coverage.overlapIndex || 0;
    clone.properties.weightedRadiusKm = coverage.weightedRadiusKm || 0;
    clone.properties.contributingStores = coverage.contributingStores || 0;
    clone.properties.rawScore = coverage.rawScore || 0;
    clone.properties.brandCounts = coverage.brandCounts || {};
    clone.properties.confidence = getCoverageConfidence(
      coverage.contributingStores || 0,
      estPop,
      regionName
    );
    clone.properties.threshold = threshold;
    clone.properties.isCovered = (coverage.coveragePct || 0) >= threshold;
    return clone;
  });
}

function computeCoverageFromNearbyStores(cx, cy, estPop, areaKm2, nearbyStores) {
  if (!estPop || !areaKm2) {
    return {
      coveredPop: 0,
      coveragePct: 0,
      overlapIndex: 0,
      weightedRadiusKm: 0,
      coveredAreaKm2: 0,
      exclusivePct: 0,
      sharedPct: 0,
      contributingStores: 0,
      rawScore: 0,
      brandCounts: {}
    };
  }

  const popDensity = estPop / areaKm2;
  const center = turf.point([cx, cy]);

  let rawScore = 0;
  let weightedRadiusNumerator = 0;
  let weightedStoreCount = 0;
  const brandCounts = {};

  nearbyStores.forEach(store => {
    const brand = store.properties.brand;
    const radiusKm = getRadiusForBrand(brand, popDensity);
    const profile = DELIVERY_PROFILE[brand] || { weight: 1.0 };
    const brandWeight = profile.weight || 1.0;

    const d = turf.distance(center, turf.point(store.geometry.coordinates), { units: "kilometers" });
    if (d > radiusKm) return;

    const distanceWeight = Math.pow(Math.max(0, 1 - d / radiusKm), 1.2);
    const urbanCompression = popDensity >= 3000 ? 0.86 : popDensity >= 800 ? 0.95 : 1.03;
    const contribution = distanceWeight * brandWeight * urbanCompression;

    rawScore += contribution;
    weightedRadiusNumerator += radiusKm;
    weightedStoreCount += 1;
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  });

  const coveragePct = Math.max(0, Math.min(1, 1 - Math.exp(-rawScore * 0.46)));
  const overlapIndex = Math.max(0, rawScore - 1.0);
  const sharedPct = Math.max(0, Math.min(1, overlapIndex / Math.max(1, rawScore + 0.3)));
  const exclusivePct = Math.max(0, coveragePct * (1 - sharedPct));
  const coveredAreaKm2 = coveragePct * areaKm2;
  const coveredPop = coveragePct * estPop;
  const weightedRadiusKm = weightedStoreCount ? (weightedRadiusNumerator / weightedStoreCount) : 0;

  return {
    coveredPop,
    coveragePct,
    overlapIndex,
    weightedRadiusKm,
    coveredAreaKm2,
    exclusivePct,
    sharedPct,
    contributingStores: weightedStoreCount,
    rawScore,
    brandCounts
  };
}

function buildBrandCoverageFeatures(brand, bounds, cellSize) {
  if (isLSOAReady()) {
    const features = computeLSOACoverageForBrand(brand, bounds, state.selectedRegion || null);
    return {
      features,
      featureMode: "lsoa"
    };
  }

  const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
  const hexGrid = turf.hexGrid(bbox, cellSize, { units: "kilometers" });
  const hexAreaKm2 = hexGrid.features.length > 0 ? turf.area(hexGrid.features[0]) / 1e6 : 1;

  const brandFilter = new Set([brand]);
  const maxSearchRadiusKm = 6;

  hexGrid.features.forEach(hex => {
    const [cx, cy] = getHexCentroid(hex);
    hex._cx = cx;
    hex._cy = cy;
    hex.properties._cx = cx;
    hex.properties._cy = cy;
    hex.properties.brand = brand;

    const estPop = fastEstimatePopulation(hexAreaKm2, cx, cy);
    const nearbyStores = getNearbyStoresForHex(cx, cy, maxSearchRadiusKm, brandFilter, null);
    const coverage = computeCoverageFromNearbyStores(cx, cy, estPop, hexAreaKm2, nearbyStores);
    const regionName = fastRegionLookup(cx, cy);
    const threshold = getBrandCoverageThreshold(brand);

    hex.properties.estPop = estPop;
    hex.properties.areaKm2 = hexAreaKm2;
    hex.properties.coveragePct = coverage.coveragePct || 0;
    hex.properties.coveredPop = coverage.coveredPop || 0;
    hex.properties.coveredAreaKm2 = coverage.coveredAreaKm2 || 0;
    hex.properties.overlapIndex = coverage.overlapIndex || 0;
    hex.properties.weightedRadiusKm = coverage.weightedRadiusKm || 0;
    hex.properties.contributingStores = coverage.contributingStores || 0;
    hex.properties.rawScore = coverage.rawScore || 0;
    hex.properties.brandCounts = coverage.brandCounts || {};
    hex.properties.confidence = getCoverageConfidence(
      coverage.contributingStores || 0,
      estPop,
      regionName
    );
    hex.properties.isCovered = (coverage.coveragePct || 0) >= threshold;
    hex.properties.threshold = threshold;
  });

  return {
    features: hexGrid.features,
    featureMode: "hex"
  };
}

function classifyCoverageState(baseCovered, compareCovered) {
  if (baseCovered && compareCovered) return "shared";
  if (compareCovered) return "compareOnly";
  if (baseCovered) return "baseOnly";
  return "none";
}

function buildCompareHexLayer(baseHexes, compareBrand, bounds, cellSize) {
  if (state.compareHexLayer) {
    state.compareHexLayer.remove();
    state.compareHexLayer = null;
  }

  if (!isCoverageCompareMode() || !compareBrand || !state.baseBrand) return;

  const { features: compareFeatures } = buildBrandCoverageFeatures(compareBrand, bounds, cellSize);

  const compareIndex = new Map();
  compareFeatures.forEach(f => {
    const key = `${f.properties._cx.toFixed(5)}|${f.properties._cy.toFixed(5)}`;
    compareIndex.set(key, f);
  });

  const overlayFeatures = [];

  baseHexes.forEach(baseHex => {
    const key = `${baseHex.properties._cx.toFixed(5)}|${baseHex.properties._cy.toFixed(5)}`;
    const compareHex = compareIndex.get(key);

    const baseCovered = !!baseHex.properties.isCovered;
    const compareCovered = !!(compareHex && compareHex.properties.isCovered);
    const coverState = classifyCoverageState(baseCovered, compareCovered);

    if (coverState === "none" || coverState === "baseOnly") return;

    const source = compareHex || baseHex;
    const clone = JSON.parse(JSON.stringify(source));
    clone.properties.coverState = coverState;
    clone.properties.baseCoveragePct = baseHex.properties.coveragePct || 0;
    clone.properties.compareCoveragePct = compareHex?.properties.coveragePct || 0;
    clone.properties.baseCoveredPop = baseHex.properties.coveredPop || 0;
    clone.properties.compareCoveredPop = compareHex?.properties.coveredPop || 0;
    clone.properties.baseConfidence = baseHex.properties.confidence || 0;
    clone.properties.compareConfidence = compareHex?.properties.confidence || 0;

    overlayFeatures.push(clone);
  });

  state.compareHexLayer = L.geoJSON(
    { type: "FeatureCollection", features: overlayFeatures },
    {
      style: f => {
        const inRegion = !state.selectedRegion || fastRegionLookup(f.properties._cx, f.properties._cy) === state.selectedRegion;
        if (!inRegion) {
          return {
            fillColor: "transparent",
            fillOpacity: 0,
            color: "transparent",
            weight: 0,
            opacity: 0
          };
        }
        const s = f.properties.coverState;
        if (s === "shared") {
          return {
            fillColor: COMPARE_LAYER_STYLE.sharedFill,
            color: "transparent",
            weight: 0,
            fillOpacity: 1,
            opacity: 1
          };
        }
        if (s === "compareOnly") {
          return {
            fillColor: COMPARE_LAYER_STYLE.compareOnlyFill,
            color: "transparent",
            weight: 0,
            fillOpacity: 1,
            opacity: 1
          };
        }
        return {
          fillColor: "transparent",
          color: "transparent",
          weight: 0,
          fillOpacity: 0,
          opacity: 0
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const stateLabel =
          p.coverState === "shared" ? "Shared coverage" :
          p.coverState === "compareOnly" ? `${state.compareBrand} only` :
          `${state.baseBrand} only`;

        layer.bindTooltip(
          `${stateLabel}<br>` +
          `${state.baseBrand}: ${fmtPct(p.baseCoveragePct || 0)}<br>` +
          `${state.compareBrand}: ${fmtPct(p.compareCoveragePct || 0)}<br>` +
          `${state.baseBrand} pop: ~${fmtInt(Math.round(p.baseCoveredPop || 0))}<br>` +
          `${state.compareBrand} pop: ~${fmtInt(Math.round(p.compareCoveredPop || 0))}`,
          { sticky: true }
        );
      }
    }
  ).addTo(state.map);

  state.compareHexLayer.bringToFront();
}

// ── Honeycomb layer (optimized) ──
function buildHexLayer() {
  if (state.hexLayer) {
    state.hexLayer.remove();
    state.hexLayer = null;
  }
  if (!state.map || state.country !== "england") return;

  const t0 = performance.now();
  const zoom = state.map.getZoom();
  const cellSize = cellSizeForZoom(zoom);
  const selected = selectedArr();
  const activeBrands = getActiveMapBrands();
  const isHeatmap = state.heatmapMode && state.primaryBrand;

  if (isHeatmap && state.compareHexLayer) {
    state.compareHexLayer.remove();
    state.compareHexLayer = null;
  }

  const bounds = state.map.getBounds().pad(0.15);
  const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
  const brandFilter = new Set(activeBrands);
  const locations = getPointsInBounds(bounds, brandFilter, null);

  if (isHeatmap) {
    const hexGrid = turf.hexGrid(bbox, cellSize, { units: "kilometers" });
    const hexAreaKm2 = hexGrid.features.length > 0 ? turf.area(hexGrid.features[0]) / 1e6 : 1;
    const hexPoints = binPointsToHexes(hexGrid, locations);

    const competitors = state.compareMode === "all"
      ? state.metrics.brands.filter(b => b !== state.primaryBrand)
      : (state.secondaryBrand ? [state.secondaryBrand] : []);

    hexGrid.features.forEach((hex, i) => {
      const pts = hexPoints[i] || [];
      let primary = 0;
      let comp = 0;
      const [cx, cy] = getHexCentroid(hex);
      hex.properties._cx = cx;
      hex.properties._cy = cy;

      pts.forEach(f => {
        if (f.properties.brand === state.primaryBrand) primary++;
        else if (competitors.includes(f.properties.brand)) comp++;
      });

      const unlocW = fastEstimateUnlocated(hexAreaKm2, cx, cy, brandFilter);
      const unlocPrimary = fastEstimateUnlocated(hexAreaKm2, cx, cy, new Set([state.primaryBrand]));
      hex.properties.primary = primary;
      hex.properties.competitor = comp;
      hex.properties.total = primary + comp;
      hex.properties.unlocated = unlocW;
      hex.properties.adjustedTotal = primary + comp + unlocW;
      hex.properties.ratio = (primary + comp + unlocW) > 0
        ? (primary + unlocPrimary) / (primary + comp + unlocW)
        : NaN;
      hex.properties.estPop = fastEstimatePopulation(hexAreaKm2, cx, cy);
    });

    state._hexMaxPop = Math.max(1, ...hexGrid.features.map(h => h.properties.estPop || 0));

    state.hexLayer = L.geoJSON(
      { type: "FeatureCollection", features: hexGrid.features },
      {
        style: f => {
          if (state.selectedRegion && !isHexInSelectedRegion(f)) {
            return {
              fillColor: "transparent",
              fillOpacity: 0,
              color: "transparent",
              weight: 0,
              opacity: 0
            };
          }

          const p = f.properties;
          const maxPop = state._hexMaxPop || 1;

          if (p.total === 0) {
            const pop = p.estPop || 0;
            const t = maxPop > 0 ? Math.min(1, pop / maxPop) : 0;
            return {
              fillColor: `hsla(40,${20 + 30 * t}%,${94 - 12 * t}%,${0.08 + 0.2 * t})`,
              fillOpacity: 1,
              weight: 1,
              color: `rgba(180,140,60,${0.06 + 0.15 * t})`,
              opacity: 1
            };
          }

          return {
            fillColor: hexFillHeatmap(p.ratio),
            fillOpacity: 1,
            weight: 1,
            color: hexStrokeHeatmap(p.ratio),
            opacity: 1
          };
        }
      }
    ).addTo(state.map);

  } else {
    let maxValue = 0;
    let maxPop = 0;
    const baseBrand = selected.length === 1 ? selected[0] : null;
    state.baseBrand = baseBrand;

    if (baseBrand) {
      const { features: baseFeatures, featureMode } = buildBrandCoverageFeatures(baseBrand, bounds, cellSize);

      baseFeatures.forEach(f => {
        if (state.coverageView === "coverage") {
          f.properties.displayValue = (f.properties.coveragePct || 0) * 100;
        } else if (state.coverageView === "covered_pop") {
          f.properties.displayValue = f.properties.coveredPop || 0;
        } else if (state.coverageView === "overlap") {
          f.properties.displayValue = f.properties.overlapIndex || 0;
        } else {
          f.properties.displayValue = (f.properties.coveragePct || 0) * 100;
        }

        if (f.properties.displayValue > maxValue) maxValue = f.properties.displayValue;
        if ((f.properties.estPop || 0) > maxPop) maxPop = f.properties.estPop;
      });

      state.hexLayer = L.geoJSON(
        { type: "FeatureCollection", features: baseFeatures },
        {
          style: f => {
            if (state.selectedRegion && !isHexInSelectedRegion(f)) {
              return {
                fillColor: "transparent",
                fillOpacity: 0,
                color: "transparent",
                weight: 0,
                opacity: 0
              };
            }

            const covered = !!f.properties.isCovered;
            const fill = covered
              ? hexFillCoverageMode(
                  f.properties.displayValue,
                  maxValue,
                  state.coverageView,
                  f.properties.estPop,
                  maxPop
                )
              : COMPARE_LAYER_STYLE.noCoverageFill;

            const borderlessCovered = featureMode === "lsoa" || (f.properties.coveragePct || 0) > 0.10;

            return {
              fillColor: fill,
              fillOpacity: 1,
              weight: borderlessCovered ? 0 : 0.6,
              color: borderlessCovered ? "transparent" : COMPARE_LAYER_STYLE.noCoverageStroke,
              opacity: 1
            };
          },
          onEachFeature: (feature, layer) => {
            const p = feature.properties;
            const pop = p.estPop || 0;
            const popK = pop > 1000 ? (pop / 1000).toFixed(1) + "k" : pop;
            const coveredPopText = p.coveredPop ? fmtInt(Math.round(p.coveredPop)) : "—";
            const coverageText = p.coveragePct != null ? fmtPct(p.coveragePct) : "—";
            const overlapText = p.overlapIndex != null ? p.overlapIndex.toFixed(2) : "—";
            const radiusText = p.weightedRadiusKm ? `${p.weightedRadiusKm.toFixed(1)} km` : "—";
            const confidenceText = p.confidence >= 0.75 ? "High" : p.confidence >= 0.45 ? "Medium" : "Low";

            layer.bindTooltip(
              `${baseBrand}<br>` +
              `Pop: ~${popK}<br>` +
              `Coverage: ${coverageText}<br>` +
              `Covered pop: ~${coveredPopText}<br>` +
              `Overlap: ${overlapText}<br>` +
              `Stores contributing: ${fmtInt(p.contributingStores || 0)}<br>` +
              `Avg radius: ${radiusText}<br>` +
              `Confidence: ${confidenceText}`,
              { sticky: true }
            );
          }
        }
      ).addTo(state.map);

      if (isCoverageCompareMode() && state.compareBrand !== baseBrand) {
        buildCompareHexLayer(baseFeatures, state.compareBrand, bounds, cellSize);
      } else if (state.compareHexLayer) {
        state.compareHexLayer.remove();
        state.compareHexLayer = null;
      }

    } else {
      const hexGrid = turf.hexGrid(bbox, cellSize, { units: "kilometers" });
      const hexAreaKm2 = hexGrid.features.length > 0 ? turf.area(hexGrid.features[0]) / 1e6 : 1;
      const maxSearchRadiusKm = 6;

      hexGrid.features.forEach(hex => {
        const [cx, cy] = getHexCentroid(hex);
        hex.properties._cx = cx;
        hex.properties._cy = cy;
        hex.properties.estPop = fastEstimatePopulation(hexAreaKm2, cx, cy);
        const nearbyStores = getNearbyStoresForHex(cx, cy, maxSearchRadiusKm, brandFilter, null);
        const coverage = computeCoverageFromNearbyStores(cx, cy, hex.properties.estPop, hexAreaKm2, nearbyStores);

        hex.properties.coveragePct = coverage.coveragePct || 0;
        hex.properties.coveredPop = coverage.coveredPop || 0;
        hex.properties.overlapIndex = coverage.overlapIndex || 0;
        hex.properties.contributingStores = coverage.contributingStores || 0;
        hex.properties.coveredAreaKm2 = coverage.coveredAreaKm2 || 0;
        hex.properties.isCovered = (coverage.coveragePct || 0) >= state.coverageThreshold;

        if (state.coverageView === "coverage") {
          hex.properties.displayValue = (coverage.coveragePct || 0) * 100;
        } else if (state.coverageView === "covered_pop") {
          hex.properties.displayValue = coverage.coveredPop || 0;
        } else if (state.coverageView === "overlap") {
          hex.properties.displayValue = coverage.overlapIndex || 0;
        } else {
          hex.properties.displayValue = (coverage.coveragePct || 0) * 100;
        }

        if (hex.properties.displayValue > maxValue) maxValue = hex.properties.displayValue;
        if ((hex.properties.estPop || 0) > maxPop) maxPop = hex.properties.estPop;
      });

      state.hexLayer = L.geoJSON(
        { type: "FeatureCollection", features: hexGrid.features },
        {
          style: f => {
            if (state.selectedRegion && !isHexInSelectedRegion(f)) {
              return {
                fillColor: "transparent",
                fillOpacity: 0,
                color: "transparent",
                weight: 0,
                opacity: 0
              };
            }

            const borderlessCovered = (f.properties.coveragePct || 0) > 0.10;
            return {
              fillColor: hexFillCoverageMode(
                f.properties.displayValue,
                maxValue,
                state.coverageView,
                f.properties.estPop,
                maxPop
              ),
              fillOpacity: 1,
              weight: borderlessCovered ? 0 : 0.6,
              color: borderlessCovered ? "transparent" : COMPARE_LAYER_STYLE.noCoverageStroke,
              opacity: 1
            };
          }
        }
      ).addTo(state.map);

      if (state.compareHexLayer) {
        state.compareHexLayer.remove();
        state.compareHexLayer = null;
      }
    }
  }

  if (state.regionsLayer) state.regionsLayer.bringToFront();
  if (state.locationsLayer) state.locationsLayer.bringToFront();
  updateLegend();
  console.log(`⚡ Coverage layer built in ${(performance.now() - t0).toFixed(0)}ms (${locations.length} points)`);
}

function updateLegend() {
  const title = document.getElementById("legendTitle");
  const scale = document.getElementById("legendScale");

  if (isCoverageCompareMode()) {
    title.textContent = `${selectedArr()[0]} vs ${state.compareBrand}`;
    scale.innerHTML = `
      <span class="legend-block" style="background:${COMPARE_LAYER_STYLE.compareOnlyFill}"></span><span>Compare only</span>
      <span class="legend-block" style="background:${COMPARE_LAYER_STYLE.sharedFill}"></span><span>Shared</span>
      <span class="legend-block" style="background:hsla(230,90%,56%,0.75)"></span><span>Base layer</span>
    `;
    return;
  }

  if (state.heatmapMode) {
    title.textContent = `${state.primaryBrand} vs competitors`;
    scale.innerHTML = `
      <span class="legend-block" style="background:#E53935"></span>
      <span class="legend-block" style="background:#FF9800"></span>
      <span class="legend-block" style="background:#FFEB3B"></span>
      <span class="legend-block" style="background:#8BC34A"></span>
      <span class="legend-block" style="background:#4CAF50"></span>
    `;
    return;
  }

  if (state.coverageView === "coverage") title.textContent = isLSOAReady() ? "LSOA coverage %" : "Coverage %";
  else if (state.coverageView === "covered_pop") title.textContent = isLSOAReady() ? "LSOA covered population" : "Covered population";
  else if (state.coverageView === "overlap") title.textContent = "Overlap";
  else title.textContent = "Coverage %";

  scale.innerHTML = `
    <span class="legend-block" style="background:hsla(230,85%,92%,0.5)"></span>
    <span class="legend-block" style="background:hsla(230,85%,80%,0.6)"></span>
    <span class="legend-block" style="background:hsla(230,88%,68%,0.7)"></span>
    <span class="legend-block" style="background:hsla(230,90%,56%,0.75)"></span>
    <span class="legend-block" style="background:hsla(230,95%,38%,0.85)"></span>
  `;
}

// ── Location markers — show at zoom >= 11 even without region ──
function rebuildLocationsLayer() {
  if (state.locationsLayer) {
    state.locationsLayer.remove();
    state.locationsLayer = null;
  }
  if (state.country !== "england") return;

  const activeBrands = getActiveMapBrands();
  const brandSet = new Set(activeBrands);
  const cityFilter = state.selectedCity;
  const effectiveRegionFilter = state.selectedRegion || null;
  const zoom = state.map.getZoom();

  let feats;
  if (!effectiveRegionFilter && !cityFilter) {
    feats = getPointsInBounds(state.map.getBounds().pad(0.2), brandSet, null);
  } else if (zoom >= 11 && !effectiveRegionFilter) {
    feats = getPointsInBounds(state.map.getBounds().pad(0.05), brandSet, null);
  } else {
    feats = getPointsInBounds(
      effectiveRegionFilter ? state.map.getBounds().pad(0.1) : state.map.getBounds().pad(0.08),
      brandSet,
      effectiveRegionFilter
    );

    if (cityFilter) {
      const cityFeats = feats.filter(
        f => (f.properties.city || "").trim().toLowerCase() === cityFilter.toLowerCase()
      );
      if (cityFeats.length >= 1) feats = cityFeats;
    }
  }

  // Always show some locations on national view
  if (feats.length === 0) return;

  const maxMarkers = zoom < 9 ? 6000 : zoom < 11 ? 8000 : 5000;
  const displayFeats = feats.length > maxMarkers ? feats.slice(0, maxMarkers) : feats;

  const dotRadius = zoom >= 13 ? 6 : zoom >= 11 ? 4 : zoom >= 9 ? 2.5 : 1.5;
  const dotWeight = zoom >= 11 ? 1.5 : 0.5;

  // Use Canvas renderer for much better performance with thousands of markers
  if (!state._canvasRenderer) {
    state._canvasRenderer = L.canvas({ padding: 0.5 });
  }

  const selected = selectedArr();
  const baseBrand = selected.length === 1 ? selected[0] : null;
  const compareBrand = isCoverageCompareMode() ? state.compareBrand : null;

  state.locationsLayer = L.geoJSON(
    { type: "FeatureCollection", features: displayFeats },
    {
      renderer: state._canvasRenderer,
      pointToLayer: (feature, latlng) => {
        const brand = feature.properties.brand;

        const isBase = baseBrand && brand === baseBrand;
        const isCompare = compareBrand && brand === compareBrand;

        return L.circleMarker(latlng, {
          radius: dotRadius,
          weight: dotWeight,
          color: "#fff",
          opacity: zoom >= 11 ? 1 : 0.6,
          fillColor: BRAND_COLORS[brand] || "#3B5BFE",
          fillOpacity: zoom >= 11 ? 0.9 : 0.75,
          className:
            isBase ? "marker-base" :
            isCompare ? "marker-compare" :
            "marker-default"
        });
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindPopup(
          `<strong>${p.brand}</strong><br/>${p.name || ""}<br/><span style=\"color:#6b7394\">${p.city || \"\"} ${p.postcode || \"\"}</span>`
        );
      }
    }
  ).addTo(state.map);
  state.locationsLayer.bringToFront();
}

// ── Refresh ──
function refreshBrandCounts() {
  const allCount = document.querySelector('.brand-count[data-brand="__all__"]');
  if (allCount) {
    allCount.textContent = fmtInt(
      Object.values(state.metrics.brand_totals || {}).reduce((a, b) => a + b, 0)
    );
  }

  document.querySelectorAll(".brand-pill").forEach(el => {
    const name = el.dataset.brand;
    if (!name) return;
    const countEl = el.querySelector(".brand-count");
    countEl.textContent = fmtInt(state.metrics.brand_totals[name] || 0);
  });
}

function refreshAll() {
  if (state.country !== "england") return;
  const selected = selectedArr();
  if (!state.heatmapMode && selected.length === 1 && state.coverageView === "overlap") {
    // overlap is less useful for one-chain view; fall back to coverage
    state.coverageView = "coverage";
    const coverageViewSelect = document.getElementById("coverageViewSelect");
    if (coverageViewSelect) coverageViewSelect.value = "coverage";
  }
  buildHexLayer();
  refreshKPIs();
  refreshBrandCounts();
  rebuildLocationsLayer();
  renderGreatBritainSummary();
  renderRegionTable();
}

function buildCityRowsForRegion(region) {
  const activeBrands = getActiveMapBrands();
  const features = state.locationsGeojson.features.filter(f => f.properties.region === region);

  const cityMap = {};
  features.forEach(f => {
    const city = (f.properties.city || "Unknown").trim();
    const brand = f.properties.brand;
    if (!activeBrands.includes(brand)) return;

    if (!cityMap[city]) {
      cityMap[city] = { city, brandCounts: {}, total: 0 };
    }

    cityMap[city].brandCounts[brand] = (cityMap[city].brandCounts[brand] || 0) + 1;
    cityMap[city].total += 1;
  });

  const regionArea = getRegionArea(region);
  const regionPop = getRegionPopulation(region);
  const regionTotalStores = activeBrands.reduce(
    (s, b) => s + ((state.metrics.region_brand_counts?.[region]?.[b]) || 0),
    0
  ) || 1;

  const rows = Object.values(cityMap).map(row => {
    const approxArea = (row.total / regionTotalStores) * regionArea;
    const approxPop = (row.total / regionTotalStores) * regionPop;
    const density = approxArea > 0 ? row.total / (approxArea / 1000) : 0;
    const diversity = Object.keys(row.brandCounts).length;
    const coverage = computeCoverageMetrics(
      row.total,
      approxArea,
      approxPop,
      diversity,
      density,
      row.brandCounts
    );

    row.approxArea = approxArea;
    row.approxPop = approxPop;
    row.coveredPop = coverage.coveredPop || 0;
    row.coveragePct = coverage.coveragePct || 0;
    row.overlapIndex = coverage.overlapIndex || 0;
    row.efficiency = row.total > 0 ? row.coveredPop / row.total : 0;
    row.confidence = row.total >= 4 ? "High" : row.total >= 2 ? "Medium" : "Low";
    return row;
  });

  rows.sort((a, b) => b.coveredPop - a.coveredPop || b.total - a.total);
  return rows;
}

function safeBrandValue(map, brand) {
  return (map && map[brand]) || 0;
}

function formatOpportunityScore(score) {
  if (!score || score <= 0) return "—";
  if (score > 50000) return "High";
  if (score > 15000) return "Medium";
  return "Low";
}

function getCompareSummaryFromHexes() {
  if (!state.hexLayer) {
    return {
      baseOnlyPop: 0,
      compareOnlyPop: 0,
      sharedPop: 0,
      baseOnlyHexes: 0,
      compareOnlyHexes: 0,
      sharedHexes: 0
    };
  }

  const summary = {
    baseOnlyPop: 0,
    compareOnlyPop: 0,
    sharedPop: 0,
    baseOnlyHexes: 0,
    compareOnlyHexes: 0,
    sharedHexes: 0
  };

  if (!state.compareHexLayer) return summary;

  const compareSeen = new Set();

  state.compareHexLayer.eachLayer(layer => {
    const f = layer.feature;
    if (!f?.properties) return;

    const key = `${f.properties._cx}|${f.properties._cy}`;
    compareSeen.add(key);

    if (f.properties.coverState === "shared") {
      summary.sharedPop += Math.max(f.properties.baseCoveredPop || 0, f.properties.compareCoveredPop || 0);
      summary.sharedHexes += 1;
    } else if (f.properties.coverState === "compareOnly") {
      summary.compareOnlyPop += f.properties.compareCoveredPop || 0;
      summary.compareOnlyHexes += 1;
    }
  });

  state.hexLayer.eachLayer(layer => {
    const f = layer.feature;
    if (!f?.properties) return;

    const key = `${f.properties._cx}|${f.properties._cy}`;
    if (compareSeen.has(key)) return;

    if (f.properties.isCovered) {
      summary.baseOnlyPop += f.properties.coveredPop || 0;
      summary.baseOnlyHexes += 1;
    }
  });

  return summary;
}

function getCoverageSummaryFromHexes(regionName = null) {
  if (!state.hexLayer) {
    return {
      coveredPop: 0,
      coveredAreaKm2: 0,
      coveredHexes: 0,
      avgContributingStores: 0
    };
  }

  let coveredPop = 0;
  let coveredAreaKm2 = 0;
  let coveredHexes = 0;
  let contributingStoresSum = 0;

  state.hexLayer.eachLayer(layer => {
    const f = layer.feature;
    if (!f?.properties) return;

    const cx = f.properties._cx;
    const cy = f.properties._cy;
    if (cx == null || cy == null) return;

    const region = fastRegionLookup(cx, cy);
    if (regionName && region !== regionName) return;

    const threshold = f.properties.threshold ?? 0.10;
    const coveragePct = f.properties.coveragePct || 0;
    if (coveragePct < threshold) return;

    coveredPop += f.properties.coveredPop || 0;
    coveredAreaKm2 += f.properties.coveredAreaKm2 || 0;
    coveredHexes += 1;
    contributingStoresSum += f.properties.contributingStores || 0;
  });

  return {
    coveredPop,
    coveredAreaKm2,
    coveredHexes,
    avgContributingStores: coveredHexes ? (contributingStoresSum / coveredHexes) : 0
  };
}

function refreshKPIs() {
  const selected = selectedArr();
  const regionFilter = state.selectedRegion;

  const areaCounts = regionFilter
    ? (state.metrics.region_brand_counts[regionFilter] || {})
    : (state.metrics.brand_totals || {});

  const totalLocations = selected.reduce((s, b) => s + (areaCounts[b] || 0), 0);

  const population = regionFilter
    ? getRegionPopulation(regionFilter)
    : Object.values(state.metrics.region_population_2023 || {}).reduce((s, v) => s + v, 0);

  if (isCoverageCompareMode()) {
    const compareSummary = getCompareSummaryFromHexes();
    const baseOnly = compareSummary.baseOnlyPop;
    const compareOnly = compareSummary.compareOnlyPop;
    const shared = compareSummary.sharedPop;
    const advantage = baseOnly - compareOnly;
    const advantageLabel = advantage >= 0 ? `${selected[0]} advantage` : `${state.compareBrand} advantage`;

    document.getElementById("kpiTotal").textContent = baseOnly ? fmtInt(Math.round(baseOnly)) : "—";
    document.getElementById("kpiRegions").textContent = compareOnly ? fmtInt(Math.round(compareOnly)) : "—";
    document.getElementById("kpiDense").textContent = shared ? fmtInt(Math.round(shared)) : "—";
    document.getElementById("kpiLondonShare").textContent = fmtInt(Math.round(Math.abs(advantage)));

    document.querySelector("#kpiTotal + .rp-kpi-label").textContent = "Base-only pop";
    document.querySelector("#kpiRegions + .rp-kpi-label").textContent = "Compare-only pop";
    document.querySelector("#kpiDense + .rp-kpi-label").textContent = "Shared pop";
    document.querySelector("#kpiLondonShare + .rp-kpi-label").textContent = advantageLabel;
    return;
  }

  const hexSummary = getCoverageSummaryFromHexes(regionFilter || null);
  const coveragePct = population > 0 ? (hexSummary.coveredPop / population) : 0;
  const efficiency = totalLocations > 0 ? (hexSummary.coveredPop / totalLocations) : null;

  document.getElementById("kpiTotal").textContent = fmtInt(totalLocations);
  document.getElementById("kpiRegions").textContent =
    hexSummary.coveredPop ? fmtInt(Math.round(hexSummary.coveredPop)) : "—";
  document.getElementById("kpiDense").textContent =
    coveragePct ? fmtPct(coveragePct) : "—";
  document.getElementById("kpiLondonShare").textContent =
    efficiency ? fmtInt(Math.round(efficiency)) : "—";

  document.querySelector("#kpiTotal + .rp-kpi-label").textContent = "Locations";
  document.querySelector("#kpiRegions + .rp-kpi-label").textContent = "Covered Population";
  document.querySelector("#kpiDense + .rp-kpi-label").textContent = "Coverage %";
  document.querySelector("#kpiLondonShare + .rp-kpi-label").textContent = "Covered Pop / Location";
}

function computeCoverageMetrics(total, areaKm2, population, diversity, densityPer1000, brandCounts = {}) {
  if (!areaKm2 || !population) {
    return {
      coveredPop: null,
      coveragePct: null,
      overlapIndex: null,
      weightedRadiusKm: null,
      coveredAreaKm2: null,
      exclusivePct: null,
      sharedPct: null
    };
  }

  const popDensity = population / areaKm2;
  const brands = Object.keys(brandCounts).filter(b => (brandCounts[b] || 0) > 0);

  if (brands.length === 0) {
    if (!total) {
      return {
        coveredPop: 0,
        coveragePct: 0,
        overlapIndex: 0,
        weightedRadiusKm: 0,
        coveredAreaKm2: 0,
        exclusivePct: 0,
        sharedPct: 0
      };
    }

    const urbanFactor = popDensity >= 3000 ? 0.75 : popDensity >= 800 ? 0.95 : 1.1;
    const intensityFactor = Math.min(1.3, 1 + (densityPer1000 / 450));
    const radiusKm = Math.max(1.6, Math.min(4.8, 3.2 * urbanFactor / intensityFactor));
    const rawCoveredArea = total * Math.PI * radiusKm * radiusKm;
    const overlapPenalty = Math.min(0.55, Math.max(0, (total - 1) * 0.05 + Math.max(0, diversity - 1) * 0.07));
    const effectiveCoveredArea = Math.min(areaKm2, rawCoveredArea * (1 - overlapPenalty * 0.5));
    const coveragePct = Math.max(0, Math.min(1, effectiveCoveredArea / areaKm2));
    const sharedPct = Math.max(0, Math.min(1, overlapPenalty));

    return {
      coveredPop: population * coveragePct,
      coveragePct,
      overlapIndex: sharedPct,
      weightedRadiusKm: radiusKm,
      coveredAreaKm2: effectiveCoveredArea,
      exclusivePct: Math.max(0, coveragePct * (1 - sharedPct)),
      sharedPct
    };
  }

  let rawCoveredArea = 0;
  let weightedRadiusNumerator = 0;
  let weightedStoreCount = 0;

  brands.forEach(brand => {
    const count = brandCounts[brand] || 0;
    const profile = DELIVERY_PROFILE[brand] || { weight: 1.0 };
    const radiusKm = getRadiusForBrand(brand, popDensity);
    const brandWeight = profile.weight || 1.0;

    rawCoveredArea += count * Math.PI * radiusKm * radiusKm * brandWeight;
    weightedRadiusNumerator += radiusKm * count;
    weightedStoreCount += count;
  });

  const weightedRadiusKm = weightedStoreCount ? (weightedRadiusNumerator / weightedStoreCount) : 0;
  const storeCrowding = Math.max(0, total - 1) * 0.045;
  const diversityCrowding = Math.max(0, diversity - 1) * 0.08;
  const densityCrowding = Math.min(0.22, densityPer1000 / 1300);
  const overlapPenalty = Math.min(0.68, storeCrowding + diversityCrowding + densityCrowding);
  const effectiveCoveredArea = Math.min(areaKm2, rawCoveredArea * (1 - overlapPenalty * 0.52));
  const coveragePct = Math.max(0, Math.min(1, effectiveCoveredArea / areaKm2));
  const sharedPct = Math.max(0, Math.min(1, overlapPenalty));

  return {
    coveredPop: population * coveragePct,
    coveragePct,
    overlapIndex: sharedPct,
    weightedRadiusKm,
    coveredAreaKm2: effectiveCoveredArea,
    exclusivePct: Math.max(0, coveragePct * (1 - sharedPct)),
    sharedPct
  };
}

function estimateCoveredHexCount(regionName = null) {
  if (!state.hexLayer) return 0;
  let count = 0;

  state.hexLayer.eachLayer(layer => {
    const f = layer.feature;
    if (!f || !f.properties) return;
    const cx = f._cx ?? f.properties._cx ?? null;
    const cy = f._cy ?? f.properties._cy ?? null;
    const region = (cx != null && cy != null) ? fastRegionLookup(cx, cy) : null;
    if (regionName && region !== regionName) return;
    if ((f.properties.coveragePct || 0) > 0.10) count++;
  });

  return count;
}

function renderRegionTable() {
  const selected = selectedArr();
  const popByRegion = state.metrics.region_population_2023 || {};

  const rows = state.metrics.regions.map(region => {
    const counts = state.metrics.region_brand_counts[region] || {};
    const total = selected.reduce((s, b) => s + (counts[b] || 0), 0);
    const population = getRegionPopulation(region) || popByRegion[region] || 0;

    const hexSummary = getCoverageSummaryFromHexes(region);
    const coveragePct = population > 0 ? (hexSummary.coveredPop / population) : 0;
    const efficiency = total > 0 ? (hexSummary.coveredPop / total) : null;

    return {
      region,
      total,
      coveredPop: hexSummary.coveredPop,
      coveragePct,
      coveredHexes: hexSummary.coveredHexes,
      efficiency
    };
  });

  const table = document.getElementById("regionTable");

  let html = `
    <tr>
      <th>Region</th>
      <th class="num">Locations</th>
      <th class="num">Covered Pop</th>
      <th class="num">Coverage %</th>
      <th class="num">Coverage Areas</th>
      <th class="num">Covered Pop / Location</th>
    </tr>
  `;

  rows.forEach(r => {
    const isActive = r.region === state.selectedRegion;

    html += `
      <tr class="region-row ${isActive ? "active" : ""}" data-region="${r.region}">
        <td><strong>${r.region.replace(" (England)", "")}</strong></td>
        <td class="num">${fmtInt(r.total)}</td>
        <td class="num">${r.coveredPop ? fmtInt(Math.round(r.coveredPop)) : "—"}</td>
        <td class="num">${r.coveragePct ? fmtPct(r.coveragePct) : "—"}</td>
        <td class="num">${fmtInt(r.coveredHexes)}</td>
        <td class="num">${r.efficiency ? fmtInt(Math.round(r.efficiency)) : "—"}</td>
      </tr>
    `;

    if (isActive) {
      const cityRows = buildCityRowsForRegion(r.region);
      const mapBrands = getActiveMapBrands();

      if (mapBrands.length === 1) {
        const brand = mapBrands[0];
        html += `
          <tr class="region-accordion">
            <td colspan="6">
              <table class="table">
                <tr>
                  <th>City</th>
                  <th class="num">${brand} Locs</th>
                  <th class="num">Covered Pop</th>
                  <th class="num">Coverage %</th>
                  <th class="num">Covered Pop / Loc</th>
                  <th class="num">Confidence</th>
                </tr>
                ${cityRows.slice(0, 12).map(c => `
                  <tr class="city-row" data-city="${c.city}" data-region="${r.region}">
                    <td>${c.city}</td>
                    <td class="num">${fmtInt(safeBrandValue(c.brandCounts, brand))}</td>
                    <td class="num">${c.coveredPop ? fmtInt(Math.round(c.coveredPop)) : "—"}</td>
                    <td class="num">${c.coveragePct ? fmtPct(c.coveragePct) : "—"}</td>
                    <td class="num">${c.efficiency ? fmtInt(Math.round(c.efficiency)) : "—"}</td>
                    <td class="num">${c.confidence}</td>
                  </tr>
                `).join("")}
              </table>
            </td>
          </tr>
        `;
      } else if (mapBrands.length === 2) {
        const [baseBrand, compareBrand] = mapBrands;

        html += `
          <tr class="region-accordion">
            <td colspan="6">
              <table class="table">
                <tr>
                  <th>City</th>
                  <th class="num">${baseBrand.split("'")[0]} Locs</th>
                  <th class="num">${compareBrand.split("'")[0]} Locs</th>
                  <th class="num">${baseBrand.split("'")[0]} Pop</th>
                  <th class="num">${compareBrand.split("'")[0]} Pop</th>
                  <th class="num">Gap</th>
                  <th class="num">Opportunity</th>
                </tr>
                ${cityRows.slice(0, 12).map(c => {
                  const baseLocs = safeBrandValue(c.brandCounts, baseBrand);
                  const compareLocs = safeBrandValue(c.brandCounts, compareBrand);

                  const cityArea = c.approxArea || 0;
                  const cityPop = c.approxPop || 0;

                  const baseCoverage = computeCoverageMetrics(
                    baseLocs,
                    cityArea,
                    cityPop,
                    baseLocs > 0 ? 1 : 0,
                    cityArea > 0 ? baseLocs / (cityArea / 1000) : 0,
                    baseLocs > 0 ? { [baseBrand]: baseLocs } : {}
                  );

                  const compareCoverage = computeCoverageMetrics(
                    compareLocs,
                    cityArea,
                    cityPop,
                    compareLocs > 0 ? 1 : 0,
                    cityArea > 0 ? compareLocs / (cityArea / 1000) : 0,
                    compareLocs > 0 ? { [compareBrand]: compareLocs } : {}
                  );

                  const basePop = baseCoverage.coveredPop || 0;
                  const comparePop = compareCoverage.coveredPop || 0;
                  const gap = basePop - comparePop;
                  const opportunity = Math.max(0, comparePop - basePop) *
                    (1 + Math.max(0, compareLocs - baseLocs) * 0.15);

                  return `
                    <tr class="city-row" data-city="${c.city}" data-region="${r.region}">
                      <td>${c.city}</td>
                      <td class="num">${fmtInt(baseLocs)}</td>
                      <td class="num">${fmtInt(compareLocs)}</td>
                      <td class="num">${basePop ? fmtInt(Math.round(basePop)) : "—"}</td>
                      <td class="num">${comparePop ? fmtInt(Math.round(comparePop)) : "—"}</td>
                      <td class="num" style="color:${gap > 0 ? "#43A047" : gap < 0 ? "#E53935" : "var(--muted)"}">
                        ${gap === 0 ? "—" : `${gap > 0 ? "+" : ""}${fmtInt(Math.round(gap))}`}
                      </td>
                      <td class="num">${formatOpportunityScore(opportunity)}</td>
                    </tr>
                  `;
                }).join("")}
              </table>
            </td>
          </tr>
        `;
      } else {
        html += `
          <tr class="region-accordion">
            <td colspan="6">
              <table class="table">
                <tr>
                  <th>City</th>
                  <th class="num">Total Locs</th>
                  <th class="num">Covered Pop</th>
                  <th class="num">Coverage %</th>
                  <th class="num">Active Brands</th>
                </tr>
                ${cityRows.slice(0, 12).map(c => `
                  <tr class="city-row" data-city="${c.city}" data-region="${r.region}">
                    <td>${c.city}</td>
                    <td class="num">${fmtInt(c.total)}</td>
                    <td class="num">${c.coveredPop ? fmtInt(Math.round(c.coveredPop)) : "—"}</td>
                    <td class="num">${c.coveragePct ? fmtPct(c.coveragePct) : "—"}</td>
                    <td class="num">${fmtInt(Object.keys(c.brandCounts).length)}</td>
                  </tr>
                `).join("")}
              </table>
            </td>
          </tr>
        `;
      }
    }
  });

  table.innerHTML = html;

  document.querySelectorAll(".region-row").forEach(row => {
    row.onclick = () => {
      const region = row.dataset.region;
      state.selectedRegion = state.selectedRegion === region ? null : region;
      state.selectedCity = null;
      flyToRegion(state.selectedRegion);
      refreshAll();
    };
  });

  document.querySelectorAll(".city-row").forEach(row => {
    row.onclick = () => {
      const city = row.dataset.city;
      const region = row.dataset.region;
      state.selectedRegion = region;
      state.selectedCity = city;
      flyToCityOrData(city, region);
      rebuildLocationsLayer();
    };
  });
}

function renderGreatBritainSummary() {
  const selected = selectedArr();
  const populationTotal = Object.values(state.metrics.region_population_2023 || {}).reduce((s, v) => s + v, 0);
  const countsTotal = selected.reduce((s, b) => s + (state.metrics.brand_totals[b] || 0), 0);

  const hexSummary = getCoverageSummaryFromHexes();
  const coveragePct = populationTotal > 0 ? (hexSummary.coveredPop / populationTotal) : 0;
  const efficiency = countsTotal > 0 ? (hexSummary.coveredPop / countsTotal) : null;

  const table = document.getElementById("gbSummaryTable");
  table.innerHTML = `
    <tr>
      <th>Area</th>
      <th class="num">Locations</th>
      <th class="num">Covered Pop</th>
      <th class="num">Coverage %</th>
      <th class="num">Coverage Areas</th>
      <th class="num">Covered Pop / Location</th>
    </tr>
    <tr class="gb-row">
      <td><strong>Great Britain</strong></td>
      <td class="num">${fmtInt(countsTotal)}</td>
      <td class="num">${hexSummary.coveredPop ? fmtInt(Math.round(hexSummary.coveredPop)) : "—"}</td>
      <td class="num">${coveragePct ? fmtPct(coveragePct) : "—"}</td>
      <td class="num">${fmtInt(hexSummary.coveredHexes)}</td>
      <td class="num">${efficiency ? fmtInt(Math.round(efficiency)) : "—"}</td>
    </tr>
  `;

  const row = document.querySelector(".gb-row");
  if (row) {
    row.onclick = () => {
      state.selectedRegion = null;
      state.selectedCity = null;
      flyToRegion(null);
      refreshAll();
    };
  }
}

function refreshRegionPanel() {
  const clearBtn = document.getElementById("clearRegion");
  const text = document.getElementById("selectedRegionText");

  if (!state.selectedRegion) {
    text.textContent = "Region Details";
    clearBtn.classList.add("hidden");
    document.getElementById("regionEmpty").classList.remove("hidden");
    document.getElementById("regionDetails").classList.add("hidden");
    return;
  }

  text.textContent = state.selectedRegion.replace(" (England)", "");
  clearBtn.classList.remove("hidden");
  document.getElementById("regionEmpty").classList.add("hidden");
  document.getElementById("regionDetails").classList.remove("hidden");

  const region = state.selectedRegion;
  const selected = selectedArr();
  const counts = state.metrics.region_brand_counts[region] || {};
  const area = state.metrics.region_area_km2[region] || 1;

  let total = 0;
  selected.forEach(b => total += (counts[b] || 0));
  document.getElementById("regionTotal").textContent = fmtInt(total);
  document.getElementById("regionDensity").textContent = (total / (area / 1000)).toFixed(1);

  let topBrand = null, topVal = -1;
  selected.forEach(b => { const v = counts[b] || 0; if (v > topVal) { topVal = v; topBrand = b; } });
  document.getElementById("regionTopBrand").textContent = topBrand || "—";
  document.getElementById("regionTopBrandHint").textContent = total ? `${fmtPct(topVal / total)} share` : "Top Brand";

  const rows = selected.map(b => ({ brand: b, count: counts[b] || 0 })).sort((a, b) => b.count - a.count);
  document.getElementById("regionBrandTable").innerHTML = `
    <tr><th>Brand</th><th class="num">Count</th><th class="num">Share</th></tr>
    ${rows.map(r => {
      const share = total ? r.count / total : 0;
      return `<tr>
        <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:8px;height:8px"></span>${r.brand}</div></td>
        <td class="num">${fmtInt(r.count)}</td>
        <td class="num">${fmtPct(share)}</td>
      </tr>`;
    }).join("")}
  `;

  // Top cities — clickable
  const feats = state.locationsGeojson.features.filter(f => f.properties.region === region && selected.includes(f.properties.brand));
  const cityCounts = {};
  feats.forEach(f => { const c = (f.properties.city || "Unknown").trim(); cityCounts[c] = (cityCounts[c] || 0) + 1; });
  const topCities = Object.entries(cityCounts).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 10);

  const cityNullCount = Object.values(state.cityNullStores || {}).reduce((s, r) => s + r._total, 0);
  const cityNotice = cityNullCount > 0 ? `<tr><td colspan="2" style="padding:6px 8px;font-size:10px;color:var(--muted);background:var(--panel2);border-radius:6px;border:1px solid var(--border);line-height:1.4">📐 <strong>Data quality:</strong> ${cityNullCount} stores have coordinates but no city name — included in map density but excluded from city-level analysis.</td></tr>` : `<tr><td colspan="2" style="padding:6px 8px;font-size:10px;color:var(--muted);background:var(--panel2);border-radius:6px;border:1px solid var(--border);line-height:1.4">✅ <strong>Data quality:</strong> All stores have city names assigned.</td></tr>`;
  document.getElementById("regionCityTable").innerHTML = `
    ${cityNotice}
    <tr><th>City</th><th class="num">Locations</th></tr>
    ${topCities.map(r => `<tr><td><span class="city-link" data-city="${r.city}" data-region="${region}">${r.city}</span></td><td class="num">${fmtInt(r.count)}</td></tr>`).join("")}
  `;

  // Wire city clicks
  document.querySelectorAll(".city-link").forEach(el => {
    el.onclick = () => {
      const cityName = el.dataset.city;
      const cityRegion = el.dataset.region;
      state.selectedCity = cityName;
      // Try to set city select value
      const citySelect = document.getElementById("citySelect");
      if (citySelect) citySelect.value = cityName;
      // Fly to the city — first check REGION_CITIES, then use data centroid
      flyToCityOrData(cityName, cityRegion);
      rebuildLocationsLayer();
    };
  });
}

function refreshRegionList() {
  const selected = selectedArr();
  const popByRegion = state.metrics.region_population_2023 || {};
  const incomeByRegion = state.metrics.region_income_gdhi_per_head_2023 || {};
  const rows = state.metrics.regions.map(region => {
    const counts = state.metrics.region_brand_counts[region] || {};
    let total = 0;
    selected.forEach(b => total += (counts[b] || 0));
    const area = state.metrics.region_area_km2[region] || 1;
    const density = total / (area / 1000);
    const population = popByRegion[region] || null;
    const income = incomeByRegion[region] || null;
    const peoplePerStore = population && total ? population / total : null;
    return { region, total, density, population, income, peoplePerStore };
  });

  document.getElementById("regionListTable").innerHTML = `
    <tr><th>Region</th><th class="num">Locations</th><th class="num">Density</th><th class="num">People / Store</th><th class="num">Income / Head</th></tr>
    ${rows.map(r => `<tr style="${r.region === state.selectedRegion ? 'background:rgba(59,91,254,0.08);font-weight:700' : ''}">
      <td>${r.region.replace(" (England)", "")}${r.region === state.selectedRegion ? ' ←' : ''}</td>
      <td class="num">${fmtInt(r.total)}</td>
      <td class="num">${r.density.toFixed(1)}</td>
      <td class="num">${r.peoplePerStore ? fmtInt(Math.round(r.peoplePerStore)) : "—"}</td>
      <td class="num">${r.income ? fmtGBP(r.income) : "—"}</td>
    </tr>`).join("")}
  `;
}

function refreshRegionalAnalytics() {
  const selected = selectedArr();
  const rows = state.metrics.regions.map(region => {
    const counts = state.metrics.region_brand_counts[region] || {};
    let total = 0;
    selected.forEach(b => { total += (counts[b] || 0); });
    const area = state.metrics.region_area_km2[region] || 1;
    const density = total / (area / 1000);
    let topBrand = null, topCount = -1;
    selected.forEach(b => {
      const v = counts[b] || 0;
      if (v > topCount) { topCount = v; topBrand = b; }
    });
    if (total === 0) { topBrand = null; topCount = 0; }
    const topShare = total > 0 ? topCount / total : 0;
    return { region, label: region.replace(" (England)", ""), total, density, topBrand, topCount, topShare };
  });

  rows.sort((a, b) => {
    if (state.regionSort === "total") {
      return (b.total - a.total) || (b.density - a.density);
    }
    return (b.density - a.density) || (b.total - a.total);
  });

  const rankTable = document.getElementById("regionRankTable");
  rankTable.innerHTML = `
    <tr><th>#</th><th>Region</th><th class="num">Density</th><th class="num">Locations</th><th>Leader</th></tr>
    ${rows.map((r, i) => `
      <tr class="rank-row ${r.region === state.selectedRegion ? 'active' : ''}" data-region="${r.region}">
        <td style="color:var(--muted);font-weight:700">${i + 1}</td>
        <td><strong>${r.label}</strong></td>
        <td class="num">${r.density.toFixed(1)}</td>
        <td class="num">${fmtInt(r.total)}</td>
        <td>${r.topBrand ? `<div class=\"brand-dot-cell\"><span class=\"brand-dot\" style=\"background:${BRAND_COLORS[r.topBrand]||'#3B5BFE'};width:8px;height:8px\"></span>${r.topBrand} · ${fmtInt(r.topCount)}</div>` : "—"}</td>
      </tr>
    `).join("")}
  `;

  document.querySelectorAll(".rank-row").forEach(row => {
    row.onclick = () => {
      const region = row.dataset.region;
      state.selectedRegion = region;
      state.selectedCity = null;
      document.getElementById("regionSelect").value = region;
      buildCitySelect(region);
      flyToRegion(region);
      refreshAll();
    };
  });

  const focusRegion = state.selectedRegion ? rows.find(r => r.region === state.selectedRegion) : rows[0];
  if (focusRegion) {
    document.getElementById("regionKpiDensity").textContent = focusRegion.density.toFixed(1);
    document.getElementById("regionKpiTotal").textContent = fmtInt(focusRegion.total);
    document.getElementById("regionKpiLeader").textContent = focusRegion.topBrand || "—";
    document.getElementById("regionKpiLeaderHint").textContent = focusRegion.topBrand && focusRegion.total > 0
      ? `${fmtPct(focusRegion.topShare)} share`
      : "Top Brand";
  }

  const drillTitle = document.getElementById("regionDrilldownTitle");
  const drillEmpty = document.getElementById("regionDrilldownEmpty");
  const drillContent = document.getElementById("regionDrilldownContent");
  const drillClear = document.getElementById("clearRegionDeep");

  if (!state.selectedRegion) {
    drillTitle.textContent = "Region Drilldown";
    drillEmpty.classList.remove("hidden");
    drillContent.classList.add("hidden");
    if (drillClear) drillClear.classList.add("hidden");
    return;
  }

  const region = state.selectedRegion;
  drillTitle.textContent = `Region Drilldown — ${region.replace(" (England)", "")}`;
  drillEmpty.classList.add("hidden");
  drillContent.classList.remove("hidden");
  if (drillClear) drillClear.classList.remove("hidden");

  const counts = state.metrics.region_brand_counts[region] || {};
  const total = selected.reduce((s, b) => s + (counts[b] || 0), 0);
  const brandRows = selected.map(b => ({ brand: b, count: counts[b] || 0 }))
    .sort((a, b) => b.count - a.count);
  document.getElementById("regionDrilldownBrandTable").innerHTML = `
    <tr><th>Brand</th><th class="num">Count</th><th class="num">Share</th></tr>
    ${brandRows.map(r => {
      const share = total ? r.count / total : 0;
      return `<tr>
        <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:8px;height:8px\"></span>${r.brand}</div></td>
        <td class="num">${fmtInt(r.count)}</td>
        <td class="num">${fmtPct(share)}</td>
      </tr>`;
    }).join("")}
  `;

  const cityBrand = {};
  state.locationsGeojson.features.forEach(f => {
    const p = f.properties;
    if (p.region !== region || !selected.includes(p.brand)) return;
    const city = (p.city || "Unknown").trim();
    if (!cityBrand[city]) cityBrand[city] = { total: 0 };
    cityBrand[city][p.brand] = (cityBrand[city][p.brand] || 0) + 1;
    cityBrand[city].total++;
  });
  const topCities = Object.entries(cityBrand).sort((a, b) => b[1].total - a[1].total).slice(0, 10);
  const brandCols = selected.slice(0, 4);
  const cityNullCount = (state.cityNullStores && state.cityNullStores[region] ? state.cityNullStores[region]._total : 0);
  const colSpan = 2 + brandCols.length;
  const cityNotice = cityNullCount > 0
    ? `<tr><td colspan=\"${colSpan}\" style=\"padding:6px 8px;font-size:10px;color:var(--muted);background:var(--panel2);border-radius:6px;border:1px solid var(--border);line-height:1.4\">📐 <strong>Data quality:</strong> ${cityNullCount} stores have coordinates but no city name — included in map density but excluded from city-level analysis.</td></tr>`
    : `<tr><td colspan=\"${colSpan}\" style=\"padding:6px 8px;font-size:10px;color:var(--muted);background:var(--panel2);border-radius:6px;border:1px solid var(--border);line-height:1.4\">✅ <strong>Data quality:</strong> All stores have city names assigned.</td></tr>`;
  document.getElementById("regionDrilldownCityTable").innerHTML = `
    ${cityNotice}
    <tr><th>City</th>${brandCols.map(b => `<th class="num" style="color:${BRAND_COLORS[b]}">${b.split("'")[0]}</th>`).join("")}<th class="num">Total</th></tr>
    ${topCities.map(([city, data]) => `<tr>
      <td><span class="city-link" data-city="${city}" data-region="${region}">${city}</span></td>
      ${brandCols.map(b => `<td class="num">${data[b] || 0}</td>`).join("")}
      <td class="num" style="font-weight:700">${data.total}</td>
    </tr>`).join("")}
  `;

  document.querySelectorAll(".city-link").forEach(el => {
    el.onclick = () => {
      const cityName = el.dataset.city;
      const cityRegion = el.dataset.region;
      state.selectedCity = cityName;
      const citySelect = document.getElementById("citySelect");
      if (citySelect) citySelect.value = cityName;
      flyToCityOrData(cityName, cityRegion);
      rebuildLocationsLayer();
    };
  });
}

// Enhanced city fly — falls back to calculating centroid from data
function flyToCityOrData(cityName, region) {
  if (!state.map) return;
  const cities = REGION_CITIES[region] || [];
  const city = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
  if (city) {
    state.map.flyTo([city.lat, city.lon], 13, { duration: 1 });
    return;
  }
  // Fallback: find centroid from actual data points
  const pts = state.locationsGeojson.features.filter(f =>
    (f.properties.city || "").trim().toLowerCase() === cityName.toLowerCase()
  );
  if (pts.length > 0) {
    let latSum = 0, lonSum = 0;
    pts.forEach(f => { lonSum += f.geometry.coordinates[0]; latSum += f.geometry.coordinates[1]; });
    state.map.flyTo([latSum / pts.length, lonSum / pts.length], 13, { duration: 1 });
  }
}

function refreshCompareTab() {
  const selected = selectedArr();
  const region = state.selectedRegion;
  const city = state.selectedCity;
  const regionLabel = region ? region.replace(" (England)", "") : null;
  const scopeType = city ? "city" : region ? "region" : "country";
  const scopeLabel = scopeType === "city"
    ? `${city}${regionLabel ? `, ${regionLabel}` : ""}`
    : (regionLabel || "England");
  const cityCounts = {};
  if (scopeType === "city") {
    state.locationsGeojson.features.forEach(f => {
      const p = f.properties;
      if (!region || p.region !== region) return;
      if ((p.city || "").trim().toLowerCase() !== city.toLowerCase()) return;
      if (!selected.includes(p.brand)) return;
      cityCounts[p.brand] = (cityCounts[p.brand] || 0) + 1;
    });
  }

  function brandTotal(b) {
    if (scopeType === "country") return state.metrics.brand_totals[b] || 0;
    if (scopeType === "region") return (state.metrics.region_brand_counts[region] || {})[b] || 0;
    return cityCounts[b] || 0;
  }

  const totalAll = selected.reduce((s, b) => s + brandTotal(b), 0);
  const nationalTotalAll = selected.reduce((s, b) => s + (state.metrics.brand_totals[b] || 0), 0);
  const regionTotalAll = region ? selected.reduce((s, b) => s + ((state.metrics.region_brand_counts[region] || {})[b] || 0), 0) : 0;

  // Update titles with scope context
  document.getElementById("compareDesc").textContent = scopeType === "city"
    ? `Head-to-head brand analysis in ${scopeLabel} — market share, local mix, and competitive structure.`
    : regionLabel
      ? `Head-to-head brand analysis in ${regionLabel} — market share, regional presence, and concentration stats.`
      : `Head-to-head brand analysis with market share, regional presence, and concentration stats.`;
  document.getElementById("compareShareTitle").textContent = `📊 Market Share in ${scopeLabel}`;
  document.getElementById("compareLeaderTitle").textContent = `🏆 Brand Leaderboard — ${scopeLabel}`;
  document.getElementById("compareMatrixTitle").textContent = scopeType === "city"
    ? `🗺️ City Mix — ${scopeLabel}`
    : regionLabel
      ? `🗺️ City Breakdown — ${regionLabel}`
      : `🗺️ Regional Presence Matrix`;
  document.getElementById("compareConcentrationTitle").textContent = `🎯 Concentration Analysis — ${scopeLabel}`;

  const rows = selected.map(b => {
    const total = brandTotal(b);
    const share = totalAll ? total / totalAll : 0;
    const natShare = nationalTotalAll ? (state.metrics.brand_totals[b] || 0) / nationalTotalAll : 0;
    const regionShare = regionTotalAll ? ((state.metrics.region_brand_counts[region] || {})[b] || 0) / regionTotalAll : 0;
    const regionCounts = {};
    let top1 = null;
    let regionShares = [];
    let top3Share = 0;
    let londonShare = 0;
    if (scopeType === "country") {
      const london = (state.metrics.region_brand_counts["London"] || {})[b] || 0;
      regionShares = state.metrics.regions.map(r => {
        const c = (state.metrics.region_brand_counts[r] || {})[b] || 0;
        const nationalTotal = state.metrics.brand_totals[b] || 1;
        return { region: r, label: r.replace(" (England)", ""), count: c, share: nationalTotal ? c / nationalTotal : 0 };
      }).sort((a, b) => b.count - a.count);
      top1 = regionShares[0];
      top3Share = regionShares.slice(0, 3).reduce((s, r) => s + r.count, 0) / (state.metrics.brand_totals[b] || 1);
      londonShare = (state.metrics.brand_totals[b] || 1) ? london / (state.metrics.brand_totals[b] || 1) : 0;
      state.metrics.regions.forEach(r => { regionCounts[r] = (state.metrics.region_brand_counts[r] || {})[b] || 0; });
    }
    return { brand: b, total, share, natShare, regionShare, top1, top3Share, londonShare, regionCounts, regionShares };
  }).sort((a, b) => b.total - a.total);

  // ── KPIs ──
  const leader = rows[0];
  document.getElementById("compareKpis").innerHTML = `
    <div class="rp-kpi-card"><div class="rp-kpi-value">${fmtInt(totalAll)}</div><div class="rp-kpi-label">Locations in ${scopeLabel}</div></div>
    <div class="rp-kpi-card"><div class="rp-kpi-value">${selected.length}</div><div class="rp-kpi-label">Brands Compared</div></div>
    <div class="rp-kpi-card"><div class="rp-kpi-value">${leader ? leader.brand.split("'")[0] : '—'}</div><div class="rp-kpi-label">${scopeLabel} Leader</div></div>
    <div class="rp-kpi-card"><div class="rp-kpi-value">${leader ? fmtPct(leader.share) : '—'}</div><div class="rp-kpi-label">Leader Share</div></div>
  `;

  // ── Market Share Bars ──
  const maxTotal = Math.max(...rows.map(r => r.total));
  document.getElementById("compareShareBars").innerHTML = rows.map(r => {
    const pct = maxTotal > 0 ? (r.total / maxTotal * 100) : 0;
    return `<div class="share-bar-row">
      <span class="share-bar-label">${r.brand}</span>
      <div class="share-bar-track">
        <div class="share-bar-fill" style="width:${pct}%;background:${BRAND_COLORS[r.brand] || '#3B5BFE'}">
          <span class="share-bar-value">${fmtPct(r.share)}</span>
        </div>
      </div>
      <span class="share-bar-count">${fmtInt(r.total)}</span>
    </div>`;
  }).join("");

  // ── Leaderboard Table ──
  if (scopeType === "country") {
    document.getElementById("compareTable").innerHTML = `
      <tr><th>#</th><th>Brand</th><th class="num">Total</th><th class="num">Share</th><th class="num">London %</th><th>Strongest</th></tr>
      ${rows.map((r, i) => `<tr>
        <td style="color:var(--muted);font-weight:700">${i + 1}</td>
        <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:8px;height:8px"></span><strong>${r.brand}</strong></div></td>
        <td class="num">${fmtInt(r.total)}</td>
        <td class="num">${fmtPct(r.share)}</td>
        <td class="num">${fmtPct(r.londonShare)}</td>
        <td style="font-size:11px;color:var(--muted)">${r.top1 ? `${r.top1.label} (${fmtPct(r.top1.share)})` : "—"}</td>
      </tr>`).join("")}
    `;
  } else if (scopeType === "region") {
    document.getElementById("compareTable").innerHTML = `
      <tr><th>#</th><th>Brand</th><th class="num">In ${regionLabel}</th><th class="num">Share</th><th class="num">National</th><th class="num">Vs National</th></tr>
      ${rows.map((r, i) => {
        const diff = r.share - r.natShare;
        const diffColor = diff > 0 ? '#43A047' : diff < -0.02 ? '#E53935' : 'var(--muted)';
        return `<tr>
          <td style="color:var(--muted);font-weight:700">${i + 1}</td>
          <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:8px;height:8px"></span><strong>${r.brand}</strong></div></td>
          <td class="num">${fmtInt(r.total)}</td>
          <td class="num">${fmtPct(r.share)}</td>
          <td class="num" style="color:var(--muted)">${fmtPct(r.natShare)}</td>
          <td class="num" style="color:${diffColor};font-weight:700">${diff > 0 ? '+' : ''}${(diff * 100).toFixed(1)}pp</td>
        </tr>`;
      }).join("")}
    `;
  } else {
    document.getElementById("compareTable").innerHTML = `
      <tr><th>#</th><th>Brand</th><th class="num">In ${city}</th><th class="num">Share</th><th class="num">Region</th><th class="num">Vs Region</th></tr>
      ${rows.map((r, i) => {
        const diff = r.share - r.regionShare;
        const diffColor = diff > 0 ? '#43A047' : diff < -0.02 ? '#E53935' : 'var(--muted)';
        return `<tr>
          <td style="color:var(--muted);font-weight:700">${i + 1}</td>
          <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:8px;height:8px"></span><strong>${r.brand}</strong></div></td>
          <td class="num">${fmtInt(r.total)}</td>
          <td class="num">${fmtPct(r.share)}</td>
          <td class="num" style="color:var(--muted)">${fmtPct(r.regionShare)}</td>
          <td class="num" style="color:${diffColor};font-weight:700">${diff > 0 ? '+' : ''}${(diff * 100).toFixed(1)}pp</td>
        </tr>`;
      }).join("")}
    `;
  }

  // ── Regional Presence Matrix / City Breakdown ──
  if (scopeType === "region") {
    // Show city breakdown for this region instead of regional matrix
    const cityData = {};
    state.locationsGeojson.features.forEach(f => {
      const p = f.properties;
      if (p.region !== region) return;
      if (!selected.includes(p.brand)) return;
      const city = (p.city || "Unknown").trim();
      if (!cityData[city]) cityData[city] = { total: 0 };
      if (!cityData[city][p.brand]) cityData[city][p.brand] = 0;
      cityData[city][p.brand]++;
      cityData[city].total++;
    });
    const topCities = Object.entries(cityData).sort((a, b) => b[1].total - a[1].total).slice(0, 12);
    const cityRows = topCities.map(([city, data]) => {
      const cells = selected.map(b => {
        const c = data[b] || 0;
        const intensity = data.total > 0 ? c / data.total : 0;
        const bg = intensity > 0.3 ? 'rgba(67,160,71,0.2)' : intensity > 0.15 ? 'rgba(255,152,0,0.15)' : c > 0 ? 'rgba(59,91,254,0.1)' : 'transparent';
        return `<td><span class="cell-heat" style="background:${bg}">${c}</span></td>`;
      });
      return `<tr><td><strong>${city}</strong></td>${cells.join("")}<td class="num" style="font-weight:700">${data.total}</td></tr>`;
    });
    const cityNullCount2 = Object.values(state.cityNullStores || {}).reduce((s, r) => s + r._total, 0);
    const cityNotice2 = cityNullCount2 > 0 ? `<div style="font-size:10px;color:var(--muted);padding:4px 8px;background:var(--panel2);border-radius:6px;border:1px solid var(--border);margin-bottom:8px;line-height:1.4">📐 <strong>Data quality:</strong> ${cityNullCount2} stores have coordinates but no city name — included in map density but excluded from city-level analysis.</div>` : `<div style="font-size:10px;color:var(--muted);padding:4px 8px;background:var(--panel2);border-radius:6px;border:1px solid var(--border);margin-bottom:8px;line-height:1.4">✅ <strong>Data quality:</strong> All stores have city names assigned.</div>`;
    document.getElementById("compareMatrix").innerHTML = `
      ${cityNotice2}
      <table class="table">
        <tr><th>City</th>${selected.map(b => `<th><span style="color:${BRAND_COLORS[b]||'#3B5BFE'}">${b.split("'")[0]}</span></th>`).join("")}<th>Total</th></tr>
        ${cityRows.join("")}
      </table>
    `;
  } else if (scopeType === "country") {
    const shortRegions = state.metrics.regions.map(r => r.replace(" (England)", "").replace("Yorkshire and The Humber", "Yorks"));
    const matrixRows = rows.map(r => {
      const cells = state.metrics.regions.map(reg => {
        const c = r.regionCounts[reg] || 0;
        const regTotal = state.metrics.region_totals[reg] || 1;
        const intensity = c / regTotal;
        const bg = intensity > 0.25 ? 'rgba(67,160,71,0.2)' : intensity > 0.15 ? 'rgba(255,152,0,0.15)' : intensity > 0.05 ? 'rgba(59,91,254,0.1)' : 'transparent';
        const color = intensity > 0.25 ? '#2E7D32' : intensity > 0.15 ? '#E65100' : 'var(--text)';
        return `<td><span class="cell-heat" style="background:${bg};color:${color}">${c}</span></td>`;
      });
      return `<tr><td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:6px;height:6px"></span>${r.brand}</div></td>${cells.join("")}</tr>`;
    });
    document.getElementById("compareMatrix").innerHTML = `
      <table class="table">
        <tr><th></th>${shortRegions.map(r => `<th>${r}</th>`).join("")}</tr>
        ${matrixRows.join("")}
      </table>
    `;
  } else {
    const cityRows = rows.map(r => `<tr>
      <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:7px;height:7px"></span>${r.brand}</div></td>
      <td class="num">${fmtInt(r.total)}</td>
      <td class="num">${fmtPct(r.share)}</td>
    </tr>`).join("");
    document.getElementById("compareMatrix").innerHTML = `
      <table class="table">
        <tr><th>Brand</th><th class="num">Count</th><th class="num">Share</th></tr>
        ${cityRows}
      </table>
    `;
  }

  // ── Concentration Analysis ──
  if (scopeType === "country") {
    document.getElementById("compareConcentration").innerHTML = `
      <tr><th>Brand</th><th class="num">Top 3 Regions %</th><th class="num">London Lean</th><th>Profile</th></tr>
      ${rows.map(r => {
        const profile = r.top3Share > 0.55 ? 'Concentrated' : r.top3Share > 0.45 ? 'Balanced' : 'Distributed';
        const profileColor = profile === 'Concentrated' ? '#E53935' : profile === 'Balanced' ? '#FF9800' : '#43A047';
        return `<tr>
          <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:8px;height:8px"></span>${r.brand}</div></td>
          <td class="num">${fmtPct(r.top3Share)}</td>
          <td class="num">${r.londonShare > 0.2 ? '🔥 High' : r.londonShare > 0.12 ? '⚡ Medium' : '✅ Low'}</td>
          <td><span style="color:${profileColor};font-weight:700;font-size:11px">${profile}</span></td>
        </tr>`;
      }).join("")}
    `;
  } else {
    const benchmarkLabel = scopeType === "city" ? "Vs Region" : "Vs National";
    document.getElementById("compareConcentration").innerHTML = `
      <tr><th>Brand</th><th class="num">Share</th><th class="num">${benchmarkLabel}</th><th>Position</th></tr>
      ${rows.map(r => {
        const diff = scopeType === "city" ? (r.share - r.regionShare) : (r.share - r.natShare);
        const position = r === leader ? "Leader" : r.share > 0.2 ? "Strong" : "Challenger";
        const diffColor = diff > 0 ? '#43A047' : diff < -0.02 ? '#E53935' : 'var(--muted)';
        return `<tr>
          <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:8px;height:8px"></span>${r.brand}</div></td>
          <td class="num">${fmtPct(r.share)}</td>
          <td class="num" style="color:${diffColor};font-weight:700">${diff > 0 ? '+' : ''}${(diff * 100).toFixed(1)}pp</td>
          <td><span style="font-weight:700;font-size:11px">${position}</span></td>
        </tr>`;
      }).join("")}
    `;
  }

  // ── Key Insights (auto-generated, region-aware) ──
  const insights = [];
  if (leader) {
    const leadScope = scopeType === "country" ? "" : `in ${scopeLabel}`;
    const strongest = scopeType === "country" && leader.top1 ? `, strongest in ${leader.top1.label}` : "";
    insights.push(`<div class="insight-card"><span class="insight-icon">👑</span><strong>${leader.brand}</strong> leads ${leadScope} with ${fmtInt(leader.total)} locations (${fmtPct(leader.share)} share)${strongest}.</div>`);
  }
  const smallest = rows[rows.length - 1];
  if (smallest && rows.length > 1) {
    const scopeText = scopeType === "country" ? "" : ` in ${scopeLabel}`;
    insights.push(`<div class="insight-card"><span class="insight-icon">📉</span><strong>${smallest.brand}</strong> has the smallest footprint${scopeText} at ${fmtInt(smallest.total)} locations.</div>`);
  }
  if (scopeType === "country") {
    const highLondon = rows.filter(r => r.londonShare > 0.18);
    if (highLondon.length > 0) {
      insights.push(`<div class="insight-card"><span class="insight-icon">🏙️</span>${highLondon.map(r => `<strong>${r.brand}</strong>`).join(" and ")} have high London concentration (${highLondon.map(r => fmtPct(r.londonShare)).join(", ")} of their total footprint).</div>`);
    }
  }
  if (scopeType === "region") {
    // Region-specific insight: who's over/under-indexed here
    rows.forEach(r => {
      const diff = r.share - r.natShare;
      if (diff > 0.03) {
        insights.push(`<div class="insight-card"><span class="insight-icon">📈</span><strong>${r.brand}</strong> is above national share in ${regionLabel} by +${(diff * 100).toFixed(1)}pp.</div>`);
      } else if (diff < -0.03) {
        insights.push(`<div class="insight-card"><span class="insight-icon">📉</span><strong>${r.brand}</strong> is below national share in ${regionLabel} by ${(diff * 100).toFixed(1)}pp.</div>`);
      }
    });
  }
  if (scopeType === "city") {
    rows.forEach(r => {
      const diff = r.share - r.regionShare;
      if (diff > 0.05) {
        insights.push(`<div class="insight-card"><span class="insight-icon">📈</span><strong>${r.brand}</strong> over-indexes in ${city} vs region by +${(diff * 100).toFixed(1)}pp.</div>`);
      } else if (diff < -0.05) {
        insights.push(`<div class="insight-card"><span class="insight-icon">📉</span><strong>${r.brand}</strong> under-indexes in ${city} vs region by ${(diff * 100).toFixed(1)}pp.</div>`);
      }
    });
  }
  document.getElementById("compareInsights").innerHTML = insights.join("");

  // ── Region Deep Dive (extra data when region selected) ──
  refreshCompareRegionDeep(rows, scopeType, region, regionLabel, city);
}

function refreshCompareRegionDeep(rows, scopeType, region, regionLabel, city) {
  const section = document.getElementById("compareRegionDeepDive");
  if (!region) { section.style.display = "none"; return; }
  section.style.display = "block";
  if (scopeType === "city") {
    document.getElementById("compareRegionDeepTitle").textContent = `📍 City Deep Dive — ${city}, ${regionLabel}`;
  } else {
    document.getElementById("compareRegionDeepTitle").textContent = `📍 Deep Dive — ${regionLabel}`;
  }

  const selected = selectedArr();
  if (scopeType === "city") {
    const regionTotalAll = selected.reduce((s, b) => s + ((state.metrics.region_brand_counts[region] || {})[b] || 0), 0);
    const totalInCity = rows.reduce((s, r) => s + r.total, 0);
    const shareOfRegion = regionTotalAll ? totalInCity / regionTotalAll : 0;
    document.getElementById("compareRegionDeepContent").innerHTML = `
      <div class="rp-kpi-grid compact" style="margin-bottom:12px">
        <div class="rp-kpi-card small"><div class="rp-kpi-value">${fmtInt(totalInCity)}</div><div class="rp-kpi-label">Total Stores</div></div>
        <div class="rp-kpi-card small"><div class="rp-kpi-value">${fmtPct(shareOfRegion)}</div><div class="rp-kpi-label">Share of Region</div></div>
        <div class="rp-kpi-card small"><div class="rp-kpi-value">${rows.length}</div><div class="rp-kpi-label">Active Brands</div></div>
      </div>
      <div class="rp-table-title" style="margin-top:8px">🏙️ Brand Mix — ${city}</div>
      <table class="table">
        <tr><th>Brand</th><th class="num">Count</th><th class="num">Share</th></tr>
        ${rows.map(r => `<tr>
          <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:7px;height:7px"></span>${r.brand}</div></td>
          <td class="num">${fmtInt(r.total)}</td>
          <td class="num">${fmtPct(r.share)}</td>
        </tr>`).join("")}
      </table>
    `;
    return;
  }

  const area = state.metrics.region_area_km2[region] || 1;
  const totalInRegion = rows.reduce((s, r) => s + r.total, 0);
  const density = totalInRegion / (area / 1000);

  // Nearby regions for context
  const allRegionTotals = state.metrics.regions.map(r => {
    const t = selected.reduce((s, b) => s + ((state.metrics.region_brand_counts[r] || {})[b] || 0), 0);
    return { region: r, label: r.replace(" (England)", ""), total: t, density: t / ((state.metrics.region_area_km2[r] || 1) / 1000) };
  }).sort((a, b) => b.density - a.density);

  const thisRank = allRegionTotals.findIndex(r => r.region === region) + 1;

  // Per-brand gap analysis: how does each brand perform here vs their national avg
  const natTotalAll = state.metrics.brands.reduce((s, b) => s + (state.metrics.brand_totals[b] || 0), 0);
  const gapRows = rows.map(r => {
    const natShare = (state.metrics.brand_totals[r.brand] || 0) / natTotalAll;
    const localShare = r.share;
    const gap = localShare - natShare;
    const verdict = gap > 0.03 ? '🟢 Over-indexed' : gap < -0.03 ? '🔴 Under-indexed' : '🟡 In-line';
    return { brand: r.brand, total: r.total, localShare, natShare, gap, verdict };
  });

  // Top cities in this region with brand breakdown
  const cityBrand = {};
  state.locationsGeojson.features.forEach(f => {
    const p = f.properties;
    if (p.region !== region || !selected.includes(p.brand)) return;
    const city = (p.city || "Unknown").trim();
    if (!cityBrand[city]) cityBrand[city] = { total: 0 };
    cityBrand[city][p.brand] = (cityBrand[city][p.brand] || 0) + 1;
    cityBrand[city].total++;
  });
  const topCities = Object.entries(cityBrand).sort((a, b) => b[1].total - a[1].total).slice(0, 5);

  document.getElementById("compareRegionDeepContent").innerHTML = `
    <div class="rp-kpi-grid compact" style="margin-bottom:12px">
      <div class="rp-kpi-card small"><div class="rp-kpi-value">${fmtInt(totalInRegion)}</div><div class="rp-kpi-label">Total Stores</div></div>
      <div class="rp-kpi-card small"><div class="rp-kpi-value">${density.toFixed(1)}</div><div class="rp-kpi-label">Per 1k km²</div></div>
      <div class="rp-kpi-card small"><div class="rp-kpi-value">#${thisRank}</div><div class="rp-kpi-label">Density Rank</div></div>
    </div>

    <div class="rp-table-title" style="margin-top:8px">📊 Brand Gap Analysis — ${regionLabel} vs National</div>
    <table class="table">
      <tr><th>Brand</th><th class="num">Local</th><th class="num">Local %</th><th class="num">National %</th><th class="num">Gap</th><th>Status</th></tr>
      ${gapRows.map(r => `<tr>
        <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:7px;height:7px"></span>${r.brand}</div></td>
        <td class="num">${fmtInt(r.total)}</td>
        <td class="num">${fmtPct(r.localShare)}</td>
        <td class="num" style="color:var(--muted)">${fmtPct(r.natShare)}</td>
        <td class="num" style="color:${r.gap > 0 ? '#43A047' : r.gap < -0.02 ? '#E53935' : 'var(--muted)'};font-weight:700">${r.gap > 0 ? '+' : ''}${(r.gap * 100).toFixed(1)}pp</td>
        <td style="font-size:11px">${r.verdict}</td>
      </tr>`).join("")}
    </table>

    <div class="rp-table-title" style="margin-top:12px">🏙️ Top Cities in ${regionLabel}</div>
    <table class="table">
      <tr><th>City</th>${selected.slice(0, 4).map(b => `<th class="num" style="color:${BRAND_COLORS[b]}">${b.split("'")[0]}</th>`).join("")}<th class="num">Total</th></tr>
      ${topCities.map(([city, data]) => `<tr>
        <td><strong>${city}</strong></td>
        ${selected.slice(0, 4).map(b => `<td class="num">${data[b] || 0}</td>`).join("")}
        <td class="num" style="font-weight:700">${data.total}</td>
      </tr>`).join("")}
    </table>

    <div class="rp-table-title" style="margin-top:12px">📊 Density Ranking — All Regions</div>
    <table class="table">
      <tr><th>Region</th><th class="num">Stores</th><th class="num">Density</th></tr>
      ${allRegionTotals.map(r => `<tr style="${r.region === region ? 'background:rgba(59,91,254,0.08);font-weight:700' : ''}">
        <td>${r.label}${r.region === region ? ' ←' : ''}</td>
        <td class="num">${fmtInt(r.total)}</td>
        <td class="num">${r.density.toFixed(1)}</td>
      </tr>`).join("")}
    </table>
  `;
}

// ── Wire UI ──
function wireUI() {
  document.querySelectorAll(".sidebar-btn[data-tab]").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
  document.querySelectorAll("[data-region-sort]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-region-sort]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.regionSort = btn.dataset.regionSort;
      refreshRegionalAnalytics();
    });
  });

  // Heatmap toggle
  document.getElementById("heatmapToggle").addEventListener("change", e => {
    state.heatmapMode = e.target.checked;
    document.getElementById("heatmapSettings").classList.toggle("hidden", !state.heatmapMode);
    buildHexLayer();
    updateLegend();
  });

  document.getElementById("primaryBrandSelect").addEventListener("change", e => {
    state.primaryBrand = e.target.value;
    buildHexLayer();
  });

  document.getElementById("compareModeSelect").addEventListener("change", e => {
    state.compareMode = e.target.value;
    document.getElementById("secondaryBrandRow").classList.toggle("hidden", e.target.value !== "pick");
    buildHexLayer();
  });

  document.getElementById("secondaryBrandSelect").addEventListener("change", e => {
    state.secondaryBrand = e.target.value;
    if (!state.heatmapMode) state.compareBrand = e.target.value;
    buildHexLayer();
    rebuildLocationsLayer();
  });

  const compareToggle = document.getElementById("compareToggle");
  if (compareToggle) {
    compareToggle.addEventListener("change", e => {
      state.compareEnabled = e.target.checked;
      if (state.compareEnabled && selectedArr().length !== 1) {
        state.compareEnabled = false;
        e.target.checked = false;
      }
      buildHexLayer();
      rebuildLocationsLayer();
      updateLegend();
    });
  }

  const coverageViewSelect = document.getElementById("coverageViewSelect");
  if (coverageViewSelect) {
    coverageViewSelect.value = state.coverageView;
    coverageViewSelect.addEventListener("change", e => {
      state.coverageView = e.target.value;
      buildHexLayer();
      updateLegend();
    });
  }

}

// ── Main ──
async function main() {
  try {
    const t0 = performance.now();
    const files = await Promise.allSettled([
      loadJSON("metrics_england.json"),
      loadJSON("england_regions_simplified.geojson"),
      loadJSON("england_locations_min.geojson"),
      loadJSON("data/processed/lsoa_enriched.geojson"),
      loadJSON("data/processed/lsoa_metrics.json"),
      loadJSON("data/processed/lsoa_population_centroids.json")
    ]);

    const [metricsR, regionsR, locationsR, lsoaGeoR, lsoaMetricsR, lsoaCentroidsR] = files;

    if (metricsR.status !== "fulfilled" || regionsR.status !== "fulfilled" || locationsR.status !== "fulfilled") {
      throw new Error("Core England files failed to load.");
    }

    state.metrics = metricsR.value;
    state.regionsGeojson = regionsR.value;
    state.locationsGeojson = locationsR.value;

    if (lsoaGeoR.status === "fulfilled") state.lsoaGeojson = lsoaGeoR.value;
    if (lsoaMetricsR.status === "fulfilled") state.lsoaMetrics = lsoaMetricsR.value;
    if (lsoaCentroidsR.status === "fulfilled") state.lsoaCentroids = lsoaCentroidsR.value;

    console.log(`⚡ Data loaded in ${(performance.now() - t0).toFixed(0)}ms`);
    console.log(`📍 LSOA mode: ${isLSOAReady() ? "enabled" : "fallback to hex"}`);

    // Normalize city names to title case (e.g. "LONDON" → "London", "st. albans" → "St. Albans")
    state.locationsGeojson.features.forEach(f => {
      const city = (f.properties.city || "").trim();
      if (city) {
        f.properties.city = city.replace(/\b\w/g, c => c.toUpperCase()).replace(/\b\w+/g, (w, i) => {
          // Keep short prepositions/articles lowercase unless first word
          const lower = ['of', 'the', 'and', 'in', 'on', 'at', 'upon', 'le', 'la', 'de'];
          if (i > 0 && lower.includes(w.toLowerCase())) return w.toLowerCase();
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        });
      }
    });

    buildSpatialIndex();
    buildRegionGrid(); // Pre-compute region lookup grid
    if (isLSOAReady()) buildLSOASpatialIndex();
    computeUnlocatedStores();
    buildBrandList();
    buildBrandSelects();
    initMap();
    setCountry("england");
    wireUI();
    refreshAll();
  } catch (err) {
    console.error(err);
    alert("Failed to load data.\n\n" + err.message);
  }
}

main();
