import React from "react";
import { Heart, ArrowUpRight } from "lucide-react";

const ProductCard = ({ product, onOpen, liked, index }) => {
    const cover = product.media_urls?.[0];
    return (
        <button
            onClick={() => onOpen(product)}
            data-testid={`product-card-${product.id}`}
            className="group text-left flex flex-col focus:outline-none"
        >
            <div className="relative overflow-hidden rounded-2xl bg-neutral-200 aspect-[4/5]">
                {cover ? (
                    <img
                        src={cover}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                ) : (
                    <div className="h-full w-full bg-neutral-200" />
                )}
                <div className="absolute top-3 left-3">
                    {product.likes > 0 ? (
                        <div
                            className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-full px-2.5 py-1.5 text-[11px] font-medium text-neutral-900 font-instr-sans"
                            data-testid={`card-likes-${product.id}`}
                        >
                            <Heart
                                className="w-3 h-3"
                                fill={liked ? "#0a0a0a" : "none"}
                                stroke="#0a0a0a"
                            />
                            {product.likes}
                        </div>
                    ) : null}
                </div>
                {/* Hover arrow */}
                <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur grid place-items-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            {/* Info row — baseline-aligned, editorial */}
            <div className="mt-5 flex items-baseline justify-between gap-3">
                <div className="meta-label text-neutral-400">
                    {String(index ?? 1).padStart(2, "0")}
                </div>
                <div className="meta-label text-neutral-500 truncate">
                    {product.store_name || "Archive"}
                    {product.city ? ` · ${product.city}` : ""}
                </div>
            </div>
            <div className="mt-2 flex items-start justify-between gap-4">
                <h3 className="font-display text-[22px] md:text-[24px] leading-[1.1] tracking-tight flex-1 min-w-0 line-clamp-2">
                    {product.name}
                </h3>
                <div className="font-instr-sans text-[14px] font-medium text-neutral-900 tabular-nums shrink-0 mt-1">
                    {product.price || "—"}
                </div>
            </div>
        </button>
    );
};

export default ProductCard;
