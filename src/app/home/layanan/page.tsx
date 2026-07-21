import AppShell from "@/components/AppShell";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import { createPageMetadata, pageDescriptions } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Layanan Aki, Setrum, dan Tukar Tambah",
  description: pageDescriptions.layanan,
  path: "/home/layanan",
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
      <ServicesSection />
      <Footer />
    </AppShell>
  );
}
