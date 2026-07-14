import { useState } from 'react';

const navStyles: Record<string, React.CSSProperties> = {
    navbar: {
        background: '#000a66',
        color: '#fff',
        fontFamily: 'Roboto, sans-serif',
        position: 'relative',
        zIndex: 100,
    },
    topBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '12px 20px',
    },
    logoArea: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
    },
    logoImg: {
        height: 50,
        width: 'auto',
    },
    logoText: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.3,
    },
    logoTitle: {
        fontSize: 15,
        fontWeight: 700,
        color: '#fff',
    },
    logoSub: {
        fontSize: 11,
        color: '#b0bec5',
    },
    mainMenu: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        listStyle: 'none',
        margin: 0,
        padding: 0,
    },
    menuItem: {
        position: 'relative',
    },
    menuLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '8px 14px',
        color: '#fff',
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 4,
        transition: 'background 0.2s',
        cursor: 'pointer',
        whiteSpace: 'nowrap' as const,
        background: 'none',
        border: 'none',
        fontFamily: 'inherit',
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        background: '#fff',
        minWidth: 220,
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        listStyle: 'none',
        margin: 0,
        padding: '8px 0',
        zIndex: 200,
    },
    dropdownLink: {
        display: 'block',
        padding: '10px 18px',
        color: '#333',
        textDecoration: 'none',
        fontSize: 13,
        transition: 'background 0.2s',
    },
    rightArea: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
    },
    flagBtn: {
        background: 'none',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 4,
        padding: '4px 8px',
        cursor: 'pointer',
        fontSize: 18,
        lineHeight: 1,
        transition: 'border-color 0.2s',
    },
    secondBar: {
        background: 'rgba(0,0,0,0.15)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    secondBarInner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '6px 20px',
    },
    secondLink: {
        color: '#b0bec5',
        textDecoration: 'none',
        fontSize: 13,
        fontWeight: 500,
        transition: 'color 0.2s',
        whiteSpace: 'nowrap' as const,
    },
    hamburger: {
        display: 'none',
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: 24,
        cursor: 'pointer',
        padding: 8,
    },
    mobileMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: '#000a66',
        padding: '12px 20px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        zIndex: 200,
    },
    mobileLink: {
        display: 'block',
        padding: '12px 14px',
        color: '#fff',
        textDecoration: 'none',
        fontSize: 14,
        borderRadius: 4,
        transition: 'background 0.2s',
    },
};

const mainNavItems = [
    {
        label: 'Form',
        children: ['Penimbangan', 'Pilah Sampah', 'Distribusi'],
    },
    {
        label: 'SOP',
        children: ['SOP Penimbangan', 'SOP Pilah Sampah', 'SOP Distribusi'],
    },
    {
        label: 'Denah',
    },
    {
        label: 'Peraturan',
    },
    {
        label: 'Struktur PJ',
    },
    {
        label: 'Petugas PJ',
    },
    {
        label: 'Alur',
    },
];

const secondNavItems: string[] = [];

export default function Navbar() {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);

    return (
        <nav style={navStyles.navbar}>
            {/* Top Bar */}
            <div style={navStyles.topBar}>
                {/* Logo */}
                <div style={navStyles.logoArea}>
                    <img src="/images/undip-logo.png" alt="UNDIP" style={navStyles.logoImg} />
                    <div style={navStyles.logoText}>
                        <span style={navStyles.logoTitle}>Universitas Diponegoro</span>
                        <span style={navStyles.logoSub}>UPT Perpustakaan dan Undip Press</span>
                    </div>
                </div>

                {/* Desktop Menu */}
                <ul
                    style={{
                        ...navStyles.mainMenu,
                    }}
                    className="navbar-main-menu"
                >
                    {mainNavItems.map((item, i) => (
                        <li
                            key={item.label}
                            style={navStyles.menuItem}
                            onMouseEnter={() => item.children && setOpenDropdown(i)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <button
                                style={navStyles.menuLink}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'none';
                                }}
                            >
                                {item.label}
                                {item.children && <span style={{ fontSize: 10 }}>▼</span>}
                            </button>
                            {item.children && openDropdown === i && (
                                <ul style={navStyles.dropdown}>
                                    {item.children.map((child) => (
                                        <li key={child}>
                                            <a
                                                href="#"
                                                style={navStyles.dropdownLink}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#f0f0f0';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'none';
                                                }}
                                            >
                                                {child}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Right: Hamburger */}
                <div style={navStyles.rightArea}>
                    <button
                        className="navbar-hamburger"
                        style={navStyles.hamburger}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Second Bar */}
            {secondNavItems.length > 0 && (
                <div style={navStyles.secondBar} className="navbar-second-bar">
                    <div style={navStyles.secondBarInner}>
                        {secondNavItems.map((item) => (
                            <a
                                key={item}
                                href="#"
                                style={navStyles.secondLink}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#b0bec5';
                                }}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {mobileOpen && (
                <div style={navStyles.mobileMenu} className="navbar-mobile-menu">
                    {mainNavItems.map((item, i) => (
                        <div key={item.label}>
                            <a
                                href="#"
                                style={navStyles.mobileLink}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (item.children) {
                                        setMobileDropdown(mobileDropdown === i ? null : i);
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'none';
                                }}
                            >
                                {item.label}
                                {item.children && (mobileDropdown === i ? ' ▲' : ' ▼')}
                            </a>
                            {item.children && mobileDropdown === i && (
                                <div style={{ paddingLeft: 16 }}>
                                    {item.children.map((child) => (
                                        <a
                                            key={child}
                                            href="#"
                                            style={{
                                                ...navStyles.mobileLink,
                                                fontSize: 13,
                                                color: '#b0bec5',
                                            }}
                                        >
                                            {child}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 8, paddingTop: 8 }}>
                        {secondNavItems.map((item) => (
                            <a
                                key={item}
                                href="#"
                                style={{ ...navStyles.mobileLink, fontSize: 13, color: '#b0bec5' }}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .navbar-main-menu {
                        display: none !important;
                    }
                    .navbar-hamburger {
                        display: block !important;
                    }
                    .navbar-second-bar {
                        display: none !important;
                    }
                }
            `}</style>
        </nav>
    );
}
