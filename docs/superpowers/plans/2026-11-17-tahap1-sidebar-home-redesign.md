# Tahap 1 — Sidebar, Footer, & `/home` Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memperbaiki tampilan dan animasi navigasi `Sidebar` + `Footer`, serta merombak halaman `/home` menggunakan kombo tata letak Desktop showcase berlapis + Mobile Visual-First (`3D Kotak Aki` di atas + 3 kartu sorotan ringkas + FAQ chevron modern).

**Architecture:** Mempertahankan arsitektur `AppShell` tanpa menyentuh halaman Tahap 2–3 (`/home/pesan-aki`, `/home/layanan`, `/home/lokasi`) maupun logika 60-frame canvas di `BatteryBoxScrollAnimation.tsx`. Perubahan mencakup peningkatan interaksi/animasi CSS & aksesibilitas di `Sidebar.tsx`, penambahan `HomeHighlights.tsx` di antara Hero & FAQ pada `/home/page.tsx`, penataan ulang grid/urutan responsif Hero & canvas 3D, serta perampingan `FAQSection.tsx` & `Footer.tsx`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules (`HeroSection.module.css`, `BatteryBoxScrollAnimation.module.css`), Global CSS tokens (`src/app/globals.css`), `lucide-react`, Node 24 native test runner (`node --test`).

**Spec:** [2026-11-16-tahap1-sidebar-home-redesign.md](file:///c:/Users/Muhammad%20Nafis/My%20WEB%20vs%20code/nafis-jaya-accu/docs/superpowers/specs/2026-11-16-tahap1-sidebar-home-redesign.md)

## Global Constraints
- Hanya memodifikasi file terkait Tahap 1 (`Sidebar.tsx`, `HeroSection.tsx`, `HeroSection.module.css`, `BatteryBoxScrollAnimation.module.css`, `FAQSection.tsx`, `Footer.tsx`, `src/app/home/page.tsx`, `src/app/globals.css`) serta membuat `src/components/HomeHighlights.tsx`.
- Tidak mengubah halaman `/` (`InteractiveWizard`), `/home/pesan-aki`, `/home/layanan`, `/home/lokasi`, maupun logika frame scroll di `src/components/BatteryBoxScrollAnimation.tsx`.
- Mempertahankan seluruh data krusial: `BUSINESS_NAME`, `BUSINESS_TAGLINE`, `STORE_HOURS`, `SERVICE_AREA`, `navItems` (4 menu), tautan `Mode Akses Cepat` (`/`), `WHATSAPP_URL`, `GOOGLE_MAPS_URL`, `INSTAGRAM_URL`, 7 item FAQ dari `src/data/faq.ts`, dan bottom navigation mobile 4 tab.
- Memakai palet gelap berlapis dan scale token CSS yang sudah ada di `src/app/globals.css`.

## Review Focus
- **Drawer keyboard & route-change cleanup (`Sidebar.tsx`):** Menutup drawer saat tombol `Escape` ditekan maupun saat `pathname` berpindah tanpa melanggar aturan hook ESLint React 19 (`set-state-in-effect`).
- **3D canvas bounding & glow overflow (`HeroSection.module.css` & `globals.css`):** Kontainer `.hero-card` dan `.visualPanel` tidak boleh memotong efek glow atau mengecilkan lebar/tinggi canvas ke `0` di mobile (`<= 980px`).
- **Custom scroll progress semantics (`Sidebar.tsx`):** Mengganti `<progress>` bawaan harus tetap menyediakan `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow`, dan `aria-label`.
- **Prefers-reduced-motion compliance (`globals.css`):** Semua animasi baru (staggered drawer, hover nudge, pulsing live status dot, chevron FAQ, active indicator) harus berhenti atau disederhanakan pada `@media (prefers-reduced-motion: reduce)`.
- **Footer layout integrity (`Footer.tsx` & `globals.css`):** Menghapus kolom duplikat `navItems` dari Footer harus tetap menjaga keseimbangan tata letak desktop dan tidak menyisakan baris kosong atau misalignment di mobile.

---

### Task 1: Upgrade Tampilan, Ikon, Progress Bar Kustom, & Animasi di `Sidebar.tsx` + `globals.css`

**Files:**
- Modify: `src/components/Sidebar.tsx:1-174`
- Modify: `src/app/globals.css:262-591,1664-1695`
- Create: `tests/tahap1-shell-home.test.mjs`

**Interfaces:**
- Consumes: `BUSINESS_NAME`, `BUSINESS_TAGLINE`, `navItems`, `SERVICE_AREA`, `STORE_HOURS`, `WHATSAPP_URL` from `@/lib/constants`; `usePathname` from `next/navigation`.
- Produces in `Sidebar.tsx`:
  - Map ikon eksplisit `navIcons` (`Home`, `Search`, `Wrench`, `MapPin`) untuk tiap item `navItems` (menghapus `.sidebar-dot`).
  - Efek `Escape` listener saat `isOpen` aktif untuk menutup drawer mobile (`setIsOpen(false)`).
  - Track progress bar kustom `.sidebar-scroll-track` (`role="progressbar"`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-valuenow={Math.round(scrollProgress * 100)}`, `aria-label`) dengan anak `.sidebar-scroll-fill`.
  - Titik status hidup `<span className="status-live-dot" aria-hidden="true" />` di dalam `.sidebar-status` sebelum `Buka {STORE_HOURS}`.
  - Variabel CSS index stagger (`--nav-index`) atau selector `nth-child` pada item `.site-sidebar .sidebar-link`, `.sidebar-interactive-mode`, `.sidebar-whatsapp` untuk animasi masuk drawer mobile.

- [ ] **Step 1: Tulis unit test RED untuk Task 1 di `tests/tahap1-shell-home.test.mjs`**

Buat file `tests/tahap1-shell-home.test.mjs` (menggunakan helper `loadTsxComponent` dengan stub `next/navigation`, `next/link`, `next/image`) yang memverifikasi:
1. Render HTML `Sidebar` mengandung `.sidebar-scroll-track`, `role="progressbar"`, dan tidak mengandung `<progress class="battery-progress"` maupun `sidebar-dot`.
2. Ke-4 menu `navItems` muncul dengan ikon SVG (tidak ada span `.sidebar-dot`), `.status-live-dot` ada di `.sidebar-status`, dan source `Sidebar.tsx` memiliki handler `Escape`.
3. `globals.css` mendefinisikan `.sidebar-link::before`, `.status-live-dot`, `.mobile-bottom-nav a.is-active::before`, serta aturan `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 2: Jalankan test untuk memastikan gagal sesuai ekspektasi (RED)**

Run: `node --test tests/tahap1-shell-home.test.mjs`
Expected: FAIL karena `Sidebar.tsx` masih memakai `<progress class="battery-progress">` & `.sidebar-dot`, dan CSS animasi baru belum ada.

- [ ] **Step 3: Perbarui `src/components/Sidebar.tsx` sesuai desain & Global Constraints**

- Tambahkan mapping ikon per route (`"/home": Home`, `"/home/pesan-aki": Search`, `"/home/layanan": Wrench`, `"/home/lokasi": MapPin`).
- Tambahkan `useEffect` khusus ketika `isOpen` bernilai `true` untuk menutup drawer bila user menekan `Escape` (dan pastikan listener dibersihkan pada cleanup).
- Ganti `.sidebar-dot` dengan ikon menu `size={15}`.
- Ganti `<progress className="battery-progress" ... />` dengan `.sidebar-scroll-track` + `.sidebar-scroll-fill` lengkap dengan atribut ARIA progressbar.
- Tambahkan `<span className="status-live-dot" aria-hidden="true" />` sebelum `Buka {STORE_HOURS}` (menggantikan `Clock3` statis atau melengkapi icon/status secara ringkas tanpa berantakan).

- [ ] **Step 4: Perbarui styling Sidebar, Bottom Nav, & Animasi di `src/app/globals.css`**

- Hapus rule `.battery-progress` dan `.sidebar-dot`.
- Tambah `.sidebar-scroll-track` & `.sidebar-scroll-fill` dengan glow aksen `--brand` dan `transition: width 120ms ease-out`.
- Tambah `.sidebar-link` (`position: relative; transition: ...`) beserta `.sidebar-link::before` bar vertikal aktif (`transform: scaleY(0)` → `.sidebar-link.is-active::before { transform: scaleY(1); }`), dan animasi hover mikro pada ikon (`svg { transition: transform 180ms ease; }`).
- Tambah `.status-live-dot` (`width: 6px; height: 6px; border-radius: 50%; background: var(--whatsapp);`) dengan `@keyframes status-pulse`.
- Pada `@media (max-width: 1024px)`: tambahkan animasi stagger untuk `.site-sidebar.is-open .sidebar-link`, `.sidebar-interactive-mode`, `.sidebar-whatsapp` (`opacity`, `transform`, `transition-delay` per `nth-child`), active top indicator `.mobile-bottom-nav a.is-active::before`, serta `:active` press scale halus (`transform: scale(0.95)`).
- Tambahkan blok `@media (prefers-reduced-motion: reduce)` yang menonaktifkan animasi transisi/pulse baru tersebut.

- [ ] **Step 5: Verifikasi Task 1 GREEN, lint, dan typecheck**

Run: `node --test tests/tahap1-shell-home.test.mjs ; npm run lint ; npm run typecheck`
Expected: Test Task 1 PASS, ESLint dan TypeScript exit code 0.

---

### Task 2: Redesign Hero Section `/home` (Kombo Opsi 1 + Opsi 3)

**Files:**
- Modify: `src/components/HeroSection.tsx:1-42`
- Modify: `src/components/HeroSection.module.css:1-34`
- Modify: `src/components/BatteryBoxScrollAnimation.module.css:138-193`
- Modify: `src/app/globals.css:592-657,1734-1748`
- Test: `tests/tahap1-shell-home.test.mjs`

**Interfaces:**
- Consumes: `STORE_HOURS`, `SERVICE_AREA` from `@/lib/constants`; `BatteryBoxScrollAnimation` component (`startVisibleRatio={0.1}`, `endViewportRatio={0.18}`); CSS class `.heroVisual` from `HeroSection.module.css`.
- Produces:
  - `.hero-card` membungkus `.hero-grid` di dalam `.hero-section`.
  - `.hero-status-pill` menampilkan `<span className="status-live-dot" aria-hidden="true" />` dan teks `Buka {STORE_HOURS} • {SERVICE_AREA}` di atas `<h1>` (bersama `.eyebrow` ringkas atau terpadu rapi tanpa pengulangan).
  - `.hero-actions` memisahkan CTA utama (`Cari Tipe dan Pesan Aki` → `/home/pesan-aki`) dengan kontainer `.hero-actions-secondary` berisi `Lihat Lokasi Toko` (`/home/lokasi`) & `Layanan Toko` (`/home/layanan`).
  - Pada `<= 980px`: `.heroVisual` memakai `order: -1; min-height: 11.5rem;`, dan di `BatteryBoxScrollAnimation.module.css` ukuran `.root` diperkecil ke `min(100%, 13rem)` (`<= 980px`) dan `min(100%, 11.5rem)` (`<= 520px`).

- [ ] **Step 1: Tambahkan failing tests untuk Task 2 di `tests/tahap1-shell-home.test.mjs`**

Verifikasi:
1. Render HTML `HeroSection` mengandung `.hero-card`, `.hero-status-pill` dengan `06.00-21.00`, 3 href utama (`/home/pesan-aki`, `/home/lokasi`, `/home/layanan`), dan `.hero-actions-secondary`.
2. `HeroSection.module.css` mendefinisikan `order: -1` dan `min-height: 11.5rem` pada `@media (max-width: 980px)`, dan `BatteryBoxScrollAnimation.module.css` menetapkan `13rem` / `11.5rem`.

- [ ] **Step 2: Jalankan test untuk memastikan test Task 2 gagal (RED)**

Run: `node --test tests/tahap1-shell-home.test.mjs`
Expected: Test Task 2 FAIL; test Task 1 tetap PASS.

- [ ] **Step 3: Implementasikan `src/components/HeroSection.tsx`, `HeroSection.module.css`, `BatteryBoxScrollAnimation.module.css`, & `globals.css`**

- Perbarui `HeroSection.tsx`: bungkus `.hero-grid` dalam `<div className="hero-card">`, tambahkan `.hero-status-pill` dengan `.status-live-dot` dan `Buka {STORE_HOURS} • {SERVICE_AREA}`, pertahankan H1 + lead + `.hero-note`, dan susun `.hero-actions` menjadi tombol utama `.btn.btn-primary` + grup `.hero-actions-secondary` (`.btn.btn-secondary` untuk `/home/lokasi` dan `/home/layanan`).
- Perbarui `HeroSection.module.css`: tambahkan aturan `.visualPanel` di `@media (max-width: 980px)` (`order: -1; min-height: 11.5rem; padding: 0;`).
- Perbarui `BatteryBoxScrollAnimation.module.css`: atur `.root` pada `@media (max-width: 980px)` ke `width: min(100%, 13rem);` dan `@media (max-width: 520px)` ke `width: min(100%, 11.5rem);`.
- Perbarui `src/app/globals.css`: tambahkan gaya `.hero-card` (background berlapis gelap `var(--surface)`, hairline border `var(--border)`, subtle ambient sheen, `padding: var(--space-5); border-radius: var(--radius-xl);` tanpa `overflow: hidden` agar aura tidak terpotong), `.hero-status-pill`, `.hero-actions` & `.hero-actions-secondary` (desktop inline row; mobile `<= 1024px` primary button `width: 100%` + secondary grid `repeat(2, minmax(0, 1fr))` agar simetris rapi di bawah judul).

- [ ] **Step 4: Jalankan test suite, lint, dan typecheck**

Run: `node --test tests/tahap1-shell-home.test.mjs ; npm run lint ; npm run typecheck`
Expected: Test Task 1 & 2 PASS, ESLint & TSC exit 0.

---

### Task 3: Tambah `HomeHighlights.tsx`, Rombak FAQ Chevron & Rampingkan Footer

**Files:**
- Create: `src/components/HomeHighlights.tsx`
- Modify: `src/app/home/page.tsx:1-29`
- Modify: `src/components/FAQSection.tsx:1-52`
- Modify: `src/components/Footer.tsx:1-58`
- Modify: `src/app/globals.css:1502-1643,1753-1763`
- Test: `tests/tahap1-shell-home.test.mjs`

**Interfaces:**
- Produces `HomeHighlights` (`export default function HomeHighlights()`): render `<section className="section highlights-section" aria-label="Sorotan layanan">` dengan `<div className="highlights-grid">` berisi 3 `<Link className="highlight-card glass-card">` menuju `/home/pesan-aki`, `/home/layanan`, dan `/home/lokasi` lengkap ikon (`Search`, `Zap`, `MapPin`), `.highlight-copy` (`<strong>` & `<small>`), dan `<ChevronRight size={15} aria-hidden="true" />`.
- Updates `src/app/home/page.tsx`: menyisipkan `<HomeHighlights />` tepat di antara `<HeroSection />` dan `<FAQSection />`.
- Updates `FAQSection.tsx`: mengganti `::after` teks `+ / −` dengan `<ChevronDown size={16} className="faq-chevron" aria-hidden="true" />` dan menambah `type="button"` pada tombol `.faq-summary`.
- Updates `Footer.tsx`: menghapus kolom `navItems`, hanya menyisakan blok `.footer-brand` dan blok kontak cepat (`Mode Akses Cepat` `/`, `WhatsApp Admin`, `Buka Google Maps`, `Buka {STORE_HOURS}`, `"Harga & stok via WhatsApp"`) + `.creator-credit` (`INSTAGRAM_URL`).

- [ ] **Step 1: Tambahkan failing tests untuk Task 3 di `tests/tahap1-shell-home.test.mjs`**

Verifikasi:
1. Render HTML `/home` (`HomeHighlights` + `FAQSection` + `Footer`):
   - `HomeHighlights` merender 3 `.highlight-card` ke `/home/pesan-aki`, `/home/layanan`, `/home/lokasi`.
   - `FAQSection` merender semua 7 pertanyaan FAQ, semua tombol `.faq-summary` punya `type="button"`, dan mengandung `.faq-chevron`.
   - `Footer` merender link `/`, `wa.me`, Google Maps, `06.00-21.00`, dan Instagram credit, namun tidak merender heading `"Navigasi"`.
   - Urutan di `src/app/home/page.tsx` menempatkan `HeroSection` → `HomeHighlights` → `FAQSection` → `Footer`.
2. `globals.css` mendefinisikan `.highlights-grid` (3 kolom desktop → 1 kolom `<= 768px`) serta rotasi `.faq-item.is-open .faq-chevron` tanpa pseudo-element `.faq-summary::after`.

- [ ] **Step 2: Jalankan test untuk memastikan test Task 3 gagal (RED)**

Run: `node --test tests/tahap1-shell-home.test.mjs`
Expected: FAIL pada assertions Task 3; Task 1 & 2 tetap PASS.

- [ ] **Step 3: Implementasikan `HomeHighlights.tsx`, `home/page.tsx`, `FAQSection.tsx`, `Footer.tsx`, & `globals.css`**

- Buat `src/components/HomeHighlights.tsx` dengan 3 kartu sorotan ringkas.
- Update `src/app/home/page.tsx` untuk merender `<HomeHighlights />` di antara `<HeroSection />` dan `<FAQSection />`.
- Update `src/components/FAQSection.tsx` dengan `type="button"` dan ikon `ChevronDown` `.faq-chevron`.
- Update `src/components/Footer.tsx` menghapus kolom `Navigasi` (`navItems`) yang duplikat dan memformat blok `.footer-links` tunggal yang rapi.
- Update `src/app/globals.css`:
  - Tambah section `.highlights-section`, `.highlights-grid`, `.highlight-card`, `.highlight-icon`, `.highlight-copy`, dan aturan `@media (max-width: 768px)` (`grid-template-columns: 1fr;`).
  - Ganti rule `.faq-summary::after` dengan `.faq-chevron` + `.faq-item.is-open { border-color: var(--brand-soft-border); }` + `.faq-item.is-open .faq-chevron { transform: rotate(180deg); }`.
  - Sesuaikan `.footer-grid` (`grid-template-columns: 1fr auto; align-items: start;`) agar rapi tanpa kolom kiri-kanan timpang, dan tata horizontal/compact di mobile (`<= 1024px`).

- [ ] **Step 4: Jalankan seluruh test suite, lint, dan typecheck**

Run: `node --test tests/tahap1-shell-home.test.mjs tests/interactive-wizard.test.mjs ; npm run lint ; npm run typecheck`
Expected: Semua test PASS, ESLint & TSC exit 0.

---

### Task 4: Verifikasi Build Produksi & Artefak Statis `/home`

**Files:**
- Inspect only (verified outputs from Tasks 1–3).

- [ ] **Step 1: Jalankan `npm run build`**

Run: `npm run build` (coba sandboxed dulu, jika gagal fetch Google Font lanjutkan dengan `BypassSandbox: true` dan `toolSummary` sama).
Expected: Kompilasi Next.js & TypeScript sukses, seluruh 10 route statis ter-generate tanpa error.

- [ ] **Step 2: Verifikasi output statis `.next/server/app/home.html` dan chunk CSS**

Periksa `.next/server/app/home.html` dan `.next/static/chunks/*.css` memastikan hasil render produksi `/home` mengandung `hero-card`, `highlights-section`, `sidebar-scroll-track`, `faq-chevron`, `status-live-dot`, serta tidak ada `<progress class="battery-progress">` maupun `sidebar-dot` yang tertinggal.
