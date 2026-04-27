import React, { useEffect, useRef, useState } from "react";
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
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);

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

    // Swipe handling for mobile gallery — horizontal swipe changes active image
    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        const total = product?.media_urls?.length || 0;
        // Only treat as a swipe if horizontal motion dominates and exceeds 40px
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) && total > 1) {
            if (dx < 0) setActiveIdx((i) => (i + 1) % total);
            else setActiveIdx((i) => (i - 1 + total) % total);
        }
        touchStartX.current = null;
        touchStartY.current = null;
    };

    const cta = liked ? "On your shelf" : "Add to Shelf";

    return (
        <Dialog open={open} modal={false} onOpenChange={(v) => !v && onClose()}>
            {/* Custom backdrop — covers the entire viewport including the
                fixed navigation bar (z-70) so the modal feels properly
                layered. Click outside the modal to close. */}
            {open && (
                <div
                    data-testid="modal-backdrop"
                    className="fixed inset-0 z-[99] bg-black/75 backdrop-blur-sm animate-in fade-in-0 duration-200"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
            <DialogContent
                data-testid="product-detail"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onEscapeKeyDown={onClose}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="md:max-w-[min(96vw,1200px)] md:w-[96vw] md:h-[74vh] md:rounded-3xl w-screen h-[100dvh] max-w-none rounded-none p-0 border-0 overflow-hidden bg-[#F7F7F7]"
            >
                {product && (
                    <>
                        {/* ===== MOBILE LAYOUT ===== */}
                        <div className="md:hidden h-[100dvh] flex flex-col bg-[#F7F7F7] relative">
                            {/* Sticky top-right close button (always visible) */}
                            <button
                                onClick={onClose}
                                data-testid="close-detail-mobile"
                                aria-label="Close"
                                className="fixed top-3 right-3 z-30 w-10 h-10 rounded-full bg-black/70 backdrop-blur text-white grid place-items-center shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Scrollable area: gallery + content */}
                            <div className="flex-1 overflow-y-auto pb-[110px]">
                                {/* Gallery — swipeable */}
                                <div
                                    className="relative w-full bg-neutral-100 aspect-[4/5] select-none"
                                    onTouchStart={onTouchStart}
                                    onTouchEnd={onTouchEnd}
                                >
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
                                                className="h-full w-full object-cover pointer-events-none"
                                                draggable={false}
                                            />
                                        )
                                    ) : (
                                        <div className="h-full w-full grid place-items-center text-neutral-400">
                                            No media
                                        </div>
                                    )}

                                    {/* Pagination dots */}
                                    {product.media_urls?.length > 1 && (
                                        <div
                                            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10"
                                            data-testid="mobile-gallery-dots"
                                        >
                                            {product.media_urls.map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`h-1.5 rounded-full transition-all ${
                                                        i === activeIdx
                                                            ? "w-6 bg-white"
                                                            : "w-1.5 bg-white/55"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Content (scrolls naturally with the page) */}
                                <div className="px-5 pt-6 pb-10 bg-white">
                                    <div className="meta-label mb-3">
                                        {product.category}
                                    </div>
                                    <DialogTitle asChild>
                                        <h2 className="font-display text-[28px] leading-[1.05] tracking-tight">
                                            {product.name}
                                        </h2>
                                    </DialogTitle>
                                    <div className="mt-2 flex items-baseline gap-3">
                                        <div className="font-display text-xl">
                                            {product.price || "—"}
                                        </div>
                                        <div className="meta-label">
                                            · price at purchase
                                        </div>
                                    </div>

                                    {product.description ? (
                                        <DialogDescription asChild>
                                            <p className="mt-6 text-[14px] leading-[1.7] text-neutral-700 font-instr-sans">
                                                {product.description}
                                            </p>
                                        </DialogDescription>
                                    ) : (
                                        <p className="mt-6 text-sm text-neutral-400 italic">
                                            No description.
                                        </p>
                                    )}

                                    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5">
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

                                    {/* Prev/next browse hint */}
                                    <div className="mt-10 flex items-center justify-between">
                                        <div className="meta-label !text-[10px] text-neutral-500">
                                            Swipe gallery · use arrows to browse
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                data-testid="product-prev-mobile"
                                                onClick={onPrev}
                                                disabled={!hasPrev}
                                                aria-label="Previous product"
                                                className="w-10 h-10 rounded-full border border-black/10 grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                data-testid="product-next-mobile"
                                                onClick={onNext}
                                                disabled={!hasNext}
                                                aria-label="Next product"
                                                className="w-10 h-10 rounded-full border border-black/10 grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky bottom: Add to Shelf + open link */}
                            <div className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t border-black/[0.06] px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] flex items-center gap-2">
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
                                    {cta}
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
                                        className="shrink-0 w-12 h-12 rounded-full border border-black/10 grid place-items-center"
                                    >
                                        <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* ===== DESKTOP LAYOUT ===== */}
                        <div className="hidden md:grid md:grid-cols-12 md:h-full">
                            {/* Media gallery */}
                            <div className="md:col-span-7 relative bg-neutral-100 md:h-full">
                                <div className="absolute inset-0">
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

                                {/* Thumbnails */}
                                {product.media_urls?.length > 1 && (
                                    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2 overflow-x-auto no-scrollbar">
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
                                                    <div className="h-14 w-14 rounded-xl overflow-hidden">
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
                                <div className="shrink-0 flex items-center justify-between px-8 py-4 bg-white border-b border-black/[0.06]">
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

                                <div className="shrink-0 px-8 pt-8 pb-5 border-b border-black/[0.04]">
                                    <DialogTitle asChild>
                                        <h2 className="font-display text-4xl leading-[1.05] tracking-tight">
                                            {product.name}
                                        </h2>
                                    </DialogTitle>
                                    <div className="mt-3 flex items-baseline gap-3">
                                        <div className="font-display text-2xl">
                                            {product.price || "—"}
                                        </div>
                                        <div className="meta-label">
                                            · price at purchase
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6">
                                    {product.description ? (
                                        <DialogDescription asChild>
                                            <p className="text-[15px] leading-[1.7] text-neutral-700 font-instr-sans">
                                                {product.description}
                                            </p>
                                        </DialogDescription>
                                    ) : (
                                        <p className="text-sm text-neutral-400 italic">
                                            No description.
                                        </p>
                                    )}
                                </div>

                                <div className="shrink-0 px-8 pt-5 pb-6 border-t border-black/[0.06] bg-white space-y-5">
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
                                            data-testid="btn-interested-desktop"
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0A0A0A] hover:bg-neutral-800 text-white rounded-full py-3.5 text-sm font-medium tracking-wide transition-colors disabled:opacity-70 font-instr-sans"
                                        >
                                            <Heart
                                                className="w-4 h-4"
                                                fill={liked ? "#ffffff" : "none"}
                                            />
                                            {cta}
                                            <span className="ml-1 inline-flex items-center gap-1 text-white/70 text-xs">
                                                · {product.likes ?? 0}
                                            </span>
                                        </button>
                                        {product.link && (
                                            <a
                                                href={product.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                data-testid="btn-source-desktop"
                                                aria-label="View source"
                                                className="shrink-0 w-12 h-12 rounded-full border border-black/10 hover:border-black/40 grid place-items-center transition-colors"
                                            >
                                                <ArrowUpRight className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="meta-label !text-[10px] text-neutral-500">
                                            Use ← → to navigate
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
                    </>
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
