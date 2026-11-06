'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const META_PIXEL_ID = '1178862663474674';
const TIKTOK_PIXEL_ID = 'D0A8CHRC77UD5RFHJ6E0';

export function PixelsOnInteraction() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/lead-monitor')) return;

    const events = ['scroll', 'mousedown', 'touchstart', 'keydown', 'pointerdown'];
    let loaded = false;

    function loadPixels() {
      if (loaded) return;
      loaded = true;

      const w = window as any;

      // — Meta Pixel —
      if (!w.fbq) {
        const n: any = (w.fbq = function () {
          if (n.callMethod) n.callMethod.apply(n, arguments);
          else n.queue.push(arguments);
        });
        if (!w._fbq) w._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
      }
      // Wajib panggil init & PageView langsung ke antrian SEBELUM event Lead ditembak
      // (jika ditaruh di onload, fbq('track', 'Lead') di ThankYou page masuk ke queue sebelum init!)
      if (!w.__dlMetaPixelInitialized) {
        w.__dlMetaPixelInitialized = true;
        w.fbq('init', META_PIXEL_ID);
        w.fbq('track', 'PageView');
      }
      if (!document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]')) {
        const fbScript = document.createElement('script');
        fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
        fbScript.async = true;
        fbScript.defer = true;
        document.head.appendChild(fbScript);
      }

      // — TikTok Pixel —
      if (!w.ttq) {
        w.ttq = w.ttq || [];
        w.ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
        w.ttq.setAndDefer = function (t: any, e: any) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        for (var i = 0; i < w.ttq.methods.length; i++) w.ttq.setAndDefer(w.ttq, w.ttq.methods[i]);
        w.ttq.instance = function (t: any) {
          for (var e = w.ttq._i[t] || [], n = 0; n < w.ttq.methods.length; n++) w.ttq.setAndDefer(e, w.ttq.methods[n]);
          return e;
        };
        w.ttq.load = function (e: any, n: any) {
          var r = 'https://analytics.tiktok.com/i18n/pixel/events.js',
            o = n && n.partner;
          w.ttq._i = w.ttq._i || {};
          w.ttq._i[e] = [];
          w.ttq._i[e]._u = r;
          w.ttq._t = w.ttq._t || {};
          w.ttq._t[e] = +new Date();
          w.ttq._o = w.ttq._o || {};
          w.ttq._o[e] = n || {};
          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.defer = true;
          s.src = r + '?sdkid=' + e + '&lib=ttq';
          var f = document.getElementsByTagName('script')[0];
          f.parentNode?.insertBefore(s, f);
        };
        w.ttq.load(TIKTOK_PIXEL_ID);
        w.ttq.page();
      }
    }

    function onInteraction(e: Event) {
      events.forEach((ev) => window.removeEventListener(ev, onInteraction, { capture: true }));

      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadPixels, { timeout: 300 });
      } else {
        setTimeout(loadPixels, 300);
      }
    }

    // Di halaman Ads & Thank You page (wajib untuk tracking PageView & konversi Meta Ads Pixel / TikTok Pixel),
    // load pixels SEGERA tanpa menunggu user interaction.
    if (pathname?.includes('thankyou') || pathname?.startsWith('/ads') || pathname?.includes('metaads')) {
      loadPixels();
      return;
    }

    events.forEach((ev) => window.addEventListener(ev, onInteraction, { capture: true, passive: true }));

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, onInteraction, { capture: true }));
    };
  }, [pathname]);

  return null;
}
