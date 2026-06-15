import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import LocationMap from "@/components/LocationMap";
import PageIntro from "@/components/PageIntro";
import ServiceArea from "@/components/ServiceArea";
import { BUSINESS_NAME, SERVICE_AREA } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Lokasi Toko | ${BUSINESS_NAME}`,
  description: `Lihat lokasi Nafis Jaya Accu, area layanan ${SERVICE_AREA}, jam buka, dan tombol Google Maps untuk navigasi langsung ke toko.`,
  alternates: {
    canonical: "/lokasi",
  },
};

export default function LokasiPage() {
  return (
    <AppShell>
      <PageIntro
        kicker="Lokasi toko"
        title="Lokasi Nafis Jaya Accu"
        description="Buka peta toko, cek area utama Surabaya-Sidoarjo, lalu gunakan Google Maps untuk navigasi langsung. Chat dulu jika ingin memastikan stok atau layanan sebelum datang."
      />
      <ServiceArea />
      <LocationMap />
      <FinalCTA
        kicker="Mau datang?"
        title="Cek Stok Sebelum ke Toko"
        description="Chat admin dulu jika ingin memastikan tipe aki, stok, harga, atau layanan sebelum berangkat ke lokasi."
        primaryLabel="Cari Tipe Aki"
        primaryHref="/pesan-aki"
        secondaryLabel="Buka Lokasi"
        secondaryHref="/lokasi"
      />
      <Footer />
    </AppShell>
  );
}
