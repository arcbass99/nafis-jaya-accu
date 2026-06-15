import Link from "next/link";
import { BatteryCharging, MapPin } from "lucide-react";

type FinalCTAProps = {
  kicker?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function FinalCTA({
  kicker = "Masih ragu?",
  title = "Masih Bingung Pilih Aki?",
  description = "Gunakan katalog sebagai panduan awal, lalu kirim ringkasan pesanan untuk cek stok, harga, atau opsi aki yang sesuai.",
  primaryLabel = "Cari Tipe Aki",
  primaryHref = "/pesan-aki",
  secondaryLabel = "Lihat Lokasi",
  secondaryHref = "/lokasi",
}: FinalCTAProps) {
  return (
    <section className="section final-cta-section" aria-labelledby="final-cta-title">
      <div className="final-cta glass-panel">
        <div>
          <p className="section-kicker">
            <BatteryCharging size={16} aria-hidden="true" />
            {kicker}
          </p>
          <h2 id="final-cta-title">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="final-cta-actions">
          <Link className="btn btn-primary" href={primaryHref}>
            {primaryLabel}
          </Link>
          <Link className="btn btn-secondary" href={secondaryHref}>
            <MapPin size={19} aria-hidden="true" />
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
