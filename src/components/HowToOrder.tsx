import { CheckCircle2, MessageSquareText, SearchCheck, Store, WalletCards } from "lucide-react";

const steps = [
  {
    title: "Cari atau pilih tipe aki",
    description: "Gunakan fitur pencarian berdasarkan kendaraan, kode aki, kapasitas, atau kategori.",
    icon: SearchCheck,
  },
  {
    title: "Kirim detail ke WhatsApp",
    description: "Sebutkan kendaraan, kebutuhan, dan lokasi agar admin lebih cepat memberi arahan.",
    icon: MessageSquareText,
  },
  {
    title: "Admin cek stok dan harga",
    description: "Harga tidak ditampilkan agar info tetap sesuai stok terbaru, merek, dan kebutuhan pemasangan.",
    icon: WalletCards,
  },
  {
    title: "Datang atau konfirmasi lokasi",
    description: "Cek dan pasang tersedia di toko. Untuk layanan lokasi, konfirmasi dulu sesuai area dan kondisi.",
    icon: Store,
  },
];

export default function HowToOrder() {
  return (
    <section className="section how-section" aria-labelledby="how-title">
      <div className="section-heading phi-heading">
        <div>
          <p className="section-kicker">
            <CheckCircle2 size={16} aria-hidden="true" />
            Alur cepat
          </p>
          <h2 id="how-title">Cara Pesan Singkat</h2>
        </div>
        <p>Alurnya dibuat singkat agar kamu tidak perlu menebak tipe aki, harga, stok, atau kebutuhan pasang.</p>
      </div>

      <div className="steps-grid">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article className="step-card" key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <Icon size={24} aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
