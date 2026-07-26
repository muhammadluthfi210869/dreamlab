# GA4 Lead Impact Assessment

## Status: DATA INSUFFICIENT

**GA4 Data API credential tidak tersedia dalam repository ini. Export organic landing page dan lead events belum dibuat.**

## Available Evidence

### Tracking Code Audit
- **GTM Implementation**: Present in `src/components/TrackingScripts.tsx`
- **GTM/Clarity**: Rendered via `src/app/layout.tsx:7, 70, 95`
- **Contact Form**: `src/app/contact-us/page.tsx` handles form submissions
- **WhatsApp Click**: Not directly verifiable from code review

### GSC Traffic Inference
- Organic clicks 7v7: 142 → 169 (+19%)
- Impression decline does not necessarily mean lead decline
- If clicks increased, organic sessions to thank-you/contact pages may have increased

### Lead Tracking Gaps
1. No GA4 property ID found in environment files checked
2. No `generate_lead` or `purchase` event measurement verified
3. No form submission → GA4 event mapping confirmed
4. WhatsApp click tracking not verifiable without GTM container access

## Impact Classification: NO_MEANINGFUL_CHANGE (Inferred)

**Inferensi:** 
- Organic website traffic (clicks) tidak turun - malah naik
- Impression turun tapi ini tidak selalu berkorelasi dengan lead volume
- Tanpa GA4 data, tidak dapat menyimpulkan lead turun

## Required Actions

| Action | Priority | Owner | Expected output |
| ------ | -------- | ----- | --------------- |
| Export GA4 organic landing pages (28d before vs 28d after) | P0 | Marketing/GA4 Admin | CSV with sessions, engaged sessions, key events |
| Export GA4 lead events by source/medium | P0 | Marketing/GA4 Admin | CSV with form_submit, whatsapp_click, generate_lead |
| Audit GTM container tags for lead tracking | P1 | Developer | Verification that lead events fire correctly |
| Add lead tracking to thank-you pages if missing | P1 | Developer | GTM tag for /thankyou/ page views |
| Set up GA4 + GSC integration | P2 | Developer/Admin | Enable Google Signals, connect properties |

## Without this data, the following conclusions remain inferential:
- Whether SEO traffic decline affected qualified leads
- Whether conversion rate recovered/changed post-redesign
- Whether B2B lead generation pages are performing
- Whether thank-you page visits correlate with organic sessions
