import re

with open("src/app/google-ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# 1. Change root --dark from navy to charcoal (gray-900)
content = content.replace('--dark: #121c2d;', '--dark: #111827;')

# 2. Change .step background from navy (#173248) to gray-800 (#1f2937)
content = content.replace('background:#173248;', 'background:#1f2937;')

# 3. Change .step gradient overlay from navy (rgba(5,15,30)) to gray-900 (rgba(17,24,39))
content = content.replace('rgba(5,15,30', 'rgba(17,24,39')

with open("src/app/google-ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)
