import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { BUSINESS_NAME, GOOGLE_MAPS_URL, SERVICE_AREA, STORE_HOURS, WHATSAPP_URL } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nafis-jaya-accu.vercel.app";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${BUSINESS_NAME} | Aki Mobil & Motor Surabaya-Sidoarjo`,
  description:
    "Pesan aki mobil, aki motor, setrum aki, tukar tambah, dan perlengkapan aki di Nafis Jaya Accu untuk area Surabaya, Sidoarjo, dan sekitarnya.",
  keywords: [
    "Nafis Jaya Accu",
    "aki Surabaya",
    "aki Sidoarjo",
    "aki mobil",
    "aki motor",
    "setrum aki",
    "tukar tambah aki",
    "air aki",
    "air zuur",
  ],
  openGraph: {
    title: `${BUSINESS_NAME} | Solusi Aki Surabaya-Sidoarjo`,
    description: `Aki mobil, motor, setrum, tukar tambah, dan perlengkapan aki. Buka ${STORE_HOURS}. Area ${SERVICE_AREA}.`,
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${BUSINESS_NAME} preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS_NAME} | Aki Mobil & Motor`,
    description: `Buka ${STORE_HOURS}. Area ${SERVICE_AREA}. Konsultasi stok dan harga via WhatsApp.`,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: BUSINESS_NAME,
    description: "Toko aki mobil, aki motor, setrum aki, tukar tambah, dan perlengkapan aki.",
    areaServed: SERVICE_AREA,
    openingHours: "Mo-Su 06:00-21:00",
    telephone: "+6281331289410",
    hasMap: GOOGLE_MAPS_URL,
    url: siteUrl,
    sameAs: [WHATSAPP_URL, GOOGLE_MAPS_URL],
  };

  return (
    <html lang="id" className={plusJakarta.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
