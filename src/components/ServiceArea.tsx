import { MapPinned, Navigation, ShieldAlert } from "lucide-react";
import { SERVICE_AREA } from "@/lib/constants";

export default function ServiceArea() {
  return (
    <section className="section area-section" aria-labelledby="area-title">
      <div className="area-panel glass-panel phi-grid">
        <div>
          <p className="section-kicker">
            <MapPinned size={16} aria-hidden="true" />
            Area layanan
          </p>
          <h2 id="area-title">Area Surabaya-Sidoarjo</h2>
          <p>
            Area utama Nafis Jaya Accu adalah {SERVICE_AREA}. Untuk antar atau pasang di lokasi, konfirmasi dulu agar admin bisa mengecek jarak, stok, dan estimasi layanan.
          </p>
          <a className="btn btn-secondary" href="#lokasi">
            Lihat Lokasi Toko
          </a>
        </div>

        <div className="area-mini-map" aria-hidden="true">
          <span className="area-ring ring-one" />
          <span className="area-ring ring-two" />
          <span className="area-ring ring-three" />
          <div className="area-pin">
            <Navigation size={24} />
          </div>
          <div className="area-warning">
            <ShieldAlert size={18} />
            Konfirmasi lokasi dulu untuk layanan luar toko
          </div>
        </div>
      </div>
    </section>
  );
}
