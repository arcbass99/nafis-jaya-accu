import AppShell from "@/components/AppShell";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export default function NotFound() {
  return (
    <AppShell>
      <PageIntro
        kicker="Halaman tidak ditemukan"
        title="Halaman Ini Tidak Tersedia"
        description="Link yang dibuka mungkin sudah berubah. Pilih katalog aki, layanan toko, atau lokasi Nafis Jaya Accu untuk melanjutkan."
      />
      <FinalCTA
        kicker="Lanjut dari sini"
        title="Cari Kebutuhan Aki Tanpa Bingung"
        description="Buka katalog untuk memilih tipe aki, cek layanan toko, atau lihat lokasi sebelum datang."
        primaryLabel="Buka Katalog Aki"
        primaryHref="/pesan-aki"
        secondaryLabel="Lihat Lokasi"
        secondaryHref="/lokasi"
      />
      <Footer />
    </AppShell>
  );
}
