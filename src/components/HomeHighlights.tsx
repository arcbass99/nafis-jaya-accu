import Link from "next/link";
import { ChevronRight, MapPin, Search, Zap } from "lucide-react";
import { STORE_HOURS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const highlights = [
  {
    href: "/home/pesan-aki",
    title: "Katalog 36 Tipe Aki",
    description: "Cari sesuai mobil, motor, atau kode",
    icon: Search,
    accent: "is-cyan",
  },
  {
    href: "/home/layanan",
    title: "Setrum & Tukar Tambah",
    description: "Cek aki, cas, & pasang di toko",
    icon: Zap,
    accent: "is-amber",
  },
  {
    href: "/home/lokasi",
    title: "Lokasi & Jam Toko",
    description: `Buka ${STORE_HOURS} • Google Maps`,
    icon: MapPin,
    accent: "is-green",
  },
] as const;

export default function HomeHighlights() {
  return (
    <section className="section highlights-section" aria-label="Sorotan layanan">
      <div className="highlights-grid">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="highlight-card glass-card">
              <span className={cn("highlight-icon", item.accent)} aria-hidden="true">
                <Icon size={17} />
              </span>
              <div className="highlight-copy">
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </div>
              <ChevronRight size={15} className="highlight-arrow" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
