import { motion } from "framer-motion";

const stats = [
  { value: "5,718", label: "Locations tracked", sub: "England snapshot" },
  { value: "6", label: "Brands monitored", sub: "QSR leaders" },
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
          Real data, real insights
        </h2>
        <p className="text-muted-foreground text-lg">
          A snapshot from our England dataset — the kind of intelligence you'll have for any country.
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

      {/* Brand table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto bg-card rounded-2xl border border-border overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">England — Locations by Brand</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-sm text-muted-foreground">
              <th className="px-6 py-3 text-left font-medium">Brand</th>
              <th className="px-6 py-3 text-right font-medium">Locations</th>
              <th className="px-6 py-3 text-right font-medium">Share</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-3 text-foreground font-medium">{b.name}</td>
                <td className="px-6 py-3 text-right text-foreground tabular-nums">{b.locations}</td>
                <td className="px-6 py-3 text-right text-muted-foreground tabular-nums">{b.share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  </section>
);

export default StatsSection;
