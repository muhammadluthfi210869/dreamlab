import re

with open("src/app/google-ads/maklon-body-care/page.tsx", "r") as f:
    content = f.read()

# 1. CSS for metric card
css_to_insert = """
          .bodycare-lp .metrics { position:relative; margin-top:-44px; z-index:3; }
          .bodycare-lp .metric-card { background:#fff; border:1px solid var(--line); border-radius:22px; box-shadow:var(--shadow); display:grid; grid-template-columns:1.4fr 1fr 1fr; align-items:center; padding:27px 32px; }
          .bodycare-lp .metric-card h2 { font-size:22px; line-height:1.3; margin:0; }
          .bodycare-lp .metric { padding-left:30px; border-left:1px solid var(--line); }
          .bodycare-lp .metric b { display:block; color:var(--blue); font-size:34px; }
          .bodycare-lp .metric span { font-size:13px; color:var(--muted); }
          @media (max-width: 1024px) {
            .bodycare-lp .metric-card { grid-template-columns:1fr 1fr; padding:20px 16px; text-align:center; gap: 16px; }
            .bodycare-lp .metric-card h2 { grid-column:1/-1; font-size:18px; margin-bottom:0px; }
            .bodycare-lp .metric { padding:0; border:0; }
            .bodycare-lp .metric+ .metric { border-left:1px solid var(--line); }
            .bodycare-lp .metric b { font-size:28px; }
          }
"""
content = content.replace('.bodycare-lp .metrics {', css_to_insert + '\n          .bodycare-lp .metrics-orig {')

# 2. Replace the Eyebrow title block with the Metric Card
old_title_block = """              <div className="title" style={{marginBottom: "20px"}}>
                <span className="eyebrow">500++ BRAND BEKERJASAMA | 1000++ PRODUK</span>
                <h2 style={{fontSize:"28px"}}>MENGAPA MEMILIH DREAMLAB?</h2>
              </div>"""

new_metric_card = """              <div className="metric-card" style={{marginBottom: "40px", marginTop: "-100px", position: "relative", zIndex: 10}}>
                <h2>Dipercaya untuk Mengembangkan Brand Beauty</h2>
                <div className="metric"><b data-count="500">0++</b><span>Brand bekerja sama</span></div>
                <div className="metric"><b data-count="1000">0+</b><span>Produk dikembangkan</span></div>
              </div>
              
              <div className="title" style={{marginBottom: "20px", marginTop: "20px"}}>
                <h2 style={{fontSize:"28px"}}>MENGAPA MEMILIH DREAMLAB?</h2>
              </div>"""
content = content.replace(old_title_block, new_metric_card)

# 3. Add script tag at the end before </div></main>
script_tag = """
          <script dangerouslySetInnerHTML={{ __html: `
            document.addEventListener("DOMContentLoaded", function() {
              const observer = new IntersectionObserver(es => {
                es.forEach(e => {
                  if(!e.isIntersecting) return;
                  document.querySelectorAll('[data-count]').forEach(el => {
                    const target = +(el.getAttribute('data-count') || 0);
                    let current = 0;
                    const increment = target / 40;
                    const updateCounter = () => {
                      current += increment;
                      if(current < target) {
                        el.innerText = Math.ceil(current) + (target === 500 ? "++" : "+");
                        setTimeout(updateCounter, 30);
                      } else {
                        el.innerText = target + (target === 500 ? "++" : "+");
                      }
                    };
                    updateCounter();
                  });
                  observer.disconnect();
                });
              }, {threshold:.25});
              const metrics = document.querySelector('.metric-card');
              if(metrics) observer.observe(metrics);
            });
          `}} />
"""

content = content.replace("</main>", script_tag + "\n        </main>")

with open("src/app/google-ads/maklon-body-care/page.tsx", "w") as f:
    f.write(content)
