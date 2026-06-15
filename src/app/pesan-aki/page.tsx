import BatterySearch from "@/components/BatterySearch";
import AppShell from "@/components/AppShell";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import HowToOrder from "@/components/HowToOrder";
import PageIntro from "@/components/PageIntro";
import { createPageMetadata, pageDescriptions } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Pesan Aki Mobil & Motor",
  description: pageDescriptions.pesanAki,
  path: "/pesan-aki",
  keywords: [
    "pesan aki mobil",
    "pesan aki motor",
    "katalog aki mobil",
    "katalog aki motor",
    "cek stok aki",
    "harga aki Surabaya",
    "aki MF kering",
    "aki basah",
    "VRLA",
  ],
});

export default function PesanAkiPage() {
  return (
    <AppShell>
      <PageIntro
        kicker="Katalog aki"
        title="Cari dan Pesan Aki yang Cocok"
        description="Pilih tipe aki sebagai panduan awal. Stok, harga, merek, dan opsi pemasangan dikonfirmasi via WhatsApp agar sesuai kendaraan dan kebutuhanmu."
      />
      <BatterySearch />
      <HowToOrder />
      <FinalCTA
        kicker="Belum ketemu?"
        title="Belum Menemukan Tipe Aki?"
        description="Kirim detail kendaraan ke admin agar pilihan aki, stok, dan opsi pemasangan bisa dicek lebih tepat."
        primaryLabel="Chat Lewat Katalog"
        primaryHref="/pesan-aki"
        secondaryLabel="Lihat Lokasi"
        secondaryHref="/lokasi"
      />
      <Footer />
    </AppShell>
  );
}
