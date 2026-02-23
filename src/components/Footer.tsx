import { MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-10">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground tracking-tight">getplace</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © 2026 Getplace. Competitive intelligence for restaurant chains.
      </p>
    </div>
  </footer>
);

export default Footer;
