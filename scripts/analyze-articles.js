import fs from 'fs';
import path from 'path';

function analyzeArticles() {
    const filePath = path.join(process.cwd(), 'src', 'data', 'articles.ts');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Simple regex to extract slug and content
    const articleRegex = /\{\s*\"slug\":\s*\"(.*?)\"[\s\S]*?\"content\":\s*\"([\s\S]*?)\"\s*,\s*\"featuredImage\"/g;
    
    let match;
    const results = [];
    
    while ((match = articleRegex.exec(content)) !== null) {
        const slug = match[1];
        const articleContent = match[2];
        
        // Check for body indicators
        const hasParagraphs = articleContent.includes('<p>');
        const hasTextEditor = articleContent.includes('elementor-text-editor');
        const sectionsCount = (articleContent.match(/<\/section>/g) || []).length;
        
        results.push({
            slug,
            length: articleContent.length,
            hasParagraphs,
            hasTextEditor,
            sectionsCount
        });
    }
    
    console.log(`Total analyzed: ${results.length}`);
    const withBody = results.filter(r => r.hasParagraphs || r.hasTextEditor || r.sectionsCount > 1);
    console.log(`Articles with potential body: ${withBody.length}`);
    
    if (withBody.length > 0) {
        console.log('Sample with body:', withBody[0].slug);
    }
    
    const withoutBody = results.filter(r => !r.hasParagraphs && !r.hasTextEditor && r.sectionsCount <= 1);
    console.log(`Articles without body: ${withoutBody.length}`);
    if (withoutBody.length > 0) {
        console.log('Sample without body:', withoutBody[0].slug);
    }
}

analyzeArticles();
