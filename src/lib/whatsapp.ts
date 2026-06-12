import { BUSINESS_NAME, WHATSAPP_NUMBER } from "@/lib/constants";
import { formatBatteryLine } from "@/lib/utils";
import type { BatteryItem, OrderContext } from "@/types/battery";

export function buildWhatsAppUrl(items: BatteryItem[], context: OrderContext) {
  const selectedItems = items.length
    ? items.map((item, index) => `${index + 1}. ${formatBatteryLine(item)}`).join("\n")
    : "Belum memilih tipe aki, ingin konsultasi dulu.";

  const vehicle = context.vehicle.trim() || "Belum diisi";
  const need = context.need.trim() || "Belum diisi";
  const location = context.location.trim() || "Belum diisi";

  const message = [
    `Halo Admin *${BUSINESS_NAME}*.`,
    "Saya mau konsultasi / pesan aki.",
    "",
    `*Aki pilihan:*\n${selectedItems}`,
    "",
    `*Kendaraan:* ${vehicle}`,
    `*Kebutuhan:* ${need}`,
    `*Lokasi:* ${location}`,
    "",
    "Mohon dibantu cek stok, harga, dan opsi terbaiknya ya. Terima kasih.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
