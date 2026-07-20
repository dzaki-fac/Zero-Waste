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
        <div className="w-full pl-5 sm:pl-8 pr-5 sm:pr-8 h-16 flex items-center justify-between">
          {/* 3 logo disamain tingginya (h-9) & di-align tengah, apa pun
              markup internal tiap komponen logonya (img/svg) — [&>*] maksa
              elemen di dalamnya ikut tinggi wrapper & jaga rasio aslinya. */}
          <button
            type="button"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }}
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="h-9 flex items-center [&>*]:h-full [&>*]:w-auto">
              <UndipLogoIcon />
            </div>
            <div className="h-9 flex items-center [&>*]:h-full [&>*]:w-auto">
              <UptLogoIcon />
            </div>
            <div className="h-9 flex items-center [&>*]:h-full [&>*]:w-auto">
              <ZeroLibLogoIcon />
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
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
            className="md:hidden"
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