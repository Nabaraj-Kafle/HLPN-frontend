import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom pin icon
const pinIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 28px; height: 28px;
    background: #16A34A;
    border: 3px solid #fff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

function ClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      const round6 = (num: number) => Number(num.toFixed(6));
      onLocationChange(round6(e.latlng.lat), round6(e.latlng.lng));
    },
  });
  return null;
}

export function LocationPicker({ lat, lng, onLocationChange }: LocationPickerProps) {
  // Default center: Nepal (Kathmandu)
  const defaultCenter: [number, number] = [27.7172, 85.3240];
  const center: [number, number] = lat && lng ? [lat, lng] : defaultCenter;

  return (
    <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
      <div className="bg-[#F9FAFB] px-4 py-2 text-sm text-[#6B7280] flex items-center justify-between">
        <span>📍 Click on the map to pin your shop location</span>
        {lat && lng && (
          <span className="text-[#16A34A] font-medium text-xs">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        )}
      </div>
      <div style={{ height: "280px", width: "100%" }}>
        <MapContainer
          center={center}
          zoom={lat && lng ? 14 : 7}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onLocationChange={onLocationChange} />
          {lat && lng && <Marker position={[lat, lng]} icon={pinIcon} />}
        </MapContainer>
      </div>
    </div>
  );
}
