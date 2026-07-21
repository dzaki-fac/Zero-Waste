import { createInertiaApp } from '@inertiajs/react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import ScrollToTop from "./components/ScrollToTop";
import PengertianPage from "./pages/pengertian";
import PeraturanPage from "./pages/peraturan";
import SOPPage from "./pages/SOPPage";
import StrukturPage from "./pages/struktur";

const appName = import.meta.env.VITE_APP_NAME || 'ZeroLib';

(function () {
    const el = document.getElementById('app');
    if (el) {
        try {
            const pageData = JSON.parse(el.getAttribute('data-page') || '{}');
            const ab = pageData.props?.assetBase;
            if (ab !== undefined && ab !== null && ab !== '') {
                window.__assetBase = ab;
            }
        } catch {
        }
    }
})();

const base = window.__assetBase || import.meta.env.BASE_URL || '/';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome' || name === 'home' || name === 'SOPPage' || name === 'pengertian' || name === 'struktur' || name === 'peraturan':
                return null;
            case name.startsWith('login/'):
                return AuthLayout;
            case name.startsWith('form/'):
                return null;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                <BrowserRouter basename={base.replace(/\/$/, '')}>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/pengertian" element={<PengertianPage />} />
                        <Route path="/struktur" element={<StrukturPage />} />
                        <Route path="/sop" element={<SOPPage />} />
                        <Route path="/peraturan" element={<PeraturanPage />} /> 
                        <Route path="*" element={<>{app}</>} />
                    </Routes>
                </BrowserRouter>
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
