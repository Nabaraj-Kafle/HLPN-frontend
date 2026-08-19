import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Same pin style as the main MapView
const pinIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 32px;
      height: 44px;
      background: transparent;
      filter: drop-shadow(0 6px 10px rgba(15, 23, 42, 0.28));
      display: grid;
      place-items: center;
    ">
      <div style="
        width: 22px;
        height: 22px;
        border-radius: 999px 999px 999px 0;
        background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
        border: 2.5px solid rgba(255, 255, 255, 0.98);
        transform: rotate(-45deg);
        display: grid;
        place-items: center;
        margin-top: 5px;
      ">
        <span style="
          transform: rotate(45deg);
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.24);
        "></span>
      </div>
    </div>
  `,
  iconSize: [32, 44],
  iconAnchor: [16, 40],
  popupAnchor: [0, -38],
});

// Centers the map on the pin
function CenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

interface MiniMapProps {
  lat: number;
  lng: number;
  label?: string;
}

export function MiniMap({ lat, lng, label }: MiniMapProps) {
  return (
    <div
      style={{
        width: "250px",
        height: "160px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1.5px solid rgba(148, 163, 184, 0.3)",
        boxShadow: "0 4px 12px rgba(15,23,42,0.10)",
        position: "relative",
        zIndex: 0,
        isolation: "isolate",
        flexShrink: 0,
      }}
    >
      {/* Label overlay */}
      {label && (
        <div
          style={{
            position: "absolute",
            bottom: 5,
            left: 5,
            zIndex: 2,
            background: "rgba(15, 23, 42, 0.72)",
            color: "#fff",
            fontSize: "9px",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "6px",
            backdropFilter: "blur(6px)",
            letterSpacing: "0.04em",
            pointerEvents: "none",
            maxWidth: "120px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </div>
      )}

      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        dragging={true}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CenterMap lat={lat} lng={lng} />
        <Marker position={[lat, lng]} icon={pinIcon} />
      </MapContainer>
    </div>
  );
}
