import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  type: "donation" | "ngo" | "volunteer";
  popup?: string;
}

interface MapViewProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const markerColors: Record<string, string> = {
  donation: "#22c55e",
  ngo: "#f59e0b",
  volunteer: "#14b8a6",
};

const createIcon = (type: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${markerColors[type] || "#22c55e"};border:3px solid rgba(255,255,255,0.9);box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <div style="width:8px;height:8px;border-radius:50%;background:white;"></div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const MapView = ({ markers = [], center = [19.076, 72.8777], zoom = 12, className = "" }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(center, zoom);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    markers.forEach((m) => {
      L.marker([m.lat, m.lng], { icon: createIcon(m.type) })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;padding:4px;">
            <strong style="font-size:13px;">${m.title}</strong>
            ${m.popup ? `<p style="font-size:11px;color:#888;margin:4px 0 0;">${m.popup}</p>` : ""}
          </div>`
        );
    });
  }, [markers]);

  return (
    <div ref={mapRef} className={`w-full h-full rounded-2xl overflow-hidden ${className}`} style={{ minHeight: 200 }} />
  );
};

export default MapView;
