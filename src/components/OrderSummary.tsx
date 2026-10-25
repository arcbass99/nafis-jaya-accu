"use client";

import Image from "next/image";
import { useState } from "react";
import { AlertCircle, CheckCircle2, MapPin, ShoppingCart, Trash2, X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn, formatBatteryLine } from "@/lib/utils";
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const hasContext = Boolean(context.vehicle.trim() || context.need.trim() || context.location.trim());
  const canSendDetailedMessage = selectedItems.length > 0 || hasContext;
  const whatsappUrl = buildWhatsAppUrl(selectedItems, context);

  const updateField = (field: keyof OrderContext, value: string) => {
    onContextChange({ ...context, [field]: value });
  };

  return (
    <>
      {/* Floating Action Button on Mobile */}
      <button
        className="mobile-floating-cart"
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label={`Buka ringkasan pesanan (${selectedItems.length} aki dipilih)`}
      >
        <div className="cart-badge-wrap">
          <ShoppingCart size={17} />
          {selectedItems.length > 0 && (
            <span className="cart-badge-count">{selectedItems.length}</span>
          )}
        </div>
        <span className="floating-cart-label">
          {selectedItems.length > 0 ? `${selectedItems.length} Aki Dipilih` : "Ringkasan WA"}
        </span>
      </button>

      {/* Mobile Drawer Backdrop */}
      <div
        className={cn("summary-backdrop", isMobileOpen && "is-visible")}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Order Summary Panel (Desktop sticky / Mobile bottom sheet) */}
      <aside
        className={cn("order-summary glass-panel", isMobileOpen && "is-mobile-open")}
        aria-labelledby="order-summary-title"
      >
        <div className="summary-heading">
          <div>
            <p className="section-kicker">Cek stok via WA</p>
            <h3 id="order-summary-title">Ringkasan WhatsApp</h3>
          </div>
          <div className="summary-heading-actions">
            <span className="summary-count" aria-label={`${selectedItems.length} aki dipilih`}>
              {selectedItems.length}
            </span>
            <button
              className="summary-close-mobile"
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Tutup ringkasan"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {selectedItems.length === 0 ? (
          <div className="summary-empty">
            <AlertCircle size={16} aria-hidden="true" />
            <p>Belum ada aki yang dipilih. Isi kendaraan atau lokasi dulu jika ingin konsultasi tanpa memilih tipe aki.</p>
          </div>
        ) : (
          <ul className="summary-list" aria-label="Aki yang dipilih">
            {selectedItems.map((item) => (
              <li key={item.id}>
                <span>{formatBatteryLine(item)}</span>
                <button type="button" aria-label={`Hapus ${item.code}`} onClick={() => onRemoveItem(item.id)}>
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="summary-assurance" aria-label="Jaminan alur konsultasi">
          <span>
            <CheckCircle2 size={13} aria-hidden="true" />
            Draft tersimpan di perangkat
          </span>
          <span>
            <CheckCircle2 size={13} aria-hidden="true" />
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
          <Image src="/whatsapp-icon.svg" alt="" width={18} height={18} aria-hidden="true" />
          Kirim ke WhatsApp
        </a>

        <p className="summary-microcopy">
          <MapPin size={13} aria-hidden="true" />
          Data ini hanya dibawa ke pesan WhatsApp dan tersimpan sebagai draft di perangkatmu.
        </p>
      </aside>
    </>
  );
}
