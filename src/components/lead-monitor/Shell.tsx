"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, Menu, MessageSquare, Moon, Settings, ShieldCheck, Sun, Target, Users, X } from "lucide-react";
import { isAdminRole, type CrmUserInfo } from "@/lib/crm-stages";
import { BRAND } from "./ui";
import { MonitorProviders } from "./filters";

const NAV = [
  { href: "/lead-monitor", label: "Dashboard", icon: Home, exact: true, headOnly: false },
  { href: "/lead-monitor/chat", label: "Chat WA", icon: MessageSquare, exact: false, headOnly: false },
  { href: "/lead-monitor/pipeline", label: "Pipeline", icon: Target, exact: false, headOnly: false },
  { href: "/lead-monitor/pelanggan", label: "Laporan & Lead", icon: Users, exact: false, headOnly: false },
  { href: "/lead-monitor/pengguna", label: "Tim Sales", icon: ShieldCheck, exact: false, headOnly: true },
  { href: "/lead-monitor/pengaturan", label: "Pengaturan", icon: Settings, exact: false, headOnly: true },
] as const;

export function MonitorShell({ user, guest = false, children }: { user: CrmUserInfo; guest?: boolean; children: ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    fetch("/api/crm/auth/me", { cache: "no-store" }).catch(() => undefined);
    try {
      const saved = localStorage.getItem("dl_crm_theme");
      if (saved === "dark" || saved === "light") setTheme(saved);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("dl_crm_theme", next);
    } catch {
      // ignore
    }
  };

  const logout = async () => {
    setLeaving(true);
    await fetch("/api/crm/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/lead-monitor/masuk");
    router.refresh();
  };

  const isAdmin = isAdminRole(user.role);
  const items = NAV.filter((n) => (!n.headOnly || isAdmin) && !(guest && n.href.endsWith("/pengaturan")));
  const isActive = (n: (typeof NAV)[number]) => (n.exact ? pathname === n.href || pathname === n.href + "/" : pathname.startsWith(n.href));

  const sidebar = (
    <div className="flex h-full flex-col" style={{ background: "var(--crm-bg-surface)", color: "var(--crm-text-primary)" }}>
      <div className="flex items-center justify-between border-b px-4 py-3.5" style={{ borderColor: "var(--crm-border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] text-xs font-bold text-white" style={{ background: BRAND }}>
            DL
          </div>
          <div>
            <div className="text-[14px] font-semibold leading-tight" style={{ color: "var(--crm-text-primary)" }}>
              Dreamlab CRM
            </div>
            <div className="text-[11px]" style={{ color: "var(--crm-text-muted)" }}>
              Sales Workspace
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "light" ? "Mode gelap" : "Mode terang"}
          aria-label={theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
          className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border transition"
          style={{
            borderColor: "var(--crm-border)",
            background: "var(--crm-bg-subtle)",
            color: "var(--crm-text-secondary)",
          }}
        >
          {theme === "light" ? <Moon className="h-3.5 w-3.5" strokeWidth={1.75} /> : <Sun className="h-3.5 w-3.5" strokeWidth={1.75} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2.5 py-3" aria-label="Menu utama">
        {items.map((n) => {
          const Icon = n.icon;
          const active = isActive(n);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13px] font-medium transition"
              style={
                active
                  ? {
                      background: "var(--crm-accent-soft)",
                      color: "var(--crm-accent)",
                      border: "1px solid var(--crm-accent-border)",
                      fontWeight: 600,
                    }
                  : {
                      color: "var(--crm-text-secondary)",
                      border: "1px solid transparent",
                    }
              }
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} style={active ? { color: BRAND } : undefined} />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3.5" style={{ borderColor: "var(--crm-border)" }}>
        <div className="mb-2.5 flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{ background: "var(--crm-accent-soft)", color: BRAND, border: "1px solid var(--crm-accent-border)" }}
          >
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold" style={{ color: "var(--crm-text-primary)" }}>
              {user.name}
            </div>
            <div className="text-[11px]" style={{ color: "var(--crm-text-muted)" }}>
              {isAdmin ? "Admin · Semua Sales" : "Busdev · Lead Sendiri"}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={leaving}
          className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-[6px] border text-xs font-semibold transition disabled:opacity-60"
          style={{
            borderColor: "var(--crm-border)",
            background: "var(--crm-bg-surface)",
            color: "var(--crm-text-secondary)",
          }}
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
          {leaving ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </div>
  );

  return (
    <MonitorProviders user={user}>
      <div
        data-theme={theme}
        className="crm-root min-h-screen antialiased lg:flex"
        style={{ background: "var(--crm-bg-canvas)", color: "var(--crm-text-primary)" }}
      >
        {/* Sidebar desktop */}
        <aside
          className="sticky top-0 hidden h-screen w-[216px] shrink-0 border-r lg:block"
          style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)" }}
        >
          {sidebar}
        </aside>

        {/* Bar atas + laci untuk layar kecil */}
        <div
          className="sticky top-0 z-40 flex h-12 items-center justify-between border-b px-3.5 lg:hidden"
          style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] text-xs font-bold text-white" style={{ background: BRAND }}>
              DL
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--crm-text-primary)" }}>
              Dreamlab CRM
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ubah tema"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border"
              style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-subtle)", color: "var(--crm-text-secondary)" }}
            >
              {theme === "light" ? <Moon className="h-4 w-4" strokeWidth={1.75} /> : <Sun className="h-4 w-4" strokeWidth={1.75} />}
            </button>
            <button
              type="button"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border"
              style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)", color: "var(--crm-text-primary)" }}
            >
              {open ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Menu className="h-4 w-4" strokeWidth={1.75} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="fixed inset-0 z-30 lg:hidden" role="dialog" aria-modal="true">
            <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div
              className="absolute left-0 top-12 h-[calc(100%-3rem)] w-[240px] border-r"
              style={{ borderColor: "var(--crm-border)", background: "var(--crm-bg-surface)" }}
            >
              {sidebar}
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </MonitorProviders>
  );
}
