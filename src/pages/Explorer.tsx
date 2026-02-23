import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Explorer = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Top bar linking back to landing */}
      <div className="h-12 bg-background border-b border-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <MapPin className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm text-foreground tracking-tight">Country Explorer</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">· England</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden md:inline">Interactive Prototype</span>
          <a
            href="https://calendly.com/denis_getplace/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Get Full Access
          </a>
        </div>
      </div>
      <iframe
        src={`/prototype/index.html?v=${Date.now()}`}
        className="w-full flex-1 border-0"
        title="Country Explorer Prototype"
      />
    </div>
  );
};

export default Explorer;
