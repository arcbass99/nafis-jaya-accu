"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BatteryCharging, Clock3, Home, Menu, MapPin, Search, Wrench, X, Sparkles } from "lucide-react";
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
  { href: "/home", label: "Home", icon: Home },
  { href: "/home/pesan-aki", label: "Pesan", icon: Search },
  { href: "/home/layanan", label: "Layanan", icon: Wrench },
  { href: "/home/lokasi", label: "Lokasi", icon: MapPin },
] as const;

const isActivePath = (pathname: string, href: string) => {
  if (href === "/home") return pathname === "/home";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    let initialFrame = 0;

    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;

      setScrollProgress(nextProgress);
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
      <header className="mobile-topbar" aria-label="Navigasi utama">
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={isOpen ? "Tutup navigasi" : "Buka navigasi"}
          aria-controls="site-sidebar"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
        </button>

        <Link className="mobile-topbar-brand" href="/home" onClick={closeMenu}>
          <span>{BUSINESS_NAME}</span>
          <small>Buka {STORE_HOURS}</small>
        </Link>

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

          <Link className="sidebar-brand" href="/home" onClick={closeMenu}>
            <span>{BUSINESS_NAME}</span>
            <small>{BUSINESS_TAGLINE}</small>
          </Link>

          <progress
            className="battery-progress"
            max={100}
            value={Math.round(scrollProgress * 100)}
            aria-label={`Progress baca halaman ${Math.round(scrollProgress * 100)} persen`}
          />

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={cn("sidebar-link", isActivePath(pathname, item.href) && "is-active")}
                href={item.href}
                onClick={closeMenu}
              >
                <span className="sidebar-dot" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="sidebar-spacer" />

          <Link className="sidebar-interactive-mode" href="/" onClick={closeMenu}>
            <Sparkles size={16} aria-hidden="true" />
            <span>
              Mode Akses Cepat
              <small>Rekomendasi otomatis</small>
            </span>
          </Link>

          <a className="sidebar-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Image src="/whatsapp-icon.svg" alt="" width={18} height={18} aria-hidden="true" />
            <span>
              Chat WhatsApp
              <small>Cek stok & harga</small>
            </span>
          </a>

          <div className="sidebar-status" aria-label="Info toko">
            <p>
              <Clock3 size={13} aria-hidden="true" />
              Buka {STORE_HOURS}
            </p>
            <p>
              <MapPin size={13} aria-hidden="true" />
              {SERVICE_AREA}
            </p>
          </div>
        </div>
      </aside>

      <nav className="mobile-bottom-nav" aria-label="Navigasi cepat mobile">
        {mobileNavItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} className={cn(isActivePath(pathname, href) && "is-active")} href={href}>
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
