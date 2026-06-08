"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  ChevronDown, 
  ShieldCheck, 
  CheckCircle2, 
  Factory, 
  HelpCircle 
} from "lucide-react";

// Elite Custom Easing Curve (Apple / Tom Ford Premium Ease-Out)
const premiumEase = [0.16, 1, 0.3, 1] as any;

interface ProductFAQProps {
  categorySlug: string;
  categoryName: string;
  subCategorySlug?: string;
  productSlug?: string;
  productName?: string;
}

const categoryFaqs: Record<string, { question: string; answer: string; }[]> = {
  "skincare-cleansing": [
  // ─── BABY CARE ───
  "babycare": [
    {
      question: "Apa itu maklon baby care?",
      answer: "Maklon baby care adalah layanan produksi produk perawatan bayi dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Produk baby care apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab menyediakan berbagai produk baby care seperti baby lotion, baby oil, baby wash, baby shampoo, baby cream, baby powder, hingga baby telon oil dengan formula custom sesuai kebutuhan brand Anda."
    },
    {
      question: "Apakah formula baby care Dreamlab aman untuk kulit bayi?",
      answer: "Ya, seluruh formula baby care Dreamlab diformulasikan hypoallergenic, memiliki pH seimbang, dan dibuat tanpa bahan keras sehingga aman untuk kulit bayi."
    },
    {
      question: "Berapa biaya dan MOQ maklon baby care?",
      answer: "Biaya maklon baby care menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel sehingga brand pemula dapat memulai dari jumlah yang lebih terjangkau."
    },
    {
      question: "Apakah maklon baby care sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal agar produk baby care lebih legal dan aman dipasarkan di Indonesia."
    },
    {
      question: "Berapa lama proses dan bagaimana cara memulai maklon baby care?",
      answer: "Rata-rata proses maklon baby care memerlukan waktu sekitar 3 bulan mulai dari formulasi, sample produk, produksi, hingga legalitas selesai. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],

  // ─── BODY CARE ───
  "bodycare": [
    {
      question: "Apa itu maklon body care?",
      answer: "Maklon body care adalah layanan produksi produk perawatan tubuh atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Produk body care apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi body lotion, body butter, body scrub, shower gel, sabun antibakteri, massage oil, bath salt, body serum, hingga body mist. Setiap produk diformulasikan custom sesuai konsep brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon body care?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon body care sampai produk siap edar?",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai. Durasi tergantung kompleksitas formula dan kecepatan revisi sample dari brand."
    },
    {
      question: "Apakah maklon body care di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal, aman, dan siap dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon body care di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab untuk membahas konsep brand. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi."
    },
  ],

  // ─── DECORATIVE ───
  "decorative": [
    {
      question: "Apa itu jasa maklon decorative makeup?",
      answer: "Maklon decorative makeup adalah layanan produksi produk makeup dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, packaging, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Produk decorative makeup apa saja yang bisa diproduksi di Dreamlab?",
      answer: "Dreamlab melayani maklon foundation, BB cream, mascara, eyebrow gel, cream blush, liquid blush, highlighter, hingga face primer dengan formula custom sesuai kebutuhan brand Anda."
    },
    {
      question: "Apakah formula dan shade makeup bisa dikustomisasi?",
      answer: "Ya, Anda dapat menentukan shade, coverage, finish, tekstur, pigmentasi, hingga kandungan aktif sesuai konsep dan target market brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon decorative makeup?",
      answer: "Biaya menyesuaikan jenis produk, formula, packaging, dan jumlah produksi. MOQ fleksibel sehingga cocok untuk brand makeup pemula maupun brand berkembang."
    },
    {
      question: "Apakah produk makeup Dreamlab sudah BPOM dan Halal?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service termasuk pengurusan BPOM RI dan sertifikasi Halal MUI hingga produk siap dipasarkan secara legal di Indonesia."
    },
    {
      question: "Berapa lama proses maklon decorative makeup?",
      answer: "Estimasi proses sekitar 3 bulan mulai dari konsultasi konsep, formulasi sample, approval, produksi massal, hingga packaging selesai."
    },
    {
      question: "Apakah bisa membuat makeup waterproof dan long lasting?",
      answer: "Bisa. Dreamlab dapat mengembangkan formula waterproof, transferproof, smudgeproof, hingga long lasting sesuai kebutuhan produk makeup Anda."
    },
    {
      question: "Bagaimana cara memulai maklon decorative makeup di Dreamlab?",
      answer: "Anda dapat memulai dengan konsultasi gratis bersama tim Business Development Dreamlab melalui WhatsApp untuk membahas konsep produk dan pengembangan brand makeup Anda."
    },
    {
      question: "Berapa biaya maklon makeup BPOM dan Halal?",
      answer: "Biaya maklon makeup disesuaikan dengan jenis produk, formula, packaging, dan jumlah produksi. Dreamlab menyediakan MOQ fleksibel untuk brand makeup pemula maupun profesional."
    },
    {
      question: "Produk makeup apa yang paling viral dan cepat laris?",
      answer: "Liquid blush, lip cream, foundation, mascara, dan cushion menjadi produk makeup paling populer karena memiliki permintaan tinggi dan sering viral di media sosial."
    },
    {
      question: "Apakah makeup bisa dibuat waterproof dan tahan lama?",
      answer: "Ya, Dreamlab dapat mengembangkan formula makeup waterproof, transferproof, smudgeproof, dan long lasting sesuai kebutuhan pasar dan positioning brand Anda."
    },
    {
      question: "Berapa lama proses maklon makeup sampai produk siap edar?",
      answer: "Rata-rata proses maklon makeup membutuhkan waktu sekitar 3 bulan mulai dari pengembangan formula, sample approval, produksi, hingga legalitas BPOM dan Halal selesai."
    },
  ],

  // ─── HAIR CARE ───
  "haircare": [
    {
      question: "Apa Itu Jasa Maklon Hair Care?",
      answer: "Jasa maklon hair care adalah layanan pembuatan produk perawatan rambut dengan brand milik Anda sendiri tanpa perlu membangun pabrik sendiri."
    },
    {
      question: "Apakah Formula Produk Hair Care Bisa Dikustomisasi Sesuai Kebutuhan Brand Saya?",
      answer: "Ya, Dreamlab menyediakan layanan custom formula di mana Anda dapat menentukan bahan aktif, tekstur, aroma, warna, hingga manfaat utama produk sesuai konsep brand Anda."
    },
    {
      question: "Produk Hair Care Apa Saja Yang Bisa Dimaklon Di Dreamlab?",
      answer: "Dreamlab melayani maklon hair care secara lengkap meliputi shampoo, hair conditioner, hair mask, scalp care, hair gel, pomade, hingga beard serum."
    },
    {
      question: "Dimana Lokasi Dreamlab?",
      answer: "Dreamlab berlokasi di Jawa Timur, Indonesia. Anda dapat melakukan kunjungan konsultasi langsung ke kantor Dreamlab."
    },
    {
      question: "Apakah Produk Maklon Hair Care Dreamlab Sudah Terdaftar BPOM?",
      answer: "Ya, seluruh produk hair care Dreamlab melalui proses registrasi dan notifikasi BPOM sesuai regulasi yang berlaku."
    },
    {
      question: "Berapa Minimum Order (MOQ) Maklon Hair Care Di Dreamlab?",
      answer: "MOQ di Dreamlab fleksibel dan dapat disesuaikan dengan jenis produk serta kebutuhan brand, cocok untuk brand baru maupun yang sudah berkembang."
    },
    {
      question: "Berapa Lama Proses Pembuatan Sampel Produk Hair Care Di Dreamlab?",
      answer: "Proses pembuatan sampel di Dreamlab memerlukan waktu sekitar 7 hingga 14 hari kerja dengan maksimal 2 kali revisi untuk sampel reguler."
    },
  ],

  // ─── PARFUM ───
  "parfum": [
    {
      question: "Apa Itu Maklon Parfum?",
      answer: "Jasa pembuatan parfum custom dengan brand milik Anda sendiri. Semua proses mulai dari formulasi aroma, produksi, packaging, hingga izin BPOM."
    },
    {
      question: "Apakah Bisa Buat Aroma Custom?",
      answer: "Ya. Tim perfumer kami siap menciptakan signature scent unik sesuai keinginan Anda — floral, woody, fresh, oriental, hingga aroma lokal Indonesia."
    },
    {
      question: "Berapa Biaya Maklon Parfum?",
      answer: "Di Dreamlab harga ditentukan tergantung jenis parfum, volume, dan packaging."
    },
    {
      question: "Apakah Di Dreamlab Di Uruskan Legalitas?",
      answer: "Dreamlab adalah maklon one stop service jadi Anda tidak perlu bingung untuk legalitas karena Dreamlab akan mengurus legalitas mulai HKI, BPOM, hingga Halal."
    },
    {
      question: "Jenis Parfum Apa Saja Yang Bisa Dimaklon?",
      answer: "EDP, EDT, EDC, parfum oil, roll-on, body mist, room spray, dan parfum pocket size. Tersedia ukuran 10ml hingga 100ml."
    },
    {
      question: "Dimana Lokasi Dreamlab?",
      answer: "Dreamlab berlokasi di Jawa Timur, Indonesia. Anda bisa melakukan kunjungan visit konsultasi ke kantor Dreamlab."
    },
    {
      question: "Berapa MOQ Maklon Parfum?",
      answer: "MOQ di Dreamlab fleksibel sehingga dapat menyesuaikan kebutuhan Anda dan cocok untuk brand parfum pemula."
    },
    {
      question: "Berapa Lama Proses Produksi?",
      answer: "Estimasi pembuatan sekitar 3 bulan mulai dari pengembangan aroma, approval sampel, produksi, hingga packaging selesai."
    },
  ],

  // ─── SKINCARE ───
  "skincare": [
    {
      question: "Apa itu maklon skincare?",
      answer: "Maklon skincare adalah layanan produksi produk skincare atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Perusahaan maklon seperti Dreamlab menangani formulasi, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Apa keuntungan menggunakan jasa maklon skincare?",
      answer: "Dengan maklon skincare, Anda bisa punya brand skincare sendiri tanpa investasi besar untuk pabrik, mesin, dan SDM. Prosesnya lebih cepat, modal lebih terjangkau, dan legalitas diurus oleh pihak maklon. Anda bisa meluncurkan produk dalam hitungan bulan, bukan tahun"
    },
    {
      question: "Berapa modal atau biaya untuk maklon skincare?",
      answer: "Biaya maklon skincare bergantung pada jenis produk, formula, kemasan, dan jumlah produksi. Sebagai gambaran umum industri, modal awal maklon kosmetik berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. Dreamlab memberi estimasi transparan setelah konsep Anda jelas."
    },
    {
      question: "Berapa MOQ atau jumlah minimum order maklon skincare?",
      answer: "MOQ (minimum order quantity) di Dreamlab bersifat fleksibel dan menyesuaikan jenis produk serta kemasan. Brand pemula bisa mulai dari jumlah kecil untuk menguji pasar sebelum produksi besar. Angka pasti dijelaskan tim saat sesi konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon skincare sampai produk siap dijual?",
      answer: "Proses maklon skincare memakan waktu 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai. Durasi tergantung kompleksitas formula dan kecepatan revisi sample dari brand."
    },
    {
      question: "Apakah maklon skincare di Dreamlab sudah termasuk izin BPOM dan Halal?",
      answer: "Ya. Dreamlab menerapkan One-Stop Service, sehingga pengurusan izin edar BPOM RI dan sertifikat Halal MUI ditangani sampai tuntas oleh tim kami. Produk skincare Anda dijamin legal, aman, dan siap dipasarkan di seluruh Indonesia."
    },
    {
      question: "Apakah formula skincare bisa dibuat custom sesuai keinginan saya?",
      answer: "Bisa. Dreamlab menyediakan formula custom yang dirancang dari nol oleh tim R&D — Anda menentukan bahan aktif, tekstur, dan aroma. Tersedia juga formula ready stock bila ingin proses lebih cepat. Untuk formula custom berlaku prinsip 1 klien, 1 formula."
    },
    {
      question: "Apa saja tahapan memulai maklon skincare di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis untuk membahas konsep brand. Lalu tim R&D merancang formula, dilanjutkan uji sample dan revisi, produksi massal, hingga pengurusan BPOM dan Halal. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi pertama Anda."
    },
  ],
  "babycare-baby-2in1-wash": [
    {
      question: "Apa itu maklon baby wash?",
      answer: "Maklon baby wash adalah layanan produksi baby 2-in-1 wash dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Apakah formula baby 2-in-1 wash aman untuk bayi?",
      answer: "Baby 2-in-1 wash Dreamlab diformulasikan hypoallergenic, memiliki pH lembut, dan dibuat tanpa bahan keras sehingga aman untuk kulit dan mata bayi."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon baby wash?",
      answer: "Biaya maklon baby wash menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Business Development Dreamlab via WhatsApp."
    },
  ],
  "bodycare-bath-salt": [
    {
      question: "Apa itu maklon bath salt?",
      answer: "Maklon bath salt adalah layanan produksi garam mandi atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga izin BPOM dan Halal."
    },
    {
      question: "Jenis bath salt apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi bath salt relaksasi, aromatherapy, detox, hingga berbasis epsom salt. Warna, aroma, dan campuran herbal bisa di-custom untuk memperkuat pengalaman brand spa Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon bath salt?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon bath salt sampai produk siap edar?",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon bath salt di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal dan aman dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon bath salt di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp."
    },
  ],
  "bodycare-body-butter": [
    {
      question: "Apa itu maklon body butter?",
      answer: "Maklon body butter adalah layanan produksi produk body butter atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Jenis body butter apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi body butter berbahan shea butter, cocoa butter, whipped texture, hingga scented body butter. Kandungan butter, aroma, dan tekstur bisa di-custom sesuai positioning brand Anda"
    },
    {
      question: "Berapa biaya dan MOQ maklon body butter?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis"
    },
    {
      question: "Berapa lama proses maklon body butter sampai produk siap edar?",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai. Durasi tergantung kompleksitas formula dan kecepatan revisi sample"
    },
    {
      question: "Apakah maklon body butter di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal, aman, dan siap dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon body butter di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi"
    },
  ],
  "bodycare-body-scrub": [
    {
      question: "Apa itu maklon body scrub?",
      answer: "Maklon body scrub adalah layanan produksi produk body scrub atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Jenis body scrub apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi sugar scrub, salt scrub, coffee scrub, oatmeal scrub, hingga scrub berbahan alami lain. Butiran eksfoliasi, aroma, dan klaim bisa di-custom sesuai brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon body scrub?",
      answer: "Biaya jasa maklon skincare di Dreamlab menyesuaikan jenis formula, pilihan kemasan, dan jumlah produksi sesuai kebutuhan brand Anda."
    },
    {
      question: "Berapa lama proses maklon body scrub sampai produk siap edar?",
      answer: "Rata-rata proses maklon skincare di Dreamlab memerlukan waktu sekitar 3 bulan mulai dari konsultasi, pengembangan formula, sample produk, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Apakah maklon body scrub di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal, aman, dan siap dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon body scrub di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi."
    },
  ],
  "bodycare-body-serum": [
    {
      question: "Apa itu maklon body serum?",
      answer: "Maklon body serum adalah layanan produksi body serum atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga izin BPOM dan Halal."
    },
    {
      question: "Jenis body serum apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi brightening, firming, hydrating, hingga glowing body serum. Bahan aktif diformulasikan pada konsentrasi yang aman dan efektif, disesuaikan dengan klaim brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon body serum?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon body serum sampai produk siap edar?",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon body serum di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal dan aman dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon body serum di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp."
    },
  ],
  "bodycare-massage-cream": [
    {
      question: "Apa itu maklon massage cream?",
      answer: "Maklon massage cream adalah layanan produksi krim pijat dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Jenis massage cream apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab menyediakan berbagai jenis massage cream seperti relaxing cream, warming cream, dan aromatherapy massage cream dengan formula custom sesuai kebutuhan brand spa atau wellness Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon massage cream?",
      answer: "Biaya maklon massage cream menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel sehingga brand pemula dapat memulai dari jumlah yang lebih terjangkau."
    },
    {
      question: "Berapa lama proses maklon massage cream sampai produk siap edar?",
      answer: "Rata-rata proses maklon massage cream memerlukan waktu sekitar 3 bulan mulai dari formulasi, sample produk, produksi, hingga legalitas BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon massage cream di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal agar produk lebih legal dan aman dipasarkan di Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon massage cream di Dreamlab?",
      answer: "Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab untuk menentukan konsep produk, formula, kemasan, hingga proses produksi dan legalitas skincare Anda."
    },
  ],
  "bodycare-massage-oil": [
    {
      question: "Apa itu maklon massage oil?",
      answer: "Maklon massage oil adalah layanan produksi minyak pijat atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga izin BPOM dan Halal."
    },
    {
      question: "Jenis massage oil apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi relaxing massage oil, aromatherapy oil, herbal/warming oil, hingga baby massage oil. Base oil, aroma, dan klaim bisa di-custom sesuai konsep brand spa atau wellness Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon massage oil?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya puluhan juta rupiah, biasanya sudah termasuk BPOM & Halal. MOQ fleksibel. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon massage oil?",
      answer: "Membutuhkan 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon massage oil sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal dan aman dipasarkan."
    },
    {
      question: "Bagaimana cara memulai maklon massage oil di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis untuk membahas konsep brand. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp."
    },
  ],
  "bodycare-neck-cream": [
    {
      question: "Apa itu maklon neck cream?",
      answer: "Maklon neck cream adalah layanan produksi krim perawatan leher dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Jenis neck cream apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab menyediakan berbagai jenis neck cream seperti anti-aging neck cream, brightening neck cream, dan firming neck cream dengan formula custom sesuai kebutuhan brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon neck cream?",
      answer: "Biaya maklon neck cream menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel sehingga brand pemula dapat memulai dari jumlah yang lebih terjangkau."
    },
    {
      question: "Berapa lama proses maklon neck cream sampai produk siap edar?",
      answer: "Rata-rata proses maklon neck cream memerlukan waktu sekitar 3 bulan mulai dari formulasi, sample produk, produksi, hingga legalitas BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon neck cream di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal agar produk lebih legal dan aman dipasarkan di Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon neck cream di Dreamlab?",
      answer: "Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab untuk menentukan konsep produk, formula, kemasan, hingga proses produksi dan legalitas skincare Anda."
    },
  ],
  "bodycare-anti-bacterial-soap": [
    {
      question: "Apa itu maklon sabun antibakteri?",
      answer: "Maklon sabun antibakteri adalah layanan produksi produk sabun antibakteri atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Bentuk sabun antibakteri apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi sabun antibakteri dalam bentuk batang maupun cair, dengan bahan aktif antibakteri yang aman. Aroma, klaim, dan kemasan bisa di-custom sesuai konsep brand Anda"
    },
    {
      question: "Berapa biaya dan MOQ maklon sabun antibakteri?",
      answer: "Dreamlab menawarkan biaya maklon skincare yang fleksibel dengan pilihan formula dan kemasan sesuai konsep brand Anda."
    },
    {
      question: "Berapa lama proses maklon sabun antibakteri sampai produk siap edar?",
      answer: "Estimasi produksi skincare umumnya sekitar 3 bulan tergantung jenis produk, formula, dan proses approval sample."
    },
    {
      question: "Apakah maklon sabun antibakteri di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal, aman, dan siap dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon sabun antibakteri di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi."
    },
  ],
  "bodycare-bar-soap": [
    {
      question: "Apa itu maklon sabun batang?",
      answer: "Maklon sabun batang adalah layanan produksi bar soap dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Jenis sabun batang apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab menyediakan berbagai jenis bar soap seperti beauty bar soap, moisturizing soap, exfoliating soap, hingga herbal soap dengan formula custom sesuai kebutuhan brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon sabun batang?",
      answer: "Biaya maklon sabun batang menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel sehingga brand pemula dapat memulai dari jumlah yang lebih terjangkau."
    },
    {
      question: "Berapa lama proses maklon sabun batang sampai produk siap edar?",
      answer: "Rata-rata proses maklon sabun batang memerlukan waktu sekitar 3 bulan mulai dari formulasi, sample produk, produksi, hingga legalitas BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon sabun batang di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal agar produk lebih legal dan aman dipasarkan di Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon sabun batang di Dreamlab?",
      answer: "Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab untuk menentukan konsep produk, formula, kemasan, hingga proses produksi dan legalitas skincare Anda."
    },
  ],
  "bodycare-organic-soap": [
    {
      question: "Apa itu maklon sabun organik?",
      answer: "Maklon sabun organik adalah layanan produksi sabun berbahan organik atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga izin BPOM dan Halal."
    },
    {
      question: "Apa keunggulan sabun organik sebagai produk brand?",
      answer: "Sabun organik memakai bahan natural yang menyasar segmen clean beauty yang terus tumbuh. Dreamlab bisa custom bahan dasar, kandungan herbal, dan aroma agar sesuai positioning brand organik Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon sabun organik?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon sabun organik sampai produk siap edar?",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon sabun organik di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal dan aman dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon sabun organik di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp."
    },
  ],
  "bodycare-transparent-soap": [
    {
      question: "Apa itu maklon sabun transparan?",
      answer: "Maklon sabun transparan adalah layanan produksi sabun transparan atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga izin BPOM dan Halal."
    },
    {
      question: "Apa keunggulan sabun transparan sebagai produk brand?",
      answer: "Sabun transparan punya tampilan jernih yang berkesan premium dan tekstur lembut di kulit. Berbasis glycerin, sabun ini cocok untuk brand yang mengincar positioning gentle dan elegan."
    },
    {
      question: "Berapa biaya dan MOQ maklon sabun transparan?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon sabun transparan sampai produk siap edar?",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon sabun transparan di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal dan aman dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon sabun transparan di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp."
    },
  ],
  "bodycare-whitening-soap": [
    {
      question: "Apa itu maklon sabun whitening?",
      answer: "Maklon sabun whitening adalah layanan produksi sabun pencerah dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Bentuk sabun whitening apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab menyediakan maklon sabun whitening dalam bentuk batang maupun cair dengan formula custom sesuai kebutuhan brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon sabun whitening?",
      answer: "Biaya maklon sabun whitening menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel sehingga brand pemula dapat memulai dari jumlah yang lebih terjangkau."
    },
    {
      question: "Berapa lama proses maklon sabun whitening sampai produk siap edar?",
      answer: "Rata-rata proses maklon sabun whitening memerlukan waktu sekitar 3 bulan mulai dari formulasi, sample produk, produksi, hingga legalitas BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon sabun whitening di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal agar produk lebih legal dan aman dipasarkan di Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon sabun whitening di Dreamlab?",
      answer: "Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab untuk menentukan konsep produk, formula, kemasan, hingga proses produksi dan legalitas skincare Anda."
    },
  ],
  "bodycare-shower-gel": [
    {
      question: "Apa itu maklon shower gel?",
      answer: "Maklon shower gel adalah layanan produksi shower gel (body wash) atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga izin BPOM dan Halal."
    },
    {
      question: "Apa saja yang bisa di-custom pada shower gel?",
      answer: "Pada shower gel, Anda bisa custom tekstur, tingkat busa, bahan aktif (moisturizing, brightening), serta aroma  dari fresh, floral, hingga unscented — agar sesuai karakter brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon shower gel?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon shower gel sampai produk siap edar?",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon shower gel di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal dan aman dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon shower gel di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp."
    },
  ],
  "bodycare-soothing-gel": [
    {
      question: "Apa itu maklon soothing gel?",
      answer: "Maklon soothing gel adalah layanan produksi soothing gel dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Jenis soothing gel apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab menyediakan berbagai jenis soothing gel seperti aloe vera soothing gel, after-sun gel, dan calming gel dengan formula custom sesuai kebutuhan brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon soothing gel?",
      answer: "Biaya maklon soothing gel menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel sehingga brand pemula dapat memulai dari jumlah yang lebih terjangkau."
    },
    {
      question: "Berapa lama proses maklon soothing gel sampai produk siap edar?",
      answer: "Rata-rata proses maklon soothing gel memerlukan waktu sekitar 3 bulan mulai dari formulasi, sample produk, produksi, hingga legalitas BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon soothing gel di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal agar produk lebih legal dan aman dipasarkan di Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon soothing gel di Dreamlab?",
      answer: "Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab untuk menentukan konsep produk, formula, kemasan, hingga proses produksi dan legalitas skincare Anda."
    },
  ],
  "bodycare-underarm-cream": [
    {
      question: "Apa itu maklon underarm cream?",
      answer: "Maklon underarm cream adalah layanan produksi krim perawatan ketiak dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Fungsi apa saja yang bisa diformulasikan pada underarm cream?",
      answer: "Formula underarm cream dapat disesuaikan untuk membantu mencerahkan, melembapkan, dan menjaga kesegaran area ketiak sesuai kebutuhan target market brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon underarm cream?",
      answer: "Biaya maklon underarm cream menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel sehingga brand pemula dapat memulai dari jumlah yang lebih terjangkau."
    },
    {
      question: "Berapa lama proses maklon underarm cream sampai produk siap edar?",
      answer: "Rata-rata proses maklon underarm cream memerlukan waktu sekitar 3 bulan mulai dari formulasi, sample produk, produksi, hingga legalitas BPOM dan Halal selesai."
    },
    {
      question: "Apakah maklon underarm cream di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal agar produk lebih legal dan aman dipasarkan di Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon underarm cream di Dreamlab?",
      answer: "Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab untuk menentukan konsep produk, formula, kemasan, hingga proses produksi dan legali"
    },
  ],
  "decorative-lip-care": [
    {
      question: "Berapa biaya maklon lip care BPOM dan Halal?",
      answer: "Biaya maklon lip care bergantung pada formula, jenis kemasan, dan jumlah produksi. Dreamlab menyediakan MOQ fleksibel untuk brand pemula dengan layanan lengkap termasuk BPOM dan Halal."
    },
    {
      question: "Produk lip care apa yang paling laris untuk brand baru?",
      answer: "Produk seperti lip balm, tinted lip balm, lip serum, dan lip oil menjadi kategori lip care paling dicari karena tren bibir sehat dan natural look terus meningkat di Indonesia."
    },
    {
      question: "Apakah formula lip care bisa custom sesuai target market?",
      answer: "Ya, Dreamlab menyediakan custom formula lip care mulai dari warna, aroma, tekstur, finish, hingga kandungan aktif seperti vitamin E, peptide, dan natural oil sesuai konsep brand Anda."
    },
    {
      question: "Berapa lama proses maklon lip care sampai siap jual?",
      answer: "Estimasi proses maklon lip care sekitar 3 bulan mulai dari formulasi sample, revisi, produksi massal, hingga pengurusan BPOM dan Halal selesai."
    },
  ],
  "footcare-foot-cream": [
    {
      question: "Apa itu maklon foot cream?",
      answer: "Maklon foot cream adalah layanan produksi foot cream dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Masalah kaki apa yang bisa diatasi foot cream?",
      answer: "Foot cream Dreamlab diformulasikan untuk membantu melembapkan kulit kaki kering, memperbaiki tumit pecah-pecah, dan menghaluskan telapak kaki kasar."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon foot cream?",
      answer: "Biaya maklon foot cream menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
    {
      question: "Apa keunggulan foot serum dibanding foot cream?",
      answer: "Foot serum memiliki tekstur lebih ringan dengan kandungan active ingredients yang lebih intensif sehingga cocok untuk perawatan kaki premium."
    },
  ],
  "footcare-foot-scrub": [
    {
      question: "Apa itu maklon foot scrub?",
      answer: "Maklon foot scrub adalah layanan produksi foot scrub dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Jenis foot scrub apa saja yang bisa dibuat?",
      answer: "Dreamlab menyediakan foot scrub berbahan sugar, salt, dan bahan alami lainnya dengan aroma serta butiran eksfoliasi custom sesuai kebutuhan brand Anda."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon foot scrub?",
      answer: "Biaya maklon foot scrub menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "footcare-foot-serum": [
    {
      question: "Apa itu maklon foot serum?",
      answer: "Maklon foot serum adalah layanan produksi foot serum dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon foot serum?",
      answer: "Biaya maklon foot serum menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "footcare-foot-soak": [
    {
      question: "Apa itu maklon foot soak?",
      answer: "Maklon foot soak adalah layanan produksi foot soak dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Jenis foot soak apa yang bisa dimaklonkan?",
      answer: "Dreamlab menyediakan foot soak berbahan garam, epsom salt, dan campuran herbal dengan aroma serta manfaat relaksasi custom sesuai kebutuhan brand Anda."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon foot soak?",
      answer: "Biaya maklon foot soak menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "footcare-foot-spray": [
    {
      question: "Apa itu maklon foot spray?",
      answer: "Maklon foot spray adalah layanan produksi foot spray dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Manfaat apa yang bisa diformulasikan pada foot spray?",
      answer: "Foot spray Dreamlab dapat diformulasikan untuk membantu mengurangi bau kaki, memberikan efek antibakteri, dan sensasi menyegarkan."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon foot spray?",
      answer: "Biaya maklon foot spray menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "haircare-beard-serum": [
    {
      question: "Apa itu maklon beard serum?",
      answer: "Maklon beard serum adalah layanan produksi beard serum dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Kenapa beard serum potensial untuk brand grooming?",
      answer: "Beard serum merupakan niche grooming yang terus berkembang sehingga dapat menjadi produk unggulan untuk membedakan brand Anda di pasaran."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon beard serum?",
      answer: "Biaya maklon beard serum menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "haircare-hair-conditioner": [
    {
      question: "Apa itu maklon hair conditioner?",
      answer: "Maklon hair conditioner adalah layanan produksi conditioner rambut dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Apa keunggulan menjual conditioner bersama shampoo?",
      answer: "Hair conditioner membantu melengkapi rangkaian hair care sehingga meningkatkan nilai pembelian sekaligus memperkuat positioning brand Anda."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon hair conditioner?",
      answer: "Biaya maklon hair conditioner menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "haircare-hair-gel": [
    {
      question: "Apa itu maklon hair gel?",
      answer: "Maklon hair gel adalah layanan produksi hair gel dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Tingkat hold dan finish apa saja yang bisa dibuat?",
      answer: "Dreamlab dapat mengembangkan hair gel dengan hold ringan hingga kuat serta finish wet look maupun natural sesuai konsep brand Anda."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon hair gel?",
      answer: "Biaya maklon hair gel menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "haircare-hair-mask": [
    {
      question: "Apa itu maklon hair mask?",
      answer: "Maklon hair mask adalah layanan produksi hair mask dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Untuk masalah rambut apa hair mask bisa diformulasikan?",
      answer: "Hair mask Dreamlab dapat diformulasikan untuk rambut kering, rusak, rontok, hingga rambut diwarnai sesuai kebutuhan target market brand Anda."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon hair mask?",
      answer: "Biaya maklon hair mask menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "haircare-hair-tonic": [
    {
      question: "Apa itu maklon hair tonic?",
      answer: "Maklon hair tonic adalah layanan produksi hair tonic dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Manfaat apa yang bisa diformulasikan pada hair tonic?",
      answer: "Hair tonic Dreamlab dapat diformulasikan untuk membantu mengurangi kerontokan, menyuburkan rambut, dan menyehatkan kulit kepala sesuai kebutuhan brand Anda."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon hair tonic?",
      answer: "Biaya maklon hair tonic menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "haircare-pomade": [
    {
      question: "Apa itu maklon pomade?",
      answer: "Maklon pomade adalah layanan produksi pomade dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Jenis pomade apa saja yang bisa dimaklonkan?",
      answer: "Dreamlab menyediakan pomade water based dan oil based dengan tingkat shine serta hold yang dapat disesuaikan dengan kebutuhan brand grooming Anda."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon pomade?",
      answer: "Biaya maklon pomade menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "haircare-scalp-care": [
    {
      question: "Apa itu maklon scalp care?",
      answer: "Maklon scalp care adalah layanan produksi produk scalp care dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Produk scalp care apa saja yang bisa dimaklonkan?",
      answer: "Dreamlab menyediakan scalp serum, scalp scrub, scalp tonic, hingga scalp treatment anti-ketombe dengan formula custom sesuai kebutuhan brand Anda."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon scalp care?",
      answer: "Biaya maklon scalp care menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "haircare-shampoo": [
    {
      question: "Apa itu maklon shampoo?",
      answer: "Maklon shampoo adalah layanan produksi shampoo dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Jenis shampoo apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab menyediakan berbagai jenis shampoo seperti anti-ketombe, anti-rontok, hair growth, smoothing, hingga shampoo bayi dengan formula custom sesuai kebutuhan brand Anda."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon shampoo?",
      answer: "Biaya maklon shampoo menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "parfum-body-mist": [
    {
      question: "Apa itu maklon body mist?",
      answer: "Maklon body mist adalah layanan produksi body mist dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Kenapa body mist cocok untuk brand pemula?",
      answer: "Body mist memiliki harga jual terjangkau dan tingkat repeat order tinggi sehingga cocok menjadi produk awal untuk brand parfum dan wewangian."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon body mist?",
      answer: "Biaya maklon body mist menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "parfum-eau-de-cologne": [
    {
      question: "Apa itu maklon eau de cologne?",
      answer: "Maklon eau de cologne adalah layanan produksi parfum cologne dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Apa beda eau de cologne dengan parfum lain?",
      answer: "Eau de Cologne memiliki konsentrasi parfum lebih ringan sehingga memberikan aroma segar dan nyaman untuk penggunaan sehari-hari."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon eau de cologne?",
      answer: "Biaya maklon eau de cologne menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "parfum-eau-de-parfum": [
    {
      question: "Apa itu maklon eau de parfum?",
      answer: "Maklon eau de parfum adalah layanan produksi EDP dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Kenapa eau de parfum bernilai jual tinggi?",
      answer: "Eau de Parfum memiliki konsentrasi parfum lebih tinggi sehingga aromanya lebih tahan lama dan cocok untuk positioning parfum premium."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon eau de parfum?",
      answer: "Biaya maklon eau de parfum menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "parfum-eau-de-toilette": [
    {
      question: "Apa itu maklon eau de toilette?",
      answer: "Maklon eau de toilette adalah layanan produksi EDT dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Untuk siapa eau de toilette paling cocok?",
      answer: "Eau de Toilette cocok untuk konsumen yang mencari parfum dengan aroma tahan menengah dan harga yang lebih terjangkau untuk penggunaan harian."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon eau de toilette?",
      answer: "Biaya maklon eau de toilette menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "parfum-extrait-de-parfum": [
    {
      question: "Apa itu maklon extrait de parfum?",
      answer: "Maklon extrait de parfum adalah layanan produksi extrait de parfum dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Apa keistimewaan extrait de parfum?",
      answer: "Extrait de Parfum memiliki konsentrasi minyak wangi tertinggi sehingga memberikan aroma yang lebih intens dan tahan lama untuk kategori parfum mewah."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon extrait de parfum?",
      answer: "Biaya maklon extrait de parfum menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "parfum-minyak-atsiri": [
    {
      question: "Apa itu maklon minyak atsiri?",
      answer: "Maklon minyak atsiri adalah layanan produksi essential oil dengan brand milik Anda sendiri tanpa perlu memiliki pabrik. Dreamlab membantu mulai dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal."
    },
    {
      question: "Untuk apa saja minyak atsiri bisa diformulasikan?",
      answer: "Minyak atsiri Dreamlab dapat diformulasikan untuk aromaterapi, diffuser, pijat, hingga produk relaksasi sesuai konsep brand wellness Anda."
    },
    {
      question: "Berapa biaya, MOQ, dan lama proses maklon minyak atsiri?",
      answer: "Biaya maklon minyak atsiri menyesuaikan formula, kemasan, dan jumlah produksi. MOQ fleksibel untuk brand pemula dengan estimasi proses sekitar 3 bulan hingga produk siap edar."
    },
    {
      question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?",
      answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal. Anda dapat memulai dengan konsultasi gratis bersama tim Dreamlab via WhatsApp."
    },
  ],
  "skincare-cleansing": [
    {
      question: "Apa itu maklon cleansing series?",
      answer: "Maklon cleansing series adalah layanan produksi rangkaian produk pembersih wajah atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Produk cleansing apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi cleansing oil, cleansing balm, micellar water, cleansing gel, cleansing milk, makeup remover, hingga exfoliating cleanser. Setiap produk diformulasikan custom sesuai target kulit dan konsep brand And"
    },
    {
      question: "Berapa biaya dan MOQ maklon cleansing series?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon cleansing series sampai produk siap edar?=",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai. Durasi tergantung kompleksitas formula dan kecepatan revisi sample dari brand."
    },
    {
      question: "Apakah maklon cleansing series di Dreamlab sudah termasuk BPOM dan Halal",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal, aman, dan siap dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon cleansing series di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab untuk membahas konsep brand. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi."
    },
  ],
  "skincare-day-night-cream": [
    {
      question: "Berapa MOQ minimum untuk maklon day & night cream?",
      answer: "Di Dreamlab anda bisa memulai dengan MOQ fleksibel dan menyesuaikan kebutuhan Anda. Brand pemula bisa mulai dari jumlah kecil untuk menguji pasar sebelum scale up."
    },
    {
      question: "Berapa biaya maklon day cream dan night cream?",
      answer: "Biaya tergantung formula, ukuran kemasan, jumlah produksi, dan jenis bahan aktif. Setelah konsep brand Anda jelas, tim kami akan memberikan estimasi biaya yang transparan tanpa biaya tersembunyi"
    },
    {
      question: "Berapa lama proses sampai produk siap edar?",
      answer: "Hanya 3 bulan dari konsep hingga produk siap launching, termasuk formula dan proses legalitas BPOM serta Halal."
    },
    {
      question: "Apakah formula day & night cream bisa custom?",
      answer: "Bisa. Tim R&D kami merancang formula eksklusif sesuai visi brand Anda 1 brand, 1 formula. Anda juga bisa memilih dari formula yang sudah tersedia untuk mempercepat proses."
    },
    {
      question: "Apakah sudah termasuk pengurusan BPOM dan Halal?",
      answer: "Ya. Sebagai layanan One-Stop Service, Dreamlab mengurus izin edar BPOM dan sertifikat Halal MUI sampai tuntas, sehingga produk Anda legal dan aman dipasarkan."
    },
    {
      question: "Apakah Dreamlab menyediakan desain kemasan?",
      answer: "Ya. Tim kreatif kami membantu desain kemasan premium yang memperkuat identitas brand Anda — bukan sekadar wadah, tapi bagian dari daya jual produk"
    },
    {
      question: "Apakah saya bisa minta sample sebelum produksi massal?",
      answer: "Tentu. Pada tahap Sample & Revisi, Anda bisa menguji tekstur, aroma, dan hasil produk terlebih dahulu. Kami revisi sampai Anda puas sebelum lanjut ke produksi massal"
    },
  ],
  "skincare-facial-toner": [
    {
      question: "Apa itu maklon facial toner?",
      answer: "Maklon facial toner adalah layanan produksi produk facial toner atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Jenis facial toner apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi hydrating toner, exfoliating toner (AHA/BHA), brightening toner, soothing toner, hingga essence toner. Setiap formula disesuaikan dengan target kulit dan klaim brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon facial toner?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon facial toner sampai produk siap edar?",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai. Durasi tergantung kompleksitas formula dan kecepatan revisi sample dari brand."
    },
    {
      question: "Apakah maklon facial toner di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal, aman, dan siap dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon facial toner di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab untuk membahas konsep brand. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi."
    },
  ],
  "skincare-facial-wash": [
    {
      question: "Apa itu maklon facial wash?",
      answer: "Maklon facial wash adalah layanan produksi produk sabun pembersih wajah (facial wash) atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Jenis facial wash apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi gentle wash, foam cleanser, gel wash, cream wash, low-pH cleanser, brightening wash, hingga acne facial wash. Semua diformulasikan custom sesuai target kulit brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon facial wash?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon facial wash sampai produk siap edar?",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai. Durasi tergantung kompleksitas formula dan kecepatan revisi sample dari brand."
    },
    {
      question: "Apakah maklon facial wash di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal, aman, dan siap dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon facial wash di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab untuk membahas konsep brand. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi."
    },
  ],
  "skincare-face-mask": [
    {
      question: "Apa itu maklon face mask?",
      answer: "Maklon face mask adalah layanan produksi masker wajah atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Perusahaan maklon seperti Dreamlab menangani formulasi, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Apa keuntungan menggunakan jasa maklon face mask?",
      answer: "Dengan maklon face mask, Anda bisa punya brand masker wajah sendiri tanpa investasi besar untuk pabrik dan mesin. Prosesnya lebih cepat dan modal lebih terjangkau. Masker wajah juga punya repeat-purchase tinggi, cocok sebagai produk andalan yang menjaga retensi pelanggan."
    },
    {
      question: "Jenis face mask apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab dapat memproduksi berbagai jenis masker: sheet mask, clay mask, mud mask, peel-off mask, sleeping mask, wash-off cream mask, gel mask, bubble mask, hingga modeling/rubber mask. Setiap jenis bisa diformulasikan custom sesuai target kulit dan konsep brand Anda."
    },
    {
      question: "Berapa modal atau biaya maklon face mask?",
      answer: "Biaya maklon face mask bergantung pada jenis masker, formula, kemasan, dan jumlah produksi. Sebagai gambaran umum industri, modal awal maklon kosmetik berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. Dreamlab memberi estimasi transparan setelah konsep Anda jelas."
    },
    {
      question: "Berapa MOQ minimum untuk maklon face mask?",
      answer: "MOQ (minimum order quantity) di Dreamlab bersifat fleksibel dan menyesuaikan jenis masker serta kemasan. Brand pemula bisa mulai dari jumlah kecil untuk menguji pasar sebelum produksi besar. Angka pasti dijelaskan tim saat sesi konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon face mask sampai produk siap dijual?",
      answer: "Rata-rata proses maklon face mask memakan waktu 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai. Durasi tergantung kompleksitas formula dan kecepatan revisi sample dari brand."
    },
    {
      question: "Apakah maklon face mask di Dreamlab sudah termasuk izin BPOM dan Halal?",
      answer: "Ya. Dreamlab menerapkan One-Stop Service, sehingga pengurusan izin edar BPOM RI dan sertifikat Halal MUI ditangani sampai tuntas oleh tim kami. Produk masker wajah Anda dijamin legal, aman, dan siap dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon face mask di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis untuk membahas konsep brand dan jenis masker yang diinginkan. Tim R&D lalu merancang formula, dilanjutkan uji sample dan revisi, produksi massal, hingga pengurusan BPOM dan Halal. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi."
    },
  ],
  "skincare-facial-serum": [
    {
      question: "Apa itu maklon serum wajah?",
      answer: "Maklon serum wajah adalah layanan produksi produk serum wajah atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Dreamlab menangani formulasi, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Jenis serum wajah apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab memproduksi serum Vitamin C, Niacinamide, Retinol, Hyaluronic Acid, Peptide, serta serum acne, brightening, dan anti-aging. Konsentrasi bahan aktif diformulasikan agar aman, efektif, dan lolos uji laboratorium"
    },
    {
      question: "Berapa biaya dan MOQ maklon serum wajah?",
      answer: "Biaya bergantung pada formula, kemasan, dan jumlah produksi; modal awal maklon kosmetik umumnya berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. MOQ fleksibel — brand pemula bisa mulai dari jumlah kecil. Estimasi pasti diberikan saat konsultasi gratis."
    },
    {
      question: "Berapa lama proses maklon serum wajah sampai produk siap edar?",
      answer: "Rata-rata 3 bulan, dihitung dari konsultasi konsep, formulasi, uji sample, produksi, hingga izin edar BPOM dan Halal selesai. Durasi tergantung kompleksitas formula dan kecepatan revisi sample dari brand."
    },
    {
      question: "Apakah maklon serum wajah di Dreamlab sudah termasuk BPOM dan Halal?",
      answer: "Ya. Dengan layanan One-Stop Service, Dreamlab mengurus izin edar BPOM RI dan sertifikat Halal MUI sampai tuntas. Produk Anda dijamin legal, aman, dan siap dipasarkan di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara memulai maklon serum wajah di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis bersama tim Business Development Dreamlab untuk membahas konsep brand. Tim R&D lalu merancang formula, dilanjutkan uji sample, produksi, hingga pengurusan legalitas. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi."
    },
  ],
  "skincare-sunscreen": [
    {
      question: "Apa itu maklon sunscreen?",
      answer: "Maklon sunscreen adalah layanan produksi produk tabir surya atas nama brand Anda sendiri tanpa perlu memiliki pabrik. Perusahaan maklon seperti Dreamlab menangani formulasi, uji SPF, produksi, kemasan, hingga pengurusan izin BPOM dan Halal. Anda cukup fokus membangun brand dan memasarkan produk."
    },
    {
      question: "Apa keuntungan menggunakan jasa maklon sunscreen?",
      answer: "Dengan maklon sunscreen, Anda bisa punya brand tabir surya sendiri tanpa investasi besar untuk pabrik dan mesin. Sunscreen termasuk produk dengan permintaan tinggi dan repeat-purchase kuat — wajib ada di lini skincare modern — sehingga menjadi produk yang menguntungkan untuk brand Anda."
    },
    {
      question: "Jenis sunscreen apa saja yang bisa dimaklonkan di Dreamlab?",
      answer: "Dreamlab dapat memproduksi sunscreen physical (mineral), chemical, maupun hybrid, dalam beragam tekstur: cream, gel, serum, lotion, spray, hingga sunscreen stick dan tone-up. Setiap jenis bisa diformulasikan custom sesuai target kulit dan konsep brand Anda."
    },
    {
      question: "Berapa nilai SPF dan PA yang bisa diformulasikan?",
      answer: "Dreamlab dapat memformulasikan sunscreen dengan beragam tingkat perlindungan, umumnya mulai dari SPF 30 hingga SPF 50+ dengan PA+++ atau PA++++. Nilai SPF dan PA pada label produk wajib dibuktikan melalui uji laboratorium agar klaimnya akurat dan lolos registrasi BPOM."
    },
    {
      question: "Berapa modal atau biaya maklon sunscreen?",
      answer: "Biaya maklon sunscreen bergantung pada formula, tingkat SPF, tekstur, kemasan, dan jumlah produksi. Sebagai gambaran umum industri, modal awal maklon kosmetik berkisar puluhan juta rupiah dan biasanya sudah termasuk BPOM serta Halal. Dreamlab memberi estimasi transparan setelah konsep Anda jelas."
    },
    {
      question: "Berapa MOQ minimum untuk maklon sunscreen?",
      answer: "MOQ (minimum order quantity) di Dreamlab bersifat fleksibel dan menyesuaikan jenis sunscreen serta kemasan. Brand pemula bisa mulai dari jumlah kecil untuk menguji pasar sebelum produksi besar. Angka pasti dijelaskan tim saat sesi konsultasi gratis."
    },
    {
      question: "Apakah maklon sunscreen di Dreamlab sudah termasuk uji SPF, BPOM, dan Halal?",
      answer: "Ya. Dreamlab menerapkan One-Stop Service, sehingga uji SPF di laboratorium, pengurusan izin edar BPOM RI, dan sertifikat Halal MUI ditangani sampai tuntas. Produk sunscreen Anda dijamin klaim perlindungannya akurat, legal, dan aman dipasarkan."
    },
    {
      question: "Bagaimana cara memulai maklon sunscreen di Dreamlab?",
      answer: "Mulai dengan konsultasi gratis untuk membahas konsep brand dan jenis sunscreen yang diinginkan. Tim R&D lalu merancang formula, dilanjutkan uji SPF dan sample, produksi massal, hingga pengurusan BPOM dan Halal. Total proses rata-rata 3-6 bulan. Hubungi Dreamlab via WhatsApp untuk menjadwalkan konsultasi."
    },
  ],
  "decorative-lip-balm": [
    {
      question: "Apa itu maklon lip balm?",
      answer: "Layanan produksi lip balm custom dengan brand milik Anda sendiri."
    },
    {
      question: "Kenapa lip balm cocok menjadi produk andalan?",
      answer: "Lip balm memiliki repeat purchase tinggi dan digunakan setiap hari oleh konsumen."
    },
    {
      question: "Berapa biaya dan MOQ maklon lip balm?",
      answer: "MOQ fleksibel untuk brand pemula maupun brand berkembang."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab membantu seluruh proses legalitas produk."
    },
  ],
  "decorative-lip-blush": [
    {
      question: "Apa itu maklon lip blush?",
      answer: "Layanan produksi lip blush atau lip tint dengan brand milik Anda sendiri."
    },
    {
      question: "Apa keunggulan lip blush?",
      answer: "Memberikan warna natural tahan lama dengan tekstur ringan di bibir."
    },
    {
      question: "Berapa biaya dan MOQ maklon lip blush?",
      answer: "MOQ fleksibel dengan formula yang dapat dikustomisasi sesuai konsep brand."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab membantu seluruh proses legalitas produk hingga siap edar."
    },
  ],
  "decorative-lip-cream": [
    {
      question: "Apa itu maklon lip cream?",
      answer: "Maklon lip cream adalah layanan produksi lip cream dengan brand milik Anda sendiri tanpa perlu memiliki pabrik."
    },
    {
      question: "Jenis lip cream apa saja yang bisa dimaklonkan?",
      answer: "Dreamlab menyediakan lip cream matte, satin, mousse, hingga velvet dengan pilihan shade custom."
    },
    {
      question: "Berapa biaya dan MOQ maklon lip cream?",
      answer: "MOQ fleksibel dan biaya disesuaikan dengan formula, kemasan, serta jumlah produksi."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab membantu pengurusan BPOM dan sertifikasi Halal hingga produk siap dipasarkan."
    },
  ],
  "decorative-lip-gloss": [
    {
      question: "Apa itu maklon lip gloss?",
      answer: "Layanan produksi lip gloss custom dengan brand milik Anda sendiri."
    },
    {
      question: "Jenis lip gloss apa saja yang bisa dibuat?",
      answer: "Gloss bening, gloss berwarna, hingga plumping gloss tersedia sesuai konsep brand."
    },
    {
      question: "Berapa biaya dan MOQ maklon lip gloss?",
      answer: "MOQ fleksibel dengan formula yang dapat dikustomisasi."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab membantu seluruh pengurusan legalitas produk."
    },
  ],
  "decorative-lip-matte": [
    {
      question: "Apa itu maklon lip matte?",
      answer: "Layanan produksi lip matte custom dengan brand milik Anda sendiri."
    },
    {
      question: "Bagaimana agar lip matte tidak membuat bibir kering?",
      answer: "Dreamlab menggunakan formula dengan kandungan pelembap agar tetap nyaman digunakan."
    },
    {
      question: "Berapa biaya dan MOQ maklon lip matte?",
      answer: "MOQ fleksibel dan biaya mengikuti formula serta packaging yang dipilih."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, seluruh layanan sudah termasuk pengurusan legalitas BPOM dan Halal."
    },
  ],
  "decorative-lip-scrub": [
    {
      question: "Apa itu maklon lip scrub?",
      answer: "Layanan produksi lip scrub custom dengan brand milik Anda sendiri."
    },
    {
      question: "Kenapa lip scrub penting dalam lip care?",
      answer: "Lip scrub membantu mengangkat sel kulit mati sebelum penggunaan lip balm atau lipstik."
    },
    {
      question: "Berapa biaya dan MOQ maklon lip scrub?",
      answer: "MOQ fleksibel dan biaya mengikuti kebutuhan formula serta kemasan."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab membantu pengurusan legalitas produk secara lengkap."
    },
  ],
  "decorative-lip-serum": [
    {
      question: "Apa itu maklon lip serum?",
      answer: "Layanan produksi lip serum dengan brand milik Anda sendiri."
    },
    {
      question: "Apa fungsi lip serum?",
      answer: "Membantu melembapkan, menutrisi, dan merawat bibir secara intensif."
    },
    {
      question: "Berapa biaya dan MOQ maklon lip serum?",
      answer: "MOQ fleksibel dengan formula dan kemasan custom."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, legalitas produk dibantu hingga selesai oleh Dreamlab."
    },
  ],
  "decorative-tinted-lip-balm": [
    {
      question: "Apa itu maklon tinted lip balm?",
      answer: "Layanan produksi tinted lip balm dengan brand milik Anda sendiri."
    },
    {
      question: "Apa keunggulan tinted lip balm?",
      answer: "Menggabungkan fungsi makeup dan lip care dalam satu produk."
    },
    {
      question: "Berapa biaya dan MOQ maklon tinted lip balm?",
      answer: "MOQ fleksibel dengan biaya yang disesuaikan kebutuhan formula dan packaging."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, seluruh legalitas dibantu oleh tim Dreamlab."
    },
  ],
  "decorative-bb-cream": [
    {
      question: "Apa itu maklon BB cream?",
      answer: "Maklon BB cream adalah layanan produksi BB cream dengan brand milik Anda sendiri tanpa perlu membangun pabrik."
    },
    {
      question: "Apa keunggulan BB cream untuk brand pemula?",
      answer: "BB cream memiliki pasar luas karena praktis, ringan, dan cocok untuk makeup natural harian."
    },
    {
      question: "Berapa biaya dan MOQ maklon BB cream?",
      answer: "MOQ fleksibel dengan biaya yang mengikuti formula dan packaging produk."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, seluruh legalitas produk dibantu oleh Dreamlab hingga selesai."
    },
  ],
  "decorative-cream-blush": [
    {
      question: "Apa itu maklon cream blush?",
      answer: "Maklon cream blush adalah layanan produksi blush cream dengan brand milik Anda sendiri."
    },
    {
      question: "Kenapa cream blush populer di pasar makeup?",
      answer: "Karena memberikan hasil natural, fresh, dan dewy yang sesuai tren makeup modern."
    },
    {
      question: "Berapa biaya dan MOQ maklon cream blush?",
      answer: "MOQ fleksibel dengan formula dan warna yang dapat disesuaikan kebutuhan brand."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, seluruh pengurusan legalitas produk dibantu oleh Dreamlab."
    },
  ],
  "decorative-eyebrow-gel": [
    {
      question: "Apa itu maklon eyebrow gel?",
      answer: "Maklon eyebrow gel adalah layanan produksi gel alis dengan brand milik Anda sendiri."
    },
    {
      question: "Jenis eyebrow gel apa yang bisa dibuat?",
      answer: "Dreamlab menyediakan eyebrow gel bening maupun berwarna sesuai konsep brand Anda."
    },
    {
      question: "Berapa biaya dan MOQ maklon eyebrow gel?",
      answer: "MOQ fleksibel dengan biaya yang mengikuti formula dan jumlah produksi."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, seluruh legalitas produk dibantu oleh Dreamlab hingga siap dipasarkan."
    },
  ],
  "decorative-face-primer": [
    {
      question: "Apa itu maklon face primer?",
      answer: "Maklon face primer adalah layanan produksi primer makeup dengan brand milik Anda sendiri."
    },
    {
      question: "Fungsi apa saja yang bisa diformulasikan pada face primer?",
      answer: "Dreamlab dapat mengembangkan primer untuk blur pori, oil control, hydrating, hingga glowing finish."
    },
    {
      question: "Berapa biaya dan MOQ maklon face primer?",
      answer: "MOQ fleksibel dengan biaya yang disesuaikan kebutuhan formula dan kemasan."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab membantu pengurusan BPOM dan sertifikasi Halal produk Anda."
    },
  ],
  "decorative-foundation-serum": [
    {
      question: "Apa itu maklon foundation serum?",
      answer: "Maklon foundation serum adalah layanan produksi foundation serum dengan brand milik Anda sendiri."
    },
    {
      question: "Kenapa foundation serum sedang tren?",
      answer: "Karena menggabungkan coverage ringan dengan kandungan skincare yang nyaman untuk daily makeup."
    },
    {
      question: "Berapa biaya dan MOQ maklon foundation serum?",
      answer: "MOQ fleksibel dengan formula dan kemasan yang dapat dikustomisasi."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab membantu seluruh pengurusan legalitas produk hingga siap edar."
    },
  ],
  "decorative-foundation": [
    {
      question: "Apa itu maklon foundation?",
      answer: "Maklon foundation adalah layanan produksi foundation dengan brand milik Anda sendiri tanpa perlu memiliki pabrik."
    },
    {
      question: "Jenis foundation apa saja yang bisa dimaklonkan?",
      answer: "Dreamlab menyediakan liquid foundation, cushion foundation, hingga stick foundation dengan berbagai pilihan shade dan coverage."
    },
    {
      question: "Berapa biaya dan MOQ maklon foundation?",
      answer: "MOQ fleksibel dan biaya disesuaikan dengan formula, kemasan, dan jumlah produksi."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab membantu pengurusan BPOM dan sertifikasi Halal hingga produk siap edar."
    },
  ],
  "decorative-highlighter": [
    {
      question: "Apa itu maklon highlighter?",
      answer: "Maklon highlighter adalah layanan produksi liquid highlighter dengan brand milik Anda sendiri."
    },
    {
      question: "Jenis highlighter apa saja yang bisa dibuat?",
      answer: "Dreamlab menyediakan highlighter dengan shimmer natural hingga intense glow sesuai kebutuhan brand."
    },
    {
      question: "Berapa biaya dan MOQ maklon highlighter?",
      answer: "MOQ fleksibel dengan biaya mengikuti formula, packaging, dan jumlah produksi."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, legalitas BPOM dan Halal dibantu sepenuhnya oleh Dreamlab."
    },
  ],
  "decorative-liquid-blush": [
    {
      question: "Apa itu maklon liquid blush?",
      answer: "Maklon liquid blush adalah layanan produksi blush cair dengan brand milik Anda sendiri."
    },
    {
      question: "Apa keunggulan liquid blush?",
      answer: "Memiliki pigmentasi tinggi dengan hasil natural dan tahan lama di kulit."
    },
    {
      question: "Berapa biaya dan MOQ maklon liquid blush?",
      answer: "MOQ fleksibel dengan formula custom sesuai konsep brand Anda."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, Dreamlab membantu pengurusan legalitas produk hingga siap edar."
    },
  ],
  "decorative-mascara": [
    {
      question: "Apa itu maklon mascara?",
      answer: "Maklon mascara adalah layanan produksi mascara dengan brand milik Anda sendiri tanpa perlu memiliki pabrik."
    },
    {
      question: "Efek mascara apa saja yang bisa diformulasikan?",
      answer: "Dreamlab menyediakan formula volumizing, curling, waterproof, hingga lengthening mascara."
    },
    {
      question: "Berapa biaya dan MOQ maklon mascara?",
      answer: "MOQ fleksibel dengan biaya yang menyesuaikan formula dan packaging produk."
    },
    {
      question: "Apakah sudah termasuk BPOM dan Halal?",
      answer: "Ya, seluruh legalitas produk dibantu oleh Dreamlab hingga siap dipasarkan."
    },
  ],
};


export default function ProductFAQ({ categorySlug, categoryName, subCategorySlug, productSlug, productName }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const normalizedSlug = categorySlug.toLowerCase().trim();
  const productKey = productSlug ? `${normalizedSlug}-${productSlug}` : undefined;
  const subKey = subCategorySlug ? `${normalizedSlug}-${subCategorySlug}` : undefined;

  let faqs = categoryFaqs[normalizedSlug] || categoryFaqs.skincare;
  if (productKey && categoryFaqs[productKey]) {
    faqs = categoryFaqs[productKey];
  } else if (subKey && categoryFaqs[subKey]) {
    faqs = categoryFaqs[subKey];
  }

  const displayName = productName || categoryName;

  // Badge list stagger variants
  const badgeContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 12 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: premiumEase }
    }
  };

  return (
    <section className="bg-white py-20 md:py-24 border-t border-neutral-100 relative overflow-hidden w-full">
      {/* Dynamic ambient highlight backdrop */}
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-brand-orange/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Centered Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-normal text-brand-black tracking-tight uppercase">
            Ketahui Lebih Lanjut Maklon <span className="text-brand-orange font-bold">{displayName}</span> Dreamlab
          </h2>
          <div className="w-16 h-1 bg-brand-orange mx-auto mt-4 rounded-full" />
        </div>

        {/* Centered Premium Accordions */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 md:p-8 lg:p-10 divide-y divide-neutral-100"
          >
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div key={idx} className="py-5 first:pt-0 last:pb-0">
                  {/* Trigger Header */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <div className="flex items-start gap-4 pr-4">
                      {/* Decorative small indicator */}
                      <HelpCircle className={`size-5 mt-0.5 flex-shrink-0 transition-colors duration-300 ${isOpen ? "text-brand-orange" : "text-neutral-400"}`} />
                      
                      <h4 className={`text-sm md:text-base font-bold font-onest leading-snug transition-colors duration-300 ${isOpen ? "text-brand-orange" : "text-neutral-800 group-hover:text-brand-orange"}`}>
                        {item.question}
                      </h4>
                    </div>

                    {/* Hardware-Accelerated Chevron circle indicator */}
                    <motion.div 
                      animate={{ 
                        rotate: isOpen ? 180 : 0,
                        scale: isOpen ? 1.05 : 1,
                        borderColor: isOpen ? "rgba(246, 145, 30, 0.3)" : "rgba(229, 229, 229, 1)",
                        backgroundColor: isOpen ? "rgba(246, 145, 30, 0.05)" : "rgba(250, 250, 250, 1)",
                        color: isOpen ? "#F6911E" : "#A3A3A3"
                      }}
                      transition={{ duration: 0.4, ease: premiumEase }}
                      className="size-8 rounded-full border flex items-center justify-center flex-shrink-0 shadow-inner group-hover:border-brand-orange/40 group-hover:text-brand-orange"
                    >
                      <ChevronDown className="size-4" />
                    </motion.div>
                  </button>

                  {/* Body Collapsible */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: premiumEase }}
                        className="overflow-hidden"
                      >
                        {/* Gliding dissolve answer panel */}
                        <motion.div 
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.05, ease: premiumEase }}
                          className="pl-9 pt-4 pb-2 text-xs md:text-sm text-neutral-500 leading-relaxed font-normal max-w-[95%]"
                        >
                          {/* Sleek separator line */}
                          <div className="w-8 h-[2px] bg-brand-orange/20 mb-4 rounded-full" />
                          {item.answer}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}