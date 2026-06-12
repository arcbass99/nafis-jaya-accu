import { BatteryCharging } from "lucide-react";
import {
  BUSINESS_NAME,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
  navItems,
  SERVICE_AREA,
  STORE_HOURS,
  WHATSAPP_URL,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid phi-grid">
        <div className="footer-brand">
          <div className="footer-icon" aria-hidden="true">
            <BatteryCharging size={24} />
          </div>
          <h2>{BUSINESS_NAME}</h2>
          <p>
            Aki mobil, aki motor, setrum aki, tukar tambah, dan perlengkapan aki untuk area {SERVICE_AREA}.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h3>Navigasi</h3>
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </div>
          <div>
            <h3>Kontak Cepat</h3>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              WhatsApp Admin
            </a>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
              Buka Google Maps
            </a>
            <span>Buka {STORE_HOURS}</span>
            <span>Harga & stok via WhatsApp</span>
          </div>
        </div>
      </div>

      <div className="creator-credit">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Crafted by Nafis • @nfs_ky07
        </a>
      </div>
    </footer>
  );
}
