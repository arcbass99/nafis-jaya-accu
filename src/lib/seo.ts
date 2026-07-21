import type { Metadata } from "next";
import {
  BUSINESS_NAME,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
  SERVICE_AREA,
  STORE_COORDINATES,
  STORE_HOURS,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
} from "@/lib/constants";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nafis-jaya-accu.vercel.app").replace(/\/$/, "");

export const DEFAULT_OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: `${BUSINESS_NAME} - Aki Mobil & Motor Surabaya-Sidoarjo`,
};

const baseKeywords = [
  BUSINESS_NAME,
  "aki mobil Surabaya",
  "aki motor Surabaya",
  "aki Sidoarjo",
  "toko aki Surabaya Sidoarjo",
  "setrum aki",
  "tukar tambah aki",
];

type PageMetadataInput = {
  title: string;
  description: string;
  path: "/" | "/home" | "/home/pesan-aki" | "/home/layanan" | "/home/lokasi";
  keywords?: string[];
};

export function createPageMetadata({ title, description, path, keywords = [] }: PageMetadataInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const keywordSet = Array.from(new Set([...baseKeywords, ...keywords]));

  return {
    title,
    description,
    keywords: keywordSet,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${BUSINESS_NAME}`,
      description,
      url,
      siteName: BUSINESS_NAME,
      locale: "id_ID",
      type: "website",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BUSINESS_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS_NAME,
    url: SITE_URL,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE.url}`,
    description:
      "Toko aki mobil dan motor untuk Surabaya, Sidoarjo, dan sekitarnya. Melayani pencarian aki, cek dan pasang di toko, setrum aki, tukar tambah, serta perlengkapan aki.",
    telephone: `+${WHATSAPP_NUMBER}`,
    areaServed: ["Surabaya", "Sidoarjo", "Sekitarnya"],
    openingHours: "Mo-Su 06:00-21:00",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "06:00",
        closes: "21:00",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: STORE_COORDINATES.lat,
      longitude: STORE_COORDINATES.lng,
    },
    hasMap: GOOGLE_MAPS_URL,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${WHATSAPP_NUMBER}`,
      contactType: "customer service",
      availableLanguage: ["id"],
      areaServed: SERVICE_AREA,
    },
    sameAs: [INSTAGRAM_URL, GOOGLE_MAPS_URL, WHATSAPP_URL],
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BUSINESS_NAME,
    url: SITE_URL,
    inLanguage: "id-ID",
    publisher: {
      "@id": `${SITE_URL}/#business`,
    },
  };
}

export const pageDescriptions = {
  home: `Nafis Jaya Accu menyediakan aki mobil, aki motor, setrum aki, tukar tambah, dan perlengkapan aki untuk ${SERVICE_AREA}. Buka ${STORE_HOURS}.`,
  pesanAki:
    "Cari tipe aki mobil dan motor sebagai panduan awal, lalu kirim ringkasan ke WhatsApp Nafis Jaya Accu untuk cek stok, harga, merek, dan opsi pemasangan.",
  layanan:
    "Layanan jual aki mobil dan motor, cek dan pasang di toko, setrum aki, tukar tambah, air aki, air zuur, clamp aki, dan kabel aki di Nafis Jaya Accu.",
  lokasi: `Lihat lokasi Nafis Jaya Accu, area layanan ${SERVICE_AREA}, jam buka ${STORE_HOURS}, dan tombol Google Maps untuk navigasi langsung ke toko.`,
} as const;
