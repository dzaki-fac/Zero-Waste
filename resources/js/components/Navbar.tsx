import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS, PAGE_ROUTES } from "../navData";
import { C, display } from "../theme";
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
      window.location.href = "/#" + id;
    } else {
      onNavItemClick?.(id);
    }
  };

  return (
    <>
      {/* Header pakai latar putih supaya logo UNDIP & ZeroLib tetap kebaca
          jelas. `relative` dipakai sebagai acuan posisi untuk menu mobile
          yang di-absolute-kan di bawah, jadi menu "melayang" menutupi
          konten di bawahnya alih-alih mendorongnya. */}
      <header
        className="sticky top-0 z-40 border-b relative"
        style={{ backgroundColor: "#fff", borderColor: C.line }}
      >
        <div className="w-full pl-3 sm:pl-8 pr-3 sm:pr-8 h-14 sm:h-16 flex items-center justify-between gap-2 overflow-hidden">
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
            <div className="h-4 sm:h-7 flex items-center shrink-0 overflow-hidden [&>*]:!h-full [&>*]:!w-auto [&>*]:!max-w-none">
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
                  onMouseEnter={(e) => {
 if (!active) {
e.currentTarget.style.color = C.leaf500;
} 
}}
                  onMouseLeave={(e) => {
 if (!active) {
e.currentTarget.style.color = C.ink500;
} 
}}
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

          {/* Tombol hamburger: icon di-crossfade + rotate pas ganti state,
              bukan langsung "loncat" ganti icon. Dua icon ditumpuk lalu
              opacity/rotate-nya dianimasikan bergantian. */}
          <button
            className="md:hidden shrink-0 relative w-[22px] h-[22px]"
            style={{ color: C.leaf500 }}
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Buka menu"
          >
            <Menu
              size={22}
              className="absolute inset-0 transition-all duration-300 ease-out"
              style={{
                opacity: mobileNavOpen ? 0 : 1,
                transform: mobileNavOpen ? "rotate(-90deg) scale(0.7)" : "rotate(0deg) scale(1)",
              }}
            />
            <X
              size={22}
              className="absolute inset-0 transition-all duration-300 ease-out"
              style={{
                opacity: mobileNavOpen ? 1 : 0,
                transform: mobileNavOpen ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.7)",
              }}
            />
          </button>
        </div>

        {/* Backdrop tipis di belakang menu supaya kelihatan jelas dia
            "melayang" di atas konten. Fade in/out bareng menu, dan klik di
            luar menu akan menutupnya. Selalu di-render (bukan cuma pas
            open) supaya ada transisi keluar yang halus, bukan hilang tiba². */}
        <div
          className="md:hidden fixed inset-0 top-14 sm:top-16 transition-opacity duration-300 ease-out"
          style={{
            backgroundColor: "rgba(0,0,0,0.25)",
            opacity: mobileNavOpen ? 1 : 0,
            pointerEvents: mobileNavOpen ? "auto" : "none",
          }}
          onClick={() => setMobileNavOpen(false)}
        />

        {/* Menu mobile: absolute + overlay konten di bawahnya (tidak
            mendorong layout). Dianimasikan dengan max-height + opacity +
            translate supaya buka/tutupnya smooth, dan tiap item punya
            delay bertahap (staggered) biar terasa lebih hidup. Selalu
            di-render (max-height 0 saat tertutup) supaya transisi keluar
            juga halus, bukan langsung hilang. */}
        <div
          className="md:hidden absolute top-full left-0 right-0 overflow-hidden border-t shadow-lg transition-all duration-300 ease-out"
          style={{
            backgroundColor: "#fff",
            borderColor: C.line,
            maxHeight: mobileNavOpen ? "480px" : "0px",
            opacity: mobileNavOpen ? 1 : 0,
          }}
        >
          <div className="px-5 pb-4 pt-1 flex flex-col gap-1">
            {NAV_ITEMS.map((n, i) => {
              const active = activeSection === n.id;

              return (
                <button
                  key={n.id}
                  onClick={() => handleNavClick(n.id)}
                  className="text-left px-1 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ease-out active:scale-[0.98]"
                  style={{
                    color: active ? C.leaf500 : C.ink500,
                    backgroundColor: active ? `${C.leaf500}14` : "transparent",
                    opacity: mobileNavOpen ? 1 : 0,
                    transform: mobileNavOpen ? "translateY(0px)" : "translateY(-6px)",
                    transitionDelay: mobileNavOpen ? `${i * 40}ms` : "0ms",
                  }}
                >
                  {n.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
}