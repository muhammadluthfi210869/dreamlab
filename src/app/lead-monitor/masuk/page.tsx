"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

const BRAND = "#D98A00";

export default function MasukPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, remember }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        setError(json.error || "Gagal masuk");
        setPassword("");
        return;
      }
      router.replace("/lead-monitor");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server. Coba lagi.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "h-11 w-full rounded-lg border border-[#E5E2DA] bg-white px-3 text-sm text-slate-900 focus:border-[#D98A00] focus:outline-none focus:ring-2 focus:ring-[#D98A00]/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-[#ECEAE4] bg-white p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: BRAND }}>
            DL
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-slate-900">Dreamlab CRM</h1>
            <p className="text-xs text-slate-500">Masuk dengan nama dan kata sandi Anda</p>
          </div>
        </div>

        <label className="mb-1 block text-xs font-semibold text-slate-600" htmlFor="nama">
          Nama
        </label>
        <input id="nama" autoComplete="username" value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Annisa" className={`${field} mb-4`} required />

        <label className="mb-1 block text-xs font-semibold text-slate-600" htmlFor="kata-sandi">
          Kata sandi
        </label>
        <div className="relative mb-3">
          <input
            id="kata-sandi"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${field} pr-11`}
            required
          />
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-700">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <label className="mb-4 flex cursor-pointer items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-[#E5E2DA] accent-[#D98A00]" />
          Ingat saya selama 30 hari di perangkat ini
        </label>

        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
            {error}
          </div>
        )}

        <button type="submit" disabled={busy || !name.trim() || !password} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-50" style={{ background: BRAND }}>
          <Lock className="h-4 w-4" />
          {busy ? "Memeriksa..." : "Masuk"}
        </button>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">
          Pertama kali masuk? Kata sandi awal adalah nama Anda, lalu Anda diminta menggantinya. Lupa kata sandi? Minta Head mereset akun Anda. Jangan centang &ldquo;ingat saya&rdquo; di perangkat bersama.
        </p>
      </form>
    </div>
  );
}
