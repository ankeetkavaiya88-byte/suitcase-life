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

    // Capture scrollY in the click handler — BEFORE setActiveId triggers
    // React render. Radix Dialog mount auto-scrolls the page (despite our
    // onOpenAutoFocus prevention), so reading window.scrollY inside the
    // useEffect captures the post-auto-scroll value, not the user's actual
    // position. The ref preserves the true pre-click position.
    const savedScrollRef = useRef(0);
    const openProduct = useCallback((p) => {
        savedScrollRef.current = window.scrollY;
        setActiveId(p.id);
    }, []);

    // Custom body scroll-lock: pin body via `position: fixed; top: -savedY`
    // using the scroll position captured at click time. Effect depends on
    // `!!activeId` so prev/next switches don't unlock or re-capture.
    const isOpen = !!activeId;
    useEffect(() => {
        if (!isOpen) return undefined;
        const html = document.documentElement;
        const body = document.body;
        const savedY = savedScrollRef.current;
        const scrollbarW = window.innerWidth - html.clientWidth;
        if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;
        body.style.position = "fixed";
        body.style.top = `-${savedY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        return () => {
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            body.style.paddingRight = "";
            // Restore scroll instantly. Override `scroll-behavior: smooth`
            // so the snap-back is not animated.
            const prevSB = html.style.scrollBehavior;
            html.style.scrollBehavior = "auto";
            window.scrollTo(0, savedY);
            html.style.scrollBehavior = prevSB;
        };
    }, [isOpen]);

    const closeProduct = useCallback(() => {
        setActiveId(null);
    }, []);

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
                        <Route path="/my-shelf" element={<MyList {...shared} />} />
                        {/* Backward-compat: keep /my-list working */}
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
