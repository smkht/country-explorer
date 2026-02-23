import { motion } from "framer-motion";
import { Target, CalendarCheck, Handshake } from "lucide-react";

const useCases = [
  {
    icon: Target,
    title: "Restaurant Expansion Planning",
    description:
      "Rank regions and cities by competitor restaurant density. Identify whitespace — areas with low chain presence but high potential for your next restaurant opening.",
  },
  {
    icon: CalendarCheck,
    title: "Quarterly Competitor Review",
    description:
      "Track restaurant openings and closures by region. Get alerted when a rival chain starts expanding into your priority markets.",
  },
  {
    icon: Handshake,
    title: "Head-to-Head Chain Benchmarking",
    description:
      "Compare your restaurant brand vs competitors across regions with a consistent scorecard. Surface concentration patterns and delivery zone overlaps instantly.",
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
          From expansion planning to board-ready reports — Country Explorer fits the workflow of QSR and fast-casual strategy teams.
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
