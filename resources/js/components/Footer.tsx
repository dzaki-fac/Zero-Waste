import { Instagram, Youtube, Globe, MapPin, Phone, Mail } from "lucide-react";
import { C, body } from "../theme";

function TiktokIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const SOCIALS = [
  { icon: Globe, label: "Website Resmi", href: "https://digilib.undip.ac.id/" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@perpustakaanundip?si=RgDQgwp-UlPD7ryq" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/perpus.undip?igsh=MTh4bXFtd3AzbmRmdQ==" },
  { icon: TiktokIcon, label: "TikTok", href: "https://www.tiktok.com/@perpus.undip.press?_r=1&_t=ZS-97okoKr4q4S" },
];

const KONTAK = [
  { icon: MapPin, text: "Jl. Prof. Soedarto, SH, Gedung Widya Puraya, Tembalang, Semarang" },
  { icon: Phone, text: "(024) 7460042" },
  { icon: Mail, text: "perpustakaanundip@gmail.com" },
];

const JAM_LAYANAN = [
  { hari: "Senin – Kamis", jam: "07.30 – 19.00 WIB" },
  { hari: "Jumat", jam: "07.30 – 19.00 WIB" },
  { hari: "Sabtu", jam: "08.00 – 14.00 WIB" },
  { hari: "Minggu & Hari Libur", jam: "Tutup" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: C.navy900 }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ ...body, color: "#8A8FB3" }}>
              Kontak
            </div>
            <div className="flex flex-col gap-3">
              {KONTAK.map((k, i) => {
                const KIcon = k.icon;

                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.navy800 }}>
                      <KIcon size={15} color={C.leaf400} />
                    </span>
                    <span className="text-sm pt-1.5" style={{ color: "#D9DCEE" }}>{k.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ ...body, color: "#8A8FB3" }}>
              Jam Layanan
            </div>
            <div className="flex flex-col gap-2">
              {JAM_LAYANAN.map((j, i) => (
                <div key={i} className="text-sm" style={{ color: "#D9DCEE" }}>
                  {j.hari} : {j.jam}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ ...body, color: "#8A8FB3" }}>
              Media Sosial
            </div>
            <div className="flex items-center gap-3">
              {SOCIALS.map((s, i) => {
                const SIcon = s.icon;

                return (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors"
                    style={{ backgroundColor: C.navy800, borderColor: C.navy700 }}
                    onMouseEnter={(e) => {
 e.currentTarget.style.backgroundColor = C.navy700; e.currentTarget.style.borderColor = C.leaf500; 
}}
                    onMouseLeave={(e) => {
 e.currentTarget.style.backgroundColor = C.navy800; e.currentTarget.style.borderColor = C.navy700; 
}}
                  >
                    <SIcon size={16} color={C.leaf400} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t text-center" style={{ borderColor: C.navy700 }}>
          <span className="text-[11px]" style={{ color: "#6E7396" }}>
            © 2026 UPT Perpustakaan Universitas Diponegoro. Semua hak dilindungi.
          </span>
        </div>
      </div>
    </footer>
  );
}