# Wizard Landing Page (`/`) Desktop & Mobile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revisi tampilan desktop dan mobile halaman utama (`/`) agar bebas dari panel kosong, memprioritaskan form wizard langsung di atas lipatan layar mobile dengan tab horizontal, serta menata ulang peta lokasi dark-mode tanpa menghapus fitur atau konten penting.

**Architecture:** Memisahkan kartu lokasi toko (`.wz-location`) keluar dari `.wz-left` menjadi saudara sejajar di dalam `.wz-body` agar CSS Grid desktop menempatkan kartu kategori + lokasi di kolom kiri sementara form merentang penuh di kolom kanan, sedangkan mobile mengalir vertikal alami (*Greeting + Tab Horizontal → Form Aktif → Lokasi Toko*) tanpa duplikasi komponen `<LeafletMap />`. State awal `mainCategory` diubah ke `"pesan"` agar form Pesan Aki langsung tampil sejak render pertama.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Variables (`src/app/globals.css`), `lucide-react`, `react-leaflet` / Leaflet.

**Spec:** [2026-11-16-wizard-responsive-redesign.md](file:///c:/Users/Muhammad%20Nafis/My%20WEB%20vs%20code/nafis-jaya-accu/docs/superpowers/specs/2026-11-16-wizard-responsive-redesign.md)

## Global Constraints
- Hanya memodifikasi `src/components/InteractiveWizard.tsx` dan `src/components/InteractiveWizard.css`; halaman `/home`, `/home/pesan-aki`, `/home/layanan`, `/home/lokasi`, serta format pesan WhatsApp tidak boleh berubah.
- Seluruh elemen krusial tetap ada: 20 greeting dinamis (`GREETINGS`), 3 kategori layanan (`Pesan Aki`, `Setrum Aki`, `Perlengkapan`), info Kering vs Basah, tautan `/home/pesan-aki`, peta interaktif `LeafletMap` (hanya 1 instance di DOM), jam buka `STORE_HOURS` (`06.00-21.00`), tautan `GOOGLE_MAPS_URL`, dan tombol menuju `/home`.
- Menggunakan token tema gelap berlapis yang sudah didefinisikan di `src/app/globals.css` (`--surface`, `--bg-subtle`, `--border`, `--brand`, `--amber`, `--whatsapp`, `--text`, `--muted`).
- Pastikan tidak ada error TypeScript (`npm run typecheck`) maupun ESLint (`npm run lint`), termasuk aturan React 19 hooks.

## Review Focus
- **Initial scroll position on mobile:** Membuka `/` untuk pertama kali tidak boleh memicu `scrollIntoView` yang melompat melewati sapaan dan tab layanan ke form di tengah layar.
- **Map tile dark-mode vs blue marker:** Filter inversi gelap pada peta hanya boleh diterapkan ke `.leaflet-tile-pane`, bukan ke kontainer peta secara keseluruhan agar pin toko `.custom-store-marker` tetap berwarna biru cerah.
- **360px narrow mobile topbar collision:** Tombol link ke `/home` di pojok kanan atas tidak boleh bertabrakan dengan logo `Nafis Jaya Accu` atau menyebabkan overflow horizontal pada lebar layar 360px–375px.
- **Three-tab horizontal overflow on mobile:** Label 3 tab kategori (`Pesan Aki`, `Setrum Aki`, `Perlengkapan`) harus muat 1 baris rapi di layar 360px tanpa terpotong atau patah baris aneh.
- **Disabled WhatsApp CTA accessibility:** Tombol WA saat form belum lengkap tidak boleh tetap fokus lewat Tab keyboard sementara secara visual terlihat nonaktif (`aria-disabled` + `tabIndex={-1}`).

---

### Task 1: Restrukturisasi DOM & State Awal di `InteractiveWizard.tsx`

**Files:**
- Modify: `src/components/InteractiveWizard.tsx:8-15,61-94,126-409`

**Interfaces:**
- Consumes: `STORE_HOURS`, `WHATSAPP_NUMBER`, `GOOGLE_MAPS_URL` from `@/lib/constants`; `LeafletMap` dynamic component; CSS tokens/classes defined in Task 2.
- Produces JSX classes & DOM structure for `InteractiveWizard.css`:
  - `.wz-topbar` containing `.wz-logo` and `.wz-home-link` (`<span className="wz-home-link-full">Masuk ke Halaman Utama</span>` + `<span className="wz-home-link-short" aria-hidden="true">Halaman Utama</span>`)
  - `.wz-body` with 3 direct children in DOM order:
    1. `<aside className="wz-left">` (Greeting + 3 category tab buttons inside `role="tablist"`, each button having `role="tab"`, `aria-selected={active}`, `.wz-cat-icon`, `.wz-cat-text`, `.wz-cat-arrow`)
    2. `<section className="wz-right" aria-live="polite">` (Direct flow form `.wz-flow` for `"pesan"`, `"setrum"`, `"perlengkapan"` — no `.wz-empty-state`)
    3. `<aside className="wz-location" aria-label="Lokasi toko">` (`.wz-location-head` with `"Lokasi Toko"` & `.wz-hours-badge` showing `Buka ${STORE_HOURS}`, `.wz-mini-map-container` wrapping single `<LeafletMap />`, and `.wz-mini-map-btn` link to `GOOGLE_MAPS_URL`)

- [ ] **Step 1: Periksa baris impor & state awal di `InteractiveWizard.tsx`**

Verifikasi baris yang akan diubah dengan membaca ulang bagian atas file bila perlu: `STORE_HOURS` diimpor di baris 14, `mainCategory` di baris 61, `flowRef` & `scrollIntoView` di baris 77 & 87-93.

- [ ] **Step 2: Ubah `mainCategory` default menjadi `"pesan"`, hapus `flowRef` / auto-scroll, dan tambahkan `STORE_HOURS`**

Di `src/components/InteractiveWizard.tsx`:
- Impor `STORE_HOURS` (dan ikon `Clock3` dari `lucide-react` jika dipakai di badge jam buka).
- Ubah `useState<MainCategory>(null)` pada `mainCategory` menjadi `useState<MainCategory>("pesan")` dan hapus tipe `null` jika tidak pernah diset `null` lagi (`type MainCategory = "pesan" | "setrum" | "perlengkapan"`).
- Hapus `flowRef` dan `useEffect` `scrollIntoView` beserta prop `ref={flowRef}` di ketiga blok flow agar layar tetap stabil di atas saat mount maupun saat ganti tab.

- [ ] **Step 3: Pisahkan `.wz-location` keluar dari `.wz-left`, hapus `.wz-empty-state`, perbarui aksesibilitas tab & topbar**

Di `src/components/InteractiveWizard.tsx`:
- Pada `.wz-home-link`, bungkus teks `"Masuk ke Halaman Utama"` dengan `<span className="wz-home-link-full">` dan tambahkan `<span className="wz-home-link-short" aria-hidden="true">Halaman Utama</span>`.
- Pada `.wz-categories`, tambahkan `role="tablist" aria-label="Pilih kebutuhan"` dan pada tiap tombol `.wz-cat-btn` tambahkan `type="button"`, `role="tab"`, `aria-selected={active}`.
- Pindahkan blok lokasi toko dari dalam `.wz-left` keluar menjadi `<aside className="wz-location" aria-label="Lokasi toko">` setelah `</section>` (`.wz-right`). Di dalamnya sertakan `.wz-location-head` (label `Lokasi Toko` + `<span className="wz-hours-badge">Buka {STORE_HOURS}</span>`), `<div className="wz-mini-map-container"><LeafletMap /></div>`, dan link `Buka di Google Maps`.
- Hapus blok `{!mainCategory && (<div className="wz-empty-state">...</div>)}`.
- Pada ketiga tombol WA `.wz-submit-btn` (`pesan`, `setrum`, `perlengkapan`), tambahkan `aria-disabled={!isReady}` dan `tabIndex={isReady ? undefined : -1}` supaya keyboard focus tidak masuk saat form belum lengkap.
- Pastikan tidak ada variabel/import tak terpakai (`useRef` harus dihapus dari impor `react`).

- [ ] **Step 4: Jalankan lint & typecheck**

Run: `npm run lint ; npm run typecheck`
Expected: Keduanya keluar dengan code `0`, 0 error dan 0 warning (khususnya tidak ada unused `useRef` atau mismatch tipe `MainCategory`).

---

### Task 2: Redesign Tata Letak Desktop, Tab Mobile, dan Peta Dark-Mode di `InteractiveWizard.css`

**Files:**
- Modify: `src/components/InteractiveWizard.css:106-367,706-729`

**Interfaces:**
- Consumes exact class names produced in Task 1: `.wz-home-link-full`, `.wz-home-link-short`, `.wz-body`, `.wz-left`, `.wz-categories`, `.wz-cat-btn`, `.wz-right`, `.wz-location`, `.wz-location-head`, `.wz-hours-badge`, `.wz-mini-map-container`, `.wz-mini-map-btn`.

- [ ] **Step 1: Atur Desktop 2-kolom dengan `.wz-location` di kolom kiri baris 2 dan `.wz-right` merentang di kolom kanan**

Di `src/components/InteractiveWizard.css`:
- Atur `.wz-home-link-short { display: none; }` sebagai default desktop, dan `.wz-home-link { white-space: nowrap; flex-shrink: 0; }`.
- Pada `.wz-body`: set `grid-template-columns: 18.5rem minmax(0, 1fr); grid-template-rows: auto 1fr; column-gap: var(--space-3); row-gap: var(--space-3); align-items: start;`.
- Posisikan grid desktop:
  - `.wz-left`: `grid-column: 1; grid-row: 1;`
  - `.wz-location`: `grid-column: 1; grid-row: 2;` dengan gaya kartu berlapis gelap yang serasi dengan `.wz-left` (`background: var(--surface)`, `background-image: linear-gradient(...)`, `border: 1px solid var(--border)`, `border-radius: var(--radius-md)`, `padding: var(--space-3) var(--space-4)`, `box-shadow: var(--shadow-card)`, `display: flex; flex-direction: column; gap: 6px;`).
  - `.wz-right`: `grid-column: 2; grid-row: 1 / span 2; min-width: 0;` dan hapus `min-height: 20rem` agar tinggi panel mengikuti konten form tanpa ruang kosong berlebih.
- Hapus rule mati `.wz-empty-state`, `.wz-empty-icon`, dan `.wz-empty-state p`.
- Tambahkan styling `.wz-location-head` (`display: flex; align-items: center; justify-content: space-between; gap: var(--space-2);`) dan `.wz-hours-badge` (`font-size: 0.625rem; font-weight: 700; color: var(--brand); background: var(--brand-soft); border: 1px solid var(--brand-soft-border); padding: 0.125rem 0.45rem; border-radius: var(--radius-full); white-space: nowrap;`).

- [ ] **Step 2: Tambahkan filter peta dark-mode dan rapikan kontrol zoom/attribution Leaflet**

Di `src/components/InteractiveWizard.css` di bawah `.wz-mini-map-container`:
- Terapkan filter hanya pada `.wz-mini-map-container .leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(92%) contrast(88%) saturate(85%); }` (biarkan marker pin biru `.custom-store-marker` tidak terfilter).
- Sesuaikan warna background kontainer peta `.wz-mini-map-container .leaflet-container { background: var(--bg-subtle); }`.
- Perkecil kontrol zoom `.wz-mini-map-container .leaflet-control-zoom` (`margin: 6px; border: 1px solid var(--border-strong); border-radius: var(--radius-xs); overflow: hidden;`) dan `.leaflet-control-zoom a` (`width: 1.35rem; height: 1.35rem; line-height: 1.35rem; font-size: 0.75rem; background: rgba(18, 26, 41, 0.9); color: var(--text); border-color: var(--border);`).
- Perkecil watermark `.wz-mini-map-container .leaflet-control-attribution` (`font-size: 0.5rem; line-height: 1.2; padding: 1px 4px; background: rgba(8, 12, 20, 0.72); color: var(--muted);`) serta link di dalamnya (`color: var(--text-secondary);`).

- [ ] **Step 3: Implementasikan tata letak Mobile (`@media (max-width: 900px)` dan `@media (max-width: 480px)`)**

Di `src/components/InteractiveWizard.css` dalam blok responsive:
- Pada `@media (max-width: 900px)`:
  - `.wz-body`: `display: flex; flex-direction: column; gap: var(--space-2);` dan reset `grid-column` / `grid-row` pada `.wz-left`, `.wz-right`, `.wz-location` agar masing-masing lebar penuh (`width: 100%`).
  - `.wz-greeting`: `font-size: 1.05rem; text-align: left;` agar selaras dengan tab horizontal dan menghemat tinggi vertikal.
  - `.wz-categories`: ubah dari kolom menjadi tab bar horizontal 3 kolom (`display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.375rem;`).
  - `.wz-cat-btn`: ubah jadi kartu tab ringkas (`flex-direction: column; align-items: center; text-align: center; gap: 4px; padding: 0.45rem 0.25rem; min-width: 0;`).
  - `.wz-cat-icon`: `width: 1.65rem; height: 1.65rem;` (sedikit diperkecil agar muat rapi).
  - `.wz-cat-text strong`: `font-size: 0.6875rem; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;`.
  - Sembunyikan `.wz-cat-text small` dan `.wz-cat-arrow` pada mobile (`display: none;`) supaya ketiga tab seimbang dalam 1 baris tanpa teks terpotong.
  - `.wz-location`: `padding: var(--space-3);` dan `.wz-mini-map-container { height: 8rem; }`.
- Pada `@media (max-width: 480px)`:
  - Sembunyikan `.wz-home-link-full` dan tampilkan `.wz-home-link-short { display: inline; }` agar header tidak sesak di layar 360px–375px.
  - Sedikit rapatkan `.wz-topbar` (`gap: var(--space-2);`).

- [ ] **Step 4: Verifikasi CSS tidak menimbulkan error build atau lint**

Run: `npm run lint ; npm run typecheck`
Expected: Exit code `0`, 0 error dan 0 warning.

---

### Task 3: Verifikasi Build Produksi & Cek Visual / DOM Desktop vs Mobile

**Files:**
- Inspect only (verified outputs from Task 1 & Task 2): `src/components/InteractiveWizard.tsx`, `src/components/InteractiveWizard.css`

**Interfaces:**
- Consumes running Next.js app at `http://localhost:3000/`.

- [ ] **Step 1: Jalankan build produksi penuh untuk memastikan kompilasi Next.js lolos**

Run: `npm run build` (jalankan `BypassSandbox: true` jika Next.js membutuhkan koneksi font, atau sandbox default jika sudah ter-cache).
Expected: Seluruh route (`/`, `/home`, `/home/pesan-aki`, `/home/layanan`, `/home/lokasi`, dll) ter-generate sukses tanpa error.

- [ ] **Step 2: Uji tampilan & perilaku di viewport Desktop (`1280x800`) dan Mobile (`375x812`)**

Pastikan pemeriksaan mencakup seluruh poin di **Review Focus**:
1. **Desktop `1280x800`:**
   - Panel kanan langsung menampilkan form **Pesan Aki** (`Step 1` Mobil/Motor), tidak ada kotak kosong besar.
   - Kartu **Lokasi Toko** berada di kolom kiri bawah dengan jam buka `Buka 06.00-21.00`, tile peta gelap (marker biru tetap cerah), dan tautan `Buka di Google Maps`.
   - Klik `Setrum Aki` dan `Perlengkapan` mengganti form kanan dengan benar; mengisi `Perlengkapan` atau `Pesan Aki` mengaktifkan tombol hijau WhatsApp dengan tautan `wa.me/6281331289410` yang valid.
2. **Mobile `375x812`:**
   - Topbar memuat `Nafis Jaya Accu` dan `Halaman Utama` dengan jarak aman, `document.documentElement.scrollWidth <= window.innerWidth` (0 horizontal overflow).
   - Scroll posisi awal tetap di `0` (tidak lompat ke bawah).
   - Ketiga tab (`Pesan Aki`, `Setrum Aki`, `Perlengkapan`) tampil dalam 1 baris sejajar (`height` ketiga tab seragam, tidak turun ke baris 2).
   - Form Wizard tampil **langsung di bawah tab** (sebelum Lokasi Toko), dan kartu **Lokasi Toko** berada rapi di bagian paling bawah halaman.
3. **Laporkan hasil cek lint, typecheck, build, dan verifikasi visual sebelum mengakhiri.**
