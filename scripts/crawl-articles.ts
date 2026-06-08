import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://dreamlab.id';
const MAPPING_FILE = '../../../seo-mapping.json'; // Path diperbaiki ke root project
const OUTPUT_FILE = path.join(__dirname, '../data/articles.ts');
const IMAGE_DIR = path.join(__dirname, '../../public/assets/images/blog');

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

async function downloadImage(url: string, filename: string) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    const filePath = path.join(IMAGE_DIR, filename);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    return new Promise<void>((resolve, reject) => {
      writer.on('finish', () => resolve());
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`Failed to download image: ${url}`, err);
  }
}

async function crawlArticle(sourcePath: string) {
  const url = `${SITE_URL}${sourcePath}`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Precise Selectors for WoodMart/Elementor
    const contentSelectors = [
      'article.post .entry-content',
      '.elementor-location-single', 
      '.elementor-section-wrap', 
      'main#main .entry-content'
    ];

    let content = '';
    let $content: cheerio.Cheerio<cheerio.Element> | null = null;

    for (const selector of contentSelectors) {
      const el = $(selector);
      if (el.length > 0) {
        // Collect ALL children if it's a wrapper, or the element itself
        content = el.html() || '';
        $content = el;
        if (content.length > 500) break;
      }
    }

    if (!content || content.length < 200) return null;

    // Remove Junk
    const $clean = cheerio.load(content);
    $clean('section:contains("Read other posts")').remove();
    $clean('section:contains("Be the first to know")').remove();
    $clean('.elementor-author-box').remove();
    $clean('.comments-area').remove();
    $clean('.entry-meta').remove();
    $clean('.meta-categories-wrapp').remove();
    content = $clean.html();

    // Extract Title - prioritize inside content if it's a specific class
    let title = $('.entry-title').first().text().trim();
    if (!title || title === 'News & Blog') {
      title = ($content?.find('h1.elementor-heading-title').first().text().trim()) || 
              ($content?.find('h1').first().text().trim()) || 
              $('h1').filter((_, e) => $(e).text().trim() !== 'News & Blog').first().text().trim();
    }

    // Extract Category
    const category = $('.meta-post-categories a').first().text().trim() || 
                     ($content?.find('a[href*="/category/"]').first().text().trim()) ||
                     $('a[rel="category tag"]').first().text().trim() || 
                     'Uncategorized';

    // Extract Excerpt - look deeper for real text
    let excerpt = '';
    const paragraphs = $content ? $content.find('p').map((_: number, el: cheerio.Element) => $(el).text().trim()).get() : [];
    const realParagraph = paragraphs.find((p: string) => p.length > 50);
    if (realParagraph) {
      excerpt = realParagraph.substring(0, 160) + '...';
    } else {
      // Fallback to text content summary
      excerpt = ($content?.text().trim().substring(0, 160).replace(/\s+/g, ' ') || '') + '...';
    }

    const featuredImage = $('img.wp-post-image').attr('src') || $('meta[property="og:image"]').attr('content');
    const date = $('time.entry-date').attr('datetime') || new Date().toISOString();
    const author = $('.author-name').text().trim() || 'Dreamlab Admin';

    // Clean Content HTML
    if (content) {
      // Remove html, head, body tags if they exist
      content = content.replace(/<\/?html[^>]*>/gi, '');
      content = content.replace(/<\/?head[^>]*>/gi, '');
      content = content.replace(/<\/?body[^>]*>/gi, '');
      
      content = content.replace(/bv-data-src/g, 'src');
      content = content.replace(/data-src/g, 'src');
      content = content.replace(/src="data:image\/svg\+xml[^"]*"/g, '');
      content = content.replace(/https:\/\/dreamlab\.id\/wp-content\/uploads/g, '/assets/images');
      content = content.replace(/loading="lazy"/g, '');
      content = content.replace(/decoding="async"/g, '');
      // Fix potential broken layout links
      content = content.replace(/https:\/\/dreamlab\.id/g, '');
    }

    let localImage = '';
    if (featuredImage) {
      const ext = path.extname(featuredImage.split('?')[0]) || '.webp';
      const cleanSlug = sourcePath.replace(/^\//, '').replace(/\//g, '-');
      const filename = `${cleanSlug}${ext}`;
      await downloadImage(featuredImage, filename);
      localImage = `/assets/images/blog/${filename}`;
    }

    return {
      slug: sourcePath.replace(/^\//, ''),
      title,
      category,
      excerpt,
      content,
      featuredImage: localImage,
      publishDate: date,
      author,
    };
  } catch (err) {
    console.error(`Error crawling ${url}:`, err);
    return null;
  }
}

async function run() {
  const mappingPath = path.join(__dirname, MAPPING_FILE);
  if (!fs.existsSync(mappingPath)) {
    console.error(`Mapping file not found at ${mappingPath}`);
    return;
  }
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  const results = [];

  // Filter only articles
  const articleLinks = mapping.filter((item: { source: string }) => 
    item.source !== '/' && 
    item.source.length > 5 && 
    !['/about-us', '/services', '/career', '/contact-us', '/our-client', '/news-blog', '/thankyou-page', '/baby-care', '/decorative', '/foot-care', '/hair-care'].some(s => item.source === s) &&
    !item.source.includes('/author/') &&
    !item.source.includes('/category/') &&
    !item.source.includes('/page/')
  );

  console.log(`Starting Refined Full Crawl for ${articleLinks.length} articles...`);

  for (let i = 0; i < articleLinks.length; i++) {
    const link = articleLinks[i];
    process.stdout.write(`[${i+1}/${articleLinks.length}] Crawling: ${link.source} ... `);
    
    const data = await crawlArticle(link.source);
    if (data && data.content.length > 500) {
      results.push(data);
      console.log('OK');
    } else {
      console.log('SKIPPED (No Content)');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const outputContent = `export const articles = ${JSON.stringify(results, null, 2)};`;
  fs.writeFileSync(OUTPUT_FILE, outputContent);
  console.log(`\nSuccess! ${results.length} articles saved to src/data/articles.ts`);
}

run();
