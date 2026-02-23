import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Upload, Download, Play, Pause, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface Feature {
  type: string;
  properties: { brand: string; id: string; name: string; city: string | null; postcode: string | null; region: string };
  geometry: { type: string; coordinates: [number, number] };
}

interface GeoJSON {
  type: string;
  features: Feature[];
}

const BATCH_SIZE = 10;

const EnrichData = () => {
  const [geojson, setGeojson] = useState<GeoJSON | null>(null);
  const [missingCount, setMissingCount] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [enriched, setEnriched] = useState(0);
  const [failed, setFailed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const abortRef = useRef(false);

  const addLog = (msg: string) => setLog(prev => [...prev.slice(-200), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const loadFile = async () => {
    try {
      addLog("Loading geojson from /prototype/england_locations_min.geojson...");
      const res = await fetch("/prototype/england_locations_min.geojson");
      const data: GeoJSON = await res.json();
      const missing = data.features.filter(f => !f.properties.city || f.properties.city === "Unknown" || f.properties.city.trim() === "");
      setGeojson(data);
      setMissingCount(missing.length);
      addLog(`Loaded ${data.features.length} features. ${missing.length} missing city names.`);
    } catch (e) {
      addLog(`Error loading file: ${e}`);
    }
  };

  const startEnrichment = useCallback(async () => {
    if (!geojson) return;
    setRunning(true);
    setDone(false);
    abortRef.current = false;
    setProcessed(0);
    setEnriched(0);
    setFailed(0);

    const missing = geojson.features
      .map((f, idx) => ({ feature: f, idx }))
      .filter(({ feature }) => !feature.properties.city || feature.properties.city === "Unknown" || feature.properties.city.trim() === "");

    addLog(`Starting enrichment of ${missing.length} features in batches of ${BATCH_SIZE}...`);

    let totalProcessed = 0;
    let totalEnriched = 0;
    let totalFailed = 0;

    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      if (abortRef.current) {
        addLog("⏸️ Paused by user.");
        break;
      }

      const batch = missing.slice(i, i + BATCH_SIZE);
      const points = batch.map(({ feature }) => ({
        id: feature.properties.id,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
      }));

      try {
        const { data, error } = await supabase.functions.invoke("reverse-geocode", {
          body: { points },
        });

        if (error) {
          addLog(`❌ Batch error: ${error.message}`);
          totalFailed += batch.length;
        } else if (data?.results) {
          for (const result of data.results) {
            if (result.city) {
              const entry = missing.find(m => m.feature.properties.id === result.id);
              if (entry) {
                geojson.features[entry.idx].properties.city = result.city;
                totalEnriched++;
              }
            } else {
              totalFailed++;
            }
          }
          addLog(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${data.results.filter((r: any) => r.city).length}/${batch.length} enriched`);
        }
      } catch (e) {
        addLog(`❌ Request failed: ${e}`);
        totalFailed += batch.length;
      }

      totalProcessed += batch.length;
      setProcessed(totalProcessed);
      setEnriched(totalEnriched);
      setFailed(totalFailed);
    }

    setRunning(false);
    setDone(true);
    addLog(`🏁 Done! Enriched: ${totalEnriched}, Failed: ${totalFailed}, Total: ${totalProcessed}`);
  }, [geojson]);

  const downloadResult = () => {
    if (!geojson) return;
    const blob = new Blob([JSON.stringify(geojson)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "england_locations_enriched.geojson";
    a.click();
    URL.revokeObjectURL(url);
  };

  const progress = missingCount > 0 ? (processed / missingCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="h-12 bg-background border-b border-border flex items-center px-4 gap-3">
        <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <div className="w-px h-5 bg-border" />
        <span className="font-bold text-sm text-foreground">Data Enrichment — Reverse Geocoding</span>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Step 1: Load GeoJSON</h2>
          <p className="text-sm text-muted-foreground">Load the current location data and identify features missing city names.</p>
          <Button onClick={loadFile} variant="outline" className="gap-2">
            <Upload className="w-4 h-4" /> Load Current Data
          </Button>
          {geojson && (
            <div className="text-sm text-foreground">
              ✅ {geojson.features.length} total features · <strong className="text-primary">{missingCount} missing city names</strong>
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Step 2: Enrich via Nominatim</h2>
          <p className="text-sm text-muted-foreground">
            Sends batches of {BATCH_SIZE} coordinates to OpenStreetMap Nominatim (1 req/sec). ~{missingCount > 0 ? Math.ceil(missingCount / BATCH_SIZE * 11 / 60) : '?'} min estimated.
          </p>
          <div className="flex gap-2">
            <Button onClick={startEnrichment} disabled={!geojson || running} className="gap-2">
              <Play className="w-4 h-4" /> Start Enrichment
            </Button>
            {running && (
              <Button onClick={() => { abortRef.current = true; }} variant="destructive" className="gap-2">
                <Pause className="w-4 h-4" /> Pause
              </Button>
            )}
          </div>
          {(running || done) && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex gap-4 text-sm">
                <span className="text-foreground">{processed}/{missingCount} processed</span>
                <span className="text-primary flex items-center gap-1"><CheckCircle className="w-3 h-3" />{enriched} enriched</span>
                <span className="text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{failed} failed</span>
              </div>
            </div>
          )}
        </div>

        {done && (
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Step 3: Download Enriched File</h2>
            <p className="text-sm text-muted-foreground">
              Download the enriched GeoJSON and replace <code>public/prototype/england_locations_min.geojson</code>.
            </p>
            <Button onClick={downloadResult} className="gap-2">
              <Download className="w-4 h-4" /> Download Enriched GeoJSON
            </Button>
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border p-6 space-y-2">
          <h2 className="text-lg font-bold text-foreground">Log</h2>
          <div className="bg-muted rounded-lg p-3 max-h-60 overflow-y-auto font-mono text-xs text-muted-foreground space-y-0.5">
            {log.length === 0 ? <div>No activity yet.</div> : log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrichData;
