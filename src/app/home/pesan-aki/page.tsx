import BatterySearch from "@/components/BatterySearch";
import AppShell from "@/components/AppShell";
import Footer from "@/components/Footer";
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
      <BatterySearch />
      <Footer />
    </AppShell>
  );
}
