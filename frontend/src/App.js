import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

    const scrollPosRef = useRef(0);
    const openProduct = useCallback((p) => {
        scrollPosRef.current = window.scrollY;
        setActiveId(p.id);
    }, []);

    // Bulletproof scroll-lock: position:fixed pins the body visually so the
    // background NEVER shifts while the modal is open or while navigating
    // prev/next. On unlock we restore scroll synchronously so there is no
    // flash before the modal close animation finishes.
    useEffect(() => {
        if (!activeId) return undefined;
        const savedY = scrollPosRef.current;
        const scrollbarW =
            window.innerWidth - document.documentElement.clientWidth;
        const body = document.body;
        body.style.position = "fixed";
        body.style.top = `-${savedY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;
        return () => {
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            body.style.paddingRight = "";
            // Synchronously restore to where we were before opening — avoids
            // any visible flash to scroll 0.
            window.scrollTo(0, savedY);
        };
    }, [activeId]);

    const closeProduct = useCallback(() => {
        const id = activeId;
        setActiveId(null);
        // After cleanup runs (synchronous, restores to savedY), centre the
        // last-viewed card in the viewport on the next frame.
        window.requestAnimationFrame(() => {
            if (!id) return;
            const card = document.querySelector(
                `[data-testid="product-card-${id}"]`,
            );
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const cardCentre = rect.top + window.scrollY + rect.height / 2;
            const target = Math.max(0, cardCentre - window.innerHeight / 2);
            window.scrollTo(0, target);
        });
    }, [activeId]);

    // Radix Dialog uses modal={false} so it doesn't manage scroll itself —
    // App.js owns the scroll lock and the post-close restoration.

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
