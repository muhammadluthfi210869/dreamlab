import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { AuditData } from '@/types';
import { supabase } from './supabase-client';

// This service will eventually switch to Supabase
// For now, it maintains parity by using the CSV source of truth
// It also supports falling back to Supabase if credentials are provided

let auditLookup: Map<string, AuditData> | null = null;

function getAuditLookup(): Map<string, AuditData> {
  if (auditLookup) return auditLookup;
  
  try {
    const csvPath = path.join(process.cwd(), 'src', 'data', 'seo-audit-export.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, { columns: true }) as AuditData[];
    
    auditLookup = new Map();
    records.forEach((r) => {
      const slug = (r.slug as string || '').replace(/\/$/, '');
      const metaTitle = (r.meta_title as string || '');
      
      if (slug && !metaTitle.includes('Page not found')) {
        auditLookup!.set(slug, r);
      }
    });
    return auditLookup;
  } catch (error) {
    console.error('Error loading SEO audit data:', error);
    return new Map();
  }
}

export async function getSEOData(slug: string) {
  // Normalize slug
  const cleanSlug = slug.replace(/\/$/, '');
  const slugWithSlash = cleanSlug.startsWith('/') ? cleanSlug : `/${cleanSlug}`;
  const slugWithoutSlash = slugWithSlash.slice(1);

  // 1. Try Supabase first if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co') {
    const { data, error } = await supabase
      .from('programmatic_seo')
      .select('*')
      .or(`slug.eq.${slugWithSlash},slug.eq.${cleanSlug},slug.eq.${slugWithoutSlash}`)
      .single();

    if (data && !error) {
      return {
        ...data,
        canonical: data.canonical_url || `https://dreamlab.id${slugWithSlash}`,
        schema_markup: data.schema_markup || {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": data.meta_title,
            "description": data.meta_description
        }
      };
    }
  }

  // 2. Fallback to CSV for Parity
  const lookup = getAuditLookup();
  const data = lookup.get(slugWithSlash) || lookup.get(cleanSlug) || lookup.get(slugWithoutSlash);

  if (!data) return null;

  // Derive programmatic data for specific services to show "Future State"
  const isMaklon = slugWithSlash.toLowerCase().includes('maklon');
  
  const derivedDataTable = isMaklon ? [
    { label: "Minimum Order (MOQ)", value: "Mulai 500 - 1000 pcs" },
    { label: "Sertifikasi", value: "CPKB Grade A, Halal, BPOM" },
    { label: "Waktu Lead Time", value: "45 - 60 Hari Kerja" },
    { label: "Layanan Formulasi", value: "Eksklusif & Custom R&D" }
  ] : [];

  const derivedFAQ = isMaklon ? [
    { 
        question: `Berapa biaya maklon ${data.h1}?`, 
        answer: "Biaya sangat bergantung pada formulasi, bahan baku, dan jenis kemasan. Dreamlab menawarkan paket kompetitif yang bisa disesuaikan dengan budget brand Anda." 
    },
    { 
        question: "Apakah sudah termasuk izin BPOM?", 
        answer: "Ya, layanan Dreamlab bersifat end-to-end, mencakup pendaftaran BPOM, sertifikasi Halal, hingga desain kemasan." 
    }
  ] : [];

  return {
    slug: slugWithSlash,
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    h1: data.h1,
    canonical: data.canonical || `https://dreamlab.id${slugWithSlash}`,
    hero_image_url: data.hero_image_url,
    supporting_entities: [],
    data_table_json: derivedDataTable,
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": data.meta_title,
      "description": data.meta_description,
      "url": data.canonical || `https://dreamlab.id${slugWithSlash}`
    },
    faq_json: derivedFAQ
  };
}

export function getAllSlugs() {
    const lookup = getAuditLookup();
    return Array.from(lookup.keys());
}
