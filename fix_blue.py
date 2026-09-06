import re

with open("src/app/google-ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# Change .process background back from var(--dark) (#111827) to bright dreamlab blue (#4898D3)
content = content.replace('.parfum-lp .process { background:var(--dark); color:#fff; }', '.parfum-lp .process { background:#4898D3; color:#fff; }')

# Change .step background from #1f2937 to #367baf (a medium dreamlab blue)
content = content.replace('background:#1f2937;', 'background:#367baf;')

# Change the gradient overlay on .step from gray-900 (17,24,39) to a dreamlab blue based gradient (45,115,165)
content = content.replace('rgba(17,24,39', 'rgba(45,115,165')

with open("src/app/google-ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)
