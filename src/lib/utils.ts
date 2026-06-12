import { clsx, type ClassValue } from "clsx";
import type { BatteryItem } from "@/types/battery";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function formatBatteryLine(item: BatteryItem) {
  const capacity = item.capacity ? ` • ${item.capacity}` : "";
  return `${item.categoryLabel} - ${item.code}${capacity} (${item.typeLabel})`;
}
