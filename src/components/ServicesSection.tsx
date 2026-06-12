import { BatteryCharging, RefreshCcw, Wrench, Zap } from "lucide-react";
import { services } from "@/data/services";

const iconMap = {
  battery: BatteryCharging,
  zap: Zap,
  refresh: RefreshCcw,
  wrench: Wrench,
} as const;

export default function ServicesSection() {
  return (
    <section id="layanan" className="section services-section" aria-labelledby="services-title">
      <div className="section-heading phi-heading">
        <div>
          <p className="section-kicker">
            <Wrench size={16} aria-hidden="true" />
            Layanan toko
          </p>
          <h2 id="services-title">Layanan Aki & Perlengkapan</h2>
        </div>
        <p>
          Selain aki baru, tersedia setrum, tukar tambah, air aki, air zuur, clamp, kabel, dan kebutuhan kecil seputar aki.
        </p>
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
          Stok, merek, harga, dan opsi tukar tambah dikonfirmasi agar sesuai dengan kondisi kendaraan.
        </p>
        <a className="text-link" href="#cari-aki">
          Cari tipe aki dulu
        </a>
      </div>
    </section>
  );
}
