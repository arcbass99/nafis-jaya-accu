import BatterySearch from "@/components/BatterySearch";
import AppShell from "@/components/AppShell";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { createPageMetadata, pageDescriptions } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Pesan Aki Mobil & Motor",
  description: pageDescriptions.pesanAki,
  path: "/home/pesan-aki",
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
        description="Gunakan katalog sebagai panduan belanja aki: cari berdasarkan kendaraan atau kode aki, pilih tipe yang mendekati, lalu kirim ringkasan ke WhatsApp untuk cek stok, harga, merek, dan opsi pemasangan."
      />
      <BatterySearch />
      <Footer />
    </AppShell>
  );
}
