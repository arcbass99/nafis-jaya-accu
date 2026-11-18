# Tahap 2 — Redesign Katalog Olshop & Pencarian Cerdas (`/home/pesan-aki`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah halaman `/home/pesan-aki` menjadi katalog *online shop* penuh (4 kolom desktop / 2 kolom mobile) dengan mesin pencarian cerdas multi-kata + anti-typo berproteksi angka, filter multi-faset + sortir marketplace, dan tombol keranjang mengambang (`Floating Cart Pill`) untuk Desktop maupun Mobile.

**Architecture:** Memisahkan logika pencocokan/skoring/penyortiran ke modul fungsi murni `src/lib/battery-search.ts` beserta tipe faset di `src/types/battery.ts`, mengangkat kontrol buka/tutup drawer keranjang ke `BatterySearch.tsx` agar tombol konsultasi cepat toolbar/empty-state dapat membuka `OrderSummary.tsx`, serta menyatukan UI drawer kanan (Desktop) dan bottom-sheet (Mobile) dalam `src/app/globals.css`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Variables (`src/app/globals.css`), `lucide-react`, Node 24 native test runner (`node --test`).

**Spec:** [2026-11-18-tahap2-pesan-aki-redesign.md](file:///c:/Users/Muhammad%20Nafis/My%20WEB%20vs%20code/nafis-jaya-accu/docs/superpowers/specs/2026-11-18-tahap2-pesan-aki-redesign.md)

## Global Constraints
- Mempertahankan seluruh 36 item di `src/data/batteries.ts`, fungsi `buildWhatsAppUrl` di `src/lib/whatsapp.ts`, serta persistensi draft `localStorage` (`nja-order-draft-v1`).
- Tidak mengubah halaman `/`, `/home`, `/home/layanan`, atau `/home/lokasi` di luar styling bersama `body { overflow-x: clip; }`.
- Mempertahankan akses konsultasi WA cepat bagi pembeli yang belum mengetahui kode aki (melalui Floating Pill Button maupun tombol `"Tanya Admin"` di toolbar & empty state).
- Memakai palet tema gelap berlapis (`--surface`, `--bg-subtle`, `--brand`, `--amber`, `--whatsapp`) dan menjaga seluruh gate `node --test`, `npm run lint`, `npm run typecheck`, serta `npm run build` hijau.

## Review Focus
- **False fuzzy hits across numeric battery codes:** Mencari `"NS40"`, `"GTZ7S"`, atau `"55D23L"` tidak boleh memunculkan `NS60`, `NS70`, atau `GTZ7V` lewat fuzzy edit-distance; token yang mengandung angka wajib dikecualikan dari edit-distance, sedangkan pencocokan kompak tanpa pemisah (`"ns 40"` / `"gtz-5"`) tetap harus cocok dengan `"NS40/L"` / `"GTZ5"`.
- **Sticky search vs `body` overflow & mobile space:** `body` wajib memakai `overflow-x: clip` agar `position: sticky` bekerja di semua browser, dan pada mobile `<= 1024px` hanya baris input cari (`.catalog-sticky-search`) yang menempel di bawah `.mobile-topbar` (`top: 3rem`) agar area katalog tetap lega.
- **VRLA tab × tech facet dead-end & empty-query copy:** Memilih tab `"vrla"` mereset `tech` ke `"all"` dan menonaktifkan chip `Kering / MF` & `Basah`; bila kombinasi filter tetap menghasilkan `0` item dengan `query === ""`, Empty State tidak boleh menampilkan kutip kosong `""` melainkan pesan khusus filter.
- **Controlled Drawer accessibility & focus restoration (`OrderSummary.tsx`):** Drawer/Sheet harus tertutup dengan `visibility: hidden` agar tidak ikut urutan Tab saat tertutup, mendukung `Escape` dan klik backdrop, memasang `aria-expanded` pada tombol trigger, serta mengembalikan fokus ke Floating Pill Button saat ditutup lewat `Escape` atau tombol `X`.
- **`prefers-reduced-motion` compliance on Cart & Drawer:** Animasi pulse pada `.floating-cart-btn` serta transisi geser `.order-summary` dan `.summary-backdrop` wajib berhenti di dalam `@media (prefers-reduced-motion: reduce)`.

---

### Task 1: Tambah Tipe Faset & Mesin Pencarian Cerdas (`src/types/battery.ts`, `src/lib/battery-search.ts`)

**Files:**
- Modify: `src/types/battery.ts:23-35`
- Create: `src/lib/battery-search.ts`
- Create: `tests/tahap2-pesan-aki.test.mjs`

**Interfaces:**
- Modifies `src/types/battery.ts`:
  - Exports `BatteryVehicleFilter = "all" | "car" | "motorcycle" | "vrla"`
  - Exports `BatteryTechFilter = "all" | "mf" | "dry-charge"`
  - Exports `BatterySortOption = "relevance" | "popular" | "capacity-asc" | "capacity-desc" | "code-asc"`
  - Exports `BatterySearchFilters { vehicle: BatteryVehicleFilter; tech: BatteryTechFilter; onlyPopular: boolean; }`
  - Retains existing `BatteryFilter` type untouched if referenced elsewhere.
- Produces in `src/lib/battery-search.ts`:
  - `QUICK_SEARCH_KEYWORDS: readonly string[]` = `["Avanza", "Brio", "Innova", "NMAX", "Vario", "Beat", "NS40", "GTZ5"]`
  - `extractCapacityAh(capacity: string): number | null`
  - `normalizeCompact(value: string): string`
  - `editDistanceWithin(a: string, b: string, maxDist: number): boolean`
  - `searchAndSortBatteries(items: readonly BatteryItem[], params: { query: string; filters: BatterySearchFilters; sort: BatterySortOption }): BatteryItem[]`

- [ ] **Step 1: Tulis unit test RED untuk `battery-search.ts` di `tests/tahap2-pesan-aki.test.mjs`**

Uji:
1. Multi-token query `"avanza kering"` hanya mengembalikan varian `NS40/L` berteknologi `maintenance-free` (bukan `Basah`), sedangkan `"ns 40"` dan `"gtz-5"` tetap mencocokkan `NS40/L` (32 Ah) dan `GTZ5`.
2. Digit guard: query `"NS40"` mengembalikan `NS40/L` & `NS40Z/ZL`, dan TIDAK mengembalikan `NS60/L/LS` ataupun `NS70/L`; query `"GTZ7S"` mengembalikan `GTZ7S`, bukan `GTZ7V`.
3. Zero-hit alphabetical fuzzy fallback: typo `"avansa"` masih menemukan `Avanza` (`NS40/L`), dan `"inova"` masih menemukan `Innova` (`NS60`, `55D23L`, `DIN 58024/LN3`), dengan exact/vehicle match berskor lebih tinggi.
4. Multi-faset filter (`vehicle: "motorcycle", tech: "mf"` menghasilkan 4 motor MF, tidak termasuk `12N10` basah; `onlyPopular: true` hanya item populer) serta 5 mode sortir (`capacity-asc` menempatkan 32 Ah sebelum 100 Ah dan item non-Ah di akhir; `capacity-desc` 100 Ah dulu; `code-asc` urutan alfabetis kode).

- [ ] **Step 2: Jalankan test untuk memastikan gagal sebelum implementasi (RED)**

Run: `node --test tests/tahap2-pesan-aki.test.mjs`
Expected: FAIL karena `src/lib/battery-search.ts` belum dibuat.

- [ ] **Step 3: Perbarui `src/types/battery.ts` dan implementasikan `src/lib/battery-search.ts`**

- Di `src/types/battery.ts`, tambahkan tipe `BatteryVehicleFilter`, `BatteryTechFilter`, `BatterySortOption`, dan interface `BatterySearchFilters`.
- Di `src/lib/battery-search.ts`:
  - Gunakan `normalizeText` dari `@/lib/utils`.
  - Siapkan helper `tokenizeQuery(query)` (split spasi) dan `normalizeCompact(text)` (`replace(/[^a-z0-9]/g, "")`).
  - Bangun indeks pencocokan per item (code compact, daftar kata field kendaraan/keyword/kategori/teknologi).
  - Untuk setiap token query: hitung apakah ada hit exact/substring/compact di minimal satu item seluruh katalog (`catalogHasDirectHit`). Bila tidak ada hit langsung AND token murni alfabet `!/\d/` panjang `>= 4`, izinkan fuzzy `editDistanceWithin` (maks `1` untuk panjang `4–6`, maks `2` untuk `>= 7`) sebagai fallback.
  - Beri skor bobot (exact/compact `code` match > prefix `code` > vehicle token/substring match > keyword/tech match > fuzzy match + tie-breaker `isPopular` & indeks asli).
  - Filter `vehicle` (`car`/`motorcycle`/`vrla`), `tech` (`mf` = `maintenance-free` atau `motorcycle-mf`; `dry-charge`), dan `onlyPopular`.
  - Terapkan pengurutan sesuai `BatterySortOption`.

- [ ] **Step 4: Jalankan test Task 1, lint, dan typecheck (GREEN)**

Run: `node --test tests/tahap2-pesan-aki.test.mjs ; npm run lint ; npm run typecheck`
Expected: Semua unit test `battery-search` PASS, `eslint` & `tsc --noEmit` exit code `0`.

---

### Task 2: Upgrade `OrderSummary.tsx` Menjadi Full Floating Pill + Controlled Slide-Over/Bottom Sheet Drawer

**Files:**
- Modify: `src/components/OrderSummary.tsx:1-166`
- Test: `tests/tahap2-pesan-aki.test.mjs`

**Interfaces:**
- Extends `OrderSummaryProps`:
  ```ts
  interface OrderSummaryProps {
    selectedItems: BatteryItem[];
    context: OrderContext;
    onContextChange: (context: OrderContext) => void;
    onRemoveItem: (id: string) => void;
    onClearItems?: () => void;
    needOptions: readonly string[];
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
  ```
- Consumes `buildWhatsAppUrl` from `@/lib/whatsapp` dan `formatBatteryLine` from `@/lib/utils`.
- Produces `.floating-cart-btn` (button trigger universal Desktop & Mobile dengan `aria-expanded={open}`, `aria-controls="order-summary-drawer"`, teks `Ringkasan WA` saat kosong atau `${selectedItems.length} Aki • Lanjut WA` saat terisi), `.summary-backdrop`, dan `<aside id="order-summary-drawer" className={cn("order-summary glass-panel", open && "is-open")}>` dilengkapi tombol `.summary-close` (`aria-label="Tutup ringkasan"`), tombol `Kosongkan` (`.summary-clear-btn`) bila `selectedItems.length > 0 && onClearItems`, handler `Escape` + kembalikan fokus ke `triggerRef.current`.

- [ ] **Step 1: Tambahkan RED tests untuk `OrderSummary.tsx` di `tests/tahap2-pesan-aki.test.mjs`**

Verifikasi:
1. Render dengan 0 item: menghasilkan `.floating-cart-btn` dengan teks `"Ringkasan WA"`, `aria-expanded="false"`, `aria-controls="order-summary-drawer"`, tanpa tombol `Kosongkan`.
2. Render dengan `selectedItems.length === 2`, `isOpen={true}`, dan `onClearItems`: tombol `.floating-cart-btn` menampilkan `"2 Aki • Lanjut WA"` dan `aria-expanded="true"`, drawer memiliki class `is-open`, tombol `Kosongkan` muncul, dan source `OrderSummary.tsx` menangani tombol `Escape` + memulihkan fokus ke `triggerRef.current?.focus()`.

- [ ] **Step 2: Jalankan test untuk melihat gagal sebelum implementasi (RED)**

Run: `node --test tests/tahap2-pesan-aki.test.mjs`
Expected: FAIL pada assertions Task 2; test Task 1 tetap PASS.

- [ ] **Step 3: Implementasikan perubahan pada `src/components/OrderSummary.tsx`**

- Tambahkan `internalOpen` fallback + sinkronisasi helper `open` / `setOpen` (mendukung mode controlled dari `BatterySearch` maupun uncontrolled).
- Tambahkan `triggerRef = useRef<HTMLButtonElement | null>(null)` pada `.floating-cart-btn`.
- Tambahkan `useEffect` listener `keydown` `"Escape"` ketika `open === true` untuk menutup drawer dan memulihkan fokus ke `triggerRef.current?.focus()`, dan pakai helper yang sama saat mengklik tombol tutup `.summary-close` atau backdrop.
- Ganti class `.mobile-floating-cart` → `.floating-cart-btn`, `.order-summary.is-mobile-open` → `.order-summary.is-open`, `.summary-close-mobile` → `.summary-close`.
- Tambahkan baris status daftar aki dengan tombol `Kosongkan` bila `selectedItems.length > 0 && onClearItems`.

- [ ] **Step 4: Verifikasi Task 2 GREEN, lint, dan typecheck**

Run: `node --test tests/tahap2-pesan-aki.test.mjs ; npm run lint ; npm run typecheck`
Expected: Semua test PASS, ESLint & TSC exit 0.

---

### Task 3: Redesign `BatterySearch.tsx` Menjadi Etalase Olshop Lengkap dengan Visual Cards & Controlled Drawer

**Files:**
- Modify: `src/components/BatterySearch.tsx:1-277`
- Test: `tests/tahap2-pesan-aki.test.mjs`

**Interfaces:**
- Consumes `searchAndSortBatteries`, `QUICK_SEARCH_KEYWORDS` from `@/lib/battery-search`; `BatteryVehicleFilter`, `BatteryTechFilter`, `BatterySortOption` from `@/types/battery`; `OrderSummary` with `isOpen`, `onOpenChange`, `onClearItems`.
- Produces:
  - `.catalog-info-bar` (bar 1 baris menggantikan `.marketplace-strip`, memuat `"36 Tipe Aki • Stok & Harga via WA • Cocokkan Ukuran"` dan tombol `"Bingung tipe? Tanya Admin"` yang memanggil `openConsultDrawer()`).
  - `.catalog-sticky-search` (`.search-input-wrap` + input `#battery-search-input` + tombol clear `×` kondisional `.search-clear-btn` + tombol ringkas `"Tanya"`).
  - `.quick-search-strip` berisi tombol pill dari `QUICK_SEARCH_KEYWORDS`.
  - `.catalog-filter-panel` dengan tab kendaraan (`role="tablist"`: `"Semua"`, `"Mobil"`, `"Motor"`, `"VRLA / UPS"`), baris `.facet-bar` dengan chip teknologi (`"Semua Tipe"`, `"Kering / MF"`, `"Basah"` yang `disabled={vehicleFilter === "vrla"}`), chip toggle `"Terlaris"`, `<select aria-label="Urutkan katalog">`, serta `.catalog-meta` + tombol `Reset`.
  - `.battery-grid` dengan 36 kartu produk bergaya olshop: `.battery-card-banner` (`.is-car` / `.is-motorcycle` / `.is-vrla`), ikon kategori + label segmen, badge `Populer`, badge teknologi warna-terkode (`.is-mf` / `.is-dry` / `.is-vrla`), kode & kapasitas, kompatibilitas kendaraan, `.battery-price-hint` (`Cek stok & harga di WA`), dan tombol `.battery-select` (`+ Pilih` / `✓ Dipilih`).
  - `.empty-state` dua mode (dengan `query` aktif vs kombinasi filter tanpa query).

- [ ] **Step 1: Tambahkan RED tests untuk `BatterySearch.tsx` di `tests/tahap2-pesan-aki.test.mjs`**

Verifikasi HTML SSR `BatterySearch`:
1. Tidak mengandung `.marketplace-strip`, namun memuat `.catalog-info-bar`, `.catalog-sticky-search`, `.quick-search-strip` (8 keyword pills), 4 tab kendaraan (`role="tab"`), chip `Kering / MF`, `Basah`, `Terlaris`, `<select aria-label="Urutkan katalog">`, dan tombol `Bingung tipe? Tanya Admin`.
2. Seluruh 36 kartu `.battery-card` ter-render lengkap bersama `.battery-card-banner` dan `"Cek stok &amp; harga di WA"`, serta terhubung dengan `.floating-cart-btn` (`Ringkasan WA`).
3. Source `BatterySearch.tsx` memanggil `searchAndSortBatteries`, mereset `techFilter` ke `"all"` saat tab `"vrla"` dipilih, menyediakan `onClearItems` ke `OrderSummary`, dan mendukung `openConsultDrawer` untuk pre-fill kendaraan & empty state non-query fallback.

- [ ] **Step 2: Jalankan test untuk melihat gagal sebelum implementasi (RED)**

Run: `node --test tests/tahap2-pesan-aki.test.mjs`
Expected: FAIL pada assertions Task 3; Task 1 & 2 tetap PASS.

- [ ] **Step 3: Implementasikan `src/components/BatterySearch.tsx`**

- Pertahankan persistensi `localStorage` (`STORAGE_KEY = "nja-order-draft-v1"`) utuh tanpa melanggar React 19 `set-state-in-effect`.
- Ganti `.marketplace-strip` dengan `.catalog-info-bar` + tombol `"Bingung tipe? Tanya Admin"`.
- Susun `.catalog-sticky-search` (terpisah dari strip pill & filter agar hanya search bar yang sticky di mobile), `.quick-search-strip`, dan `.catalog-filter-panel`.
- Hubungkan state `vehicleFilter`, `techFilter`, `onlyPopular`, `sortBy`, dan `isDrawerOpen`; ketika `handleVehicleChange("vrla")` dipanggil, set `techFilter` ke `"all"`.
- Perbarui markup `.battery-card` dengan banner visual kategori, tag teknologi berwarna, status `"Cek stok & harga di WA"`, dan tombol `+ Pilih` / `✓ Dipilih`.
- Perbarui `.empty-state` dengan 2 kondisi (ada `query` vs kombinasi filter kosong).

- [ ] **Step 4: Jalankan seluruh test Tahap 2, lint, dan typecheck (GREEN)**

Run: `node --test tests/tahap2-pesan-aki.test.mjs ; npm run lint ; npm run typecheck`
Expected: Semua test Task 1–3 PASS, ESLint & TSC exit 0.

---

### Task 4: Redesign Styling Katalog, Sticky Search, & Universal Drawer di `src/app/globals.css`

**Files:**
- Modify: `src/app/globals.css:90-104,755-1365,1919-2131`
- Test: `tests/tahap2-pesan-aki.test.mjs`

**Interfaces:**
- Consumes class names produced in Task 2 & Task 3: `.catalog-info-bar`, `.catalog-consult-btn`, `.catalog-sticky-search`, `.search-clear-btn`, `.search-quick-consult`, `.quick-search-strip`, `.quick-pill`, `.catalog-filter-panel`, `.vehicle-tabs`, `.vehicle-tab`, `.facet-bar`, `.catalog-sort-select`, `.battery-card-banner` (`.is-car`, `.is-motorcycle`, `.is-vrla`), `.battery-tech-tag` (`.is-mf`, `.is-dry`, `.is-vrla`), `.battery-price-hint`, `.floating-cart-btn`, `.summary-close`, `.summary-clear-btn`, `.order-summary.is-open`.

- [ ] **Step 1: Tambahkan RED tests kontrak CSS Tahap 2 di `tests/tahap2-pesan-aki.test.mjs`**

Verifikasi `src/app/globals.css`:
1. `body` memakai `overflow-x: clip;` (bukan `overflow-x: hidden;`).
2. Aturan `.marketplace-strip` dan `1fr 18rem` `.search-layout` lama sudah dihapus.
3. `.battery-grid` Desktop memakai `repeat(4, minmax(0, 1fr))` dan mobile `<= 768px` memakai `repeat(2, minmax(0, 1fr))`.
4. `.catalog-sticky-search` memakai `position: sticky;` (dengan `top: 3rem` pada `<= 1024px`).
5. `.floating-cart-btn` aktif secara default di desktop (`display: flex; bottom: 1.5rem; right: 1.5rem;`) dan bergeser ke `bottom: 4.25rem; right: 1rem;` pada `<= 1024px`.
6. `.order-summary` memakai `position: fixed; visibility: hidden; transform: translateX(105%);` di desktop (right slide-over drawer) dan `transform: translateY(105%);` di `<= 1024px` (bottom sheet), lalu `visibility: visible; transform: ...` pada `.order-summary.is-open`.
7. Blok `@media (prefers-reduced-motion: reduce)` mencakup `.floating-cart-btn` (`animation: none;`) dan `.order-summary` (`transition: none;`).

- [ ] **Step 2: Jalankan test untuk melihat gagal sebelum implementasi (RED)**

Run: `node --test tests/tahap2-pesan-aki.test.mjs`
Expected: FAIL pada assertions Task 4; Task 1–3 tetap PASS.

- [ ] **Step 3: Perbarui `src/app/globals.css`**

- Ubah `body { overflow-x: hidden; }` → `overflow-x: clip;` di baris ~93.
- Hapus rule mati `.marketplace-strip*`, `.search-layout`, `.summary-close-mobile`, `.mobile-floating-cart`, dan blok lama di media queries (`1024px` & `768px`).
- Tambahkan CSS baru untuk `.catalog-info-bar`, `.catalog-sticky-search`, `.search-input-wrap` + `.search-clear-btn`, `.quick-search-strip` + `.quick-pill`, `.catalog-filter-panel`, `.vehicle-tabs`, `.facet-bar`, `.catalog-sort-select`.
- Perbarui `.battery-grid` (`repeat(4, minmax(0, 1fr))` desktop → `repeat(3, minmax(0, 1fr))` di `<= 1120px` → `repeat(2, minmax(0, 1fr))` di `<= 768px`) serta gaya kartu olshop (`.battery-card-banner`, varian `.is-car` / `.is-motorcycle` / `.is-vrla`, `.battery-price-hint`, badge warna `.battery-tech-tag.is-mf/.is-dry/.is-vrla`).
- Implementasikan `.floating-cart-btn`, `.summary-backdrop` (aktif desktop & mobile), `.order-summary` (right drawer desktop + bottom sheet `<= 1024px` + `visibility: hidden` saat tertutup), `.summary-close` (`display: flex`), dan `.summary-clear-btn`.
- Tambahkan `.floating-cart-btn { animation: none; transition: none; }` dan `.order-summary { transition: none; }` di `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 4: Jalankan seluruh test project (`tahap2`, `tahap1`, `interactive-wizard`), lint, dan typecheck**

Run: `node --test tests/tahap2-pesan-aki.test.mjs tests/tahap1-shell-home.test.mjs tests/interactive-wizard.test.mjs ; npm run lint ; npm run typecheck`
Expected: Seluruh suite test PASS, ESLint & TSC exit 0.

---

### Task 5: Verifikasi Build Produksi & Artefak Statis `/home/pesan-aki`

**Files:**
- Inspect only (verified outputs from Tasks 1–4).

- [ ] **Step 1: Jalankan `npm run build`**

Run: `npm run build` (coba sandboxed terlebih dahulu; jika gagal koneksi font Google `Plus Jakarta Sans`, hapus `.next/lock` bila ada dan jalankan ulang dengan `BypassSandbox: true` dan `toolSummary` sama).
Expected: Kompilasi sukses, 10/10 route statis ter-generate.

- [ ] **Step 2: Verifikasi output statis `.next/server/app/home/pesan-aki.html` & chunk CSS**

Periksa `.next/server/app/home/pesan-aki.html` dan `.next/static/chunks/*.css` memastikan:
- 36 `.battery-card`, `.catalog-sticky-search`, `.quick-search-strip`, `.vehicle-tabs`, `.floating-cart-btn`, `#order-summary-drawer`, serta token olshop ter-render di HTML/CSS produksi.
- Rule lama `.marketplace-strip` dan `.mobile-floating-cart` tidak lagi tertinggal di bundle produksi.
