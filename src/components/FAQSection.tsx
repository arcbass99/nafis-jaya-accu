import { CircleHelp } from "lucide-react";
import { faqs } from "@/data/faq";

export default function FAQSection() {
  return (
    <section id="faq" className="section faq-section" aria-labelledby="faq-title">
      <div className="section-heading phi-heading">
        <div>
          <p className="section-kicker">
            <CircleHelp size={16} aria-hidden="true" />
            Pertanyaan umum
          </p>
          <h2 id="faq-title">FAQ Nafis Jaya Accu</h2>
        </div>
        <p>
          Jawaban singkat untuk pertanyaan yang paling sering muncul sebelum membeli, cek aki, setrum, tukar tambah, atau datang ke toko.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details className="faq-item glass-card" key={faq.question} open={index === 0}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
