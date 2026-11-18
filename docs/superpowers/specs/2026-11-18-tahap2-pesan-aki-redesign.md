# Design Spec: Tahap 2 — Redesign Katalog Olshop & Pencarian Cerdas (`/home/pesan-aki`)

**Tanggal:** 2026-11-18
**Tahap:** 2 dari 3 (Tahap 1: Sidebar & `/home` selesai | **Tahap 2: `/home/pesan-aki`** | Tahap 3: `/home/layanan` & `/home/lokasi`)
**Pendekatan Terpilih:** Opsi 1 (Etalase Olshop Modern) + Opsi A (Full Floating Cart Button di Desktop & Mobile) + Advanced Client-Side Search ala Shopee/Tokopedia/Lazada.

---

## 1. Tujuan & Masalah yang Diselesaikan
Mengubah [/home/pesan-aki](file:///c:/Users/Muhammad%20Nafis/My%20WEB%20vs%20code/nafis-jaya-accu/src/app/home/pesan-aki/page.tsx) menjadi halaman etalase *online shop* yang profesional, cepat, dan cerdas secara fungsi tanpa menghilangkan data atau alur order WhatsApp yang sudah ada:
1. **Pencarian Cerdas (*Advanced Search*):** Mengatasi keterbatasan `.includes()` lama yang gagal ketika pengguna mengetik kombinasi kendaraan + tipe aki (`"avanza kering"`), perbedaan spasi/tanda hubung (`"ns 40"`, `"gtz-5"`, `"xtrail"`), maupun salah ketik ringan (`"avansa"`, `"inova"`).
2. **Filter Multi-Faset & Sortir ala Marketplace:** Memungkinkan kombinasi filter **Kendaraan × Teknologi/Tipe × Populer** serta urutan (**Paling Relevan**, **Populer**, **Kapasitas Terkecil**, **Kapasitas Terbesar**, **Kode A–Z**), ditambah bar pill pencarian cepat 1-tap (`Avanza`, `Brio`, `Innova`, `NMAX`, `Vario`, `Beat`, `NS40`, `GTZ5`).
3. **Tata Letak Etalase Penuh & Floating Cart Konsisten (Opsi A):** Menghilangkan panel sticky kanan `18rem` di Desktop agar grid produk melebar penuh (**4 kartu/baris** di Desktop, **2 kolom marketplace** di Mobile). Baik Desktop maupun Mobile menggunakan **Floating Cart Pill Button** di kanan bawah yang membuka **Right Slide-Over Drawer** (Desktop) atau **Bottom Sheet Drawer** (Mobile).

### Batasan (Non-Goals & Anti-Goals)
- **Non-Goals:** Tidak mengubah struktur data dasar 36 item di `src/data/batteries.ts`, tidak mengubah format pesan WhatsApp di `src/lib/whatsapp.ts`, dan belum merombak halaman `/home/layanan` atau `/home/lokasi`.
- **Anti-Goals:** Tidak menyembunyikan akses konsultasi cepat bagi pembeli yang belum tahu kode aki; tidak menghapus persistensi draft `localStorage` (`nja-order-draft-v1`).

---

## 2. Rincian Desain Arsitektur & Komponen

### A. Mesin Pencarian & Filter (`src/lib/battery-search.ts`)
Fungsi murni (*pure functions*) yang terpisah agar mudah diuji unit secara langsung:
- **Normalisasi Teks & Token (`normalizeSearchToken` / `compactAlphanumeric`):**
  - Lowercase + hapus diakritik, lalu hasilkan token kata (split whitespace/slash/tanda hubung) serta versi kompak tanpa pemisah non-alfanumerik (sehingga `"ns 40"`, `"ns-40"`, `"ns40/l"` cocok dengan `"NS40/L"`).
- **Multi-Token Matching (`matchesBatteryQuery`):**
  - Setiap kata dalam query harus cocok ke *minimal satu* field produk (`code`, `capacity`, `categoryLabel`, `typeLabel`, `commonVehicles`, `keywords`), sehingga query gabungan seperti `"avanza kering"` atau `"motor basah"` tetap menemukan produk yang tepat.
- **Toleransi Typo Ringan (`editDistanceWithin` / Zero-Hit Alphabetical Fallback):**
  - Token yang mengandung angka (kode aki seperti `NS40`, `NS60`, `NS70`, `GTZ7S`, `GTZ7V`, `55D23L`) **dikecualikan dari fuzzy matching** agar mencari kode aki presisi tidak pernah menyarankan ukuran/kapasitas aki yang salah (`NS40` 32 Ah tidak akan mencocokkan `NS60` 45 Ah).
  - Untuk token alfabet (`!/\d/` dan panjang `>= 4`), toleransi edit distance (maks `1` untuk panjang `4–6`, maks `2` untuk panjang `>= 7`) hanya diaktifkan sebagai **fallback tingkat katalog** bila token tersebut menghasilkan `0` kecocokan exact/substring di seluruh katalog (misalnya `"avansa"` → `Avanza`, `"inova"` → `Innova`).
- **Skoring & Pengurutan (`searchAndSortBatteries`):**
  - Opsi urut (`BatterySortOption`):
    - `"relevance"` (default): saat query terisi, urutkan berdasarkan skor relevansi tertinggi (exact code match > prefix code match > vehicle match > keyword/tech match > fuzzy fallback match), tie-breaker `isPopular` lalu urutan katalog asli; saat query kosong, tampilkan `isPopular` lebih dulu lalu sisa katalog.
    - `"popular"`: utamakan `isPopular` terlebih dahulu.
    - `"capacity-asc"` & `"capacity-desc"`: ekstrak nilai numerik `Ah` dari `capacity` (item tanpa satuan `Ah` seperti `"Motor / MF"` ditempatkan di urutan akhir secara konsisten).
    - `"code-asc"`: urutkan alfabetis berdasarkan `code`.
- **Filter Multi-Faset (`BatterySearchFilters`):**
  - `vehicle`: `"all" | "car" | "motorcycle" | "vrla"`
  - `tech`: `"all" | "mf" | "dry-charge"` (dimana `"mf"` mencakup `"maintenance-free"` dan `"motorcycle-mf"` agar filter "Kering / MF" konsisten untuk mobil maupun motor).
  - `onlyPopular`: `boolean`
  - Semua filter dihitung sebagai **irisan (AND)** sehingga user bisa memilih `Mobil` + `MF / Kering` secara bersamaan. Khusus saat tab kendaraan dipindah ke `"vrla"`, `tech` direset ke `"all"` dan chip `Kering / MF` & `Basah` dinonaktifkan sementara (hanya `VRLA` yang tersedia di data).

### B. Halaman Katalog `BatterySearch.tsx`
- **Header Ringkas Pengganti `.marketplace-strip`:**
  - Menghapus 3 kotak `.marketplace-strip` besar di atas toolbar, digantikan bar trust ringkas 1 baris (`36 Tipe Aki • Stok & Harga via WA • Cocokkan Ukuran`) plus tombol pill cepat **"Bingung tipe? Tanya Admin"** yang langsung membuka drawer konsultasi WA.
- **Sticky Search Row & Scrollable Marketplace Filters (`BatterySearch.tsx` & `globals.css`):**
  - Pada `globals.css`, `body` memakai `overflow-x: clip` (menggantikan `overflow-x: hidden`) agar `position: sticky` berjalan mulus di semua browser.
  - Hanya **baris Search Input** (`.catalog-sticky-search`, sekitar `3.25rem`, dengan tombol clear `×`, hitungan hasil, dan tombol cepat `Tanya`) yang **menempel (sticky)** di bawah `.mobile-topbar` (`top: 3rem` pada mobile `<= 1024px`, `top: 0.5rem` pada desktop) agar kartu produk tetap lega terlihat saat di-scroll.
  - **Quick Search Pills (1-Tap)** (`Avanza`, `Brio`, `Innova`, `NMAX`, `Vario`, `Beat`, `NS40`, `GTZ5`), **Tab Segmen Kendaraan** (`Semua`, `Mobil`, `Motor`, `VRLA / UPS`), dan **Chip Faset Tipe + Sortir** berada di blok filter tepat di bawahnya dan ikut ter-scroll alami bersama halaman.
  - Tombol `Reset` muncul otomatis bila ada query, filter aktif, atau sortir non-default.
- **Kartu Produk Olshop (`.battery-card`):**
  - Bagian atas kartu: strip visual mini dengan ikon kategori (`Car` / `Bike` / `BatteryCharging`) & label segmen + badge `Populer` (amber) bila `isPopular` + tag teknologi (`MF / Kering` biru vs `Basah` amber vs `VRLA` hijau/cyan).
  - Isi: Kode Aki tebal (`item.code`), kapasitas (`item.capacity`), daftar kecocokan kendaraan ringkas (`Untuk: ...`), label status katalog (`Cek stok & harga di WA`), dan tombol CTA `+ Pilih` / `✓ Dipilih` yang kontras.
- **Empty State Cerdas (Saat 0 Hasil):**
  - Bila `query.trim()` terisi: tampilkan query yang dicari, tombol `Reset pencarian`, serta tombol **"Tanya Admin untuk '{query}' via WA"** yang mengisi `context.vehicle` (bila masih kosong) dan langsung membuka drawer OrderSummary.
  - Bila `query` kosong (misal kombinasi filter `Motor + Basah + Terlaris` menghasilkan 0 item): tampilkan pesan `"Tidak ada aki yang cocok dengan kombinasi filter ini"`, tombol `Reset filter`, dan tombol **"Tanya Admin via WhatsApp"** tanpa placeholder kurung kosong.

### C. Full Floating Cart & Drawer (`OrderSummary.tsx`)
- **Konsisten Desktop & Mobile (Opsi A):**
  - Menghapus `.search-layout` 2-kolom `1fr 18rem` sehingga katalog selalu menggunakan lebar penuh `--container` (menampung 4 kartu per baris di desktop, 2 kolom di mobile).
  - Mengubah `.mobile-floating-cart` menjadi `.floating-cart-btn` yang aktif di **semua ukuran layar**:
    - **Desktop (`> 1024px`):** `bottom: 1.5rem; right: 1.5rem;` berbentuk pill tegas (`🛒 Ringkasan WA` saat kosong atau `🛒 {N} Aki • Lanjut WA` saat terisi) + subtle scale pop ketika `selectedItems.length` berubah.
    - **Mobile (`<= 1024px`):** `bottom: 4.25rem; right: 1rem;` di atas `mobile-bottom-nav`.
  - **Drawer / Sheet Panel (`.order-summary`):**
    - Tetap dapat dibuka baik lewat klik Floating Pill maupun dari tombol **"Tanya Admin"** pada `BatterySearch` (prop opsional `isOpen` / `onOpenChange` terkontrol oleh parent `BatterySearch` atau state terangkat agar tombol toolbar & empty state bisa membuka drawer langsung!).
    - **Desktop (`> 1024px`):** Slide-over **Right Side Drawer** (`width: min(92vw, 24rem); height: 100vh; right: 0; top: 0; bottom: 0;`) dengan backdrop gelap blur.
    - **Mobile (`<= 1024px`):** Slide-up **Bottom Sheet** (`border-radius: 16px 16px 0 0; max-height: 85vh;`).
    - Dukungan aksesibilitas lengkap: tutup via tombol `X`, klik backdrop, maupun tombol keyboard `Escape`, serta `visibility: hidden` saat tertutup agar tidak ikut masuk urutan Tab.
    - Menambahkan tombol **`Kosongkan`** (dengan `onClearItems` callback) di header daftar aki bila `selectedItems.length > 0`, sementara seluruh 3 field (`Nama kendaraan`, `Kebutuhan`, `Lokasi / rencana datang`), persistensi `localStorage`, dan CTA `Kirim ke WhatsApp` (`buildWhatsAppUrl`) tetap utuh.

---

## 3. Apa yang Ditinggalkan ke Builder
Detail kurva animasi drawer (`cubic-bezier`), styling border/tint spesifik badge mobil vs motor vs VRLA, serta lebar breakpoint kolom 3 vs 4 produk di tablet (`769px–1024px`) ditentukan oleh implementer agar serasi dengan tokens di `src/app/globals.css`.

---

## 4. Rencana Verifikasi Tahap 2
1. Unit test menyeluruh pada `src/lib/battery-search.ts` (multi-token `"avanza kering"`, format kode `"ns 40"` / `"gtz-5"`, toleransi typo `"inova"` / `"avansa"`, filter kombinasi `car + mf`, `onlyPopular`, dan seluruh opsi sortir kapasitas Ah).
2. Test komponen `BatterySearch` + `OrderSummary` (`36` item lengkap di render awal, clear search, quick keyword pills, empty state CTA membuka drawer, `Kosongkan` keranjang, floating pill + `aria-expanded` / `Escape`).
3. `npm run lint`, `npm run typecheck`, dan `npm run build` lulus tanpa error.
