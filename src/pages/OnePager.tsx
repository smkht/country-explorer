import { useEffect } from "react";

const OnePager = () => {
  useEffect(() => {
    document.title = "Country Explorer — One-Pager";
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, hsl(225 30% 96%) 0%, hsl(231 40% 92%) 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Print button - hidden in print */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "hsl(231 98% 61%)", color: "white" }}
        >
          Save as PDF
        </button>
        <a
          href="/"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "white", color: "hsl(220 20% 10%)" }}
        >
          ← Back
        </a>
      </div>

      {/* One-pager content — optimized for A4 print */}
      <div className="max-w-[210mm] mx-auto px-8 py-6 print:px-6 print:py-4 text-[11px] leading-[1.45]" style={{ color: "hsl(220 20% 10%)" }}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4" style={{ borderBottom: "2px solid hsl(231 98% 61%)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(231 98% 61%)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: "hsl(231 98% 61%)" }}>Country Explorer</h1>
              <p className="text-[10px]" style={{ color: "hsl(220 10% 46%)" }}>Feature proposal · Getplace</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-medium" style={{ color: "hsl(220 10% 46%)" }}>Great Britain dataset</p>
            <p className="text-[10px]" style={{ color: "hsl(220 10% 46%)" }}>6 brands · 5,718 locations · 9 regions · Feb 2026</p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
          {/* 1. Product Concept */}
          <Section title="1. Product Concept">
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
          </Section>

          {/* 2. Interactive Prototype */}
          <Section title="2. Interactive Prototype">
            <p className="mb-1">
              Built in Lovable (React + Tailwind). Landing page (hero, problem cards, feature tiles with screenshots, data proof, CTA) + explorer app with 4 tabs: <strong>Overview</strong> (hex map, filters, region drilldown), <strong>Deep Review</strong> (heatmap + guesstimate), <strong>Compare</strong> (market share, regional matrix, concentration, auto-insights), <strong>Export</strong> (CSV/GeoJSON).
            </p>
            <p>
              Phase 2 previewed: heatmap mode (red/green competitive win-lose) and guesstimate engine (saturation scores, gap analysis, expansion advice) — shown as toggles in Deep Review tab.
            </p>
          </Section>

          {/* 3. Roadmap — full width */}
          <div className="col-span-2 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid hsl(220 13% 91%)" }}>
            <h2 className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "hsl(231 98% 61%)" }}>3. Roadmap</h2>
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid hsl(231 98% 85%)" }} className="text-left">
                  <th className="py-1 pr-2 font-semibold w-[15%]">Phase</th>
                  <th className="py-1 pr-2 font-semibold w-[8%]">When</th>
                  <th className="py-1 pr-2 font-semibold w-[45%]">What</th>
                  <th className="py-1 font-semibold w-[32%]">Why this order</th>
                </tr>
              </thead>
              <tbody style={{ color: "hsl(220 10% 30%)" }}>
                <tr style={{ borderBottom: "1px solid hsl(225 20% 94%)" }}>
                  <td className="py-1 pr-2 font-medium">1 — MVP</td>
                  <td className="py-1 pr-2">Wk 1–6</td>
                  <td className="py-1 pr-2">Overview tab: hex choropleth map, region drilldown (brand mix, top cities), brand filters + KPIs. CSV/GeoJSON export. Permissions + QA.</td>
                  <td className="py-1">Delivers core "who operates where" with clean data. No derived metrics needing tuning.</td>
                </tr>
                <tr style={{ borderBottom: "1px solid hsl(225 20% 94%)" }}>
                  <td className="py-1 pr-2 font-medium">2 — Smart layers</td>
                  <td className="py-1 pr-2">Wk 7–12</td>
                  <td className="py-1 pr-2">Competitive heatmap (win/lose per hex). Guesstimate engine (saturation, whitespace, expansion advice). City-level explorer.</td>
                  <td className="py-1">Needs normalized data + calibration from client feedback. Phase 1 gives tuning time.</td>
                </tr>
                <tr style={{ borderBottom: "1px solid hsl(225 20% 94%)" }}>
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
          <Section title="4. Monetization">
            <p className="mb-1">
              Entry point for enterprise deals — easy to demo. Monitoring = weekly retention. Gateway to upsell deeper products (delivery zones, visibility, pricing).
            </p>
            <p>
              <strong>Packaging:</strong> basic CE in Pro, smart layers + monitoring in Enterprise; or per-country module pricing.{" "}
              <strong>KPIs:</strong> activation &gt;60%, weekly engagement, monitoring upsell &gt;25%.
            </p>
          </Section>

          {/* 5. Dev Documentation */}
          <Section title="5. Dev Documentation">
            <p className="mb-1">
              <strong>Routes:</strong> <code className="text-[10px] px-1 rounded" style={{ background: "hsl(231 98% 96%)", color: "hsl(231 98% 51%)" }}>/</code> (landing, static) and <code className="text-[10px] px-1 rounded" style={{ background: "hsl(231 98% 96%)", color: "hsl(231 98% 51%)" }}>/explorer</code> (dashboard).
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
          </Section>

          {/* 6. Landing Page — full width */}
          <div className="col-span-2 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid hsl(220 13% 91%)" }}>
            <h2 className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: "hsl(231 98% 61%)" }}>6. Feature Landing Page</h2>
            <p>
              Fully built at <code className="text-[10px] px-1 rounded" style={{ background: "hsl(231 98% 96%)", color: "hsl(231 98% 51%)" }}>/</code>. Hero: "Map your restaurant competitors in minutes" + dual CTA. Problem cards (3) → feature showcase (4 tiles: coverage map, heatmap, brand comparison, guesstimate) → use cases (expansion, monitoring, benchmarking) → data proof (real numbers, country pills with "Soon" badges) → CTA footer.{" "}
              <strong>Countries live:</strong> Great Britain. <strong>Coming soon:</strong> UAE, Spain, Poland, Hungary, Mexico, Türkiye, Romania, Czech Republic.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 flex justify-between text-[9px]" style={{ borderTop: "2px solid hsl(231 98% 61%)", color: "hsl(220 10% 46%)" }}>
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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid hsl(220 13% 91%)" }}>
    <h2 className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: "hsl(231 98% 61%)" }}>{title}</h2>
    {children}
  </div>
);

export default OnePager;
