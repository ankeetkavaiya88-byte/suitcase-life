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
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-200 aspect-[4/5]">
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
                {product.likes > 0 && (
                    <div
                        className="absolute top-2 left-2 sm:top-3 sm:left-3 inline-flex items-center gap-1 sm:gap-1.5 bg-white/90 backdrop-blur rounded-full px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium text-neutral-900 font-instr-sans"
                        data-testid={`card-likes-${product.id}`}
                    >
                        <Heart
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                            fill={liked ? "#0a0a0a" : "none"}
                            stroke="#0a0a0a"
                        />
                        {product.likes}
                    </div>
                )}
                <div className="hidden sm:grid absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur place-items-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            {/* Info row — baseline-aligned, editorial */}
            <div className="mt-3 sm:mt-5 flex items-baseline justify-between gap-2 sm:gap-3">
                <div className="meta-label !text-[10px] sm:!text-[11px] text-neutral-400">
                    {String(index ?? 1).padStart(2, "0")}
                </div>
                <div className="meta-label !text-[10px] sm:!text-[11px] text-neutral-500 truncate">
                    {product.store_name || "Archive"}
                    {product.city ? ` · ${product.city}` : ""}
                </div>
            </div>
            <div className="mt-1.5 sm:mt-2 flex items-start justify-between gap-2 sm:gap-4">
                <h3 className="font-display text-[17px] sm:text-[22px] md:text-[24px] leading-[1.1] tracking-tight flex-1 min-w-0 line-clamp-2">
                    {product.name}
                </h3>
                <div className="font-instr-sans text-[12px] sm:text-[14px] font-medium text-neutral-900 tabular-nums shrink-0 mt-0.5 sm:mt-1">
                    {product.price || "—"}
                </div>
            </div>
        </button>
    );
};

export default ProductCard;
