import { useEffect } from "react";

/**
 * Prefetches Explorer prototype assets when the user has been on the page
 * for a few seconds, so the /explorer route loads near-instantly.
 */
export function usePrefetchExplorer() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const hints = [
        // Prototype HTML & JS
        { href: "/prototype/index.html", as: "document" },
        { href: "/prototype/app.js", as: "script" },
        { href: "/prototype/styles.css", as: "style" },
        // Heavy GeoJSON data files
        { href: "/prototype/england_locations_min.geojson", as: "fetch", crossOrigin: "anonymous" },
        { href: "/prototype/england_regions_simplified.geojson", as: "fetch", crossOrigin: "anonymous" },
        { href: "/prototype/metrics_england.json", as: "fetch", crossOrigin: "anonymous" },
        // External CDN libs
        { href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", as: "style", crossOrigin: "anonymous" },
        { href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", as: "script", crossOrigin: "anonymous" },
        { href: "https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js", as: "script", crossOrigin: "anonymous" },
      ];

      hints.forEach(({ href, as, crossOrigin }) => {
        // Skip if already prefetched
        if (document.querySelector(`link[href="${href}"]`)) return;
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        if (as) link.setAttribute("as", as);
        if (crossOrigin) link.crossOrigin = crossOrigin;
        document.head.appendChild(link);
      });
    }, 2000); // Start prefetching after 2s on the page

    return () => clearTimeout(timer);
  }, []);
}
