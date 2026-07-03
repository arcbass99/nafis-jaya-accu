import Link from "next/link";
import BatteryBoxScrollAnimation from "./BatteryBoxScrollAnimation";
import styles from "./HeroSection.module.css";

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
            <Link className="btn btn-primary" href="/pesan-aki">
              Cari Tipe dan Pesan Aki
            </Link>
            <Link className="btn btn-secondary" href="/lokasi">
              Lihat Lokasi Toko
            </Link>
            <Link className="btn btn-secondary" href="/layanan">
              Layanan Toko
            </Link>
          </div>

          <p className="hero-note">
            Harga dan pilihan merek dikonfirmasi via WhatsApp agar tetap sesuai stok terbaru, tipe kendaraan, dan kebutuhan pemasangan.
          </p>
        </div>

        <div className={styles.visualPanel} aria-hidden="true">
          <BatteryBoxScrollAnimation startVisibleRatio={0.1} endViewportRatio={0.18} />
        </div>
      </div>
    </section>
  );
}
