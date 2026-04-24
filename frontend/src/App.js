import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import Home from "@/pages/Home";
import MyList from "@/pages/MyList";
import About from "@/pages/About";

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
    const [activeId, setActiveId] = useState(null);
    const [likedSet, setLikedSet] = useState(getLikedSet());

    useEffect(() => {
        let on = true;
        fetchProducts()
            .then((data) => on && setProducts(data))
            .catch((e) => on && setError(e?.message || "Failed to load"))
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

    const activeIndex = useMemo(
        () => (activeId ? products.findIndex((p) => p.id === activeId) : -1),
        [products, activeId],
    );
    const activeProduct = activeIndex >= 0 ? products[activeIndex] : null;

    const openProduct = useCallback((p) => setActiveId(p.id), []);
    const closeProduct = useCallback(() => setActiveId(null), []);

    // Preserve scroll position when the detail dialog opens; restore on close.
    // Use overflow:hidden + padding-right (scrollbar gutter) so the page does not
    // visually move and the fixed header stays in place.
    useEffect(() => {
        if (!activeId) return undefined;
        const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
        const prevOverflow = document.body.style.overflow;
        const prevPadding = document.body.style.paddingRight;
        document.body.style.overflow = "hidden";
        if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.paddingRight = prevPadding;
        };
    }, [activeId]);

    const goPrev = useCallback(() => {
        if (activeIndex <= 0) return;
        setActiveId(products[activeIndex - 1].id);
    }, [activeIndex, products]);
    const goNext = useCallback(() => {
        if (activeIndex < 0 || activeIndex >= products.length - 1) return;
        setActiveId(products[activeIndex + 1].id);
    }, [activeIndex, products]);

    const handleLike = useCallback(
        async (p) => {
            if (likedSet.has(p.id)) return;
            try {
                const res = await likeProduct(p.id);
                setProducts((prev) =>
                    prev.map((x) => (x.id === p.id ? { ...x, likes: res.likes } : x)),
                );
                const s = addLiked(p.id);
                setLikedSet(new Set(s));
            } catch {
                /* noop */
            }
        },
        [likedSet],
    );

    const shared = { products, onOpen: openProduct, likedSet };

    return (
        <BrowserRouter>
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
                            <div className="text-sm text-neutral-500 mt-3">
                                {error}
                            </div>
                        </div>
                    </div>
                ) : (
                    <Routes>
                        <Route
                            path="/"
                            element={<Home {...shared} featured={featured} />}
                        />
                        <Route path="/my-list" element={<MyList {...shared} />} />
                        <Route path="/about" element={<About />} />
                        <Route
                            path="*"
                            element={<Home {...shared} featured={featured} />}
                        />
                    </Routes>
                )}

                <Footer />

                <ProductDetail
                    product={activeProduct}
                    onClose={closeProduct}
                    onLike={handleLike}
                    liked={activeProduct ? likedSet.has(activeProduct.id) : false}
                    onPrev={goPrev}
                    onNext={goNext}
                    hasPrev={activeIndex > 0}
                    hasNext={activeIndex >= 0 && activeIndex < products.length - 1}
                />
            </div>
        </BrowserRouter>
    );
};

export default App;
