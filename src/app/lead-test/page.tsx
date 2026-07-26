import SmartWARRButton from "@/components/lead-capture/SmartWARRButton";

export default function LeadTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white">
      {/* Floating Test Badge */}
      <div className="fixed top-4 left-4 z-50 bg-black text-white px-3 py-1 rounded-full text-xs font-mono">
        ⚡ LEAD TEST — Round Robin Active
      </div>

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Maklon Kosmetik BPOM & Halal
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-gray-900 leading-[1.1] mb-6">
            Wujudkan Brand Kosmetik Impian Anda
            <span className="block text-[#F39200] mt-2">dalam 3 Bulan</span>
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Dari formulasi, produksi, hingga BPOM — satu atap.
            <strong className="text-gray-900"> 500+ brand</strong> sudah memulai di sini.
          </p>

          <div className="max-w-md mx-auto">
            <SmartWARRButton
              intent="Konsultasi Brand Kosmetik"
              label="Konsultasi Gratis via WhatsApp"
              fullWidth
            />
            <p className="text-xs text-gray-400 mt-3">
              Klik sekali — langsung terhubung ke tim kami. Tanpa form, tanpa download.
            </p>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">Kenapa DreamLab?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "BPOM & Halal Guaranteed", desc: "CPKB Grade A, Halal MUI, BPOM — semua urusan legal kami urus." },
              { title: "Kustom Formulasi", desc: "Ribuan formula siap pakai atau buat formula eksklusif brand Anda." },
              { title: "3 Bulan Siap Jual", desc: "Dari nol hingga produk siap jual dalam 90 hari." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-orange-600 font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">Cara Mulai — 3 Detik</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Klik Tombol WhatsApp", desc: "Satu klik — langsung terhubung ke tim marketing kami." },
              { step: "2", title: "Chat via WhatsApp", desc: "Tim kami akan bantu konsultasi kebutuhan brand Anda." },
              { step: "3", title: "Dapatkan Quotation", desc: "Dalam 1x24 jam, proposal & sample dikirim." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <SmartWARRButton intent="Mulai Brand Kosmetik" label="Ya, Saya Mau Mulai!" fullWidth />
          </div>
        </div>
      </section>

      {/* RR Status */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-lg mx-auto text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Round Robin — 3 Agents</h3>
          <p className="text-xs text-gray-400 mb-4">
            Setiap klik dirotasi ke 3 nomor WA bergantian via PostgreSQL. Coba klik tombol beberapa kali!
          </p>
          <div className="grid grid-cols-3 gap-3">
            {["Aurel", "Revita", "Zarkasi"].map((name, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-xs font-bold text-gray-900">{name}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Agent {i + 1}</div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mt-2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-400 border-t">
        <p>DreamLab — Maklon Kosmetik Surabaya | BPOM & Halal Certified</p>
        <p className="mt-1">Lead Capture System v1.0 | Round Robin PostgreSQL</p>
      </footer>
    </div>
  );
}
