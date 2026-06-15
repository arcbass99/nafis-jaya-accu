"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const cleanHashFromUrl = () => {
  if (!window.location.hash) return;

  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
};

export default function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (hash) {
          const target = document.getElementById(hash);
          if (target) {
            target.scrollIntoView({ block: "start" });
          } else {
            window.scrollTo(0, 0);
          }

          cleanHashFromUrl();
          return;
        }

        window.scrollTo(0, 0);
      });
    });
  }, [pathname]);

  return null;
}
