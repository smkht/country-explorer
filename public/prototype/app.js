/* Country Explorer — vanilla JS + Leaflet + Turf.js honeycomb */

const BRAND_COLORS = {
  "Domino's": "#3B5BFE",
  "KFC": "#E53935",
  "McDonald's": "#F9A825",
  "Nando's": "#FF6D00",
  "Papa Johns": "#43A047",
  "Subway": "#00897B"
};

const state = {
  selectedBrands: new Set(),
  metric: "count",
  selectedRegion: null,
  metrics: null,
  regionsGeojson: null,
  locationsGeojson: null,
  map: null,
  regionsLayer: null,
  locationsLayer: null,
  hexLayer: null,
  hexDebounce: null
};

// ── Helpers ──
const fmtInt = x => new Intl.NumberFormat("en-GB").format(x);
const fmtPct = x => (x * 100).toFixed(1) + "%";

async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Failed: ${path}`);
  return r.json();
}

// ── Hex color based on density ──
function hexFill(count, max) {
  if (!max || count === 0) return "hsla(230,80%,95%,0.15)";
  const t = Math.min(1, count / max);
  const l = 90 - 50 * t;
  const a = 0.3 + 0.55 * t;
  return `hsla(230,85%,${l}%,${a})`;
}
function hexStroke(count, max) {
  if (!max || count === 0) return "rgba(59,91,254,0.06)";
  const t = Math.min(1, count / max);
  return `rgba(59,91,254,${0.08 + 0.35 * t})`;
}

// ── Compute hex cell size from zoom level ──
function cellSizeForZoom(zoom) {
  // Adaptive: smaller hexes as you zoom in
  if (zoom >= 12) return 1;
  if (zoom >= 11) return 1.5;
  if (zoom >= 10) return 2.5;
  if (zoom >= 9) return 4;
  if (zoom >= 8) return 6;
  if (zoom >= 7) return 10;
  return 15;
}

// ── Tab switching ──
function setTab(tab) {
  document.querySelectorAll(".sidebar-btn[data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".rp-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.getElementById("overviewContent").classList.toggle("hidden", tab !== "overview");
  document.getElementById("compareContent").classList.toggle("hidden", tab !== "compare");
  document.getElementById("exportContent").classList.toggle("hidden", tab !== "export");
  if (tab === "overview" && state.map) setTimeout(() => state.map.invalidateSize(), 100);
}

// ── Brand list (rich items with color dots + checkboxes) ──
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
      if (state.selectedBrands.has(b)) {
        state.selectedBrands.delete(b);
        el.classList.add("inactive");
      } else {
        state.selectedBrands.add(b);
        el.classList.remove("inactive");
      }
      // Don't allow 0 brands
      if (state.selectedBrands.size === 0) {
        state.selectedBrands.add(b);
        el.classList.remove("inactive");
      }
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

// ── Region selector ──
function buildRegionSelect() {
  const sel = document.getElementById("regionSelect");
  state.metrics.regions.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r.replace(" (England)", "");
    sel.appendChild(opt);
  });
}

// ── Selected brands helper ──
const selectedArr = () => Array.from(state.selectedBrands);

// ── Region value ──
function regionValue(regionName) {
  const counts = state.metrics.region_brand_counts[regionName] || {};
  const area = state.metrics.region_area_km2[regionName] || 1;
  let total = 0;
  selectedArr().forEach(b => total += (counts[b] || 0));
  return state.metric === "count" ? total : total / (area / 1000);
}

// ── Map ──
function initMap() {
  const map = L.map('map', { zoomControl: true, zoomSnap: 0.5 });
  state.map = map;
  map.setView([52.8, -1.5], 6.5);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap © CARTO'
  }).addTo(map);

  // Thin region boundaries
  state.regionsLayer = L.geoJSON(state.regionsGeojson, {
    style: () => ({ weight: 1.2, color: "rgba(0,0,0,0.1)", fillColor: "transparent", fillOpacity: 0 }),
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name;
      layer.on('click', () => {
        state.selectedRegion = (state.selectedRegion === name) ? null : name;
        document.getElementById("regionSelect").value = state.selectedRegion || "";
        refreshAll();
      });
      layer.bindTooltip(name.replace(" (England)", ""), { sticky: true });
    }
  }).addTo(map);

  // Build initial hexes
  buildHexLayer();

  // Rebuild hexes on zoom (debounced)
  map.on('zoomend', () => {
    clearTimeout(state.hexDebounce);
    state.hexDebounce = setTimeout(() => buildHexLayer(), 150);
  });

  // Also rebuild on move end at higher zoom levels for viewport culling
  map.on('moveend', () => {
    if (map.getZoom() >= 8) {
      clearTimeout(state.hexDebounce);
      state.hexDebounce = setTimeout(() => buildHexLayer(), 200);
    }
  });
}

// ── Honeycomb layer ──
function buildHexLayer() {
  if (state.hexLayer) { state.hexLayer.remove(); state.hexLayer = null; }

  const map = state.map;
  if (!map) return;

  const zoom = map.getZoom();
  const cellSize = cellSizeForZoom(zoom);
  const selected = selectedArr();

  // Filter locations
  const locations = state.locationsGeojson.features.filter(f =>
    selected.includes(f.properties.brand) &&
    (!state.selectedRegion || f.properties.region === state.selectedRegion)
  );
  if (locations.length === 0) return;

  // Use visible bounds + some padding for performance at high zoom
  let bbox;
  if (zoom >= 8) {
    const b = map.getBounds().pad(0.2);
    bbox = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
  } else {
    bbox = [-6.5, 49.5, 2.5, 56.5];
  }

  const hexGrid = turf.hexGrid(bbox, cellSize, { units: 'kilometers' });
  const points = turf.featureCollection(
    locations.map(f => turf.point(f.geometry.coordinates, f.properties))
  );

  let maxCount = 0;
  hexGrid.features.forEach(hex => {
    const pts = turf.pointsWithinPolygon(points, hex);
    hex.properties.count = pts.features.length;
    if (hex.properties.count > maxCount) maxCount = hex.properties.count;
  });

  const nonEmpty = hexGrid.features.filter(h => h.properties.count > 0);

  state.hexLayer = L.geoJSON({ type: "FeatureCollection", features: nonEmpty }, {
    style: f => ({
      fillColor: hexFill(f.properties.count, maxCount),
      fillOpacity: 1,
      weight: 1,
      color: hexStroke(f.properties.count, maxCount),
      opacity: 1
    }),
    onEachFeature: (feature, layer) => {
      const c = feature.properties.count;
      layer.bindTooltip(`${c} location${c !== 1 ? 's' : ''}`, { sticky: true });
    }
  }).addTo(map);

  if (state.regionsLayer) state.regionsLayer.bringToFront();
  if (state.locationsLayer) state.locationsLayer.bringToFront();
}

// ── Individual location markers (when zoomed in on a region) ──
function rebuildLocationsLayer() {
  if (state.locationsLayer) { state.locationsLayer.remove(); state.locationsLayer = null; }
  if (!state.selectedRegion) return;

  const selected = selectedArr();
  const feats = state.locationsGeojson.features.filter(f => {
    const p = f.properties;
    return p.region === state.selectedRegion && selected.includes(p.brand);
  });

  state.locationsLayer = L.geoJSON({ type: "FeatureCollection", features: feats }, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
      radius: 5, weight: 1.5, color: "#fff", opacity: 1,
      fillColor: BRAND_COLORS[feature.properties.brand] || "#3B5BFE",
      fillOpacity: 0.85
    }),
    onEachFeature: (feature, layer) => {
      const p = feature.properties;
      layer.bindPopup(`<strong>${p.brand}</strong><br/>${p.name || ""}<br/><span style="color:#6b7394">${p.city || ""} ${p.postcode || ""}</span>`);
    }
  }).addTo(state.map);
}

// ── Refresh all data ──
function refreshAll() {
  refreshKPIs();
  buildHexLayer();
  rebuildLocationsLayer();
  refreshRegionPanel();
  refreshCompareTab();
  refreshExportInfo();
}

function refreshKPIs() {
  const selected = selectedArr();
  let total = 0, london = 0, regionsCovered = 0;
  let bestRegion = null, bestVal = -1;

  state.metrics.regions.forEach(r => {
    const counts = state.metrics.region_brand_counts[r] || {};
    let t = 0;
    selected.forEach(b => t += (counts[b] || 0));
    total += t;
    if (r === "London") london = t;
    if (t > 0) regionsCovered++;
    const v = state.metric === "count" ? t : t / ((state.metrics.region_area_km2[r] || 1) / 1000);
    if (v > bestVal) { bestVal = v; bestRegion = r; }
  });

  document.getElementById("kpiTotal").textContent = fmtInt(total);
  document.getElementById("kpiRegions").textContent = `${regionsCovered}/9`;
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

  // Brand table with color dots
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

  // Cities
  const feats = state.locationsGeojson.features.filter(f => f.properties.region === region && selected.includes(f.properties.brand));
  const cityCounts = {};
  feats.forEach(f => { const c = (f.properties.city || "Unknown").trim(); cityCounts[c] = (cityCounts[c] || 0) + 1; });
  const topCities = Object.entries(cityCounts).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 8);

  document.getElementById("regionCityTable").innerHTML = `
    <tr><th>City</th><th class="num">Locations</th></tr>
    ${topCities.map(r => `<tr><td>${r.city}</td><td class="num">${fmtInt(r.count)}</td></tr>`).join("")}
  `;
}

function refreshCompareTab() {
  const brands = state.metrics.brands;
  const rows = brands.map(b => {
    const total = state.metrics.brand_totals[b] || 0;
    const london = (state.metrics.region_brand_counts["London"] || {})[b] || 0;
    const shares = state.metrics.regions.map(r => {
      const c = (state.metrics.region_brand_counts[r] || {})[b] || 0;
      return { region: r.replace(" (England)", ""), count: c, share: total ? c / total : 0 };
    }).sort((a, b) => b.count - a.count);
    return { brand: b, total, londonShare: total ? london / total : 0, top1: shares[0] };
  }).sort((a, b) => b.total - a.total);

  document.getElementById("compareTable").innerHTML = `
    <tr><th>#</th><th>Brand</th><th class="num">Total</th><th class="num">London %</th><th>Top Region</th></tr>
    ${rows.map((r, i) => `<tr>
      <td style="color:var(--muted)">${i + 1}</td>
      <td><div class="brand-dot-cell"><span class="brand-dot" style="background:${BRAND_COLORS[r.brand]||'#3B5BFE'};width:8px;height:8px"></span><strong>${r.brand}</strong></div></td>
      <td class="num">${fmtInt(r.total)}</td>
      <td class="num">${fmtPct(r.londonShare)}</td>
      <td style="font-size:11px;color:var(--muted)">${r.top1.region} (${fmtPct(r.top1.share)})</td>
    </tr>`).join("")}
  `;
}

function refreshExportInfo() {
  const selected = selectedArr();
  document.getElementById("exportBrandsInfo").textContent = selected.length === state.metrics.brands.length ? "All brands" : selected.join(", ");
  document.getElementById("exportRegionInfo").textContent = state.selectedRegion ? state.selectedRegion.replace(" (England)", "") : "All England";

  const feats = state.locationsGeojson.features.filter(f => {
    const p = f.properties;
    return selected.includes(p.brand) && (!state.selectedRegion || p.region === state.selectedRegion);
  });
  document.getElementById("exportCountInfo").textContent = fmtInt(feats.length);
}

// ── Export ──
function exportFiltered(type) {
  const selected = selectedArr();
  const feats = state.locationsGeojson.features.filter(f => {
    const p = f.properties;
    return selected.includes(p.brand) && (!state.selectedRegion || p.region === state.selectedRegion);
  });

  if (type === "geojson") {
    const blob = new Blob([JSON.stringify({ type: "FeatureCollection", features: feats }, null, 2)], { type: "application/geo+json" });
    downloadBlob(blob, `explorer_${state.selectedRegion || "england"}.geojson`);
    return;
  }

  const header = ["brand", "id", "name", "city", "postcode", "region", "lon", "lat"];
  const lines = [header.join(",")];
  feats.forEach(f => {
    const p = f.properties;
    const [lon, lat] = f.geometry.coordinates;
    lines.push([p.brand, p.id, p.name, p.city, p.postcode, p.region, lon, lat]
      .map(v => `"${String(v ?? "").replaceAll('"', '""')}"`).join(","));
  });
  downloadBlob(new Blob([lines.join("\n")], { type: "text/csv" }), `explorer_${state.selectedRegion || "england"}.csv`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// ── Wire UI ──
function wireUI() {
  document.querySelectorAll(".sidebar-btn[data-tab]").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
  document.querySelectorAll(".rp-tab").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));

  // Metric toggles
  document.querySelectorAll(".metric-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".metric-toggle").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.metric = btn.dataset.metric;
      refreshAll();
    });
  });

  // Region select
  document.getElementById("regionSelect").addEventListener("change", e => {
    state.selectedRegion = e.target.value || null;
    refreshAll();
  });

  // Clear region
  document.getElementById("clearRegion").onclick = () => {
    state.selectedRegion = null;
    document.getElementById("regionSelect").value = "";
    refreshAll();
  };

  // Brand quick-select
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
    state.metrics = await loadJSON("metrics_england.json");
    state.regionsGeojson = await loadJSON("england_regions_simplified.geojson");
    state.locationsGeojson = await loadJSON("england_locations_min.geojson");

    buildBrandList();
    buildRegionSelect();
    wireUI();
    initMap();
    refreshAll();
  } catch (err) {
    console.error(err);
    alert("Failed to load data.\n\n" + err.message);
  }
}

main();
