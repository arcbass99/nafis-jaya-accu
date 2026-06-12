import type { BatteryItem } from "@/types/battery";

interface CarBatteryBaseItem {
  code: string;
  capacity: string;
  commonVehicles: string[];
  keywords: string[];
  isPopular?: boolean;
}

const carBatteryBase: CarBatteryBaseItem[] = [
  {
    code: "NS40/L",
    capacity: "32 Ah",
    commonVehicles: ["Avanza", "Xenia", "Rush", "Terios lama", "Carry"],
    keywords: ["toyota", "daihatsu", "suzuki", "aki avanza", "aki xenia", "aki carry"],
    isPopular: true,
  },
  {
    code: "NS40Z/ZL",
    capacity: "35 Ah",
    commonVehicles: ["Brio", "Mobilio", "Agya", "Ayla", "Sirion", "Ertiga"],
    keywords: ["honda", "toyota", "daihatsu", "suzuki", "aki brio", "aki agya", "aki ertiga"],
    isPopular: true,
  },
  {
    code: "NS60/L/LS",
    capacity: "45 Ah",
    commonVehicles: ["Yaris", "Vios", "HR-V", "CR-V", "Innova bensin"],
    keywords: ["toyota", "honda", "aki innova", "aki hrv", "aki crv"],
    isPopular: true,
  },
  {
    code: "N50",
    capacity: "50 Ah",
    commonVehicles: ["Kijang Kapsul", "Kijang Grand", "Peugeot", "mobil lawas"],
    keywords: ["kijang", "peugeot", "aki mobil lawas"],
  },
  {
    code: "N50Z/ZL",
    capacity: "60 Ah",
    commonVehicles: ["Panther lawas", "Colt Diesel", "Fuso ringan"],
    keywords: ["isuzu", "mitsubishi", "panther", "colt diesel", "fuso"],
  },
  {
    code: "NS70/L",
    capacity: "65 Ah",
    commonVehicles: ["Panther", "Kijang Diesel", "Everest", "D-Max"],
    keywords: ["diesel", "isuzu", "ford", "dmax", "kijang diesel"],
  },
  {
    code: "N70",
    capacity: "70 Ah",
    commonVehicles: ["L300 Diesel", "Kuda Diesel", "Truk Elf"],
    keywords: ["l300", "mitsubishi", "kuda", "elf", "truk"],
  },
  {
    code: "N70Z/ZL",
    capacity: "80 Ah",
    commonVehicles: ["Pajero Sport", "Fortuner lama", "Triton"],
    keywords: ["pajero", "fortuner", "triton", "suv diesel"],
    isPopular: true,
  },
  {
    code: "NT60-S4/L",
    capacity: "45 Ah",
    commonVehicles: ["Swift", "Splash", "SX4", "Baleno"],
    keywords: ["suzuki", "swift", "splash", "sx4", "baleno"],
  },
  {
    code: "NX100-6/L",
    capacity: "55 Ah",
    commonVehicles: ["X-Trail", "Teana", "Juke", "Civic"],
    keywords: ["nissan", "honda", "xtrail", "juke", "civic"],
  },
  {
    code: "NX110-5/L",
    capacity: "80 Ah",
    commonVehicles: ["Innova Diesel lawas", "Santa Fe", "Carnival"],
    keywords: ["innova diesel", "hyundai", "kia", "santa fe", "carnival"],
  },
  {
    code: "NX120-7/L",
    capacity: "100 Ah",
    commonVehicles: ["Land Cruiser", "Patrol", "truk ringan komersial"],
    keywords: ["land cruiser", "patrol", "truk ringan", "komersial"],
  },
  {
    code: "55D23L",
    capacity: "60 Ah",
    commonVehicles: ["Innova Reborn bensin", "X-Trail", "CX-5", "Alphard"],
    keywords: ["innova reborn", "mazda", "cx5", "alphard"],
    isPopular: true,
  },
  {
    code: "DIN 58024/LN3",
    capacity: "80 Ah",
    commonVehicles: ["Innova Reborn diesel", "Fortuner VRZ", "BMW", "Mercedes-Benz"],
    keywords: ["din", "ln3", "innova diesel", "fortuner vrz", "bmw", "mercedes"],
    isPopular: true,
  },
  {
    code: "N100",
    capacity: "100 Ah",
    commonVehicles: ["Truk besar", "bus", "genset", "alat berat"],
    keywords: ["truk", "bus", "genset", "alat berat"],
  },
];

const motorcycleBatteries: BatteryItem[] = [
  {
    id: "motor-gtz5",
    code: "GTZ5",
    capacity: "Motor / MF",
    vehicleType: "motorcycle",
    technology: "motorcycle-mf",
    categoryLabel: "Aki Motor",
    typeLabel: "MF / Kering",
    commonVehicles: ["Beat", "Vario 110", "Supra X 125", "Scoopy", "Mio Soul", "Jupiter Z1"],
    keywords: ["honda", "yamaha", "beat", "vario", "scoopy", "mio", "jupiter"],
    isPopular: true,
  },
  {
    id: "motor-gtz7s",
    code: "GTZ7S",
    capacity: "Motor / MF",
    vehicleType: "motorcycle",
    technology: "motorcycle-mf",
    categoryLabel: "Aki Motor",
    typeLabel: "MF / Kering",
    commonVehicles: ["Vario 125/150", "PCX", "Satria FU", "CBR150R", "GSX 150"],
    keywords: ["vario 125", "vario 150", "pcx", "satria", "cbr", "gsx"],
    isPopular: true,
  },
  {
    id: "motor-gt6a",
    code: "GT6A",
    capacity: "Motor / MF",
    vehicleType: "motorcycle",
    technology: "motorcycle-mf",
    categoryLabel: "Aki Motor",
    typeLabel: "MF / Kering",
    commonVehicles: ["MegaPro lawas", "Tiger", "Mio Sporty", "Jupiter Z lama"],
    keywords: ["megapro", "tiger", "mio sporty", "jupiter lama"],
  },
  {
    id: "motor-gtz7v",
    code: "GTZ7V",
    capacity: "Motor / MF",
    vehicleType: "motorcycle",
    technology: "motorcycle-mf",
    categoryLabel: "Aki Motor",
    typeLabel: "MF / Kering",
    commonVehicles: ["NMAX generasi lama", "Aerox 155", "Lexi"],
    keywords: ["nmax", "aerox", "lexi", "yamaha"],
    isPopular: true,
  },
  {
    id: "motor-12n10",
    code: "12N10",
    capacity: "Motor / Basah",
    vehicleType: "motorcycle",
    technology: "dry-charge",
    categoryLabel: "Aki Motor",
    typeLabel: "Basah",
    commonVehicles: ["Vespa lawas", "Byson", "motor roda tiga Tossa/Viar"],
    keywords: ["vespa", "byson", "tossa", "viar", "motor roda tiga"],
  },
  {
    id: "vrla-1212",
    code: "VRLA 1212",
    capacity: "12V 12Ah",
    vehicleType: "vrla",
    technology: "vrla",
    categoryLabel: "VRLA / UPS",
    typeLabel: "VRLA",
    commonVehicles: ["Sepeda listrik Selis", "motor listrik ringan", "UPS"],
    keywords: ["selis", "sepeda listrik", "motor listrik", "ups", "vrla"],
    isPopular: true,
  },
];

const carDryCharge: BatteryItem[] = carBatteryBase.map((item) => ({
  id: `car-dry-${item.code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  code: item.code,
  capacity: item.capacity,
  vehicleType: "car" as const,
  technology: "dry-charge" as const,
  categoryLabel: "Aki Mobil",
  typeLabel: "Dry Charge / Basah",
  commonVehicles: [...item.commonVehicles],
  keywords: [...item.keywords, "aki basah", "dry charge"],
  isPopular: item.isPopular,
  note: "Panduan awal. Konfirmasi ulang ukuran, kutub, dan stok ke admin.",
}));

const carMaintenanceFree: BatteryItem[] = carBatteryBase.map((item) => ({
  id: `car-mf-${item.code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  code: item.code,
  capacity: item.capacity,
  vehicleType: "car" as const,
  technology: "maintenance-free" as const,
  categoryLabel: "Aki Mobil",
  typeLabel: "MF / Kering",
  commonVehicles: [...item.commonVehicles],
  keywords: [...item.keywords, "aki kering", "mf", "maintenance free"],
  isPopular: item.isPopular,
  note: "Panduan awal. Konfirmasi ulang ukuran, kutub, dan stok ke admin.",
}));

export const batteries: BatteryItem[] = [
  ...carMaintenanceFree,
  ...carDryCharge,
  ...motorcycleBatteries,
];

export const batteryFilters = [
  { id: "all", label: "Semua" },
  { id: "car", label: "Mobil" },
  { id: "motorcycle", label: "Motor" },
  { id: "maintenance-free", label: "MF / Kering" },
  { id: "dry-charge", label: "Basah" },
  { id: "vrla", label: "VRLA / UPS" },
] as const;
