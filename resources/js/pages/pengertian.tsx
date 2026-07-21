import { Info, Scale, MapPin, X, Eye } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Reveal } from "../components/shared";
import { C, display, body } from "../theme";

type DetailItem = {
    key: string;
    icon: typeof Info;
    title: string;
    shortDesc: string;
    image: string;
    fullDesc?: string;
};

const PENGERTIAN_ITEMS: DetailItem[] = [
    {
        key: "definisi",
        icon: Info,
        title: "Definisi",
        shortDesc:
            "ZeroLib adalah sistem digital pengelolaan sampah UPT Perpustakaan dan UNDIP Press Universitas Diponegoro yang mengintegrasikan proses pengelolaan sampah secara terdokumentasi dan berbasis data, mulai dari identifikasi sumber, pemilahan, penimbangan, pencatatan, hingga penyaluran ke pengolahan akhir.",
        image: "https://i.pinimg.com/736x/29/7a/3b/297a3b56abc377a1c12c9382c934ee7d.jpg",
        fullDesc: `Perpustakaan bukan hanya pusat ilmu pengetahuan, tetapi juga ruang publik yang menjadi tempat belajar, berdiskusi, berkolaborasi, dan berinteraksi bagi sivitas akademika. Tingginya aktivitas di lingkungan perpustakaan menjadikan kebersihan sebagai salah satu aspek penting dalam menjaga kenyamanan, kesehatan, dan kualitas layanan. Berbagai aktivitas tersebut secara alami menghasilkan sampah yang memerlukan pengelolaan secara tepat agar tidak mengganggu kebersihan lingkungan. Oleh karena itu, pengelolaan kebersihan dan sampah menjadi bagian yang tidak terpisahkan dalam mewujudkan perpustakaan yang bersih, sehat, nyaman, dan berkelanjutan.

ZeroLib hadir sebagai sistem digital yang mengintegrasikan pengelolaan kebersihan dan sampah di lingkungan UPT Perpustakaan dan UNDIP Press Universitas Diponegoro. Sistem ini mengintegrasikan seluruh proses pengelolaan sampah secara terdokumentasi dan berbasis data, mulai dari identifikasi sumber penghasil sampah, proses pemilahan berdasarkan kategori, penimbangan, pencatatan volume harian, hingga penyaluran ke mitra atau tempat pengolahan akhir.

Melalui ZeroLib, pengelolaan kebersihan dan sampah tidak lagi sekadar menjadi kegiatan operasional, melainkan menjadi sumber informasi yang dapat diukur, dipantau, dan dianalisis untuk mendukung pengambilan keputusan. Dengan proses yang transparan, akuntabel, dan terdokumentasi, ZeroLib mendukung penerapan prinsip 5R (Reduce, Reuse, Recycle, Recover, dan Responsible Disposal) sebagai langkah nyata dalam mewujudkan perpustakaan yang bersih, hijau, cerdas, dan berkelanjutan.`,
    },
    {
        key: "prinsip",
        icon: Scale,
        title: "Prinsip",
        shortDesc:
            "ZeroLib mendukung penerapan prinsip 5R, yaitu Reduce, Reuse, Recycle, Refuse, dan ROT, di setiap tahap pengelolaan sampah perpustakaan.",
        image: "https://i0.wp.com/www.whenateengoesgreen.com/wp-content/uploads/2019/04/5-rs-of-zero-waste-refuse-reduce-reuse-recycle-rot.png?fit=721%2C893&ssl=1",
        fullDesc: `Prinsip 5R yang diterapkan dalam ZeroLib:

1. Reduce (Mengurangi)
Mengurangi penggunaan barang yang berpotensi menjadi sampah. Contoh: mengurangi penggunaan kertas sekali pakai dan beralih ke dokumen digital.

2. Reuse (Menggunakan Kembali)
Memanfaatkan kembali barang yang masih dapat digunakan tanpa melalui proses daur ulang. Contoh: menggunakan kembali kertas bekas untuk catatan.

3. Recycle (Mendaur Ulang)
Mengolah kembali sampah menjadi produk baru yang bernilai guna. Contoh: mendaur ulang kertas, plastik, dan kardus.

4. Recover (Pemulihan)
Mengambil kembali sumber daya atau energi dari sampah yang tidak dapat didaur ulang. Contoh: mengolah sampah organik menjadi kompos.

5. Responsible Disposal (Pembuangan yang Bertanggung Jawab)
Membuang sampah yang benar-benar tidak dapat diolah dengan cara yang aman dan ramah lingkungan.`,
    },
    {
        key: "manfaat",
        icon: Info,
        title: "Manfaat",
        shortDesc:
            "Melalui ZeroLib, setiap sampah tidak lagi dipandang sebagai limbah semata, melainkan sebagai data yang dapat diukur, dipantau, dan dianalisis secara berkala untuk mendukung proses pengelolaan yang transparan, akuntabel, serta perpustakaan yang lebih hijau dan berkelanjutan.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80",
        fullDesc: `Bagi Lingkungan
• Mewujudkan lingkungan perpustakaan yang bersih, nyaman, sehat, dan berkelanjutan.
• Mendukung monitoring kebersihan lingkungan perpustakaan secara lebih terstruktur.
• Mengurangi timbulan sampah yang berakhir di Tempat Pembuangan Akhir (TPA).
• Meningkatkan tingkat pemilahan dan pemanfaatan kembali sampah.
• Mendukung terciptanya budaya peduli kebersihan dan kelestarian lingkungan.

Bagi Pengelolaan
• Mengintegrasikan data pengelolaan kebersihan dan sampah dalam satu sistem.
• Seluruh data pengelolaan sampah terdokumentasi secara sistematis.
• Memudahkan monitoring kondisi kebersihan serta volume sampah harian, mingguan, maupun bulanan.
• Menyediakan informasi yang akurat untuk evaluasi dan penyusunan kebijakan pengelolaan kebersihan dan sampah.
• Mempermudah pelaporan kegiatan pengelolaan kebersihan dan sampah secara transparan dan akuntabel.

Bagi Sivitas Akademika
• Meningkatkan kesadaran dan partisipasi dalam menjaga kebersihan lingkungan perpustakaan.
• Mendorong kebiasaan memilah sampah sesuai kategorinya.
• Menumbuhkan budaya peduli lingkungan di lingkungan kampus.
• Menjadi media edukasi mengenai pengelolaan kebersihan dan sampah berbasis data.

Bagi Institusi
• Mendukung implementasi program Green Campus dan Zero Waste.
• Meningkatkan kualitas pengelolaan kebersihan dan lingkungan di UPT Perpustakaan dan UNDIP Press.
• Menjadi bukti digital penerapan pengelolaan kebersihan dan sampah yang terdokumentasi.
• Mendukung pengambilan keputusan berbasis data untuk peningkatan kualitas pengelolaan lingkungan.
• Menjadi model pengelolaan kebersihan dan sampah yang dapat direplikasi di unit atau fakultas lain.`,
    },
    {
        key: "ruang-lingkup",
        icon: MapPin,
        title: "Ruang Lingkup",
        shortDesc:
            "Ruang lingkup program mencakup seluruh area Perpustakaan Universitas Diponegoro, meliputi lantai satu hingga empat, area baca, ruang kantor, ruang pertemuan, toilet, teras, halaman, area parkir, dan UNDIP Press sebagai bagian dari lingkungan operasional perpustakaan.",
        image: "/perpus.jpeg",
    },
];

function useHasHover() {
    const [hasHover, setHasHover] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
        setHasHover(mql.matches);
        const handleChange = (e: MediaQueryListEvent) => setHasHover(e.matches);
        mql.addEventListener("change", handleChange);

        return () => mql.removeEventListener("change", handleChange);
    }, []);

    return hasHover;
}

function useLockBodyScroll(locked: boolean) {
    useEffect(() => {
        if (!locked) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = original; };
    }, [locked]);
}

function DetailModal({ item, onClose }: { item: DetailItem; onClose: () => void }) {
    const [animating, setAnimating] = useState(false);
    const Icon = item.icon;

    useLockBodyScroll(true);

    useEffect(() => {
        requestAnimationFrame(() => setAnimating(true));
    }, []);

    const handleClose = useCallback(() => {
        setAnimating(false);
        setTimeout(onClose, 200);
    }, [onClose]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [handleClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                backgroundColor: "rgba(10, 20, 64, 0.55)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
            }}
            onClick={handleClose}
        >
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                aria-label="Tutup"
            >
                <X size={20} />
            </button>

            <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[90vh] w-[95vw] max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-xl md:max-w-2xl"
                style={{
                    opacity: animating ? 1 : 0,
                    transform: animating ? "scale(1) translateY(0)" : "scale(0.92) translateY(24px)",
                    transition: "opacity 300ms ease-out, transform 300ms ease-out",
                }}
            >
                <div className="shrink-0 bg-gray-50 px-5 py-4 sm:px-6 sm:py-5">
                    <div className="flex items-center gap-3">
                        <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: C.leaf100 }}
                        >
                            <Icon size={18} color={C.leaf500} strokeWidth={2} />
                        </span>
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold sm:text-xl" style={{ ...display, color: C.navy900 }}>
                                {item.title}
                            </h3>
                            <p className="text-xs text-gray-500">Detail {item.title} ZeroLib</p>
                        </div>
                    </div>
                </div>

                <div
                    className="flex-1 overflow-y-auto px-5 py-5 text-sm leading-relaxed whitespace-pre-line sm:px-6"
                    style={{ color: C.ink500 }}
                >
                    {item.fullDesc}
                </div>
            </div>
        </div>
    );
}

function PengertianContent() {
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [modalItem, setModalItem] = useState<DetailItem | null>(null);
    const hasHover = useHasHover();

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PENGERTIAN_ITEMS.map((it) => {
                    const Icon = it.icon;
                    const isOpen = activeKey === it.key;
                    const hasDetail = !!it.fullDesc;

                    const hoverHandlers = hasHover
                        ? {
                            onMouseEnter: () => setActiveKey(it.key),
                            onMouseLeave: () => setActiveKey((prev) => (prev === it.key ? null : prev)),
                        }
                        : {};

                    const tapHandlers = !hasHover
                        ? {
                            onClick: () => setActiveKey((prev) => (prev === it.key ? null : it.key)),
                        }
                        : {};

                    const handleDetailClick = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        setModalItem(it);
                    };

                    return (
                        <button
                            key={it.key}
                            {...hoverHandlers}
                            {...tapHandlers}
                            className="relative rounded-2xl overflow-hidden text-left w-full"
                            style={{ aspectRatio: "4 / 5" }}
                            aria-expanded={isOpen}
                            aria-label={it.title}
                        >
                            <img
                                src={it.image}
                                alt={it.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ transform: isOpen ? "scale(1.06)" : "scale(1)", transition: "transform 450ms cubic-bezier(0.16,1,0.3,1)" }}
                                onError={(e) => {
                                    const el = e.currentTarget;
                                    el.style.display = "none";
                                    const parent = el.parentElement;
                                    if (parent) {
                                        parent.style.background = `linear-gradient(160deg, ${C.navy700}, ${C.navy900})`;
                                        const iconEl = document.createElement("span");
                                        iconEl.className = "absolute inset-0 flex items-center justify-center";
                                        iconEl.innerHTML = `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></svg>`;
                                        parent.appendChild(iconEl);
                                    }
                                }}
                            />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(10,20,64,0.65) 0%, rgba(10,20,64,0) 40%)", opacity: isOpen ? 0 : 1, transition: "opacity 250ms ease" }} />
                            <div className="absolute left-4 right-4 bottom-4 flex items-center gap-2" style={{ opacity: isOpen ? 0 : 1, transition: "opacity 200ms ease" }}>
                                <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
                                    <Icon size={15} color="#fff" strokeWidth={2} />
                                </span>
                                <span className="text-white text-sm font-semibold" style={display}>{it.title}</span>
                            </div>
                            <div
                                className={`absolute left-0 right-0 bottom-0 flex flex-col p-5 ${hasDetail ? 'justify-center' : 'justify-end'}`}
                                style={{ height: hasDetail ? "100%" : "72%", background: "linear-gradient(160deg, rgba(16,27,82,0.92), rgba(47,163,106,0.88))", backdropFilter: "blur(3px)", transform: isOpen ? "translateY(0)" : "translateY(100%)", transition: "transform 700ms cubic-bezier(0.16,1,0.3,1)" }}
                            >
                                <div className="text-white text-lg font-semibold mb-2" style={display}>{it.title}</div>
                                <p
                                    className="text-xs leading-relaxed mb-3"
                                    style={{ color: "rgba(255,255,255,0.92)", textAlign: "justify", textJustify: "inter-word" }}
                                >
                                    {it.shortDesc}
                                </p>
                                {hasDetail && (
                                    <button
                                        type="button"
                                        onClick={handleDetailClick}
                                        className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                                    >
                                        <Eye size={14} />
                                        Lihat Detail
                                    </button>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {modalItem && (
                <DetailModal item={modalItem} onClose={() => setModalItem(null)} />
            )}
        </>
    );
}

export default function PengertianPage() {
    const appName = import.meta.env.VITE_APP_NAME || 'ZeroLib';
    useEffect(() => {
        document.title = `Tentang ZeroLib - ${appName}`;
    }, []);

    return (
        <div style={{ ...body, backgroundColor: C.paper50, color: C.ink900 }} className="min-h-screen">
            <Navbar activeSection="pengertian" />
            <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-24">
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
