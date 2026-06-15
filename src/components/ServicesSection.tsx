import Link from "next/link";
import { BatteryCharging, Clock3, MapPin, RefreshCcw, SearchCheck, Wrench, Zap } from "lucide-react";
import { services } from "@/data/services";
import { SERVICE_AREA, STORE_HOURS } from "@/lib/constants";

const iconMap = {
  battery: BatteryCharging,
  zap: Zap,
  refresh: RefreshCcw,
  wrench: Wrench,
} as const;

const serviceSummaryItems = [
  { title: "Buka Setiap Hari", detail: STORE_HOURS, icon: Clock3 },
  { title: "Area Utama", detail: SERVICE_AREA, icon: MapPin },
  { title: "Cek & Pasang", detail: "Tersedia di toko", icon: SearchCheck },
] as const;

export default function ServicesSection() {
  return (
    <section id="layanan" className="section services-section" aria-labelledby="services-title">
      <div className="section-heading phi-heading">
        <div>
          <p className="section-kicker">
            <Wrench size={16} aria-hidden="true" />
            Layanan toko
          </p>
          <h2 id="services-title">Layanan Aki Nafis Jaya Accu</h2>
        </div>
        <p>
          Jual aki mobil dan motor, cek dan pasang di toko, setrum/cas aki, tukar tambah, serta perlengkapan aki.
        </p>
      </div>

      <div className="service-overview glass-panel" aria-label="Ringkasan operasional layanan">
        <div className="service-overview-copy">
          <span>Info operasional</span>
          <strong>Datang ke toko untuk cek/pasang, atau chat admin dulu untuk memastikan stok dan opsi layanan.</strong>
          <p>
            Untuk antar atau pemasangan di lokasi, konfirmasi via WhatsApp sesuai jarak, stok, dan kondisi lokasi.
          </p>
        </div>

        <div className="service-overview-grid">
          {serviceSummaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="service-overview-card" key={item.title}>
                <Icon size={18} aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="services-grid">
        {services.map((service) => {
          const Icon = iconMap[service.icon];
          return (
            <article className="service-card glass-card" key={service.title}>
              <div className="service-icon" aria-hidden="true">
                <Icon size={24} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          );
        })}
      </div>

      <div className="service-note glass-panel">
        <p>
          Stok, merek, harga, dan opsi tukar tambah dikonfirmasi agar sesuai dengan kondisi kendaraan dan ketersediaan terbaru.
        </p>
        <Link className="text-link" href="/pesan-aki">
          Cari tipe aki dulu
        </Link>
      </div>
    </section>
  );
}
