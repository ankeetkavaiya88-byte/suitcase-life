import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Heart } from "lucide-react";

const MyList = ({ products, onOpen, likedSet }) => {
    const mine = useMemo(
        () => products.filter((p) => likedSet.has(p.id)),
        [products, likedSet],
    );

    return (
        <section
            className="pt-36 md:pt-44 px-6 md:px-12 lg:px-24 max-w-[1500px] mx-auto pb-24 md:pb-40 min-h-screen"
            data-testid="mylist-page"
        >
            <div className="flex items-end justify-between flex-wrap gap-6 mb-10 md:mb-14">
                <div>
                    <div className="meta-label mb-4">
                        [M] <span className="text-neutral-400">/</span> Your
                        liked pieces
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl lg:text-[8rem] leading-[0.95] tracking-[-0.02em]">
                        My <em className="italic">list.</em>
                    </h1>
                </div>
                <p className="font-instr-sans text-[14px] text-neutral-500 max-w-[34ch]">
                    A private shelf you built by tapping <em>I'm interested</em> across
                    the archive. Stored locally in your browser — no sign-in, no
                    tracking.
                </p>
            </div>

            {mine.length === 0 ? (
                <div className="border-t border-black/10 pt-16 md:pt-24 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full border border-black/15 grid place-items-center mb-6">
                        <Heart className="w-6 h-6 text-neutral-400" />
                    </div>
                    <div className="font-display text-3xl md:text-4xl mb-3 tracking-tight">
                        Nothing on the list yet.
                    </div>
                    <p className="font-instr-sans text-neutral-500 max-w-[42ch] mb-8">
                        Head to the archive, find something that makes you pause,
                        and tap <em>I'm interested.</em> It'll land here.
                    </p>
                    <Link
                        to="/"
                        data-testid="mylist-browse-link"
                        className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] text-white px-5 py-3 text-[13px] font-medium uppercase tracking-[0.12em] hover:bg-neutral-800 transition-colors font-instr-sans"
                    >
                        Browse the archive
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
