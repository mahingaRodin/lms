import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LandPlotMapProps {
  plots: {
    id: string;
    boundary: GeoJSON.Polygon;
  }[];
}

export default function LandPlotMap({ plots }: LandPlotMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);
  const [mapId] = useState(
    `view-map-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    if (mapRef.current || !document.getElementById(mapId)) return;

    const map = L.map(mapId).setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );
    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapId]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear previous layers
    layersRef.current.forEach((layer) => {
      mapRef.current?.removeLayer(layer);
    });
    layersRef.current = [];

    // Add new layers
    plots.forEach((plot) => {
      const latLngs = plot.boundary.coordinates[0].map((coord) =>
        L.latLng(coord[1], coord[0])
      );
      const polygon = L.polygon(latLngs, { color: "#3388ff" });
      polygon.bindPopup(`Plot ID: ${plot.id}`);
      polygon.addTo(mapRef.current!);
      layersRef.current.push(polygon);
    });

    // Fit bounds if plots exist
    if (plots.length > 0) {
      const group = L.featureGroup(layersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [plots]);

  return <div id={mapId} style={{ height: "100%", width: "100%" }} />;
}
