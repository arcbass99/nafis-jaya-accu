"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { BUSINESS_NAME, STORE_COORDINATES, STORE_HOURS } from "@/lib/constants";

const storeIcon = L.divIcon({
  className: "custom-store-marker",
  html: `<span class="marker-pulse"></span><span class="marker-core"></span>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

export default function LeafletMap() {
  return (
    <MapContainer
      center={[STORE_COORDINATES.lat, STORE_COORDINATES.lng]}
      zoom={16}
      scrollWheelZoom={false}
      className="leaflet-map"
      aria-label="Peta lokasi Nafis Jaya Accu"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[STORE_COORDINATES.lat, STORE_COORDINATES.lng]} icon={storeIcon}>
        <Popup>
          <strong>{BUSINESS_NAME}</strong>
          <br />
          Buka {STORE_HOURS}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
