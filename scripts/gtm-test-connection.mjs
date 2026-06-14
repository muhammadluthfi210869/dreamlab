/**
 * Quick Test: Verify GTM API Connection
 * 
 * Jalankan: node scripts/gtm-test-connection.mjs
 */

import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const credentials = JSON.parse(readFileSync(join(__dirname, '..', 'sunny-idiom-499103-g6-93cd98095277.json'), 'utf8'));

async function testConnection() {
  console.log('🔍 Testing GTM API Connection...\n');
  
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/tagmanager.readonly'],
    });

    const gtm = google.tagmanager({ version: 'v2', auth });
    
    const response = await gtm.accounts.list();
    const accounts = response.data.account || [];
    
    if (accounts.length > 0) {
      console.log('✅ Connection successful!\n');
      console.log('📋 Your GTM Accounts:');
      accounts.forEach((a, i) => {
        console.log(`  ${i + 1}. ${a.name} (ID: ${a.accountId})`);
      });
      return true;
    } else {
      console.log('⚠️  No accounts found.');
      console.log('\n💡 Make sure you have invited the service account to GTM:');
      console.log('   Email: dreamlab@sunny-idiom-499103-g6.iam.gserviceaccount.com');
      console.log('   Go to: tagmanager.google.com → Admin → User Management → Add');
      return false;
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('403')) {
      console.log('\n💡 Solutions:');
      console.log('1. Enable GTM API: https://console.cloud.google.com/apis/library/tagmanager.googleapis.com');
      console.log('2. Invite service account email to GTM');
    } else if (error.message.includes('401')) {
      console.log('\n💡 Check if the service account JSON file is valid');
    }
    
    return false;
  }
}

testConnection();
