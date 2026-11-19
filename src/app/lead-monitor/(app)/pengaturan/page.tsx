"use client";

import { Card } from "@/components/lead-monitor/ui";
import { ChangePasswordForm } from "@/components/lead-monitor/ChangePassword";
import { useMe } from "@/components/lead-monitor/filters";

export default function PengaturanPage() {
  const me = useMe();
  return (
    <div>
      <header className="border-b border-[#ECEAE4] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[900px] items-center px-4 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold leading-tight text-slate-900">Pengaturan</h1>
            <p className="text-xs text-slate-500">Akun dan keamanan</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] space-y-5 px-4 py-6 sm:px-6">
        <Card title="Akun" subtitle="Masuk sebagai">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">{me.name.slice(0, 1).toUpperCase()}</div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{me.name}</div>
              <div className="text-xs text-slate-500">{me.role === "head" ? "Head · bisa mengedit semua lead dan mengelola akun" : "BusDev · bisa mengedit lead milik sendiri"}</div>
            </div>
          </div>
        </Card>

        <Card title="Ganti kata sandi" subtitle="Setelah diganti, perangkat lain yang sedang masuk dikeluarkan otomatis.">
          <div className="max-w-sm">
            <ChangePasswordForm forced={false} name={me.name} onDone={() => undefined} />
          </div>
        </Card>
      </main>
    </div>
  );
}
