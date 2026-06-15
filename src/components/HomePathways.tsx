import Link from "next/link";
import { BatteryCharging, MapPin, Search, Wrench } from "lucide-react";

const pathways = [
  {
    title: "Pesan Aki",
    description: "Cari tipe aki mobil, motor, atau VRLA sebagai panduan awal sebelum cek stok dan harga via WhatsApp.",
    href: "/pesan-aki",
    cta: "Buka katalog aki",
    icon: Search,
  },
  {
    title: "Layanan Toko",
    description: "Cek layanan jual aki, pasang di toko, setrum, tukar tambah, dan perlengkapan aki.",
    href: "/layanan",
    cta: "Lihat layanan",
    icon: Wrench,
  },
  {
    title: "Lokasi Toko",
    description: "Lihat peta toko, jam buka, area utama, dan tombol Google Maps untuk navigasi langsung.",
    href: "/lokasi",
    cta: "Lihat lokasi",
    icon: MapPin,
  },
] as const;

export default function HomePathways() {
  return (
    <section className="section home-pathways-section" aria-labelledby="home-pathways-title">
      <div className="section-heading phi-heading">
        <div>
          <p className="section-kicker">
            <BatteryCharging size={16} aria-hidden="true" />
            Arah cepat
          </p>
          <h2 id="home-pathways-title">Mau Mulai dari Mana?</h2>
        </div>
        <p>
          Pilih kebutuhanmu: cari tipe aki, cek layanan toko, atau buka lokasi Nafis Jaya Accu.
        </p>
      </div>

      <div className="home-pathway-grid">
        {pathways.map((item) => {
          const Icon = item.icon;
          return (
            <Link className="home-pathway-card glass-card" href={item.href} key={item.href}>
              <span className="home-pathway-icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <strong>{item.cta}</strong>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
