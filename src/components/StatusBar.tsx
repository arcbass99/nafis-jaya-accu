import { BatteryCharging, Clock3, MapPin, RefreshCcw, SearchCheck, Wrench } from "lucide-react";
import { SERVICE_AREA, STORE_HOURS } from "@/lib/constants";

const statusItems = [
  { title: "Buka Setiap Hari", detail: STORE_HOURS, icon: Clock3 },
  { title: "Area Utama", detail: SERVICE_AREA, icon: MapPin },
  { title: "Cek & Pasang", detail: "Tersedia di toko", icon: SearchCheck },
  { title: "Setrum Aki", detail: "Cek kondisi dulu", icon: BatteryCharging },
  { title: "Tukar Tambah", detail: "Sesuai kondisi aki", icon: RefreshCcw },
  { title: "Perlengkapan", detail: "Air aki, zuur, clamp, kabel", icon: Wrench },
];

export default function StatusBar() {
  return (
    <section className="status-section" aria-label="Info cepat Nafis Jaya Accu">
      <div className="status-grid">
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <article className="status-card" key={item.title}>
              <Icon size={20} aria-hidden="true" />
              <div>
                <h2>{item.title}</h2>
                <p>{item.detail}</p>
              </div>
            </article>
          );
        })}
      </div>
      <p className="status-note">
        Untuk antar atau pemasangan di lokasi, konfirmasi dulu via WhatsApp sesuai jarak, stok, dan kondisi lokasi.
      </p>
    </section>
  );
}
