# Suitcase & Life — Product Requirements Document

## Original Problem Statement
Ankeet & Sruthi want a minimal, Apple-like website that acts as a public "display shelf" for their
collection of curated objects, tied to their Instagram project **@suitcaseandlife**
("We are Ankeet and Sruthi. We love to collect things. This is a sneak peek into our small archive
of gathered curiosities.").

Every product has: photos/videos (4–6), Name, Price, Source Link, Description/story, Store name,
City, Date acquired, Category, Featured flag, Tags, and an "I'm Interested" button that acts as a
favourite/like from visitors. Filters by category on top. Data entry must be a single streamlined
point-of-entry: **Google Sheets**.

Three sections: Hero → Bento of top-liked/featured → Full archive with filters.
Design: minimal, bold, modern, very elegant, very Apple-like (Instrument Serif + Manrope).
Performance: must never feel heavy.

## Architecture
- **Backend**: FastAPI on :8001; fetches public Google Sheet as CSV (5-min cache), parses rows
  (tolerant header normalisation), merges visitor "Interested" counts from MongoDB (`likes`
  collection), and falls back to 10 curated sample products when the sheet is empty.
- **Frontend**: React 19 + Tailwind 3 + shadcn/ui (Dialog). Single-page editorial layout.
  `Instrument Serif` for display, `Manrope` for UI/body. lucide-react for icons.
- **Data flow**: Sheet → CSV export → `_load_products_raw` (cache) → Pydantic `Product` → JSON →
  React. Likes: `POST /api/products/{slug}/like` updates `db.likes`. Browser remembers liked ids
  in `localStorage[sl_liked_v1]` for idempotence.

## User Personas
- **Ankeet & Sruthi (curators)**: edit a single Google Sheet; the site self-updates in ≤5 min.
- **Visitors (friends / Instagram followers)**: browse the shelf, filter by category, open a
  product to see photos/videos + story, press "I'm interested" to like.

## Core Requirements (static)
- Hero section with brand, tagline, counts, silent marquee ticker.
- Bento grid with 4 featured tiles + 1 mandatory black accent card.
- Full archive with category filter pills.
- Product detail dialog with media gallery, meta sidebar, I'm Interested, View Source.
- Responsive (mobile/tablet/desktop) — no horizontal overflow.

## What's been implemented (2026-02)
- ✅ Google Sheet CSV fetch + cache + automatic refresh every 5 min (`GET /api/refresh` manual).
- ✅ Tolerant CSV parser — handles any header casing + common aliases (`price`, `cost`, etc.).
- ✅ 10-product sample fallback with real media URLs and curated stories.
- ✅ Hero, Bento, Archive, Product Detail, Footer.
- ✅ Like system (server counter + localStorage idempotence).
- ✅ Filter pills (All + one per category discovered in data).
- ✅ Fully responsive — no mobile overflow.
- ✅ Backend test suite (10/10 pass), Frontend Playwright (97% pass → 100% after overflow fix).
- ✅ **2026-02-25 — Definitive modal scroll-lock fix + UX polish**:
  - Scroll-lock: `savedScrollRef` captures `window.scrollY` in the click handler
    BEFORE `setActiveId`. The `useEffect` reads the ref (not `window.scrollY`)
    so Radix's mount-time auto-scroll doesn't poison the captured value.
    On cleanup, temporarily sets `html.style.scrollBehavior='auto'` so the
    `window.scrollTo(0, savedY)` is an instant snap, not a 600ms animation.
    Verified: `pre=1500 → body.top=-1500px → post-close=1500` (desktop) and
    `pre=600 → -600px → 600` (mobile). 100% pass.
  - Custom backdrop `[data-testid=modal-backdrop]` at z-99 (above header z-70)
    fully covers the navigation bar so the modal feels properly layered.
  - Mobile modal redesign: scrollable content area, sticky close button at
    top-right (`fixed top-3 right-3 z-30`), sticky bottom action bar with
    `Add to Shelf` + open-link arrow, swipeable image gallery
    (touchstart/touchend → setActiveIdx).
  - Renamed "I'm interested" → "Add to Shelf" everywhere.
  - Renamed "My list" → "My shelf"; route `/my-shelf` (with `/my-list` kept
    for backward-compat). Empty state has a custom inline SVG line-art
    illustration of an empty bookshelf with a confused dog (question mark
    above its head) and a single CTA "Add to Shelf" linking to `/#archive`.
  - Fixed React warning: `fetchpriority` → `fetchPriority` in Hero.jsx.

## Prioritised backlog
### P1 — High impact, small effort
- [ ] Admin "refresh" pill on the header (calls `/api/refresh`) so curators can force a re-sync
      without waiting 5 min.
- [ ] Share-to-Instagram / copy-link per product.
- [ ] Open Graph + Twitter meta tags per product (pre-rendered via server) for rich previews.

### P2 — Delight
- [ ] Smooth Lenis momentum scrolling.
- [ ] View transitions / shared-element animation on card → detail.
- [ ] "Liked by you" sub-shelf at the top of archive if the visitor has liked ≥1 item.
- [ ] Keyboard navigation in the media gallery.

### P3 — Growth
- [ ] Simple email capture: "Tell me when new things are added".
- [ ] Server-side image proxy + `<img srcset>` resizing for ultra-fast loads.

## Google Sheet contract (for Ankeet & Sruthi)
Columns (header row, any casing/order; extra columns ignored):
`Name | Category | Price | Link | Media URLs | Description | Store Name | City | Date Acquired |
Featured | Tags`

- **Media URLs**: comma or newline separated (4–6 URLs). MP4/WebM/MOV treated as video.
- **Featured**: `yes`/`no` (or `true`/`false`/`1`). 4 "featured" items surface in the Bento; if
  fewer than 4 are marked, the most-liked items fill the rest.
- **Tags**: comma separated.

Sheet must be shared as "Anyone with the link → Viewer".

## Env vars
- `GOOGLE_SHEET_ID` (required for live sheet, optional — falls back to samples)
- `GOOGLE_SHEET_GID` (default `0`)
- `SHEET_CACHE_TTL` seconds (default `300`)
- `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS` (existing)
