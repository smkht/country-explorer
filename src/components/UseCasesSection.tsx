import { motion } from "framer-motion";
import { Target, Flame, Handshake } from "lucide-react";

const useCases = [
  {
    icon: Target,
    title: "Smart Expansion Planning",
    description:
      "Use golden opportunity maps to identify high-density urban zones where competitors are thin. Population-gated scoring ensures you're only looking at areas with real footfall — not empty fields.",
  },
  {
    icon: Flame,
    title: "Competitive Dominance Tracking",
    description:
      "Heatmap mode shows exactly where you lead or trail vs competitors. Combine with Guesstimate to see golden-bordered hexagons highlighting where you should expand to flip red zones green.",
  },
  {
    icon: Handshake,
    title: "Head-to-Head Benchmarking",
    description:
      "Compare your brand vs any rival with market share bars, regional presence matrices, and concentration analysis. Surface exactly which regions you're under-indexed in relative to the competition.",
  },
];

const UseCasesSection = () => (
  <section id="use-cases" className="py-20 section-alt">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          Built for restaurant intelligence teams
        </h2>
        <p className="text-muted-foreground text-lg">
          From golden opportunity maps to board-ready competitive reports — Country Explorer fits the workflow of QSR and fast-casual strategy teams.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {useCases.map((uc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-8 card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
              <uc.icon className="w-5 h-5 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{uc.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{uc.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default UseCasesSection;
