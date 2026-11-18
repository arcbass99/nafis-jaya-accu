# Design Spec: Tahap 1 — Redesign Sidebar, Footer, & Halaman `/home` (Kombo Opsi 1 + 3)

**Tanggal:** 2026-11-16
**Tahap:** 1 dari 3 (Tahap 1: Sidebar/Shell & `/home` | Tahap 2: `/home/pesan-aki` | Tahap 3: `/home/layanan` & `/home/lokasi`)
**Pendekatan Terpilih:** Kombo Opsi 1 (*Compact Modern Showcase*) + Opsi 3 (*Visual-First 3D Hero di Mobile*), dilengkapi perbaikan tampilan & animasi Sidebar.

---

## 1. Tujuan & Masalah yang Diselesaikan
Meningkatkan kualitas visual, alur navigasi, dan daya tarik halaman pengenalan `/home` beserta kerangka navigasi bersamanya ([Sidebar.tsx](file:///c:/Users/Muhammad%20Nafis/My%20WEB%20vs%20code/nafis-jaya-accu/src/components/Sidebar.tsx) & [Footer.tsx](file:///c:/Users/Muhammad%20Nafis/My%20WEB%20vs%20code/nafis-jaya-accu/src/components/Footer.tsx)) tanpa menghilangkan satu pun fitur atau informasi penting:
1. **Sidebar (`Sidebar.tsx` + `globals.css`)**: Mengganti tampilan titik statis & progress HTML bawaan dengan menu ber-ikon, indikator pill aktif animasi, live status dot, drawer mobile animasi staggered + dukungan tombol `Escape`, serta garis progress scroll kustom yang konsisten.
2. **Hero `/home` (`HeroSection.tsx` + `HeroSection.module.css` + `BatteryBoxScrollAnimation.module.css`)**:
   - **Desktop (`> 980px`)**: Membungkus area hero dalam panel berlapis yang terintegrasi rapi, menata tombol aksi (CTA utama + pasangan tombol sekunder), dan mempertahankan posisi 3D Battery Box di kanan.
   - **Mobile (`<= 980px`)**: Memindahkan 3D Battery Box ke atas (`order: -1`) dengan ukuran lebih proporsional (`~11.5rem–13rem`) agar visual 3D produk langsung memikat mata di layar pertama bersama judul & tombol CTA.
3. **Jalan Pintas Layanan (`/home`)**: Menambahkan baris 3 kartu sorotan ringkas di antara Hero & FAQ untuk mengarahkan pengunjung langsung ke `/home/pesan-aki`, `/home/layanan`, dan `/home/lokasi` tanpa membuat halaman sesak.
4. **FAQ & Footer (`FAQSection.tsx`, `Footer.tsx`)**: Mengganti indikator `+ / -` pada FAQ dengan ikon `ChevronDown` yang berputar mulus, dan merampingkan Footer agar tidak mengulang link navigasi yang sudah selalu hadir di Sidebar / Bottom Nav.

### Batasan (Non-Goals & Anti-Goals)
- **Non-Goals:** Belum mengubah komponen halaman `/home/pesan-aki` (`BatterySearch`, `OrderSummary`), `/home/layanan` (`ServicesSection`), atau `/home/lokasi` (`LocationMap`) pada tahap ini (dikerjakan pada Tahap 2 dan 3), dan tidak mengubah logika 60-frame canvas di `BatteryBoxScrollAnimation.tsx`.
- **Anti-Goals:** Tidak menghilangkan tombol `Mode Akses Cepat` (`/`), tautan WhatsApp/Google Maps/Instagram, 7 pertanyaan FAQ, atau bottom nav mobile 4 tab (`Home`, `Pesan`, `Layanan`, `Lokasi`).

---

## 2. Rincian Desain Per Komponen

### A. Sidebar & Mobile Shell (`src/components/Sidebar.tsx` & `src/app/globals.css`)
- **Ikon & Indikator Aktif Menu:**
  - Desktop & Drawer memakai ikon `Home`, `Search`, `Wrench`, `MapPin` dari `lucide-react` (menggantikan `.sidebar-dot`).
  - Item aktif memakai indikator garis vertikal tipis di sisi kiri (`::before`) dengan animasi transisi `transform` / `opacity`, serta mikro-geser halus (`translateX(2px)`) pada hover.
- **Scroll Progress Kustom:**
  - Menggantikan elemen `<progress>` HTML polos dengan container `.sidebar-scroll-track` dan bar `.sidebar-scroll-fill` (`role="progressbar"`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-valuenow={Math.round(scrollProgress * 100)}`, `aria-label="Progress baca halaman"`).
- **Drawer Mobile & Aksesibilitas:**
  - Menambahkan listener tombol `Escape` saat `isOpen === true` untuk menutup drawer.
  - Link di dalam drawer (`.sidebar-link`, `.sidebar-interactive-mode`, `.sidebar-whatsapp`) memakai animasi masuk staggered saat drawer terbuka (`.site-sidebar.is-open`) pada viewport mobile (`<= 1024px`).
- **Live Status Dot & Bottom Nav:**
  - `.sidebar-status` menambahkan titik hijau lembut berkedip (`.status-live-dot`) di sebelah teks `Buka 06.00-21.00`.
  - `.mobile-bottom-nav` mempertahankan 4 tab (`Home`, `Pesan`, `Layanan`, `Lokasi`) dengan indikator garis aksen biru di bagian atas tab aktif (`.is-active::before`) dan efek tekan halus (`transform: scale(0.95)`).
  - Hormati `@media (prefers-reduced-motion: reduce)` untuk menonaktifkan animasi transisi & pulse bagi pengguna yang sensitif terhadap gerak.

### B. Hero Section & 3D Showcase (`src/components/HeroSection.tsx`, `HeroSection.module.css`, `BatteryBoxScrollAnimation.module.css`)
- **Konten Tetap Utuh:**
  - Eyebrow / pill status teratas: `Nafis Jaya Accu` ditambah info ringkas `Buka 06.00-21.00 • Surabaya & Sidoarjo`.
  - Judul `<h1>`: `"Aki Mobil & Motor untuk"` / `"Surabaya-Sidoarjo."`
  - Narasi `.hero-lead`, catatan `.hero-note`, serta seluruh 3 link (`Cari Tipe dan Pesan Aki` → `/home/pesan-aki`, `Lihat Lokasi Toko` → `/home/lokasi`, `Layanan Toko` → `/home/layanan`).
- **Tata Letak Desktop vs Mobile:**
  - **Desktop (`> 980px`):** Hero dibungkus kartu permukaan gelap berlapis (`.hero-card` dengan `var(--surface)`, border hairline `var(--border)`, subtle radial sheen) dalam grid 2 kolom (`1.2fr 0.8fr`). CTA ditata terstruktur: tombol utama di atas / awal grup, diikuti tombol sekunder sejajar.
  - **Mobile (`<= 980px`):** `.visualPanel` ditempatkan di urutan pertama (`order: -1`), dengan ukuran canvas 3D diperkecil rapi (`width: min(100%, 11.5rem)` pada `<= 520px` dan `min(100%, 13rem)` pada `<= 980px`; `min-height: 11.5rem` pada `.visualPanel`) agar tetap berada di viewport atas bersama judul dan CTA tanpa mendorong tombol keluar dari layar pertama. Tombol sekunder (`Lihat Lokasi Toko` & `Layanan Toko`) tersusun 2 kolom sejajar di bawah tombol utama full-width (`Cari Tipe dan Pesan Aki`).

### C. Kartu Sorotan Ringkas di `/home` (`src/components/HomeHighlights.tsx` & `src/app/home/page.tsx`)
- Menambahkan bagian ringkas `<HomeHighlights />` tepat di antara `<HeroSection />` dan `<FAQSection />` pada `/home`:
  - Berisi 3 kartu tautan interaktif padat (ikon Lucide + judul singkat + subteks 1 baris + ikon panah kanan):
    1. **Katalog 36 Tipe Aki** → `/home/pesan-aki` (`Cari berdasarkan mobil, motor, atau kode aki`)
    2. **Setrum & Tukar Tambah** → `/home/layanan` (`Cek aki, isi ulang daya, & pasang di toko`)
    3. **Lokasi & Jam Toko** → `/home/lokasi` (`Buka 06.00-21.00 setiap hari via Google Maps`)
  - **Desktop:** 3 kolom sejajar (`repeat(3, minmax(0, 1fr))`) di dalam `--container`.
  - **Mobile (`<= 768px`):** Stack vertikal ringkas 1 kolom dengan padding hemat ruang (`flex-direction: row` ikon kiri + teks + panah kanan), sehingga tinggi total tetap pendek dan tiap baris mudah ditekan dengan ibu jari.

### D. FAQ & Footer (`src/components/FAQSection.tsx`, `src/components/Footer.tsx`)
- **FAQ (`FAQSection.tsx`):**
  - Menghapus pseudo-element `::after` teks `+ / -`, diganti ikon `<ChevronDown size={16} aria-hidden="true" />` yang berputar `180deg` saat `.faq-item.is-open`.
  - Menambahkan `type="button"` eksplisit pada tombol `.faq-summary` dan sorotan border/aksen lembut pada item yang terbuka.
  - Seluruh 7 pertanyaan dan jawaban di `src/data/faq.ts` tetap dipertahankan utuh.
- **Footer (`Footer.tsx`):**
  - Merampingkan isi agar tidak menduplikasi daftar `navItems` (karena navigasi 4 halaman selalu hadir persisten di Sidebar & Bottom Nav). Footer memfokuskan pada ringkasan brand (`Nafis Jaya Accu`, area `Surabaya, Sidoarjo, dan sekitarnya`), kontak cepat (`Mode Akses Cepat /`, `WhatsApp Admin`, `Buka Google Maps`, `Buka 06.00-21.00`), serta kredit pembuat (`Crafted by Nafis • @nfs_ky07`).

---

## 3. Apa yang Ditinggalkan ke Builder
Detail nilai durasi animasi (`200ms–320ms`), exact spacing internal antar elemen hero/highlight di rentang CSS tokens `--space-1..--space-6`, serta penamaan kelas CSS spesifik di `globals.css` / module CSS diserahkan ke fase implementasi selama konsisten dengan desain di atas.

---

## 4. Rencana Verifikasi Tahap 1
1. `npm run lint` dan `npm run typecheck` tanpa error/warning.
2. Pengujian SSR/unit untuk memastikan 4 nav links, ikon & progress bar `role="progressbar"` di Sidebar, 3 CTA Hero, 3 kartu sorotan `/home`, 7 FAQ + `type="button"` + `aria-expanded`, serta Footer kontak cepat ter-render utuh.
3. `npm run build` lolos untuk semua route statis.
