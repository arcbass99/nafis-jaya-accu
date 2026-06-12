import BatterySearch from "@/components/BatterySearch";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowToOrder from "@/components/HowToOrder";
import LocationMap from "@/components/LocationMap";
import ServiceArea from "@/components/ServiceArea";
import ServicesSection from "@/components/ServicesSection";
import Sidebar from "@/components/Sidebar";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  return (
    <>
      <Sidebar />
      <main className="app-main">
        <HeroSection />
        <StatusBar />
        <BatterySearch />
        <ServicesSection />
        <HowToOrder />
        <ServiceArea />
        <LocationMap />
        <FAQSection />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
