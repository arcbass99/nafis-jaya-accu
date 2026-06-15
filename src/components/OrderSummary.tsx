"use client";

import Image from "next/image";
import { AlertCircle, CheckCircle2, MapPin, Trash2 } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatBatteryLine } from "@/lib/utils";
import type { BatteryItem, OrderContext } from "@/types/battery";

interface OrderSummaryProps {
  selectedItems: BatteryItem[];
  context: OrderContext;
  onContextChange: (context: OrderContext) => void;
  onRemoveItem: (id: string) => void;
  needOptions: readonly string[];
}

export default function OrderSummary({
  selectedItems,
  context,
  onContextChange,
  onRemoveItem,
  needOptions,
}: OrderSummaryProps) {
  const hasContext = Boolean(context.vehicle.trim() || context.need.trim() || context.location.trim());
  const canSendDetailedMessage = selectedItems.length > 0 || hasContext;
  const whatsappUrl = buildWhatsAppUrl(selectedItems, context);

  const updateField = (field: keyof OrderContext, value: string) => {
    onContextChange({ ...context, [field]: value });
  };

  return (
    <aside className="order-summary glass-panel" aria-labelledby="order-summary-title">
      <div className="summary-heading">
        <div>
          <p className="section-kicker">Cek stok via WA</p>
          <h3 id="order-summary-title">Ringkasan WhatsApp</h3>
        </div>
        <span className="summary-count" aria-label={`${selectedItems.length} aki dipilih`}>
          {selectedItems.length}
        </span>
      </div>

      {selectedItems.length === 0 ? (
        <div className="summary-empty">
          <AlertCircle size={20} aria-hidden="true" />
          <p>Belum ada aki yang dipilih. Isi kendaraan atau lokasi dulu jika ingin konsultasi tanpa memilih tipe aki.</p>
        </div>
      ) : (
        <ul className="summary-list" aria-label="Aki yang dipilih">
          {selectedItems.map((item) => (
            <li key={item.id}>
              <span>{formatBatteryLine(item)}</span>
              <button type="button" aria-label={`Hapus ${item.code}`} onClick={() => onRemoveItem(item.id)}>
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="summary-assurance" aria-label="Jaminan alur konsultasi">
        <span>
          <CheckCircle2 size={14} aria-hidden="true" />
          Draft tersimpan di perangkat
        </span>
        <span>
          <CheckCircle2 size={14} aria-hidden="true" />
          Stok dan harga dicek manual
        </span>
      </div>

      <div className="order-form">
        <label htmlFor="vehicle-input">Nama kendaraan</label>
        <input
          id="vehicle-input"
          type="text"
          value={context.vehicle}
          onChange={(event) => updateField("vehicle", event.target.value)}
          placeholder="Contoh: Avanza 2018 / NMAX 2021"
          autoComplete="off"
        />

        <label htmlFor="need-input">Kebutuhan</label>
        <select id="need-input" value={context.need} onChange={(event) => updateField("need", event.target.value)}>
          <option value="">Pilih kebutuhan</option>
          {needOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="location-input">Lokasi / rencana datang</label>
        <input
          id="location-input"
          type="text"
          value={context.location}
          onChange={(event) => updateField("location", event.target.value)}
          placeholder="Contoh: Sidoarjo Kota / datang ke toko"
          autoComplete="off"
        />
      </div>

      <a
        className="btn btn-primary summary-cta"
        href={canSendDetailedMessage ? whatsappUrl : WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src="/whatsapp-icon.svg" alt="" width={22} height={22} aria-hidden="true" />
        Kirim ke WhatsApp
      </a>

      <p className="summary-microcopy">
        <MapPin size={15} aria-hidden="true" />
        Data ini hanya dibawa ke pesan WhatsApp dan tersimpan sebagai draft di perangkatmu, bukan dikirim ke server.
      </p>
    </aside>
  );
}
