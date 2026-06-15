# Nafis Jaya Accu

Website multipage profesional untuk **Nafis Jaya Accu**, toko dan layanan aki mobil/motor untuk area Surabaya, Sidoarjo, dan sekitarnya. Website ini dibuat sebagai landing page bisnis, katalog panduan aki, halaman layanan, dan halaman lokasi yang mengarahkan pengguna ke konsultasi WhatsApp.

Live production: https://nafis-jaya-accu.vercel.app/

## Ringkasan posisi produk

Satu kalimat: **Nafis Jaya Accu membantu pengguna Surabaya-Sidoarjo mencari tipe aki mobil/motor sebagai panduan awal, lalu mengonfirmasi stok, harga, merek, dan opsi layanan lewat WhatsApp.**

Web ini tidak menampilkan harga dan merek secara permanen karena stok, pilihan merek, kebutuhan pemasangan, dan kondisi kendaraan perlu dikonfirmasi langsung agar informasi tetap akurat.

## Struktur halaman

- `/` — Home ringkas dengan hero animasi, arah cepat ke katalog, layanan, dan lokasi.
- `/pesan-aki` — Katalog aki ringan dengan pencarian, filter, pilihan aki, draft lokal, dan generator pesan WhatsApp.
- `/layanan` — Layanan jual aki, cek/pasang di toko, setrum/cas, tukar tambah, dan perlengkapan aki.
- `/lokasi` — Area layanan, peta toko, jam buka, dan tombol Google Maps.

## Fitur utama

- Hero scroll animation berbasis 60 frame WebP transparan.
- Navigasi multipage dengan drawer burger di desktop dan mobile.
- Bottom navigation khusus mobile.
- Katalog aki berdasarkan kode aki, kendaraan, kapasitas, kategori kendaraan, dan teknologi aki.
- Filter katalog: semua, mobil, motor, MF/kering, basah, dan VRLA/UPS.
- Ringkasan WhatsApp dengan pilihan aki, kendaraan, kebutuhan, dan lokasi/rencana datang.
- Draft order tersimpan di `localStorage`, bukan dikirim ke server.
- Peta lokasi berbasis Leaflet dan tombol Google Maps.
- SEO metadata per halaman, Open Graph/Twitter card, sitemap, robots, dan structured data `AutoPartsStore`.
- Halaman 404 dengan arahan kembali ke katalog atau lokasi.

## Data bisnis utama

- Nama toko: Nafis Jaya Accu
- Area utama: Surabaya, Sidoarjo, dan sekitarnya
- Jam buka: 06.00-21.00
- WhatsApp: `6281331289410`
- Google Maps: https://maps.app.goo.gl/E94fTsWyBTr7psELA
- Instagram credit: https://www.instagram.com/nfs_ky07/

## Menjalankan project

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Validasi sebelum push/deploy

```bash
npm run lint
npm run typecheck
npm run build
```

Cek manual minimal:

- `http://localhost:3000/`
- `http://localhost:3000/pesan-aki`
- `http://localhost:3000/layanan`
- `http://localhost:3000/lokasi`
- `http://localhost:3000/halaman-ngawur`
- `http://localhost:3000/sitemap.xml`
- `http://localhost:3000/robots.txt`

## Catatan desain

Desain memakai tema **Electric Glass Automotive**: dark graphite, electric cyan, battery amber, glassmorphism, dan tone visual modern yang tetap formal. Golden ratio dipakai sebagai prinsip komposisi, bukan aturan kaku: hero, page intro, CTA, pathway, dan section penting memakai proporsi 1.618/1 saat membantu fokus visual; di mobile layout berubah menjadi single column agar tetap mudah digunakan.

## Catatan performa aset animasi

Animasi hero berada di:

```txt
public/animations/battery-box/
```

Aset utama berupa 60 frame WebP transparan 540×540 dengan total sekitar 500 KB. Frame digambar lewat canvas agar scroll animation halus dan tidak perlu mengganti `<img src>` terus-menerus. File PNG/video master tidak disimpan di production source agar ukuran project tetap ringan.

## Catatan data dan privasi

Katalog aki adalah panduan awal, bukan keputusan final. Kecocokan kendaraan, ukuran aki, posisi kutub, terminal, stok, harga, merek, dan opsi tukar tambah tetap perlu dikonfirmasi via WhatsApp.

Data yang diisi pada ringkasan order hanya disimpan sebagai draft di browser pengguna lewat `localStorage`; tidak ada backend/database untuk menyimpan data pengguna pada versi ini.

## Audit checklist yang sudah relevan untuk fase ini

- Tujuan web jelas: toko aki dan konsultasi/pesan via WhatsApp.
- Target pengguna jelas: pengguna kendaraan area Surabaya-Sidoarjo.
- CTA utama jelas: buka katalog, kirim WhatsApp, lihat lokasi.
- Informasi dipisah ke halaman khusus agar tidak menumpuk di Home.
- Copy menghindari klaim berlebihan seperti “terbaik” atau “nomor satu”.
- Katalog memiliki empty state dan fallback konsultasi admin.
- Struktur SEO dasar, social preview, sitemap, robots, dan 404 sudah tersedia.
- Desain responsif desktop/mobile sudah menjadi bagian utama alur QA.

## Roadmap opsional berikutnya

- Metadata Open Graph khusus per halaman dengan gambar berbeda.
- Analytics ringan untuk klik WhatsApp, pencarian katalog, dan tombol Google Maps.
- Admin/CMS untuk mengelola katalog, stok, dan layanan jika bisnis membutuhkan pembaruan rutin.
- Artikel edukasi ringan tentang aki basah/kering, tanda aki soak, dan cara memilih aki.
