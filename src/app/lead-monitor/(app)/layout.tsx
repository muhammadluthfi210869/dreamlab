import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getUserByToken, OPEN_VIEW, SESSION_COOKIE } from "@/lib/crm-auth";
import { MonitorShell } from "@/components/lead-monitor/Shell";
import { ForcedChangeScreen } from "@/components/lead-monitor/ForcedChangeScreen";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dreamlab CRM",
  robots: { index: false, follow: false },
};

/** Semua halaman di sini wajib login. Tanpa sesi sah => dialihkan ke halaman masuk. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  let user = null;
  try {
    user = await getUserByToken(token);
  } catch (e) {
    console.error("[lead-monitor] gagal membaca sesi:", (e as Error)?.message);
  }
  if (!user) {
    if (!OPEN_VIEW) redirect("/lead-monitor/masuk");
    // Mode lihat-saja: pengunjung tanpa login melihat semuanya, tetapi tidak bisa mengedit.
    return <MonitorShell user={{ id: 0, name: "Tamu", role: "sales" }} guest>{children}</MonitorShell>;
  }
  // Masih kata sandi awal (= nama): wajib diganti dulu, tidak ada halaman lain yang dirender.
  if (user.mustChange) return <ForcedChangeScreen name={user.name} />;
  return <MonitorShell user={{ id: user.id, name: user.name, role: user.role }}>{children}</MonitorShell>;
}
