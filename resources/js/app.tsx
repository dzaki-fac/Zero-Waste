import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./pages/dashboard";
import SOPPage from "./pages/SOPPage";
import PengertianPage from "./pages/pengertian";
import StrukturPage from "./pages/struktur";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pengertian" element={<PengertianPage />} />
        <Route path="/struktur" element={<StrukturPage />} />
        <Route path="/sop" element={<SOPPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
