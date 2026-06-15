import AppShell from "@/components/AppShell";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import HowToOrder from "@/components/HowToOrder";
import PageIntro from "@/components/PageIntro";
import ServicesSection from "@/components/ServicesSection";
import { createPageMetadata, pageDescriptions } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Layanan Aki, Setrum, dan Tukar Tambah",
  description: pageDescriptions.layanan,
  path: "/layanan",
  keywords: [
    "layanan aki Surabaya",
    "setrum aki Surabaya",
    "cas aki",
    "tukar tambah aki",
    "cek aki",
    "pasang aki di toko",
    "air aki",
    "air zuur",
    "clamp aki",
    "kabel aki",
  ],
});

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
