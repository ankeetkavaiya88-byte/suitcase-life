import React from "react";
import { ArrowDown } from "lucide-react";

const HERO_IMG =
    "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=2400&q=85";

const Hero = ({ total }) => {
    return (
        <section
            id="hero"
            data-testid="hero-section"
            className="relative w-full h-screen min-h-[640px] overflow-hidden bg-neutral-900"
        >
            {/* Background image with breathing blur */}
            <div
                aria-hidden
                className="absolute inset-0 will-change-transform hero-breathe"
                style={{
                    backgroundImage: `url('${HERO_IMG}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Readability scrim */}
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/60"
            />

            <img
                src={HERO_IMG}
                alt=""
                aria-hidden
                className="sr-only"
                fetchpriority="high"
            />

            {/* Content */}
            <div className="relative h-full max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 pt-28 md:pt-32 pb-10 md:pb-12 flex flex-col justify-end text-white">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
                    <h1 className="font-display text-[18vw] md:text-[13vw] lg:text-[11rem] xl:text-[13rem] leading-[0.88] tracking-[-0.025em] max-w-[12ch]">
                        Suitcase
                        <br />
                        <em className="italic text-white/70">&amp;</em> Life
                        <sup className="font-instr-sans text-[12px] md:text-[14px] font-medium text-white/70 tracking-normal ml-2 -translate-y-8 md:-translate-y-12 lg:-translate-y-16 inline-block">
                            ®
                        </sup>
                    </h1>

                    {/* Description — right aligned, max 2 lines */}
                    <div className="md:self-end md:text-right font-instr-sans md:max-w-[560px]">
                        <p className="text-[16px] md:text-[17px] leading-[1.5] text-white/95 md:whitespace-normal">
                            We are{" "}
                            <span className="text-white font-semibold">
                                Ankeet &amp; Sruthi.
                            </span>{" "}
                            We love to collect things — a sneak peek into our small archive of curiosities.
                        </p>
                        <div className="mt-5 flex md:justify-end items-center gap-3">
                            <div className="meta-label !text-white/70">
                                {total ?? "—"} pieces
                            </div>
                            <span className="w-1 h-1 rounded-full bg-white/40" />
                            <div className="meta-label !text-white/70">
                                Updated weekly
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom row — only View curation now */}
                <div className="mt-10 md:mt-14 flex items-end justify-end">
                    <a
                        href="#archive"
                        data-testid="hero-scroll-cta"
                        onClick={(e) => {
                            e.preventDefault();
                            document
                                .getElementById("archive")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-3 group"
                    >
                        <span className="meta-label !text-white/80 group-hover:!text-white">
                            View curation
                        </span>
                        <span className="w-10 h-10 rounded-full border border-white/30 grid place-items-center group-hover:bg-white group-hover:text-black transition-colors">
                            <ArrowDown className="w-4 h-4" />
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
