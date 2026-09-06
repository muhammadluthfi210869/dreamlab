import re
with open("src/data/products-v2/bodycare.ts", "r") as f:
    text = f.read()
    
match = re.search(r'products:\s*\[(.*?)\]\s*,', text, re.DOTALL)
if match:
    products = match.group(1)
    slugs = re.findall(r'slug:\s*"([^"]+)"', products)
    print("Slugs in products array:")
    for s in slugs:
        if 'deod' in s:
            print("-", s)
