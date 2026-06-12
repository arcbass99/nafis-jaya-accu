export type BatteryVehicleType = "car" | "motorcycle" | "vrla";

export type BatteryTechnology =
  | "dry-charge"
  | "maintenance-free"
  | "motorcycle-mf"
  | "vrla";

export interface BatteryItem {
  id: string;
  code: string;
  capacity: string;
  vehicleType: BatteryVehicleType;
  technology: BatteryTechnology;
  categoryLabel: string;
  typeLabel: string;
  commonVehicles: string[];
  keywords: string[];
  note?: string;
  isPopular?: boolean;
}

export type BatteryFilter =
  | "all"
  | "car"
  | "motorcycle"
  | "dry-charge"
  | "maintenance-free"
  | "vrla";

export interface OrderContext {
  vehicle: string;
  need: string;
  location: string;
}
