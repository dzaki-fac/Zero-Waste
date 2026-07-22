import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, ScrollText, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Reveal } from "../components/shared";
import { C, display, body } from "../theme";
import { route } from 'ziggy-js';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type DocumentItem = {
  id: number;
  type: string;
  title: string;
  pdf_url: string;
  is_published: boolean;
};

const MOBILE_BREAKPOINT = 768;
const DESKTOP_SCALE = 1.1;
const MOBILE_SCALE = 0.6;

const getScaleForWidth = (width: number) =>
  width < MOBILE_BREAKPOINT ? MOBILE_SCALE : DESKTOP_SCALE;

export default function PeraturanPage() {
  const appName = import.meta.env.VITE_APP_NAME || "ZeroLib";
  useEffect(() => {
    document.title = `Peraturan - ${appName}`;
  }, []);

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(() =>
    typeof window !== "undefined" ? getScaleForWidth(window.innerWidth) : DESKTOP_SCALE
  );
  const [userAdjustedScale, setUserAdjustedScale] = useState(false);
  const [mode, setMode] = useState<"single" | "all">("single");
  const [doc, setDoc] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(route('api.document', { type: 'peraturan' }))
      .then((res) => res.json())
      .then((data) => setDoc(data.document ?? null))
      .finally(() => setLoading(false));
  }, []);

  // Keep scale in sync with viewport size, unless the user has manually zoomed.
  useEffect(() => {
    const handleResize = () => {
      if (userAdjustedScale) {
return;
}

      setScale(getScaleForWidth(window.innerWidth));
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [userAdjustedScale]);

  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const suppressObserverUntilRef = useRef(0);

  useEffect(() => {
    if (mode !== "all" || numPages === 0) {
return;
}

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressObserverUntilRef.current) {
return;
}

        let bestPage = pageNumber;
        let bestRatio = 0;
        entries.forEach((entry) => {
          const page = Number((entry.target as HTMLElement).dataset.page);

          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestPage = page;
          }
        });

        if (bestRatio > 0) {
setPageNumber(bestPage);
}
      },
      { threshold: [0.25, 0.5, 0.75, 1] }
    );

    Object.values(pageRefs.current).forEach((el) => {
      if (el) {
observer.observe(el);
}
    });

    return () => observer.disconnect();
  }, [mode, numPages]);

  const goToPage = (target: number) => {
    const clamped = Math.min(Math.max(1, target), numPages || 1);
    setPageNumber(clamped);

    if (mode === "all") {
      suppressObserverUntilRef.current = Date.now() + 700;
      const el = pageRefs.current[clamped];

      if (el) {
el.scrollIntoView({ behavior: "smooth", block: "start" });
}
    }
  };

  const zoomOut = () => {
    setUserAdjustedScale(true);
    setScale((s) => Math.max(0.6, +(s - 0.15).toFixed(2)));
  };

  const zoomIn = () => {
    setUserAdjustedScale(true);
    setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)));
  };

  const pdfFile = doc?.pdf_url ?? null;

  return (
    <div style={{ ...body, backgroundColor: C.paper50, color: C.ink900 }} className="min-h-screen flex flex-col">
      <Navbar activeSection="peraturan" />
      <section className="flex-1 max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10 pb-24 w-full">
        <Reveal>
          <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-semibold" style={{ ...display, color: C.navy900 }}>
              Peraturan
            </h2>
            {pdfFile && (
              <a
                href={pdfFile}
                download
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-md border transition-colors"
                style={{ ...body, color: C.navy900, borderColor: C.navy900 }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = C.navy900;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = C.navy900;
                }}
              >
                <Download size={14} />
                Unduh Peraturan
              </a>
            )}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="border" style={{ borderColor: "#B9C0D6" }}>
            <div
              className="flex items-center justify-between px-2 sm:px-6 py-2 sm:py-3 border-b flex-nowrap gap-1.5 sm:gap-3"
              style={{ backgroundColor: C.navy900, borderColor: "#B9C0D6" }}
            >
              <div className="flex items-center gap-1 sm:gap-4 shrink-0">
                <button
                  onClick={() => goToPage(pageNumber - 1)}
                  disabled={pageNumber <= 1}
                  className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 border disabled:opacity-30 transition-colors shrink-0"
                  style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ ...body, color: "#fff" }}>
                  <span className="hidden sm:inline">Halaman </span>
                  {pageNumber}/{numPages || "-"}
                </span>
                <button
                  onClick={() => goToPage(pageNumber + 1)}
                  disabled={pageNumber >= numPages}
                  className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 border disabled:opacity-30 transition-colors shrink-0"
                  style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                <button
                  onClick={zoomOut}
                  className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 border transition-colors shrink-0"
                  style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}
                  aria-label="Perkecil"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="text-[10px] sm:text-xs font-semibold w-7 sm:w-10 text-center shrink-0" style={{ ...body, color: "#fff" }}>
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 border transition-colors shrink-0"
                  style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}
                  aria-label="Perbesar"
                >
                  <ZoomIn size={13} />
                </button>

                <button
                  onClick={() => setMode((m) => (m === "single" ? "all" : "single"))}
                  className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 h-6 sm:h-7 border text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide transition-colors ml-0.5 sm:ml-1 shrink-0"
                  style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}
                  aria-label={mode === "single" ? "Tampilkan semua halaman (scroll)" : "Tampilkan satu halaman"}
                >
                  {mode === "single" ? <ScrollText size={12} /> : <FileText size={12} />}
                  <span className="hidden sm:inline">{mode === "single" ? "Scroll" : "1 Halaman"}</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20" style={{ backgroundColor: "#E3E6EE" }}>
                <p className="text-sm" style={{ ...body, color: C.ink500 }}>
                  Memuat...
                </p>
              </div>
            ) : !pdfFile ? (
              <div className="flex flex-col items-center justify-center py-20" style={{ backgroundColor: "#E3E6EE" }}>
                <FileText size={40} className="mb-3" style={{ color: C.ink500 }} />
                <p className="text-sm" style={{ ...body, color: C.ink500 }}>
                  Dokumen belum tersedia.
                </p>
              </div>
            ) : mode === "single" ? (
              <div className="flex justify-center py-10 overflow-x-auto" style={{ backgroundColor: "#E3E6EE" }}>
                <Document
                  file={pdfFile}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={
                    <p className="text-sm py-20" style={{ ...body, color: C.ink500 }}>
                      Memuat dokumen...
                    </p>
                  }
                  error={
                    <p className="text-sm py-20" style={{ ...body, color: C.ink500 }}>
                      Gagal memuat dokumen Peraturan.
                    </p>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    className="shadow-md"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            ) : (
              <div
                className="flex flex-col items-center gap-10 py-10 overflow-y-auto"
                style={{
                  backgroundColor: "#D5D9E3",
                  maxHeight: "80vh",
                  scrollbarWidth: "thin",
                  scrollbarColor: `${C.navy700} #D5D9E3`,
                }}
              >
                <Document
                  file={pdfFile}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={
                    <p className="text-sm py-20" style={{ ...body, color: C.ink500 }}>
                      Memuat dokumen...
                    </p>
                  }
                  error={
                    <p className="text-sm py-20" style={{ ...body, color: C.ink500 }}>
                      Gagal memuat dokumen Peraturan.
                    </p>
                  }
                >
                  {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
                    <div key={p} data-page={p} ref={(el) => {
 pageRefs.current[p] = el; 
}} className="flex flex-col items-center gap-2">
                      <Page
                        pageNumber={p}
                        scale={scale}
                        className="shadow-lg rounded-sm overflow-hidden"
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                      <span className="text-[11px] font-semibold" style={{ ...body, color: C.ink500 }}></span>
                    </div>
                  ))}
                </Document>
              </div>
            )}
          </div>
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}