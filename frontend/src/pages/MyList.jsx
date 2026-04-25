import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const EmptyShelfDog = () => (
    // Cute line-art: empty bookshelf with a small terrier looking up,
    // confused (with a question mark above its head). All thin black lines.
    <svg
        viewBox="0 0 320 280"
        className="w-[240px] sm:w-[300px] h-auto text-neutral-700"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {/* Bookshelf cabinet */}
        <rect x="60" y="38" width="200" height="172" rx="3" />
        {/* Inner shelves */}
        <line x1="60" y1="98" x2="260" y2="98" />
        <line x1="60" y1="154" x2="260" y2="154" />
        {/* Tiny "dust marks" on shelves where things used to be */}
        <circle cx="100" cy="78" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="170" cy="78" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="220" cy="134" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="120" cy="190" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="200" cy="190" r="1.4" fill="currentColor" stroke="none" />

        {/* Floor line */}
        <line x1="20" y1="240" x2="300" y2="240" />

        {/* Question mark (above the dog's head) */}
        <g>
            <path d="M 92 154 Q 92 144 100 144 Q 108 144 108 153 Q 108 160 100 162 L 100 168" />
            <circle cx="100" cy="176" r="1.2" fill="currentColor" stroke="none" />
        </g>

        {/* Dog (sitting, head tilted up looking at empty shelf) */}
        <g>
            {/* Body — gentle teardrop */}
            <path d="M 132 240 Q 108 240 104 220 Q 102 200 122 195 Q 148 192 158 207 Q 166 222 158 240 Z" />
            {/* Front legs */}
            <line x1="118" y1="240" x2="118" y2="250" />
            <line x1="128" y1="240" x2="128" y2="250" />
            {/* Tail (perked up) */}
            <path d="M 158 222 Q 172 212 174 196" />
            {/* Head (tilted, looking up) */}
            <path d="M 124 200 Q 112 188 118 175 Q 126 165 142 168 Q 156 174 156 188 Q 156 200 144 206 Z" />
            {/* Ear flopped forward */}
            <path d="M 142 168 Q 148 160 154 168 Q 150 172 146 170" />
            {/* Other ear (back) */}
            <path d="M 124 175 Q 118 168 124 162" />
            {/* Eye */}
            <circle cx="138" cy="183" r="1.8" fill="currentColor" stroke="none" />
            {/* Nose */}
            <circle cx="120" cy="190" r="1.6" fill="currentColor" stroke="none" />
            {/* Snout line */}
            <path d="M 119 194 Q 124 197 130 194" />
            {/* Tiny chest tuft */}
            <path d="M 130 218 Q 134 222 132 226" />
        </g>
    </svg>
);

const MyList = ({ products, onOpen, likedSet }) => {
    const mine = useMemo(
        () => products.filter((p) => likedSet.has(p.id)),
        [products, likedSet],
    );

    return (
        <section
            className="pt-36 md:pt-44 px-6 md:px-12 lg:px-24 max-w-[1500px] mx-auto pb-24 md:pb-40 min-h-screen"
            data-testid="myshelf-page"
        >
            <div className="flex items-end justify-between flex-wrap gap-6 mb-10 md:mb-14">
                <div>
                    <div className="meta-label mb-4">
                        [M] <span className="text-neutral-400">/</span> Your
                        private shelf
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl lg:text-[8rem] leading-[0.95] tracking-[-0.02em]">
                        My <em className="italic">shelf.</em>
                    </h1>
                </div>
                <p className="font-instr-sans text-[14px] text-neutral-500 max-w-[34ch]">
                    A private shelf you build by tapping <em>Add to Shelf</em>{" "}
                    across the archive. Stored locally in your browser — no
                    sign-in, no tracking.
                </p>
            </div>

            {mine.length === 0 ? (
                <div
                    className="border-t border-black/10 pt-14 md:pt-20 flex flex-col items-center text-center"
                    data-testid="myshelf-empty"
                >
                    <EmptyShelfDog />
                    <div className="font-display text-3xl md:text-5xl mt-4 mb-4 tracking-tight">
                        Your shelf is empty.
                    </div>
                    <p className="font-instr-sans text-neutral-500 max-w-[44ch] mb-8">
                        Even the dog's confused. Wander into the archive, find
                        something that makes you pause, and tap{" "}
                        <em>Add to Shelf</em> — it'll land right here.
                    </p>
                    <Link
                        to="/#archive"
                        data-testid="myshelf-cta"
                        className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] text-white px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.14em] hover:bg-neutral-800 transition-colors font-instr-sans"
                    >
                        Add to Shelf
                    </Link>
                </div>
            ) : (
                <>
                    <div className="meta-label text-neutral-500 mb-10">
                        Showing{" "}
                        <span className="text-neutral-900 font-semibold">
                            {String(mine.length).padStart(2, "0")}
                        </span>{" "}
                        / {String(products.length).padStart(2, "0")}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14 md:gap-y-20">
                        {mine.map((p, idx) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onOpen={onOpen}
                                liked
                                index={idx + 1}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default MyList;
