import Link from "next/link";
import { Construction } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      textAlign: 'center',
      background: 'var(--bg)',
      color: 'var(--text)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'inherit'
    }}>
      {/* Ambient Orbs */}
      <div style={{ position: 'absolute', width: '40vw', height: '40vw', background: 'rgba(56, 189, 248, 0.08)', filter: 'blur(90px)', top: '-10%', left: '-10%', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: '35vw', height: '35vw', background: 'rgba(251, 191, 36, 0.05)', filter: 'blur(90px)', bottom: '-10%', right: '-10%', borderRadius: '50%', zIndex: 0 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: 'var(--amber-soft)',
          border: '1px solid rgba(251, 191, 36, 0.25)',
          color: 'var(--amber)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
        }}>
          <Construction size={28} strokeWidth={1.8} />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--text)' }}>
          Ups! Tempatnya benar, tapi pintunya salah.
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.55, margin: 0 }}>
          Jalur link yang Anda lewati kemungkinan salah ketik, sudah tidak tersedia, atau telah dialihkan ke jalur utama.
        </p>

        <Link href="/" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}
