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
          <div className="flex items-center gap-3">
            <UndipLogoIcon />
            <UptLogoIcon />
            <ZeroLibLogoIcon />
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((n) => {
              const active = activeSection === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => handleNavClick(n.id)}
                  className="relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{ color: active ? C.navy900 : C.ink500, backgroundColor: active ? C.navy050 : "transparent" }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = C.navy050; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {n.label}
                  <span
                    className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full"
                    style={{
                      backgroundColor: C.leaf400,
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
            style={{ color: C.navy900 }}
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
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-medium"
                  style={{ color: active ? C.navy900 : C.ink500, backgroundColor: active ? C.navy050 : "transparent" }}
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