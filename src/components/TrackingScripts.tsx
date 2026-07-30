'use client';

import Script from 'next/script';

const GTM_ID = 'GTM-PMBQDG9H';
const GA4_ID = 'G-T5SZRCDS0T';
const META_PIXEL_ID = '1178862663474674';
const TIKTOK_PIXEL_ID = 'D0A8CHRC77UD5RFHJ6E0';

export function TrackingScripts() {
  return (
    <>
      {/* Google Tag Manager — deferred to idle time */}
      <Script id="gtm-script" strategy="lazyOnload">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>

      {/* GA4 + Google Ads Linker — deferred to idle time */}
      <Script id="ga4-script" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
      <Script id="ga4-config" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA4_ID}', {
          'linker': { 'domains': ['dreamlab.id'] }
        });`}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="clarity" strategy="lazyOnload">
        {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "ttkbjtf1w5");`}
      </Script>
    </>
  );
}

export function GTMNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}

export { GTM_ID, GA4_ID };
