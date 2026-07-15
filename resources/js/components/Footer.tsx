import { Instagram, Youtube, Globe } from "lucide-react";
import { C, body, display } from "../theme";

function TiktokIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const FOOTER_QUICKLINKS = [
  { title: "UPT Perpustakaan", note: "Layanan & katalog perpustakaan pusat" },
  { title: "UNDIP Press", note: "Penerbitan dan publikasi kampus" },
  { title: "Portal Akademik", note: "Sistem informasi akademik mahasiswa" },
  { title: "Lapor Sampah", note: "Formulir pelaporan titik sampah menumpuk" },
];

const SOCIALS = [
  { icon: Globe, label: "Website Resmi", handle: "digilib.undip.ac.id", href: "https://digilib.undip.ac.id/" },
  { icon: Youtube, label: "YouTube", handle: "@perpustakaanundip", href: "https://youtube.com/@perpustakaanundip?si=RgDQgwp-UlPD7ryq" },
  { icon: Instagram, label: "Instagram", handle: "@perpus.undip", href: "https://www.instagram.com/perpus.undip?igsh=MTh4bXFtd3AzbmRmdQ==" },
  { icon: TiktokIcon, label: "TikTok", handle: "@perpus.undip.press", href: "https://www.tiktok.com/@perpus.undip.press?_r=1&_t=ZS-97okoKr4q4S" },
];

const FOOTER_LINKS = ["Tentang", "Kontak", "Kebijakan Privasi", "Bantuan"];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: C.navy900 }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-16 pb-8">

        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ ...body, color: "#8A8FB3" }}>
            Tautan Cepat
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FOOTER_QUICKLINKS.map((q, i) => (
              <button
                key={i}
                className="text-left rounded-xl p-4 border"
                style={{ backgroundColor: C.navy800, borderColor: C.navy700, transition: "border-color 200ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.leaf500)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.navy700)}
              >
                <div className="text-sm font-semibold text-white mb-1" style={display}>{q.title}</div>
                <div className="text-xs leading-snug" style={{ color: "#8A8FB3" }}>{q.note}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ ...body, color: "#8A8FB3" }}>
            Media &amp; Kanal Resmi
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SOCIALS.map((s, i) => {
              const SIcon = s.icon;
              return (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl p-4 border"
                  style={{ backgroundColor: C.navy800, borderColor: C.navy700 }}
                >
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
            {FOOTER_LINKS.map((l, i) => (
              <span key={i} className="text-xs" style={{ color: "#9FA4C4" }}>{l}</span>
            ))}
          </div>
          <span className="text-[11px]" style={{ color: "#6E7396" }}>
            © 2026 UPT Perpustakaan Universitas Diponegoro. Semua hak dilindungi.
          </span>
        </div>
      </div>
    </footer>
  );
}
