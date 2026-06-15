import { BatteryCharging, MapPin } from "lucide-react";
import SectionLink from "./SectionLink";

export default function FinalCTA() {
  return (
    <section className="section final-cta-section" aria-labelledby="final-cta-title">
      <div className="final-cta glass-panel">
        <div>
          <p className="section-kicker">
            <BatteryCharging size={16} aria-hidden="true" />
            Masih ragu?
          </p>
          <h2 id="final-cta-title">Masih Bingung Pilih Aki?</h2>
          <p>
            Gunakan pencarian sebagai panduan awal, lalu kirim ringkasan pesanan untuk cek stok, harga, atau opsi aki yang sesuai.
          </p>
        </div>
        <div className="final-cta-actions">
          <SectionLink className="btn btn-primary" sectionId="cari-aki">
            Cari Tipe Aki
          </SectionLink>
          <SectionLink className="btn btn-secondary" sectionId="lokasi">
            <MapPin size={19} aria-hidden="true" />
            Lihat Lokasi
          </SectionLink>
        </div>
      </div>
    </section>
  );
}
