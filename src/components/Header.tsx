"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Helper untuk menormalisasi trailing slash dari URL (Next.js trailingSlash: true)
  const normalizePath = (p: string) => {
    if (!p) return "";
    return p === "/" ? "/" : p.replace(/\/$/, "");
  };

  const cleanPathname = normalizePath(pathname || "");

  // Fungsi komprehensif untuk mendeteksi rute aktif
  const checkIsActive = (path: string, dropdown?: Array<{ path: string }>) => {
    const cleanItemPath = normalizePath(path);
    
    if (cleanItemPath === "#") {
      if (dropdown) {
        return dropdown.some(subItem => {
          const cleanSubItemPath = normalizePath(subItem.path);
          return cleanPathname === cleanSubItemPath || cleanPathname.startsWith(cleanSubItemPath + "/");
        });
      }
      return false;
    }
    
    if (cleanItemPath === "/") {
      return cleanPathname === "/";
    }
    
    return cleanPathname === cleanItemPath || cleanPathname.startsWith(cleanItemPath + "/");
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { 
      name: "About Us", 
      path: "#",
      dropdown: [
        { name: "About Company", path: "/about-us" },
        { name: "Career", path: "/career" },
      ]
    },
    { name: "Services", path: "/services" },
    {
      name: "Product",
      path: "#",
      dropdown: [
        { name: "Maklon Skincare", path: "/produk/skincare" },
        { name: "Maklon Body Care", path: "/produk/bodycare" },
        { name: "Maklon Baby Care", path: "/produk/babycare" },
        { name: "Maklon Hair Care", path: "/produk/haircare" },
        { name: "Maklon Decorative", path: "/produk/decorative" },
        { name: "Maklon Parfum", path: "/produk/parfum" },
        { name: "Maklon Foot Care", path: "/produk/footcare" },
      ]
    },
    { name: "News & Blog", path: "/news-blog" },
    { name: "Our Client", path: "/our-client" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  const renderNavItem = (item: (typeof menuItems)[0]) => {
    const isActive = checkIsActive(item.path, item.dropdown);

    return (
      <div
        key={item.name}
        className="relative group h-full flex items-center"
        onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <Link
          href={item.path}
          className={`flex items-center gap-1 text-[13px] font-bold tracking-[0.1em] font-onest uppercase transition-all duration-200 border-b-2 pb-1
            ${isActive
              ? "text-brand-orange border-brand-orange"
              : "text-brand-black/80 hover:text-brand-orange border-transparent"}`}
        >
          {item.name}
          {item.dropdown && (
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === item.name ? "rotate-180" : ""}`} />
          )}
        </Link>

        {/* WoodMart Style Dropdown */}
        {item.dropdown && activeDropdown === item.name && (
          <div className="absolute top-full left-0 pt-2 w-max min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-b-xl border-t-2 border-brand-orange overflow-hidden">
              <ul className="py-2">
                {item.dropdown.map((subItem) => {
                  const isSubActive =
                    cleanPathname === normalizePath(subItem.path) ||
                    cleanPathname.startsWith(normalizePath(subItem.path) + "/");
                  return (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`block px-8 py-3.5 text-[11px] font-bold hover:bg-gray-50 transition-all uppercase tracking-[0.15em] font-onest border-b border-gray-50 last:border-none
                          ${isSubActive ? "text-brand-orange" : "text-brand-black/70 hover:text-brand-orange"}`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent transition-all duration-300">
      <div className="container-custom flex items-center justify-between h-22 md:h-28">
        {/* Left: Logo + All Menu Items */}
        <div className="flex items-center gap-2 lg:gap-3 xl:gap-6 2xl:gap-8">
          <Link href="/" className="flex items-center shrink-0 group transition-transform duration-300">
            <Image
              src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
              alt="Dreamlab Logo"
              title={getImageTitle("/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp")}
              width={240}
              height={78}
              className="h-16 md:h-20 xl:h-24 w-auto object-contain"
              priority
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-2 lg:gap-3 xl:gap-6 2xl:gap-8 h-full whitespace-nowrap">
            {menuItems.map(renderNavItem)}
          </nav>
        </div>

        {/* Right: Search + Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="hidden lg:flex w-12 h-12 rounded-full bg-brand-orange items-center justify-center text-white shadow-lg transition-all hover:bg-black hover:scale-110 active:scale-90">
            <Search className="w-5 h-5 stroke-[3]" />
          </button>
          <button
            className="lg:hidden p-2 text-brand-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-24 bg-brand-white z-40 overflow-y-auto px-8 py-10 space-y-10 animate-in slide-in-from-right duration-500">
          {menuItems.map((item) => {
            const isActive = checkIsActive(item.path, item.dropdown);

            return (
              <div key={item.name} className="border-b border-gray-50 pb-6 last:border-none">
                {item.dropdown ? (
                  <div className="space-y-6">
                    <div className={`text-[12px] font-black uppercase tracking-[0.3em] font-onest ${isActive ? 'text-brand-orange' : 'text-brand-black/70'}`}>
                      {item.name}
                    </div>
                    <div className="pl-4 space-y-5 border-l-2 border-brand-orange/10">
                      {item.dropdown.map((subItem) => {
                        const isSubActive = cleanPathname === normalizePath(subItem.path) || cleanPathname.startsWith(normalizePath(subItem.path) + "/");
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.path}
                            className={`block text-[14px] font-bold uppercase tracking-[0.15em] transition-colors
                              ${isSubActive ? 'text-brand-orange' : 'text-brand-black/80 hover:text-brand-orange'}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`block text-[16px] font-black uppercase tracking-[0.2em] font-onest transition-colors
                      ${isActive ? 'text-brand-orange' : 'text-brand-black hover:text-brand-orange'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}

          <div className="pt-6">
            <Link
              href="/contact-us"
              className="btn-dreamlab w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Consult Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
