import { useEffect } from "react";
import { router } from "@inertiajs/react";

export default function ScrollToTop() {
  useEffect(() => {
    const removeListener = router.on("navigate", () => {
      window.scrollTo(0, 0);
    });
    return () => {
      removeListener();
    };
  }, []);

  return null;
}
