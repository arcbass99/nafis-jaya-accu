import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HomePathways from "@/components/HomePathways";
import { BUSINESS_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${BUSINESS_NAME} | Aki Mobil & Motor Surabaya-Sidoarjo`,
  description:
    "Nafis Jaya Accu menyediakan aki mobil, aki motor, setrum aki, tukar tambah, dan perlengkapan aki untuk Surabaya, Sidoarjo, dan sekitarnya.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <AppShell>
      <HeroSection />
      <HomePathways />
      <FAQSection />
      <FinalCTA
        kicker="Mulai dari sini"
        title="Belum Yakin Mulai dari Mana?"
        description="Pilih katalog untuk mencari tipe aki, buka layanan untuk cek kebutuhan toko, atau lihat lokasi sebelum datang."
        primaryLabel="Buka Katalog Aki"
        primaryHref="/pesan-aki"
        secondaryLabel="Lihat Lokasi"
        secondaryHref="/lokasi"
      />
      <Footer />
    </AppShell>
  );
}
