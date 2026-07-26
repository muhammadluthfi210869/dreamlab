# GA4 and Lead Impact

GA4 Data API: TIDAK DAPAT DIVERIFIKASI. No usable GA4 property id + Data API credential was found automatically.

Tracking evidence in code:

- src/app/layout.tsx:7 imports TrackingScripts/GTMNoScript.
- src/app/layout.tsx:70 renders TrackingScripts.
- src/app/layout.tsx:95 renders GTMNoScript.
- src/components/TrackingScripts.tsx contains GTM/Clarity script logic.

Cannot separate SEO loss vs tracking loss vs conversion-rate loss without GA4 export/API. Required export: organic landing pages, sessions, engaged sessions, WhatsApp clicks, form submits, qualified leads/key events by date/device/source-medium before and after redesign.
