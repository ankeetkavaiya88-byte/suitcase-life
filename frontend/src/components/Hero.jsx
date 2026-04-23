import React from "react";
import { ArrowDown } from "lucide-react";

const tickerWords = [
    "Objects",
    "Clocks",
    "Chairs",
    "Cameras",
    "Scents",
    "Ceramics",
    "Suitcases",
    "Lamps",
    "Books",
    "Things we love",
];

const Hero = ({ total }) => {
    return (
        <section
            className="relative pt-28 md:pt-32 lg:pt-40 pb-10 md:pb-16 px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto"
            data-testid="hero-section"
        >
            <div className="grid grid-cols-12 gap-6 items-end">
                <div className="col-span-12 md:col-span-3 order-2 md:order-1">
                    <div className="meta-label mb-3">
                        001 — Overview
                    </div>
                    <p className="text-sm md:text-[15px] leading-relaxed text-neutral-700 max-w-[26ch]">
                        We are <span className="text-neutral-900 font-medium">Ankeet & Sruthi.</span>{" "}
                        We love to collect things. This is a sneak peek into our small archive of gathered
                        curiosities.
                    </p>
                    <a
                        href="#archive"
                        data-testid="hero-scroll-cta"
                        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:gap-3 transition-all"
                    >
                        <ArrowDown className="w-4 h-4" />
                        Scroll the shelf
                    </a>
                </div>

                <div className="col-span-12 md:col-span-9 order-1 md:order-2">
                    <h1 className="font-display text-[16vw] md:text-[11vw] lg:text-[9.2rem] xl:text-[11rem] leading-[0.88] tracking-[-0.02em]">
                        Suitcase{" "}
                        <em className="italic text-neutral-500">&amp;</em> Life
                    </h1>
                </div>
            </div>

            <div className="mt-10 md:mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-black/10 pt-6">
                <div className="flex gap-8 md:gap-14">
                    <div>
                        <div className="meta-label mb-1">Archive</div>
                        <div className="font-display text-2xl">
                            {total ?? "—"} pieces
                        </div>
                    </div>
                    <div>
                        <div className="meta-label mb-1">Curators</div>
                        <div className="font-display text-2xl">
                            Ankeet · Sruthi
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <div className="meta-label mb-1">Origin</div>
                        <div className="font-display text-2xl">@suitcaseandlife</div>
                    </div>
                </div>
                <div className="meta-label">
                    Updated weekly — latest first
                </div>
            </div>

            {/* Silent marquee ticker */}
            <div className="mt-12 md:mt-16 relative overflow-hidden select-none">
                <div className="flex whitespace-nowrap sl-marquee">
                    {[...tickerWords, ...tickerWords, ...tickerWords].map((w, i) => (
                        <span
                            key={i}
                            className="font-display text-[38px] md:text-[64px] leading-none px-6 text-neutral-900/90 flex items-center gap-6"
                        >
                            {w}
                            <span className="inline-block w-2 h-2 rounded-full bg-neutral-900" />
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
