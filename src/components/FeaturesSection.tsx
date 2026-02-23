import { motion } from "framer-motion";
import { Map, BarChart3, Download } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";
import brandComparePreview from "@/assets/brand-compare-preview.jpg";
import exportPreview from "@/assets/export-preview.jpg";

const features = [
  {
    icon: Map,
    title: "Coverage Map",
    subtitle: "Region & city presence for your competitor set",
    description:
      "Interactive choropleth maps show density by region. Click any area to drill down into brand mix, top cities, and concentration signals.",
    image: dashboardPreview,
    alt: "Country Explorer coverage map with region drilldown",
  },
  {
    icon: BarChart3,
    title: "Brand Benchmarking",
    subtitle: "Compare brands with a consistent scorecard",
    description:
      "Head-to-head comparison of total locations, market share in key cities, top regions, and concentration patterns across your competitive set.",
    image: brandComparePreview,
    alt: "Brand comparison scorecard with analytics",
  },
  {
    icon: Download,
    title: "Actionable Exports",
    subtitle: "CSV, GeoJSON, and client-ready reports",
    description:
      "Export filtered locations for your BI tools. Generate shortlists of target cities with low competitor density — ready for your next board meeting.",
    image: exportPreview,
    alt: "Data export interface with CSV and GeoJSON options",
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
