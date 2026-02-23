import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.png";

const Hero = () => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-accent/60 to-background pointer-events-none" />

    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground mb-6">
          <MapPin className="w-3.5 h-3.5" />
          Country Explorer
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
          See the competitive landscape in any country{" "}
          <span className="text-gradient">in minutes</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
          Explore where key brands operate, how concentrated they are, and where the whitespace is — all from a single, living dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/explorer"
            className="rounded-full bg-primary text-primary-foreground px-8 py-3.5 text-base font-semibold hover:opacity-90 transition-opacity glow-shadow"
          >
            Try it for Free
          </a>
          <a
            href="#features"
            className="rounded-full border border-border bg-background text-foreground px-8 py-3.5 text-base font-semibold hover:bg-muted transition-colors"
          >
            Explore Features
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="max-w-5xl mx-auto"
      >
        <div className="rounded-2xl border border-border overflow-hidden glow-shadow">
          <img
            src={dashboardPreview}
            alt="Country Explorer dashboard showing England regions choropleth map with brand analytics"
            className="w-full h-auto"
            loading="eager"
          />
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
