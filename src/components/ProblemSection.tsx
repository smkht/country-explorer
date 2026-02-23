import { motion } from "framer-motion";
import { AlertTriangle, Clock, Search } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    text: "Manual competitor mapping is slow, fragmented, and quickly outdated.",
  },
  {
    icon: Clock,
    text: "Decisions about new openings and marketing need evidence by region and city.",
  },
  {
    icon: Search,
    text: "No single source of truth for 'who operates where' across your market.",
  },
];

const ProblemSection = () => (
  <section className="py-20 section-alt">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          The problem with competitor intelligence today
        </h2>
        <p className="text-muted-foreground text-lg">
          Teams waste hours digging through spreadsheets, ad-hoc maps, and outdated reports.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {problems.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 text-center card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
              <p.icon className="w-5 h-5 text-accent-foreground" />
            </div>
            <p className="text-foreground font-medium leading-relaxed">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
