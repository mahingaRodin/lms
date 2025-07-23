import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface MapDrawerProps {
  onPolygonComplete: (polygon: GeoJSON.Polygon) => void;
}

export default function MapDrawer({ onPolygonComplete }: MapDrawerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const [mapId] = useState(`map-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Skip if already initialized
    if (mapRef.current || !document.getElementById(mapId)) return;

    const map = L.map(mapId).setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );

    const featureGroup = L.featureGroup().addTo(map);
    featureGroupRef.current = featureGroup;

    const drawControl = new L.Control.Draw({
      edit: { featureGroup },
      draw: {
        polygon: {},
        circle: false,
        marker: false,
        polyline: false,
        rectangle: false,
      },
    });
    map.addControl(drawControl);

    map.on("draw:created", (e: any) => {
      const layer = e.layer;
      featureGroup.addLayer(layer);
      if (e.layerType === "polygon") {
        const polygon = (layer as L.Polygon).toGeoJSON();
        if (polygon.geometry.type === "Polygon") {
          onPolygonComplete(polygon.geometry as GeoJSON.Polygon);
        }
      }
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapId, onPolygonComplete]);

  return <div id={mapId} style={{ height: "100%", width: "100%" }} />;
}
