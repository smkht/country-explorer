/* Country Explorer — vanilla JS + Leaflet + Turf.js honeycomb + heatmap + guesstimate */

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

const state = {
  selectedBrands: new Set(),
  metric: "count",
  selectedRegion: null,
  selectedCity: null,
  metrics: null,
  regionsGeojson: null,
  locationsGeojson: null,
  map: null,
  regionsLayer: null,
  locationsLayer: null,
  hexLayer: null,
  hexDebounce: null,
  heatmapMode: false,
  primaryBrand: null,
  compareMode: "all",
  secondaryBrand: null,
  country: "england",
  guesstimateMode: false,
  // Spatial index for fast viewport queries
  _pointIndex: null
};

const fmtInt = x => new Intl.NumberFormat("en-GB").format(x);
const fmtPct = x => (x * 100).toFixed(1) + "%";

async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Failed: ${path}`);
  return r.json();
}

// ── Hex colors ──
function hexFillDensity(count, max, pop, maxPop) {
  const isDensity = state.metric === "density";
  if (!max || count === 0) {
    // Tint empty cells by population density
    if (pop > 0 && maxPop > 0) {
      const t = Math.min(1, pop / maxPop);
      const hue = isDensity ? 170 : 230;
      return `hsla(${hue},30%,${94 - 10 * t}%,${0.08 + 0.18 * t})`;
    }
    return isDensity ? "hsla(170,20%,92%,0.06)" : "hsla(230,20%,92%,0.06)";
  }
  // Power curve for better spread (density values cluster more, so use sqrt)
  const raw = Math.min(1, count / max);
  const t = isDensity ? Math.pow(raw, 0.5) : Math.pow(raw, 0.7);
  if (isDensity) {
    // Teal/cyan gradient for density
    const l = 85 - 48 * t;
    const s = 70 + 20 * t;
    const a = 0.3 + 0.55 * t;
    return `hsla(170,${s}%,${l}%,${a})`;
  }
  const l = 90 - 50 * t;
  const a = 0.3 + 0.55 * t;
  return `hsla(230,85%,${l}%,${a})`;
}
function hexStrokeDensity(count, max, pop, maxPop) {
  const isDensity = state.metric === "density";
  if (!max || count === 0) {
    if (pop > 0 && maxPop > 0) {
      const t = Math.min(1, pop / maxPop);
      return isDensity ? `rgba(0,180,160,${0.06 + 0.15 * t})` : `rgba(59,91,254,${0.06 + 0.15 * t})`;
    }
    return isDensity ? "rgba(0,180,160,0.08)" : "rgba(59,91,254,0.08)";
  }
  const raw = Math.min(1, count / max);
  const t = isDensity ? Math.pow(raw, 0.5) : Math.pow(raw, 0.7);
  return isDensity ? `rgba(0,180,160,${0.08 + 0.35 * t})` : `rgba(59,91,254,${0.08 + 0.35 * t})`;
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
  if (zoom >= 14) return 0.3;
  if (zoom >= 13) return 0.5;
  if (zoom >= 12) return 0.8;
  if (zoom >= 11) return 1.2;
  if (zoom >= 10) return 2;
  if (zoom >= 9) return 3.5;
  if (zoom >= 8) return 5;
  if (zoom >= 7) return 8;
  return 15;
}

// ── Country handling ──
function setCountry(country) {
  state.country = country;
  const isEngland = country === "england";
  document.getElementById("noDataOverlay").classList.toggle("hidden", isEngland);
  document.getElementById("regionSelect").disabled = !isEngland;
  document.getElementById("mapLegend").classList.toggle("hidden", !isEngland);

  ["kpiSection", "brandsSection", "metricSection", "regionDetailSection", "heatmapSection", "guesstimateSection", "deepreviewContent"]
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
    document.getElementById("regionSelect").value = "";
    document.getElementById("citySelectorWrap").style.display = "none";
  }
}

// ── Tab switching ──
function setTab(tab) {
  document.querySelectorAll(".sidebar-btn[data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".rp-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.getElementById("overviewContent").classList.toggle("hidden", tab !== "overview");
  document.getElementById("deepreviewContent").classList.toggle("hidden", tab !== "deepreview");
  document.getElementById("compareContent").classList.toggle("hidden", tab !== "compare");
  document.getElementById("exportContent").classList.toggle("hidden", tab !== "export");
  if ((tab === "overview" || tab === "deepreview") && state.map) setTimeout(() => state.map.invalidateSize(), 100);
}

// ── Build brand list ──
function buildBrandList() {
  const wrap = document.getElementById("brandList");
  wrap.innerHTML = "";
  state.metrics.brands.forEach(b => {
    state.selectedBrands.add(b);
    const total = state.metrics.brand_totals[b] || 0;
    const el = document.createElement("div");
    el.className = "brand-item";
    el.innerHTML = `
      <span class="brand-dot" style="background:${BRAND_COLORS[b] || '#3B5BFE'}"></span>
      <span class="brand-name">${b}</span>
      <span class="brand-count">${fmtInt(total)}</span>
      <span class="brand-check"></span>
    `;
    el.onclick = () => {
      if (state.selectedBrands.has(b)) { state.selectedBrands.delete(b); el.classList.add("inactive"); }
      else { state.selectedBrands.add(b); el.classList.remove("inactive"); }
      if (state.selectedBrands.size === 0) { state.selectedBrands.add(b); el.classList.remove("inactive"); }
      refreshAll();
    };
    wrap.appendChild(el);
  });
}

function setAllBrands(brands) {
  state.selectedBrands = new Set(brands);
  document.querySelectorAll(".brand-item").forEach(el => {
    const name = el.querySelector(".brand-name").textContent;
    el.classList.toggle("inactive", !state.selectedBrands.has(name));
  });
  refreshAll();
}

// ── Build selectors ──
function buildRegionSelect() {
  const sel = document.getElementById("regionSelect");
  state.metrics.regions.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r.replace(" (England)", "");
    sel.appendChild(opt);
  });
}

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
  primary.value = state.primaryBrand;
  secondary.value = state.secondaryBrand;
}

function buildCitySelect(region) {
  const wrap = document.getElementById("citySelectorWrap");
  const sel = document.getElementById("citySelect");
  sel.innerHTML = '<option value="">All Cities</option>';

  if (!region) { wrap.style.display = "none"; return; }
  wrap.style.display = "flex";

  const cities = REGION_CITIES[region] || [];
  cities.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

const selectedArr = () => Array.from(state.selectedBrands);

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
  if (!region) {
    state.map.flyTo([ENGLAND_VIEW.lat, ENGLAND_VIEW.lon], ENGLAND_VIEW.zoom, { duration: 1 });
    return;
  }
  const center = REGION_CENTERS[region];
  if (center) state.map.flyTo([center.lat, center.lon], center.zoom, { duration: 1 });
}

function flyToCity(cityName, region) {
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

// ── Honeycomb layer (optimized) ──
function buildHexLayer() {
  if (state.hexLayer) { state.hexLayer.remove(); state.hexLayer = null; }
  if (!state.map || state.country !== "england") return;

  const t0 = performance.now();
  const zoom = state.map.getZoom();
  const cellSize = cellSizeForZoom(zoom);
  const selected = selectedArr();
  const regionFilter = state.selectedRegion;
  const isHeatmap = state.heatmapMode && state.primaryBrand;

// ── Guesstimate opportunity colors (purple gradient) ──
function hexStyleGuesstimate(props) {
  const rank = props.oppRank || 0;
  const count = props.adjustedCount || 0;
  const pop = props.estPop || 0;

  if (rank === 0) {
    if (count === 0 && pop === 0) {
      return { fillColor: 'hsla(0,0%,94%,0.04)', fillOpacity: 1, weight: 0, color: 'transparent', opacity: 0 };
    }
    return { fillColor: 'hsla(230,20%,92%,0.06)', fillOpacity: 1, weight: 0, color: 'transparent', opacity: 0 };
  }

  if (rank === 1) {
    return { fillColor: 'hsla(270, 85%, 60%, 0.55)', fillOpacity: 1, weight: 0, color: 'transparent', opacity: 0 };
  }

  return { fillColor: 'hsla(270, 65%, 72%, 0.35)', fillOpacity: 1, weight: 0, color: 'transparent', opacity: 0 };
}

  const bounds = state.map.getBounds().pad(0.15);
  const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];

  let brandFilter;
  if (isHeatmap) {
    const competitors = state.compareMode === "all"
      ? state.metrics.brands.filter(b => b !== state.primaryBrand)
      : (state.secondaryBrand ? [state.secondaryBrand] : []);
    brandFilter = new Set([state.primaryBrand, ...competitors]);
  } else {
    brandFilter = new Set(selected);
  }

  // Use spatial index for fast point retrieval
  const locations = getPointsInBounds(bounds, brandFilter, regionFilter);

  const hexGrid = turf.hexGrid(bbox, cellSize, { units: 'kilometers' });

  // Compute hex area once (all hexes in a regular grid have same area)
  const hexAreaKm2 = hexGrid.features.length > 0 ? turf.area(hexGrid.features[0]) / 1e6 : 1;

  // Bin points to hexes using fast spatial hash (replaces per-hex pointsWithinPolygon)
  const hexPoints = binPointsToHexes(hexGrid, locations);

  if (isHeatmap) {
    const competitors = state.compareMode === "all"
      ? state.metrics.brands.filter(b => b !== state.primaryBrand)
      : (state.secondaryBrand ? [state.secondaryBrand] : []);

    hexGrid.features.forEach((hex, i) => {
      const pts = hexPoints[i];
      let primary = 0, comp = 0;
      pts.forEach(f => {
        if (f.properties.brand === state.primaryBrand) primary++;
        else if (competitors.includes(f.properties.brand)) comp++;
      });
      const cx = hex._cx, cy = hex._cy;
      const unlocW = fastEstimateUnlocated(hexAreaKm2, cx, cy, brandFilter);
      const unlocPrimary = fastEstimateUnlocated(hexAreaKm2, cx, cy, new Set([state.primaryBrand]));
      hex.properties.primary = primary;
      hex.properties.competitor = comp;
      hex.properties.total = primary + comp;
      hex.properties.unlocated = unlocW;
      hex.properties.adjustedTotal = primary + comp + unlocW;
      hex.properties.ratio = (primary + comp + unlocW) > 0 ? (primary + unlocPrimary) / (primary + comp + unlocW) : NaN;
      hex.properties.estPop = fastEstimatePopulation(hexAreaKm2, cx, cy);
    });

    state._hexMaxPop = Math.max(1, ...hexGrid.features.map(h => h.properties.estPop || 0));

    // Guesstimate + heatmap
    const isGuessHeat = state.guesstimateMode;
    if (isGuessHeat) {
      hexGrid.features.forEach(hex => {
        const pop = hex.properties.estPop || 0;
        const density = hexAreaKm2 > 0 ? pop / hexAreaKm2 : 0;
        const comp = hex.properties.competitor || 0;
        const primary = hex.properties.primary || 0;
        const total = hex.properties.adjustedTotal || 0;

        const minDensity = zoom >= 12 ? 20 : zoom >= 10 ? 80 : 200;
        const minPop = zoom >= 12 ? 10 : zoom >= 10 ? 100 : 500;
        if (density < minDensity || pop < minPop) {
          hex.properties.opportunity = 0;
          hex.properties.oppRank = 0;
          return;
        }

        const compSignal = Math.min(1, comp / 5);
        const primaryGap = total > 0 ? Math.max(0, 1 - (primary / Math.max(1, total))) : 1;
        const popPerStore = total > 0 ? pop / total : pop;
        const underserved = Math.min(1, popPerStore / 15000);
        const notPacked = Math.max(0, 1 - (total / 15));

        const rawOpp = (compSignal * 0.3 + primaryGap * 0.25 + underserved * 0.25 + notPacked * 0.2);
        hex.properties.opportunity = rawOpp;
        hex.properties.oppRank = 0;
      });

      let candidates = hexGrid.features.filter(h => h.properties.opportunity > 0.15);
      if (regionFilter) {
        candidates = candidates.filter(h => fastRegionLookup(h._cx, h._cy) === regionFilter);
      }

      candidates.sort((a, b) => (b.properties.opportunity || 0) - (a.properties.opportunity || 0));
      const majorCount = Math.min(5, Math.max(3, Math.floor(candidates.length * 0.15)));
      const midCount = Math.min(7, Math.max(5, Math.floor(candidates.length * 0.25)));
      candidates.slice(0, majorCount).forEach(h => { h.properties.oppRank = 1; });
      candidates.slice(majorCount, majorCount + midCount).forEach(h => { h.properties.oppRank = 2; });
    }

    const showAll = zoom >= 12;
    const displayHexes = isGuessHeat && !showAll
      ? hexGrid.features.filter(h => (h.properties.oppRank > 0) || h.properties.total > 0)
      : hexGrid.features;

    state.hexLayer = L.geoJSON({ type: "FeatureCollection", features: displayHexes }, {
      style: f => {
        const p = f.properties;
        const maxPop = state._hexMaxPop || 1;

        if (isGuessHeat) {
          if (p.oppRank > 0) return hexStyleGuesstimate(p);
          return {
            fillColor: hexFillHeatmap(p.ratio),
            fillOpacity: 0.6,
            weight: 0.5,
            color: hexStrokeHeatmap(p.ratio),
            opacity: 0.5
          };
        }

        if (p.total === 0) {
          const pop = p.estPop || 0;
          const t = maxPop > 0 ? Math.min(1, pop / maxPop) : 0;
          return { fillColor: `hsla(40,${20 + 30 * t}%,${94 - 12 * t}%,${0.08 + 0.2 * t})`, fillOpacity: 1, weight: 1, color: `rgba(180,140,60,${0.06 + 0.15 * t})`, opacity: 1 };
        }

        return {
          fillColor: hexFillHeatmap(p.ratio),
          fillOpacity: 1,
          weight: 1,
          color: hexStrokeHeatmap(p.ratio),
          opacity: 1
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        if (isGuessHeat && p.oppRank > 0) {
          const label = p.oppRank === 1 ? '🔥 Top Opportunity' : '⚡ Moderate Opportunity';
          const pop = p.estPop || 0;
          const popK = pop > 1000 ? (pop / 1000).toFixed(1) + 'k' : pop;
          layer.bindTooltip(`${label}<br>${state.primaryBrand}: ${p.primary} · Competitors: ${p.competitor}<br>Pop: ~${popK}`, { sticky: true });
          return;
        }

        if (p.total === 0) {
          const pop = p.estPop || 0;
          const popK = pop > 1000 ? (pop / 1000).toFixed(1) + 'k' : pop;
          const unlocK = p.unlocated > 0.1 ? ` · +${p.unlocated.toFixed(1)} est. unlocated` : '';
          layer.bindTooltip(`No stores${unlocK} · Pop: ~${popK}`, { sticky: true });
          return;
        }
        const pctText = !isNaN(p.ratio) ? ` (${(p.ratio * 100).toFixed(0)}% ${state.primaryBrand})` : '';
        const pop = p.estPop;
        const adjTotal = p.adjustedTotal || p.total;
        const popPer = pop > 0 ? (pop / Math.max(1, adjTotal)).toLocaleString('en', {maximumFractionDigits: 0}) : '—';
        const popK = pop > 1000 ? (pop / 1000).toFixed(1) + 'k' : pop;
        const unlocNote = p.unlocated > 0.1 ? `<br>+${p.unlocated.toFixed(1)} est. unlocated stores in area` : '';
        layer.bindTooltip(
          `${state.primaryBrand}: ${p.primary} · Others: ${p.competitor}${pctText}<br>Pop: ~${popK} · 1 per ${popPer} people${unlocNote}`,
          { sticky: true }
        );
      }
    }).addTo(state.map);

  } else {
    let maxCount = 0;
    let maxPop = 0;
    const isDensityMetric = state.metric === "density";
    const isGuesstimate = state.guesstimateMode && !isHeatmap;
    hexGrid.features.forEach((hex, i) => {
      const pts = hexPoints[i];
      hex.properties.count = pts.length;
      const cx = hex._cx, cy = hex._cy;
      hex.properties.estPop = fastEstimatePopulation(hexAreaKm2, cx, cy);
      hex.properties.unlocated = fastEstimateUnlocated(hexAreaKm2, cx, cy, brandFilter);
      hex.properties.adjustedCount = hex.properties.count + hex.properties.unlocated;
      if (isDensityMetric) {
        hex.properties.displayValue = hexAreaKm2 > 0 ? hex.properties.adjustedCount / (hexAreaKm2 / 1000) : 0;
      } else {
        hex.properties.displayValue = hex.properties.adjustedCount;
      }
      if (hex.properties.displayValue > maxCount) maxCount = hex.properties.displayValue;
      if (hex.properties.estPop > maxPop) maxPop = hex.properties.estPop;
    });

    // Guesstimate: compute proximity-aware opportunity scores
    if (isGuesstimate) {
      hexGrid.features.forEach(hex => {
        const pop = hex.properties.estPop || 0;
        const adj = hex.properties.adjustedCount || 0;
        const density = hexAreaKm2 > 0 ? pop / hexAreaKm2 : 0;

        const minDensity = zoom >= 12 ? 20 : zoom >= 10 ? 80 : 200;
        const minPop = zoom >= 12 ? 10 : zoom >= 10 ? 100 : 500;
        if (density < minDensity || pop < minPop) {
          hex.properties.opportunity = 0;
          hex.properties.oppRank = 0;
          return;
        }

        const storeSignal = Math.min(1, adj / 4);
        const popPerStore = adj > 0 ? pop / adj : pop;
        const underserved = Math.min(1, popPerStore / 15000);
        const notPacked = Math.max(0, 1 - (adj / 12));

        const rawOpp = (storeSignal * 0.25 + underserved * 0.4 + notPacked * 0.2 + Math.min(1, density / 2000) * 0.15);
        hex.properties.opportunity = rawOpp;
        hex.properties.oppRank = 0;
      });

      let candidates = hexGrid.features.filter(h => h.properties.opportunity > 0.15);
      if (regionFilter) {
        candidates = candidates.filter(h => fastRegionLookup(h._cx, h._cy) === regionFilter);
      }

      candidates.sort((a, b) => (b.properties.opportunity || 0) - (a.properties.opportunity || 0));
      const majorCount = Math.min(5, Math.max(3, Math.floor(candidates.length * 0.15)));
      const midCount = Math.min(7, Math.max(5, Math.floor(candidates.length * 0.25)));
      candidates.slice(0, majorCount).forEach(h => { h.properties.oppRank = 1; });
      candidates.slice(majorCount, majorCount + midCount).forEach(h => { h.properties.oppRank = 2; });
    }

    const showAll = zoom >= 12;
    const displayHexes = isGuesstimate && !showAll
      ? hexGrid.features.filter(h => (h.properties.oppRank > 0) || h.properties.count > 0)
      : hexGrid.features;

    state.hexLayer = L.geoJSON({ type: "FeatureCollection", features: displayHexes }, {
      style: f => {
        if (isGuesstimate && f.properties.oppRank > 0) {
          return hexStyleGuesstimate(f.properties);
        }
        if (isGuesstimate) {
          return {
            fillColor: hexFillDensity(f.properties.displayValue, maxCount, f.properties.estPop, maxPop),
            fillOpacity: 0.5,
            weight: 0.5,
            color: hexStrokeDensity(f.properties.displayValue, maxCount, f.properties.estPop, maxPop),
            opacity: 0.5
          };
        }
        return {
          fillColor: hexFillDensity(f.properties.displayValue, maxCount, f.properties.estPop, maxPop),
          fillOpacity: 1,
          weight: 1,
          color: hexStrokeDensity(f.properties.displayValue, maxCount, f.properties.estPop, maxPop),
          opacity: 1
        };
      },
      onEachFeature: (feature, layer) => {
        const c = feature.properties.count;
        const unloc = feature.properties.unlocated;
        const pop = feature.properties.estPop;
        const popK = pop > 1000 ? (pop / 1000).toFixed(1) + 'k' : pop;
        const adjCount = c + unloc;
        const popPer = (adjCount > 0 && pop > 0) ? (pop / adjCount).toLocaleString('en', {maximumFractionDigits: 0}) : '—';
        const unlocNote = unloc > 0.1 ? ` (+${unloc.toFixed(1)} est.)` : '';
        const popLine = pop > 0 ? `<br>Pop: ~${popK}` + (adjCount > 0 ? ` · 1 per ${popPer} people` : '') : '';
        const densityLine = isDensityMetric ? `<br>Density: ${feature.properties.displayValue.toFixed(1)} per 1k km²` : '';
        if (isGuesstimate && feature.properties.oppRank > 0) {
          const label = feature.properties.oppRank === 1 ? '🔥 Top Opportunity' : '⚡ Moderate Opportunity';
          layer.bindTooltip(`${label}<br>${c} location${c !== 1 ? 's' : ''}${unlocNote}${popLine}`, { sticky: true });
        } else {
          layer.bindTooltip(`${c} location${c !== 1 ? 's' : ''}${unlocNote}${popLine}${densityLine}`, { sticky: true });
        }
      }
    }).addTo(state.map);
  }

  if (state.regionsLayer) state.regionsLayer.bringToFront();
  if (state.locationsLayer) state.locationsLayer.bringToFront();
  updateLegend();
  console.log(`⚡ Hex layer built in ${(performance.now() - t0).toFixed(0)}ms (${hexGrid.features.length} hexes, ${locations.length} points)`);
}

function updateLegend() {
  const title = document.getElementById("legendTitle");
  const scale = document.getElementById("legendScale");
  if (state.heatmapMode && state.guesstimateMode) {
    title.textContent = `⚡ ${state.primaryBrand} · Expansion Opportunities`;
    scale.innerHTML = `
      <span class="legend-block" style="background:hsla(270,65%,72%,0.35)"></span>
      <span class="legend-block" style="background:hsla(270,85%,60%,0.55)"></span>
      <span style="font-size:9px;color:var(--muted);margin-left:4px">Mid → Top</span>
    `;
  } else if (state.heatmapMode) {
    title.textContent = `${state.primaryBrand} vs competitors`;
    scale.innerHTML = `
      <span class="legend-block" style="background:#E53935"></span>
      <span class="legend-block" style="background:#FF9800"></span>
      <span class="legend-block" style="background:#FFEB3B"></span>
      <span class="legend-block" style="background:#8BC34A"></span>
      <span class="legend-block" style="background:#4CAF50"></span>
    `;
  } else if (state.guesstimateMode) {
    title.textContent = "⚡ Expansion Opportunities";
    scale.innerHTML = `
      <span class="legend-block" style="background:hsla(270,65%,72%,0.35)"></span>
      <span class="legend-block" style="background:hsla(270,85%,60%,0.55)"></span>
      <span style="font-size:9px;color:var(--muted);margin-left:4px">Mid → Top</span>
    `;
  } else if (state.metric === "density") {
    title.textContent = "Density per 1,000 km²";
    scale.innerHTML = `
      <span class="legend-block" style="background:hsla(170,70%,85%,0.3)"></span>
      <span class="legend-block" style="background:hsla(170,75%,72%,0.5)"></span>
      <span class="legend-block" style="background:hsla(170,80%,60%,0.65)"></span>
      <span class="legend-block" style="background:hsla(170,85%,48%,0.75)"></span>
      <span class="legend-block" style="background:hsla(170,90%,37%,0.85)"></span>
    `;
  } else {
    title.textContent = "Location density";
    scale.innerHTML = `
      <span class="legend-block" style="background:hsla(230,85%,92%,0.5)"></span>
      <span class="legend-block" style="background:hsla(230,85%,80%,0.6)"></span>
      <span class="legend-block" style="background:hsla(230,88%,68%,0.7)"></span>
      <span class="legend-block" style="background:hsla(230,90%,56%,0.75)"></span>
      <span class="legend-block" style="background:hsla(230,95%,38%,0.85)"></span>
    `;
  }
}

// ── Location markers — show at zoom >= 11 even without region ──
function rebuildLocationsLayer() {
  if (state.locationsLayer) { state.locationsLayer.remove(); state.locationsLayer = null; }
  if (state.country !== "england") return;

  const zoom = state.map.getZoom();
  // Always show dots — smaller at country zoom, larger when zoomed in

  const selected = selectedArr();
  const brandSet = new Set(selected);
  const cityFilter = state.selectedCity;
  const regionFilter = state.selectedRegion;

  let feats;
  if (zoom >= 11 && !regionFilter) {
    // High zoom: show all visible points in viewport
    feats = getPointsInBounds(state.map.getBounds().pad(0.05), brandSet, null);
  } else {
    feats = getPointsInBounds(
      regionFilter ? state.map.getBounds().pad(0.1) : state.map.getBounds().pad(0.05),
      brandSet,
      regionFilter
    );
    if (cityFilter) {
      const cityFeats = feats.filter(f => (f.properties.city || "").trim().toLowerCase() === cityFilter.toLowerCase());
      // Fall back to region dots if city field is missing/sparse
      if (cityFeats.length >= 10) {
        feats = cityFeats;
      }
      // else: keep all region feats as fallback
    }
  }

  if (feats.length === 0) return;

  // Limit markers for performance
  const maxMarkers = zoom < 11 ? 5000 : 2000;
  const displayFeats = feats.length > maxMarkers ? feats.slice(0, maxMarkers) : feats;

  const dotRadius = zoom >= 13 ? 6 : zoom >= 11 ? 4 : zoom >= 9 ? 2.5 : 1.5;
  const dotWeight = zoom >= 11 ? 1.5 : 0.5;

  state.locationsLayer = L.geoJSON({ type: "FeatureCollection", features: displayFeats }, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
      radius: dotRadius,
      weight: dotWeight, color: "#fff", opacity: zoom >= 11 ? 1 : 0.6,
      fillColor: BRAND_COLORS[feature.properties.brand] || "#3B5BFE",
      fillOpacity: zoom >= 11 ? 0.85 : 0.7
    }),
    onEachFeature: (feature, layer) => {
      const p = feature.properties;
      layer.bindPopup(`<strong>${p.brand}</strong><br/>${p.name || ""}<br/><span style="color:#6b7394">${p.city || ""} ${p.postcode || ""}</span>`);
    }
  }).addTo(state.map);
}

// ── Refresh ──
function refreshBrandCounts() {
  const region = state.selectedRegion;
  document.querySelectorAll(".brand-item").forEach(el => {
    const name = el.querySelector(".brand-name").textContent;
    const countEl = el.querySelector(".brand-count");
    if (region) {
      const regionCounts = state.metrics.region_brand_counts[region] || {};
      countEl.textContent = fmtInt(regionCounts[name] || 0);
    } else {
      countEl.textContent = fmtInt(state.metrics.brand_totals[name] || 0);
    }
  });
}

function refreshAll() {
  if (state.country !== "england") return;
  refreshKPIs();
  refreshBrandCounts();
  buildHexLayer();
  rebuildLocationsLayer();
  refreshRegionPanel();
  refreshCompareTab();
  refreshExportInfo();
  if (state.guesstimateMode) refreshGuesstimate();
}

function refreshKPIs() {
  const selected = selectedArr();
  const regionFilter = state.selectedRegion;
  let total = 0, london = 0, regionsCovered = 0;
  let bestRegion = null, bestVal = -1;

  const regionsToCheck = regionFilter ? [regionFilter] : state.metrics.regions;

  regionsToCheck.forEach(r => {
    const counts = state.metrics.region_brand_counts[r] || {};
    let t = 0;
    selected.forEach(b => t += (counts[b] || 0));
    total += t;
    if (r === "London") london = t;
    if (t > 0) regionsCovered++;
    const v = state.metric === "count" ? t : t / ((state.metrics.region_area_km2[r] || 1) / 1000);
    if (v > bestVal) { bestVal = v; bestRegion = r; }
  });

  const totalRegions = regionFilter ? 1 : 9;
  document.getElementById("kpiTotal").textContent = fmtInt(total);
  document.getElementById("kpiRegions").textContent = regionFilter ? `1/1` : `${regionsCovered}/9`;
  document.getElementById("kpiDense").textContent = (bestRegion || "—").replace(" (England)", "");
  document.getElementById("kpiLondonShare").textContent = total ? fmtPct(london / total) : "—";
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

// Enhanced city fly — falls back to calculating centroid from data
function flyToCityOrData(cityName, region) {
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
  const regionLabel = region ? region.replace(" (England)", "") : null;
  const scopeLabel = regionLabel || "England";
  const allBrands = state.metrics.brands;

  // Update titles with region context
  document.getElementById("compareDesc").textContent = regionLabel
    ? `Head-to-head brand analysis in ${regionLabel} — market share, positioning, and competitive insights.`
    : `Head-to-head brand analysis with market share, regional presence, and competitive positioning.`;
  document.getElementById("compareShareTitle").textContent = `📊 Market Share in ${scopeLabel}`;
  document.getElementById("compareLeaderTitle").textContent = `🏆 Brand Leaderboard — ${scopeLabel}`;
  document.getElementById("compareMatrixTitle").textContent = regionLabel ? `🗺️ City Breakdown — ${regionLabel}` : `🗺️ Regional Presence Matrix`;
  document.getElementById("compareConcentrationTitle").textContent = `🎯 Concentration Analysis — ${scopeLabel}`;

  // Calculate totals scoped to region if selected
  function brandTotal(b) {
    if (!region) return state.metrics.brand_totals[b] || 0;
    return (state.metrics.region_brand_counts[region] || {})[b] || 0;
  }

  const totalAll = selected.reduce((s, b) => s + brandTotal(b), 0);

  const rows = selected.map(b => {
    const total = brandTotal(b);
    const london = (state.metrics.region_brand_counts["London"] || {})[b] || 0;
    const regionShares = state.metrics.regions.map(r => {
      const c = (state.metrics.region_brand_counts[r] || {})[b] || 0;
      const nationalTotal = state.metrics.brand_totals[b] || 1;
      return { region: r, label: r.replace(" (England)", ""), count: c, share: nationalTotal ? c / nationalTotal : 0 };
    }).sort((a, b) => b.count - a.count);
    const top3Share = regionShares.slice(0, 3).reduce((s, r) => s + r.count, 0) / (state.metrics.brand_totals[b] || 1);
    const regionCounts = {};
    state.metrics.regions.forEach(r => { regionCounts[r] = (state.metrics.region_brand_counts[r] || {})[b] || 0; });
    return { brand: b, total, share: totalAll ? total / totalAll : 0, londonShare: (state.metrics.brand_totals[b] || 1) ? london / (state.metrics.brand_totals[b] || 1) : 0, top1: regionShares[0], top3Share, regionCounts, regionShares };
  }).sort((a, b) => b.total - a.total);

  // ── KPIs ──
  const leader = rows[0];
  document.getElementById("compareKpis").innerHTML = `
    <div class="rp-kpi-card"><div class="rp-kpi-value">${fmtInt(totalAll)}</div><div class="rp-kpi-label">Locations${regionLabel ? ' in ' + regionLabel : ''}</div></div>
    <div class="rp-kpi-card"><div class="rp-kpi-value">${selected.length}</div><div class="rp-kpi-label">Brands Compared</div></div>
    <div class="rp-kpi-card"><div class="rp-kpi-value">${leader ? leader.brand.split("'")[0] : '—'}</div><div class="rp-kpi-label">${regionLabel ? regionLabel + ' ' : ''}Leader</div></div>
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
  if (region) {
    // Region-scoped: show regional stats
    document.getElementById("compareTable").innerHTML = `
      <tr><th>#</th><th>Brand</th><th class="num">In ${regionLabel}</th><th class="num">Share</th><th class="num">National</th><th class="num">Vs National</th></tr>
      ${rows.map((r, i) => {
        const natTotal = state.metrics.brand_totals[r.brand] || 0;
        const natShare = natTotal / allBrands.reduce((s, b) => s + (state.metrics.brand_totals[b] || 0), 0);
        const diff = r.share - natShare;
        const diffColor = diff > 0 ? '#43A047' : diff < -0.02 ? '#E53935' : 'var(--muted)';
        return `<tr>
          <td style="color:var(--muted);font-weight:700">${i + 1}</td>
          <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:8px;height:8px"></span><strong>${r.brand}</strong></div></td>
          <td class="num">${fmtInt(r.total)}</td>
          <td class="num">${fmtPct(r.share)}</td>
          <td class="num" style="color:var(--muted)">${fmtInt(natTotal)}</td>
          <td class="num" style="color:${diffColor};font-weight:700">${diff > 0 ? '+' : ''}${(diff * 100).toFixed(1)}pp</td>
        </tr>`;
      }).join("")}
    `;
  } else {
    document.getElementById("compareTable").innerHTML = `
      <tr><th>#</th><th>Brand</th><th class="num">Total</th><th class="num">Share</th><th class="num">London %</th><th>Strongest</th></tr>
      ${rows.map((r, i) => `<tr>
        <td style="color:var(--muted);font-weight:700">${i + 1}</td>
        <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:8px;height:8px"></span><strong>${r.brand}</strong></div></td>
        <td class="num">${fmtInt(r.total)}</td>
        <td class="num">${fmtPct(r.share)}</td>
        <td class="num">${fmtPct(r.londonShare)}</td>
        <td style="font-size:11px;color:var(--muted)">${r.top1.label} (${fmtPct(r.top1.share)})</td>
      </tr>`).join("")}
    `;
  }

  // ── Regional Presence Matrix / City Breakdown ──
  if (region) {
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
      <table>
        <tr><th>City</th>${selected.map(b => `<th><span style="color:${BRAND_COLORS[b]||'#3B5BFE'}">${b.split("'")[0]}</span></th>`).join("")}<th>Total</th></tr>
        ${cityRows.join("")}
      </table>
    `;
  } else {
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
      <table>
        <tr><th></th>${shortRegions.map(r => `<th>${r}</th>`).join("")}</tr>
        ${matrixRows.join("")}
      </table>
    `;
  }

  // ── Concentration Analysis ──
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

  // ── Key Insights (auto-generated, region-aware) ──
  const insights = [];
  if (leader) {
    insights.push(`<div class="insight-card"><span class="insight-icon">👑</span><strong>${leader.brand}</strong> leads ${regionLabel ? 'in ' + regionLabel : ''} with ${fmtInt(leader.total)} locations (${fmtPct(leader.share)} share)${!regionLabel ? ', strongest in ' + leader.top1.label : ''}.</div>`);
  }
  const smallest = rows[rows.length - 1];
  if (smallest && rows.length > 1) {
    insights.push(`<div class="insight-card"><span class="insight-icon">📉</span><strong>${smallest.brand}</strong> has the smallest footprint${regionLabel ? ' in ' + regionLabel : ''} at ${fmtInt(smallest.total)} locations — potential growth opportunity.</div>`);
  }
  if (!region) {
    const highLondon = rows.filter(r => r.londonShare > 0.18);
    if (highLondon.length > 0) {
      insights.push(`<div class="insight-card"><span class="insight-icon">🏙️</span>${highLondon.map(r => `<strong>${r.brand}</strong>`).join(" and ")} heavily concentrated in London (${highLondon.map(r => fmtPct(r.londonShare)).join(", ")}), leaving regional markets open.</div>`);
    }
  }
  if (region) {
    // Region-specific insight: who's over/under-indexed here
    const natTotalAll = allBrands.reduce((s, b) => s + (state.metrics.brand_totals[b] || 0), 0);
    rows.forEach(r => {
      const natShare = (state.metrics.brand_totals[r.brand] || 0) / natTotalAll;
      const diff = r.share - natShare;
      if (diff > 0.03) {
        insights.push(`<div class="insight-card"><span class="insight-icon">📈</span><strong>${r.brand}</strong> over-indexes in ${regionLabel} by +${(diff * 100).toFixed(1)}pp vs national average — strong local position.</div>`);
      } else if (diff < -0.03) {
        insights.push(`<div class="insight-card"><span class="insight-icon">📉</span><strong>${r.brand}</strong> under-indexes in ${regionLabel} by ${(diff * 100).toFixed(1)}pp — room to grow here.</div>`);
      }
    });
  }
  document.getElementById("compareInsights").innerHTML = insights.join("");

  // ── Guesstimate Side-by-Side Brand Comparison ──
  refreshCompareGuesstimate(rows, totalAll, scopeLabel, region);

  // ── Region Deep Dive (extra data when region selected) ──
  refreshCompareRegionDeep(rows, region, regionLabel);
}

function refreshCompareGuesstimate(rows, totalAll, scopeLabel, region) {
  const section = document.getElementById("compareGuesstimateSection");
  if (rows.length < 2) { section.style.display = "none"; return; }
  section.style.display = "block";

  // Pick top 2 brands for face-off
  const a = rows[0];
  const b = rows[1];
  const allBrands = state.metrics.brands;
  const regions = state.metrics.regions;
  const brandCounts = state.metrics.region_brand_counts;

  // Per-region dominance
  let aWins = 0, bWins = 0, ties = 0;
  const regionBattle = regions.map(r => {
    const ac = (brandCounts[r] || {})[a.brand] || 0;
    const bc = (brandCounts[r] || {})[b.brand] || 0;
    if (ac > bc) aWins++; else if (bc > ac) bWins++; else ties++;
    const winner = ac > bc ? a.brand : bc > ac ? b.brand : 'Tied';
    return { label: r.replace(" (England)", ""), ac, bc, winner };
  });

  // Strengths & weaknesses
  const aStrengths = regionBattle.filter(r => r.ac > r.bc).sort((x, y) => (y.ac - y.bc) - (x.ac - x.bc)).slice(0, 3);
  const bStrengths = regionBattle.filter(r => r.bc > r.ac).sort((x, y) => (y.bc - y.ac) - (x.bc - x.ac)).slice(0, 3);

  // Density comparison
  const areas = state.metrics.region_area_km2;
  const aDensity = (state.metrics.brand_totals[a.brand] || 0) / (Object.values(areas).reduce((s, v) => s + v, 0) / 1000);
  const bDensity = (state.metrics.brand_totals[b.brand] || 0) / (Object.values(areas).reduce((s, v) => s + v, 0) / 1000);

  let html = `
    <div class="guesstimate-badge">⚡ ${a.brand} vs ${b.brand} — ${scopeLabel}</div>
    <div class="faceoff-grid">
      <div class="faceoff-card" style="border-left:3px solid ${BRAND_COLORS[a.brand]}">
        <div class="faceoff-brand">${a.brand}</div>
        <div class="faceoff-stat">${fmtInt(a.total)} stores · ${fmtPct(a.share)} share</div>
        <div class="faceoff-metric">Density: ${aDensity.toFixed(1)} per 1k km²</div>
        <div class="faceoff-wins">🏆 Leads in ${aWins}/9 regions</div>
      </div>
      <div class="faceoff-vs">VS</div>
      <div class="faceoff-card" style="border-left:3px solid ${BRAND_COLORS[b.brand]}">
        <div class="faceoff-brand">${b.brand}</div>
        <div class="faceoff-stat">${fmtInt(b.total)} stores · ${fmtPct(b.share)} share</div>
        <div class="faceoff-metric">Density: ${bDensity.toFixed(1)} per 1k km²</div>
        <div class="faceoff-wins">🏆 Leads in ${bWins}/9 regions</div>
      </div>
    </div>

    <div class="faceoff-strengths">
      <div>
        <div class="faceoff-section-title" style="color:${BRAND_COLORS[a.brand]}">💪 ${a.brand} Strongest</div>
        ${aStrengths.map(r => `<div class="faceoff-row"><span>${r.label}</span><span class="faceoff-lead">+${r.ac - r.bc} ahead</span></div>`).join("")}
      </div>
      <div>
        <div class="faceoff-section-title" style="color:${BRAND_COLORS[b.brand]}">💪 ${b.brand} Strongest</div>
        ${bStrengths.map(r => `<div class="faceoff-row"><span>${r.label}</span><span class="faceoff-lead">+${r.bc - r.ac} ahead</span></div>`).join("")}
      </div>
    </div>

    <table class="table" style="margin-top:10px">
      <tr><th>Region</th><th class="num" style="color:${BRAND_COLORS[a.brand]}">${a.brand}</th><th class="num" style="color:${BRAND_COLORS[b.brand]}">${b.brand}</th><th>Winner</th></tr>
      ${regionBattle.map(r => {
        const winColor = r.winner === a.brand ? BRAND_COLORS[a.brand] : r.winner === b.brand ? BRAND_COLORS[b.brand] : 'var(--muted)';
        return `<tr>
          <td>${r.label}</td>
          <td class="num" style="${r.ac > r.bc ? 'font-weight:700' : ''}">${r.ac}</td>
          <td class="num" style="${r.bc > r.ac ? 'font-weight:700' : ''}">${r.bc}</td>
          <td style="color:${winColor};font-weight:700;font-size:11px">${r.winner}</td>
        </tr>`;
      }).join("")}
    </table>
  `;

  document.getElementById("compareGuesstimateContent").innerHTML = html;
}

function refreshCompareRegionDeep(rows, region, regionLabel) {
  const section = document.getElementById("compareRegionDeepDive");
  if (!region) { section.style.display = "none"; return; }
  section.style.display = "block";
  document.getElementById("compareRegionDeepTitle").textContent = `📍 Deep Dive — ${regionLabel}`;

  const selected = selectedArr();
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

function refreshExportInfo() {
  const selected = selectedArr();
  document.getElementById("exportBrandsInfo").textContent = selected.length === state.metrics.brands.length ? "All brands" : selected.join(", ");
  document.getElementById("exportRegionInfo").textContent = state.selectedRegion ? state.selectedRegion.replace(" (England)", "") : "All England";
  const feats = state.locationsGeojson.features.filter(f => selected.includes(f.properties.brand) && (!state.selectedRegion || f.properties.region === state.selectedRegion));
  document.getElementById("exportCountInfo").textContent = fmtInt(feats.length);
}

// ════════════════════════════════════════════
// ── GUESSTIMATE ENGINE (data-driven insights)
// ════════════════════════════════════════════

function generateGuesstimateData() {
  const primary = state.primaryBrand;
  const isHeatmap = state.heatmapMode && primary;
  const selected = selectedArr();
  const region = state.selectedRegion;
  const regionLabel = region ? region.replace(" (England)", "") : "England";
  const regions = state.metrics.regions;
  const brandCounts = state.metrics.region_brand_counts;
  const areas = state.metrics.region_area_km2;
  const allBrands = state.metrics.brands;

  const focusBrand = isHeatmap ? primary : (selected.length === 1 ? selected[0] : null);
  const competitors = focusBrand
    ? allBrands.filter(b => b !== focusBrand && (isHeatmap || selected.includes(b)))
    : [];

  const regionData = regions.map(r => {
    const counts = brandCounts[r] || {};
    const area = areas[r] || 1;
    const focusCount = focusBrand ? (counts[focusBrand] || 0) : 0;
    const compCount = competitors.reduce((s, b) => s + (counts[b] || 0), 0);
    const totalSelected = selected.reduce((s, b) => s + (counts[b] || 0), 0);
    const allCount = allBrands.reduce((s, b) => s + (counts[b] || 0), 0);
    const density = allCount / (area / 1000);
    const densitySelected = totalSelected / (area / 1000);
    const focusShare = allCount > 0 ? focusCount / allCount : 0;
    const compShare = allCount > 0 ? compCount / allCount : 0;
    return { region: r, label: r.replace(" (England)", ""), area, focusCount, compCount, totalSelected, allCount, density, densitySelected, focusShare, compShare };
  });

  const londonDensity = regionData.find(r => r.region === "London")?.density || 1;
  const avgDensity = regionData.reduce((s, r) => s + r.density, 0) / regionData.length;
  const saturation = Math.min(99, Math.round((avgDensity / londonDensity) * 100));

  const focusTotal = focusBrand ? (state.metrics.brand_totals[focusBrand] || 0) : 0;
  const totalAll = allBrands.reduce((s, b) => s + (state.metrics.brand_totals[b] || 0), 0);
  const nationalShare = totalAll > 0 ? focusTotal / totalAll : 0;

  const avgShare = focusBrand ? focusTotal / totalAll : 0;
  const regionInsights = regionData.map(r => {
    const gapVsAvg = avgShare > 0 ? Math.max(0, 1 - (r.focusShare / avgShare)) : 0;
    const densityFactor = Math.max(0, 1 - (r.density / londonDensity));
    const opportunity = focusBrand
      ? Math.round(Math.min(100, (gapVsAvg * 60 + densityFactor * 40)))
      : Math.round(Math.min(100, densityFactor * 100));
    const advice = focusBrand
      ? (r.focusShare < avgShare * 0.7
        ? `Under-penetrated: ${focusBrand} holds ${fmtPct(r.focusShare)} vs ${fmtPct(avgShare)} national avg`
        : r.focusShare > avgShare * 1.3
          ? `Strong position: ${fmtPct(r.focusShare)} share, defend & optimise`
          : `Balanced: close to national average share`)
      : (r.density < avgDensity * 0.6
        ? `Low saturation (${r.density.toFixed(1)}/1k km²) — strong entry opportunity`
        : r.density > avgDensity * 1.5
          ? `Highly saturated (${r.density.toFixed(1)}/1k km²) — competitive, harder entry`
          : `Moderate saturation (${r.density.toFixed(1)}/1k km²) — viable with differentiation`);
    return { ...r, opportunity, advice };
  }).sort((a, b) => b.opportunity - a.opportunity);

  // Whitespace cities
  const cityData = {};
  state.locationsGeojson.features.forEach(f => {
    const p = f.properties;
    const city = (p.city || "").trim();
    if (!city || city === "Unknown") return;
    if (region && p.region !== region) return;
    if (!cityData[city]) cityData[city] = { total: 0, focus: 0, comp: 0, brands: {}, region: p.region };
    cityData[city].total++;
    if (p.brand === focusBrand) cityData[city].focus++;
    if (competitors.includes(p.brand)) cityData[city].comp++;
    cityData[city].brands[p.brand] = (cityData[city].brands[p.brand] || 0) + 1;
  });

  let whitespace;
  if (focusBrand) {
    whitespace = Object.entries(cityData)
      .filter(([, d]) => d.total >= 5)
      .map(([city, d]) => {
        const ratio = d.total > 0 ? d.focus / d.total : 0;
        const score = Math.round(Math.min(99, Math.max(5, (1 - ratio) * 70 + (d.comp > d.focus * 2 ? 25 : 10))));
        const topComp = Object.entries(d.brands).filter(([b]) => b !== focusBrand).sort((a, b) => b[1] - a[1])[0];
        const reason = d.focus === 0
          ? `No ${focusBrand} stores — ${topComp ? topComp[0] + ' has ' + topComp[1] : 'competitors active'}`
          : `Only ${d.focus} store${d.focus > 1 ? 's' : ''} vs ${d.comp} competitors — ${topComp ? topComp[0] + ' leads with ' + topComp[1] : 'gap exists'}`;
        return { city, score, reason, focus: d.focus, comp: d.comp, total: d.total };
      })
      .sort((a, b) => b.score - a.score).slice(0, 8);
  } else {
    // Market entrant mode: cities with fewest brands or lowest density
    whitespace = Object.entries(cityData)
      .filter(([, d]) => d.total >= 3)
      .map(([city, d]) => {
        const brandCount = Object.keys(d.brands).length;
        const dominant = Object.entries(d.brands).sort((a, b) => b[1] - a[1])[0];
        const dominantShare = dominant ? dominant[1] / d.total : 0;
        const diversityGap = Math.max(0, allBrands.length - brandCount) / allBrands.length;
        const score = Math.round(Math.min(99, Math.max(5, diversityGap * 60 + (1 - dominantShare) * 40)));
        const reason = brandCount < allBrands.length
          ? `Only ${brandCount}/${allBrands.length} chains present — ${dominant[0]} leads (${dominant[1]} stores)`
          : `All chains present but ${dominant[0]} dominates (${fmtPct(dominantShare)})`;
        return { city, score, reason, focus: brandCount, comp: d.total, total: d.total, dominantShare };
      })
      .sort((a, b) => b.score - a.score).slice(0, 10);
  }

  const strongRegions = regionInsights.filter(r => focusBrand ? r.focusShare >= avgShare : r.density >= avgDensity).sort((a, b) => focusBrand ? b.focusShare - a.focusShare : b.density - a.density);
  const weakRegions = regionInsights.filter(r => focusBrand ? r.focusShare < avgShare : r.density < avgDensity).sort((a, b) => focusBrand ? a.focusShare - b.focusShare : a.density - b.density);

  // Market entrant extras
  let entrantData = null;
  if (!focusBrand) {
    const brandTotals = allBrands.map(b => ({ brand: b, total: state.metrics.brand_totals[b] || 0, share: (state.metrics.brand_totals[b] || 0) / totalAll })).sort((a, b) => b.total - a.total);
    const hhi = Math.round(brandTotals.reduce((s, b) => s + Math.pow(b.share * 100, 2), 0));
    const hhiLabel = hhi > 2500 ? 'Highly Concentrated' : hhi > 1500 ? 'Moderately Concentrated' : 'Competitive';
    const avgStoresPerBrand = Math.round(totalAll / allBrands.length);
    const underserved = [...regionData].sort((a, b) => a.density - b.density).slice(0, 3);
    const mostCompetitive = [...regionData].sort((a, b) => b.density - a.density).slice(0, 3);
    entrantData = { brandTotals, hhi, hhiLabel, avgStoresPerBrand, underserved, mostCompetitive };
  }

  // Unlocated store summary
  const unlocatedTotal = state.totalUnlocated || 0;
  const unlocatedByRegion = state.unlocatedStores || {};
  const cityNullTotal = Object.values(state.cityNullStores || {}).reduce((s, r) => s + r._total, 0);

  return {
    focusBrand, saturation, nationalShare, focusTotal, totalAll,
    regionInsights, whitespace, strongRegions, weakRegions, regionLabel,
    isHeatmap, competitors, entrantData, regionData, avgDensity, londonDensity,
    unlocatedTotal, cityNullTotal, unlocatedByRegion
  };
}

function refreshGuesstimate() {
  const panel = document.getElementById("guesstimatePanel");
  if (!state.guesstimateMode) { panel.classList.add("hidden"); return; }
  panel.classList.remove("hidden");

  const d = generateGuesstimateData();
  const brandLabel = d.focusBrand || "Selected Brands";
  const hasHeatmap = d.isHeatmap && d.focusBrand;
  const isEntrant = !d.focusBrand;

  let html = '';
  const dataQualityNote = (d.unlocatedTotal > 0 || d.cityNullTotal > 0) ? `
    <div style="font-size:10px;color:var(--muted);padding:4px 8px;background:var(--panel2);border-radius:6px;border:1px solid var(--border);margin-bottom:8px;line-height:1.4">
      📐 <strong>Data quality:</strong> ${d.unlocatedTotal > 0 ? `${d.unlocatedTotal} stores in metrics without exact coordinates — weighted proportionally by population into regional estimates.` : ''} ${d.cityNullTotal > 0 ? `${d.cityNullTotal} stores have coordinates but no city name — included in map density but excluded from city-level analysis.` : ''}
    </div>` : `
    <div style="font-size:10px;color:var(--muted);padding:4px 8px;background:var(--panel2);border-radius:6px;border:1px solid var(--border);margin-bottom:8px;line-height:1.4">
      ✅ <strong>Data quality:</strong> All stores have city names and coordinates assigned.
    </div>`;

  if (isEntrant) {
    const e = d.entrantData;
    html = `
      <div class="guesstimate-badge">⚡ Market Entry Analysis · New Competitor Intelligence</div>
      ${dataQualityNote}

      <div class="rp-kpi-grid" style="margin-bottom:12px">
        <div class="rp-kpi-card"><div class="rp-kpi-value">${fmtInt(d.totalAll)}</div><div class="rp-kpi-label">Total Market Size</div></div>
        <div class="rp-kpi-card"><div class="rp-kpi-value">${e.brandTotals.length}</div><div class="rp-kpi-label">Active Chains</div></div>
        <div class="rp-kpi-card"><div class="rp-kpi-value">${d.saturation}%</div><div class="rp-kpi-label">Market Saturation</div></div>
        <div class="rp-kpi-card"><div class="rp-kpi-value">${fmtInt(e.avgStoresPerBrand)}</div><div class="rp-kpi-label">Avg per Chain</div></div>
      </div>

      <div class="rp-table-section">
        <div class="rp-table-title">📊 Market Concentration</div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;padding:8px 10px;background:var(--panel2);border-radius:8px;border:1px solid var(--border)">
          <div style="font-size:22px;font-weight:800;color:var(--text)">${e.hhi}</div>
          <div>
            <div style="font-size:12px;font-weight:700;color:${e.hhi > 2500 ? '#E53935' : e.hhi > 1500 ? '#FF9800' : '#43A047'}">${e.hhiLabel}</div>
            <div style="font-size:10px;color:var(--muted)">HHI Index (0–10,000)</div>
          </div>
        </div>
        <table class="table">
          <tr><th>#</th><th>Chain</th><th class="num">Stores</th><th class="num">Share</th><th>Position</th></tr>
          ${e.brandTotals.map((b, i) => `<tr>
            <td style="color:var(--muted);font-weight:700">${i + 1}</td>
            <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[b.brand]||'#3B5BFE'};width:8px;height:8px"></span><strong>${b.brand}</strong></div></td>
            <td class="num">${fmtInt(b.total)}</td>
            <td class="num">${fmtPct(b.share)}</td>
            <td style="font-size:10px;color:var(--muted)">${i === 0 ? '👑 Market leader' : i < 3 ? '⚡ Major player' : '📍 Challenger'}</td>
          </tr>`).join("")}
        </table>
      </div>

      <div class="rp-table-section">
        <div class="rp-table-title">🟢 Best Regions for Market Entry</div>
        <p style="font-size:11px;color:var(--muted);margin-bottom:6px;line-height:1.4">Regions with the lowest competitive density — most room for a new entrant.</p>
        <table class="table">
          <tr><th>Region</th><th class="num">Stores</th><th class="num">Density</th><th class="num">Opportunity</th><th>Assessment</th></tr>
          ${d.regionInsights.slice(0, 5).map(r => `<tr>
            <td><strong>${r.label}</strong></td>
            <td class="num">${fmtInt(r.allCount)}</td>
            <td class="num">${r.density.toFixed(1)}</td>
            <td class="num">
              <div class="opp-bar-wrap">
                <div class="opp-bar" style="width:${r.opportunity}%;background:${r.opportunity > 65 ? '#43A047' : r.opportunity > 35 ? '#FF9800' : '#E53935'}"></div>
                <span>${r.opportunity}%</span>
              </div>
            </td>
            <td style="font-size:10px;color:var(--muted)">${r.advice}</td>
          </tr>`).join("")}
        </table>
      </div>

      <div class="rp-table-section">
        <div class="rp-table-title">🔴 Most Saturated Regions</div>
        <p style="font-size:11px;color:var(--muted);margin-bottom:6px;line-height:1.4">Avoid unless you have a strong differentiator. Established chains dominate here.</p>
        <table class="table">
          <tr><th>Region</th><th class="num">Stores</th><th class="num">Density</th><th>Warning</th></tr>
          ${e.mostCompetitive.map(r => `<tr>
            <td><strong>${r.label}</strong></td>
            <td class="num">${fmtInt(r.allCount)}</td>
            <td class="num" style="color:#E53935;font-weight:700">${r.density.toFixed(1)}</td>
            <td style="font-size:10px;color:var(--muted)">${r.density > d.avgDensity * 2 ? 'Extremely competitive — high barrier' : 'Above-average competition'}</td>
          </tr>`).join("")}
        </table>
      </div>

      <div class="rp-table-section">
        <div class="rp-table-title">🏙️ Best Cities for a New Entrant</div>
        <p style="font-size:11px;color:var(--muted);margin-bottom:6px;line-height:1.4">Cities with fewest competing chains — room for a new player to capture share.</p>
        <table class="table">
          <tr><th>City</th><th class="num">Chains</th><th class="num">Stores</th><th class="num">Score</th><th>Why</th></tr>
          ${d.whitespace.map(w => `<tr>
            <td><strong>${w.city}</strong></td>
            <td class="num">${w.focus}/${e.brandTotals.length}</td>
            <td class="num">${w.total}</td>
            <td class="num"><span class="opp-score ${w.score >= 75 ? 'high' : w.score >= 50 ? 'med' : 'low'}">${w.score}</span></td>
            <td style="font-size:10px;color:var(--muted)">${w.reason}</td>
          </tr>`).join("")}
        </table>
      </div>

      <div class="rp-table-section">
        <div class="rp-table-title">💡 Entry Strategy Insights</div>
        <div class="compare-insights">
          <div class="insight-card"><span class="insight-icon">📊</span>The QSR market in ${d.regionLabel} has <strong>${fmtInt(d.totalAll)} locations</strong> across ${e.brandTotals.length} chains. The market is <strong>${e.hhiLabel.toLowerCase()}</strong> (HHI: ${e.hhi})${e.hhi < 2500 ? ' — there is room for a new competitor.' : ' — dominated by top players.'}</div>
          <div class="insight-card"><span class="insight-icon">🎯</span>${e.underserved[0] ? `<strong>${e.underserved[0].label}</strong> has the lowest store density (${e.underserved[0].density.toFixed(1)}/1k km²) — ideal for a new entrant seeking low competition.` : 'All regions show moderate competition.'}</div>
          <div class="insight-card"><span class="insight-icon">⚠️</span>${e.mostCompetitive[0] ? `Avoid starting in <strong>${e.mostCompetitive[0].label}</strong> — density of ${e.mostCompetitive[0].density.toFixed(1)}/1k km² means heavy incumbent presence. Focus on underserved areas first.` : ''}</div>
          <div class="insight-card"><span class="insight-icon">🚀</span>A new entrant matching the average chain size would need ~<strong>${fmtInt(e.avgStoresPerBrand)} locations</strong> for national parity. Consider starting with ${Math.max(1, Math.round(e.avgStoresPerBrand * 0.1))}–${Math.round(e.avgStoresPerBrand * 0.2)} stores in the top opportunity regions.</div>
        </div>
      </div>
    `;
  } else {
    html = `
      <div class="guesstimate-badge">⚡ Guesstimate · Based on Real Store Data${hasHeatmap ? ' + Heatmap' : ''}</div>
      ${dataQualityNote}

      <div class="rp-kpi-grid" style="margin-bottom:12px">
        <div class="rp-kpi-card"><div class="rp-kpi-value">${fmtInt(d.focusTotal)}</div><div class="rp-kpi-label">${brandLabel} Stores</div></div>
        <div class="rp-kpi-card"><div class="rp-kpi-value">${fmtPct(d.nationalShare)}</div><div class="rp-kpi-label">National Share</div></div>
        <div class="rp-kpi-card"><div class="rp-kpi-value">${d.saturation}%</div><div class="rp-kpi-label">Market Saturation</div></div>
        <div class="rp-kpi-card"><div class="rp-kpi-value">${fmtInt(d.totalAll)}</div><div class="rp-kpi-label">Total Market</div></div>
      </div>

      ${hasHeatmap ? `
      <div class="rp-table-section">
        <div class="rp-table-title">💪 Strongest Regions for ${brandLabel}</div>
        <table class="table">
          <tr><th>Region</th><th class="num">${brandLabel}</th><th class="num">Competitors</th><th class="num">Share</th></tr>
          ${d.strongRegions.slice(0, 4).map(r => `<tr>
            <td>${r.label}</td>
            <td class="num" style="color:#43A047;font-weight:700">${fmtInt(r.focusCount)}</td>
            <td class="num">${fmtInt(r.compCount)}</td>
            <td class="num"><strong>${fmtPct(r.focusShare)}</strong></td>
          </tr>`).join("")}
        </table>
      </div>

      <div class="rp-table-section">
        <div class="rp-table-title">⚠️ Weakest Regions — Growth Targets</div>
        <table class="table">
          <tr><th>Region</th><th class="num">${brandLabel}</th><th class="num">Gap vs Avg</th><th>Advice</th></tr>
          ${d.weakRegions.slice(0, 4).map(r => {
            const gap = d.nationalShare > 0 ? Math.round((1 - r.focusShare / d.nationalShare) * 100) : 0;
            return `<tr>
              <td>${r.label}</td>
              <td class="num" style="color:#E53935;font-weight:700">${fmtInt(r.focusCount)}</td>
              <td class="num"><span class="opp-score low">-${gap}%</span></td>
              <td style="font-size:10px;color:var(--muted)">${r.advice}</td>
            </tr>`;
          }).join("")}
        </table>
      </div>
      ` : ''}

      <div class="rp-table-section">
        <div class="rp-table-title">🎯 Whitespace — Where to Expand ${brandLabel}</div>
        ${d.whitespace.length > 0 ? `
        <table class="table">
          <tr><th>City</th><th class="num">You</th><th class="num">Comp.</th><th class="num">Score</th><th>Why</th></tr>
          ${d.whitespace.map(w => `<tr>
            <td><strong>${w.city}</strong></td>
            <td class="num">${w.focus}</td>
            <td class="num">${w.comp}</td>
            <td class="num"><span class="opp-score ${w.score >= 75 ? 'high' : w.score >= 50 ? 'med' : 'low'}">${w.score}</span></td>
            <td style="font-size:10px;color:var(--muted)">${w.reason}</td>
          </tr>`).join("")}
        </table>
        ` : `<div class="rp-empty">Select a region or enable heatmap for whitespace analysis</div>`}
      </div>

      <div class="rp-table-section">
        <div class="rp-table-title">🗺️ Regional Opportunity Index</div>
        <table class="table">
          <tr><th>Region</th><th class="num">Stores</th><th class="num">Density</th><th class="num">Opportunity</th></tr>
          ${d.regionInsights.map(r => `<tr>
            <td>${r.label}</td>
            <td class="num">${fmtInt(r.totalSelected)}</td>
            <td class="num">${r.density.toFixed(1)}</td>
            <td class="num">
              <div class="opp-bar-wrap">
                <div class="opp-bar" style="width:${r.opportunity}%;background:${r.opportunity > 65 ? '#43A047' : r.opportunity > 35 ? '#FF9800' : '#E53935'}"></div>
                <span>${r.opportunity}%</span>
              </div>
            </td>
          </tr>`).join("")}
        </table>
      </div>
    `;
  }

  panel.innerHTML = html;
}

// ── Export ──
function exportFiltered(type) {
  const selected = selectedArr();
  const feats = state.locationsGeojson.features.filter(f => {
    const p = f.properties;
    return selected.includes(p.brand) && (!state.selectedRegion || p.region === state.selectedRegion);
  });
  if (type === "geojson") {
    downloadBlob(new Blob([JSON.stringify({ type: "FeatureCollection", features: feats }, null, 2)], { type: "application/geo+json" }), `explorer_${state.selectedRegion || "england"}.geojson`);
  } else {
    const header = ["brand", "id", "name", "city", "postcode", "region", "lon", "lat"];
    const lines = [header.join(",")];
    feats.forEach(f => {
      const p = f.properties;
      const [lon, lat] = f.geometry.coordinates;
      lines.push([p.brand, p.id, p.name, p.city, p.postcode, p.region, lon, lat].map(v => `"${String(v ?? "").replaceAll('"', '""')}"`).join(","));
    });
    downloadBlob(new Blob([lines.join("\n")], { type: "text/csv" }), `explorer_${state.selectedRegion || "england"}.csv`);
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// ── Wire UI ──
function wireUI() {
  document.querySelectorAll(".sidebar-btn[data-tab]").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
  document.querySelectorAll(".rp-tab").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));

  document.getElementById("countrySelect").addEventListener("change", e => setCountry(e.target.value));

  document.getElementById("regionSelect").addEventListener("change", e => {
    state.selectedRegion = e.target.value || null;
    state.selectedCity = null;
    buildCitySelect(state.selectedRegion);
    flyToRegion(state.selectedRegion);
    refreshAll();
  });

  document.getElementById("citySelect").addEventListener("change", e => {
    state.selectedCity = e.target.value || null;
    if (state.selectedCity) flyToCityOrData(state.selectedCity, state.selectedRegion);
    else if (state.selectedRegion) flyToRegion(state.selectedRegion);
    rebuildLocationsLayer();
  });

  document.getElementById("clearRegion").onclick = () => {
    state.selectedRegion = null;
    state.selectedCity = null;
    document.getElementById("regionSelect").value = "";
    document.getElementById("citySelectorWrap").style.display = "none";
    flyToRegion(null);
    refreshAll();
  };

  document.querySelectorAll(".metric-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".metric-toggle").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.metric = btn.dataset.metric;
      refreshAll();
    });
  });

  // Heatmap toggle
  document.getElementById("heatmapToggle").addEventListener("change", e => {
    state.heatmapMode = e.target.checked;
    document.getElementById("heatmapSettings").classList.toggle("hidden", !state.heatmapMode);
    buildHexLayer();
    updateLegend();
    if (state.guesstimateMode) refreshGuesstimate();
  });

  document.getElementById("primaryBrandSelect").addEventListener("change", e => {
    state.primaryBrand = e.target.value;
    buildHexLayer();
    if (state.guesstimateMode) refreshGuesstimate();
  });

  document.getElementById("compareModeSelect").addEventListener("change", e => {
    state.compareMode = e.target.value;
    document.getElementById("secondaryBrandRow").classList.toggle("hidden", e.target.value !== "pick");
    buildHexLayer();
    if (state.guesstimateMode) refreshGuesstimate();
  });

  document.getElementById("secondaryBrandSelect").addEventListener("change", e => {
    state.secondaryBrand = e.target.value;
    buildHexLayer();
    if (state.guesstimateMode) refreshGuesstimate();
  });

  // Guesstimate toggle
  document.getElementById("guesstimateToggle").addEventListener("change", e => {
    state.guesstimateMode = e.target.checked;
    buildHexLayer();
    updateLegend();
    if (state.guesstimateMode) refreshGuesstimate();
    else document.getElementById("guesstimatePanel").classList.add("hidden");
  });

  document.getElementById("selectAllBrands").onclick = () => setAllBrands(state.metrics.brands);
  document.getElementById("selectTop3Brands").onclick = () => {
    const top = Object.entries(state.metrics.brand_totals).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
    setAllBrands(top);
  };

  document.getElementById("exportCsv").onclick = () => exportFiltered("csv");
  document.getElementById("exportGeojson").onclick = () => exportFiltered("geojson");
}

// ── Main ──
async function main() {
  try {
    const t0 = performance.now();
    // Load all data in parallel
    const [metrics, regions, locations] = await Promise.all([
      loadJSON("metrics_england.json"),
      loadJSON("england_regions_simplified.geojson"),
      loadJSON("england_locations_min.geojson")
    ]);
    state.metrics = metrics;
    state.regionsGeojson = regions;
    state.locationsGeojson = locations;
    console.log(`⚡ Data loaded in ${(performance.now() - t0).toFixed(0)}ms`);

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
    computeUnlocatedStores();
    buildBrandList();
    buildRegionSelect();
    buildBrandSelects();
    wireUI();
    initMap();
    refreshAll();
  } catch (err) {
    console.error(err);
    alert("Failed to load data.\n\n" + err.message);
  }
}

main();
