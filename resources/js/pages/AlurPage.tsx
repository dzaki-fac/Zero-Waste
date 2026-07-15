import { C, display, body } from "../theme";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AlurPage() {
  return (
    <div style={{ ...body, backgroundColor: C.paper50, color: C.ink900 }} className="min-h-screen">
      <Navbar activeSection="alur" />
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4" style={{ ...display, color: C.navy900 }}>
          Alur
        </h1>
        <p className="text-base leading-relaxed" style={{ color: C.ink500 }}>
          Halaman Alur — konten akan ditambahkan di sini.
        </p>
      </main>
      <Footer />
    </div>
  );
}
