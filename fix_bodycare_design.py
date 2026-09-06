import re

with open("src/app/google-ads/maklon-body-care/page.tsx", "r") as f:
    content = f.read()

# 1. Clean Hero Design
# Change hero text from white to dark
content = content.replace('<span style={{color:"#fff"}}>', '<span>')
content = content.replace('color:rgba(255,255,255,0.8);', 'color:#555;')
# Change hero shade to light gradient for a clean look
content = content.replace('linear-gradient(to right, rgba(18,28,45,0.95) 0%, rgba(18,28,45,0.7) 50%, rgba(18,28,45,0) 100%)', 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 45%, rgba(255,255,255,0) 100%)')
content = content.replace('rgba(45,115,165,0.3) 0%, rgba(45,115,165,0.85) 50%, rgba(45,115,165,0.98) 100%', 'rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,1) 100%')
# Change .hero-copy text color to dark
content = content.replace('.bodycare-lp .hero-copy { position:relative; z-index:20; color:#fff; max-width:700px; }', '.bodycare-lp .hero-copy { position:relative; z-index:20; color:var(--dark); max-width:700px; }')

# 2. Add "Value Dreamlab" section and "Trend Bodycare 2026" title
value_html = """
          <section className="metrics" style={{paddingBottom: "20px", paddingTop: "60px"}}>
            <div className="wrap">
              <div className="title" style={{marginBottom: "20px"}}>
                <span className="eyebrow">VALUE DREAMLAB</span>
                <h2 style={{fontSize:"28px"}}>MENGAPA MEMILIH DREAMLAB?</h2>
              </div>
              <div className="checks" style={{marginTop: "0px", gridTemplateColumns: "repeat(4, 1fr)"}}>
                <div className="check" style={{background: "#fff", borderColor:"var(--orange)"}}><i>&#10003;</i><b>1 Klien 1 Formula</b><span>Formula eksklusif tidak pasaran</span></div>
                <div className="check" style={{background: "#fff", borderColor:"var(--orange)"}}><i>&#10003;</i><b>3 Bulan Siap Jual</b><span>Proses cepat dari nol</span></div>
                <div className="check" style={{background: "#fff", borderColor:"var(--orange)"}}><i>&#10003;</i><b>MOQ Fleksibel</b><span>Mulai brand tanpa ribet</span></div>
                <div className="check" style={{background: "#fff", borderColor:"var(--orange)"}}><i>&#10003;</i><b>BPOM & Halal</b><span>Terjamin kualitasnya</span></div>
              </div>
            </div>
          </section>

          <section className="metrics" style={{paddingTop: "20px", borderBottom: "none", backgroundColor: "#fdfdfd"}}>
            <div className="wrap">
              <div className="title" style={{marginBottom: "20px"}}>
                <span className="eyebrow">PELUANG MARKET</span>
                <h2 style={{fontSize:"28px"}}>TREND BODYCARE 2026</h2>
                <p>Formula yang paling dicari oleh konsumen saat ini.</p>
              </div>
"""
# Replace the old <section className="metrics"> start up to <div className="checks"
content = re.sub(r'<section className="metrics">\s*<div className="wrap">\s*<div className="checks".*?>', value_html + '\n              <div className="checks" style={{marginTop: "0px", gridTemplateColumns: "repeat(4, 1fr)"}}>', content, flags=re.DOTALL)

# 3. Fix the 5-step process grid to look aesthetic (5 columns instead of 3, or maybe a better look)
content = content.replace('grid-template-columns:repeat(3,1fr);', 'grid-template-columns:repeat(5,1fr);')
# Adjust step height to be a bit taller so text fits in 5 columns, or make text smaller
content = content.replace('.bodycare-lp .step { position:relative; height:340px;', '.bodycare-lp .step { position:relative; height:400px;')
content = content.replace('.bodycare-lp .step-copy h3 { margin:0 0 12px; font-size:26px;', '.bodycare-lp .step-copy h3 { margin:0 0 12px; font-size:18px;')
content = content.replace('.bodycare-lp .step-copy p { margin:0; color:rgba(255,255,255,0.92); font-size:17px;', '.bodycare-lp .step-copy p { margin:0; color:rgba(255,255,255,0.92); font-size:14px;')

# Fix mobile process grid to scroll horizontally or use 1fr
# In media max-width:768px, it is already grid-template-columns:1fr; which is fine for mobile.
# For 1024px:
content = content.replace('.bodycare-lp .process-grid { grid-template-columns:1fr 1fr; }', '.bodycare-lp .process-grid { grid-template-columns:repeat(3,1fr); gap: 16px; }')

# Save
with open("src/app/google-ads/maklon-body-care/page.tsx", "w") as f:
    f.write(content)

