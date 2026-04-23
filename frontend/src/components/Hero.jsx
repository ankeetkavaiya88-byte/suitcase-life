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
            className="relative pt-28 md:pt-36 lg:pt-40 pb-10 md:pb-16 px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto"
            data-testid="hero-section"
        >
            {/* Decorative 12-column grid lines (Momentum-inspired) */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid-lines opacity-70"
            />

            <div className="relative grid grid-cols-12 gap-6 items-end">
                <div className="col-span-12 md:col-span-3 order-2 md:order-1">
                    <div className="meta-label mb-4">
                        [001] <span className="text-neutral-400">/</span> Overview
                    </div>
                    <p className="font-instr-sans text-[15px] md:text-[15.5px] leading-[1.55] text-neutral-700 max-w-[28ch]">
                        We are{" "}
                        <span className="text-neutral-900 font-medium">
                            Ankeet &amp; Sruthi.
                        </span>{" "}
                        We love to collect things. This is a sneak peek into our
                        small archive of gathered curiosities.
                    </p>
                    <a
                        href="#archive"
                        data-testid="hero-scroll-cta"
                        className="mt-8 inline-flex items-center gap-2 text-[13px] font-medium text-neutral-900 group font-instr-sans"
                    >
                        <span className="w-9 h-9 rounded-full border border-black/15 grid place-items-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors">
                            <ArrowDown className="w-3.5 h-3.5" />
                        </span>
                        Scroll the shelf
                    </a>
                </div>

                <div className="col-span-12 md:col-span-9 order-1 md:order-2">
                    <h1 className="font-display text-[16vw] md:text-[11vw] lg:text-[9.2rem] xl:text-[11rem] leading-[0.86] tracking-[-0.025em]">
                        Suitcase{" "}
                        <em className="italic text-neutral-500">&amp;</em> Life
                        <sup className="font-instr-sans text-[12px] md:text-[14px] font-medium text-neutral-500 tracking-normal align-top ml-1 md:ml-2 -translate-y-2 inline-block">
                            ®
                        </sup>
                    </h1>
                </div>
            </div>

            {/* Meta strip */}
            <div className="relative mt-10 md:mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-black/10 pt-6">
                <div className="flex gap-8 md:gap-16">
                    <MetaBlock label="Archive" value={`${total ?? "—"} pieces`} />
                    <MetaBlock label="Curators" value="Ankeet · Sruthi" />
                    <MetaBlock
                        label="Origin"
                        value="@suitcaseandlife"
                        hideOnMobile
                    />
                </div>
                <div className="meta-label text-neutral-500">
                    © 2026 — Updated weekly
                </div>
            </div>

            {/* Silent marquee ticker */}
            <div className="relative mt-12 md:mt-16 overflow-hidden select-none">
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

const MetaBlock = ({ label, value, hideOnMobile }) => (
    <div className={hideOnMobile ? "hidden sm:block" : ""}>
        <div className="meta-label mb-2">{label}</div>
        <div className="font-display text-xl md:text-2xl leading-none">{value}</div>
    </div>
);

export default Hero;
