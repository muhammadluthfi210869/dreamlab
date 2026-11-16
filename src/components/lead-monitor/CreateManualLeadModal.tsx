"use client";

import { useEffect, useState } from "react";
import { X, UserPlus, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { CRM_SOURCES, PIPELINE_STAGES, type PipelineStage } from "@/lib/crm-stages";

interface SalesOption {
  id: number;
  name: string;
  role: string;
}

interface ManualLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  isAdmin: boolean;
  userName: string;
  salesList: SalesOption[];
  availableCampaigns: string[];
}

export function CreateManualLeadModal({
  isOpen,
  onClose,
  onCreated,
  isAdmin,
  userName,
  salesList,
  availableCampaigns,
}: ManualLeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [moq, setMoq] = useState("");
  const [source, setSource] = useState(CRM_SOURCES[0] || "Referral");
  const [campaign, setCampaign] = useState("");
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [stage, setStage] = useState<PipelineStage>("lead_masuk");
  const [salesId, setSalesId] = useState<string>("rr"); // "rr" = round robin default
  const [note, setNote] = useState("");

  const [checkingPhone, setCheckingPhone] = useState(false);
  const [existingLeadInfo, setExistingLeadInfo] = useState<{
    exists: boolean;
    name?: string;
    owner_name?: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cek duplikasi nomor & sticky owner debounce
  useEffect(() => {
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 9) {
      setExistingLeadInfo(null);
      return;
    }

    const t = setTimeout(async () => {
      setCheckingPhone(true);
      try {
        const res = await fetch(`/api/crm/lead/manual?check_phone=${encodeURIComponent(phone)}`);
        const json = await res.json().catch(() => ({}));
        if (json.success && json.exists) {
          setExistingLeadInfo({
            exists: true,
            name: json.lead.name,
            owner_name: json.lead.owner_name,
          });
        } else {
          setExistingLeadInfo(null);
        }
      } catch {
        // ignore
      } finally {
        setCheckingPhone(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [phone]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama lead wajib diisi");
      return;
    }
    if (!phone.trim()) {
      setError("Nomor WhatsApp wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        brand: brand.trim() || undefined,
        product: product.trim() || undefined,
        moq: moq.trim() || undefined,
        source: source.trim(),
        campaign: campaign.trim() || undefined,
        entry_date: entryDate,
        stage,
        sales_id: salesId === "rr" ? null : Number(salesId),
        note: note.trim() || undefined,
      };

      const res = await fetch("/api/crm/lead/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Gagal menyimpan lead (${res.status})`);
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan lead manual");
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#ECEAE4] bg-white p-5 sm:p-6 shadow-xl max-h-[92vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#ECEAE4] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF4DC] text-[#9A6200]">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">Tambah Lead Manual</h2>
              <p className="text-xs text-slate-500">Input prospek langsung ke pipeline CRM</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Baris 1: Nama & Nomor WA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Prospek <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Rina Melati"
                className="w-full rounded-lg border border-[#D5D9E2] px-3 py-2 text-slate-900 outline-none focus:border-[#F39200]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789 atau +628..."
                className="w-full rounded-lg border border-[#D5D9E2] px-3 py-2 text-slate-900 font-mono outline-none focus:border-[#F39200]"
              />
            </div>
          </div>

          {/* Alert Peringatan Duplikat & Sticky Owner */}
          {existingLeadInfo?.exists && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-amber-900">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <span className="font-bold">Nomor WhatsApp sudah pernah terdaftar!</span>
                <p className="mt-0.5 text-[11px] text-amber-800">
                  Lead ini pernah masuk atas nama &ldquo;<b>{existingLeadInfo.name}</b>&rdquo; dengan pemilik sales: &ldquo;
                  <b>{existingLeadInfo.owner_name || "Belum ditentukan"}</b>&rdquo;. Sesuai aturan, lead baru ini akan otomatis mengikuti pemilik lama (sticky owner).
                </p>
              </div>
            </div>
          )}

          {/* Baris 2: Brand & Produk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Brand (Opsional)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Contoh: Glow Beauty"
                className="w-full rounded-lg border border-[#D5D9E2] px-3 py-2 text-slate-900 outline-none focus:border-[#F39200]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rencana Produk (Opsional)</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Contoh: Serum Vitamin C"
                className="w-full rounded-lg border border-[#D5D9E2] px-3 py-2 text-slate-900 outline-none focus:border-[#F39200]"
              />
            </div>
          </div>

          {/* Baris 3: MOQ & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Perkiraan MOQ</label>
              <input
                type="text"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                placeholder="Contoh: 500 pcs atau 1000 pcs"
                className="w-full rounded-lg border border-[#D5D9E2] px-3 py-2 text-slate-900 outline-none focus:border-[#F39200]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Source Akuisisi <span className="text-rose-500">*</span>
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-lg border border-[#D5D9E2] bg-white px-3 py-2 text-slate-900 outline-none focus:border-[#F39200]"
              >
                {CRM_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Baris 4: Campaign & Tanggal Masuk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campaign</label>
              <input
                type="text"
                list="campaign-suggestions"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="Pilih atau ketik nama campaign"
                className="w-full rounded-lg border border-[#D5D9E2] px-3 py-2 text-slate-900 outline-none focus:border-[#F39200]"
              />
              <datalist id="campaign-suggestions">
                {availableCampaigns.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Masuk Lead
              </label>
              <input
                type="date"
                max={todayStr}
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full rounded-lg border border-[#D5D9E2] px-3 py-2 text-slate-900 font-mono outline-none focus:border-[#F39200]"
              />
              <span className="text-[10px] text-slate-400">Boleh mundur, tidak boleh tanggal masa depan</span>
            </div>
          </div>

          {/* Baris 5: Stage Awal & Pemilik Sales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Stage Awal</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as PipelineStage)}
                className="w-full rounded-lg border border-[#D5D9E2] bg-white px-3 py-2 text-slate-900 outline-none focus:border-[#F39200]"
              >
                {PIPELINE_STAGES.filter((s) => s.id !== "lost").map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pemilik Sales</label>
              {isAdmin ? (
                <select
                  value={salesId}
                  onChange={(e) => setSalesId(e.target.value)}
                  className="w-full rounded-lg border border-[#D5D9E2] bg-white px-3 py-2 text-slate-900 outline-none focus:border-[#F39200]"
                >
                  <option value="rr">Round robin (Default)</option>
                  {salesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-lg border border-[#D5D9E2] bg-slate-50 px-3 py-2 text-slate-700 font-semibold">
                  {userName} (Otomatis Milik Anda)
                </div>
              )}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tambahkan info kebutuhan produk, hasil chat, dll..."
              className="w-full rounded-lg border border-[#D5D9E2] px-3 py-2 text-slate-900 outline-none focus:border-[#F39200]"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ECEAE4]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-[#D5D9E2] bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || checkingPhone}
              className="rounded-lg bg-[#F39200] hover:bg-[#D98200] px-4 py-2 font-semibold text-white shadow-xs transition disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

