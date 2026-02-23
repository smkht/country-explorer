# Country Explorer — One-Pager

**Feature proposal · Getplace**
Great Britain dataset: 6 brands, 5,718 locations, 9 regions · Feb 2026

---

## 1. Product Concept

**For** strategy & expansion teams at restaurant chains who need to understand competitor presence by region.

**Problem:** answering "where do competitors operate and where is whitespace" requires manual maps and spreadsheets.

**Use cases:** market entry planning (rank cities by density), quarterly monitoring (openings/closures), head-to-head benchmarking.

**MVP:** choropleth map, region drilldown, brand comparison scorecard, CSV/GeoJSON export.

**Later:** competitive heatmap, guesstimate engine, openings/closures timeline, delivery zones, predictive expansion.

---

## 2. Interactive Prototype

Built in Lovable (React + Tailwind). Landing page (hero, problem cards, feature tiles with screenshots, data proof, CTA) + explorer app with 4 tabs: **Overview** (hex map, filters, region drilldown), **Deep Review** (heatmap + guesstimate), **Compare** (market share, regional matrix, concentration, auto-insights), **Export** (CSV/GeoJSON).

Phase 2 previewed: heatmap mode (red/green competitive win-lose) and guesstimate engine (saturation scores, gap analysis, expansion advice) — shown as toggles in Deep Review tab.

---

## 3. Roadmap

| Phase | When | What | Why this order |
|-------|------|------|----------------|
| 1 — MVP | Wk 1–6 | Overview tab: hex choropleth map, region drilldown (brand mix, top cities), brand filters + KPIs. CSV/GeoJSON export. Permissions + QA. | Delivers core "who operates where" with clean data. No derived metrics needing tuning. |
| 2 — Smart layers | Wk 7–12 | Competitive heatmap (win/lose per hex). Guesstimate engine (saturation, whitespace, expansion advice). City-level explorer. | Needs normalized data + calibration from client feedback. Phase 1 gives tuning time. |
| 3 — Monitoring | Mo 4–6 | Store history (opened/closed), timeline + alerts, population enrichment, scheduled reporting. | Requires stable location IDs + change detection. Creates weekly login habit. |
| 4 — Deep CI | Mo 6+ | Delivery zone overlap, price/visibility index, predictive expansion, automated insights, API. | Upsell surface + deep lock-in. Builds on all prior infrastructure. |

---

## 4. Monetization

Entry point for enterprise deals — easy to demo. Monitoring = weekly retention. Gateway to upsell deeper products (delivery zones, visibility, pricing).

**Packaging:** basic CE in Pro, smart layers + monitoring in Enterprise; or per-country module pricing.

**KPIs:** activation >60%, weekly engagement, monitoring upsell >25%.

---

## 5. Dev Documentation

**Stack:** React 18 + Vite + Tailwind CSS + TypeScript. UI: shadcn/ui components. Animations: framer-motion. Routing: react-router-dom. Backend: Supabase (auth, DB, edge functions, storage).

**Routes:** `/` — marketing landing page (static, no auth). `/explorer` — interactive dashboard (iframe embedding `/prototype/index.html`). `/onepager` — printable A4 document.

**Landing page structure:** Navbar (logo + nav links + CTA) → Hero (headline + subtitle + dual CTA + preview image) → Problem section (3 pain-point cards with icons) → Features section (4 tiles: coverage map, heatmap, brand comparison, guesstimate — each with screenshot, title, bullet points) → Use cases (3 cards: expansion, monitoring, benchmarking) → Stats section (real data counters: brands, locations, regions + country pills with "Soon" badges) → CTA footer → Footer.

**Explorer prototype:** Vanilla JS app in `public/prototype/`. Leaflet map (~65% left) + sidebar (~35% right) with 4 tabs: Overview (choropleth map, brand filters, KPI cards, region drilldown panel), Deep Review (heatmap + guesstimate toggles), Compare (market share bars, regional matrix, concentration chart, auto-insights), Export (CSV/GeoJSON download). Country/Region/City selectors always visible above tabs.

**Data:** `metrics_england.json` (brand totals, region totals, region×brand matrix, density per 1000km²). `england_regions_simplified.geojson` (9 region polygons). `england_locations_min.geojson` (5,718 POIs with lat/lon/brand/city/region). All client-side filtering, no backend queries in prototype.

**Design system:** HSL color tokens in index.css (--primary: blue 231 98% 61%, --background, --foreground, etc.). DM Sans font. Dark/light mode via CSS variables. All component colors use semantic tokens, never hardcoded values.

---

## 6. Feature Landing Page

Fully built at `/`. Hero: "Map your restaurant competitors in minutes" + dual CTA. Problem cards (3) → feature showcase (4 tiles: coverage map, heatmap, brand comparison, guesstimate) → use cases (expansion, monitoring, benchmarking) → data proof (real numbers, country pills with "Soon" badges) → CTA footer.

**Countries live:** Great Britain.
**Coming soon:** UAE, Spain, Poland, Hungary, Mexico, Türkiye, Romania, Czech Republic.
