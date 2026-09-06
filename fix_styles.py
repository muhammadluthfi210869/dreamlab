import re

with open("src/app/google-ads/maklon-body-care/page.tsx", "r") as f:
    content = f.read()

# 1. Fix z-index for the metrics section
# Currently it is: .bodycare-lp .metrics { position:relative; margin-top:-44px; z-index:3; }
# Let's change z-index to 99
content = content.replace('.bodycare-lp .metrics { position:relative; margin-top:-44px; z-index:3; }', '.bodycare-lp .metrics { position:relative; margin-top:-44px; z-index:99; }')

# The inline style for metric-card is: style={{marginBottom: "40px", marginTop: "-100px", position: "relative", zIndex: 10}}
# Let's change zIndex to 99 here too, and maybe the parent section needs to not have overflow hidden
content = content.replace('zIndex: 10', 'zIndex: 99')

# 2. Headline left alignment
# Currently: .bodycare-lp .hero-copy { position:relative; z-index:20; color:var(--dark); max-width:700px; }
# Let's add margin-left: 0; padding-left: 0; or something to pull it left.
# Wait, the screenshot shows it's aligned with the left edge of the metric card. It doesn't look centered.
# But they said "kurang kek kiri".
# Maybe they want max-width larger, or left negative margin? No, .wrap has standard max-width.
# Let's add left: -20px or similar? Or just remove the `text-align: center` if it exists.
# Wait, look at .hero { display:flex; align-items:center; min-height:100vh; padding:120px 0 80px; position:relative; overflow:hidden; }
# There is no text-align: center on hero.
# But maybe we can add a specific class or style for the h1 to make it larger or push it left.
content = content.replace('.bodycare-lp .hero-copy { position:relative; z-index:20; color:var(--dark); max-width:700px; }', '.bodycare-lp .hero-copy { position:relative; z-index:20; color:var(--dark); max-width:760px; margin-left: 0; }')

# 3. Increase z-index of the whole metrics section where the metric-card is
content = content.replace('<section className="metrics" style={{paddingBottom: "20px", paddingTop: "60px"}}>', '<section className="metrics" style={{paddingBottom: "20px", paddingTop: "60px", position: "relative", zIndex: 50}}>')

with open("src/app/google-ads/maklon-body-care/page.tsx", "w") as f:
    f.write(content)
