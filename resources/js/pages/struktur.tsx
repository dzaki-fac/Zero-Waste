import React from "react";
import { Users } from "lucide-react";
import Layout, { C, display } from "../layouts/layout";
import { Reveal } from "../components/shared";

export default function Struktur() {
  return (
    <Layout activeNav="struktur">
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10 pb-24">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6" style={{ ...display, color: C.navy900 }}>
            Struktur Organisasi
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="rounded-2xl border border-dashed p-6 sm:p-8" style={{ borderColor: "#B9C0D6", backgroundColor: C.navy050 }}>
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} color={C.navy700} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif", color: C.navy700 }}>
                Ruang konten — Struktur Organisasi
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: C.ink500 }}>
              Taruh di sini: bagan struktur organisasi, penanggung jawab per unit/lantai, dan kontak masing-masing.
            </p>
          </div>
        </Reveal>
      </section>
    </Layout>
  );
}

// Sama seperti Pengertian — lepas dari layout default aplikasi (bar hitam +
// sidebar) karena halaman ini sudah bawa nav & footer sendiri lewat <Layout>.
Struktur.layout = (page: React.ReactNode) => page;