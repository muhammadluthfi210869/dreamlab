import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for bulk inserts

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function pushData() {
    console.log('📤 Reading migration data...');
    const dataPath = path.join(process.cwd(), 'src/data/supabase-import.json');
    
    if (!fs.existsSync(dataPath)) {
        console.error('❌ Migration file not found. Run migrate-seo first.');
        return;
    }

    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`📦 Found ${jsonData.length} records. Pushing to Supabase...`);

    // Insert in batches of 50
    const batchSize = 50;
    for (let i = 0; i < jsonData.length; i += batchSize) {
        const batch = jsonData.slice(i, i + batchSize);
        const { error } = await supabase
            .from('programmatic_seo')
            .upsert(batch, { onConflict: 'slug' });

        if (error) {
            console.error(`❌ Error pushing batch ${i / batchSize + 1}:`, error.message);
        } else {
            console.log(`✅ Pushed batch ${i / batchSize + 1}`);
        }
    }

    console.log('🏁 Migration to Supabase complete!');
}

pushData().catch(console.error);
