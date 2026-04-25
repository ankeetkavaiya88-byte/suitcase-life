# Suitcase &amp; Life

> A minimal, Apple-like editorial display shelf for a curated personal archive.
> Powered by a Google Sheet — curators add a row, the site auto-syncs in ≤ 5 min.

---

## Run it locally in 90 seconds

```bash
# 1. Backend (FastAPI + MongoDB)
cd backend
cp .env.example .env          # then fill in the values (see below)
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# 2. Frontend (CRA, in a second terminal)
cd frontend
cp .env.example .env          # set REACT_APP_BACKEND_URL=http://localhost:8001
yarn install
yarn start                    # http://localhost:3000
```

You'll need a local **MongoDB** running on `mongodb://localhost:27017` (or any URI you prefer — just set `MONGO_URL`). The `likes` collection is created on the first POST.

---

## Required environment variables

| File | Var | Purpose |
|---|---|---|
| `backend/.env` | `MONGO_URL` | MongoDB connection string |
| `backend/.env` | `DB_NAME` | MongoDB database name |
| `backend/.env` | `GOOGLE_SHEET_ID` | Public Google Sheet ID (omit to fall back to 10 bundled samples) |
| `backend/.env` | `GOOGLE_SHEET_GID` | Default `0` |
| `backend/.env` | `SHEET_CACHE_TTL` | Seconds, default `300` |
| `backend/.env` | `CORS_ORIGINS` | Comma-separated allow-list |
| `frontend/.env` | `REACT_APP_BACKEND_URL` | Base URL of the backend |

> The Google Sheet must be shared as **Anyone with the link → Viewer**. Header columns: `Name, Category, Price, Link, Media URLs, Description, Store Name, City, Date Acquired, Featured, Tags`. Casing/order doesn't matter — the parser normalises headers.

---

## Stack

- **Frontend** — React 19 (CRA), Tailwind 3, shadcn/ui, lucide-react, react-router-dom 7
- **Backend** — FastAPI 0.110, Motor (async Mongo), Pydantic v2, httpx for Sheet fetch
- **Data** — Public Google Sheet (CSV export, server-cached) + MongoDB for visitor likes

---

## API surface

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/products` | All products with merged like counts |
| `GET` | `/api/categories` | Distinct categories |
| `POST` | `/api/products/{slug}/like` | Increments visitor "Add to Shelf" counter |
| `GET` | `/api/refresh` | Force-clears the Sheet cache and re-fetches |

---

## Project layout

```
backend/
  server.py             ← FastAPI app, sheet fetch + cache, likes
  tests/                ← pytest (10/10 passing)
  requirements.txt
frontend/
  src/
    App.js              ← routes, scroll-lock, ProductDetail mounting
    components/
      Header.jsx        ← fixed nav, mobile menu
      Hero.jsx          ← cinematic blurred hero
      BentoGrid.jsx     ← 4 featured + accent card
      Archive.jsx       ← sticky filter pills + grid
      ProductCard.jsx
      ProductDetail.jsx ← Dialog (separate desktop + mobile layouts, swipe)
      Footer.jsx
      ui/               ← shadcn components
    pages/
      Home.jsx
      MyList.jsx        ← /my-shelf — empty SVG state + grid
      About.jsx
    lib/api.js          ← axios + localStorage helpers
    index.css           ← global tokens, font faces
memory/
  PRD.md                ← living product spec
design_guidelines.json
test_reports/           ← iteration_*.json from automated tests
SUITCASE_AND_LIFE_HANDOFF.pdf  ← full engineering handoff (read first)
```

---

## Read this before refactoring

The **modal scroll-lock** in `App.js` is intentionally subtle. Capture timing
matters — the `savedScrollRef` is set in the click handler **before** `setActiveId`,
because Radix Dialog's mount auto-scrolls the page and reading `window.scrollY`
inside the `useEffect` would capture the wrong value. On cleanup we override
`html { scroll-behavior: smooth }` to `auto` so the post-close `scrollTo` is an
instant snap, not a 600 ms animation.

`SUITCASE_AND_LIFE_HANDOFF.pdf` documents every other gotcha. Keep it next to
the code.

---

## Tests

```bash
# Backend
cd backend && pytest tests/

# Frontend (Playwright via the platform's testing agent in CI)
# Latest report: /test_reports/iteration_4.json — 100% pass on critical paths
```

---

## License

Private — © Ankeet &amp; Sruthi (@suitcaseandlife). All rights reserved.
