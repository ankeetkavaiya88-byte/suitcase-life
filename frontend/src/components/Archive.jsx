import React, { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

const Archive = ({ products, onOpen, likedSet }) => {
    const [active, setActive] = useState("All");

    // Build category list with counts (FABMAG style)
    const categories = useMemo(() => {
        const counts = new Map();
        products.forEach((p) => {
            const c = p.category || "Uncategorized";
            counts.set(c, (counts.get(c) || 0) + 1);
        });
        return [
            { name: "All", count: products.length },
            ...[...counts.entries()].map(([name, count]) => ({ name, count })),
        ];
    }, [products]);

    const visible = useMemo(() => {
        if (active === "All") return products;
        return products.filter((p) => (p.category || "") === active);
    }, [products, active]);

    return (
        <section
            id="archive"
            className="px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto pt-20 md:pt-32 pb-24 md:pb-40"
            data-testid="archive-section"
        >
            <div className="flex items-end justify-between flex-wrap gap-6 mb-10 md:mb-14">
                <div>
                    <div className="meta-label mb-4">
                        [003] <span className="text-neutral-400">/</span> Full archive
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em]">
                        Everything on the <em className="italic">shelf.</em>
                    </h2>
                </div>
                <div className="meta-label text-neutral-500">
                    Showing{" "}
                    <span className="text-neutral-900 font-semibold">
                        {String(visible.length).padStart(2, "0")}
                    </span>{" "}
                    / {String(products.length).padStart(2, "0")}
                </div>
            </div>

            {/* FABMAG style outlined pill filters */}
            <div
                className="flex flex-wrap gap-2 mb-12 md:mb-16 overflow-x-auto no-scrollbar"
                data-testid="filter-bar"
            >
                {categories.map((c) => {
                    const isActive = active === c.name;
                    return (
                        <button
                            key={c.name}
                            onClick={() => setActive(c.name)}
                            data-testid={`filter-${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`pill ${isActive ? "pill--active" : ""}`}
                        >
                            {c.name}
                            <span className="pill__count">
                                ({String(c.count).padStart(2, "0")})
                            </span>
                        </button>
                    );
                })}
            </div>

            {visible.length === 0 ? (
                <div className="py-24 text-center text-neutral-500 font-instr-sans">
                    Nothing in this category yet.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14 md:gap-y-20">
                    {visible.map((p, idx) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            onOpen={onOpen}
                            liked={likedSet.has(p.id)}
                            index={idx + 1}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Archive;
