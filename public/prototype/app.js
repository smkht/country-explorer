/* Country Explorer — interactive prototype (vanilla JS + Leaflet + Turf.js hex grid)
   Data files (local):
   - england_regions_simplified.geojson
   - england_locations_min.geojson
   - metrics_england.json
*/

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
  hexLayer: null
};

function formatInt(x) {
  return new Intl.NumberFormat("en-GB").format(x);
}
function formatPct(x) {
  return (x * 100).toFixed(1) + "%";
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

// ── Hex grid color scale ──
function hexColor(count, max) {
  if (!max || max <= 0 || count === 0) return "rgba(59,91,254,0.04)";
  const t = Math.min(1, Math.max(0, count / max));
  // Gradient: light blue → medium blue → deep blue
  const h = 230;
  const s = 80 + 15 * t;
  const l = 92 - 52 * t;
  const a = 0.25 + 0.55 * t;
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

function hexBorder(count, max) {
  if (!max || count === 0) return "rgba(59,91,254,0.08)";
  const t = Math.min(1, Math.max(0, count / max));
  return `rgba(59,91,254,${0.1 + 0.4 * t})`;
}

// ── Tab switching ──
function setTab(tab) {
  document.querySelectorAll(".sidebar-btn[data-tab]").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === tab)
  );
  document.querySelectorAll(".rp-tab").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === tab)
  );
  document.getElementById("overviewContent").classList.toggle("hidden", tab !== "overview");
  document.getElementById("compareContent").classList.toggle("hidden", tab !== "compare");
  document.getElementById("exportContent").classList.toggle("hidden", tab !== "export");

  if (tab === "overview" && state.map) {
    setTimeout(() => state.map.invalidateSize(), 120);
  }
}

// ── Build brand chips ──
function buildBrandChips() {
  const wrap = document.getElementById("brandChips");
  wrap.innerHTML = "";
  const brands = state.metrics.brands;
  brands.forEach(b => {
    const el = document.createElement("div");
    el.className = "chip active";
    el.textContent = b;
    el.onclick = () => {
      if (state.selectedBrands.has(b)) {
        state.selectedBrands.delete(b);
        el.classList.remove("active");
      } else {
        state.selectedBrands.add(b);
        el.classList.add("active");
      }
      if (state.selectedBrands.size === 0) {
        state.selectedBrands.add(b);
        el.classList.add("active");
      }
      updateBrandLabel();
      refreshAll();
    };
    wrap.appendChild(el);
    state.selectedBrands.add(b);
  });
  updateBrandLabel();
}

function updateBrandLabel() {
  const label = document.getElementById("brandFilterLabel");
  const total = state.metrics.brands.length;
  const selected = state.selectedBrands.size;
  label.textContent = selected === total ? "All Brands" : `${selected} Brand${selected > 1 ? 's' : ''}`;
}

function selectedBrandsArray() {
  return Array.from(state.selectedBrands);
}

// ── Region values ──
function regionValue(regionName) {
  const counts = state.metrics.region_brand_counts[regionName] || {};
  const area = state.metrics.region_area_km2[regionName] || 1;
  let total = 0;
  selectedBrandsArray().forEach(b => total += (counts[b] || 0));
  if (state.metric === "count") return total;
  return total / (area / 1000.0);
}

function computeMaxRegionValue() {
  let max = 0;
  state.metrics.regions.forEach(r => {
    const v = regionValue(r);
    if (v > max) max = v;
  });
  return max;
}

// ── Map init ──
function initMap() {
  const map = L.map('map', { zoomControl: true, zoomSnap: 0.5 });
  state.map = map;
  map.setView([52.8, -1.6], 6.5);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);

  // Add thin region boundaries (just outlines, no fill)
  state.regionsLayer = L.geoJSON(state.regionsGeojson, {
    style: () => ({
      weight: 1,
      color: "rgba(0,0,0,0.12)",
      fillColor: "transparent",
      fillOpacity: 0
    }),
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name;
      layer.on('click', () => {
        state.selectedRegion = (state.selectedRegion === name) ? null : name;
        refreshAll();
      });
      layer.bindTooltip(name, { sticky: true });
    }
  }).addTo(map);

  buildHexLayer();
}

// ── Honeycomb hex grid ──
function buildHexLayer() {
  if (state.hexLayer) {
    state.hexLayer.remove();
    state.hexLayer = null;
  }

  const selected = selectedBrandsArray();
  const locations = state.locationsGeojson.features.filter(f =>
    selected.includes(f.properties.brand) &&
    (!state.selectedRegion || f.properties.region === state.selectedRegion)
  );

  if (locations.length === 0) return;

  // Compute bounding box of England
  const bbox = [-6.5, 49.8, 2.0, 56.0]; // [west, south, east, north]
  const cellSide = state.selectedRegion ? 3 : 12; // km — smaller hexes when zoomed in

  // Generate hex grid
  const hexGrid = turf.hexGrid(bbox, cellSide, { units: 'kilometers' });

  // Count locations per hex
  const points = turf.featureCollection(
    locations.map(f => turf.point(f.geometry.coordinates, f.properties))
  );

  let maxCount = 0;
  hexGrid.features.forEach(hex => {
    const pts = turf.pointsWithinPolygon(points, hex);
    hex.properties.count = pts.features.length;
    if (hex.properties.count > maxCount) maxCount = hex.properties.count;
  });

  // Only show hexes with locations
  const nonEmpty = hexGrid.features.filter(h => h.properties.count > 0);

  state.hexLayer = L.geoJSON({ type: "FeatureCollection", features: nonEmpty }, {
    style: feature => ({
      fillColor: hexColor(feature.properties.count, maxCount),
      fillOpacity: 1,
      weight: 1,
      color: hexBorder(feature.properties.count, maxCount),
      opacity: 1
    }),
    onEachFeature: (feature, layer) => {
      layer.bindTooltip(`${feature.properties.count} location${feature.properties.count !== 1 ? 's' : ''}`, {
        sticky: true
      });
    }
  }).addTo(state.map);

  // Make sure region outlines are on top
  if (state.regionsLayer) state.regionsLayer.bringToFront();
}

// ── Locations layer (when region selected) ──
function rebuildLocationsLayer() {
  if (state.locationsLayer) {
    state.locationsLayer.remove();
    state.locationsLayer = null;
  }
  if (!state.selectedRegion) return;

  const selected = selectedBrandsArray();
  const feats = state.locationsGeojson.features.filter(f => {
    const p = f.properties;
    return p.region === state.selectedRegion && selected.includes(p.brand);
  });

  const brandColors = {
    "Domino's": "#3B5BFE",
    "KFC": "#E53935",
    "McDonald's": "#F9A825",
    "Nando's": "#FF6D00",
    "Papa Johns": "#43A047",
    "Subway": "#00897B"
  };

  state.locationsLayer = L.geoJSON({ type: "FeatureCollection", features: feats }, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
      radius: 5,
      weight: 1.5,
      color: "#fff",
      opacity: 1,
      fillColor: brandColors[feature.properties.brand] || "#3B5BFE",
      fillOpacity: 0.85
    }),
    onEachFeature: (feature, layer) => {
      const p = feature.properties;
      layer.bindPopup(`<strong>${p.brand}</strong><br/>${p.name || ""}<br/><span style="color:#6b7394">${p.city || ""} ${p.postcode || ""}</span>`);
    }
  }).addTo(state.map);
}

// ── Refresh functions ──
function refreshMap() {
  buildHexLayer();
  rebuildLocationsLayer();
}

function computeKPIs() {
  const selected = selectedBrandsArray();
  let total = 0, london = 0, regionsCovered = 0;
  const perRegion = {};
  state.metrics.regions.forEach(r => {
    const counts = state.metrics.region_brand_counts[r] || {};
    let t = 0;
    selected.forEach(b => t += (counts[b] || 0));
    perRegion[r] = t;
    total += t;
    if (r === "London") london = t;
    if (t > 0) regionsCovered += 1;
  });

  let bestRegion = null, bestVal = -1;
  state.metrics.regions.forEach(r => {
    const v = (state.metric === "count") ? perRegion[r] : (perRegion[r] / ((state.metrics.region_area_km2[r] || 1) / 1000));
    if (v > bestVal) { bestVal = v; bestRegion = r; }
  });

  return { total, london, regionsCovered, perRegion, bestRegion, bestVal };
}

function refreshKPIs() {
  const k = computeKPIs();
  document.getElementById("kpiTotal").textContent = formatInt(k.total);
  document.getElementById("kpiRegions").textContent = `${k.regionsCovered}/9`;
  document.getElementById("kpiDense").textContent = k.bestRegion || "—";
  document.getElementById("kpiLondonShare").textContent = k.total ? formatPct(k.london / k.total) : "—";
}

function refreshRegionPanel() {
  const text = document.getElementById("selectedRegionText");
  const clearBtn = document.getElementById("clearRegion");
  const regionDropdownText = document.getElementById("regionDropdownText");

  if (!state.selectedRegion) {
    text.textContent = "Click a region to drill down";
    clearBtn.classList.add("hidden");
    regionDropdownText.textContent = "All Regions";
    document.getElementById("regionEmpty").classList.remove("hidden");
    document.getElementById("regionDetails").classList.add("hidden");
    return;
  }

  text.textContent = state.selectedRegion;
  clearBtn.classList.remove("hidden");
  regionDropdownText.textContent = state.selectedRegion;
  document.getElementById("regionEmpty").classList.add("hidden");
  document.getElementById("regionDetails").classList.remove("hidden");

  const region = state.selectedRegion;
  const selected = selectedBrandsArray();
  const counts = state.metrics.region_brand_counts[region] || {};

  let total = 0;
  selected.forEach(b => total += (counts[b] || 0));
  document.getElementById("regionTotal").textContent = formatInt(total);

  let topBrand = null, topVal = -1;
  selected.forEach(b => {
    const v = counts[b] || 0;
    if (v > topVal) { topVal = v; topBrand = b; }
  });
  document.getElementById("regionTopBrand").textContent = topBrand || "—";
  document.getElementById("regionTopBrandHint").textContent = total ? `${formatPct(topVal / total)} of total` : "Top Brand";

  const rows = selected.map(b => ({ brand: b, count: (counts[b] || 0) })).sort((a, b) => b.count - a.count);
  document.getElementById("regionBrandTable").innerHTML = `
    <tr><th>Brand</th><th class="num">Locations</th><th class="num">Share</th></tr>
    ${rows.map(r => {
      const share = total ? r.count / total : 0;
      return `<tr><td>${r.brand}</td><td class="num">${formatInt(r.count)}</td><td class="num">${formatPct(share)}</td></tr>`;
    }).join("")}
  `;

  const feats = state.locationsGeojson.features.filter(f => {
    const p = f.properties;
    return p.region === region && selected.includes(p.brand);
  });
  const cityCounts = {};
  feats.forEach(f => {
    const c = (f.properties.city || "Unknown").trim();
    cityCounts[c] = (cityCounts[c] || 0) + 1;
  });
  const topCities = Object.entries(cityCounts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  document.getElementById("regionCityTable").innerHTML = `
    <tr><th>City</th><th class="num">Locations</th></tr>
    ${topCities.map(r => `<tr><td>${r.city}</td><td class="num">${formatInt(r.count)}</td></tr>`).join("")}
  `;
}

function refreshCompareTab() {
  const brands = state.metrics.brands;
  const rows = brands.map(b => {
    const total = state.metrics.brand_totals[b] || 0;
    const london = (state.metrics.region_brand_counts["London"] || {})[b] || 0;
    const shares = state.metrics.regions.map(r => {
      const c = (state.metrics.region_brand_counts[r] || {})[b] || 0;
      return { region: r, count: c, share: total ? c / total : 0 };
    }).sort((a, b) => b.count - a.count);
    return { brand: b, total, londonShare: total ? london / total : 0, top1: shares[0], top2: shares[1] };
  }).sort((a, b) => b.total - a.total);

  document.getElementById("compareTable").innerHTML = `
    <tr><th>#</th><th>Brand</th><th class="num">Locations</th><th class="num">London %</th><th>Top Regions</th></tr>
    ${rows.map((r, i) => {
      const top = `${r.top1.region} (${formatPct(r.top1.share)})`;
      return `<tr>
        <td style="color:var(--muted)">${i + 1}</td>
        <td><strong>${r.brand}</strong></td>
        <td class="num">${formatInt(r.total)}</td>
        <td class="num">${formatPct(r.londonShare)}</td>
        <td style="font-size:12px;color:var(--muted)">${top}</td>
      </tr>`;
    }).join("")}
  `;
}

// ── Export ──
function exportFiltered(type) {
  const selected = selectedBrandsArray();
  const feats = state.locationsGeojson.features.filter(f => {
    const p = f.properties;
    const regionOk = state.selectedRegion ? (p.region === state.selectedRegion) : true;
    return regionOk && selected.includes(p.brand);
  });

  if (type === "geojson") {
    const blob = new Blob([JSON.stringify({ type: "FeatureCollection", features: feats }, null, 2)], { type: "application/geo+json" });
    downloadBlob(blob, `country_explorer_${state.selectedRegion || "england"}.geojson`);
    return;
  }

  const header = ["brand", "id", "name", "city", "postcode", "region", "lon", "lat"];
  const lines = [header.join(",")];
  feats.forEach(f => {
    const p = f.properties;
    const [lon, lat] = f.geometry.coordinates;
    lines.push([p.brand, p.id, p.name, p.city, p.postcode, p.region, lon, lat]
      .map(v => `"${String(v ?? "").replaceAll('"', '""')}"`)
      .join(","));
  });
  downloadBlob(new Blob([lines.join("\n")], { type: "text/csv" }), `country_explorer_${state.selectedRegion || "england"}.csv`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ── Wire UI ──
function wireUI() {
  // Sidebar tabs
  document.querySelectorAll(".sidebar-btn[data-tab]").forEach(b =>
    b.addEventListener("click", () => setTab(b.dataset.tab))
  );
  // Right panel tabs
  document.querySelectorAll(".rp-tab").forEach(b =>
    b.addEventListener("click", () => setTab(b.dataset.tab))
  );

  document.getElementById("metricSelect").addEventListener("change", e => {
    state.metric = e.target.value;
    refreshAll();
  });

  document.getElementById("clearRegion").onclick = () => {
    state.selectedRegion = null;
    refreshAll();
  };

  document.getElementById("exportCsv").onclick = () => exportFiltered("csv");
  document.getElementById("exportGeojson").onclick = () => exportFiltered("geojson");
}

function refreshAll() {
  refreshKPIs();
  refreshMap();
  refreshRegionPanel();
  refreshCompareTab();
}

async function main() {
  try {
    state.metrics = await loadJSON("metrics_england.json");
    state.regionsGeojson = await loadJSON("england_regions_simplified.geojson");
    state.locationsGeojson = await loadJSON("england_locations_min.geojson");

    buildBrandChips();
    wireUI();
    initMap();
    refreshAll();
  } catch (err) {
    console.error(err);
    alert("Failed to load data.\n\nError: " + err.message);
  }
}

main();
