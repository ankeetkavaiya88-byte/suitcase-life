"""Backend API tests for Suitcase & Life."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://suitcase-archive.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("service") == "suitcase-and-life"
        assert data.get("status") == "ok"


# ---------- Products ----------
class TestProducts:
    def test_list_products_structure(self, client):
        r = client.get(f"{API}/products")
        assert r.status_code == 200
        products = r.json()
        assert isinstance(products, list)
        assert len(products) == 10, f"Expected 10 sample products, got {len(products)}"
        required = {"id", "name", "category", "price", "link", "media_urls",
                    "description", "store_name", "city", "date_acquired",
                    "featured", "tags", "likes"}
        for p in products:
            missing = required - set(p.keys())
            assert not missing, f"Missing fields {missing} in product {p.get('id')}"
            assert isinstance(p["media_urls"], list)
            assert isinstance(p["tags"], list)
            assert isinstance(p["featured"], bool)
            assert isinstance(p["likes"], int)

    def test_featured_count(self, client):
        products = client.get(f"{API}/products").json()
        featured = [p for p in products if p["featured"]]
        assert len(featured) >= 4, f"Expected at least 4 featured, got {len(featured)}"

    def test_media_urls_min_four(self, client):
        products = client.get(f"{API}/products").json()
        for p in products:
            assert len(p["media_urls"]) >= 4, (
                f"Product {p['id']} has only {len(p['media_urls'])} media urls"
            )

    def test_get_single_product(self, client):
        products = client.get(f"{API}/products").json()
        pid = products[0]["id"]
        r = client.get(f"{API}/products/{pid}")
        assert r.status_code == 200
        assert r.json()["id"] == pid

    def test_get_single_product_404(self, client):
        r = client.get(f"{API}/products/this-does-not-exist-xyz")
        assert r.status_code == 404


# ---------- Likes ----------
class TestLikes:
    def test_like_increments(self, client):
        products = client.get(f"{API}/products").json()
        pid = products[0]["id"]
        before = client.get(f"{API}/products/{pid}").json()["likes"]
        r = client.post(f"{API}/products/{pid}/like")
        assert r.status_code == 200
        data = r.json()
        assert data["id"] == pid
        assert data["likes"] == before + 1
        after = client.get(f"{API}/products/{pid}").json()["likes"]
        assert after == before + 1

    def test_like_invalid_404(self, client):
        r = client.post(f"{API}/products/invalid-id-xyz/like")
        assert r.status_code == 404


# ---------- Categories ----------
class TestCategories:
    def test_categories_unique(self, client):
        r = client.get(f"{API}/categories")
        assert r.status_code == 200
        cats = r.json()
        assert isinstance(cats, list)
        assert len(cats) == len(set(cats))
        # Expected categories from sample data
        for expected in ["Electronics", "Furniture", "Home", "Fragrance", "Travel"]:
            assert expected in cats


# ---------- Refresh ----------
class TestRefresh:
    def test_refresh_clears_cache(self, client):
        r = client.post(f"{API}/refresh")
        assert r.status_code == 200
        data = r.json()
        assert data.get("reloaded") is True
        assert data.get("count") == 10
