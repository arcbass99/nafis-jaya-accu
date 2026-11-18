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

export type BatteryVehicleFilter = "all" | "car" | "motorcycle" | "vrla";

export type BatteryTechFilter = "all" | "mf" | "dry-charge";

export type BatterySortOption =
  | "relevance"
  | "popular"
  | "capacity-asc"
  | "capacity-desc"
  | "code-asc";

export interface BatterySearchFilters {
  vehicle: BatteryVehicleFilter;
  tech: BatteryTechFilter;
  onlyPopular: boolean;
}

export interface OrderContext {
  vehicle: string;
  need: string;
  location: string;
}
