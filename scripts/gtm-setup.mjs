/**
 * GTM API Setup Script for Dreamlab
 * 
 * Setup:
 * 1. Enable GTM API di Google Cloud Console
 * 2. Invite service account email ke GTM (Admin → User Management)
 *    Email: dreamlab@sunny-idiom-499103-g6.iam.gserviceaccount.com
 * 3. Jalankan: node scripts/gtm-setup.mjs
 */

import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load service account credentials
const credentialsPath = join(__dirname, '..', 'sunny-idiom-499103-g6-93cd98095277.json');
const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));

// Scopes for GTM API
const SCOPES = [
  'https://www.googleapis.com/auth/tagmanager.readonly',
  'https://www.googleapis.com/auth/tagmanager.edit.containers',
  'https://www.googleapis.com/auth/tagmanager.publish'
];

/**
 * Authenticate with service account
 */
async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return auth;
}

/**
 * List all GTM accounts
 */
async function listAccounts(gtm) {
  console.log('\n📋 Listing GTM Accounts...\n');
  
  const response = await gtm.accounts.list();
  const accounts = response.data.account || [];
  
  if (accounts.length === 0) {
    console.log('❌ No GTM accounts found. Make sure service account is invited to GTM.');
    return [];
  }

  accounts.forEach((account, i) => {
    console.log(`${i + 1}. Account: ${account.name}`);
    console.log(`   Path: ${account.path}`);
    console.log(`   Account ID: ${account.accountId}`);
    console.log('');
  });

  return accounts;
}

/**
 * List containers for an account
 */
async function listContainers(gtm, accountPath) {
  console.log(`\n📦 Listing Containers for ${accountPath}...\n`);
  
  const response = await gtm.accounts.containers.list({ parent: accountPath });
  const containers = response.data.container || [];
  
  if (containers.length === 0) {
    console.log('❌ No containers found.');
    return [];
  }

  containers.forEach((container, i) => {
    console.log(`${i + 1}. Container: ${container.name}`);
    console.log(`   Path: ${container.path}`);
    console.log(`   Container ID: ${container.containerId}`);
    console.log(`   Public ID: ${container.publicId}`);
    console.log('');
  });

  return containers;
}

/**
 * List workspaces for a container
 */
async function listWorkspaces(gtm, containerPath) {
  console.log(`\n🔧 Listing Workspaces for ${containerPath}...\n`);
  
  const response = await gtm.accounts.containers.workspaces.list({ parent: containerPath });
  const workspaces = response.data.workspace || [];
  
  if (workspaces.length === 0) {
    console.log('❌ No workspaces found.');
    return [];
  }

  workspaces.forEach((workspace, i) => {
    console.log(`${i + 1}. Workspace: ${workspace.name}`);
    console.log(`   Path: ${workspace.path}`);
    console.log(`   Workspace ID: ${workspace.workspaceId}`);
    console.log('');
  });

  return workspaces;
}

/**
 * Create GA4 Configuration Tag
 */
async function createGA4ConfigTag(gtm, workspacePath, measurementId) {
  console.log(`\n📊 Creating GA4 Config Tag (${measurementId})...\n`);
  
  const tag = {
    name: 'GA4 - Configuration',
    type: 'gaawc', // Google Analytics 4 Web Config
    parameter: [
      {
        key: 'measurementId',
        type: 'template',
        value: measurementId
      }
    ],
    firingTriggerId: ['2147479587'] // All Pages trigger (built-in)
  };

  try {
    const response = await gtm.accounts.containers.workspaces.tags.create({
      parent: workspacePath,
      requestBody: tag
    });
    console.log('✅ GA4 Config tag created:', response.data.name);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating GA4 tag:', error.message);
    return null;
  }
}

/**
 * Create Custom HTML Tag for Meta Pixel
 */
async function createMetaPixelTag(gtm, workspacePath, pixelId) {
  console.log(`\n📘 Creating Meta Pixel Tag (${pixelId})...\n`);
  
  const tag = {
    name: 'Meta Pixel',
    type: 'html',
    parameter: [
      {
        key: 'html',
        type: 'template',
        value: `<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>`
      },
      {
        key: 'supportDocument',
        type: 'template',
        value: ''
      }
    ],
    firingTriggerId: ['2147479587'] // All Pages trigger
  };

  try {
    const response = await gtm.accounts.containers.workspaces.tags.create({
      parent: workspacePath,
      requestBody: tag
    });
    console.log('✅ Meta Pixel tag created:', response.data.name);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating Meta Pixel tag:', error.message);
    return null;
  }
}

/**
 * Create Custom HTML Tag for TikTok Pixel
 */
async function createTikTokPixelTag(gtm, workspacePath, pixelId) {
  console.log(`\n🎵 Creating TikTok Pixel Tag (${pixelId})...\n`);
  
  const tag = {
    name: 'TikTok Pixel',
    type: 'html',
    parameter: [
      {
        key: 'html',
        type: 'template',
        value: `<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
  ttq.load=function(e,n){
    var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
    ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e+""]=+new Date,ttq._o=ttq._o||{},ttq._o[e+""]=n||{};
    var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;
    var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)
  };
  ttq.load('${pixelId}');
  ttq.page();
}(window, document, 'ttq');
</script>`
      },
      {
        key: 'supportDocument',
        type: 'template',
        value: ''
      }
    ],
    firingTriggerId: ['2147479587'] // All Pages trigger
  };

  try {
    const response = await gtm.accounts.containers.workspaces.tags.create({
      parent: workspacePath,
      requestBody: tag
    });
    console.log('✅ TikTok Pixel tag created:', response.data.name);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating TikTok Pixel tag:', error.message);
    return null;
  }
}

/**
 * Create GTM Snippet Tag
 */
async function createGTMTag(gtm, workspacePath, gtmId) {
  console.log(`\n🏷️ Creating GTM Tag (${gtmId})...\n`);
  
  // Note: GTM itself doesn't need a tag in its own container
  // But we need to create the container snippet
  console.log('ℹ️  GTM container snippet will be provided after publishing.');
  console.log('   Use this code in your website:');
  console.log(`
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');</script>
<!-- End Google Tag Manager -->

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
  `);
  
  return null;
}

/**
 * Publish container version
 */
async function publishVersion(gtm, workspacePath) {
  console.log('\n🚀 Publishing Container Version...\n');
  
  try {
    // Create version first
    const versionResponse = await gtm.accounts.containers.workspaces.createVersion({
      path: workspacePath,
      requestBody: {
        name: 'Auto-published via API',
        description: 'Tags created by GTM API automation script'
      }
    });
    
    console.log('✅ Version created:', versionResponse.data.version?.name);
    
    // Publish the version
    const versionId = versionResponse.data.version?.versionId;
    if (versionId) {
      const containerPath = workspacePath.split('/workspaces')[0];
      await gtm.accounts.containers.versions.publish({
        path: `${containerPath}/versions/${versionId}`
      });
      console.log('✅ Version published successfully!');
    }
    
    return versionResponse.data;
  } catch (error) {
    console.error('❌ Error publishing version:', error.message);
    return null;
  }
}

// Main execution
async function main() {
  console.log('🚀 GTM API Setup Script for Dreamlab');
  console.log('=====================================');
  
  try {
    // Authenticate
    const auth = await authenticate();
    const gtm = google.tagmanager({ version: 'v2', auth });
    
    // Step 1: List accounts
    const accounts = await listAccounts(gtm);
    if (accounts.length === 0) return;
    
    // Step 2: List containers for first account
    const accountPath = accounts[0].path;
    const containers = await listContainers(gtm, accountPath);
    if (containers.length === 0) return;
    
    // Step 3: List workspaces for first container
    const containerPath = containers[0].path;
    const workspaces = await listWorkspaces(gtm, containerPath);
    if (workspaces.length === 0) return;
    
    const workspacePath = workspaces[0].path;
    
    // Step 4: Create tags (uncomment and fill in IDs)
    console.log('\n' + '='.repeat(50));
    console.log('📝 Ready to create tags!');
    console.log('='.repeat(50));
    console.log('\nTo create tags, uncomment the lines below and fill in your tracking IDs:\n');
    
    // Uncomment and fill in your tracking IDs:
    // await createGA4ConfigTag(gtm, workspacePath, 'G-XXXXXXXXXX');
    // await createMetaPixelTag(gtm, workspacePath, 'YOUR_PIXEL_ID');
    // await createTikTokPixelTag(gtm, workspacePath, 'YOUR_TIKTOK_PIXEL_ID');
    
    // Step 5: Publish (uncomment after creating tags)
    // await publishVersion(gtm, workspacePath);
    
    console.log('\n✅ Setup complete! Check your GTM container.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('403')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Enable GTM API: https://console.cloud.google.com/apis/library/tagmanager.googleapis.com');
      console.log('2. Invite service account to GTM:');
      console.log('   Email: dreamlab@sunny-idiom-499103-g6.iam.gserviceaccount.com');
      console.log('3. Go to: tagmanager.google.com → Admin → User Management → Add');
    }
  }
}

main();
