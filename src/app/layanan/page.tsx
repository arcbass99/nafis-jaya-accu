import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import HowToOrder from "@/components/HowToOrder";
import PageIntro from "@/components/PageIntro";
import ServicesSection from "@/components/ServicesSection";
import { BUSINESS_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Layanan Aki | ${BUSINESS_NAME}`,
  description:
    "Layanan jual aki mobil dan motor, cek dan pasang di toko, setrum aki, tukar tambah, serta perlengkapan aki di Nafis Jaya Accu.",
  alternates: {
    canonical: "/layanan",
  },
};

export default function LayananPage() {
  return (
    <AppShell>
      <PageIntro
        kicker="Layanan toko"
        title="Layanan Aki Nafis Jaya Accu"
        description="Cek kebutuhan aki dalam satu tempat: beli aki mobil atau motor, setrum/cas aki, tukar tambah, cek dan pasang di toko, serta perlengkapan aki."
      />
      <ServicesSection />
      <HowToOrder />
      <FinalCTA
        kicker="Perlu dicek dulu?"
        title="Butuh Cek Kondisi Aki?"
        description="Datang ke toko atau chat admin untuk memastikan kondisi aki, opsi setrum, tukar tambah, dan stok yang sesuai."
        primaryLabel="Cari Tipe Aki"
        primaryHref="/pesan-aki"
        secondaryLabel="Lihat Lokasi"
        secondaryHref="/lokasi"
      />
      <Footer />
    </AppShell>
  );
}
