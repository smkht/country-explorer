import { motion } from "framer-motion";
import { Map, BarChart3, Flame, Sparkles } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.png";
import heatmapPreview from "@/assets/heatmap-preview.png";
import brandComparePreview from "@/assets/brand-compare-preview.png";
import guesstimatePreview from "@/assets/guesstimate-preview.png";

const features = [
  {
    icon: Map,
    title: "Coverage Map",
    subtitle: "See every restaurant chain's footprint at a glance",
    description:
      "Interactive honeycomb density maps show where restaurant brands cluster. Click any region to drill into brand mix, top cities, and store-level dots — zoom in and the hexagons adapt in real time. Filter by brand, toggle density metrics, and spot gaps in your QSR coverage instantly.",
    image: dashboardPreview,
    alt: "Country Explorer coverage map with honeycomb density grid over England showing restaurant chain locations",
  },
  {
    icon: Flame,
    title: "Competitive Heatmap",
    subtitle: "Red means they lead. Green means you win.",
    description:
      "Toggle heatmap mode to compare your brand against all competitors or a specific rival. Red-to-green hexagons reveal exactly where you're winning or losing — down to the neighbourhood level. When combined with Guesstimate, golden glowing borders highlight high-density urban zones ripe for your next opening.",
    image: heatmapPreview,
    alt: "Competitive heatmap showing Domino's vs competitors with traffic-light coloring and golden opportunity borders across England",
  },
  {
    icon: BarChart3,
    title: "Brand Comparison",
    subtitle: "Head-to-head chain analytics across every dimension",
    description:
      "Market share bars, regional presence matrix, concentration analysis, and auto-generated insights. See which chains dominate which regions, who leads London, and where whitespace exists — all in one view with exportable data.",
    image: brandComparePreview,
    alt: "Brand comparison dashboard with market share bars and regional heatgrid for restaurant chains",
  },
  {
    icon: Sparkles,
    title: "Guesstimate Engine",
    subtitle: "Data-driven expansion advice — not guesswork",
    description:
      "Get instant market intelligence: saturation scores, whitespace opportunities ranked by population density, strongest & weakest regions with gap analysis, and actionable expansion targets. The golden opportunity map filters out rural fields and focuses only on areas with real footfall potential.",
    image: guesstimatePreview,
    alt: "Guesstimate opportunity map with golden highlights on high-potential urban zones and market saturation metrics",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-20">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          Everything you need to understand your restaurant market
        </h2>
        <p className="text-muted-foreground text-lg">
          From bird's-eye country views to golden opportunity zones — intelligence that drives real expansion decisions.
        </p>
      </motion.div>

      <div className="space-y-24">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12`}
          >
            <div className="lg:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                <f.icon className="w-3.5 h-3.5" />
                {f.title}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {f.subtitle}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {f.description}
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-2xl border border-border overflow-hidden card-hover">
                <img
                  src={f.image}
                  alt={f.alt}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
