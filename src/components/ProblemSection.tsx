import { motion } from "framer-motion";
import { AlertTriangle, Clock, Search } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    text: "Manual competitor mapping is slow, fragmented, and doesn't account for population density or real opportunity.",
  },
  {
    icon: Clock,
    text: "New store decisions need evidence — not gut feel. You need to know where footfall is high and competitors are thin.",
  },
  {
    icon: Search,
    text: "No single source of truth for 'which chains operate where' and 'where should we expand next' across your market.",
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
          The problem with restaurant expansion today
        </h2>
        <p className="text-muted-foreground text-lg">
          Strategy teams waste hours on spreadsheets and gut-feel decisions while high-potential locations go to competitors.
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
