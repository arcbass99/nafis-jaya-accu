"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Clock3, MapPin, Navigation, Store } from "lucide-react";
import { BUSINESS_NAME, GOOGLE_MAPS_URL, SERVICE_AREA, STORE_HOURS } from "@/lib/constants";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Memuat peta toko...</div>,
});

export default function LocationMap() {
  return (
    <section id="lokasi" className="section location-section" aria-labelledby="location-title">
      <div className="section-heading phi-heading">
        <div>
          <p className="section-kicker">
            <MapPin size={16} aria-hidden="true" />
            Lokasi toko
          </p>
          <h2 id="location-title">Lokasi Nafis Jaya Accu</h2>
        </div>
        <p>
          Lihat titik toko melalui peta, lalu buka Google Maps untuk navigasi langsung.
        </p>
      </div>

      <div className="location-grid phi-grid">
        <div className="map-shell glass-panel">
          <LeafletMap />
        </div>

        <aside className="location-card glass-panel" aria-label="Informasi lokasi toko">
          <div className="location-card-icon" aria-hidden="true">
            <Store size={28} />
          </div>
          <h3>{BUSINESS_NAME}</h3>
          <p>
            Toko aki untuk pembelian aki mobil, motor, setrum aki, tukar tambah, serta perlengkapan seperti air aki, air zuur, clamp, dan kabel aki.
          </p>

          <ul className="location-info">
            <li>
              <Clock3 size={18} aria-hidden="true" />
              Buka {STORE_HOURS}
            </li>
            <li>
              <Navigation size={18} aria-hidden="true" />
              {SERVICE_AREA}
            </li>
          </ul>

          <div className="location-actions">
            <a className="btn btn-primary" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
              <Image src="/googleMaps.svg" alt="" width={22} height={22} aria-hidden="true" />
              Buka Google Maps
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
