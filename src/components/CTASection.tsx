import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

const CTASection = () => (
  <section id="cta" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary to-[hsl(250_90%_65%)] rounded-3xl p-12 md:p-16"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(0_0%_100%/0.15)] px-4 py-1.5 text-sm font-medium text-primary-foreground mb-6">
          <MapPin className="w-3.5 h-3.5" />
          Country Explorer
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 tracking-tight">
          Ready to see your market clearly?
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Explore the interactive prototype — see coverage maps, brand comparisons, and exportable data for England.
        </p>
        <a
          href="/explorer"
          className="inline-flex items-center gap-2 rounded-full bg-primary-foreground text-primary px-8 py-3.5 text-base font-semibold hover:opacity-90 transition-opacity"
        >
          Try it for Free
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
