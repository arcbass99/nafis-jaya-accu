import AppShell from "@/components/AppShell";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HomePathways from "@/components/HomePathways";
import { createPageMetadata, pageDescriptions } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aki Mobil & Motor Surabaya-Sidoarjo",
  description: pageDescriptions.home,
  path: "/",
  keywords: [
    "Nafis Jaya Accu",
    "toko aki Surabaya",
    "toko aki Sidoarjo",
    "aki mobil Surabaya Sidoarjo",
    "aki motor Surabaya Sidoarjo",
    "pesan aki via WhatsApp",
  ],
});

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
