import re

with open("src/data/products-v2/bodycare.ts", "r") as f:
    content = f.read()

# Find the products array
match = re.search(r'products:\s*\[(.*?)\]', content, re.DOTALL)
if match:
    products_arr = match.group(1)
    deodorants = [line for line in products_arr.split('\n') if 'Deodorant' in line]
    print("\n".join(deodorants))
