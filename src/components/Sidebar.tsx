"use client";

import Image from "next/image";
import { BatteryCharging, Clock3, Menu, MapPin, MessageCircle, Search, Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  navItems,
  SERVICE_AREA,
  STORE_HOURS,
  WHATSAPP_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { id: "cari-aki", label: "Cari", icon: Search },
  { id: "layanan", label: "Layanan", icon: Wrench },
  { id: "lokasi", label: "Lokasi", icon: MapPin },
  { id: "faq", label: "FAQ", icon: MessageCircle },
] as const;

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("beranda");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    let initialFrame = 0;

    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
      const anchor = window.scrollY + Math.min(window.innerHeight * 0.38, 260);
      let nextActive: string = navItems[0]?.id ?? "beranda";

      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (!section) continue;

        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= anchor) nextActive = item.id;
      }

      if (maxScroll > 0 && maxScroll - window.scrollY < 24) {
        nextActive = navItems[navItems.length - 1]?.id ?? nextActive;
      }

      setScrollProgress(nextProgress);
      setActiveSection(nextActive);
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollState);
    };

    initialFrame = window.requestAnimationFrame(updateScrollState);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="mobile-topbar" aria-label="Navigasi mobile">
        <button
          className="mobile-menu-button"
          type="button"
          aria-label="Buka navigasi"
          aria-controls="site-sidebar"
          aria-expanded={isOpen ? "true" : "false"}
          onClick={() => setIsOpen(true)}
        >
          <Menu aria-hidden="true" size={21} />
        </button>

        <a className="mobile-topbar-brand" href="#beranda" onClick={closeMenu}>
          <span>{BUSINESS_NAME}</span>
          <small>Buka {STORE_HOURS}</small>
        </a>

        <a className="mobile-topbar-wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp Nafis Jaya Accu">
          <Image src="/whatsapp-icon.svg" alt="" width={22} height={22} aria-hidden="true" />
        </a>
      </header>

      <div
        className={cn("sidebar-backdrop", isOpen && "is-visible")}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <aside id="site-sidebar" className={cn("site-sidebar", isOpen && "is-open")} aria-label="Navigasi utama">
        <div className="sidebar-inner">
          <div className="sidebar-topline">
            <div className="brand-mark" aria-hidden="true">
              <BatteryCharging size={24} />
            </div>
            <button className="sidebar-close" type="button" aria-label="Tutup navigasi" onClick={closeMenu}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <a className="sidebar-brand" href="#beranda" onClick={closeMenu}>
            <span>{BUSINESS_NAME}</span>
            <small>{BUSINESS_TAGLINE}</small>
          </a>

          <progress
            className="battery-progress"
            max={100}
            value={Math.round(scrollProgress * 100)}
            aria-label={`Progress baca halaman ${Math.round(scrollProgress * 100)} persen`}
          />

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <a
                key={item.id}
                className={cn("sidebar-link", activeSection === item.id && "is-active")}
                href={`#${item.id}`}
                onClick={closeMenu}
              >
                <span className="sidebar-dot" aria-hidden="true" />
                {item.label}
              </a>
            ))}
          </nav>

          <div className="sidebar-spacer" />

          <a className="sidebar-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Image src="/whatsapp-icon.svg" alt="" width={24} height={24} aria-hidden="true" />
            <span>
              Chat WhatsApp
              <small>Cek stok & harga</small>
            </span>
          </a>

          <div className="sidebar-status" aria-label="Info toko">
            <p>
              <Clock3 size={16} aria-hidden="true" />
              Buka {STORE_HOURS}
            </p>
            <p>
              <MapPin size={16} aria-hidden="true" />
              {SERVICE_AREA}
            </p>
          </div>
        </div>
      </aside>

      <nav className="mobile-bottom-nav" aria-label="Navigasi cepat mobile">
        {mobileNavItems.map(({ id, label, icon: Icon }) => (
          <a key={id} className={cn(activeSection === id && "is-active")} href={`#${id}`}>
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
