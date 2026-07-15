import { useState } from "react";
import { Info, Scale, MapPin } from "lucide-react";
import { C, display, body } from "../theme";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Reveal, SafeImage } from "../components/shared";

const PENGERTIAN_ITEMS = [
  {
    key: "definisi",
    icon: Info,
    title: "Definisi",
    shortDesc: "Meminimalkan dampak sampah terhadap lingkungan, bukan sekadar daur ulang — mengutamakan perbaikan, pemakaian ulang, dan bahan berkelanjutan.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80",
  },
  {
    key: "tujuan",
    icon: Scale,
    title: "Tujuan",
    shortDesc: "Menekan sampah yang berakhir di TPA lewat kebiasaan reduce, reuse, dan recycle di seluruh unit.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=700&q=80",
  },
  {
    key: "ruang-lingkup",
    icon: MapPin,
    title: "Ruang Lingkup",
    shortDesc: "Lantai 1-4, teras, halaman, parkir, hingga UNDIP Press.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=80",
  },
];

function PengertianContent() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {PENGERTIAN_ITEMS.map((it) => {
        const Icon = it.icon;
        const isOpen = activeKey === it.key;
        return (
          <button
            key={it.key}
            onMouseEnter={() => setActiveKey(it.key)}
            onMouseLeave={() => setActiveKey((prev) => (prev === it.key ? null : prev))}
            onClick={() => setActiveKey((prev) => (prev === it.key ? null : it.key))}
            className="relative rounded-2xl overflow-hidden text-left w-full"
            style={{ aspectRatio: "4 / 5" }}
            aria-expanded={isOpen}
          >
            <SafeImage
              src={it.image}
              alt={it.title}
              icon={Icon}
              gradient={`linear-gradient(160deg, ${C.navy700}, ${C.navy900})`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: isOpen ? "scale(1.06)" : "scale(1)", transition: "transform 450ms cubic-bezier(0.16,1,0.3,1)" }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(10,20,64,0.55) 0%, rgba(10,20,64,0) 35%)", opacity: isOpen ? 0 : 1, transition: "opacity 250ms ease" }} />
            <div className="absolute left-4 right-4 bottom-4 flex items-center gap-2" style={{ opacity: isOpen ? 0 : 1, transition: "opacity 200ms ease" }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
                <Icon size={15} color="#fff" strokeWidth={2} />
              </span>
              <span className="text-white text-sm font-semibold" style={display}>{it.title}</span>
            </div>
            <div
              className="absolute left-0 right-0 bottom-0 flex flex-col justify-center p-5"
              style={{ height: "58%", background: "linear-gradient(160deg, rgba(16,27,82,0.8), rgba(47,163,106,0.75))", backdropFilter: "blur(2px)", transform: isOpen ? "translateY(0)" : "translateY(100%)", transition: "transform 700ms cubic-bezier(0.16,1,0.3,1)" }}
            >
              <div className="text-white text-lg font-semibold mb-1.5" style={display}>{it.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.9)" }}>{it.shortDesc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function PengertianPage() {
  return (
    <div style={{ ...body, backgroundColor: C.paper50, color: C.ink900 }} className="min-h-screen">
      <Navbar activeSection="pengertian" />
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10 pb-24">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6" style={{ ...display, color: C.navy900 }}>Pengertian</h2>
        </Reveal>
        <Reveal delay={80}>
          <PengertianContent />
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}
