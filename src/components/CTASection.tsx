import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

const CTASection = () => (
  <section id="cta" className="py-10">
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
          Ready to map your competition?
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Explore the interactive prototype — see restaurant coverage maps, chain comparisons, and exportable data for England.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/explorer"
            className="inline-flex items-center gap-2 rounded-full bg-primary-foreground text-primary px-8 py-3.5 text-base font-semibold hover:opacity-90 transition-opacity"
          >
            Try it for Free
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://calendly.com/denis_getplace/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary-foreground/40 text-primary-foreground px-8 py-3.5 text-base font-semibold hover:bg-primary-foreground/10 transition-colors"
          >
            Get Full Access
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
