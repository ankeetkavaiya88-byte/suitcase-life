import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "../components/ui/dialog";
import { Heart, ArrowUpRight, X, MapPin, Calendar, Tag } from "lucide-react";

const isVideoUrl = (u = "") => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u);

const ProductDetail = ({ product, onClose, onLike, liked }) => {
    const open = !!product;
    const [activeIdx, setActiveIdx] = useState(0);
    const [busy, setBusy] = useState(false);

    React.useEffect(() => setActiveIdx(0), [product?.id]);

    const handleInterested = async () => {
        if (!product || busy) return;
        setBusy(true);
        try {
            await onLike(product);
        } finally {
            setBusy(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent
                data-testid="product-detail"
                className="max-w-[min(96vw,1200px)] w-[96vw] h-[92vh] p-0 border-0 rounded-3xl overflow-hidden bg-[#F7F7F7]"
            >
                {product && (
                    <div className="grid grid-cols-1 md:grid-cols-12 h-full overflow-hidden">
                        {/* Media gallery - sticky on desktop */}
                        <div className="md:col-span-7 h-[45vh] md:h-full bg-neutral-100 relative">
                            <div className="h-full w-full relative">
                                {product.media_urls?.length ? (
                                    isVideoUrl(product.media_urls[activeIdx]) ? (
                                        <video
                                            key={product.media_urls[activeIdx]}
                                            src={product.media_urls[activeIdx]}
                                            className="h-full w-full object-cover"
                                            controls
                                            playsInline
                                        />
                                    ) : (
                                        <img
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

                            {product.media_urls?.length > 1 && (
                                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
                                    {product.media_urls.map((u, i) => (
                                        <button
                                            key={u + i}
                                            onClick={() => setActiveIdx(i)}
                                            data-testid={`thumb-${i}`}
                                            className={`h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-xl overflow-hidden border transition-all ${
                                                i === activeIdx
                                                    ? "border-black/70 scale-[1.02]"
                                                    : "border-white/50 opacity-80 hover:opacity-100"
                                            }`}
                                        >
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
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info sidebar */}
                        <div className="md:col-span-5 h-full overflow-y-auto bg-white">
                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-8 py-4 bg-white/90 backdrop-blur border-b border-black/[0.06]">
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

                            <div className="px-6 md:px-8 py-7 md:py-9 space-y-7">
                                <div>
                                    <DialogTitle asChild>
                                        <h2 className="font-display text-4xl md:text-5xl leading-[1.02] tracking-tight">
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

                                {product.description && (
                                    <DialogDescription asChild>
                                        <p className="text-[15px] leading-[1.7] text-neutral-700">
                                            {product.description}
                                        </p>
                                    </DialogDescription>
                                )}

                                <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-t border-black/[0.06] pt-6">
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
                                                        className="text-[11px] border border-black/10 rounded-full px-2.5 py-1 text-neutral-700"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 pt-2">
                                    <button
                                        onClick={handleInterested}
                                        disabled={busy}
                                        data-testid="btn-interested"
                                        className="w-full inline-flex items-center justify-center gap-2 bg-[#0A0A0A] hover:bg-neutral-800 text-white rounded-full py-4 text-sm font-medium tracking-wide transition-colors disabled:opacity-70"
                                    >
                                        <Heart
                                            className="w-4 h-4"
                                            fill={liked ? "#ffffff" : "none"}
                                        />
                                        {liked ? "You liked this" : "I'm interested"}
                                        <span className="ml-2 inline-flex items-center gap-1 text-white/70 text-xs">
                                            · {product.likes ?? 0}
                                        </span>
                                    </button>
                                    {product.link && (
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            data-testid="btn-source"
                                            className="w-full inline-flex items-center justify-center gap-2 border border-black/10 hover:border-black/40 rounded-full py-4 text-sm font-medium transition-colors"
                                        >
                                            View source
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    )}
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
        <div className="text-[14px] text-neutral-900 font-medium leading-snug">
            {value || "—"}
        </div>
    </div>
);

export default ProductDetail;
