import InteractiveWizard from "@/components/InteractiveWizard";
import { createPageMetadata, pageDescriptions } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Toko Aki Mobil & Motor Surabaya-Sidoarjo",
  description: pageDescriptions.home,
  path: "/",
});

export default function LandingPage() {
  return <InteractiveWizard />;
}
