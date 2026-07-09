# SEO KNOWLEDGE BASE — SISTEM REFERENSI ABSOLUT
> Versi 1.0 | Universal (Lintas Industri) | Dirancang untuk Claude Code
> Gunakan file ini sebagai acuan utama dalam setiap keputusan arsitektur, konten, dan teknikal SEO.

---

## FILOSOFI DASAR

Google bukan mesin pencocokan kata kunci. Google adalah mesin pemahaman **entitas, konteks, dan otoritas**. Setiap keputusan SEO harus berdasarkan prinsip berikut:

1. **Relevance** — Apakah halaman ini memang membahas topik yang dicari secara mendalam?
2. **Authority** — Apakah sumber ini dipercaya oleh entitas lain di ekosistem web?
3. **Experience** — Apakah pengguna mendapatkan jawaban terbaik di sini dibanding sumber lain?
4. **Technical Soundness** — Apakah Googlebot dapat mengakses, merender, dan memahami konten ini tanpa hambatan?

Konten yang memenuhi keempat prinsip ini secara simultan = konten yang mendominasi SERP jangka panjang.

---

## MODUL 1 — RENDERING & INFRASTRUKTUR TEKNIKAL

### 1.1 Arsitektur Rendering Wajib

Google menggunakan **Web Rendering Service (WRS)** untuk mengeksekusi JavaScript. WRS memiliki antrian — artinya halaman JS-heavy bisa tertunda diindeks berjam-jam hingga berhari-hari. Solusinya adalah memotong ketergantungan ini.

**Hierarki rendering (dari terbaik ke terburuk untuk SEO):**

| Mode | Cara Kerja | SEO Score | Rekomendasi |
|------|-----------|-----------|-------------|
| SSG (Static Site Generation) | HTML dihasilkan saat build | ★★★★★ | Gunakan untuk halaman statis (lokasi, layanan) |
| SSR (Server-Side Rendering) | HTML dihasilkan per request di server | ★★★★☆ | Gunakan untuk halaman dinamis yang berubah sering |
| ISR (Incremental Static Regen) | SSG + refresh periodik | ★★★★★ | Gunakan untuk konten yang berubah terjadwal (harga, produk) |
| CSR (Client-Side Rendering) | HTML dihasilkan di browser | ★☆☆☆☆ | **HINDARI** untuk konten yang harus diindeks |

**Implementasi:**
- **Next.js App Router**: `generateStaticParams()` untuk SSG, `revalidate` untuk ISR
- **Astro**: Zero JS by default — ideal untuk content-heavy sites
- **Nuxt.js**: Ekuivalen Next.js untuk Vue ecosystem

**Aturan wajib:**
```
SETIAP halaman yang harus diindeks Google HARUS menghasilkan HTML matang
di View Page Source (Ctrl+U) — bukan skeleton HTML kosong.
```

---

### 1.2 Core Web Vitals Engineering

Google menjadikan CWV sebagai sinyal ranking langsung. Target threshold "Good":

| Metrik | Target | Cara Ukur |
|--------|--------|-----------|
| LCP (Largest Contentful Paint) | < 2.5 detik | PageSpeed Insights, CrUX |
| INP (Interaction to Next Paint) | < 200 ms | Chrome DevTools |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse CLI |

**Teknik optimasi per metrik:**

**LCP:**
```html
<!-- Gambar hero: tambahkan fetchpriority dan preload -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">
<img src="/hero.webp" fetchpriority="high" alt="..." width="1200" height="630">
```
- Gunakan format WebP/AVIF
- Amankan Critical Rendering Path — tidak ada CSS/JS besar di `<head>` yang blocking
- Host font lokal, hindari Google Fonts external request

**INP:**
- Code splitting agresif — jangan load JS yang tidak dibutuhkan di halaman ini
- Defer semua analytics script (GA4, Meta Pixel) ke `afterInteractive`
- Gunakan `useTransition` / `startTransition` di React untuk interaksi non-urgent

**CLS:**
```css
/* Kunci dimensi semua media dengan aspect-ratio */
img, video, iframe { aspect-ratio: attr(width) / attr(height); }
.hero-image { aspect-ratio: 16 / 9; }
```
- Selalu definisikan `width` dan `height` pada semua `<img>`
- Hindari insert konten di atas fold setelah page load (ads, banners)

---

### 1.3 Canonical Guard & URL Hygiene

Setiap URL duplikat = kebocoran link equity. Canonical yang salah = kanibalisme otoritas.

**Aturan canonical wajib:**
```html
<!-- Inject dinamis per halaman, selalu URL absolut -->
<link rel="canonical" href="https://www.domain.com/path/absolut/">
```

**Eliminasi URL parameter di middleware (Next.js):**
```javascript
// middleware.js
export function middleware(request) {
  const url = request.nextUrl.clone();
  const paramsToStrip = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid', 'ref', 'sort', 'page'];
  let modified = false;
  
  paramsToStrip.forEach(param => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      modified = true;
    }
  });
  
  if (modified) return NextResponse.redirect(url, 301);
}
```

**Kasus canonical yang wajib ditangani:**
- Pagination: `/blog` dan `/blog?page=1` → canonical ke `/blog`
- Trailing slash: konsisten, pilih satu, redirect 301 yang lain
- www vs non-www: pilih satu, redirect 301 permanen
- HTTP vs HTTPS: semua harus HTTPS, redirect 301

---

### 1.4 Sitemap Termodularisasi

Untuk website dengan ratusan halaman, satu sitemap.xml monolitik tidak efisien.

**Struktur sitemap induk:**
```xml
<!-- /sitemap.xml (sitemap index) -->
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.domain.com/sitemap-pages.xml</loc>
    <lastmod>2026-01-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.domain.com/sitemap-blog.xml</loc>
    <lastmod>2026-01-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.domain.com/sitemap-lokasi.xml</loc>
    <lastmod>2026-01-01</lastmod>
  </sitemap>
</sitemapindex>
```

**Generate otomatis di Next.js App Router:**
```javascript
// app/sitemap.xml/route.js
export async function GET() {
  const pages = await supabase.from('pages').select('url_slug, updated_at');
  const xml = generateSitemapXML(pages);
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
```

**Notifikasi Google setelah publish halaman baru:**
```
GET https://www.google.com/ping?sitemap=https://www.domain.com/sitemap.xml
```
Paling reliable dibanding Indexing API untuk halaman non-JobPosting.

---

### 1.5 Crawl Log Analysis

Log server adalah sumber kebenaran — menunjukkan persis apa yang Googlebot lihat dan rayapi.

**Filter Googlebot asli (wajib verifikasi via reverse DNS):**
```bash
# Filter log nginx untuk Googlebot
grep "Googlebot" /var/log/nginx/access.log | \
  awk '{print $1, $7, $9}' | \
  sort | uniq -c | sort -rn > crawl_report.csv

# Verifikasi IP Googlebot asli (jangan percaya user-agent saja)
host [IP_ADDRESS]
# Harus resolve ke: *.googlebot.com atau *.google.com
```

**Jika di Vercel/Cloudflare:** Gunakan Log Drains ke Axiom, Logtail, atau Datadog.

**Yang harus dianalisis dari crawl log:**
- Halaman mana yang paling sering dirayapi (prioritas Google)
- Halaman mana yang tidak pernah dirayapi (masalah internal linking atau noindex)
- Response code distribution (404, 301, 200)
- Crawl frequency trend (apakah menurun = sinyal negatif)

---

## MODUL 2 — SCHEMA MARKUP LANJUTAN

### 2.1 Filosofi Nested Schema

Schema markup bukan sekadar structured data — ini adalah **Knowledge Graph pribadi** yang kamu bangun untuk Google. Tujuannya: membuat Google memahami hierarki entitas bisnis kamu tanpa ambiguitas.

**Prinsip nested schema:**
- Satu blok JSON-LD per halaman yang mencakup semua entitas terkait
- Gunakan `@id` sebagai pengenal entitas universal (URL absolut)
- Tautkan entitas antar halaman dengan referensi `@id` yang sama
- Tidak ada redundansi kode — entitas direferensikan, bukan diduplikasi

### 2.2 Template Nested Schema Universal

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.domain.com/#organization",
      "name": "[NAMA BISNIS]",
      "url": "https://www.domain.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.domain.com/logo.png",
        "width": 512,
        "height": 512
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "[NOMOR]",
        "contactType": "customer service",
        "availableLanguage": "Indonesian"
      },
      "sameAs": [
        "https://www.instagram.com/[handle]",
        "https://www.linkedin.com/company/[handle]"
      ]
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.domain.com/#localbusiness",
      "parentOrganization": { "@id": "https://www.domain.com/#organization" },
      "name": "[NAMA BISNIS]",
      "description": "[DESKRIPSI TEKNIS — BUKAN MARKETING]",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "[ALAMAT]",
        "addressLocality": "[KOTA]",
        "addressRegion": "[PROVINSI]",
        "postalCode": "[KODE POS]",
        "addressCountry": "ID"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "[LAT]",
        "longitude": "[LNG]"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "[KOTA 1]"
        },
        {
          "@type": "City", 
          "name": "[KOTA 2]"
        }
      ],
      "hasOfferCatalog": { "@id": "https://www.domain.com/#services" }
    },
    {
      "@type": "OfferCatalog",
      "@id": "https://www.domain.com/#services",
      "name": "Layanan [BISNIS]",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "@id": "https://www.domain.com/layanan/[slug]/#service",
            "name": "[NAMA LAYANAN]",
            "description": "[DESKRIPSI TEKNIS]",
            "provider": { "@id": "https://www.domain.com/#organization" }
          }
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://www.domain.com/[path]/#webpage",
      "url": "https://www.domain.com/[path]/",
      "name": "[TITLE TAG]",
      "description": "[META DESCRIPTION]",
      "isPartOf": { "@id": "https://www.domain.com/#website" },
      "about": { "@id": "https://www.domain.com/#localbusiness" },
      "breadcrumb": { "@id": "https://www.domain.com/[path]/#breadcrumb" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.domain.com/[path]/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://www.domain.com/" },
        { "@type": "ListItem", "position": 2, "name": "[KATEGORI]", "item": "https://www.domain.com/[kategori]/" },
        { "@type": "ListItem", "position": 3, "name": "[HALAMAN INI]" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.domain.com/[path]/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "[PERTANYAAN TEKNIS — DARI PAA GOOGLE]",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "[JAWABAN DENGAN DATA KUANTITATIF — MINIMAL 50 KATA]"
          }
        },
        {
          "@type": "Question",
          "name": "[PERTANYAAN 2]",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "[JAWABAN 2]"
          }
        },
        {
          "@type": "Question",
          "name": "[PERTANYAAN 3]",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "[JAWABAN 3]"
          }
        }
      ]
    }
  ]
}
```

### 2.3 Schema Tambahan Per Konteks

| Konteks Bisnis | Schema Tambahan |
|----------------|-----------------|
| E-commerce / Produk | `Product`, `AggregateRating`, `Offer` |
| Artikel / Blog | `Article`, `BlogPosting`, `Author` |
| Acara / Event | `Event`, `Place` |
| Lowongan Kerja | `JobPosting` |
| Kursus / Pendidikan | `Course`, `EducationalOrganization` |
| Review / Ulasan | `Review`, `AggregateRating` |
| Resep | `Recipe` |
| Perangkat Lunak | `SoftwareApplication` |
| Video | `VideoObject` |

---

## MODUL 3 — NLP, ENTITAS & SALIENCE SCORE

### 3.1 Cara Google Membaca Konten (2026)

Google tidak membaca kata per kata. Google menggunakan model NLP (BERT, MUM, dan generasi berikutnya) untuk memahami:

1. **Entitas** — Objek, orang, tempat, konsep yang disebut dalam teks
2. **Relasi antar entitas** — Bagaimana entitas-entitas ini berhubungan
3. **Salience** — Seberapa "sentral" sebuah entitas dalam dokumen ini
4. **Sentiment** — Perspektif dokumen terhadap setiap entitas

**Rumus sederhana:**
```
Konten berkualitas tinggi = Entitas primer yang tepat + Relasi yang logis + Data yang tidak ada di tempat lain
```

### 3.2 Menggunakan Google Cloud Natural Language API

```javascript
// Cek salience score konten sebelum publish
const { LanguageServiceClient } = require('@google-cloud/language');
const client = new LanguageServiceClient();

async function analyzeSalience(text) {
  const [result] = await client.analyzeEntities({
    document: { content: text, type: 'PLAIN_TEXT' },
    encodingType: 'UTF8',
  });
  
  return result.entities
    .filter(e => e.salience > 0.05) // Filter entitas signifikan
    .sort((a, b) => b.salience - a.salience)
    .map(e => ({
      name: e.name,
      type: e.type,
      salience: e.salience.toFixed(4),
    }));
}
```

**Target salience yang realistis per konteks:**

| Tipe Halaman | Entitas Primer | Target Salience |
|-------------|----------------|-----------------|
| Halaman layanan tunggal | 1 entitas | 0.60 – 0.85 |
| Halaman lokasi | 2-3 entitas | 0.30 – 0.55 per entitas |
| Artikel informatif | 3-5 entitas | 0.20 – 0.45 per entitas |
| Halaman perbandingan | 5-8 entitas | 0.10 – 0.30 per entitas |

> **PERINGATAN:** Target salience >0.89 untuk banyak entitas sekaligus adalah mustahil secara matematis. Dokumen dengan 10+ entitas akan mendistribusikan salience score secara alami di bawah 0.3 per entitas.

### 3.3 Ekstraksi Entitas Kompetitor

```javascript
// Pipeline: ambil top 5 SERP → scrape konten → analisis entitas → temukan gap
async function extractCompetitorEntities(keyword) {
  // 1. Ambil top 5 URL dari SERP (via DataForSEO API atau Playwright)
  const topUrls = await getSERPResults(keyword, 5);
  
  // 2. Scrape konten per URL
  const contents = await Promise.all(topUrls.map(url => scrapeContent(url)));
  
  // 3. Analisis entitas per halaman
  const allEntities = await Promise.all(contents.map(text => analyzeSalience(text)));
  
  // 4. Agregasi — entitas yang muncul di 3+ kompetitor = "wajib ada"
  const entityFrequency = {};
  allEntities.flat().forEach(({ name, type }) => {
    entityFrequency[name] = (entityFrequency[name] || 0) + 1;
  });
  
  return Object.entries(entityFrequency)
    .filter(([_, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1]);
}
```

### 3.4 Vector Embeddings untuk Internal Linking Otomatis

Google menggunakan vector embeddings untuk memahami kesamaan semantik antar dokumen. Kita bisa menggunakan pendekatan yang sama untuk membangun internal linking yang benar-benar relevan.

```javascript
// Menggunakan Supabase pgvector + OpenAI Embeddings
// 1. Saat artikel disimpan ke database
async function saveArticleWithEmbedding(article) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: article.title + " " + article.excerpt,
  });
  
  const embedding = embeddingResponse.data[0].embedding;
  
  await supabase.from('articles').insert({
    ...article,
    embedding, // vector(1536)
  });
}

// 2. Saat render halaman — ambil 5 artikel paling relevan secara semantik
async function getRelatedArticles(articleId, embedding) {
  const { data } = await supabase.rpc('match_articles', {
    query_embedding: embedding,
    match_threshold: 0.75,
    match_count: 5,
    exclude_id: articleId,
  });
  return data;
}
```

```sql
-- Supabase SQL: fungsi cosine similarity
CREATE OR REPLACE FUNCTION match_articles(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  exclude_id uuid
)
RETURNS TABLE(id uuid, title text, url_slug text, similarity float)
LANGUAGE sql STABLE AS $$
  SELECT id, title, url_slug,
    1 - (embedding <=> query_embedding) AS similarity
  FROM articles
  WHERE id != exclude_id
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
```

---

## MODUL 4 — PROGRAMMATIC SEO

### 4.1 Filosofi Programmatic SEO

Programmatic SEO = mengawinkan **database yang kaya** dengan **template yang cerdas** untuk menghasilkan ratusan atau ribuan halaman unik secara otomatis. Setiap halaman harus memiliki **diferensiasi konten yang genuine** — bukan hanya mengganti nama kota/produk.

**Formula keberhasilan:**
```
Programmatic SEO = Unik (data berbeda) + Relevan (entitas tepat) + Terhubung (internal link) + Terindeks (sitemap + canonical bersih)
```

**Kapan menggunakan programmatic SEO:**
- Ada dimensi yang berulang: [produk] × [lokasi], [layanan] × [segmen], [kategori] × [spesifikasi]
- Setiap kombinasi memiliki search demand yang terverifikasi
- Ada data unik per kombinasi yang bisa diinjeksikan

**Kapan TIDAK menggunakan:**
- Konten per halaman akan identik kecuali nama yang berbeda
- Tidak ada data unik per variasi
- Domain baru tanpa otoritas dasar (tunggu minimal 3-6 bulan, bangun 20-30 halaman berkualitas dulu)

---

### 4.2 Arsitektur Database Programmatic SEO

```sql
-- Tabel utama: pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_slug TEXT UNIQUE NOT NULL,           -- /layanan/[kategori]/[lokasi]
  primary_keyword TEXT NOT NULL,           -- keyword utama target
  secondary_keywords TEXT[],              -- array keyword sekunder
  supporting_entities JSONB,              -- output Google NLP API
  hero_image_url TEXT,                    -- dengan fetchpriority="high"
  data_table_json JSONB,                  -- data kuantitatif unik per halaman
  schema_markup JSONB,                    -- nested JSON-LD siap inject
  faq_json JSONB,                         -- array {question, answer} dari PAA
  content_blocks JSONB,                   -- array blok H2 + paragraf
  meta_title TEXT,                        -- max 60 karakter
  meta_description TEXT,                  -- max 160 karakter
  embedding vector(1536),                 -- untuk cosine similarity internal link
  competitor_gap TEXT[],                  -- entitas kompetitor yang belum ada
  serp_position INT,                      -- posisi ranking terkini
  last_indexed_at TIMESTAMPTZ,            -- kapan terakhir Googlebot mengunjungi
  word_count INT,                         -- panjang konten
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel kompetitor snapshot
CREATE TABLE competitor_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  competitor_url TEXT NOT NULL,
  entities JSONB,                          -- entitas yang ditemukan
  schema_types TEXT[],                     -- schema yang digunakan
  word_count INT,
  serp_position INT,
  crawled_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX ON pages USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON pages (primary_keyword);
CREATE INDEX ON pages (serp_position);
```

---

### 4.3 Arsitektur URL yang Benar

```
Domain Root
├── /[kategori-utama]/[lokasi]/          ← Location page
├── /[kategori-utama]/[lokasi]/[sub-area]/  ← Sub-location page
├── /layanan/[slug]/                     ← Service page per segmen
├── /layanan/[slug]/[lokasi]/            ← Service × Location page
├── /blog/[kategori]/[slug]/             ← Artikel informatif
└── /blog/[kategori]/                    ← Kategori blog (pillar)
```

**Implementasi Next.js App Router:**
```javascript
// app/[kategori]/[lokasi]/page.jsx
export async function generateStaticParams() {
  const { data: pages } = await supabase
    .from('pages')
    .select('url_slug')
    .eq('type', 'location');
  
  return pages.map(page => ({
    kategori: page.url_slug.split('/')[0],
    lokasi: page.url_slug.split('/')[1],
  }));
}

export async function generateMetadata({ params }) {
  const page = await getPageData(params);
  return {
    title: page.meta_title,
    description: page.meta_description,
    alternates: { canonical: `https://www.domain.com/${page.url_slug}/` },
  };
}
```

---

### 4.4 Diferensiasi Konten Wajib Per Halaman

Setiap halaman programmatic HARUS memiliki setidaknya 3 elemen yang berbeda dari halaman serupa:

```javascript
// Checklist diferensiasi konten per halaman
const differentiationChecklist = {
  quantitativeData: true,    // Harga/metrik/spesifikasi spesifik area/produk ini
  localContext: true,         // Karakteristik unik lokasi/segmen ini
  uniqueTable: true,          // Tabel perbandingan data yang tidak ada di halaman lain
  specificEntities: true,     // Nama tempat/produk/merek spesifik area ini
  faqs: true,                 // FAQ yang relevan spesifik halaman ini (dari PAA)
};
```

**Yang TIDAK boleh dilakukan:**
```javascript
// ❌ SALAH — Thin content, akan kena penalty
const locationPages = cities.map(city => ({
  title: `Layanan [NAMA LAYANAN] di ${city}`,
  content: `Kami menyediakan [NAMA LAYANAN] di ${city}. Hubungi kami sekarang.`,
}));

// ✓ BENAR — Setiap halaman punya data unik
const locationPages = await Promise.all(cities.map(async city => {
  const localData = await getLocalMarketData(city);
  const localProjects = await getPastProjects(city);
  const localPricing = await getLocalPricing(city);
  
  return {
    title: `[NAMA LAYANAN] ${city} — [DIFERENSIATOR TEKNIS]`,
    quantitativeData: localPricing,
    localContext: localData.characteristics,
    caseStudies: localProjects,
  };
}));
```

---

## MODUL 5 — STRATEGI KONTEN & INFORMATION GAIN

### 5.1 Hierarki Konten: Topical Authority

Topical authority dibangun dengan cakupan **luas sekaligus dalam** pada satu domain topik. Google mempercayai sumber yang membahas topik dari semua sudut, bukan hanya satu aspek.

```
STRUKTUR TOPICAL AUTHORITY

Pillar Page (1 halaman)
├── Mendefinisikan seluruh topik
├── Link ke semua cluster page
└── Menerima link dari semua cluster page

Cluster Page (banyak halaman)
├── Membahas subtopik secara mendalam
├── Selalu link ke Pillar Page
└── Bisa link ke cluster page yang relevan

Sub-Cluster (halaman turunan)
├── Membahas aspek sangat spesifik
├── Link ke Cluster Page parent
└── Target keyword long-tail spesifik
```

**Rumus internal linking:**
```
Setiap halaman baru → wajib link ke Pillar Page
Pillar Page → wajib link ke semua Cluster Page
Cluster Page → wajib link ke Sub-Cluster yang relevan
```

---

### 5.2 Information Gain — Kunci Dikutip AI Overviews

Google AI Overviews mengutip sumber yang memiliki **data yang tidak tersedia di tempat lain**. Ini disebut "information gain."

**Tipe data dengan information gain tertinggi:**

| Tipe Data | Contoh | Nilai Information Gain |
|-----------|--------|----------------------|
| Data harga aktual (bukan estimasi) | "Harga per unit: Rp 450.000/jam per Maret 2026" | ★★★★★ |
| Spesifikasi teknis terverifikasi | Tabel kapasitas, dimensi, output aktual | ★★★★★ |
| Data lapangan dari pengalaman nyata | "Dari 47 proyek di area X, rata-rata waktu penyelesaian..." | ★★★★★ |
| Perbandingan kuantitatif | Tabel A vs B vs C dengan metrik terukur | ★★★★☆ |
| Studi kasus dengan angka | "Proyek X: 3 hari lebih cepat dari estimasi, hemat 12%" | ★★★★☆ |
| Bantahan miskonsepsi dengan data | "Klaim umum X ternyata salah karena data Y menunjukkan Z" | ★★★☆☆ |
| Pendapat ahli yang terverifikasi | Kutipan dari praktisi dengan kredensial | ★★★☆☆ |

**Yang BUKAN information gain:**
- Definisi umum yang ada di Wikipedia
- Klaim tanpa angka ("sangat efisien", "terbaik di industri")
- Konten yang hanya menyusun ulang informasi publik
- Paragraph panjang tanpa satu pun data kuantitatif

---

### 5.3 Standar Artikel: Struktur Wajib

```markdown
# [H1: KEYWORD UTAMA + ENTITAS PENDUKUNG + NILAI TEKNIS]
# Gunakan value anchoring — angka atau klaim spesifik yang langsung menarik perhatian

[100 KATA PERTAMA: Langsung pukul dengan fakta terkuat. Zero basa-basi.]
[Contoh: "PC200 membutuhkan 2.3 liter solar per jam pada beban penuh..."]
[Tidak boleh ada kalimat seperti: "Anda mungkin sudah tahu bahwa..." atau "Dalam dunia X..."]

---

## [H2: PILAR INFORMASI PERTAMA]

[Tabel perbandingan data kuantitatif WAJIB ada di setiap H2 utama]

| Parameter | Opsi A | Opsi B | Opsi C |
|-----------|--------|--------|--------|
| [Metrik 1] | [Data] | [Data] | [Data] |
| [Metrik 2] | [Data] | [Data] | [Data] |

[Penjelasan teknis setelah tabel — bahasa manusia, bukan robot]

### [H3: Detail lebih teknis dari H2]

- **[Metrik/entitas teknis]**: [Data/penjelasan]
- **[Metrik/entitas teknis]**: [Data/penjelasan]

---

## FAQ: [JUDUL RELEVAN]

**[Pertanyaan dari People Also Ask Google]**
[Jawaban dengan data kuantitatif — minimal 50 kata — disertai angka spesifik]

**[Pertanyaan 2]**
[Jawaban 2]

**[Pertanyaan 3]**
[Jawaban 3]
```

**Aturan bold:**
```
Bold HANYA untuk: metrik/angka penting, entitas teknis, poin absolut/klaim definitif
BUKAN untuk: kata-kata umum, kalimat dekoratif, penekanan emosional
```

---

### 5.4 Subtopik dari People Also Ask (PAA)

PAA adalah sinyal langsung dari Google tentang subtopik yang dianggap relevan oleh intent pencarian.

**Pipeline ekstraksi PAA:**
```javascript
// Via DataForSEO API — lebih reliable dari scraping langsung
async function extractPAA(keyword) {
  const response = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{
      keyword,
      location_code: 2360, // Indonesia
      language_code: 'id',
      device: 'mobile',
    }]),
  });
  
  const data = await response.json();
  const paaItems = data.tasks[0].result[0].items
    .filter(item => item.type === 'people_also_ask')
    .flatMap(item => item.items.map(q => q.title));
  
  return paaItems;
}
```

**Penggunaan PAA dalam konten:**
- Setiap pertanyaan PAA → kandidat H2, H3, atau FAQ
- Pertanyaan PAA dengan volume tinggi → pertimbangkan halaman terpisah
- Kelompokkan PAA berdasarkan intent: informational, transactional, navigational

---

## MODUL 6 — LOCAL SEO

### 6.1 Google Business Profile (GBP) — Fondasi Local SEO

GBP adalah sumber traffic lokal terbesar. Tanpa GBP yang teroptimasi, website tidak akan muncul di Google Maps dan Local Pack (3 hasil pertama di Google untuk pencarian lokal).

**Checklist optimasi GBP wajib:**

```
☐ Nama bisnis: konsisten dengan nama legal, tidak ada keyword stuffing
☐ Kategori utama: pilih yang paling spesifik (bukan hanya "Business")
☐ Kategori sekunder: tambahkan semua kategori relevan (max 10)
☐ Deskripsi: 750 karakter, keyword natural, jelaskan keunikan layanan
☐ Area layanan: definisikan semua kota/kabupaten yang dilayani
☐ Jam operasional: akurat dan diperbarui saat libur nasional
☐ Foto: minimum 10 foto berkualitas tinggi (produk, tim, lokasi, proyek)
☐ Produk/Layanan: tambahkan semua layanan dengan deskripsi dan harga
☐ Pertanyaan & Jawaban: isi sendiri dengan pertanyaan umum pelanggan
☐ Ulasan: respons semua ulasan (positif dan negatif) dalam 24 jam
```

**Strategi ulasan untuk sinyal kepercayaan:**
```
1. Minta ulasan segera setelah transaksi selesai (saat kepuasan tertinggi)
2. Kirim link langsung ke halaman ulasan GBP via WhatsApp
3. Respons setiap ulasan — sebut nama pelanggan, ucapkan terima kasih spesifik
4. Untuk ulasan negatif: akui, minta maaf, tawarkan solusi, tindak lanjuti offline
```

---

### 6.2 NAP Consistency

Name, Address, Phone harus **100% identik** di semua platform. Inkonsistensi NAP membingungkan Google dan merusak local SEO signal.

```javascript
// Format NAP baku — simpan di satu tempat, gunakan di mana-mana
const NAP = {
  name: "PT. Nama Bisnis Resmi",           // Persis seperti di akta
  address: {
    street: "Jl. Contoh No. 123",
    city: "Nama Kota",
    province: "Nama Provinsi",
    postalCode: "12345",
    country: "Indonesia",
  },
  phone: "+62-812-3456-7890",              // Format konsisten
  website: "https://www.domain.com",
};

// Gunakan NAP ini di: website, GBP, semua direktori
```

**Direktori lokal yang wajib didaftarkan:**
- Google Business Profile (prioritas utama)
- Bing Places for Business
- Yellow Pages Indonesia (yellowpages.co.id)
- Direktori industri spesifik (tergantung sektor bisnis)
- Asosiasi bisnis lokal/regional

---

### 6.3 Location Pages yang Benar

Setiap kota/area layanan memerlukan halaman terpisah dengan konten unik.

**Checklist location page:**
```
☐ URL: /[layanan]/[nama-kota]/ (lowercase, hyphenated)
☐ Title: "[Layanan] [Kota] — [Diferensiator Spesifik]"
☐ H1: Mengandung keyword primer + nama kota + value proposition
☐ Konten unik: karakteristik pasar lokal, proyek yang pernah dikerjakan, harga lokal
☐ Schema: LocalBusiness dengan GeoCoordinates dan areaServed spesifik
☐ Internal link: ke halaman utama layanan + halaman kota tetangga
☐ CTA: nomor telepon/WhatsApp yang bisa diklik (tel: dan wa.me link)
☐ Embed Google Maps: titik lokasi atau area layanan
```

---

## MODUL 7 — BACKLINK & OTORITAS DOMAIN

### 7.1 Kualitas vs Kuantitas Backlink

**Prinsip 2026: 1 backlink relevan dari sumber otoritatif > 1.000 backlink dari blog spam.**

**Hierarki nilai backlink:**
```
Tier 1 (Nilai tertinggi):
├── Website pemerintah (.go.id, .gov)
├── Universitas dan lembaga penelitian (.ac.id, .edu)
├── Media nasional terpercaya (Kompas, Tempo, Bisnis.com)
└── Asosiasi industri resmi

Tier 2 (Nilai tinggi):
├── Media industri spesifik
├── Website mitra bisnis resmi
├── Direktori bisnis terkurasi
└── Platform profesional (LinkedIn Company Page)

Tier 3 (Nilai sedang):
├── Blog industri dengan DA tinggi
├── Medium / Substack dengan follower besar
└── Forum komunitas profesional

Nilai rendah / Hindari:
├── Blog spam / PBN (Private Blog Network)
├── Link farm
└── Comment spam
└── Backlink tidak relevan topik
```

### 7.2 Linkable Asset — Strategi Mendapat Backlink Natural

Buat konten yang **jurnalis, peneliti, dan blogger industri ingin kutip** karena mengandung data yang tidak ada di tempat lain.

**Tipe linkable asset terbukti efektif:**

| Asset Type | Contoh | Target Linker |
|-----------|--------|--------------|
| Laporan data tahunan | "Indeks Harga [Industri] [Tahun]" | Jurnalis, analis |
| Studi kasus dengan metrik | "Hasil 12 bulan implementasi X" | Praktisi, blogger |
| Panduan teknis mendalam | "Panduan Lengkap [Proses Teknis]" | Profesional industri |
| Tool / Kalkulator online | "Kalkulator Estimasi Biaya X" | Siapapun yang butuh |
| Infografis data | Visualisasi data industri | Media, blogger |
| Survey / Riset primer | Data yang dikumpulkan sendiri | Akademisi, media |

**Pipeline mendapat backlink dari jurnalis:**
```
1. Monitor permintaan jurnalis via HARO, SourceBottle, atau grup WhatsApp wartawan
2. Temukan pertanyaan yang relevan dengan industri kamu
3. Berikan respons dengan data spesifik dan kutipan yang bisa langsung dipakai
4. Sertakan kredensial dan URL referensi yang relevan
```

### 7.3 Backlink untuk Domain Baru

Domain baru (< 6 bulan) memerlukan fondasi backlink yang terpercaya:

**Prioritas untuk domain baru:**
1. LinkedIn Company Page & artikel LinkedIn Pulse (DA tinggi, relevan profesional)
2. Medium — tulis artikel teknis mendalam dengan link ke website
3. Direktori bisnis lokal yang terkurasi
4. Guest post di media industri yang established
5. Kolaborasi konten dengan bisnis komplementer (bukan kompetitor)

> **JANGAN** untuk domain baru: membeli backlink massal, PBN, link exchange agresif. Google dapat mendeteksi pola backlink tidak natural dan memberikan penalty manual.

---

## MODUL 8 — KEYWORD RESEARCH & PEMETAAN

### 8.1 Klasifikasi Intent Keyword

Setiap keyword harus diklasifikasikan berdasarkan **search intent** sebelum ditentukan halaman mana yang harus menargetnya.

| Intent | Definisi | Contoh | Halaman Target |
|--------|---------|--------|---------------|
| Informational | Mencari informasi/pengetahuan | "cara memilih X", "apa itu Y" | Artikel blog, panduan |
| Commercial | Membandingkan opsi sebelum beli | "X vs Y", "rekomendasi Z terbaik" | Halaman perbandingan, review |
| Transactional | Siap melakukan tindakan | "beli X", "sewa Y murah", "jasa Z terdekat" | Halaman layanan/produk dengan CTA |
| Navigational | Mencari brand/website tertentu | "login [brand]", "[brand] harga" | Homepage, halaman brand |

**Aturan: satu intent = satu halaman.** Jangan campurkan konten informational dan transactional dalam satu halaman.

---

### 8.2 Framework Keyword Mapping

```
DIMENSI KEYWORD untuk bisnis lokal/layanan:

[Layanan Utama] × [Modifier] × [Lokasi]

Modifier types:
├── Transaksional: "sewa", "jasa", "harga", "murah", "terbaik"
├── Spesifikasi: "per jam", "harian", "bulanan", "dengan operator"
├── Lokasi: kota, kabupaten, kecamatan, area spesifik
└── Segmen: "untuk konstruksi", "perkebunan", "proyek pemerintah"

Contoh kombinasi (berlaku untuk industri apapun):
- [Layanan] [Kota] → Halaman lokasi utama
- [Layanan] [Kecamatan] → Sub-lokasi page
- harga [Layanan] [Kota] → Halaman harga
- [Layanan] untuk [Segmen] [Kota] → Segmen × Lokasi page
```

### 8.3 Tools Keyword Research (Gratis/Murah)

```
Gratis:
├── Google Search Console → keyword yang sudah menghasilkan impresi
├── Google Keyword Planner → volume estimasi (butuh akun Ads)
├── Google Autocomplete → long-tail suggestion
├── People Also Ask → subtopik & FAQ ideas
└── Google Trends → tren seasonal

Berbayar terjangkau:
├── DataForSEO API (pay-as-you-go, ~$0.01-0.05 per request)
└── Ubersuggest (plan paling murah cukup untuk riset awal)

Alternatif Semrush/Ahrefs untuk analisis kompetitor:
├── GSC API (data akurat untuk domain sendiri)
├── DataForSEO SERP API (data kompetitor)
└── Playwright scraper untuk scrape PAA dan SERP features (bukan data volume)
```

---

## MODUL 9 — MONITORING & SISTEM OTOMATIS

### 9.1 SEO Health Monitor 24/7

Sistem monitoring otomatis yang mendeteksi masalah sebelum berdampak pada ranking.

```javascript
// seo-monitor.js — jalankan via cron (GitHub Actions gratis)
const { chromium } = require('playwright');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function runSEOHealthCheck() {
  const browser = await chromium.launch();
  const issues = [];
  
  // Ambil semua URL dari sitemap
  const urls = await fetchSitemapUrls(process.env.SITEMAP_URL);
  
  for (const url of urls) {
    const page = await browser.newPage();
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    
    // Cek 1: Status code
    if (response.status() !== 200) {
      issues.push(`❌ ${url} → Status ${response.status()}`);
    }
    
    // Cek 2: Canonical URL
    const canonical = await page.$eval(
      'link[rel="canonical"]',
      el => el.href
    ).catch(() => null);
    
    if (!canonical || canonical !== url) {
      issues.push(`⚠️ Canonical mismatch: ${url} → ${canonical}`);
    }
    
    // Cek 3: H1 ada dan tidak duplikat
    const h1Count = await page.$$eval('h1', els => els.length);
    if (h1Count !== 1) {
      issues.push(`⚠️ H1 count = ${h1Count} di ${url}`);
    }
    
    // Cek 4: Meta title ada
    const title = await page.title();
    if (!title || title.length < 10) {
      issues.push(`❌ Missing/short title di ${url}`);
    }
    
    await page.close();
  }
  
  // Kirim laporan via Telegram
  if (issues.length > 0) {
    await bot.telegram.sendMessage(
      CHAT_ID,
      `🚨 SEO Health Alert\n\n${issues.join('\n')}\n\n${new Date().toISOString()}`
    );
  } else {
    await bot.telegram.sendMessage(CHAT_ID, `✅ SEO Health OK — ${urls.length} halaman diperiksa`);
  }
  
  await browser.close();
}

runSEOHealthCheck();
```

**GitHub Actions untuk menjalankan otomatis:**
```yaml
# .github/workflows/seo-monitor.yml
name: SEO Health Monitor
on:
  schedule:
    - cron: '0 */6 * * *'  # Setiap 6 jam
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm install
      - run: npx playwright install chromium --with-deps
      - run: node seo-monitor.js
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
          SITEMAP_URL: ${{ secrets.SITEMAP_URL }}
```

---

### 9.2 Dashboard Monitoring GSC via Google Sheets

```javascript
// Google Apps Script — jalankan weekly trigger
function pullGSCData() {
  const propertyUrl = 'https://www.domain.com/';
  const endDate = new Date();
  const startDate = new Date(endDate - 28 * 24 * 60 * 60 * 1000); // 28 hari
  
  const request = {
    startDate: Utilities.formatDate(startDate, 'UTC', 'yyyy-MM-dd'),
    endDate: Utilities.formatDate(endDate, 'UTC', 'yyyy-MM-dd'),
    dimensions: ['query', 'page'],
    rowLimit: 1000,
  };
  
  const response = UrlFetchApp.fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`,
    {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: `Bearer ${ScriptApp.getOAuthToken()}` },
      payload: JSON.stringify(request),
    }
  );
  
  const data = JSON.parse(response.getContentText());
  const sheet = SpreadsheetApp.getActiveSheet();
  
  data.rows.forEach((row, i) => {
    sheet.getRange(i + 2, 1, 1, 6).setValues([[
      row.keys[0],          // Query
      row.keys[1],          // Page
      row.clicks,           // Clicks
      row.impressions,      // Impressions
      (row.ctr * 100).toFixed(2) + '%',  // CTR
      row.position.toFixed(1),            // Position
    ]]);
  });
}
```

---

## MODUL 10 — ANTI-PATTERN & PERINGATAN KRITIS

### 10.1 Pattern yang Akan Kena Penalty Google

```
❌ JANGAN LAKUKAN:

1. Thin Content Massal
   Ratusan halaman yang hanya mengganti nama kota/produk tanpa konten unik.
   Risiko: Google Helpful Content penalty — seluruh domain diturunkan.

2. Keyword Stuffing
   Mengulang keyword utama secara tidak natural lebih dari 2-3% densitas.
   Risiko: Penurunan ranking halaman individual.

3. Canonical yang Salah Arah
   Canonical ke URL yang berbeda dari URL aktual tanpa alasan yang jelas.
   Risiko: Halaman tidak diindeks atau otoritas terbuang.

4. Backlink Tidak Natural (Skema Link)
   Membeli backlink, link exchange masif, PBN.
   Risiko: Google Manual Action — site-wide penalty.

5. Konten AI Generik Tanpa Nilai Tambah
   Artikel panjang yang tidak membawa perspektif, data, atau insight baru.
   Risiko: Diklasifikasikan unhelpful content — tidak diindeks atau ranking sangat rendah.

6. Duplicate Meta Title/Description
   Semua halaman pakai title dan description yang sama atau sangat mirip.
   Risiko: Google menganggap semua halaman sebagai duplikat.

7. Internal Linking Tidak Relevan
   Menghubungkan halaman yang tidak berkaitan secara semantik.
   Risiko: Membuang crawl budget dan membingungkan topical authority.

8. Cloaking
   Menampilkan konten berbeda ke Googlebot vs pengguna nyata.
   Risiko: Permanent ban dari Google Index.

9. Hidden Text
   Teks putih di background putih, atau display: none untuk konten SEO.
   Risiko: Manual penalty.

10. Doorway Pages
    Halaman yang dibuat khusus untuk mesin pencari, bukan pengguna.
    Risiko: Dianggap spam, dihapus dari index.
```

### 10.2 Mitos SEO yang Perlu Dibantah

| Mitos | Kenyataan |
|-------|-----------|
| "Keyword density 2% adalah aturan SEO" | Tidak ada threshold density yang ditetapkan Google. Tulis natural. |
| "Lebih banyak backlink = ranking lebih tinggi" | Kualitas dan relevansi jauh lebih penting dari kuantitas. |
| "Domain age menentukan ranking" | Domain baru bisa outrank domain lama dengan konten dan authority yang lebih baik. |
| "Meta keywords masih penting" | Google mengabaikan meta keywords sejak 2009. |
| "Exact match domain (EMD) adalah keunggulan besar" | EMD update 2012 — keuntungan EMD sangat minimal di 2026. |
| "Google Indexing API mempercepat semua halaman" | Hanya resmi untuk JobPosting dan BroadcastEvent schema. |
| "Sitemap menjamin indexing" | Sitemap adalah request crawl, bukan jaminan indexing. Konten tetap harus berkualitas. |
| "Social media signals adalah ranking factor" | Google secara resmi menyatakan social signals bukan ranking factor langsung. |

---

## LAMPIRAN A — CHECKLIST LAUNCH SEO

Gunakan checklist ini setiap kali meluncurkan website baru atau halaman baru.

### Pre-Launch
```
☐ SSR/SSG dikonfirmasi — View Page Source menampilkan konten penuh
☐ Semua halaman penting memiliki unique title tag (< 60 karakter)
☐ Semua halaman memiliki meta description (< 160 karakter)
☐ Canonical URL diset dengan benar di setiap halaman
☐ robots.txt tidak memblokir halaman yang harus diindeks
☐ sitemap.xml dihasilkan dan mencakup semua halaman target
☐ Schema markup divalidasi di schema.org validator
☐ Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
☐ Mobile-friendly dikonfirmasi via Google Mobile-Friendly Test
☐ HTTPS aktif, tidak ada mixed content warning
☐ Internal linking ke Pillar Page dari setiap halaman
☐ Gambar semua memiliki alt text deskriptif
☐ URL parameter handling di middleware (redirect 301 strip params)
```

### Post-Launch (Hari 1)
```
☐ Submit sitemap ke Google Search Console
☐ Request indexing manual untuk halaman-halaman prioritas via GSC
☐ Ping sitemap Google: https://www.google.com/ping?sitemap=[URL_SITEMAP]
☐ Verifikasi GBP (Google Business Profile) — jika bisnis lokal
☐ Setup monitoring Telegram bot
☐ Konfirmasi GA4 tracking berjalan (Real-Time report)
```

### Post-Launch (Minggu 1-4)
```
☐ Monitor GSC untuk indexing issues dan coverage errors
☐ Cek crawl stats di GSC — apakah Googlebot mulai merayapi?
☐ Mulai content publishing sesuai kalender editorial
☐ Monitor Core Web Vitals di lapangan (CrUX data di GSC)
☐ Build backlink awal: GBP, LinkedIn, direktori bisnis
```

---

## LAMPIRAN B — GLOSSARY TEKNIKAL

| Istilah | Definisi |
|---------|---------|
| **Crawl Budget** | Batas jumlah halaman yang di-crawl Googlebot per hari di domain kamu |
| **Salience Score** | Skor 0-1 yang mengukur sentralitas sebuah entitas dalam dokumen (Google NLP API) |
| **Topical Authority** | Kepercayaan Google bahwa sebuah domain adalah sumber terbaik untuk topik tertentu |
| **Information Gain** | Data atau insight baru yang tidak tersedia di sumber lain — membuat konten layak dikutip |
| **Knowledge Graph** | Database entitas dan relasi yang digunakan Google untuk memahami dunia nyata |
| **E-E-A-T** | Experience, Expertise, Authoritativeness, Trustworthiness — kerangka evaluasi konten Google |
| **WRS** | Web Rendering Service — sistem Google untuk mengeksekusi JavaScript halaman web |
| **LCP** | Largest Contentful Paint — waktu render elemen terbesar di viewport |
| **INP** | Interaction to Next Paint — responsivitas halaman terhadap interaksi pengguna |
| **CLS** | Cumulative Layout Shift — stabilitas visual layout selama loading |
| **NAP** | Name, Address, Phone — data bisnis yang harus konsisten di semua platform |
| **PAA** | People Also Ask — fitur SERP Google yang menampilkan pertanyaan terkait |
| **ISR** | Incremental Static Regeneration — SSG dengan kemampuan refresh konten periodik |
| **Vector Embedding** | Representasi teks sebagai koordinat numerik dalam ruang multidimensi |
| **Cosine Similarity** | Metrik kesamaan semantik antar dua dokumen berdasarkan sudut antar vector |
| **Schema Markup** | Kode JSON-LD yang membantu Google memahami entitas dan struktur konten |
| **Canonical** | Tag HTML yang menunjuk ke versi "asli" dari konten yang mungkin duplikat |
| **Pillar Page** | Halaman utama yang mendefinisikan keseluruhan topik dan menautkan semua cluster |
| **Cluster Page** | Halaman subtopik yang mendukung pillar page dan membahas aspek spesifik |
| **GBP** | Google Business Profile — listing bisnis di Google Maps dan Search |
| **CrUX** | Chrome User Experience Report — data CWV lapangan dari pengguna nyata |
| **SERP** | Search Engine Results Page — halaman hasil pencarian Google |
| **Domain Authority** | Metrik pihak ketiga (Moz) yang memperkirakan kekuatan domain — bukan metrik Google resmi |
| **Link Equity** | "Nilai" otoritas yang mengalir melalui hyperlink antar halaman |
| **Thin Content** | Konten dengan sedikit atau tanpa nilai tambah bagi pengguna |
| **PBN** | Private Blog Network — jaringan blog palsu untuk membuat backlink — praktik black hat |
| **Cloaking** | Menampilkan konten berbeda ke Googlebot vs pengguna — pelanggaran berat |
| **Doorway Page** | Halaman yang dibuat khusus untuk search engine, bukan pengguna nyata |

---

*SEO KNOWLEDGE BASE v1.0 — Universal, Lintas Industri*
*Referensi utama: Google Search Central Documentation, Google Quality Raters Guidelines, Google E-E-A-T Framework*
*Diperbarui: 2026 | Berlaku untuk: semua jenis website dan industri*
