# Design Spec: Revisi Layout Desktop & Mobile Halaman Wizard (`/`)

**Tanggal:** 2026-11-16
**Ukuran Perubahan:** Perubahan terfokus (Small Change — 2 file: `src/components/InteractiveWizard.tsx`, `src/components/InteractiveWizard.css`)
**Pendekatan Terpilih:** Opsi A — Default Aktif "Pesan Aki" + Tab Mobile & Peta Dark-Mode di Bawah

---

## 1. Tujuan & Masalah yang Diselesaikan
Mengoptimalkan halaman pintu masuk cepat (`/`) untuk Desktop dan Mobile tanpa menghilangkan satu pun elemen penting ekosistem Nafis Jaya Accu:
- **Menghilangkan panel kosong di Desktop** yang sebelumnya memakan ~65% lebar layar sebelum layanan dipilih.
- **Menghilangkan halangan peta di Mobile**, karena sebelumnya kartu peta berada di tengah-tengah antara tombol pilihan dan form.
- **Menyelaraskan peta dengan tema gelap berlapis** agar tile peta tidak kontras menyilaukan serta kontrol zoom/watermark tidak menutupi peta kecil.

### Batasan (Non-Goals & Anti-Goals)
- **Non-Goals:** Tidak mengubah halaman `/home`, `/home/pesan-aki`, `/home/layanan`, atau `/home/lokasi`, serta tidak mengubah logika/format pesan WhatsApp.
- **Anti-Goals:** Tidak menghapus peta toko, jam operasional, daftar pertanyaan wizard, tautan katalog lengkap, maupun akses ke halaman utama (`/home`).

---

## 2. Pendekatan yang Dipertimbangkan
1. **Opsi A (Dipilih):** Mengaktifkan tab `Pesan Aki` secara default sejak awal, menjaga 2 kolom di desktop, dan menyusun ulang urutan mobile menjadi *Greeting → 3 Tab Horizontal → Form Aktif → Lokasi Toko (paling bawah)*. Dipilih karena menghilangkan ruang kosong total dan memangkas 1 klik bagi mayoritas pembeli aki.
2. **Opsi B:** Tata letak 1 kolom terpusat untuk desktop dan mobile tanpa kotak kosong. Ditolak karena menyisakan banyak ruang kosong di kiri-kanan layar desktop.
3. **Opsi C:** Tetap netral dari awal dengan ringkasan jam/kontak toko di panel kanan sebelum diklik. Ditolak karena tetap menambah 1 klik ekstra sebelum user bisa mulai mengisi pesanan.

---

## 3. Rincian Desain (Opsi A)

### A. Elemen Penting yang Tetap Terjaga 100%
- **Topbar:** Logo `Nafis Jaya Accu` + tombol navigasi ke `/home`.
- **Greeting Dinamis:** 20 variasi sapaan acak di `GREETINGS`.
- **3 Alur WhatsApp Lengkap:**
  - `Pesan Aki` (Kendaraan → Kering/Basah + info edukasi → Tukar Tambah/Beli Baru → Nama kendaraan → WA + tautan `/home/pesan-aki`).
  - `Setrum Aki` (Kendaraan → Jam datang → Jam ambil → WA).
  - `Perlengkapan` (Stepper jumlah: Air Aki, Air Zuur [tanda bahaya], Clamp Aki, Kabel Aki → WA).
- **Lokasi Toko:** Peta interaktif `LeafletMap`, jam buka `06.00-21.00`, dan tautan `Buka di Google Maps`.

### B. Perubahan Perilaku & Tata Letak
- **Default State:** `mainCategory` diset awal ke `"pesan"` (bukan `null`), sehingga kotak kosong (`.wz-empty-state` beserta teks `"di sebelah kiri"`) dihapus sepenuhnya.
- **Grid Responsif Desktop (`> 900px`):**
  - 2 kolom (`18.5rem 1fr`), dengan `Lokasi Toko` terpisah secara DOM namun tetap tertata di kolom kiri di bawah kartu kategori (`grid-column: 1`), dan form wizard merentang di kolom kanan (`grid-column: 2; grid-row: 1 / span 2`).
- **Urutan & Tab Mobile (`<= 900px`):**
  - Topbar: Tombol `/home` diringkas agar tidak mepet di layar 360px (menggunakan label singkat `Halaman Utama` pada mobile agar tetap nyaman dibaca).
  - Kategori: 3 pilihan berubah menjadi **tab horizontal 3 kolom** berjajar di bawah greeting (ikon + label ringkas, subjudul disembunyikan di layar kecil agar muat 1 baris rapi).
  - Form Wizard: Tampil **tepat di bawah tab** tanpa jeda peta. Auto-scroll saat pertama kali render ditiadakan agar layar tetap berada di atas saat halaman dibuka.
  - Lokasi Toko: Pindah ke urutan paling bawah sebagai kartu ringkas tersendiri lengkap dengan info jam buka `Buka 06.00-21.00` dan tombol `Buka di Google Maps`.
- **Peta Dark-Mode:**
  - Memberi filter gelap pada `.leaflet-tile-pane` di dalam `.wz-mini-map-container` tanpa membalik warna marker pin biru.
  - Memperkecil skala kontrol zoom (`+ / -`) dan merapikan attribution agar area peta tetap terlihat bersih di tinggi `7rem–8rem`.

---

## 4. Rencana Verifikasi
Setelah implementasi:
1. Menjalankan `npm run lint` dan `npm run typecheck`.
2. Memverifikasi tampilan Desktop & Mobile (lebar ~375px) memastikan tidak ada overflow horizontal, tombol tidak bertabrakan, dan seluruh 3 alur WA + peta berfungsi normal.
