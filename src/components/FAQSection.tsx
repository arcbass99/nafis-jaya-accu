"use client";

import { CircleHelp } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/data/faq";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div className={`faq-item glass-card ${isOpen ? "is-open" : ""}`} key={faq.question}>
              <button 
                className="faq-summary"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                {faq.question}
              </button>
              <div className="faq-content-wrapper" style={{ 
                display: "grid", 
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 300ms ease"
              }}>
                <div style={{ overflow: "hidden" }}>
                  <p className="faq-content">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
