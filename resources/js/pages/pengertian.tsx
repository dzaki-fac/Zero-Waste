import { useState, useEffect } from "react";
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
    shortDesc:
      "ZeroLib adalah sistem digital pengelolaan sampah UPT Perpustakaan dan UNDIP Press Universitas Diponegoro yang mengintegrasikan proses pengelolaan sampah secara terdokumentasi dan berbasis data, mulai dari identifikasi sumber, pemilahan, penimbangan, pencatatan, hingga penyaluran ke pengolahan akhir.",
    image: "https://i.pinimg.com/736x/29/7a/3b/297a3b56abc377a1c12c9382c934ee7d.jpg",
  },
  {
    key: "prinsip",
    icon: Scale,
    title: "Prinsip",
    shortDesc:
      "ZeroLib mendukung penerapan prinsip 5R, yaitu Reduce, Reuse, Recycle, Refuse, dan ROT, di setiap tahap pengelolaan sampah perpustakaan.",
    image: "https://i0.wp.com/www.whenateengoesgreen.com/wp-content/uploads/2019/04/5-rs-of-zero-waste-refuse-reduce-reuse-recycle-rot.png?fit=721%2C893&ssl=1",
  },
  {
    key: "manfaat",
    icon: Info,
    title: "Manfaat",
    shortDesc:
      "Melalui ZeroLib, setiap sampah tidak lagi dipandang sebagai limbah semata, melainkan sebagai data yang dapat diukur, dipantau, dan dianalisis secara berkala untuk mendukung proses pengelolaan yang transparan, akuntabel, serta perpustakaan yang lebih hijau dan berkelanjutan.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80",
  },
  {
    key: "ruang-lingkup",
    icon: MapPin,
    title: "Ruang Lingkup",
    shortDesc:
      "Ruang lingkup program mencakup seluruh area Perpustakaan Universitas Diponegoro, meliputi lantai satu hingga empat, area baca, ruang kantor, ruang pertemuan, toilet, teras, halaman, area parkir, dan UNDIP Press sebagai bagian dari lingkungan operasional perpustakaan.",
    image: "https://media.licdn.com/dms/image/v2/D5622AQFDBxnm7ErF1Q/feedshare-shrink_800/feedshare-shrink_800/0/1714140945258?e=2147483647&v=beta&t=JZo_Kp9tUI-MTiZd3Z4R_SAqrW9NBQgwgV-KYUCYlX4",
  },
];

function PengertianContent() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(10,20,64,0.65) 0%, rgba(10,20,64,0) 40%)", opacity: isOpen ? 0 : 1, transition: "opacity 250ms ease" }} />
            <div className="absolute left-4 right-4 bottom-4 flex items-center gap-2" style={{ opacity: isOpen ? 0 : 1, transition: "opacity 200ms ease" }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
                <Icon size={15} color="#fff" strokeWidth={2} />
              </span>
              <span className="text-white text-sm font-semibold" style={display}>{it.title}</span>
            </div>
            <div
              className="absolute left-0 right-0 bottom-0 flex flex-col justify-center p-5"
              style={{ height: "72%", background: "linear-gradient(160deg, rgba(16,27,82,0.92), rgba(47,163,106,0.88))", backdropFilter: "blur(3px)", transform: isOpen ? "translateY(0)" : "translateY(100%)", transition: "transform 700ms cubic-bezier(0.16,1,0.3,1)" }}
            >
              <div className="text-white text-lg font-semibold mb-2" style={display}>{it.title}</div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.92)", textAlign: "justify", textJustify: "inter-word" }}
              >
                {it.shortDesc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function PengertianPage() {
  const appName = import.meta.env.VITE_APP_NAME || 'ZeroLib';
  useEffect(() => { document.title = `Tentang ZeroLib - ${appName}`; }, []);
  return (
    <div style={{ ...body, backgroundColor: C.paper50, color: C.ink900 }} className="min-h-screen">
      <Navbar activeSection="pengertian" />
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10 pb-24">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6" style={{ ...display, color: C.navy900 }}>Tentang ZeroLib</h2>
        </Reveal>
        <Reveal delay={80}>
          <PengertianContent />
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}