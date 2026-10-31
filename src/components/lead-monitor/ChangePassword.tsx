"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { BRAND } from "./ui";

/**
 * Formulir ganti kata sandi. Dipakai di halaman Pengaturan dan di layar wajib-ganti (kata sandi awal = nama).
 * Kata sandi tidak pernah dicatat; server hanya menyimpan hash-nya.
 */
export function ChangePasswordForm({ forced, name, onDone }: { forced: boolean; name: string; onDone: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const hints = [
    { ok: next.length >= 8, text: "Minimal 8 karakter" },
    { ok: next.length > 0 && !next.toLowerCase().includes(name.toLowerCase()), text: "Tidak memuat nama Anda" },
    { ok: again.length > 0 && next === again, text: "Kedua isian sama" },
  ];

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (busy) return;
    if (next !== again) return setError("Kata sandi baru dan konfirmasinya tidak sama");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) return setError(json.error || "Gagal mengganti kata sandi");
      setOk(true);
      setCurrent("");
      setNext("");
      setAgain("");
      onDone();
    } catch {
      setError("Tidak bisa terhubung ke server. Coba lagi.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "h-11 w-full rounded-lg border border-[#E5E2DA] bg-white px-3 text-sm text-slate-900 focus:border-[#D98A00] focus:outline-none focus:ring-2 focus:ring-[#D98A00]/20";
  const type = show ? "text" : "password";

  return (
    <form onSubmit={submit}>
      <input type="text" name="username" autoComplete="username" value={name} readOnly hidden />

      <label className="mb-1 block text-xs font-semibold text-slate-600" htmlFor="pw-now">
        {forced ? "Kata sandi awal (nama Anda)" : "Kata sandi saat ini"}
      </label>
      <input id="pw-now" type={type} autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={`${field} mb-4`} required />

      <label className="mb-1 block text-xs font-semibold text-slate-600" htmlFor="pw-new">
        Kata sandi baru
      </label>
      <input id="pw-new" type={type} autoComplete="new-password" value={next} maxLength={100} onChange={(e) => setNext(e.target.value)} className={`${field} mb-4`} required />

      <label className="mb-1 block text-xs font-semibold text-slate-600" htmlFor="pw-again">
        Ulangi kata sandi baru
      </label>
      <input id="pw-again" type={type} autoComplete="new-password" value={again} maxLength={100} onChange={(e) => setAgain(e.target.value)} className={`${field} mb-3`} required />

      <button type="button" onClick={() => setShow((v) => !v)} className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-800">
        {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        {show ? "Sembunyikan" : "Tampilkan"} kata sandi
      </button>

      <ul className="mb-4 space-y-1 text-[11px]">
        {hints.map((h) => (
          <li key={h.text} className={h.ok ? "text-emerald-700" : "text-slate-400"}>
            {h.ok ? "✓" : "•"} {h.text}
          </li>
        ))}
      </ul>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
          {error}
        </div>
      )}
      {ok && !forced && (
        <div role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          Kata sandi berhasil diganti. Perangkat lain yang tadinya masuk otomatis dikeluarkan.
        </div>
      )}

      <button type="submit" disabled={busy || !current || !next || !again} className="inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold text-white transition disabled:opacity-50" style={{ background: BRAND }}>
        {busy ? "Menyimpan..." : "Simpan kata sandi baru"}
      </button>
    </form>
  );
}
