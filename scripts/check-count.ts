const { articles } = require('../src/data/articles');
console.log('Total articles:', articles.length);

const withSlug = articles.filter(a => a.slug && a.slug.trim());
console.log('With slug:', withSlug.length);

const oldPrefix = articles.filter(a => a.slug && a.slug.startsWith('/news-blog/'));
console.log('Slugs starting with /news-blog/:', oldPrefix.length);

articles.slice(0, 5).forEach(a => console.log('  slug:', JSON.stringify(a.slug), '| title:', String(a.title || '').substring(0, 50)));
