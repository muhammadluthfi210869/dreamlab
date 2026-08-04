"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { normalizeSeoPath } from "@/lib/seo-url-policy";
import { getEnPath, isEnPath } from "@/lib/seo-lang";

/**
 * LanguageSwitcher — tombol EN/ID di header.
 *
 * - Di halaman Indonesia (punya versi EN) -> link ke /en/...
 * - Di halaman English (/en/...) -> link ke versi Indonesia
 * - Halaman tanpa versi EN -> tidak menampilkan apa pun
 */
export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const normalized = normalizeSeoPath(pathname);
  const isEn = isEnPath(normalized);

  let href: string | null;
  let label: string;
  let title: string;

  if (isEn) {
    href = normalized.replace(/^\/en/, "") || "/";
    label = "ID";
    title = "Bahasa Indonesia";
  } else {
    href = getEnPath(normalized);
    label = "EN";
    title = "English";
  }

  if (!href) return null;

  return (
    <Link
      href={href}
      title={title}
      className="flex h-10 min-w-[44px] items-center justify-center rounded-full border-2 border-brand-orange px-3 text-[11px] font-black uppercase tracking-wider text-brand-orange transition-all hover:bg-brand-orange hover:text-white"
    >
      {label}
    </Link>
  );
}
