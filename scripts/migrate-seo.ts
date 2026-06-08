import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const CSV_PATH = path.join(process.cwd(), 'src/data/seo-audit-export.csv');
const OUTPUT_PATH = path.join(process.cwd(), 'src/data/supabase-import.json');

async function migrate() {
    console.log('🚀 Starting SEO Data Migration...');

    const fileContent = fs.readFileSync(CSV_PATH, { encoding: 'utf-8' });
    
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    });

    const supabaseData = records.map((record: Record<string, string>) => {
        // Cleaning slug: ensure it starts with /
        let slug = record.slug;
        if (!slug.startsWith('/')) slug = '/' + slug;
        
        // Remove trailing slash if not home
        if (slug !== '/' && slug.endsWith('/')) slug = slug.slice(0, -1);

        return {
            slug: slug,
            meta_title: record.meta_title || '',
            meta_description: record.meta_description || '',
            h1: record.h1 || '',
            canonical_url: record.canonical || `https://dreamlab.id${slug}`,
            hero_image_url: record.hero_image_url || '',
            is_programmatic: false,
            // Placeholder for advanced fields
            supporting_entities: [],
            data_table_json: [],
            schema_markup: {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": record.meta_title,
                "description": record.meta_description
            },
            faq_json: [],
            content_blocks: []
        };
    });

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(supabaseData, null, 2));
    console.log(`✅ Migration complete! ${supabaseData.length} records saved to ${OUTPUT_PATH}`);
}

migrate().catch(console.error);
