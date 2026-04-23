"""Suitcase & Life — Collection Archive Backend.

Fetches product data from a public Google Sheet (CSV export), caches it,
merges visitor "I'm Interested" counts from MongoDB, and exposes them via JSON.
"""

from __future__ import annotations

import csv
import io
import logging
import os
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Google Sheet (public, exported as CSV)
GOOGLE_SHEET_ID = os.environ.get("GOOGLE_SHEET_ID", "").strip()
GOOGLE_SHEET_GID = os.environ.get("GOOGLE_SHEET_GID", "0").strip()
CACHE_TTL_SECONDS = int(os.environ.get("SHEET_CACHE_TTL", "300"))

app = FastAPI(title="Suitcase & Life API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


# ---------- Models ----------


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    name: str
    category: str = "Uncategorized"
    price: str = ""
    link: str = ""
    media_urls: list[str] = Field(default_factory=list)
    description: str = ""
    store_name: str = ""
    city: str = ""
    date_acquired: str = ""
    featured: bool = False
    tags: list[str] = Field(default_factory=list)
    likes: int = 0


class LikeResponse(BaseModel):
    id: str
    likes: int


# ---------- Fallback sample data (used if sheet is empty / unreachable) ----------

SAMPLE_PRODUCTS: list[dict[str, Any]] = [
    {
        "name": "Braun BN0032 Classic Analog",
        "category": "Electronics",
        "price": "$180",
        "link": "https://www.braun-clocks.com/",
        "media_urls": [
            "https://images.unsplash.com/photo-1590656114831-9be3b832eec7?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1548181048-dab5d66c2dfb?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=1400&q=80",
        ],
        "description": "Dieter Rams' design language, distilled to a silent, whisper-quiet dial. A small monument of restraint on the desk. We unboxed it on a rainy Tuesday and it has hummed ever since.",
        "store_name": "Nordgreen Flagship",
        "city": "Copenhagen",
        "date_acquired": "2024-11-03",
        "featured": "yes",
        "tags": "Timepiece, Minimal, Braun",
    },
    {
        "name": "Vitra Eames Plastic Side Chair",
        "category": "Furniture",
        "price": "$495",
        "link": "https://www.vitra.com/",
        "media_urls": [
            "https://images.pexels.com/photos/21567547/pexels-photo-21567547.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1400",
            "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80",
        ],
        "description": "The seat that taught plastic to behave like art. Ours came wrapped in three layers of kraft paper — a quiet ritual we didn't want to end.",
        "store_name": "Vitra Flagship",
        "city": "Weil am Rhein",
        "date_acquired": "2024-07-21",
        "featured": "yes",
        "tags": "Seating, Design Icon, Eames",
    },
    {
        "name": "Hasami Porcelain Tall Vase",
        "category": "Home",
        "price": "$78",
        "link": "https://www.hasamiporcelain.com/",
        "media_urls": [
            "https://images.pexels.com/photos/15791100/pexels-photo-15791100.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1400",
            "https://images.pexels.com/photos/33105314/pexels-photo-33105314.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1400",
            "https://images.unsplash.com/photo-1578500351865-d6c3706f46bc?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1578500351865-d6c3706f46bc?auto=format&fit=crop&w=1400&q=80",
        ],
        "description": "Unglazed stoneware, sanded by hand. We keep a single dried eucalyptus stem in it — nothing else has ever felt right.",
        "store_name": "Native & Co",
        "city": "London",
        "date_acquired": "2025-02-14",
        "featured": "yes",
        "tags": "Ceramic, Japan, Hasami",
    },
    {
        "name": "Leica Q3 Compact",
        "category": "Electronics",
        "price": "$6,250",
        "link": "https://leica-camera.com/",
        "media_urls": [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1606986601547-a9a49ceb5cfe?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=1400&q=80",
        ],
        "description": "A black brick of quiet engineering. The shutter click is practically punctuation.",
        "store_name": "Leica Store",
        "city": "Wetzlar",
        "date_acquired": "2025-01-09",
        "featured": "yes",
        "tags": "Camera, Optics, Leica",
    },
    {
        "name": "Aesop Marrakech Intense",
        "category": "Fragrance",
        "price": "$195",
        "link": "https://www.aesop.com/",
        "media_urls": [
            "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1595425964071-2c1eaed1eefd?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1400&q=80",
        ],
        "description": "Sandalwood, clove, cardamom. It smells like the hour just after a long dinner when everyone has gone quiet.",
        "store_name": "Aesop Bandra",
        "city": "Mumbai",
        "date_acquired": "2024-12-12",
        "featured": "no",
        "tags": "Scent, Aesop, Wood",
    },
    {
        "name": "Rimowa Original Cabin",
        "category": "Travel",
        "price": "$1,300",
        "link": "https://www.rimowa.com/",
        "media_urls": [
            "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1627843240167-b1f9440fc173?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1473445361085-b9a07f55632b?auto=format&fit=crop&w=1400&q=80",
        ],
        "description": "The suitcase that named the project. Dents are collected like stamps — proof we went somewhere.",
        "store_name": "Rimowa Flagship",
        "city": "Berlin",
        "date_acquired": "2024-03-02",
        "featured": "no",
        "tags": "Luggage, Aluminum, Travel",
    },
    {
        "name": "Muji Wall-Mount CD Player",
        "category": "Electronics",
        "price": "$330",
        "link": "https://www.muji.com/",
        "media_urls": [
            "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1558379850-b2e8bbc6141b?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=1400&q=80",
        ],
        "description": "Naoto Fukasawa's ventilation-fan disguise for music. Pull the cord; the room becomes a different year.",
        "store_name": "Muji Ginza",
        "city": "Tokyo",
        "date_acquired": "2024-09-18",
        "featured": "no",
        "tags": "Audio, Muji, Fukasawa",
    },
    {
        "name": "Carl Hansen CH24 Wishbone",
        "category": "Furniture",
        "price": "$925",
        "link": "https://www.carlhansen.com/",
        "media_urls": [
            "https://images.pexels.com/photos/10160351/pexels-photo-10160351.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1400",
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80",
        ],
        "description": "Hans Wegner's answer to a sentence that didn't need to be long. 100+ hand-tied cord steps. We watched.",
        "store_name": "Illums Bolighus",
        "city": "Copenhagen",
        "date_acquired": "2023-10-30",
        "featured": "no",
        "tags": "Chair, Danish, Wegner",
    },
    {
        "name": "Le Labo Santal 33",
        "category": "Fragrance",
        "price": "$220",
        "link": "https://www.lelabofragrances.com/",
        "media_urls": [
            "https://images.unsplash.com/photo-1557170334-a9086d21c4f4?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1595425964071-2c1eaed1eefd?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80",
        ],
        "description": "A fragrance you smell three strangers wearing before you buy it yourself. Smoky leather, a distant campfire.",
        "store_name": "Le Labo Nolita",
        "city": "New York",
        "date_acquired": "2024-06-05",
        "featured": "no",
        "tags": "Scent, Le Labo, Cult",
    },
    {
        "name": "Kinto SCS Coffee Carafe",
        "category": "Home",
        "price": "$68",
        "link": "https://kinto-usa.com/",
        "media_urls": [
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1400&q=80",
        ],
        "description": "Heat-resistant glass, a wooden handle that ages like driftwood. The pour has a sound.",
        "store_name": "Kinto Tokyo",
        "city": "Tokyo",
        "date_acquired": "2025-03-11",
        "featured": "no",
        "tags": "Coffee, Kinto, Glass",
    },
]


# ---------- Helpers ----------


def _slugify(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9\s-]", "", value).strip().lower()
    return re.sub(r"[\s-]+", "-", value) or "item"


def _split_multi(value: str) -> list[str]:
    """Split a cell on commas or newlines, trim and drop empties."""
    if not value:
        return []
    raw = re.split(r"[\n,]+", value)
    return [p.strip() for p in raw if p.strip()]


def _truthy(value: str) -> bool:
    return value.strip().lower() in {"yes", "true", "1", "y", "featured", "✓"}


_COLUMN_ALIASES: dict[str, list[str]] = {
    "name": ["name", "product", "title", "item"],
    "category": ["category", "type"],
    "price": ["price", "cost"],
    "link": ["link", "url", "source", "where"],
    "media_urls": ["media urls", "media", "photos", "images", "photo urls", "image urls", "videos"],
    "description": ["description", "story", "notes", "note"],
    "store_name": ["store name", "store", "shop", "bought from"],
    "city": ["city", "location", "place"],
    "date_acquired": ["date acquired", "date", "acquired", "purchased"],
    "featured": ["featured", "favorite", "favourite", "feature", "pick"],
    "tags": ["tags", "tag"],
}


def _normalize_row(row: dict[str, str]) -> dict[str, str]:
    """Normalize header names in a CSV row to our canonical field keys."""
    norm: dict[str, str] = {}
    lower_map = {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}
    for canonical, aliases in _COLUMN_ALIASES.items():
        for alias in aliases:
            if alias in lower_map:
                norm[canonical] = lower_map[alias]
                break
    return norm


def _row_to_product_dict(row: dict[str, str]) -> dict[str, Any] | None:
    norm = _normalize_row(row)
    name = norm.get("name", "").strip()
    if not name:
        return None
    return {
        "name": name,
        "category": norm.get("category", "Uncategorized") or "Uncategorized",
        "price": norm.get("price", ""),
        "link": norm.get("link", ""),
        "media_urls": norm.get("media_urls", ""),
        "description": norm.get("description", ""),
        "store_name": norm.get("store_name", ""),
        "city": norm.get("city", ""),
        "date_acquired": norm.get("date_acquired", ""),
        "featured": norm.get("featured", ""),
        "tags": norm.get("tags", ""),
    }


def _coerce_list(value: Any) -> list[str]:
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    if isinstance(value, str):
        return _split_multi(value)
    return []


def _build_product(raw: dict[str, Any]) -> Product:
    name = str(raw.get("name", "")).strip()
    pid = _slugify(name)
    featured = raw.get("featured", "")
    return Product(
        id=pid,
        name=name,
        category=str(raw.get("category") or "Uncategorized").strip() or "Uncategorized",
        price=str(raw.get("price", "")).strip(),
        link=str(raw.get("link", "")).strip(),
        media_urls=_coerce_list(raw.get("media_urls", "")),
        description=str(raw.get("description", "")).strip(),
        store_name=str(raw.get("store_name", "")).strip(),
        city=str(raw.get("city", "")).strip(),
        date_acquired=str(raw.get("date_acquired", "")).strip(),
        featured=_truthy(str(featured)) if isinstance(featured, str) else bool(featured),
        tags=_coerce_list(raw.get("tags", "")),
        likes=int(raw.get("likes", 0) or 0),
    )


# ---------- Sheet fetcher with in-memory cache ----------

_cache: dict[str, Any] = {"at": 0.0, "products": []}


def _fetch_sheet_csv() -> str:
    if not GOOGLE_SHEET_ID:
        return ""
    url = (
        f"https://docs.google.com/spreadsheets/d/{GOOGLE_SHEET_ID}"
        f"/export?format=csv&gid={GOOGLE_SHEET_GID}"
    )
    try:
        resp = requests.get(url, timeout=8, allow_redirects=True)
        if resp.status_code == 200 and resp.text.strip():
            return resp.text
        logger.warning("Sheet fetch returned status=%s len=%s", resp.status_code, len(resp.text))
    except Exception as exc:  # noqa: BLE001
        logger.warning("Sheet fetch failed: %s", exc)
    return ""


def _parse_csv(text: str) -> list[dict[str, Any]]:
    if not text.strip():
        return []
    reader = csv.DictReader(io.StringIO(text))
    items: list[dict[str, Any]] = []
    for row in reader:
        item = _row_to_product_dict(row)
        if item:
            items.append(item)
    return items


def _load_products_raw() -> list[dict[str, Any]]:
    now = time.time()
    if _cache["products"] and now - _cache["at"] < CACHE_TTL_SECONDS:
        return _cache["products"]

    csv_text = _fetch_sheet_csv()
    items = _parse_csv(csv_text) if csv_text else []
    if not items:
        items = SAMPLE_PRODUCTS
    _cache["products"] = items
    _cache["at"] = now
    return items


async def _merge_likes(products: list[Product]) -> list[Product]:
    ids = [p.id for p in products]
    if not ids:
        return products
    cursor = db.likes.find({"id": {"$in": ids}}, {"_id": 0})
    likes_map = {doc["id"]: int(doc.get("count", 0)) async for doc in cursor}
    for p in products:
        p.likes = likes_map.get(p.id, 0)
    return products


# ---------- Routes ----------


@api_router.get("/")
async def root() -> dict[str, str]:
    return {"service": "suitcase-and-life", "status": "ok"}


@api_router.get("/products", response_model=list[Product])
async def list_products() -> list[Product]:
    raw = _load_products_raw()
    products = [_build_product(item) for item in raw]
    return await _merge_likes(products)


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str) -> Product:
    raw = _load_products_raw()
    products = [_build_product(item) for item in raw]
    for p in products:
        if p.id == product_id:
            await _merge_likes([p])
            return p
    raise HTTPException(status_code=404, detail="Product not found")


@api_router.post("/products/{product_id}/like", response_model=LikeResponse)
async def like_product(product_id: str) -> LikeResponse:
    raw = _load_products_raw()
    if not any(_slugify(item.get("name", "")) == product_id for item in raw):
        raise HTTPException(status_code=404, detail="Product not found")
    await db.likes.update_one(
        {"id": product_id},
        {
            "$inc": {"count": 1},
            "$setOnInsert": {"created_at": datetime.now(timezone.utc).isoformat()},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()},
        },
        upsert=True,
    )
    doc = await db.likes.find_one({"id": product_id}, {"_id": 0})
    return LikeResponse(id=product_id, likes=int(doc.get("count", 0)) if doc else 1)


@api_router.post("/refresh")
async def refresh_cache() -> dict[str, Any]:
    _cache["at"] = 0.0
    _cache["products"] = []
    raw = _load_products_raw()
    return {"reloaded": True, "count": len(raw)}


@api_router.get("/categories", response_model=list[str])
async def list_categories() -> list[str]:
    raw = _load_products_raw()
    seen: list[str] = []
    for item in raw:
        cat = (item.get("category") or "Uncategorized").strip() or "Uncategorized"
        if cat not in seen:
            seen.append(cat)
    return seen


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client() -> None:
    client.close()
