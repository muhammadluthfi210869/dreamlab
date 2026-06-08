import csv

with open('src/data/seo-audit-export.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    csv_slugs = set(row['slug'].rstrip('/') for row in reader)

missing = [
    'ai-data-cara-brand-kosmetik-baru-menemukan-formula-viral',
    'berapa-moq-maklon-skincare-di-dreamlab-ini-fakta-penting-untuk-pebisnis-pemula',
    'body-care-2',
    'cara-membuat-masker-wajah-organik-praktis-aman-dan-cocok-untuk-ide-bisnis-skincare',
    'cara-memutihkan-ketiak',
    'glycerin-bahan-skincare-yang-naik-daun-dan-cocok-untuk-semua-jenis-kulit',
    'hair-vitamin-lokal-indonesia-viral-di-korea',
    'ide-bisnis-kosmetik',
    'maklon-kosmetik-ibu-hamil',
    'mudahnya-menjadi-owner-parfum-sendiri-ciptakan-brand-wewangian-eksklusif-tanpa-ribet',
    'prediksi-tren-2026'
]

with open('src/data/articles.ts', 'r', encoding='utf-8') as f:
    articles_content = f.read()

for m in missing:
    in_csv = ('/' + m) in csv_slugs
    in_articles = m in articles_content
    dest = ''
    if not in_csv and not in_articles:
        if 'moq' in m or 'skincare-di-dreamlab' in m:
            dest = '/maklon-skincare/'
        elif 'body-care-2' in m:
            dest = '/maklon-body-care/'
        elif 'masker-wajah' in m or 'organik' in m:
            dest = '/maklon-skincare/masker-wajah/'
        elif 'ketiak' in m or 'memutihkan' in m:
            dest = '/maklon-body-care/underarm-cream/'
        elif 'glycerin' in m or 'bahan-skincare' in m:
            dest = '/maklon-skincare/'
        elif 'hair-vitamin' in m or 'korea' in m:
            dest = '/maklon-hair-care/'
        elif 'ide-bisnis' in m:
            dest = '/services/'
        elif 'maklon-kosmetik-ibu-hamil' in m:
            dest = '/maklon-skincare/'
        elif 'owner-parfum' in m or 'mudahnya' in m:
            dest = '/maklon-parfum/'
        elif 'prediksi-tren' in m or '2026' in m:
            dest = '/maklon-skincare/'
        elif 'ai-data' in m:
            dest = '/services/'
    print(f'{m} -> CSV={in_csv} Articles={in_articles} RedirectTo={dest}')
