import Link from "next/link";
import { ArrowRight, MapPin, Search, Wrench } from "lucide-react";
import { STORE_HOURS } from "@/lib/constants";
import BatteryBoxScrollAnimation from "./BatteryBoxScrollAnimation";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section id="beranda" className="section hero-section" aria-labelledby="hero-title">
      <div className="hero-card">
        <div className="hero-grid phi-grid">
          <div className="hero-copy">
            <div className="hero-status-pill">
              <span className="status-live-dot" aria-hidden="true" />
              <span>Buka {STORE_HOURS} • Cek &amp; Pasang di Toko</span>
            </div>

            <h1 id="hero-title">
              <span className="hero-title-line">Aki Mobil &amp; Motor untuk</span>
              <span className="hero-title-line">Surabaya-Sidoarjo.</span>
            </h1>
            <p className="hero-lead">
              Butuh aki baru, cek aki, setrum, tukar tambah, atau perlengkapan aki? Cari tipe aki sebagai panduan awal, lalu konfirmasi stok dan harga ke admin.
            </p>

            <div className="hero-actions" aria-label="Aksi utama">
              <Link className="btn btn-primary hero-cta-primary" href="/home/pesan-aki">
                <Search size={14} aria-hidden="true" />
                Cari Tipe &amp; Pesan Aki
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <div className="hero-actions-secondary">
                <Link className="btn btn-secondary" href="/home/lokasi" aria-label="Lihat Lokasi Toko">
                  <MapPin size={13} aria-hidden="true" />
                  Lokasi Toko
                </Link>
                <Link className="btn btn-secondary" href="/home/layanan">
                  <Wrench size={13} aria-hidden="true" />
                  Layanan Toko
                </Link>
              </div>
            </div>

            <p className="hero-note">
              Harga dan pilihan merek dikonfirmasi via WhatsApp agar sesuai stok terbaru dan kendaraan Anda.
            </p>
          </div>

          <div className={styles.visualPanel} aria-hidden="true">
            <BatteryBoxScrollAnimation startVisibleRatio={0.1} endViewportRatio={0.18} />
          </div>
        </div>
      </div>
    </section>
  );
}
