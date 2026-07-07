import fs from 'fs';
import path from 'path';
import https from 'https';
import { google } from 'googleapis';
import { parse } from 'csv-parse/sync';

const CREDENTIALS_PATH = path.join(process.cwd(), 'scripts', 'gsc-credentials.json');
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output');
const SITE_URL = 'sc-domain:dreamlab.id';
const CSV_DIR = path.join(process.cwd(), 'docs', 'export-csv', '29-06-2026');
const CSV_FILES = [
  'tidak-diindeks.csv',
  'pengalihan.csv',
  'tag-kanonis.csv',
  'Dikecualikan oleh tag ‘noindex’.csv',
];

type InspectionResult = {
  url: string;
  coverageState: string;
  verdict: string;
  indexingState: string;
  robotsTxtState: string;
  pageFetchState: string;
  canonical: string;
  lastCrawlTime: string;
};

function readCsvUrls(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Array<{ URL: string }>;
  return records.map(row => row.URL).filter(Boolean);
}

async function inspectUrl(token: string, url: string): Promise<InspectionResult | null> {
  const body = JSON.stringify({
    siteUrl: SITE_URL,
    inspectionUrl: url,
  });

  try {
    const response = await new Promise<string>((resolve, reject) => {
      const req = https.request({
        hostname: 'searchconsole.googleapis.com',
        path: '/v1/urlInspection/index:inspect',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });

    const parsed = JSON.parse(response);
    if (parsed.error) {
      console.error(`API error for ${url}: ${parsed.error.message}`);
      return null;
    }

    const r = parsed.inspectionResult;
    const idx = r?.indexStatusResult || {};
    return {
      url,
      coverageState: idx.coverageState || 'N/A',
      verdict: (r?.verdict || idx.verdict || 'UNKNOWN').toUpperCase(),
      indexingState: idx.indexingState || 'N/A',
      robotsTxtState: idx.robotsTxtState || 'N/A',
      pageFetchState: idx.pageFetchState || 'N/A',
      canonical: idx.googleCanonical || idx.userCanonical || url,
      lastCrawlTime: idx.lastCrawlTime || 'N/A',
    };
  } catch (error: any) {
    console.error(`Error inspecting ${url}: ${error.message}`);
    return null;
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const urls = new Set<string>();
  for (const file of CSV_FILES) {
    const filePath = path.join(CSV_DIR, file);
    for (const url of readCsvUrls(filePath)) {
      urls.add(url);
    }
  }

  const uniqueUrls = [...urls].sort();
  console.log(`Inspecting ${uniqueUrls.length} unique URLs from export CSV...\n`);

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const client = await auth.getClient();
  const tokenRes = await client.getAccessToken();
  const token = tokenRes.token;
  if (!token) {
    throw new Error('Unable to obtain access token');
  }

  const results: InspectionResult[] = [];
  const concurrency = 5;
  for (let i = 0; i < uniqueUrls.length; i += concurrency) {
    const batch = uniqueUrls.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(url => inspectUrl(token, url)));
    for (const result of batchResults) {
      if (result) results.push(result);
    }
    const done = Math.min(i + concurrency, uniqueUrls.length);
    process.stdout.write(`\rProgress: ${done}/${uniqueUrls.length} (${Math.round(done / uniqueUrls.length * 100)}%)`);
  }

  console.log('\n');

  const summary = results.reduce((acc, item) => {
    acc[item.coverageState] = (acc[item.coverageState] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const outputFile = path.join(OUTPUT_DIR, 'gsc-export-csv-inspection-2026-07-06.json');
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));

  console.log('Coverage summary:');
  for (const [state, count] of Object.entries(summary).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`  ${state}: ${count}`);
  }
  console.log(`\nSaved: ${outputFile}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
