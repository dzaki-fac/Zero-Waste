import { Users } from "lucide-react";
import { C, display, body } from "../theme";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Reveal } from "../components/shared";

export default function StrukturPage() {
  return (
    <div style={{ ...body, backgroundColor: C.paper50, color: C.ink900 }} className="min-h-screen flex flex-col">
      <Navbar activeSection="struktur" />
      <section className="flex-1 max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10 pb-24 w-full">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6" style={{ ...display, color: C.navy900 }}>
            Struktur Organisasi
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="rounded-2xl border border-dashed p-6 sm:p-8" style={{ borderColor: "#B9C0D6", backgroundColor: C.navy050 }}>
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} color={C.navy700} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ ...body, color: C.navy700 }}>
                Ruang konten — Struktur Organisasi
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ ...body, color: C.ink500 }}>
              Taruh di sini: bagan struktur organisasi, penanggung jawab per unit/lantai, dan kontak masing-masing.
            </p>
          </div>
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}
