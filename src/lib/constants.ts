export const BUSINESS_NAME = "Nafis Jaya Accu";
export const BUSINESS_TAGLINE = "Aki Mobil • Motor • Setrum • Tukar Tambah";
export const WHATSAPP_NUMBER = "6281331289410";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/E94fTsWyBTr7psELA";
export const INSTAGRAM_URL = "https://www.instagram.com/nfs_ky07/";

export const STORE_COORDINATES = {
  lat: -7.4099167,
  lng: 112.6121667,
  dms: `7°24'35.7"S 112°36'43.8"E`,
};

export const STORE_HOURS = "06.00-21.00";
export const SERVICE_AREA = "Surabaya, Sidoarjo, dan sekitarnya";

export const navItems = [
  { id: "beranda", label: "Beranda" },
  { id: "cari-aki", label: "Cari Aki" },
  { id: "layanan", label: "Layanan" },
  { id: "lokasi", label: "Lokasi" },
  { id: "faq", label: "FAQ" },
] as const;

export const orderNeedOptions = [
  "Beli aki baru",
  "Cek aki dulu",
  "Setrum / cas aki",
  "Tukar tambah aki",
  "Tanya stok dan harga",
] as const;
