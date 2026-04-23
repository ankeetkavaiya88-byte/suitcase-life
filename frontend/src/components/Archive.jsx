import React, { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

const Archive = ({ products, onOpen, likedSet }) => {
    const [active, setActive] = useState("All");

    const categories = useMemo(() => {
        const set = new Set(["All"]);
        products.forEach((p) => set.add(p.category || "Uncategorized"));
        return [...set];
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
            <div className="flex items-end justify-between flex-wrap gap-6 mb-8">
                <div>
                    <div className="meta-label mb-3">003 — Full archive</div>
                    <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95]">
                        Everything on the <em className="italic">shelf.</em>
                    </h2>
                </div>
                <div className="text-sm text-neutral-500">
                    {visible.length} {visible.length === 1 ? "piece" : "pieces"}
                </div>
            </div>

            <div
                className="flex gap-2 mb-10 md:mb-14 overflow-x-auto no-scrollbar"
                data-testid="filter-bar"
            >
                {categories.map((c) => {
                    const isActive = active === c;
                    return (
                        <button
                            key={c}
                            onClick={() => setActive(c)}
                            data-testid={`filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`rounded-full px-4 md:px-5 py-2 text-sm font-medium transition-colors shrink-0 ${
                                isActive
                                    ? "bg-[#0A0A0A] text-white"
                                    : "text-neutral-500 hover:text-neutral-900 hover:bg-black/[0.04]"
                            }`}
                        >
                            {c}
                        </button>
                    );
                })}
            </div>

            {visible.length === 0 ? (
                <div className="py-24 text-center text-neutral-500">
                    Nothing in this category yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16">
                    {visible.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            onOpen={onOpen}
                            liked={likedSet.has(p.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Archive;
