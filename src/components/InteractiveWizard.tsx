"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Car, Bike, PackagePlus, ArrowRight, Home,
  Info, Plus, Minus, ShoppingCart, Zap, ChevronRight,
  Droplet, Droplets, Cable, CircleDot, BatteryCharging,
  Clock, CalendarCheck, Repeat2, SparklesIcon, Skull, FlaskConical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WHATSAPP_NUMBER, STORE_HOURS } from "@/lib/constants";
import "./InteractiveWizard.css";

const GREETINGS = [
  "Halo! Ada yang bisa kami bantu untuk kendaraanmu hari ini?",
  "Aki ngadat? Jangan panik, mau pesan yang mana?",
  "Selamat datang! Kendaraanmu butuh energi baru?",
  "Hai! Perlu ganti aki atau sekadar cek kondisi?",
  "Lagi cari aki andalan? Kami siap bantu.",
  "Perjalanan terhenti karena aki? Biar kami yang urus.",
  "Halo, bosku! Butuh aki mobil atau motor hari ini?",
  "Aki tekor bikin repot? Langsung pilih solusinya di sini.",
  "Selamat datang di Nafis Jaya Accu. Apa keperluanmu hari ini?",
  "Hai! Jangan biarkan aki lemah mengganggu harimu.",
  "Butuh setrum aki atau ganti baru? Tinggal klik aja.",
  "Halo! Cari aki berkualitas dengan harga pas?",
  "Mogok di jalan? Kami siap antar aki ke tempatmu.",
  "Hai! Mari kembalikan performa kendaraanmu.",
  "Aki sudah waktunya pensiun? Yuk pilih gantinya.",
  "Selamat datang! Konsultasikan masalah akimu di sini.",
  "Halo, butuh bantuan cepat untuk urusan aki?",
  "Jangan biarkan kendaraanmu loyo. Butuh aki baru?",
  "Hai! Cari solusi cerdas untuk kelistrikan kendaraanmu?",
  "Senang melihatmu! Layanan apa yang kamu cari hari ini?",
];

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="wz-mini-map-loading">Memuat peta...</div>,
});

const STORE_ITEMS = [
  { id: "airAki" as const, label: "Air Aki", desc: "Air murni untuk tambah / top-up", icon: Droplet },
  { id: "airZuur" as const, label: "Air Zuur", desc: "Asam sulfat untuk pengisian baru", icon: Skull, danger: true },
  { id: "clampAki" as const, label: "Clamp Aki", desc: "Kepala / terminal", icon: CircleDot },
  { id: "kabelAki" as const, label: "Kabel Aki", desc: "Jumper / penghubung", icon: Cable },
];

type MainCategory = "pesan" | "setrum" | "perlengkapan" | null;
type VehicleType = "mobil" | "motor" | null;
type BatteryType = "kering" | "basah" | null;
type TradeIn = "ya" | "tidak" | null;

export default function InteractiveWizard() {
  const [greeting, setGreeting] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [mainCategory, setMainCategory] = useState<MainCategory>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType>(null);
  const [batteryType, setBatteryType] = useState<BatteryType>(null);
  const [tradeIn, setTradeIn] = useState<TradeIn>(null);
  const [vehicleName, setVehicleName] = useState("");

  const [dropTime, setDropTime] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [cart, setCart] = useState({
    airAki: 0,
    airZuur: 0,
    clampAki: 0,
    kabelAki: 0,
  });

  const flowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (mainCategory && flowRef.current) {
      setTimeout(() => {
        flowRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }, [mainCategory]);

  const handleCartChange = (item: keyof typeof cart, delta: number) => {
    setCart((prev) => ({
      ...prev,
      [item]: Math.max(0, prev[item] + delta),
    }));
  };

  const cartTotal = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const getWhatsappUrl = () => {
    let message = "";
    if (mainCategory === "pesan") {
      const vType = vehicleType === "mobil" ? "Mobil" : "Motor";
      const bType = batteryType === "kering" ? "Kering (MF)" : "Basah";
      const tIn = tradeIn === "ya" ? "Ya, tukar tambah" : "Tidak";
      const vName = vehicleName || "-";
      message = `Halo min, saya mau pesan aki *${vType}*.\n\n*Detail:*\n• Tipe: ${bType}\n• Tukar Tambah: ${tIn}\n• Kendaraan: ${vName}\n\nMohon info stok dan harganya ya 🙏`;
    } else if (mainCategory === "setrum") {
      const vType = vehicleType === "mobil" ? "Mobil" : "Motor";
      message = `Halo min, saya mau booking setrum aki *${vType}*.\n\n*Jadwal:*\n• Datang: ${dropTime || "-"}\n• Ambil: ${pickupTime || "-"}\n\nApakah bisa? 🙏`;
    } else if (mainCategory === "perlengkapan") {
      const items = [];
      if (cart.airAki > 0) items.push(`• ${cart.airAki}x Air Aki`);
      if (cart.airZuur > 0) items.push(`• ${cart.airZuur}x Air Zuur`);
      if (cart.clampAki > 0) items.push(`• ${cart.clampAki}x Clamp Aki`);
      if (cart.kabelAki > 0) items.push(`• ${cart.kabelAki}x Kabel Aki`);
      message = `Halo min, saya mau beli perlengkapan:\n\n${items.join("\n")}\n\nMohon info total harganya ya 🙏`;
    }
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const isCartEmpty = cartTotal === 0;
  const canSubmitPesan = vehicleType && batteryType && tradeIn && vehicleName.trim() !== "";
  const canSubmitSetrum = vehicleType && dropTime.trim() !== "" && pickupTime.trim() !== "";

  const stepNumber = (n: number) => (
    <span className="wz-step-number">{n}</span>
  );

  return (
    <div className="wz-page">
      {/* Ambient */}
      <div className="wz-ambient" aria-hidden="true">
        <div className="wz-orb wz-orb--cyan" />
        <div className="wz-orb wz-orb--amber" />
        <div className="wz-grid-pattern" />
      </div>

      <div className={cn("wz-shell", isLoaded && "is-ready")}>
        {/* ===== TOP BAR ===== */}
        <header className="wz-topbar">
          <div className="wz-logo">
            <BatteryCharging size={18} strokeWidth={2.5} />
            <span>Nafis Jaya Accu</span>
          </div>
          <Link href="/home" className="wz-home-link">
            <Home size={14} />
            <span>Masuk ke Halaman Utama</span>
          </Link>
          <p className="wz-hours">
            <Clock size={13} />
            Buka {STORE_HOURS}
          </p>
        </header>

        {/* ===== TWO COLUMN BODY ===== */}
        <div className="wz-body">
          {/* ---- LEFT: Greeting + Category Picker ---- */}
          <aside className="wz-left">
            <div className="wz-left-inner">
              <h1 className="wz-greeting">
                {greeting || "Selamat datang di Nafis Jaya Accu."}
              </h1>

              <div className="wz-section">
                <p className="wz-label">Pilih kebutuhan Anda</p>
                <div className="wz-categories">
                  {([
                    { id: "pesan" as const, label: "Pesan Aki", sub: "Beli baru / tukar tambah", icon: ShoppingCart, accent: "cyan" },
                    { id: "setrum" as const, label: "Setrum Aki", sub: "Booking cas / charge", icon: Zap, accent: "amber" },
                    { id: "perlengkapan" as const, label: "Perlengkapan", sub: "Air aki, kabel, clamp", icon: PackagePlus, accent: "green" },
                  ]).map((cat) => {
                    const Icon = cat.icon;
                    const active = mainCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setMainCategory(cat.id)}
                        className={cn("wz-cat-btn", `accent-${cat.accent}`, active && "is-active")}
                      >
                        <span className="wz-cat-icon">
                          <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                        </span>
                        <span className="wz-cat-text">
                          <strong>{cat.label}</strong>
                          <small>{cat.sub}</small>
                        </span>
                        <ChevronRight size={16} className="wz-cat-arrow" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mini Map */}
              <div className="wz-mini-map-wrap">
                <p className="wz-label">Lokasi Toko</p>
                <div className="wz-mini-map-container">
                  <LeafletMap />
                </div>
                <a href="https://maps.app.goo.gl/3K2zPz48u1X2zZ1u6" target="_blank" rel="noreferrer" className="wz-mini-map-btn">
                  Buka di Google Maps <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </aside>

          {/* ---- RIGHT: Flow Form ---- */}
          <section className={cn("wz-right", mainCategory && "has-flow")}>
            {!mainCategory && (
              <div className="wz-empty-state">
                <div className="wz-empty-icon" aria-hidden="true">
                  <BatteryCharging size={32} strokeWidth={1.2} />
                </div>
                <p>Pilih salah satu kebutuhan di sebelah kiri untuk memulai.</p>
              </div>
            )}

            {/* ========== PESAN AKI ========== */}
            {mainCategory === "pesan" && (
              <div className="wz-flow" ref={flowRef} key="pesan">
                <div className="wz-flow-header accent-cyan">
                  <ShoppingCart size={16} />
                  <span>Pesan Aki</span>
                </div>

                <div className="wz-section">
                  <p className="wz-label">{stepNumber(1)} Untuk kendaraan apa?</p>
                  <div className="wz-pair">
                    <button onClick={() => setVehicleType("mobil")} className={cn("wz-choice", vehicleType === "mobil" && "is-on")}>
                      <Car size={20} strokeWidth={1.6} /> <span>Mobil</span>
                    </button>
                    <button onClick={() => setVehicleType("motor")} className={cn("wz-choice", vehicleType === "motor" && "is-on")}>
                      <Bike size={20} strokeWidth={1.6} /> <span>Motor</span>
                    </button>
                  </div>
                </div>

                {vehicleType && (
                  <div className="wz-section wz-reveal">
                    <p className="wz-label">{stepNumber(2)} Pilih tipe aki</p>
                    <div className="wz-pair">
                      <button onClick={() => setBatteryType("kering")} className={cn("wz-choice", batteryType === "kering" && "is-on")}>
                        <span>🔋</span> <span>Kering</span>
                      </button>
                      <button onClick={() => setBatteryType("basah")} className={cn("wz-choice", batteryType === "basah" && "is-on")}>
                        <span>🪫</span> <span>Basah</span>
                      </button>
                    </div>
                    {batteryType && (
                      <div className={cn("wz-info-card wz-reveal", batteryType === "kering" ? "accent-cyan" : "accent-amber")}>
                        <Info size={15} />
                        <div>
                          <strong>{batteryType === "kering" ? "Aki Kering (Maintenance Free)" : "Aki Basah (Konvensional)"}</strong>
                          <p>{batteryType === "kering"
                            ? "Bebas perawatan, tidak perlu tambah air aki. Lebih praktis dan tahan lama, cocok untuk pemakaian sehari-hari."
                            : "Perlu cek & isi air aki berkala. Harga lebih terjangkau dan tetap andal dengan perawatan rutin yang tepat."}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {vehicleType && batteryType && (
                  <div className="wz-section wz-reveal">
                    <p className="wz-label">{stepNumber(3)} Tukar tambah aki lama?</p>
                    <div className="wz-pair">
                      <button onClick={() => setTradeIn("ya")} className={cn("wz-choice", tradeIn === "ya" && "is-on")}>
                        <Repeat2 size={18} strokeWidth={1.6} /> <span>Ya, Tukar Tambah</span>
                      </button>
                      <button onClick={() => setTradeIn("tidak")} className={cn("wz-choice", tradeIn === "tidak" && "is-on")}>
                        <SparklesIcon size={18} strokeWidth={1.6} /> <span>Beli Baru</span>
                      </button>
                    </div>
                  </div>
                )}

                {vehicleType && batteryType && tradeIn && (
                  <div className="wz-section wz-reveal">
                    <p className="wz-label">{stepNumber(4)} Kendaraan Anda</p>
                    <input type="text" className="wz-input" placeholder="Contoh: Avanza 2018 / Honda Beat 2020" value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} />
                  </div>
                )}

                <div className={cn("wz-submit-area", canSubmitPesan && "is-ready")}>
                  <a href={canSubmitPesan ? getWhatsappUrl() : undefined} target="_blank" rel="noreferrer" className="wz-submit-btn">
                    <Image src="/whatsapp-icon.svg" alt="" width={20} height={20} aria-hidden="true" />
                    Kirim Pesanan via WhatsApp
                    <ArrowRight size={16} />
                  </a>
                </div>

                <div className="wz-alt">
                  <span className="wz-alt-line" />
                  <span className="wz-alt-text">atau</span>
                  <span className="wz-alt-line" />
                </div>
                <Link href="/home/pesan-aki" className="wz-alt-link">
                  Lihat Katalog Aki Lengkap <ChevronRight size={15} />
                </Link>
              </div>
            )}

            {/* ========== SETRUM AKI ========== */}
            {mainCategory === "setrum" && (
              <div className="wz-flow" ref={flowRef} key="setrum">
                <div className="wz-flow-header accent-amber">
                  <Zap size={16} />
                  <span>Setrum / Cas Aki</span>
                </div>

                <div className="wz-section">
                  <p className="wz-label">{stepNumber(1)} Aki kendaraan apa?</p>
                  <div className="wz-pair">
                    <button onClick={() => setVehicleType("mobil")} className={cn("wz-choice", vehicleType === "mobil" && "is-on")}>
                      <Car size={20} strokeWidth={1.6} /> <span>Mobil</span>
                    </button>
                    <button onClick={() => setVehicleType("motor")} className={cn("wz-choice", vehicleType === "motor" && "is-on")}>
                      <Bike size={20} strokeWidth={1.6} /> <span>Motor</span>
                    </button>
                  </div>
                </div>

                {vehicleType && (
                  <>
                    <div className="wz-section wz-reveal">
                      <p className="wz-label">{stepNumber(2)} Rencana datang jam berapa?</p>
                      <div className="wz-input-wrap">
                        <Clock size={16} className="wz-input-icon" />
                        <input type="text" className="wz-input has-icon" placeholder="Contoh: Jam 10 pagi, Nanti sore" value={dropTime} onChange={(e) => setDropTime(e.target.value)} />
                      </div>
                    </div>
                    <div className="wz-section wz-reveal">
                      <p className="wz-label">{stepNumber(3)} Rencana diambil kapan?</p>
                      <div className="wz-input-wrap">
                        <CalendarCheck size={16} className="wz-input-icon" />
                        <input type="text" className="wz-input has-icon" placeholder="Contoh: Besok pagi, Nanti malam" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                <div className={cn("wz-submit-area", canSubmitSetrum && "is-ready")}>
                  <a href={canSubmitSetrum ? getWhatsappUrl() : undefined} target="_blank" rel="noreferrer" className="wz-submit-btn">
                    <Image src="/whatsapp-icon.svg" alt="" width={20} height={20} aria-hidden="true" />
                    Booking Setrum via WhatsApp
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            )}

            {/* ========== PERLENGKAPAN ========== */}
            {mainCategory === "perlengkapan" && (
              <div className="wz-flow" ref={flowRef} key="perlengkapan">
                <div className="wz-flow-header accent-green">
                  <PackagePlus size={16} />
                  <span>Perlengkapan Aki</span>
                </div>

                <div className="wz-section">
                  <p className="wz-label">Pilih & atur jumlah yang dibutuhkan</p>
                  <div className="wz-store">
                    {STORE_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const qty = cart[item.id];
                      return (
                        <div className={cn("wz-store-row", qty > 0 && "has-qty", item.danger && "is-danger")} key={item.id}>
                          <div className="wz-store-info">
                            <span className="wz-store-icon"><Icon size={18} strokeWidth={1.5} /></span>
                            <div>
                              <strong>{item.label}</strong>
                              <small>{item.desc}</small>
                            </div>
                          </div>
                          <div className="wz-qty">
                            <button onClick={() => handleCartChange(item.id, -1)} className="wz-qty-btn" disabled={qty === 0} aria-label={`Kurangi ${item.label}`}>
                              <Minus size={14} />
                            </button>
                            <span className="wz-qty-num">{qty}</span>
                            <button onClick={() => handleCartChange(item.id, 1)} className="wz-qty-btn" aria-label={`Tambah ${item.label}`}>
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!isCartEmpty && (
                    <div className="wz-cart-summary wz-reveal">
                      <ShoppingCart size={14} />
                      <span>{cartTotal} item dipilih</span>
                    </div>
                  )}
                </div>

                <div className={cn("wz-submit-area", !isCartEmpty && "is-ready")}>
                  <a href={!isCartEmpty ? getWhatsappUrl() : undefined} target="_blank" rel="noreferrer" className="wz-submit-btn">
                    <Image src="/whatsapp-icon.svg" alt="" width={20} height={20} aria-hidden="true" />
                    Beli Perlengkapan via WhatsApp
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
