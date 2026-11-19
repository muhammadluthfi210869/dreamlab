"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { ChangePasswordForm } from "./ChangePassword";
import { BRAND } from "./ui";

/** Ditampilkan menggantikan seluruh aplikasi selama akun masih memakai kata sandi awal (= nama). */
export function ForcedChangeScreen({ name }: { name: string }) {
  const router = useRouter();
  const [done, setDone] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl border border-[#ECEAE4] bg-white p-7">
        {done ? (
          <div className="text-center">
            <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-emerald-600" />
            <h1 className="mb-1 text-lg font-semibold text-slate-900">Kata sandi tersimpan</h1>
            <p className="mb-5 text-sm text-slate-500">Selanjutnya masuk dengan kata sandi baru Anda.</p>
            <button
              type="button"
              onClick={() => {
                router.replace("/lead-monitor");
                router.refresh();
              }}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold text-white"
              style={{ background: BRAND }}
            >
              Lanjut ke dashboard
            </button>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-lg font-semibold text-slate-900">Halo, {name}. Ganti kata sandi dulu</h1>
            <p className="mb-5 text-xs leading-relaxed text-slate-500">
              Kata sandi awal Anda sama dengan nama, sehingga mudah ditebak orang lain. Buat kata sandi baru yang hanya Anda ketahui. Ini cuma sekali, lalu Anda bisa langsung memakai dashboard.
            </p>
            <ChangePasswordForm forced name={name} onDone={() => setDone(true)} />
          </>
        )}
      </div>
    </div>
  );
}
