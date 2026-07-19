import React, { useState, useRef, useEffect, useLayoutEffect, type ReactNode, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Recycle,
  Leaf,
  Layers,
  MapPin,
  ClipboardList,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Image as ImageIcon,
  Newspaper,
  Info,
  Users,
  Instagram,
  Youtube,
  Globe,
  Phone,
  Mail,
  Scale,
  Truck,
  Package,
  Clock,
  CheckCircle,
  Send,
  CalendarIcon,
} from "lucide-react";
import { usePage, router } from '@inertiajs/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { C, display, body } from "../theme";
import Navbar from "../components/Navbar";
import { ChartTooltip, ChartLabel, getCategoryColor, PieLegend } from "../components/charts";
import type { ChartData } from "../components/charts";

// ---- Tiktok Icon --------------------------------------------------------
function TiktokIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

// ---- Content data --------------------------------------------------------

const HERO_SLIDES = [
  {
    tab: "Zero Waste UNDIP",
    title: "Menuju kampus tanpa sampah tersisa",
    desc: "Satu sistem yang membantu memahami, menjalankan, dan memantau pengelolaan sampah kampus, mulai dari pemilahan di tiap sub-area sampai ke distribusi akhirnya.",
    image:
      "https://cdn.pixabay.com/photo/2017/08/06/22/01/books-2596809_1280.jpg",
    icon: Recycle,
  },
  {
    tab: "Pemilahan dari Sumber",
    title: "Sampah dipilah dari sub-area",
    desc: "Setiap ruang baca, toilet, dan ruang kerja menimbang serta mencatat sampahnya masing-masing sebelum diserahkan ke titik pilah pertama.",
    image:
      "https://images.pexels.com/photos/16891089/pexels-photo-16891089.jpeg?_gl=1*1coyoxh*_ga*NTQyMDQ0NzI0LjE3ODQxNzA0MDc.*_ga_8JE65Q40S6*czE3ODQxNzA0MDckbzEkZzEkdDE3ODQxNzE0MjQkajQ3JGwwJGgw",
    icon: Layers,
  },
  {
    tab: "Kompos dan Daur Ulang",
    title: "Sisa makanan dan ranting jadi kompos",
    desc: "Ranting kecil dan sisa makanan dikembalikan ke tanah, sementara kertas dan kardus disalurkan menjadi karya kreativitas atau bahan daur ulang.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
    icon: Leaf,
  },
  {
    tab: "Distribusi Akhir",
    title: "Dari TPS sampai Plasticpay",
    desc: "Sampah yang sudah dipilah lalu didistribusikan ke tujuan akhirnya, ada yang ditimbun jadi pupuk, dikirim ke TPS, atau disetor lewat Plasticpay.",
    image:
      "https://images.pexels.com/photos/5433124/pexels-photo-5433124.jpeg?_gl=1*ztn08z*_ga*NTQyMDQ0NzI0LjE3ODQxNzA0MDc.*_ga_8JE65Q40S6*czE3ODQxNzA0MDckbzEkZzEkdDE3ODQxNzEwMTQkajU5JGwwJGgw",
    icon: MapPin,
  },
];

const HERO_STATS = [
  { label: "Lantai dipantau", value: 4, suffix: "" },
  { label: "Sub-area aktif", value: 12, suffix: "+" },
  { label: "Titik pemilahan", value: 20, suffix: "+" },
];

const MENU_DECK = [
  {
    id: "pengertian",
    order: "01",
    icon: Info,
    title: "Pengertian",
    teaser: "Apa itu Zero Waste dan kenapa kampus menjalankannya.",
    placeholder:
      "Taruh di sini: definisi Zero Waste, tujuan program, dan ruang lingkup penerapan (lantai 1-4, teras, halaman, parkir, termasuk UNDIP Press).",
  },
  {
    id: "struktur",
    order: "02",
    icon: Users,
    title: "Struktur Organisasi",
    teaser: "Siapa yang menjalankan program ini di tiap unit.",
    placeholder:
      "Taruh di sini: bagan struktur organisasi, penanggung jawab per unit/lantai, dan kontak masing-masing.",
  },
  {
    id: "sop",
    order: "03",
    icon: ClipboardList,
    title: "SOP",
    teaser: "Langkah baku pemilahan, penimbangan, dan pelaporan.",
    placeholder:
      "Taruh di sini: dokumen SOP per tahap — pemilahan, penimbangan, pencatatan, dan distribusi akhir.",
  },

  {
    id: "laporan",
    order: "05",
    icon: BarChart3,
    title: "Laporan",
    teaser: "Ringkasan capaian dan rekap data pengelolaan sampah.",
    placeholder:
      "Taruh di sini: laporan bulanan/tahunan, grafik capaian per lantai, dan rekap total sampah terpilah.",
  },
];

const NEWS = [
  {
    tag: "UNDIP",
    date: "04 Apr 2026",
    title: "K3L Sosialisasikan Pemilahan Sampah Residu di TPST Kampus UNDIP",
    image:
      "https://i.ytimg.com/vi/ne1zRy1AOOM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDjk6kykjZwKXx6RaQdlDsDhyqU6g",
    href: "https://kemdiktisaintek.go.id/news/article/implementasi-undip-zero-waste-k3l-sosialisasikan-pemilahan-sampah-residu",
  },
  {
    tag: "UNDIP",
    date: "Jun 2026",
    title: "SV Zero Discharge: Langkah Strategis Sekolah Vokasi UNDIP",
    image:
      "https://undip.ac.id/wp-content/uploads/2026/06/1-ezgif.com-jpg-to-webp-converter-5.webp",
    href: "https://undip.ac.id/post/57036/sv-zero-discharge-langkah-strategis-sekolah-vokasi-undip-menuju-kampus-berkelanjutan-berkelas-dunia.html",
  },
  {
    tag: "Nasional",
    date: "15 Jul 2026",
    title: "UI Gandeng BRIN dan Industri Kembangkan Model Zero Waste",
    image:
      "https://apakabar.co.id/uploads/2026/07/post_6a50fe5d0bca19.37943188.jpg",
    href: "https://www.kompas.com/edu/read/2026/07/15/101720771/gaet-brin-dan-industri-ui-kembangkan-pengolahan-sampah-model-zero-waste",
  },
  {
    tag: "Nasional",
    date: "08 Jun 2026",
    title: "UMS Galakkan Zero Waste, Ikhtiar Kurangi Sampah Plastik",
    image:
      "https://www.ums.ac.id/__gambars__/uploads/LGWtScdV89eyA9wyzMSIiMvhQvXmDrUOe0ZY6B0Y.webp",
    href: "https://jateng.antaranews.com/berita/634320/ums-galakkan-zero-waste-ikhtiar-kurangi-sampah-plastik",
  },
  {
    tag: "Nasional",
    date: "awal Jul 2026",
    title: "UNJ Resmikan TPST dan Waste Management Center",
    image:
      "https://cdn2.timesmedia.co.id/cdn-times/uploads/assets/2026/07/01/unj-resmikan-tpst-dan-waste-management-center-untuk-perkuat-komitmen-menuju-kamp-x9mo7260.webp?v=7.0.0#",
    href: "https://times.co.id/unj-resmikan-tpst-dan-waste-management-center-untuk-perkuat-komitmen-menuju-kampus-zero-waste",
  },
];

const POSTERS = [
  {
    title: "Pilah dari Sumbernya",
    tag: "Dasar",
    note: "Kenapa pemilahan harus dimulai dari tiap sub-area, bukan di akhir.",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Ranting: Besar vs Kecil",
    tag: "Organik",
    note: "Ranting besar dicatat sebagai aset, ranting kecil dikembalikan ke tanah.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Sisa Makanan Jadi Kompos",
    tag: "Organik",
    note: "Jejak sisa makanan dari area baca sampai kantor, diolah jadi kompos.",
    image:
      "https://images.pexels.com/photos/5479034/pexels-photo-5479034.jpeg",
  },
  {
    title: "Plastik & Styrofoam",
    tag: "Anorganik",
    note: "Pemisahan plastik berwarna dan bening, serta penanganan styrofoam.",
    image:
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Kardus & Kertas",
    tag: "Daur Ulang",
    note: "Dirajang atau disalurkan jadi karya kreativitas, sebelum ke TPS.",
    image:
      "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Distribusi Akhir",
    tag: "Alur",
    note: "Ke TPS, ditimbun jadi pupuk, atau disetor lewat Plasticpay.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
  },
];

// Dua salinan berita digabung biar carousel-nya bisa looping mulus tanpa
// "lompat" kelihatan — begitu geser sejauh satu set pertama, posisinya
// digeser balik ke awal set (bukan direset ke 0), jadi mulus.
const NEWS_LOOP = [...NEWS, ...NEWS];

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

// Durasi autoplay poster edukasi (ms) — dipakai untuk timer & animasi progress bar
const POSTER_AUTOPLAY_MS = 7000;

// ---- Interaction hooks -------------------------------------------------
function useInView(threshold = 0.18) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 750ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 750ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

function StatCounter({ stat, delay }: { stat: (typeof HERO_STATS)[number]; delay: number }) {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const value = useCountUp(stat.value, started);
  return (
    <div>
      <div className="text-xl sm:text-2xl font-semibold text-white" style={display}>
        {value}
        {stat.suffix}
      </div>
      <div className="text-[11px]" style={{ color: "#9FA4C4" }}>
        {stat.label}
      </div>
    </div>
  );
}

// ---- Small building blocks -------------------------------------------------

function SectionLabel({ children }: { children: ReactNode; hideLine?: boolean }) {
  return (
    <div
      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold mb-3"
      style={{ ...body, color: C.leaf500 }}
    >
      {children}
    </div>
  );
}

function SafeImage({ src, alt, icon: Icon, gradient, className, style }: { src: string; alt: string; icon?: LucideIcon; gradient: string; className?: string; style?: CSSProperties }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={className}
        style={{ ...style, background: gradient, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {Icon && <Icon size={36} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}

// ---- Page props -------------------------------------------------------

type PresetKey = 'all' | 'today' | '7d' | '30d' | '3m';

const PRESETS: { key: PresetKey; label: string; days: number | null }[] = [
    { key: 'all', label: 'Semua', days: null },
    { key: 'today', label: 'Hari Ini', days: 0 },
    { key: '7d', label: '7 Hari', days: 7 },
    { key: '30d', label: '30 Hari', days: 30 },
    { key: '3m', label: '3 Bulan', days: 90 },
];

function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
}

function formatDateInput(d: Date): string {
    return d.toISOString().split('T')[0];
}

type PageProps = {
    penimbanganByArea: ChartData;
    pilahByJenis: ChartData;
    distribusiByTujuan: ChartData;
    statusBerat: {
        menunggu_pemilahan: number;
        siap_didistribusikan: number;
        sudah_didistribusikan: number;
    };
    siapDidistribusikanByJenis: ChartData;
    filters?: {
        start_date: string | null;
        end_date: string | null;
    };
};

// ---- Main component ---------------------------------------------------

function LaporanCharts({ data }: { data: PageProps }) {
    const { penimbanganByArea, pilahByJenis, distribusiByTujuan, statusBerat, siapDidistribusikanByJenis } = data;

    const siapSorted = siapDidistribusikanByJenis.slice().sort((a, b) => b.value - a.value);
    const siapTotal = siapDidistribusikanByJenis.reduce((s, d) => s + d.value, 0);

    const STATUS_DATA = [
        { key: 'menunggu_pemilahan', name: 'Menunggu Pemilahan', value: statusBerat.menunggu_pemilahan, color: '#ef4444', icon: Clock },
        { key: 'siap_didistribusikan', name: 'Siap Didistribusikan', value: statusBerat.siap_didistribusikan, color: '#f59e0b', icon: Package },
        { key: 'sudah_didistribusikan', name: 'Sudah Didistribusikan', value: statusBerat.sudah_didistribusikan, color: '#22c55e', icon: CheckCircle },
    ];
    const statusTotal = STATUS_DATA.reduce((s, d) => s + d.value, 0);

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Status Berat Sampah - Donut */}
                <div className="rounded-2xl border bg-white p-5" style={{ borderColor: C.line }}>
                    <div className="mb-1 flex items-center gap-2">
                        <Package className="size-5" style={{ color: C.leaf500 }} />
                        <h3 className="text-sm font-semibold" style={{ color: C.navy900 }}>Status Berat Sampah</h3>
                    </div>
                    <p className="mb-4 text-xs" style={{ color: C.ink500 }}>Alur berat sampah dari penimbangan hingga distribusi</p>
                    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center">
                        <div className="relative h-[220px] w-[220px] shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={58} outerRadius={95} paddingAngle={3} dataKey="value" stroke="none">
                                        {STATUS_DATA.map((_, i) => <Cell key={i} fill={STATUS_DATA[i].color} />)}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                    <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900 text-xl font-bold tabular-nums">
                                        {statusTotal.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                    </text>
                                    <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 text-[10px]">
                                        kg total
                                    </text>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex w-full flex-col gap-2.5">
                            {STATUS_DATA.map((item) => {
                                const pct = statusTotal > 0 ? (item.value / statusTotal) * 100 : 0;
                                const Icon = item.icon;
                                return (
                                    <div key={item.key} className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: `${item.color}0d` }}>
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${item.color}1a` }}>
                                            <Icon className="size-4" style={{ color: item.color }} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium" style={{ color: C.ink900 }}>{item.name}</p>
                                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: `${item.color}20` }}>
                                                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-bold tabular-nums" style={{ color: C.ink900 }}>
                                                {item.value.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                            </p>
                                            <p className="text-[10px]" style={{ color: C.ink500 }}>kg &middot; {pct.toFixed(1)}%</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Penimbangan per Area */}
                {(() => {
                    const data = penimbanganByArea;
                    const total = data.reduce((s, d) => s + d.value, 0);
                    const sorted = data.slice().sort((a, b) => b.value - a.value);
                    return (
                        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: C.line }}>
                            <div className="mb-1 flex items-center gap-2">
                                <Scale className="size-5" style={{ color: C.leaf500 }} />
                                <h3 className="text-sm font-semibold" style={{ color: C.navy900 }}>Penimbangan per Area</h3>
                            </div>
                            <p className="mb-4 text-xs" style={{ color: C.ink500 }}>
                                Total berat ditimbang: {total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                            </p>
                            {data.length > 0 ? (
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                    <div className="h-[240px] shrink-0 lg:w-1/2">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <defs>
                                                    <filter id="homePieShadow1" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.65" />
                                                    </filter>
                                                </defs>
                                                <Pie data={sorted} cx="50%" cy="50%" labelLine={false} label={ChartLabel} outerRadius={100} dataKey="value" stroke="none">
                                                    {sorted.map((entry) => <Cell key={entry.name} fill={getCategoryColor(entry.name)} />)}
                                                </Pie>
                                                <Tooltip content={<ChartTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="w-full space-y-1.5 lg:pl-4">
                                        <PieLegend data={sorted} total={total} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-48 items-center justify-center text-sm" style={{ color: C.ink500 }}>
                                    Belum ada data
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* Tiga Pie Chart: Penimbangan, Pilah, Distribusi */}
            <div className="grid gap-6 md:grid-cols-3">
                {([
                    { title: 'Pilah Sampah per Jenis', icon: Recycle, data: pilahByJenis, totalLabel: 'Total berat dipilah' },
                    { title: 'Distribusi per Tujuan', icon: Truck, data: distribusiByTujuan, totalLabel: 'Total berat didistribusikan' },
                    { title: 'Sisa & Siap Didistribusikan', icon: Send, data: siapDidistribusikanByJenis, totalLabel: 'Total sisa dan siap didistribusikan' },
                ] as const).map((card) => {
                    const total = card.data.reduce((s, d) => s + d.value, 0);
                    const sorted = card.data.slice().sort((a, b) => b.value - a.value);
                    return (
                        <div key={card.title} className="rounded-2xl border bg-white p-5" style={{ borderColor: C.line }}>
                            <div className="mb-1 flex items-center gap-2">
                                <card.icon className="size-5" style={{ color: C.leaf500 }} />
                                <h3 className="text-sm font-semibold" style={{ color: C.navy900 }}>{card.title}</h3>
                            </div>
                            <p className="mb-4 text-xs" style={{ color: C.ink500 }}>
                                {card.totalLabel}: {total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                            </p>
                            {card.data.length > 0 ? (
                                <>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <defs>
                                                    <filter id="homePieShadowSm" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.65" />
                                                    </filter>
                                                </defs>
                                                <Pie data={sorted} cx="50%" cy="50%" labelLine={false} label={ChartLabel} outerRadius={100} dataKey="value" stroke="none">
                                                    {sorted.map((entry) => <Cell key={entry.name} fill={getCategoryColor(entry.name)} />)}
                                                </Pie>
                                                <Tooltip content={<ChartTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <PieLegend data={sorted} total={total} />
                                </>
                            ) : (
                                <div className="flex h-48 items-center justify-center text-sm" style={{ color: C.ink500 }}>
                                    Belum ada data
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const pageProps = usePage().props as unknown as PageProps;
    const [activePreset, setActivePreset] = useState<PresetKey>('all');
    const [startDate, setStartDate] = useState(pageProps.filters?.start_date ?? '');
    const [endDate, setEndDate] = useState(pageProps.filters?.end_date ?? '');

    function applyFilter(params: { start_date?: string | null; end_date?: string | null }) {
        const query: Record<string, string> = {};
        if (params.start_date) query.start_date = params.start_date;
        if (params.end_date) query.end_date = params.end_date;
        router.get('/', query, { preserveState: true, preserveScroll: true, replace: true });
    }

    function handlePreset(preset: typeof PRESETS[number]) {
        setActivePreset(preset.key);
        if (preset.days === null) {
            setStartDate('');
            setEndDate('');
            applyFilter({});
        } else if (preset.days === 0) {
            const today = formatDateInput(new Date());
            setStartDate(today);
            setEndDate(today);
            applyFilter({ start_date: today, end_date: today });
        } else {
            const s = daysAgo(preset.days);
            const e = formatDateInput(new Date());
            setStartDate(s);
            setEndDate(e);
            applyFilter({ start_date: s, end_date: e });
        }
    }

    function handleCustomDate() {
        setActivePreset('all');
        applyFilter({ start_date: startDate || null, end_date: endDate || null });
    }
  const [heroIndex, setHeroIndex] = useState(0);
  const [posterIndex, setPosterIndex] = useState(0);
  const [posterPaused, setPosterPaused] = useState(false);
  const [newsPaused, setNewsPaused] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const [scrollY, setScrollY] = useState(0);
  const [heroMounted, setHeroMounted] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const newsScrollRef = useRef<HTMLDivElement | null>(null);
  const newsTrackRef = useRef<HTMLDivElement | null>(null);
  const newsOffsetRef = useRef(0);
  const suppressObserverUntilRef = useRef(0);

  // Navbar tingginya bisa beda-beda antara desktop dan mobile (mis. wrapping
  // logo/teks, hamburger, dsb), jadi jangan pakai angka tetap — ukur langsung
  // elemen <nav>-nya tiap kali mau scroll, supaya offset selalu akurat di
  // semua ukuran layar dan section (termasuk "Edukasi") tidak ke-crop.
  // PENTING: root Navbar-nya adalah <header>, sementara <nav> di dalamnya
  // cuma dipakai untuk menu desktop (className "hidden md:flex") — artinya
  // di mobile <nav> itu display:none alias tingginya 0px. Makanya harus
  // ukur <header>, bukan <nav>, supaya offset di mobile akurat.
  const getNavOffset = (id: string) => {
    const headerEl = document.querySelector("header");
    const navHeight = headerEl ? headerEl.getBoundingClientRect().height : 64;
    const EXTRA_BUFFER: Record<string, number> = { berita: 0, edukasi: 0, laporan: 0 };
    return navHeight + (EXTRA_BUFFER[id] ?? 8);
  };

  // Paksa halaman mulai dari atas waktu pertama kali dibuka/direload, dan
  // matikan scroll restoration bawaan browser (penyebab utama halaman
  // "lompat" ke posisi scroll terakhir waktu pertama kali dibuka).
  useLayoutEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const scrollToId = (location.state as { scrollTo?: string })?.scrollTo;
    if (scrollToId) {
      const align = () => {
        const el = sectionRefs.current[scrollToId];
        if (!el) return;
        const offset = getNavOffset(scrollToId);
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "instant" });
      };
      align();
      window.setTimeout(align, 400);
      window.setTimeout(align, 900);
      setActiveSection(scrollToId);
    }
  }, []);

  // Bersihkan scrollTo state setelah browser paint, supaya tidak ke-trigger
  // ulang saat user navigasi lain / refresh.
  useEffect(() => {
    const scrollToId = (location.state as { scrollTo?: string })?.scrollTo;
    if (scrollToId) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setHeroMounted(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // Autoplay poster edukasi setiap 7 detik — timer ini dipakai ulang tiap kali
  // posterIndex berubah (baik otomatis maupun diklik manual), jadi hitungan
  // mundurnya selalu mulai dari 0 lagi. Berhenti sementara saat kartu di-hover.
  useEffect(() => {
    if (posterPaused) return;
    const t = setTimeout(() => {
      setPosterIndex((i) => (i + 1) % POSTERS.length);
    }, POSTER_AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [posterIndex, posterPaused]);

  useEffect(() => {
    // Deteksi section aktif pakai pola scrollspy klasik: cek posisi tiap
    // section relatif ke garis referensi tepat di bawah navbar, lalu pilih
    // section TERAKHIR yang batas atasnya sudah lewat garis itu (urut sesuai
    // urutan section di halaman). Ini jauh lebih stabil dibanding cara lama
    // (IntersectionObserver berbasis rasio kemunculan), yang gampang salah
    // pilih kalau dua section pendek berdekatan (mis. Beranda ↔ Laporan).
    const SECTION_ORDER = ["beranda", "laporan", "berita", "edukasi"];

    const onScroll = () => {
      setScrollY(window.scrollY);
      if (Date.now() < suppressObserverUntilRef.current) return;

      const headerEl = document.querySelector("header");
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 64;
      const referenceLine = headerHeight + 4;

      let current = SECTION_ORDER[0];
      for (const id of SECTION_ORDER) {
        const el = sectionRefs.current[id];
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= referenceLine) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const track = newsTrackRef.current;
    if (!track) return;
    const SPEED_PX_PER_SEC = 32;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!newsPaused && track) {
        newsOffsetRef.current += SPEED_PX_PER_SEC * dt;
        const singleSetWidth = track.scrollWidth / 2;
        if (newsOffsetRef.current >= singleSetWidth) {
          newsOffsetRef.current -= singleSetWidth;
        }
        track.style.transform = `translateX(-${newsOffsetRef.current}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [newsPaused]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    suppressObserverUntilRef.current = Date.now() + 1900;
    const el = sectionRefs.current[id];
    if (!el) return;

    const align = (behavior: ScrollBehavior) => {
      const target = sectionRefs.current[id];
      if (!target) return;
      const offset = getNavOffset(id);
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior });
      // Tegaskan lagi section aktifnya tiap kali posisi dikoreksi, supaya
      // highlight nav tetap sesuai section yang diklik sampai scroll benar-benar selesai.
      setActiveSection(id);
    };

    align("smooth");
    // Koreksi ulang setelah animasi scroll kelar dan setelah gambar-gambar
    // (poster/berita) kemungkinan sudah selesai load — supaya posisi akhir
    // selalu presisi walau navbar/tinggi konten berubah di tengah jalan.
    window.setTimeout(() => align("instant"), 550);
    window.setTimeout(() => align("instant"), 1100);
  };

  const nextHero = () => setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
  const prevHero = () => setHeroIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const nextPoster = () => setPosterIndex((i) => (i + 1) % POSTERS.length);
  const prevPoster = () => setPosterIndex((i) => (i - 1 + POSTERS.length) % POSTERS.length);
  const activePoster = POSTERS[posterIndex];
  const activeHero = HERO_SLIDES[heroIndex];

  const scrollNews = (dir: number) => {
    const track = newsTrackRef.current;
    if (!track) return;
    const singleSetWidth = track.scrollWidth / 2;
    newsOffsetRef.current += dir * 320;
    if (newsOffsetRef.current < 0) newsOffsetRef.current += singleSetWidth;
    if (newsOffsetRef.current >= singleSetWidth) newsOffsetRef.current -= singleSetWidth;
    track.style.transform = `translateX(-${newsOffsetRef.current}px)`;
  };

  const setSectionRef = (key: string) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  };

  const heroParallax = Math.min(scrollY * 0.18, 120);

  return (
    <div style={{ ...body, backgroundColor: C.paper50, color: C.ink900 }} className="min-h-screen">
      <style>{`
        html { scroll-behavior: smooth; }
        * { overflow-anchor: none; }
        .news-scroll::-webkit-scrollbar { display: none; }
        .news-scroll { scroll-behavior: auto !important; }
        .poster-thumbs::-webkit-scrollbar { display: none; }
        .poster-thumbs { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes posterProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ---- Nav ---- */}
      <Navbar activeSection={activeSection} onNavItemClick={scrollTo} />

      {/* ---- Hero ---- */}
      <section id="beranda" ref={setSectionRef("beranda")}>
        <div className="relative w-full overflow-hidden" style={{ height: "33dvh", minHeight: 320 }}>
          {HERO_SLIDES.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{ opacity: i === heroIndex ? 1 : 0, transition: "opacity 900ms ease" }}
            >
              <SafeImage
                src={s.image}
                alt={s.tab}
                icon={s.icon}
                gradient={`linear-gradient(135deg, ${C.navy900}, ${C.navy700})`}
                className="w-full h-full object-cover"
                style={{
                  transform: `translateY(${heroParallax}px) scale(1.08)`,
                  transition: "transform 100ms linear",
                }}
              />
            </div>
          ))}

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(10,20,64,0.94) 5%, rgba(10,20,64,0.45) 50%, rgba(10,20,64,0.15) 100%)",
            }}
          />

          <button
            onClick={prevHero}
            aria-label="Slide sebelumnya"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(10,20,64,0.45)", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            <ChevronLeft size={14} color="#fff" />
          </button>
          <button
            onClick={nextHero}
            aria-label="Slide berikutnya"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(10,20,64,0.45)", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            <ChevronRight size={14} color="#fff" />
          </button>

          <div className="relative h-full max-w-6xl mx-auto px-5 sm:px-8 flex flex-col justify-between pt-8 sm:pt-10 pb-6 sm:pb-8">
            <div
              style={{
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1) 100ms, transform 700ms cubic-bezier(0.16,1,0.3,1) 100ms",
              }}
            >
              <SectionLabel hideLine>
                <span style={{ color: C.gold500, fontSize: "0.7rem" }}>Sistem Informasi Pengelolaan Sampah</span>
              </SectionLabel>
              <h1 key={activeHero.title} className="text-2xl sm:text-3xl lg:text-4xl font-semibold max-w-4xl leading-tight text-white mb-3 hero-fade whitespace-normal sm:whitespace-nowrap" style={display}>
                {activeHero.title}
              </h1>
              <p className="max-w-xl text-sm sm:text-base" style={{ color: "#C3C6DE" }}>
                {activeHero.desc}
              </p>
            </div>

            <div
              className="flex flex-wrap gap-4 sm:gap-8"
              style={{
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1) 250ms, transform 700ms cubic-bezier(0.16,1,0.3,1) 250ms",
              }}
            >
              {HERO_STATS.map((st, i) => (
                <StatCounter key={i} stat={st} delay={300 + i * 180} />
              ))}
            </div>
          </div>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                aria-label={`Ke slide ${i + 1}`}
                className="rounded-full"
                style={{
                  width: i === heroIndex ? 22 : 7,
                  height: 7,
                  backgroundColor: i === heroIndex ? C.leaf400 : "rgba(255,255,255,0.4)",
                  transition: "width 200ms ease, background-color 200ms ease",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Laporan ---- */}
      <section id="laporan" ref={setSectionRef("laporan")} className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10" style={{ scrollMarginTop: 72 }}>
        <Reveal>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-1" style={{ ...display, color: C.navy900 }}>
                Laporan
              </h2>
              <p className="text-sm" style={{ color: C.ink500 }}>Rekap data pengelolaan sampah</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="flex items-center rounded-lg border bg-white p-0.5" style={{ borderColor: C.line }}>
                {PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => handlePreset(preset)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      activePreset === preset.key
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border bg-white px-2 py-1" style={{ borderColor: C.line }}>
                <CalendarIcon className="size-3.5 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-28 border-0 bg-transparent text-xs text-gray-700 outline-none hover:text-gray-900 [color-scheme:light]"
                />
                <span className="text-xs text-gray-400">&ndash;</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-28 border-0 bg-transparent text-xs text-gray-700 outline-none hover:text-gray-900 [color-scheme:light]"
                />
                <button
                  onClick={handleCustomDate}
                  className="h-6 rounded-md px-2 text-xs font-medium text-green-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <LaporanCharts data={pageProps} />
        </Reveal>
      </section>

      {/* ---- Berita ---- */}
      <section id="berita" ref={setSectionRef("berita")} className="pt-6 sm:pt-8" style={{ backgroundColor: C.navy900, scrollMarginTop: 64 }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-12">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
              <div>
                <SectionLabel>Kabar Terbaru</SectionLabel>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white" style={display}>
                  Berita Terkini
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => scrollNews(-1)} className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: "rgba(255,255,255,0.25)" }} aria-label="Sebelumnya">
                  <ChevronLeft size={16} color="#fff" />
                </button>
                <button onClick={() => scrollNews(1)} className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: "rgba(255,255,255,0.25)" }} aria-label="Berikutnya">
                  <ChevronRight size={16} color="#fff" />
                </button>
              </div>
            </div>
          </Reveal>

          <div
            ref={newsScrollRef}
            className="news-scroll"
            style={{ overflow: "hidden" }}
            onMouseEnter={() => setNewsPaused(true)}
            onMouseLeave={() => setNewsPaused(false)}
          >
            <div ref={newsTrackRef} className="flex gap-5 pb-2" style={{ willChange: "transform" }}>
              {NEWS_LOOP.map((n, i) => (
                <Reveal key={i} delay={(i % NEWS.length) * 80} className="shrink-0 w-64 sm:w-72">
                  <a
                    href={n.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl overflow-hidden block"
                    style={{ backgroundColor: C.navy800, transition: "transform 220ms ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div className="h-36 relative overflow-hidden">
                      <SafeImage
                        src={n.image}
                        alt={n.title}
                        icon={Newspaper}
                        gradient={`linear-gradient(135deg, ${C.navy700}, ${C.navy900})`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: C.leaf500, color: "#fff" }}>
                        {n.tag}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="text-[11px] mb-1.5" style={{ color: "#8A8FB3" }}>{n.date}</div>
                      <div className="text-sm font-medium leading-snug text-white mb-3" style={display}>{n.title}</div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.leaf400 }}>
                        Baca selengkapnya <ArrowRight size={13} />
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Edukasi: poster slideshow ---- */}
      <section id="edukasi" ref={setSectionRef("edukasi")} className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-20" style={{ scrollMarginTop: 64 }}>
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{ ...display, color: C.navy900 }}>
            Poster Edukasi
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="rounded-3xl p-4 sm:p-5 border"
            style={{ backgroundColor: "#fff", borderColor: C.line }}
            onMouseEnter={() => setPosterPaused(true)}
            onMouseLeave={() => setPosterPaused(false)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: C.leaf100, color: C.leaf500 }}>
                {activePoster.tag}
              </span>
              <span className="text-xs" style={{ color: C.ink500 }}>
                {posterIndex + 1} / {POSTERS.length}
              </span>
            </div>

            {/* Frame poster — rasio A3 vertikal (297 x 420), gambar dipusatkan */}
            <div
              className="mx-auto rounded-2xl overflow-hidden relative mb-3"
              style={{ aspectRatio: "297 / 420", width: "min(100%, 420px)", backgroundColor: C.navy050 }}
            >
              <SafeImage
                src={activePoster.image}
                alt={activePoster.title}
                icon={ImageIcon}
                gradient={`linear-gradient(135deg, ${C.navy900}, ${C.navy700})`}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 65%" }}
              />
              <div
                className="absolute inset-0 flex flex-col items-center justify-end text-center px-6 py-8"
                style={{ background: "linear-gradient(0deg, rgba(10,20,64,0.88) 15%, rgba(10,20,64,0.05) 65%)" }}
              >
                <h3 className="text-white text-xl sm:text-2xl font-semibold mb-2" style={display}>
                  {activePoster.title}
                </h3>
                <p className="text-sm max-w-md" style={{ color: "#D6D9EC" }}>{activePoster.note}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <button onClick={prevPoster} className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ borderColor: C.line }} aria-label="Poster sebelumnya">
                <ChevronLeft size={18} color={C.navy900} />
              </button>
              <div className="flex gap-1.5">
                {POSTERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPosterIndex(i)}
                    aria-label={`Ke poster ${i + 1}`}
                    className="rounded-full"
                    style={{ width: i === posterIndex ? 20 : 6, height: 6, backgroundColor: i === posterIndex ? C.leaf500 : C.line, transition: "width 200ms ease, background-color 200ms ease" }}
                  />
                ))}
              </div>
              <button onClick={nextPoster} className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ borderColor: C.line }} aria-label="Poster berikutnya">
                <ChevronRight size={18} color={C.navy900} />
              </button>
            </div>

            {/* Thumbnail strip — overlay penanda di thumbnail aktif tumbuh dari kiri
                ke kanan selama 7 detik (pakai transform, jadi mulus/GPU-accelerated) */}
            <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 overflow-x-auto sm:overflow-visible pb-1 poster-thumbs snap-x snap-mandatory sm:snap-none">
              {POSTERS.map((p, i) => {
                const isActive = i === posterIndex;
                return (
                  <button
                    key={i}
                    onClick={() => setPosterIndex(i)}
                    className="shrink-0 w-20 h-16 rounded-lg overflow-hidden relative snap-start"
                    style={{
                      outline: isActive ? `2px solid ${C.leaf500}` : "none",
                      outlineOffset: "2px",
                      transition: "transform 180ms ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <SafeImage
                      src={p.image}
                      alt={p.title}
                      icon={ImageIcon}
                      gradient={`linear-gradient(135deg, ${C.navy700}, ${C.navy900})`}
                      className="w-full h-full object-cover"
                      style={{ opacity: isActive ? 1 : 0.55, transition: "opacity 200ms ease" }}
                    />
                    {isActive && (
                      <span
                        key={posterIndex}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.55)",
                          mixBlendMode: "overlay",
                          transformOrigin: "left center",
                          animation: `posterProgress ${POSTER_AUTOPLAY_MS}ms linear forwards`,
                          animationPlayState: posterPaused ? "paused" : "running",
                          willChange: "transform",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- Footer ---- */}
      {/* ---- Footer ---- */}
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
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.navy700; e.currentTarget.style.borderColor = C.leaf500; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy800; e.currentTarget.style.borderColor = C.navy700; }}
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
    </div>
  );
}