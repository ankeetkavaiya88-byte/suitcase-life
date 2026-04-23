import React from "react";
import { Heart, ArrowUpRight } from "lucide-react";

const ProductCard = ({ product, onOpen, liked }) => {
    const cover = product.media_urls?.[0];
    return (
        <button
            onClick={() => onOpen(product)}
            data-testid={`product-card-${product.id}`}
            className="group text-left flex flex-col gap-4 focus:outline-none"
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
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="meta-label bg-white/80 backdrop-blur px-2.5 py-1 rounded-full">
                        {product.category}
                    </span>
                </div>
                {product.likes > 0 && (
                    <div
                        className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-white/85 backdrop-blur rounded-full px-2.5 py-1 text-xs font-medium text-neutral-800"
                        data-testid={`card-likes-${product.id}`}
                    >
                        <Heart
                            className="w-3.5 h-3.5"
                            fill={liked ? "#0a0a0a" : "none"}
                            stroke="#0a0a0a"
                        />
                        {product.likes}
                    </div>
                )}
            </div>
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="meta-label mb-1.5">
                        {product.store_name || "Archive"}
                        {product.city ? ` · ${product.city}` : ""}
                    </div>
                    <h3 className="font-display text-[22px] leading-[1.15] truncate">
                        {product.name}
                    </h3>
                </div>
                <div className="text-right shrink-0">
                    <div className="font-sans-ui text-sm font-medium">
                        {product.price || "—"}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-neutral-500 group-hover:text-neutral-900 transition-colors">
                        View
                        <ArrowUpRight className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </button>
    );
};

export default ProductCard;
