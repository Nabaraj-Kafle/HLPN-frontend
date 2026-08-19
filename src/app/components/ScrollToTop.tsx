import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait until React has rendered the target element
      requestAnimationFrame(() => {
        const element = document.getElementById(hash.substring(1));

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });

      return;
    }

    // Normal page navigation: go to the top
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}