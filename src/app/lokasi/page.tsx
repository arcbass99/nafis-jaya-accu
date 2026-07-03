import AppShell from "@/components/AppShell";
import Footer from "@/components/Footer";
import LocationMap from "@/components/LocationMap";
import PageIntro from "@/components/PageIntro";
import ServiceArea from "@/components/ServiceArea";
import { createPageMetadata, pageDescriptions } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Lokasi Toko Aki Nafis Jaya Accu",
  description: pageDescriptions.lokasi,
  path: "/lokasi",
  keywords: [
    "lokasi Nafis Jaya Accu",
    "lokasi toko aki",
    "toko aki terdekat",
    "toko aki Surabaya",
    "toko aki Sidoarjo",
    "Google Maps Nafis Jaya Accu",
  ],
});

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
      <Footer />
    </AppShell>
  );
}
