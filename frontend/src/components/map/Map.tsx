import mapboxgl, { GeoJSONSourceOptions } from "mapbox-gl";
import { useEffect, useRef } from "react";
import { GeoJSON as Route } from "../../domain/GeoJSON";
import "./Map.css";
import * as turf from "@turf/turf";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS;

const initialLocation = [13.853518, 44.869976] as [number, number];

type MapProps = {
  route: Route | null;
};

// 13.849986, 44.865345 | 13.865307, 44.861498
// -75.572575, 6.250371 | -75.562704, 6.243649

export function Map({ route }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>();

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialLocation,
      zoom: 12,
    });
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    if (!route) return;

    if (!map.current.getSource("route")) {
      map.current.addSource("route", {
        type: "geojson",
        data: route as unknown as GeoJSONSourceOptions["data"],
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 8,
        },
      });
    } else {
      map.current
        .getSource("route")
        .setData(route as unknown as GeoJSONSourceOptions["data"]);
    }

    const centroid = turf.centroid(route as never);

    map.current.flyTo({
      center: centroid.geometry.coordinates as [number, number],
    });
    map.current.fitBounds(turf.bbox(centroid) as [number, number], {zoom: 15, offset: [80,  40]});
  }, [route]);

  return <div ref={mapContainer} className="map-container" />;
}
