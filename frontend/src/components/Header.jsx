import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
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
    const location = useLocation();
    const now = useNow();
    const isHome = location.pathname === "/";

    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", on, { passive: true });
        on();
        return () => window.removeEventListener("scroll", on);
    }, []);

    // On home hero we want white text; after scrolling or non-home routes switch to dark
    const onDark = isHome && !scrolled;

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
                    ? "backdrop-blur-xl bg-[#F7F7F7]/85 border-b border-black/[0.06]"
                    : onDark
                      ? "bg-transparent"
                      : "bg-[#F7F7F7]"
            } ${onDark ? "text-white" : "text-neutral-900"}`}
        >
            <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 py-4 md:py-5 grid grid-cols-12 items-center gap-4">
                {/* Brand + time */}
                <div className="col-span-6 md:col-span-4 flex items-end gap-5">
                    <Link
                        to="/"
                        data-testid="brand-link"
                        className="font-display text-[22px] md:text-[26px] leading-none tracking-tight inline-flex items-baseline gap-0.5"
                    >
                        Suitcase{" "}
                        <em className={`italic ${onDark ? "text-white/60" : "text-neutral-500"}`}>
                            &amp;
                        </em>{" "}
                        Life
                        <sup
                            className={`font-instr-sans text-[10px] font-medium tracking-normal ml-1 -translate-y-2 ${
                                onDark ? "text-white/60" : "text-neutral-500"
                            }`}
                        >
                            ®
                        </sup>
                    </Link>
                    <div
                        className={`hidden lg:flex flex-col meta-label ${
                            onDark ? "!text-white/70" : "!text-neutral-500"
                        }`}
                    >
                        <span>Mumbai, IN</span>
                        <span className="mt-1">© 26 — {timeStr}</span>
                    </div>
                </div>

                {/* Word nav — centered, plain words */}
                <nav
                    className="hidden md:flex col-span-5 items-center justify-center gap-8 lg:gap-10 font-instr-sans text-[14px] font-medium"
                    aria-label="Primary"
                >
                    <WordLink to="/" label="Home" testid="nav-home" onDark={onDark} />
                    <WordLink
                        to="/my-list"
                        label="My list"
                        testid="nav-mylist"
                        onDark={onDark}
                    />
                    <WordLink
                        to="/about"
                        label="About"
                        testid="nav-about"
                        onDark={onDark}
                    />
                </nav>

                {/* Instagram link right */}
                <div className="col-span-6 md:col-span-3 flex justify-end">
                    <a
                        href="https://instagram.com/suitcaseandlife"
                        target="_blank"
                        rel="noreferrer"
                        data-testid="header-cta"
                        className={`inline-flex items-center gap-1.5 font-instr-sans text-[14px] font-medium underline underline-offset-[6px] decoration-[1.5px] transition-colors ${
                            onDark
                                ? "decoration-white/40 hover:decoration-white"
                                : "decoration-black/30 hover:decoration-black"
                        }`}
                    >
                        Instagram
                        <ArrowUpRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </header>
    );
};

const WordLink = ({ to, label, testid, onDark }) => (
    <NavLink
        to={to}
        end={to === "/"}
        data-testid={testid}
        className={({ isActive }) =>
            `relative py-1 transition-opacity ${
                onDark
                    ? isActive
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                    : isActive
                      ? "text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900"
            }`
        }
    >
        {({ isActive }) => (
            <>
                {label}
                <span
                    className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] transition-all origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0"
                    } ${onDark ? "bg-white" : "bg-neutral-900"}`}
                />
            </>
        )}
    </NavLink>
);

export default Header;
