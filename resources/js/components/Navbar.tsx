import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { C, display } from "../theme";
import { NAV_ITEMS, PAGE_ROUTES } from "../navData";
import UndipLogoIcon from "./Undiplogoicon";
import UptLogoIcon from "./Uptlogoicon";
import ZeroLibLogoIcon from "./Zeroliblogoicon";

interface NavbarProps {
  activeSection: string;
  onNavItemClick?: (id: string) => void;
}

export default function Navbar({ activeSection, onNavItemClick }: NavbarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (id: string) => {
    setMobileNavOpen(false);
    if (PAGE_ROUTES[id]) {
      navigate(PAGE_ROUTES[id]);
    } else if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      onNavItemClick?.(id);
    }
  };

  return (
    <>
      {/* Header sekarang pakai latar putih (bukan navy) supaya logo UNDIP &
          ZeroLib — yang teksnya gelap/hitam — tetap kebaca jelas. */}
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: "#fff", borderColor: C.line }}>
        <div className="w-full pl-3 sm:pl-8 pr-3 sm:pr-8 h-14 sm:h-16 flex items-center justify-between gap-2 overflow-hidden">
          {/* 3 logo disamain tingginya & di-align tengah, apa pun markup
              internal tiap komponen logonya (img/svg). Dipakai `!` (important)
              di [&>*] supaya class ini menang walau elemen svg/img di dalam
              komponen logo punya width/height inline sendiri — inline style
              biasanya lebih kuat dari class biasa, jadi tanpa `!` ukurannya
              bisa "kalah" dan logo tetap tampil di ukuran aslinya yang besar.
              `overflow-hidden` di wrapper tiap logo juga jadi jaring pengaman
              kalau ternyata masih ada bagian yang meluber.
              Tinggi logo jauh lebih kecil di mobile (h-5) supaya ketiga logo
              muat berdampingan tanpa mendesak, lalu kembali normal (h-9) di
              layar sm ke atas. */}
          <button
            type="button"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }}
            className="flex items-center gap-1.5 sm:gap-4 cursor-pointer min-w-0 overflow-hidden"
          >
            <div className="h-5 sm:h-9 flex items-center shrink-0 overflow-hidden [&>*]:!h-full [&>*]:!w-auto [&>*]:!max-w-none">
              <UndipLogoIcon />
            </div>
            <div className="h-5 sm:h-9 flex items-center shrink-0 overflow-hidden [&>*]:!h-full [&>*]:!w-auto [&>*]:!max-w-none">
              <UptLogoIcon />
            </div>
            <div className="h-5 sm:h-9 flex items-center shrink-0 overflow-hidden [&>*]:!h-full [&>*]:!w-auto [&>*]:!max-w-none">
              <ZeroLibLogoIcon />
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
            {NAV_ITEMS.map((n) => {
              const active = activeSection === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => handleNavClick(n.id)}
                  className="relative py-2 text-sm font-semibold tracking-wide transition-colors"
                  style={{ ...display, color: active ? C.leaf500 : C.ink500 }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = C.leaf500; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = C.ink500; }}
                >
                  {n.label}
                  <span
                    className="absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full"
                    style={{
                      backgroundColor: C.leaf500,
                      transform: active ? "scaleX(1)" : "scaleX(0)",
                      transition: "transform 220ms ease",
                    }}
                  />
                </button>
              );
            })}
          </nav>

          <button
            className="md:hidden shrink-0"
            style={{ color: C.leaf500 }}
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Buka menu"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-1 border-t" style={{ backgroundColor: "#fff", borderColor: C.line }}>
            {NAV_ITEMS.map((n) => {
              const active = activeSection === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => handleNavClick(n.id)}
                  className="text-left px-1 py-2.5 text-sm font-semibold"
                  style={{ color: active ? C.leaf500 : C.ink500 }}
                >
                  {n.label}
                </button>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
}