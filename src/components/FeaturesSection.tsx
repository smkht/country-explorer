import { motion } from "framer-motion";
import { Map, BarChart3, Flame, Lightbulb } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";
import heatmapPreview from "@/assets/heatmap-preview.jpg";
import brandComparePreview from "@/assets/brand-compare-preview.jpg";
import guesstimatePreview from "@/assets/export-preview.jpg";

const features = [
  {
    icon: Map,
    title: "Coverage Map",
    subtitle: "Region & city presence for your competitor set",
    description:
      "Interactive honeycomb density maps show where brands cluster. Click any region to drill into brand mix, top cities, and store-level dots — zoom in and the hexagons adapt in real time.",
    image: dashboardPreview,
    alt: "Country Explorer coverage map with honeycomb density grid over England",
  },
  {
    icon: Flame,
    title: "Competitive Heatmap",
    subtitle: "See who's winning in every neighbourhood",
    description:
      "Toggle heatmap mode to compare your brand against all competitors or a specific rival. Red means they dominate, green means you lead — instantly spot market gaps across the entire country.",
    image: heatmapPreview,
    alt: "Competitive heatmap showing McDonald's vs competitors with traffic-light coloring",
  },
  {
    icon: BarChart3,
    title: "Brand Comparison",
    subtitle: "Head-to-head analytics across every dimension",
    description:
      "Market share bars, regional presence matrix, concentration analysis, and auto-generated insights. See which brands are distributed vs concentrated, who dominates London, and where the whitespace is.",
    image: brandComparePreview,
    alt: "Brand comparison dashboard with market share bars and regional heatgrid",
  },
  {
    icon: Lightbulb,
    title: "Guesstimate Engine",
    subtitle: "Data-driven expansion advice, powered by real numbers",
    description:
      "Turn on Guesstimate for instant market intelligence: saturation scores, whitespace opportunities scored by city, strongest & weakest regions with gap analysis, and actionable expansion advice — all derived from actual store data.",
    image: guesstimatePreview,
    alt: "Guesstimate market insights panel with whitespace opportunities and growth targets",
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
          Everything you need to understand your market
        </h2>
        <p className="text-muted-foreground text-lg">
          From bird's-eye country views to granular city-level insights.
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
