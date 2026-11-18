"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BatteryCharging, Home, Menu, MapPin, Search, Wrench, X, Sparkles } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  navItems,
  SERVICE_AREA,
  STORE_HOURS,
  WHATSAPP_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const navIconMap = {
  "/home": Home,
  "/home/pesan-aki": Search,
  "/home/layanan": Wrench,
  "/home/lokasi": MapPin,
} as const;

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
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const isOpen = openForPath === pathname;
  const closeMenu = () => setOpenForPath(null);
  const closeMenuAndRestoreFocus = () => {
    setOpenForPath(null);
    menuButtonRef.current?.focus();
  };

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

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenForPath(null);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const progressPercent = Math.round(scrollProgress * 100);

  return (
    <>
      <header className="mobile-topbar" aria-label="Navigasi utama">
        <button
          ref={menuButtonRef}
          className="mobile-menu-button"
          type="button"
          aria-label={isOpen ? "Tutup navigasi" : "Buka navigasi"}
          aria-controls="site-sidebar"
          aria-expanded={isOpen}
          onClick={() => setOpenForPath((prev) => (prev === pathname ? null : pathname))}
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
        onClick={closeMenuAndRestoreFocus}
      />

      <aside id="site-sidebar" className={cn("site-sidebar", isOpen && "is-open")} aria-label="Navigasi utama">
        <div className="sidebar-inner">
          <div className="sidebar-topline">
            <Link className="sidebar-brand" href="/home" onClick={closeMenu}>
              <div className="brand-mark" aria-hidden="true">
                <BatteryCharging size={19} />
              </div>
              <div className="sidebar-brand-copy">
                <span>{BUSINESS_NAME}</span>
                <small>{BUSINESS_TAGLINE}</small>
              </div>
            </Link>
            <button className="sidebar-close" type="button" aria-label="Tutup navigasi" onClick={closeMenuAndRestoreFocus}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div
            className="sidebar-scroll-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            aria-label={`Progress baca halaman ${progressPercent} persen`}
          >
            <div className="sidebar-scroll-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item, index) => {
              const Icon = navIconMap[item.href];
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  className={cn("sidebar-link", active && "is-active")}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  style={{ "--nav-index": index } as CSSProperties}
                  onClick={closeMenu}
                >
                  <Icon size={15} strokeWidth={active ? 2.4 : 1.9} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-spacer" />

          <Link
            className="sidebar-interactive-mode"
            href="/"
            style={{ "--nav-index": 4 } as CSSProperties}
            onClick={closeMenu}
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>
              Mode Akses Cepat
              <small>Rekomendasi otomatis</small>
            </span>
          </Link>

          <a
            className="sidebar-whatsapp"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--nav-index": 5 } as CSSProperties}
          >
            <Image src="/whatsapp-icon.svg" alt="" width={18} height={18} aria-hidden="true" />
            <span>
              Chat WhatsApp
              <small>Cek stok & harga</small>
            </span>
          </a>

          <div className="sidebar-status" aria-label="Info toko">
            <p>
              <span className="status-live-dot" aria-hidden="true" />
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
        {mobileNavItems.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              className={cn(active && "is-active")}
              href={href}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={17} strokeWidth={active ? 2.4 : 1.85} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
