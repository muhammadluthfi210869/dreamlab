import re

with open("src/app/ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# 1
content = content.replace('<span>Legalitas Didampingi</span>', '<span>FREE LEGALITAS BPOM</span>')

# 2
content = content.replace('<span>Desain, legalitas, produksi, dan digital marketing.</span>', '<span>FREE Pengurusan Legalitas BPOM, HKI, Halal, desain kemasan, dan digital marketing.</span>')

with open("src/app/ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)
