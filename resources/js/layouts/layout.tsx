import { Link, usePage } from "@inertiajs/react";
import { Menu, X, Instagram, Youtube, Globe } from "lucide-react";
import React, { useState  } from "react";
import type {ReactNode} from "react";
import { route } from 'ziggy-js';
import { asset } from '@/lib/path';

export const C = {
  navy900: "#0A1440",
  navy800: "#101B52",
  navy700: "#16215A",
  navy050: "#EEF0F9",
  gold500: "#D4A72C",
  leaf500: "#2FA36A",
  leaf400: "#3FBE80",
  leaf100: "#E4F0E7",
  paper50: "#F5F6F8",
  ink900: "#12142A",
  ink500: "#5B5F73",
  line: "#E1E3EC",
};

export const display = { fontFamily: "'DM Sans', sans-serif" };
export const body = { fontFamily: "'DM Sans', sans-serif" };

export function TiktokIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

type NavItem =
  | { id: string; label: string; type: "anchor" }
  | { id: string; label: string; type: "page"; routeName: string };

export const NAV_ITEMS: NavItem[] = [
  { id: "beranda", label: "Beranda", type: "anchor" },
  { id: "pengertian", label: "Tentang ZeroLib", type: "page", routeName: "pengertian" },
  { id: "struktur", label: "Struktur", type: "page", routeName: "struktur" },
  { id: "sop", label: "SOP", type: "anchor" },
  { id: "laporan", label: "Laporan", type: "anchor" },
  { id: "berita", label: "Berita", type: "anchor" },
  { id: "edukasi", label: "Edukasi", type: "anchor" },
];

export const SOCIALS = [
  { icon: Globe, label: "Website Resmi", handle: "digilib.undip.ac.id", href: "https://digilib.undip.ac.id/" },
  { icon: Youtube, label: "YouTube", handle: "@perpustakaanundip", href: "https://youtube.com/@perpustakaanundip?si=RgDQgwp-UlPD7ryq" },
  { icon: Instagram, label: "Instagram", handle: "@perpus.undip", href: "https://www.instagram.com/perpus.undip?igsh=MTh4bXFtd3AzbmRmdQ==" },
  { icon: TiktokIcon, label: "TikTok", handle: "@perpus.undip.press", href: "https://www.tiktok.com/@perpus.undip.press?_r=1&_t=ZS-97okoKr4q4S" },
];

export const FOOTER_QUICKLINKS = [
  { title: "UPT Perpustakaan", note: "Layanan & katalog perpustakaan pusat" },
  { title: "UNDIP Press", note: "Penerbitan dan publikasi kampus" },
  { title: "Portal Akademik", note: "Sistem informasi akademik mahasiswa" },
  { title: "Lapor Sampah", note: "Formulir pelaporan titik sampah menumpuk" },
];

export const FOOTER_LINKS = ["Tentang", "Kontak", "Kebijakan Privasi", "Bantuan"];

export default function Layout({
  children,
  activeNav,
  onAnchorClick,
}: {
  children: ReactNode;
  activeNav: string;
  onAnchorClick?: (id: string) => void;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { url } = usePage();

  const renderNavButton = (item: NavItem, mobile = false) => {
    const active = item.type === "page" ? url.startsWith(route(item.routeName)) : activeNav === item.id;
    const sharedStyle = { color: active ? "#fff" : "#D9DCEE", backgroundColor: active ? C.navy700 : "transparent" };
    const cls = mobile
      ? "text-left px-3 py-2.5 rounded-lg text-sm font-medium"
      : "relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors";

    if (item.type === "page") {
      return (
        <Link key={item.id} href={route(item.routeName)} onClick={() => setMobileNavOpen(false)} className={cls} style={sharedStyle}>
          {item.label}
          {!mobile && (
            <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full" style={{ backgroundColor: C.leaf400, transform: active ? "scaleX(1)" : "scaleX(0)", transition: "transform 220ms ease" }} />
          )}
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => {
          setMobileNavOpen(false);

          if (onAnchorClick) {
 onAnchorClick(item.id);
} else {
window.location.href = route('home') + '#' + item.id;
}
        }}
        className={cls}
        style={sharedStyle}
        onMouseEnter={(e) => {
 if (!active && !mobile) {
e.currentTarget.style.backgroundColor = C.navy700;
} 
}}
        onMouseLeave={(e) => {
 if (!active && !mobile) {
e.currentTarget.style.backgroundColor = "transparent";
} 
}}
      >
        {item.label}
        {!mobile && (
          <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full" style={{ backgroundColor: C.leaf400, transform: active ? "scaleX(1)" : "scaleX(0)", transition: "transform 220ms ease" }} />
        )}
      </button>
    );
  };

  return (
    <div style={{ ...body, backgroundColor: C.paper50, color: C.ink900 }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400;1,9..40,500&display=swap');
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: C.navy900, borderColor: C.navy700 }}>
        <div className="w-full pl-5 sm:pl-8 pr-5 sm:pr-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={asset('/images/undip-logo.png')} alt="UNDIP" className="w-10 h-11 rounded-md object-contain shrink-0" />
            <div style={display} className="leading-tight">
              <div className="text-[10px] font-semibold tracking-wide" style={{ color: C.gold500 }}>UNIVERSITAS DIPONEGORO</div>
              <div className="text-white text-[11px] tracking-wide">UPT PERPUSTAKAAN DAN UNDIP PRESS</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => renderNavButton(item))}
          </nav>

          <button className="md:hidden text-white" onClick={() => setMobileNavOpen((v) => !v)} aria-label="Buka menu">
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-1" style={{ backgroundColor: C.navy900 }}>
            {NAV_ITEMS.map((item) => renderNavButton(item, true))}
          </div>
        )}
      </header>

      {children}

      <footer style={{ backgroundColor: C.navy900 }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-14 sm:pt-16 pb-8">
          <div className="mb-10">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ ...body, color: "#8A8FB3" }}>Media &amp; Kanal Resmi</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SOCIALS.map((s, i) => {
                const SIcon = s.icon;

                return (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-4 border" style={{ backgroundColor: C.navy800, borderColor: C.navy700 }}>
                    <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.navy700 }}>
                      <SIcon size={16} color={C.leaf400} />
                    </span>
                    <span className="text-left">
                      <div className="text-xs font-semibold text-white">{s.label}</div>
                      <div className="text-[11px]" style={{ color: "#8A8FB3" }}>{s.handle}</div>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t" style={{ borderColor: C.navy700 }}>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((l, i) => (<span key={i} className="text-xs" style={{ color: "#9FA4C4" }}>{l}</span>))}
            </div>
            <span className="text-[11px]" style={{ color: "#6E7396" }}>© 2026 UPT Perpustakaan Universitas Diponegoro. Semua hak dilindungi.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}