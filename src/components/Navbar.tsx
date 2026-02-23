import { motion } from "framer-motion";
import { MapPin, BarChart3, Download } from "lucide-react";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
    <div className="container mx-auto flex items-center justify-between h-16 px-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <MapPin className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg text-foreground tracking-tight">getplace</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#use-cases" className="hover:text-foreground transition-colors">Use Cases</a>
        <a href="#data" className="hover:text-foreground transition-colors">Data</a>
      </div>
      <a
        href="/explorer"
        className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Try it for Free
      </a>
    </div>
  </nav>
);

export default Navbar;
