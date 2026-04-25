import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "../components/ui/dialog";
import {
    Heart,
    ArrowUpRight,
    X,
    MapPin,
    Calendar,
    Tag,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const isVideoUrl = (u = "") => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u);

const ProductDetail = ({
    product,
    onClose,
    onLike,
    liked,
    onPrev,
    onNext,
    hasPrev,
    hasNext,
}) => {
    const open = !!product;
    const [activeIdx, setActiveIdx] = useState(0);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        setActiveIdx(0);
    }, [product?.id]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "ArrowRight" && hasNext) onNext?.();
            else if (e.key === "ArrowLeft" && hasPrev) onPrev?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, hasNext, hasPrev, onNext, onPrev]);

    const handleInterested = async () => {
        if (!product || busy) return;
        setBusy(true);
        try {
            await onLike(product);
        } finally {
            setBusy(false);
        }
    };

    const selectThumb = (e, i) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveIdx(i);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent
                data-testid="product-detail"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="md:max-w-[min(96vw,1200px)] md:w-[96vw] md:h-[92vh] md:rounded-3xl w-screen h-[100dvh] max-w-none rounded-none p-0 border-0 overflow-hidden bg-[#F7F7F7]"
            >
                {product && (
                    <div className="md:grid md:grid-cols-12 md:h-full h-[100dvh] flex flex-col">
                        {/* Media gallery */}
                        <div className="md:col-span-7 relative bg-neutral-100 md:h-full shrink-0">
                            <div className="relative w-full md:absolute md:inset-0 aspect-[4/3] md:aspect-auto">
                                {product.media_urls?.length ? (
                                    isVideoUrl(product.media_urls[activeIdx]) ? (
                                        <video
                                            key={`${product.id}-${activeIdx}`}
                                            src={product.media_urls[activeIdx]}
                                            className="h-full w-full object-cover"
                                            controls
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            key={`${product.id}-${activeIdx}`}
                                            src={product.media_urls[activeIdx]}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    )
                                ) : (
                                    <div className="h-full w-full grid place-items-center text-neutral-400">
                                        No media
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails — wrapper-based outline (uniform) */}
                            {product.media_urls?.length > 1 && (
                                <div className="md:absolute md:bottom-4 md:left-4 md:right-4 md:z-20 px-4 py-3 md:px-0 md:py-0 flex items-center gap-2 overflow-x-auto no-scrollbar bg-neutral-100 md:bg-transparent">
                                    {product.media_urls.map((u, i) => {
                                        const active = i === activeIdx;
                                        return (
                                            <button
                                                type="button"
                                                key={`${product.id}-t-${i}`}
                                                onClick={(e) => selectThumb(e, i)}
                                                data-testid={`thumb-${i}`}
                                                aria-label={`Thumbnail ${i + 1}`}
                                                className={`shrink-0 rounded-2xl p-[3px] transition-all ${
                                                    active
                                                        ? "bg-white scale-[1.04] shadow-[0_2px_10px_rgba(0,0,0,0.18)]"
                                                        : "bg-transparent opacity-80 hover:opacity-100"
                                                }`}
                                            >
                                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl overflow-hidden">
                                                    {isVideoUrl(u) ? (
                                                        <div className="h-full w-full grid place-items-center bg-neutral-800 text-white text-[10px]">
                                                            VIDEO
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={u}
                                                            alt=""
                                                            loading="lazy"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Info — fixed top, scrollable description, fixed bottom */}
                        <div className="md:col-span-5 md:h-full bg-white flex flex-col flex-1 min-h-0 overflow-hidden">
                            {/* Top fixed: category + close */}
                            <div className="shrink-0 flex items-center justify-between px-5 md:px-8 py-3 md:py-4 bg-white border-b border-black/[0.06]">
                                <div className="meta-label">
                                    {product.category}
                                </div>
                                <button
                                    onClick={onClose}
                                    data-testid="close-detail"
                                    aria-label="Close"
                                    className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 grid place-items-center"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Fixed: title + price */}
                            <div className="shrink-0 px-5 md:px-8 pt-6 md:pt-8 pb-5 border-b border-black/[0.04]">
                                <DialogTitle asChild>
                                    <h2 className="font-display text-2xl md:text-4xl leading-[1.05] tracking-tight">
                                        {product.name}
                                    </h2>
                                </DialogTitle>
                                <div className="mt-2 md:mt-3 flex items-baseline gap-3">
                                    <div className="font-display text-xl md:text-2xl">
                                        {product.price || "—"}
                                    </div>
                                    <div className="meta-label">
                                        · price at purchase
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable description */}
                            <div className="flex-1 min-h-0 overflow-y-auto px-5 md:px-8 py-5 md:py-6">
                                {product.description ? (
                                    <DialogDescription asChild>
                                        <p className="text-[14px] md:text-[15px] leading-[1.7] text-neutral-700 font-instr-sans">
                                            {product.description}
                                        </p>
                                    </DialogDescription>
                                ) : (
                                    <p className="text-sm text-neutral-400 italic">
                                        No description.
                                    </p>
                                )}
                            </div>

                            {/* Fixed bottom: meta + tags + actions + arrows */}
                            <div className="shrink-0 px-5 md:px-8 pt-5 pb-5 md:pb-6 border-t border-black/[0.06] bg-white space-y-5">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                    <InfoRow
                                        icon={<MapPin className="w-3.5 h-3.5" />}
                                        label="Bought at"
                                        value={
                                            product.store_name
                                                ? `${product.store_name}${product.city ? ` · ${product.city}` : ""}`
                                                : product.city || "—"
                                        }
                                    />
                                    <InfoRow
                                        icon={<Calendar className="w-3.5 h-3.5" />}
                                        label="Acquired"
                                        value={product.date_acquired || "—"}
                                    />
                                    {!!product.tags?.length && (
                                        <div className="col-span-2">
                                            <div className="meta-label mb-2 inline-flex items-center gap-1.5">
                                                <Tag className="w-3 h-3" /> Tags
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {product.tags.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="text-[11px] border border-black/10 rounded-full px-2.5 py-1 text-neutral-700 font-instr-sans"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleInterested}
                                        disabled={busy}
                                        data-testid="btn-interested"
                                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0A0A0A] hover:bg-neutral-800 text-white rounded-full py-3.5 text-sm font-medium tracking-wide transition-colors disabled:opacity-70 font-instr-sans"
                                    >
                                        <Heart
                                            className="w-4 h-4"
                                            fill={liked ? "#ffffff" : "none"}
                                        />
                                        {liked ? "You liked this" : "I'm interested"}
                                        <span className="ml-1 inline-flex items-center gap-1 text-white/70 text-xs">
                                            · {product.likes ?? 0}
                                        </span>
                                    </button>
                                    {product.link && (
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            data-testid="btn-source"
                                            aria-label="View source"
                                            className="shrink-0 w-12 h-12 rounded-full border border-black/10 hover:border-black/40 grid place-items-center transition-colors"
                                        >
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="meta-label !text-[10px] text-neutral-500">
                                        <span className="hidden md:inline">
                                            Use ← → to navigate
                                        </span>
                                        <span className="md:hidden">Browse</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            data-testid="product-prev"
                                            onClick={onPrev}
                                            disabled={!hasPrev}
                                            aria-label="Previous product"
                                            className="w-10 h-10 rounded-full border border-black/10 hover:border-black/50 grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            data-testid="product-next"
                                            onClick={onNext}
                                            disabled={!hasNext}
                                            aria-label="Next product"
                                            className="w-10 h-10 rounded-full border border-black/10 hover:border-black/50 grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <div>
        <div className="meta-label mb-1.5 inline-flex items-center gap-1.5">
            {icon} {label}
        </div>
        <div className="text-[13px] md:text-[14px] text-neutral-900 font-medium leading-snug font-instr-sans">
            {value || "—"}
        </div>
    </div>
);

export default ProductDetail;
