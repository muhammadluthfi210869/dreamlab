"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Tag,
  Target,
  User,
  Users,
} from "lucide-react";
import { formatWaChatLink, PIPELINE_STAGES, type PipelineStage } from "@/lib/crm-stages";
import { BRAND } from "@/components/lead-monitor/ui";

interface ConversationItem {
  last_message_id: number;
  phone: string;
  tracking_code: string | null;
  customer_name: string;
  busdev: string;
  stage: string;
  produk: string;
  moq: number;
  source: string;
  last_message: string;
  last_direction: "inbound" | "outbound";
  channel: string;
  last_message_at: string;
  unread_count: number;
}

interface ChatMessage {
  id: number;
  tracking_code: string | null;
  phone: string;
  sender_type: "customer" | "busdev" | "system" | "salesbot";
  sender_name: string | null;
  message_text: string;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  direction: "inbound" | "outbound";
  channel: string;
  busdev_name: string | null;
  created_at: string;
  is_read: boolean;
}

interface LeadDetail {
  id: number;
  tracking_code: string;
  nama: string | null;
  wa_profile_name: string | null;
  phone: string;
  perusahaan: string | null;
  assigned_to: string | null;
  source: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  page_title: string | null;
  page_url: string | null;
  created_at: string;
  confirmed_at: string | null;
  stage: string;
  produk: string | null;
  moq: number | null;
  note: string | null;
}

const BUSDEV_TABS = ["Semua", "Annisa", "Jessica", "Diaz"] as const;

const QUICK_TEMPLATES = [
  { label: "Sapaan Awal", text: "Halo Kak! Terima kasih sudah menghubungi Dreamlab Maklon Kosmetik. Ada rencana formula produk apa yang ingin dikembangkan?" },
  { label: "Tanya MOQ", text: "Untuk maklon di Dreamlab, minimal order (MOQ) mulai dari 500 pcs untuk batch awal. Rencana Kakak ingin produksi di kisaran berapa pcs?" },
  { label: "Form Sample", text: "Kakak bisa request sampel formula eksklusif sebelum produksi massal. Mau kami kirimkan formulir request sample produknya?" },
  { label: "Konsultasi HPP", text: "Boleh infokan target harga jual dan spesifikasi produk yang diinginkan? Tim kami bantu hitungkan estimasi HPP-nya tanpa komitmen awal ya Kak." },
];

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    if (isToday) return `Hari ini ${timeStr}`;
    return `${d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} ${timeStr}`;
  } catch {
    return iso;
  }
}

export default function CrmChatPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activePhone, setActivePhone] = useState<string | null>(null);
  const [activeBusdev, setActiveBusdev] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingList, setLoadingList] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [leadDetail, setLeadDetail] = useState<LeadDetail | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);

  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStage, setUpdatingStage] = useState(false);
  const [activeTabMiddle, setActiveTabMiddle] = useState<"utama" | "form" | "statistik">("utama");

  const [mobileView, setMobileView] = useState<"list" | "chat" | "detail">("list");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation list
  const loadConversations = async () => {
    try {
      setLoadingList(true);
      const params = new URLSearchParams();
      if (activeBusdev !== "Semua") params.set("busdev", activeBusdev);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/crm/chat?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
        if (!activePhone && data.conversations.length > 0) {
          selectConversation(data.conversations[0].phone);
        }
      }
    } catch (err) {
      console.error("Gagal load conversations:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [activeBusdev]);

  // Load active conversation messages and lead info
  const selectConversation = async (phone: string) => {
    setActivePhone(phone);
    setLoadingThread(true);
    setMobileView("chat");
    try {
      const res = await fetch(`/api/crm/chat?phone=${encodeURIComponent(phone)}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        setLeadDetail(data.lead || null);

        // Mark as read in background
        fetch("/api/crm/chat", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }).catch(() => undefined);
      }
    } catch (err) {
      console.error("Gagal load thread:", err);
    } finally {
      setLoadingThread(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send reply
  const handleSendReply = async () => {
    if (!replyText.trim() || !activePhone || sending) return;
    const currentText = replyText.trim();
    setSending(true);

    // Optimistic UI update
    const tempMsg: ChatMessage = {
      id: Date.now(),
      tracking_code: leadDetail?.tracking_code || null,
      phone: activePhone,
      sender_type: "busdev",
      sender_name: "Saya",
      message_text: currentText,
      status: "delivered",
      direction: "outbound",
      channel: "whatsapp",
      busdev_name: leadDetail?.assigned_to || "Busdev",
      created_at: new Date().toISOString(),
      is_read: true,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setReplyText("");

    try {
      const res = await fetch("/api/crm/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: activePhone,
          tracking_code: leadDetail?.tracking_code,
          message: currentText,
          customer_name: leadDetail?.nama || leadDetail?.wa_profile_name,
          product: leadDetail?.produk,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Gagal mengirim balasan.");
      }
    } catch (err) {
      console.error("Gagal kirim chat:", err);
    } finally {
      setSending(false);
    }
  };

  // Update lead stage
  const handleChangeStage = async (newStage: PipelineStage) => {
    if (!leadDetail?.tracking_code || updatingStage) return;
    setUpdatingStage(true);
    try {
      const res = await fetch("/api/crm/lead", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codes: [leadDetail.tracking_code],
          stage: newStage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLeadDetail((prev) => (prev ? { ...prev, stage: newStage } : null));
        setConversations((prev) =>
          prev.map((c) => (c.phone === activePhone ? { ...c, stage: newStage } : c))
        );
      } else {
        alert(data.error || "Gagal memperbarui stage.");
      }
    } catch (err) {
      console.error("Gagal update stage:", err);
    } finally {
      setUpdatingStage(false);
    }
  };

  const activeConv = conversations.find((c) => c.phone === activePhone);
  const waWebFallbackUrl = activePhone
    ? formatWaChatLink(activePhone, leadDetail?.nama || activeConv?.customer_name, leadDetail?.assigned_to, leadDetail?.produk)
    : "#";

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#F8F9FA] overflow-hidden -m-4 sm:-m-6 lg:-m-8">
      {/* Mobile view switcher bar */}
      <div className="flex sm:hidden border-b border-slate-200 bg-white px-2 py-1.5 text-xs font-medium justify-around">
        <button
          onClick={() => setMobileView("list")}
          className={`px-3 py-1.5 rounded-lg ${mobileView === "list" ? "bg-[#FFF4DC] text-[#9A6200] font-bold" : "text-slate-600"}`}
        >
          Kotak Masuk ({conversations.length})
        </button>
        <button
          onClick={() => setMobileView("detail")}
          className={`px-3 py-1.5 rounded-lg ${mobileView === "detail" ? "bg-[#FFF4DC] text-[#9A6200] font-bold" : "text-slate-600"}`}
        >
          Detail Lead
        </button>
        <button
          onClick={() => setMobileView("chat")}
          className={`px-3 py-1.5 rounded-lg ${mobileView === "chat" ? "bg-[#FFF4DC] text-[#9A6200] font-bold" : "text-slate-600"}`}
        >
          Percakapan
        </button>
      </div>

      <div className="flex flex-1 min-h-0 divide-x divide-slate-200">
        {/* ========================================================
            KOLOM 1: KOTAK MASUK (CONVERSATIONS LIST)
           ======================================================== */}
        <div
          className={`${
            mobileView === "list" ? "flex" : "hidden"
          } sm:flex w-full sm:w-80 md:w-88 lg:w-96 flex-col bg-white shrink-0`}
        >
          {/* Header Kotak Masuk */}
          <div className="p-3 border-b border-slate-100 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadConversations()}
                placeholder="Cari prospek, nomor, pesan..."
                className="w-full rounded-xl bg-slate-50 pl-9 pr-3 py-2 text-xs border border-slate-200 focus:outline-none focus:border-[#D98A00]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">Kotak Masuk</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                  {conversations.length}
                </span>
              </div>
              <button
                onClick={loadConversations}
                disabled={loadingList}
                className="text-slate-400 hover:text-slate-600 transition p-1"
                title="Muat ulang kotak masuk"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingList ? "animate-spin text-[#D98A00]" : ""}`} />
              </button>
            </div>

            {/* Filter Tab BusDev */}
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px]">
              {BUSDEV_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveBusdev(tab)}
                  className={`flex-1 rounded-md py-1 font-semibold transition ${
                    activeBusdev === tab
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* List Percakapan */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingList && conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">Memuat percakapan...</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">Tidak ada percakapan ditemukan.</div>
            ) : (
              conversations.map((item) => {
                const isSelected = item.phone === activePhone;
                return (
                  <button
                    key={item.phone}
                    onClick={() => selectConversation(item.phone)}
                    className={`w-full text-left p-3 flex gap-3 transition hover:bg-slate-50 relative ${
                      isSelected ? "bg-blue-50/80 border-l-4 border-blue-600" : ""
                    }`}
                  >
                    {/* Avatar & WhatsApp Badge */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {item.customer_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#25D366] flex items-center justify-center text-white border-2 border-white">
                        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771z" />
                        </svg>
                      </div>
                    </div>

                    {/* Info Percakapan */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-semibold text-xs text-slate-900 truncate">
                          {item.customer_name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatTime(item.last_message_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-semibold text-slate-500">
                          {item.tracking_code ? `Lead #${item.tracking_code.slice(0, 8)}` : item.phone}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-slate-100 font-bold text-slate-600 uppercase">
                          {item.busdev}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 truncate line-clamp-1">
                        {item.last_direction === "outbound" && (
                          <span className="text-slate-400 font-medium">Saya: </span>
                        )}
                        {item.last_message}
                      </p>
                    </div>

                    {/* Unread Badge */}
                    {item.unread_count > 0 && (
                      <span className="absolute right-3 bottom-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                        {item.unread_count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================
            KOLOM 2: DETAIL LEAD & PIPELINE STAGE (KOMMO STYLE)
           ======================================================== */}
        <div
          className={`${
            mobileView === "detail" ? "flex" : "hidden"
          } md:flex w-full md:w-80 lg:w-92 flex-col bg-white shrink-0 overflow-y-auto`}
        >
          {leadDetail || activeConv ? (
            <div className="p-4 space-y-4">
              {/* Header Lead */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    ID: {leadDetail?.tracking_code || activeConv?.tracking_code || "-"}
                  </span>
                  <a
                    href={waWebFallbackUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#128C7E] hover:underline"
                    title="Buka WhatsApp Web Langsung"
                  >
                    <span>Buka WA</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {leadDetail?.nama || leadDetail?.wa_profile_name || activeConv?.customer_name || "Calon Klien"}
                </h3>
              </div>

              {/* Stage Pipeline Selector (Kommo Style) */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-600">
                    {leadDetail?.assigned_to || activeConv?.busdev || "Busdev"}_Pipeline
                  </span>
                  <span className="text-[11px] font-bold uppercase text-[#D98A00]">
                    {leadDetail?.stage || activeConv?.stage || "TRAFFIC"}
                  </span>
                </div>

                {/* Segmented Pipeline Progress Bar */}
                <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-3 bg-slate-200">
                  {PIPELINE_STAGES.map((s, idx) => {
                    const currentIdx = PIPELINE_STAGES.findIndex(
                      (st) => st.id === (leadDetail?.stage || activeConv?.stage || "traffic")
                    );
                    const isPassed = idx <= currentIdx;
                    return (
                      <div
                        key={s.id}
                        className={`flex-1 transition-all ${
                          isPassed ? "bg-[#D98A00]" : "bg-transparent"
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Dropdown Ganti Stage Langsung */}
                <select
                  value={leadDetail?.stage || activeConv?.stage || "traffic"}
                  onChange={(e) => handleChangeStage(e.target.value as PipelineStage)}
                  disabled={updatingStage}
                  className="w-full rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#D98A00]"
                >
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      Tahap: {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Tabs (Utama / Form Leads / Statistik) */}
              <div className="border-b border-slate-200 flex gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTabMiddle("utama")}
                  className={`pb-2 border-b-2 transition ${
                    activeTabMiddle === "utama"
                      ? "border-[#D98A00] text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Utama
                </button>
                <button
                  onClick={() => setActiveTabMiddle("form")}
                  className={`pb-2 border-b-2 transition ${
                    activeTabMiddle === "form"
                      ? "border-[#D98A00] text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Form Leads
                </button>
                <button
                  onClick={() => setActiveTabMiddle("statistik")}
                  className={`pb-2 border-b-2 transition ${
                    activeTabMiddle === "statistik"
                      ? "border-[#D98A00] text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Statistik
                </button>
              </div>

              {/* Data Field Detail Lead */}
              {activeTabMiddle === "utama" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Penanggung Jawab</label>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {leadDetail?.assigned_to || activeConv?.busdev || "Dreamlab"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Telepon / WhatsApp</label>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-slate-800 font-mono">
                        +{activePhone || leadDetail?.phone}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-[#25D366]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#128C7E]">
                        WhatsApp Business
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Produk yang Diminati</label>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {leadDetail?.produk || activeConv?.produk || "Belum ditentukan"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Target MOQ / Quantity</label>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {leadDetail?.moq || activeConv?.moq
                        ? `${(leadDetail?.moq || activeConv?.moq)?.toLocaleString("id-ID")} pcs`
                        : "500 pcs (Standar Batch Awal)"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Sumber Traffic</label>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {leadDetail?.source || activeConv?.source || "Meta Ads"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Halaman Pertama Dilihat</label>
                    <div className="text-slate-600 truncate mt-0.5" title={leadDetail?.page_url || ""}>
                      {leadDetail?.page_title || leadDetail?.page_url || "Landing Page Maklon"}
                    </div>
                  </div>

                  {leadDetail?.note && (
                    <div className="rounded-lg bg-amber-50 p-2.5 text-amber-900 border border-amber-200">
                      <div className="font-bold text-[10px] uppercase tracking-wider text-amber-700">Catatan BusDev</div>
                      <div className="mt-1">{leadDetail.note}</div>
                    </div>
                  )}
                </div>
              )}

              {activeTabMiddle === "form" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Perusahaan / Brand</label>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {leadDetail?.perusahaan || "Personal / Belum ada PT"}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Campaign UTM</label>
                    <div className="font-mono text-slate-700 mt-0.5">
                      {leadDetail?.utm_campaign || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Waktu Masuk Pertama</label>
                    <div className="text-slate-700 mt-0.5">
                      {leadDetail?.created_at ? formatTime(leadDetail.created_at) : "-"}
                    </div>
                  </div>
                </div>
              )}

              {activeTabMiddle === "statistik" && (
                <div className="space-y-3 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-center">
                    <div className="text-[11px] text-slate-500">Total Interaksi Pesan</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">{messages.length} pesan</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">Pilih kontak untuk melihat detail.</div>
          )}
        </div>

        {/* ========================================================
            KOLOM 3: PERCAKAPAN LIVE CHAT WABA (STREAM & REPLY BOX)
           ======================================================== */}
        <div
          className={`${
            mobileView === "chat" ? "flex" : "hidden"
          } sm:flex flex-1 flex-col bg-[#F3F4F6] min-w-0`}
        >
          {activePhone ? (
            <>
              {/* Header Percakapan */}
              <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#D98A00] to-amber-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                    {(leadDetail?.nama || activeConv?.customer_name || "K").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-2">
                      <span>{leadDetail?.nama || leadDetail?.wa_profile_name || activeConv?.customer_name || "Calon Klien"}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.2 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        Online via WABA
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      +{activePhone} · Sales: {leadDetail?.assigned_to || activeConv?.busdev || "Dreamlab"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={waWebFallbackUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                    title="Buka percakapan ini langsung di WhatsApp Web"
                  >
                    <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771z" />
                    </svg>
                    <span className="hidden md:inline">Buka WA Web</span>
                  </a>
                </div>
              </div>

              {/* Area Percakapan (Message Bubble Stream) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingThread ? (
                  <div className="text-center py-10 text-xs text-slate-400">Memuat riwayat chat...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    Belum ada riwayat pesan langsung untuk kontak ini. Anda bisa memulai dengan mengetik balasan di bawah.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isOutbound = m.direction === "outbound";
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isOutbound ? "items-end" : "items-start"}`}
                      >
                        {/* Waktu & Pengirim */}
                        <div className="text-[10px] text-slate-400 mb-1 px-1">
                          {isOutbound ? `Saya (${m.busdev_name || "Busdev"})` : m.sender_name || "Customer"} ·{" "}
                          {formatTime(m.created_at)}
                        </div>

                        {/* Speech Bubble */}
                        <div
                          className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                            isOutbound
                              ? "bg-[#FFF4DC] text-slate-900 border border-[#F0D9A8] rounded-tr-xs"
                              : "bg-white text-slate-900 border border-slate-200 rounded-tl-xs"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{m.message_text}</div>
                          <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                            <span>{new Date(m.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                            {isOutbound && (
                              <CheckCheck className="w-3 h-3 text-[#128C7E]" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Template Cepat (Canned Responses) */}
              <div className="bg-white border-t border-slate-100 px-4 py-2 overflow-x-auto flex gap-1.5 shrink-0">
                {QUICK_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.label}
                    onClick={() => setReplyText(tpl.text)}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 shrink-0 transition"
                  >
                    <Sparkles className="w-3 h-3 text-[#D98A00]" />
                    <span>{tpl.label}</span>
                  </button>
                ))}
              </div>

              {/* Kotak Balasan (Input Reply Box) */}
              <div className="bg-white border-t border-slate-200 p-3 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendReply();
                  }}
                  className="flex items-end gap-2"
                >
                  <div className="flex-1 relative">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      placeholder={`Chat dengan ${leadDetail?.nama || activeConv?.customer_name || "Klien"}: Tulis balasan... (Enter untuk kirim, Shift+Enter untuk baris baru)`}
                      rows={2}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:border-[#D98A00] resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      type="submit"
                      disabled={sending || !replyText.trim()}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50 shadow-xs"
                      style={{ background: BRAND }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sending ? "Kirim..." : "Kirim"}</span>
                    </button>

                    <a
                      href={
                        replyText.trim()
                          ? `https://wa.me/${activePhone}?text=${encodeURIComponent(replyText.trim())}`
                          : waWebFallbackUrl || undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-7 items-center justify-center gap-1 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 px-2 text-[10px] font-bold text-[#128C7E] transition"
                      title="Kirim atau buka via WhatsApp Web langsung"
                    >
                      <span>Kirim di WA Web</span>
                    </a>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              <div className="font-semibold text-sm text-slate-700">Pilih percakapan dari Kotak Masuk</div>
              <div className="text-xs text-slate-400 mt-1 max-w-sm">
                Setiap pesan masuk dari WhatsApp WABA akan muncul di sisi kiri. Anda bisa langsung membalas chat dan memindahkan stage prospek di sini.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
