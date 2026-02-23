
/* Country Explorer — interactive prototype (vanilla JS + Leaflet)
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
  locationsLayer: null
};

function formatInt(x){
  return new Intl.NumberFormat("en-GB").format(x);
}
function formatPct(x){
  return (x*100).toFixed(1) + "%";
}

// Light-theme blue color scale
function colorScale(value, max){
  if (!max || max <= 0) return "rgba(59,91,254,0.05)";
  const t = Math.min(1, Math.max(0, value / max));
  const a = 0.08 + 0.45 * t;
  return `rgba(59,91,254,${a})`;
}

async function loadJSON(path){
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function setTab(tab){
  document.querySelectorAll(".nav button").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  document.querySelector(".container").classList.toggle("hidden", tab !== "overview");
  document.getElementById("compareTab").classList.toggle("hidden", tab !== "compare");
  document.getElementById("exportTab").classList.toggle("hidden", tab !== "export");
  if (tab === "overview" && state.map){
    setTimeout(()=>state.map.invalidateSize(), 120);
  }
}

function buildBrandChips(){
  const wrap = document.getElementById("brandChips");
  wrap.innerHTML = "";
  const brands = state.metrics.brands;
  brands.forEach(b=>{
    const el = document.createElement("div");
    el.className = "chip active";
    el.textContent = b;
    el.onclick = ()=>{
      if (state.selectedBrands.has(b)){
        state.selectedBrands.delete(b);
        el.classList.remove("active");
      } else {
        state.selectedBrands.add(b);
        el.classList.add("active");
      }
      if (state.selectedBrands.size === 0){
        state.selectedBrands.add(b);
        el.classList.add("active");
      }
      refreshAll();
    };
    wrap.appendChild(el);
    state.selectedBrands.add(b);
  });
}

function selectedBrandsArray(){
  return Array.from(state.selectedBrands);
}

function regionValue(regionName){
  const counts = state.metrics.region_brand_counts[regionName] || {};
  const area = state.metrics.region_area_km2[regionName] || 1;
  let total = 0;
  selectedBrandsArray().forEach(b => total += (counts[b] || 0));
  if (state.metric === "count") return total;
  return total / (area/1000.0);
}

function computeMaxRegionValue(){
  let max = 0;
  state.metrics.regions.forEach(r=>{
    const v = regionValue(r);
    if (v > max) max = v;
  });
  return max;
}

function styleRegion(feature){
  const name = feature.properties.name;
  const v = regionValue(name);
  const max = computeMaxRegionValue();
  const isSelected = state.selectedRegion === name;
  return {
    weight: isSelected ? 2.5 : 1,
    color: isSelected ? "rgba(59,91,254,0.8)" : "rgba(0,0,0,0.15)",
    fillColor: colorScale(v, max),
    fillOpacity: 1.0
  };
}

function initMap(){
  const map = L.map('map', { zoomControl: true });
  state.map = map;
  map.setView([52.8, -1.6], 6);

  // Clean light basemap
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);

  const regionsLayer = L.geoJSON(state.regionsGeojson, {
    style: styleRegion,
    onEachFeature: (feature, layer)=>{
      const name = feature.properties.name;
      layer.on('click', ()=>{
        state.selectedRegion = (state.selectedRegion === name) ? null : name;
        refreshAll();
      });
      layer.bindTooltip(name, { sticky: true });
    }
  }).addTo(map);

  state.regionsLayer = regionsLayer;
}

function rebuildLocationsLayer(){
  if (state.locationsLayer){
    state.locationsLayer.remove();
    state.locationsLayer = null;
  }
  if (!state.selectedRegion) return;

  const selected = selectedBrandsArray();
  const feats = state.locationsGeojson.features.filter(f=>{
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

  const layer = L.geoJSON({type:"FeatureCollection", features: feats}, {
    pointToLayer: (feature, latlng)=> L.circleMarker(latlng, {
      radius: 5,
      weight: 1.5,
      color: "#fff",
      opacity: 1,
      fillColor: brandColors[feature.properties.brand] || "#3B5BFE",
      fillOpacity: 0.85
    }),
    onEachFeature: (feature, layer)=>{
      const p = feature.properties;
      const title = `<strong>${p.brand}</strong><br/>${p.name || ""}<br/><span style="color:#6b7394">${p.city || ""} ${p.postcode || ""}</span>`;
      layer.bindPopup(title);
    }
  });

  layer.addTo(state.map);
  state.locationsLayer = layer;
}

function refreshMap(){
  if (!state.regionsLayer) return;
  state.regionsLayer.setStyle(styleRegion);
  rebuildLocationsLayer();
}

function computeKPIs(){
  const selected = selectedBrandsArray();
  let total = 0;
  let london = 0;
  let regionsCovered = 0;
  const perRegion = {};
  state.metrics.regions.forEach(r=>{
    const counts = state.metrics.region_brand_counts[r] || {};
    let t=0;
    selected.forEach(b=> t += (counts[b] || 0));
    perRegion[r]=t;
    total += t;
    if (r === "London") london = t;
    if (t>0) regionsCovered += 1;
  });

  let bestRegion = null;
  let bestVal = -1;
  state.metrics.regions.forEach(r=>{
    const v = (state.metric === "count") ? perRegion[r] : (perRegion[r] / ((state.metrics.region_area_km2[r]||1)/1000));
    if (v > bestVal){ bestVal=v; bestRegion=r; }
  });

  return { total, london, regionsCovered, perRegion, bestRegion, bestVal };
}

function refreshKPIs(){
  const k = computeKPIs();
  document.getElementById("kpiTotal").textContent = formatInt(k.total);
  document.getElementById("kpiRegions").textContent = `${k.regionsCovered}/9`;
  document.getElementById("kpiDense").textContent = k.bestRegion || "—";
  document.getElementById("kpiLondonShare").textContent = k.total ? formatPct(k.london/k.total) : "—";
}

function refreshRegionPanel(){
  const badgeText = document.getElementById("selectedRegionText");
  badgeText.textContent = state.selectedRegion || "No region selected";

  if (!state.selectedRegion){
    document.getElementById("regionEmpty").classList.remove("hidden");
    document.getElementById("regionDetails").classList.add("hidden");
    document.getElementById("regionMetricText").textContent = "—";
    return;
  }

  document.getElementById("regionEmpty").classList.add("hidden");
  document.getElementById("regionDetails").classList.remove("hidden");

  const region = state.selectedRegion;
  const selected = selectedBrandsArray();
  const counts = state.metrics.region_brand_counts[region] || {};

  let total = 0;
  selected.forEach(b=> total += (counts[b] || 0));
  document.getElementById("regionTotal").textContent = formatInt(total);

  let topBrand = null, topVal=-1;
  selected.forEach(b=>{
    const v = counts[b] || 0;
    if (v > topVal){ topVal=v; topBrand=b; }
  });
  document.getElementById("regionTopBrand").textContent = topBrand || "—";
  document.getElementById("regionTopBrandHint").textContent = total ? `${formatPct(topVal/total)} of selected` : "—";

  const metricLabel = state.metric === "count" ? "Total locations" : "Locations per 1,000 km²";
  const value = regionValue(region);
  document.getElementById("regionMetricText").textContent = `${metricLabel}: ${state.metric === "count" ? formatInt(value) : value.toFixed(1)}`;

  const rows = selected.map(b=>({brand:b, count: (counts[b]||0)})).sort((a,b)=>b.count-a.count);
  const tbl = document.getElementById("regionBrandTable");
  tbl.innerHTML = `
    <tr><th>Brand</th><th class="num">Locations</th><th class="num">Share</th></tr>
    ${rows.map(r=>{
      const share = total ? r.count/total : 0;
      return `<tr><td>${r.brand}</td><td class="num">${formatInt(r.count)}</td><td class="num">${formatPct(share)}</td></tr>`;
    }).join("")}
  `;

  const feats = state.locationsGeojson.features.filter(f=>{
    const p=f.properties;
    return p.region === region && selected.includes(p.brand);
  });
  const cityCounts = {};
  feats.forEach(f=>{
    const c = (f.properties.city || "Unknown").trim();
    cityCounts[c] = (cityCounts[c]||0) + 1;
  });
  const topCities = Object.entries(cityCounts)
    .map(([city,count])=>({city,count}))
    .sort((a,b)=>b.count-a.count)
    .slice(0,8);

  const cityTbl = document.getElementById("regionCityTable");
  cityTbl.innerHTML = `
    <tr><th>City</th><th class="num">Locations</th></tr>
    ${topCities.map(r=>`<tr><td>${r.city}</td><td class="num">${formatInt(r.count)}</td></tr>`).join("")}
  `;
}

function refreshCompareTab(){
  const tbl = document.getElementById("compareTable");
  const brands = state.metrics.brands;
  const rows = brands.map(b=>{
    const total = state.metrics.brand_totals[b] || 0;
    const london = (state.metrics.region_brand_counts["London"]||{})[b] || 0;

    const shares = state.metrics.regions.map(r=>{
      const c = (state.metrics.region_brand_counts[r]||{})[b] || 0;
      return {region:r, count:c, share: total ? c/total : 0};
    }).sort((a,b)=>b.count-a.count);

    return {
      brand: b,
      total,
      londonShare: total ? london/total : 0,
      top1: shares[0],
      top2: shares[1]
    };
  }).sort((a,b)=>b.total-a.total);

  tbl.innerHTML = `
    <tr>
      <th>Brand</th>
      <th class="num">Locations</th>
      <th class="num">London share</th>
      <th>Top regions</th>
    </tr>
    ${rows.map(r=>{
      const top = `${r.top1.region} (${formatPct(r.top1.share)}) · ${r.top2.region} (${formatPct(r.top2.share)})`;
      return `<tr>
        <td><strong>${r.brand}</strong></td>
        <td class="num">${formatInt(r.total)}</td>
        <td class="num">${formatPct(r.londonShare)}</td>
        <td style="font-size:12px;color:var(--muted)">${top}</td>
      </tr>`;
    }).join("")}
  `;
}

function exportFiltered(type){
  const selected = selectedBrandsArray();
  const feats = state.locationsGeojson.features.filter(f=>{
    const p=f.properties;
    const regionOk = state.selectedRegion ? (p.region === state.selectedRegion) : true;
    return regionOk && selected.includes(p.brand);
  });

  if (type === "geojson"){
    const blob = new Blob([JSON.stringify({type:"FeatureCollection", features:feats}, null, 2)], {type:"application/geo+json"});
    downloadBlob(blob, `country_explorer_${state.selectedRegion||"england"}_${selected.length}brands.geojson`);
    return;
  }

  const header = ["brand","id","name","city","postcode","region","lon","lat"];
  const lines = [header.join(",")];
  feats.forEach(f=>{
    const p=f.properties;
    const [lon,lat] = f.geometry.coordinates;
    const row = [
      p.brand, p.id, p.name, p.city, p.postcode, p.region,
      lon, lat
    ].map(v=>{
      const s = (v===null || v===undefined) ? "" : String(v);
      const escaped = s.replaceAll('"','""');
      return `"${escaped}"`;
    }).join(",");
    lines.push(row);
  });
  const blob = new Blob([lines.join("\n")], {type:"text/csv"});
  downloadBlob(blob, `country_explorer_${state.selectedRegion||"england"}_${selected.length}brands.csv`);
}

function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function wireUI(){
  document.querySelectorAll(".nav button").forEach(b=>{
    b.addEventListener("click", ()=> setTab(b.dataset.tab));
  });

  document.getElementById("metricSelect").addEventListener("change", (e)=>{
    state.metric = e.target.value;
    refreshAll();
  });

  document.getElementById("clearRegion").onclick = ()=>{
    state.selectedRegion = null;
    refreshAll();
  };
  document.getElementById("selectAllBrands").onclick = ()=>{
    state.selectedBrands = new Set(state.metrics.brands);
    document.querySelectorAll("#brandChips .chip").forEach(ch=> ch.classList.add("active"));
    refreshAll();
  };
  document.getElementById("selectTop3Brands").onclick = ()=>{
    const top = Object.entries(state.metrics.brand_totals)
      .sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
    state.selectedBrands = new Set(top);
    document.querySelectorAll("#brandChips .chip").forEach(ch=>{
      ch.classList.toggle("active", top.includes(ch.textContent));
    });
    refreshAll();
  };

  document.getElementById("exportCsv").onclick = ()=> exportFiltered("csv");
  document.getElementById("exportGeojson").onclick = ()=> exportFiltered("geojson");
}

function refreshAll(){
  refreshKPIs();
  refreshMap();
  refreshRegionPanel();
  refreshCompareTab();
}

async function main(){
  try{
    state.metrics = await loadJSON("metrics_england.json");
    document.getElementById("snapshotDate").textContent = state.metrics.snapshot_date;

    state.regionsGeojson = await loadJSON("england_regions_simplified.geojson");
    state.locationsGeojson = await loadJSON("england_locations_min.geojson");

    buildBrandChips();
    wireUI();
    initMap();
    refreshAll();

  }catch(err){
    console.error(err);
    alert("Failed to load data. Please ensure all data files are present.\n\nError: " + err.message);
  }
}

main();
