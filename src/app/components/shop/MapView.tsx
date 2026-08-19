import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Location = {
  id: number;
  position: [number, number];
  vendorName: string;
  productCount: number;
  avgPrice: number;
};

const vendorPinIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 44px;
      height: 58px;
      background: transparent;
      filter: drop-shadow(0 10px 16px rgba(15, 23, 42, 0.24));
      display: grid;
      place-items: center;
    ">
      <div style="
        width: 30px;
        height: 30px;
        border-radius: 999px 999px 999px 0;
        background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
        border: 3px solid rgba(255, 255, 255, 0.98);
        transform: rotate(-45deg);
        display: grid;
        place-items: center;
        margin-top: 6px;
      ">
        <span style="
          transform: rotate(45deg);
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.24);
        "></span>
      </div>
    </div>
  `,
  iconSize: [44, 58],
  iconAnchor: [22, 54],
  popupAnchor: [0, -50],
});

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-NP").format(value);
}

function FitToLocations({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) {
      return;
    }

    if (locations.length === 1) {
      map.setView(locations[0].position, 12);
      return;
    }

    const bounds = L.latLngBounds(locations.map((location) => location.position));
    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 12,
    });
  }, [locations, map]);

  return null;
}

function MapClickHandler({
  onClear,
}: {
  onClear?: () => void;
}) {
  useMapEvents({
    click: () => {
      onClear?.();
    },
  });

  return null;
}

export type MapViewProps = {
  locations: Location[];
  onSelect?: (vendorId: number | null) => void;
};

export function MapView({ locations, onSelect }: MapViewProps) {
  useEffect(() => {
    console.log('[MapView] locations:', locations);
  }, [locations]);

  return (
    <div
      style={{
        margin: 0,
        border: "1px solid rgba(148, 163, 184, 0.25)",
        borderRadius: "20px",
        overflow: "hidden",
        height: "clamp(280px, 50vh, 600px)",
        minHeight: "280px",
        width: "100%",
        position: "relative",
        zIndex: 0,
        isolation: "isolate",
        boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef7f1 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 2,
          padding: "10px 14px",
          borderRadius: "16px",
          background: "rgba(15, 23, 42, 0.8)",
          color: "#fff",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
        }}
      >
        <div style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8 }}>
          Vendor Map
        </div>
        <div style={{ fontSize: "15px", fontWeight: 700, marginTop: "2px" }}>
          Tap a pin to view the vendor name
        </div>
      </div>

      <MapContainer
        center={[28.3949, 84.124]} // Nepal Center
        zoom={7}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onClear={() => onSelect?.(null)}
        />

        <FitToLocations locations={locations} />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            icon={vendorPinIcon}
            eventHandlers={{
              click: () => onSelect?.(location.id),
            }}
          >
            <Popup
              className="vendor-popup"
              closeButton={false}
              autoPanPadding={[24, 24]}
            >
              <div style={{ minWidth: "220px", padding: "2px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "#e8f6ee",
                    color: "#166534",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      background: "#22c55e",
                      boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.18)",
                    }}
                  />
                  Vendor Location
                </div>
                <h3
                  style={{
                    fontWeight: 800,
                    margin: "0 0 8px",
                    fontSize: "16px",
                    lineHeight: 1.2,
                    color: "#0f172a",
                  }}
                >
                  {location.vendorName}
                </h3>

                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "13px",
                    color: "#475569",
                    lineHeight: 1.45,
                  }}
                >
                  Located at latitude {location.position[0].toFixed(4)} and longitude {location.position[1].toFixed(4)}.
                </p>

                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: "13px",
                    color: "#475569",
                    lineHeight: 1.45,
                  }}
                >
                  Products listed: {location.productCount}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#475569",
                    lineHeight: 1.45,
                  }}
                >
                  Avg Price: Rs. {formatPrice(location.avgPrice)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}