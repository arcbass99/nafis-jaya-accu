import Link from "next/link";
import { Construction } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'var(--bg, #07090d)',
      color: 'var(--text, #f7fbff)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'inherit'
    }}>
      {/* Ambient Orbs */}
      <div style={{ position: 'absolute', width: '50vw', height: '50vw', background: 'var(--cyan, #2fe3ff)', filter: 'blur(100px)', opacity: 0.08, top: '-10%', left: '-10%', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: '40vw', height: '40vw', background: 'var(--amber, #ffd166)', filter: 'blur(100px)', opacity: 0.06, bottom: '-10%', right: '-10%', borderRadius: '50%', zIndex: 0 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'rgba(255, 209, 102, 0.1)',
          border: '1px solid rgba(255, 209, 102, 0.2)',
          color: 'var(--amber, #ffd166)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(255, 209, 102, 0.15)'
        }}>
          <Construction size={34} strokeWidth={1.5} />
        </div>

        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          Ups! Tempatnya benar, tapi pintunya salah.
        </h1>

        <p style={{ color: 'var(--muted, #a8b6c8)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
          Jalur link yang Anda lewati kemungkinan salah ketik, sudah tidak tersedia, atau telah dialihkan ke jalur utama.
        </p>

        <Link href="/" style={{
          marginTop: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 24px',
          background: 'var(--surface-soft, rgba(255,255,255,0.05))',
          border: '1px solid var(--border, rgba(159, 220, 255, 0.16))',
          borderRadius: '12px',
          color: 'var(--cyan, #2fe3ff)',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          transition: 'all 0.2s ease',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}
