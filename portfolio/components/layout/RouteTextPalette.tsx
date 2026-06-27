"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const EXCLUDED_PREFIXES = [
  "/nguyenthiyennhi-klcn-ai-logistics-doc-extractor",
] as const;

export function RouteTextPalette() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const enabled = !EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    document.body.classList.toggle("site-text-palette", enabled);

    return () => {
      document.body.classList.remove("site-text-palette");
    };
  }, [pathname]);

  return null;
}
