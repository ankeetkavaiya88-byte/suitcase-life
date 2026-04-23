import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const useNow = () => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(id);
    }, []);
    return now;
};

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const now = useNow();
    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", on, { passive: true });
        on();
        return () => window.removeEventListener("scroll", on);
    }, []);

    const timeStr = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
    });

    return (
        <header
            data-testid="site-header"
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                scrolled
                    ? "backdrop-blur-xl bg-[#F7F7F7]/80 border-b border-black/[0.06]"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-4 md:py-5 grid grid-cols-12 items-center gap-4">
                {/* Brand */}
                <div className="col-span-6 md:col-span-3">
                    <a
                        href="#top"
                        data-testid="brand-link"
                        className="font-display text-[22px] md:text-[26px] leading-none tracking-tight inline-flex items-baseline gap-0.5"
                    >
                        Suitcase <em className="italic text-neutral-500">&amp;</em> Life
                        <sup className="font-instr-sans text-[10px] font-medium text-neutral-500 tracking-normal ml-1 -translate-y-2">
                            ®
                        </sup>
                    </a>
                </div>

                {/* Tiny meta (centre, Momentum style) */}
                <div className="hidden md:flex col-span-3 flex-col items-start">
                    <div className="meta-label text-neutral-500">
                        Mumbai, India
                    </div>
                    <div className="meta-label text-neutral-500 mt-1">
                        {timeStr} IST
                    </div>
                </div>

                {/* Pill nav — FABMAG inspired */}
                <nav
                    className="hidden md:flex col-span-4 items-center justify-end gap-2"
                    aria-label="Primary"
                >
                    <a href="#featured" data-testid="nav-featured" className="pill">
                        Favourites
                    </a>
                    <a href="#archive" data-testid="nav-archive" className="pill">
                        Archive
                    </a>
                    <a
                        href="https://instagram.com/suitcaseandlife"
                        target="_blank"
                        rel="noreferrer"
                        data-testid="nav-instagram"
                        className="pill"
                    >
                        Instagram
                    </a>
                </nav>

                {/* CTA */}
                <div className="col-span-6 md:col-span-2 flex justify-end">
                    <a
                        href="#archive"
                        data-testid="header-cta"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0A0A] text-white px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] hover:bg-neutral-800 transition-colors font-instr-sans"
                    >
                        Enter
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
