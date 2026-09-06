import re

with open("src/data/products-v2/bodycare.ts", "r") as f:
    content = f.read()
    
# check how many deodorants are in the products array
match = re.search(r'products:\s*\[(.*?)\]\s*,', content, re.DOTALL)
if match:
    products = match.group(1)
    deod = [p for p in products.split('{') if 'deodorant' in p.lower()]
    print(f"Found {len(deod)} deodorants in products array.")
    for d in deod:
        print("---")
        print(d[:100])
