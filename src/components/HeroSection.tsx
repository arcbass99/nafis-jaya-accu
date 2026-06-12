import { Battery, Clock3, MapPinned, ShieldCheck, Wrench } from "lucide-react";
import { SERVICE_AREA, STORE_HOURS } from "@/lib/constants";

const heroStats = [
  { label: "Jam buka", value: STORE_HOURS, icon: Clock3 },
  { label: "Area utama", value: SERVICE_AREA, icon: MapPinned },
  { label: "Layanan", value: "Cek, pasang, setrum, tukar tambah", icon: Wrench },
];

export default function HeroSection() {
  return (
    <section id="beranda" className="section hero-section" aria-labelledby="hero-title">
      <div className="hero-grid phi-grid">
        <div className="hero-copy">
          <p className="eyebrow">Nafis Jaya Accu</p>
          <h1 id="hero-title">
            <span className="hero-title-line">Aki Mobil & Motor untuk</span>
            <span className="hero-title-line">Surabaya-Sidoarjo.</span>
          </h1>
          <p className="hero-lead">
            Butuh aki baru, cek aki, setrum, tukar tambah, atau perlengkapan aki? Cari tipe aki sebagai panduan awal, lalu konfirmasi stok dan harga ke admin.
          </p>

          <div className="hero-actions" aria-label="Aksi utama">
            <a className="btn btn-primary" href="#cari-aki">
              Cari Tipe Aki
            </a>
            <a className="btn btn-secondary" href="#lokasi">
              Lihat Lokasi Toko
            </a>
          </div>

          <p className="hero-note">
            Harga dan pilihan merek dikonfirmasi via WhatsApp agar tetap sesuai stok terbaru, tipe kendaraan, dan kebutuhan pemasangan.
          </p>
        </div>

        <div className="hero-console glass-panel" aria-label="Ringkasan layanan toko">
          <div className="console-header">
            <div>
              <span className="status-pulse" aria-hidden="true" />
              <span>Siap konsultasi</span>
            </div>
            <Battery size={24} aria-hidden="true" />
          </div>

          <div className="charge-card" aria-hidden="true">
            <span>Battery Service</span>
            <div className="charge-shell">
              <i />
            </div>
          </div>

          <div className="hero-stat-list">
            {heroStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div className="hero-stat" key={stat.label}>
                  <Icon size={20} aria-hidden="true" />
                  <div>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="console-badge">
            <ShieldCheck size={18} aria-hidden="true" />
            Cek & pasang tersedia di toko
          </div>
        </div>
      </div>
    </section>
  );
}
