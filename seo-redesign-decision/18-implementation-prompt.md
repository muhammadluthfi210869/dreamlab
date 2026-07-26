# Implementation Prompt

You are now in IMPLEMENTATION mode. Your task is to execute the changes defined in `17-implementation-spec.md` based on the decisions in `15-final-url-action-matrix.csv`.

## Prerequisites

1. Read `15-final-url-action-matrix.csv` to understand the decision per URL
2. Read `17-implementation-spec.md` for detailed change specifications
3. Read `16-priority-roadmap.md` for execution order
4. Read `06-redirect-decisions.csv` for redirect-specific decisions

## Scope

### Phase 1 (P0 only - highest impact)
Implement these changes ONLY:

1. **REDIRECT-001**: Change `/maklon-parfum/` redirect from `/google-ads/maklon-parfum/` to `/parfum/`
   - File: `next.config.ts`
   - Find the redirect entry for `/maklon-parfum/`
   - Change destination to `/parfum/`
   - Keep 308 status code

2. **REDIRECT-002**: Change `/maklon-face-mist/` redirect from `/produk/skincare/` to appropriate destination
   - File: `next.config.ts`
   - Find the redirect entry
   - Change to `/produk/skincare/facial-toner/` or better matching page

3. **REDIRECT-003**: Change `/pabrik-parfum-surabaya/` redirect from `/produk/parfum/` to location-specific page
   - File: `next.config.ts`
   - Find the redirect entry
   - Change to appropriate destination

4. **INDEXING-001**: Submit indexing requests via GSC URL Inspection for:
   - `/pabrik-parfum/`
   - `/pabrik-kosmetik/`
   - `/jasa-maklon-kosmetik/`
   - `/private-label-kosmetik/`
   - `/estimasi-biaya-maklon-kosmetik/`

5. **GA4 data request**: Output the request for GA4 export (read-only task)

### Rules

- Do NOT change any file not listed in the implementation spec
- Do NOT modify any URL that has HEALTHY status in the action matrix
- Do NOT add noindex to any URL unless explicitly specified
- Do NOT delete any page content
- Do NOT create new articles or backlinks
- Do NOT change sitemap configuration unless specified

### Before each change

1. Read the current file content
2. Create a backup of the original
3. Make the minimal change required
4. Test the change locally

### After all changes

1. Run `npm run build` (or equivalent) to verify no compilation errors
2. Check that redirects work: `curl -I http://localhost:3000/maklon-parfum/`
3. Generate a change report listing all modifications

### If you encounter a MANUAL_REVIEW decision

- Skip that URL
- Note it in the change report
- Continue with other changes

### Output

Create a file `seo-redesign-decision/implementation-report.md` containing:
- List of changes made
- Files modified
- URLs affected
- Status (success/failure/skipped)
- MANUAL_REVIEW URLs encountered
- Any issues or decisions made during implementation

## CRITICAL: Stop if any instruction conflicts with:
- "Do not change code that is healthy"
- "Do not mass noindex/delete"
- "Do not redirect all 404s to homepage"
- "Do not skip MANUAL_REVIEW decisions"
