"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { BRAND, Card } from "@/components/lead-monitor/ui";
import { useMe } from "@/components/lead-monitor/filters";

interface UserRow {
  id: number;
  name: string;
  role: "head" | "sales";
  is_active: boolean;
  using_initial_password: boolean;
  is_locked: boolean;
  last_login_at: string | null;
  password_changed_at: string | null;
  sessions: number;
}

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "belum pernah";

export default function PenggunaPage() {
  const me = useMe();
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"sales" | "head">("sales");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/users", { cache: "no-store" });
      if (res.status === 401) return void (window.location.href = "/lead-monitor/masuk");
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || `Status ${res.status}`);
      setUsers(json.users as UserRow[]);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Gagal memuat");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (u: UserRow, action: string) => {
    if (action === "reset-password" && !window.confirm(`Reset kata sandi ${u.name}? Perangkat ${u.name} akan dikeluarkan dan kata sandinya kembali ke nama.`)) return;
    setBusy(`${u.id}:${action}`);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch(`/api/crm/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal");
      if (action === "reset-password") setInfo(`Kata sandi ${json.name} dikembalikan ke nama ${json.name} (huruf kecil). Yang bersangkutan diminta menggantinya saat masuk.`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Gagal");
    } finally {
      setBusy(null);
    }
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy("add");
    setError(null);
    try {
      const res = await fetch("/api/crm/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, role: newRole }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal");
      setNewName("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Gagal");
    } finally {
      setBusy(null);
    }
  };

  const btn = "h-8 rounded-md border border-[#E5E2DA] bg-white px-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50";

  if (me.role !== "head") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="rounded-xl border border-[#ECEAE4] bg-white p-6 text-sm text-slate-600">Halaman ini hanya untuk Head.</p>
      </main>
    );
  }

  return (
    <div>
      <header className="border-b border-[#ECEAE4] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center px-4 sm:px-6">
          <div>
            <h1 className="text-[17px] font-semibold leading-tight text-slate-900">Pengguna</h1>
            <p className="text-xs text-slate-500">Kelola akun, reset kata sandi, dan akses masuk</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] space-y-5 px-4 py-6 sm:px-6">
        {error && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
            {error}
          </div>
        )}

        {info && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
            {info}
          </div>
        )}

        <Card title="Akun" subtitle="Kata sandi awal = nama akun (huruf kecil), wajib diganti saat pertama masuk. Kata sandi tidak pernah terlihat oleh siapa pun.">
          {!users ? (
            <p className="py-6 text-center text-xs text-slate-400">Memuat...</p>
          ) : (
            <div className="-mx-5 overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-y border-[#ECEAE4] bg-[#FAFAF8] text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-semibold">Nama</th>
                    <th className="px-4 py-3 font-semibold">Peran</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Terakhir masuk</th>
                    <th className="px-4 py-3 font-semibold">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFEA]">
                  {users.map((u) => (
                    <tr key={u.id} className={u.is_active ? "" : "opacity-60"}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.role === "head" ? "Head (edit semua)" : "BusDev (edit milik sendiri)"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {!u.is_active && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">Nonaktif</span>}
                          {u.is_active && u.using_initial_password && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700" title="Masih memakai kata sandi awal (nama). Belum mengganti.">Belum ganti kata sandi</span>}
                          {u.is_active && !u.using_initial_password && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Kata sandi sendiri</span>}
                          {u.is_locked && <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">Terkunci</span>}
                          {u.sessions > 0 && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">{u.sessions} perangkat</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{fmt(u.last_login_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {u.is_active && (
                            <button type="button" className={btn} disabled={busy !== null} onClick={() => act(u, "reset-password")}>
                              Reset kata sandi
                            </button>
                          )}
                          {u.is_locked && (
                            <button type="button" className={btn} disabled={busy !== null} onClick={() => act(u, "unlock")}>
                              Buka kunci
                            </button>
                          )}
                          {u.sessions > 0 && (
                            <button type="button" className={btn} disabled={busy !== null} onClick={() => act(u, "logout-all")}>
                              Keluarkan dari semua perangkat
                            </button>
                          )}
                          {u.is_active ? (
                            u.id !== me.id && (
                              <button type="button" className={`${btn} text-rose-700`} disabled={busy !== null} onClick={() => act(u, "deactivate")}>
                                Nonaktifkan
                              </button>
                            )
                          ) : (
                            <button type="button" className={btn} disabled={busy !== null} onClick={() => act(u, "activate")}>
                              Aktifkan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Tambah akun" subtitle="Nama BusDev harus sama persis dengan nama di daftar BusDev (dipakai untuk menentukan lead milik siapa).">
          <form onSubmit={add} className="flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-500" htmlFor="nn">
                Nama
              </label>
              <input id="nn" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={40} className="h-9 w-48 rounded-lg border border-[#E5E2DA] px-3 text-sm focus:border-[#D98A00] focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-500" htmlFor="nr">
                Peran
              </label>
              <select id="nr" value={newRole} onChange={(e) => setNewRole(e.target.value as "sales" | "head")} className="h-9 rounded-lg border border-[#E5E2DA] bg-white px-2 text-sm focus:border-[#D98A00] focus:outline-none">
                <option value="sales">BusDev</option>
                <option value="head">Head</option>
              </select>
            </div>
            <button type="submit" disabled={busy !== null || !newName.trim()} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-white disabled:opacity-50" style={{ background: BRAND }}>
              <Plus className="h-3.5 w-3.5" />
              Tambah
            </button>
          </form>
        </Card>
      </main>
    </div>
  );
}
