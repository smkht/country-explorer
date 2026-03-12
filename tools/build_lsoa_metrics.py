import json
from pathlib import Path
import pandas as pd
from shapely.geometry import shape
from shapely.strtree import STRtree
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
ENRICH = RAW / "enrichment"
PROCESSED = ROOT / "data" / "processed"

LSOA_BOUNDARIES = ENRICH / "lsoa_2021_boundaries_ew_bgc.geojson"
LSOA_POP_XLSX = ENRICH / "lsoa_population_density_2022_2024.xlsx"
REGIONS_GEOJSON = RAW / "uk_regions_itl1.geojson"

OUT_CENTROIDS = PROCESSED / "lsoa_population_centroids.json"
OUT_SIMPLIFIED = PROCESSED / "lsoa_boundaries_simplified.geojson"


def load_lsoa_population():
    df = pd.read_excel(LSOA_POP_XLSX, sheet_name="Mid-2022 to mid-2024 LSOA", header=3)
    df = df.rename(columns={
        "LSOA 2021 Code": "lsoa_code",
        "LSOA 2021 Name": "lsoa_name",
        "Area Sq Km": "area_km2",
        "Mid-2024: Population": "population_2024",
        "Mid-2024: People per Sq Km": "density_2024",
        "Mid-2023: Population": "population_2023",
        "Mid-2022: Population": "population_2022",
    })
    keep_cols = [
        "lsoa_code",
        "lsoa_name",
        "area_km2",
        "population_2024",
        "density_2024",
        "population_2023",
        "population_2022",
    ]
    df = df[[c for c in keep_cols if c in df.columns]]
    return {row.lsoa_code: row for row in df.itertuples(index=False)}


def build_region_index():
    with open(REGIONS_GEOJSON) as f:
        regions = json.load(f)
    geoms = []
    names = []
    for feat in regions["features"]:
        geom = shape(feat["geometry"])
        geoms.append(geom)
        names.append(feat["properties"].get("ITL125NM"))
    tree = STRtree(geoms)
    geom_to_name = {id(g): n for g, n in zip(geoms, names)}
    return tree, geoms, geom_to_name


def assign_region(tree, geoms, geom_to_name, geom):
    hits = tree.query(geom)
    for hit in hits:
        region_geom = geoms[hit] if isinstance(hit, (int, np.integer)) else hit
        if region_geom.intersects(geom):
            return geom_to_name[id(region_geom)]
    return None


def main():
    PROCESSED.mkdir(parents=True, exist_ok=True)
    lsoa_pop = load_lsoa_population()

    with open(LSOA_BOUNDARIES) as f:
        lsoa_geo = json.load(f)

    region_tree, region_geoms, region_map = build_region_index()

    centroid_rows = []
    simplified_features = []

    for feat in lsoa_geo["features"]:
        props = feat["properties"]
        lsoa_code = props.get("LSOA21CD")
        lsoa_name = props.get("LSOA21NM")
        pop_row = lsoa_pop.get(lsoa_code)

        population_2024 = float(getattr(pop_row, "population_2024", 0) or 0)
        density_2024 = float(getattr(pop_row, "density_2024", 0) or 0)
        population_2023 = float(getattr(pop_row, "population_2023", 0) or 0)
        population_2022 = float(getattr(pop_row, "population_2022", 0) or 0)
        area_km2 = float(getattr(pop_row, "area_km2", 0) or 0)

        geom = shape(feat["geometry"])
        centroid = geom.centroid
        centroid_lon = props.get("LONG", centroid.x)
        centroid_lat = props.get("LAT", centroid.y)

        region = assign_region(region_tree, region_geoms, region_map, centroid)

        centroid_rows.append({
            "lsoa_code": lsoa_code,
            "lsoa_name": lsoa_name,
            "population_2022": population_2022,
            "population_2023": population_2023,
            "population_2024": population_2024,
            "density_2024": density_2024,
            "region": region,
            "centroid_lon": centroid_lon,
            "centroid_lat": centroid_lat,
            "area_km2": area_km2,
        })

        simplified_geom = geom.simplify(0.001, preserve_topology=True)
        simplified_features.append({
            "type": "Feature",
            "geometry": json.loads(json.dumps(simplified_geom.__geo_interface__)),
            "properties": {
                "lsoa_code": lsoa_code,
                "lsoa_name": lsoa_name,
                "population_2024": population_2024,
                "density_2024": density_2024,
                "region": region,
                "area_km2": area_km2,
            }
        })

    with open(OUT_CENTROIDS, "w") as f:
        json.dump(centroid_rows, f)

    with open(OUT_SIMPLIFIED, "w") as f:
        json.dump({"type": "FeatureCollection", "features": simplified_features}, f)

    print(f"Wrote {OUT_CENTROIDS}")
    print(f"Wrote {OUT_SIMPLIFIED}")


if __name__ == "__main__":
    main()
