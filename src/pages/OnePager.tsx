import { useEffect } from "react";

const OnePager = () => {
  useEffect(() => {
    document.title = "Country Explorer — One-Pager";
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Print button - hidden in print */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handlePrint}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Save as PDF
        </button>
        <a
          href="/"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          ← Back
        </a>
      </div>

      {/* One-pager content — optimized for A4 print */}
      <div className="max-w-[210mm] mx-auto px-8 py-6 print:px-6 print:py-4 text-[11px] leading-[1.45]">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-gray-300 pb-2 mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Country Explorer</h1>
            <p className="text-[10px] text-gray-500">Feature proposal · Getplace</p>
          </div>
          <p className="text-[10px] text-gray-500">Great Britain dataset: 6 brands, 5,718 locations, 9 regions · Feb 2026</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
          {/* 1. Product Concept */}
          <div>
            <h2 className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">1. Product Concept</h2>
            <p className="mb-1">
              <strong>For</strong> strategy & expansion teams at restaurant chains who need to understand competitor presence by region.
            </p>
            <p className="mb-1">
              <strong>Problem:</strong> answering "where do competitors operate and where is whitespace" requires manual maps and spreadsheets.
            </p>
            <p className="mb-1">
              <strong>Use cases:</strong> market entry planning (rank cities by density), quarterly monitoring (openings/closures), head-to-head benchmarking.
            </p>
            <p>
              <strong>MVP:</strong> choropleth map, region drilldown, brand comparison scorecard, CSV/GeoJSON export.{" "}
              <strong>Later:</strong> competitive heatmap, guesstimate engine, openings/closures timeline, delivery zones, predictive expansion.
            </p>
          </div>

          {/* 2. Interactive Prototype */}
          <div>
            <h2 className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">2. Interactive Prototype</h2>
            <p className="mb-1">
              Built in Lovable (React + Tailwind). Landing page (hero, problem cards, feature tiles with screenshots, data proof, CTA) + explorer app with 4 tabs: <strong>Overview</strong> (hex map, filters, region drilldown), <strong>Deep Review</strong> (heatmap + guesstimate), <strong>Compare</strong> (market share, regional matrix, concentration, auto-insights), <strong>Export</strong> (CSV/GeoJSON).
            </p>
            <p>
              Phase 2 previewed: heatmap mode (red/green competitive win-lose) and guesstimate engine (saturation scores, gap analysis, expansion advice) — shown as toggles in Deep Review tab.
            </p>
          </div>

          {/* 3. Roadmap — full width */}
          <div className="col-span-2">
            <h2 className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">3. Roadmap</h2>
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th className="py-1 pr-2 font-semibold w-[15%]">Phase</th>
                  <th className="py-1 pr-2 font-semibold w-[8%]">When</th>
                  <th className="py-1 pr-2 font-semibold w-[45%]">What</th>
                  <th className="py-1 font-semibold w-[32%]">Why this order</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-1 pr-2 font-medium">1 — MVP</td>
                  <td className="py-1 pr-2">Wk 1–6</td>
                  <td className="py-1 pr-2">Overview tab: hex choropleth map, region drilldown (brand mix, top cities), brand filters + KPIs. CSV/GeoJSON export. Permissions + QA.</td>
                  <td className="py-1">Delivers core "who operates where" with clean data. No derived metrics needing tuning.</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1 pr-2 font-medium">2 — Smart layers</td>
                  <td className="py-1 pr-2">Wk 7–12</td>
                  <td className="py-1 pr-2">Competitive heatmap (win/lose per hex). Guesstimate engine (saturation, whitespace, expansion advice). City-level explorer.</td>
                  <td className="py-1">Needs normalized data + calibration from client feedback. Phase 1 gives tuning time.</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1 pr-2 font-medium">3 — Monitoring</td>
                  <td className="py-1 pr-2">Mo 4–6</td>
                  <td className="py-1 pr-2">Store history (opened/closed), timeline + alerts, population enrichment, scheduled reporting.</td>
                  <td className="py-1">Requires stable location IDs + change detection. Creates weekly login habit.</td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 font-medium">4 — Deep CI</td>
                  <td className="py-1 pr-2">Mo 6+</td>
                  <td className="py-1 pr-2">Delivery zone overlap, price/visibility index, predictive expansion, automated insights, API.</td>
                  <td className="py-1">Upsell surface + deep lock-in. Builds on all prior infrastructure.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Monetization */}
          <div>
            <h2 className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">4. Monetization</h2>
            <p className="mb-1">
              Entry point for enterprise deals — easy to demo. Monitoring = weekly retention. Gateway to upsell deeper products (delivery zones, visibility, pricing).
            </p>
            <p>
              <strong>Packaging:</strong> basic CE in Pro, smart layers + monitoring in Enterprise; or per-country module pricing.{" "}
              <strong>KPIs:</strong> activation &gt;60%, weekly engagement, monitoring upsell &gt;25%.
            </p>
          </div>

          {/* 5. Dev Documentation */}
          <div>
            <h2 className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">5. Dev Documentation</h2>
            <p className="mb-1">
              <strong>Routes:</strong> <code className="text-[10px] bg-gray-100 px-1 rounded">/</code> (landing, static) and <code className="text-[10px] bg-gray-100 px-1 rounded">/explorer</code> (dashboard).
            </p>
            <p className="mb-1">
              <strong>Input:</strong> regions GeoJSON + brand location files (lat, lon, brand, city, region). Client-side filtering in prototype.
            </p>
            <p className="mb-1">
              <strong>Layout:</strong> Leaflet map (~65% left), sidebar (~35% right) with tabs. Country/Region/City selectors always visible above tabs.
            </p>
            <p>
              <strong>MVP priority:</strong> Overview tab first (hex map + filters + KPIs + region panel), then heatmap toggle, then guesstimate. Compare + Export tabs follow.
            </p>
          </div>

          {/* 6. Landing Page — full width */}
          <div className="col-span-2">
            <h2 className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">6. Feature Landing Page</h2>
            <p>
              Fully built at <code className="text-[10px] bg-gray-100 px-1 rounded">/</code>. Hero: "Map your restaurant competitors in minutes" + dual CTA. Problem cards (3) → feature showcase (4 tiles: coverage map, heatmap, brand comparison, guesstimate) → use cases (expansion, monitoring, benchmarking) → data proof (real numbers, country pills with "Soon" badges) → CTA footer.{" "}
              <strong>Countries live:</strong> Great Britain. <strong>Coming soon:</strong> UAE, Spain, Poland, Hungary, Mexico, Türkiye, Romania, Czech Republic.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 mt-3 pt-2 text-[9px] text-gray-400 flex justify-between">
          <span>Getplace · Country Explorer · Test Assignment</span>
          <span>Interactive prototype: lovable.app</span>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default OnePager;
