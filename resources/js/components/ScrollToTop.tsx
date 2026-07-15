import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (!(state as { scrollTo?: string })?.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}
