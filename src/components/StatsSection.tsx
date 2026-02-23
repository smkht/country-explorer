import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const stats = [
  { value: "5,718", label: "Restaurant locations", sub: "England snapshot" },
  { value: "6", label: "Chains monitored", sub: "QSR & fast-casual" },
  { value: "9", label: "Regions covered", sub: "ITL1 regions" },
  { value: "580.9", label: "Peak density", sub: "London per 1,000 km²" },
];

const brands = [
  { name: "Subway", locations: "1,698", share: "29.7%" },
  { name: "McDonald's", locations: "1,275", share: "22.3%" },
  { name: "Domino's", locations: "1,093", share: "19.1%" },
  { name: "KFC", locations: "857", share: "15.0%" },
  { name: "Nando's", locations: "423", share: "7.4%" },
  { name: "Papa Johns", locations: "372", share: "6.5%" },
];

const countries = [
  { name: "Great Britain", status: "live", brands: 6, locations: "5,718" },
  { name: "UAE", status: "coming", brands: null, locations: null },
  { name: "Spain", status: "coming", brands: null, locations: null },
  { name: "Poland", status: "coming", brands: null, locations: null },
  { name: "Hungary", status: "coming", brands: null, locations: null },
  { name: "Mexico", status: "coming", brands: null, locations: null },
  { name: "Türkiye", status: "coming", brands: null, locations: null },
  { name: "Romania", status: "coming", brands: null, locations: null },
  { name: "Czech Republic", status: "coming", brands: null, locations: null },
  { name: "More to come…", status: "placeholder", brands: null, locations: null },
];

const londonBrands = [
  { name: "Subway", locations: 216, share: "23.6%", density: "137.1" },
  { name: "McDonald's", locations: 192, share: "21.0%", density: "121.9" },
  { name: "KFC", locations: 161, share: "17.6%", density: "102.2" },
  { name: "Domino's", locations: 151, share: "16.5%", density: "95.9" },
  { name: "Nando's", locations: 127, share: "13.9%", density: "80.7" },
  { name: "Papa Johns", locations: 67, share: "7.3%", density: "42.5" },
];

const StatsSection = () => (
  <section id="data" className="py-20">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          Real restaurant data, real insights
        </h2>
        
        <div className="flex flex-wrap items-center justify-center gap-2">
          {countries.map((c, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${
                c.status === "live"
                  ? "bg-accent text-primary border-primary/20"
                  : c.status === "placeholder"
                  ? "bg-transparent text-muted-foreground border-dashed border-border italic"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {c.status === "live" && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
              {c.name}
              {c.status === "coming" && <span className="text-xs opacity-60">· Soon</span>}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          More countries rolling out quarterly.{" "}
          <a href="https://calendly.com/denis_getplace/30min" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Request a country →
          </a>
        </p>
        <p className="text-muted-foreground text-lg mt-6">
          A snapshot from our England restaurant dataset — the kind of intelligence you'll have for any country.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-14">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-card rounded-2xl border border-border p-6 text-center"
          >
            <div className="text-3xl font-bold text-foreground mb-1">{s.value}</div>
            <div className="text-sm font-medium text-foreground mb-0.5">{s.label}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </motion.div>
        ))}
      </div>



    </div>
  </section>
);

export default StatsSection;
