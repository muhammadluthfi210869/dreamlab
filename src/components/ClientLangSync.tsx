"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientLangSync() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.lang = pathname.startsWith("/en") ? "en" : "id";
  }, [pathname]);
  return null;
}