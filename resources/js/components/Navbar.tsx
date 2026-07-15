import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { C, display } from "../theme";
import { NAV_ITEMS, PAGE_ROUTES } from "../navData";

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
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: C.navy900, borderColor: C.navy700 }}>
        <div className="w-full pl-5 sm:pl-8 pr-5 sm:pr-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/undip-logo.png"
              alt="UNDIP"
              className="w-10 h-11 rounded-md object-contain shrink-0"
            />
            <div style={display} className="leading-tight">
              <div className="text-[10px] font-semibold tracking-wide" style={{ color: C.gold500 }}>UNIVERSITAS DIPONEGORO</div>
              <div className="text-white text-[11px] tracking-wide">
                UPT PERPUSTAKAAN DAN UNDIP PRESS
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((n) => {
              const active = activeSection === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => handleNavClick(n.id)}
                  className="relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{ color: active ? "#fff" : "#D9DCEE", backgroundColor: active ? C.navy700 : "transparent" }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = C.navy700; }}
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

          <button className="md:hidden text-white" onClick={() => setMobileNavOpen((v) => !v)} aria-label="Buka menu">
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-1" style={{ backgroundColor: C.navy900 }}>
            {NAV_ITEMS.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNavClick(n.id)}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium"
                style={{ color: activeSection === n.id ? "#fff" : "#D9DCEE", backgroundColor: activeSection === n.id ? C.navy700 : "transparent" }}
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
