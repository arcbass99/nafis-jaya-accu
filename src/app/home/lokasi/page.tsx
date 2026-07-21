import AppShell from "@/components/AppShell";
import Footer from "@/components/Footer";
import LocationMap from "@/components/LocationMap";
import { createPageMetadata, pageDescriptions } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Lokasi Toko Aki Nafis Jaya Accu",
  description: pageDescriptions.lokasi,
  path: "/home/lokasi",
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
      <LocationMap />
      <Footer />
    </AppShell>
  );
}
