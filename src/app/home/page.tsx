import AppShell from "@/components/AppShell";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { createPageMetadata, pageDescriptions } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aki Mobil & Motor Surabaya-Sidoarjo",
  description: pageDescriptions.home,
  path: "/home",
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
      <FAQSection />
      <Footer />
    </AppShell>
  );
}
