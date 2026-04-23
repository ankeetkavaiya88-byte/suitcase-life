import React from "react";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";

/**
 * Asymmetric editorial bento inspired by user's reference image 1.
 * Includes one pitch-black accent tile as mandated by design guidelines.
 */
const BentoGrid = ({ products, onOpen }) => {
    if (!products?.length) return null;

    // Pick up to 4 featured/most-liked
    const [a, b, c, d] = [0, 1, 2, 3].map((i) => products[i]).filter(Boolean);

    const baseTile =
        "group relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white transition-all duration-500 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)]";

    const tileImg = (p, className) => (
        <img
            src={p.media_urls?.[0]}
            alt={p.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05] ${className || ""}`}
        />
    );

    const metaOverlay = (p) => (
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 flex items-end justify-between bg-gradient-to-t from-black/55 via-black/10 to-transparent text-white">
            <div className="min-w-0">
                <div className="meta-label text-white/70 mb-1">
                    {p.category}
                </div>
                <div className="font-display text-2xl md:text-3xl leading-[1.05] truncate">
                    {p.name}
                </div>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-medium shrink-0">
                <Heart className="w-3.5 h-3.5" />
                {p.likes}
            </div>
        </div>
    );

    return (
        <section
            id="featured"
            className="px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto pt-10 md:pt-20"
            data-testid="bento-section"
        >
            <div className="flex items-end justify-between mb-8 md:mb-12">
                <div>
                    <div className="meta-label mb-3">002 — Favourites</div>
                    <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95]">
                        The ones we keep <em className="italic">returning</em> to.
                    </h2>
                </div>
                <div className="hidden md:block text-sm text-neutral-500 max-w-xs text-right">
                    Shelf picks — curated by hand, ordered by the quiet interest of visitors like you.
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 auto-rows-[180px] md:auto-rows-[200px]">
                {/* Large dominant tile */}
                {a && (
                    <button
                        onClick={() => onOpen(a)}
                        className={`${baseTile} md:col-span-7 md:row-span-3 sl-reveal`}
                        style={{ animationDelay: "40ms" }}
                        data-testid="bento-tile-hero"
                    >
                        {tileImg(a)}
                        <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-white/85 backdrop-blur-md rounded-full px-3 py-1 text-[11px] font-medium tracking-wide">
                            <Sparkles className="w-3 h-3" /> Staff pick
                        </div>
                        <div className="absolute top-5 right-5 text-neutral-900/40 group-hover:text-neutral-900 transition-colors">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                        {metaOverlay(a)}
                    </button>
                )}

                {/* Small light tile */}
                {b && (
                    <button
                        onClick={() => onOpen(b)}
                        className={`${baseTile} md:col-span-5 md:row-span-2 sl-reveal`}
                        style={{ animationDelay: "120ms" }}
                        data-testid="bento-tile-2"
                    >
                        {tileImg(b)}
                        <div className="absolute top-5 right-5 text-white/80 group-hover:text-white transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        {metaOverlay(b)}
                    </button>
                )}

                {/* Black accent card — required by guidelines */}
                <div
                    className={`sl-reveal md:col-span-5 md:row-span-1 rounded-3xl p-6 md:p-8 bg-[#0A0A0A] text-white flex items-center justify-between overflow-hidden`}
                    style={{ animationDelay: "200ms" }}
                    data-testid="bento-accent-card"
                >
                    <div className="min-w-0">
                        <div className="meta-label !text-white/50 mb-2">
                            Archive Note
                        </div>
                        <div className="font-display text-xl md:text-2xl leading-[1.1]">
                            Objects outlast their packaging.
                            <em className="italic"> We keep the stories.</em>
                        </div>
                    </div>
                    <div className="ml-4 shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-2xl border border-white/15 grid place-items-center">
                        <svg viewBox="0 0 48 48" className="w-8 h-8 md:w-12 md:h-12">
                            <g
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                opacity="0.85"
                            >
                                <path d="M24 4 L44 14 V34 L24 44 L4 34 V14 Z" />
                                <path d="M24 4 V24 L44 14" />
                                <path d="M24 44 V24 L4 14" />
                                <path d="M24 24 L44 34" />
                                <path d="M24 24 L4 34" />
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Wide tile */}
                {c && (
                    <button
                        onClick={() => onOpen(c)}
                        className={`${baseTile} md:col-span-7 md:row-span-2 sl-reveal`}
                        style={{ animationDelay: "280ms" }}
                        data-testid="bento-tile-3"
                    >
                        {tileImg(c)}
                        <div className="absolute top-5 right-5 text-white/80 group-hover:text-white transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        {metaOverlay(c)}
                    </button>
                )}

                {/* Small square */}
                {d && (
                    <button
                        onClick={() => onOpen(d)}
                        className={`${baseTile} md:col-span-5 md:row-span-2 sl-reveal`}
                        style={{ animationDelay: "360ms" }}
                        data-testid="bento-tile-4"
                    >
                        {tileImg(d)}
                        <div className="absolute top-5 right-5 text-white/80 group-hover:text-white transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        {metaOverlay(d)}
                    </button>
                )}
            </div>
        </section>
    );
};

export default BentoGrid;
