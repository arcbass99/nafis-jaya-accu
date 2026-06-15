import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { BUSINESS_NAME, SERVICE_AREA, STORE_HOURS } from "@/lib/constants";
import { DEFAULT_OG_IMAGE, SITE_URL, getLocalBusinessJsonLd, getWebsiteJsonLd } from "@/lib/seo";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: BUSINESS_NAME,
  title: {
    default: `${BUSINESS_NAME} | Aki Mobil & Motor Surabaya-Sidoarjo`,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: `Pesan aki mobil dan motor, setrum aki, tukar tambah, dan perlengkapan aki untuk ${SERVICE_AREA}. Buka ${STORE_HOURS}.`,
  authors: [{ name: BUSINESS_NAME }],
  creator: BUSINESS_NAME,
  publisher: BUSINESS_NAME,
  category: "local business",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    title: `${BUSINESS_NAME} | Solusi Aki Surabaya-Sidoarjo`,
    description: `Aki mobil, motor, setrum, tukar tambah, dan perlengkapan aki. Buka ${STORE_HOURS}. Area ${SERVICE_AREA}.`,
    url: SITE_URL,
    siteName: BUSINESS_NAME,
    type: "website",
    locale: "id_ID",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS_NAME} | Aki Mobil & Motor`,
    description: `Buka ${STORE_HOURS}. Area ${SERVICE_AREA}. Konsultasi stok dan harga via WhatsApp.`,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07090d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const structuredData = [getLocalBusinessJsonLd(), getWebsiteJsonLd()];

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
