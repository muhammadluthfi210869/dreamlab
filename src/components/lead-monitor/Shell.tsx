"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, Menu, Settings, ShieldCheck, Target, Users, X } from "lucide-react";
import type { CrmUserInfo } from "@/lib/crm-stages";
import { BRAND } from "./ui";
import { MonitorProviders } from "./filters";

const NAV = [
  { href: "/lead-monitor", label: "Dashboard", icon: Home, exact: true, headOnly: false },
  { href: "/lead-monitor/pelanggan", label: "Pelanggan", icon: Users, exact: false, headOnly: false },
  { href: "/lead-monitor/pipeline", label: "Sales Pipeline", icon: Target, exact: false, headOnly: false },
  { href: "/lead-monitor/pengguna", label: "Pengguna", icon: ShieldCheck, exact: false, headOnly: true },
  { href: "/lead-monitor/pengaturan", label: "Pengaturan", icon: Settings, exact: false, headOnly: false },
] as const;

export function MonitorShell({ user, guest = false, children }: { user: CrmUserInfo; guest?: boolean; children: ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Memperpanjang sesi 30 hari selama pengguna aktif (gagal tidak masalah).
  useEffect(() => {
    fetch("/api/crm/auth/me", { cache: "no-store" }).catch(() => undefined);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const logout = async () => {
    setLeaving(true);
    await fetch("/api/crm/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/lead-monitor/masuk");
    router.refresh();
  };

  const items = NAV.filter((n) => (!n.headOnly || user.role === "head") && !(guest && n.href.endsWith("/pengaturan")));
  const isActive = (n: (typeof NAV)[number]) => (n.exact ? pathname === n.href || pathname === n.href + "/" : pathname.startsWith(n.href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: BRAND }}>
          DL
        </div>
        <div>
          <div className="text-[15px] font-semibold leading-tight text-slate-900">Dreamlab CRM</div>
          <div className="text-[11px] text-slate-500">Lead Monitor</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Menu utama">
        {items.map((n) => {
          const Icon = n.icon;
          const active = isActive(n);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-[#FFF4DC] text-[#9A6200]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <Icon className="h-4 w-4 shrink-0" style={active ? { color: BRAND } : undefined} />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#ECEAE4] p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{user.name.slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">{user.name}</div>
            <div className="text-[11px] text-slate-500">{guest ? "Lihat saja · masuk untuk mengedit" : user.role === "head" ? "Head · bisa edit semua" : "BusDev · edit lead milik sendiri"}</div>
          </div>
        </div>
        {guest ? (
          <Link
            href="/lead-monitor/masuk"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-semibold text-white transition hover:opacity-90"
            style={{ background: BRAND }}
          >
            Masuk untuk mengedit
          </Link>
        ) : (
        <button
          type="button"
          onClick={logout}
          disabled={leaving}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#E5E2DA] bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <LogOut className="h-3.5 w-3.5" />
          {leaving ? "Keluar..." : "Keluar"}
        </button>
        )}
      </div>
    </div>
  );

  return (
    <MonitorProviders user={user}>
      <div className="min-h-screen bg-[#F7F6F2] text-slate-800 antialiased lg:flex">
        {/* Sidebar desktop */}
        <aside className="sticky top-0 hidden h-screen w-[236px] shrink-0 border-r border-[#ECEAE4] bg-white lg:block">{sidebar}</aside>

        {/* Bar atas + laci untuk layar kecil */}
        <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#ECEAE4] bg-white/95 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: BRAND }}>
              DL
            </div>
            <span className="text-sm font-semibold text-slate-900">Dreamlab CRM</span>
          </div>
          <button type="button" aria-label={open ? "Tutup menu" : "Buka menu"} onClick={() => setOpen((v) => !v)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E2DA] bg-white text-slate-700">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        {open && (
          <div className="fixed inset-0 z-30 lg:hidden" role="dialog" aria-modal="true">
            <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-slate-900/30" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-14 h-[calc(100%-3.5rem)] w-[260px] border-r border-[#ECEAE4] bg-white shadow-xl">{sidebar}</div>
          </div>
        )}

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </MonitorProviders>
  );
}
