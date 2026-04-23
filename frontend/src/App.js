import React, { useCallback, useEffect, useMemo, useState } from "react";
import "@/App.css";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import Archive from "@/components/Archive";
import ProductDetail from "@/components/ProductDetail";
import Footer from "@/components/Footer";

import {
    fetchProducts,
    likeProduct,
    getLikedSet,
    addLiked,
} from "@/lib/api";

const App = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [active, setActive] = useState(null);
    const [likedSet, setLikedSet] = useState(getLikedSet());

    useEffect(() => {
        let on = true;
        fetchProducts()
            .then((data) => {
                if (!on) return;
                setProducts(data);
            })
            .catch((e) => {
                if (!on) return;
                setError(e?.message || "Failed to load");
            })
            .finally(() => on && setLoading(false));
        return () => {
            on = false;
        };
    }, []);

    const featured = useMemo(() => {
        const f = products.filter((p) => p.featured);
        const byLikes = [...products].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        const pool = f.length >= 4 ? f : [...f, ...byLikes.filter((p) => !f.includes(p))];
        return pool.slice(0, 4);
    }, [products]);

    const openProduct = useCallback((p) => setActive(p), []);
    const closeProduct = useCallback(() => setActive(null), []);

    const handleLike = useCallback(
        async (p) => {
            if (likedSet.has(p.id)) return;
            try {
                const res = await likeProduct(p.id);
                setProducts((prev) =>
                    prev.map((x) => (x.id === p.id ? { ...x, likes: res.likes } : x)),
                );
                setActive((cur) =>
                    cur && cur.id === p.id ? { ...cur, likes: res.likes } : cur,
                );
                const s = addLiked(p.id);
                setLikedSet(new Set(s));
            } catch (e) {
                /* noop */
            }
        },
        [likedSet],
    );

    return (
        <div className="App" id="top">
            <Header />

            {loading ? (
                <div className="min-h-screen grid place-items-center text-neutral-500">
                    <div className="meta-label animate-pulse">
                        Opening the archive…
                    </div>
                </div>
            ) : error ? (
                <div className="min-h-screen grid place-items-center px-6 text-center">
                    <div>
                        <div className="meta-label mb-3">Error</div>
                        <div className="font-display text-3xl">
                            We could not load the shelf.
                        </div>
                        <div className="text-sm text-neutral-500 mt-3">{error}</div>
                    </div>
                </div>
            ) : (
                <>
                    <Hero total={products.length} />
                    <BentoGrid products={featured} onOpen={openProduct} />
                    <Archive
                        products={products}
                        onOpen={openProduct}
                        likedSet={likedSet}
                    />
                </>
            )}

            <Footer />

            <ProductDetail
                product={active}
                onClose={closeProduct}
                onLike={handleLike}
                liked={active ? likedSet.has(active.id) : false}
            />
        </div>
    );
};

export default App;
