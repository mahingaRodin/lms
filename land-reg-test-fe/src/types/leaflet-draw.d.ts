import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

declare module 'leaflet' {
  namespace DrawEvents {
    interface Created extends LeafletEvent {
      layer: L.Layer;
      layerType: string;
    }
  }
}
