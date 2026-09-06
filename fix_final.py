import re

with open("src/app/google-ads/maklon-parfum/page.tsx", "r") as f:
    content = f.read()

# 1. Delete the MOQ / BRAND READINESS section
pattern = r'\{\/\* New 1 Client 1 Custom Formula & MOQ Section \*\/\}.*?</section>'
content = re.sub(pattern, '', content, flags=re.DOTALL)

# 2. Fix hero shade (make it less opaque / less white so background is visible)
# The user said "background tidak terlihat woy terlalu transparant" (the white overlay is too solid, making the background image disappear/look transparent or washed out).
# Let's make the white overlay lighter.
content = content.replace(
    'background:linear-gradient(to right, rgba(250,249,246,0.95) 0%, rgba(250,249,246,0.85) 40%, rgba(250,249,246,0.2) 100%)',
    'background:linear-gradient(to right, rgba(250,249,246,0.9) 0%, rgba(250,249,246,0.65) 45%, rgba(250,249,246,0) 100%)'
)

# Fix mobile hero shade
content = content.replace(
    'background:linear-gradient(to bottom, rgba(250,249,246,0.85) 0%, rgba(250,249,246,0.98) 100%)',
    'background:linear-gradient(to bottom, rgba(250,249,246,0.4) 0%, rgba(250,249,246,0.85) 50%, rgba(250,249,246,0.98) 100%)'
)

with open("src/app/google-ads/maklon-parfum/page.tsx", "w") as f:
    f.write(content)
