import React, { useEffect, useState } from "react";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", on, { passive: true });
        on();
        return () => window.removeEventListener("scroll", on);
    }, []);

    return (
        <header
            data-testid="site-header"
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                scrolled
                    ? "backdrop-blur-xl bg-white/75 border-b border-black/[0.06]"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between">
                <a
                    href="#top"
                    data-testid="brand-link"
                    className="font-display text-2xl md:text-[26px] leading-none tracking-tight"
                >
                    Suitcase <em className="italic text-neutral-500">&amp;</em> Life
                </a>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-700">
                    <a
                        href="#featured"
                        data-testid="nav-featured"
                        className="hover:text-neutral-900 transition-colors"
                    >
                        Favourites
                    </a>
                    <a
                        href="#archive"
                        data-testid="nav-archive"
                        className="hover:text-neutral-900 transition-colors"
                    >
                        Archive
                    </a>
                    <a
                        href="https://instagram.com/suitcaseandlife"
                        target="_blank"
                        rel="noreferrer"
                        data-testid="nav-instagram"
                        className="hover:text-neutral-900 transition-colors"
                    >
                        Instagram
                    </a>
                </nav>
                <a
                    href="#archive"
                    data-testid="header-cta"
                    className="text-xs font-medium uppercase tracking-[0.14em] bg-[#0A0A0A] text-white rounded-full px-4 py-2.5 hover:bg-neutral-800 transition-colors"
                >
                    Enter archive
                </a>
            </div>
        </header>
    );
};

export default Header;
