import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";

const useNow = () => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(id);
    }, []);
    return now;
};

const NAV = [
    { to: "/", label: "Home" },
    { to: "/my-list", label: "My list" },
    { to: "/about", label: "About" },
];

const BrandMark = ({ tone }) => (
    <span className="font-modern text-[20px] md:text-[24px] leading-none tracking-[-0.035em] inline-flex items-baseline gap-1.5">
        Suitcase
        <em
            className={`font-display italic font-normal not-italic-as text-[22px] md:text-[26px] tracking-normal -translate-y-[1px] ${
                tone === "dark" ? "text-white/70" : "text-neutral-500"
            }`}
            style={{ fontStyle: "italic" }}
        >
            &amp;
        </em>
        Life
        <sup
            className={`text-[10px] font-medium tracking-normal -translate-y-2 ml-0.5 ${
                tone === "dark" ? "text-white/60" : "text-neutral-500"
            }`}
        >
            ®
        </sup>
    </span>
);

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const now = useNow();
    const isHome = location.pathname === "/";

    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", on, { passive: true });
        on();
        return () => window.removeEventListener("scroll", on);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [menuOpen]);

    const onDark = isHome && !scrolled && !menuOpen;

    const timeStr = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
    });

    return (
        <>
            <header
                data-testid="site-header"
                className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${
                    menuOpen
                        ? "bg-[#0A0A0A] text-white"
                        : scrolled
                          ? "backdrop-blur-xl bg-[#F7F7F7]/85 border-b border-black/[0.06] text-neutral-900"
                          : onDark
                            ? "bg-transparent text-white"
                            : "bg-[#F7F7F7] text-neutral-900"
                }`}
            >
                <div className="max-w-[1500px] mx-auto px-5 md:px-12 lg:px-20 py-4 md:py-5 grid grid-cols-12 items-center gap-4">
                    {/* Brand + time */}
                    <div className="col-span-8 md:col-span-4 flex items-end gap-5">
                        <Link
                            to="/"
                            data-testid="brand-link"
                            className="inline-flex items-baseline"
                        >
                            <BrandMark tone={onDark || menuOpen ? "dark" : "light"} />
                        </Link>
                        <div
                            className={`hidden lg:flex flex-col meta-label ${
                                onDark || menuOpen ? "!text-white/70" : "!text-neutral-500"
                            }`}
                        >
                            <span>Bangalore, IN</span>
                            <span className="mt-1">© 26 — {timeStr}</span>
                        </div>
                    </div>

                    <nav
                        className="hidden md:flex col-span-5 items-center justify-center gap-8 lg:gap-10 font-instr-sans text-[14px] font-medium"
                        aria-label="Primary"
                    >
                        {NAV.map((item) => (
                            <WordLink
                                key={item.to}
                                to={item.to}
                                label={item.label}
                                onDark={onDark}
                                testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "")}`}
                            />
                        ))}
                    </nav>

                    <div className="col-span-4 md:col-span-3 flex justify-end items-center">
                        <a
                            href="https://instagram.com/suitcaseandlife"
                            target="_blank"
                            rel="noreferrer"
                            data-testid="header-cta"
                            className={`hidden md:inline-flex items-center gap-1.5 font-instr-sans text-[14px] font-medium underline underline-offset-[6px] decoration-[1.5px] transition-colors ${
                                onDark
                                    ? "decoration-white/40 hover:decoration-white"
                                    : "decoration-black/30 hover:decoration-black"
                            }`}
                        >
                            Instagram
                            <ArrowUpRight className="w-4 h-4" />
                        </a>

                        <button
                            type="button"
                            data-testid="mobile-menu-toggle"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            onClick={() => setMenuOpen((v) => !v)}
                            className="md:hidden w-10 h-10 -mr-2 grid place-items-center"
                        >
                            {menuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div
                data-testid="mobile-menu-panel"
                className={`fixed inset-0 z-[65] bg-[#0A0A0A] text-white md:hidden transition-opacity duration-300 ${
                    menuOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                <div className="h-full flex flex-col pt-24 px-6 pb-10">
                    <nav
                        className="flex-1 flex flex-col justify-center gap-2"
                        aria-label="Mobile primary"
                    >
                        {NAV.map((item, i) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === "/"}
                                onClick={() => setMenuOpen(false)}
                                data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "")}`}
                                className={({ isActive }) =>
                                    `font-modern text-[14vw] leading-[1] tracking-[-0.04em] transition-opacity ${
                                        isActive ? "text-white" : "text-white/60"
                                    }`
                                }
                                style={{
                                    transitionDelay: `${menuOpen ? i * 60 : 0}ms`,
                                }}
                            >
                                {item.label}
                                {item.to === location.pathname && (
                                    <span className="inline-block w-3 h-3 rounded-full bg-white ml-3 align-middle" />
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex items-end justify-between border-t border-white/10 pt-6">
                        <div>
                            <div className="meta-label !text-white/50 mb-2">
                                Follow
                            </div>
                            <a
                                href="https://instagram.com/suitcaseandlife"
                                target="_blank"
                                rel="noreferrer"
                                data-testid="mobile-instagram"
                                className="inline-flex items-center gap-2 font-display text-2xl"
                            >
                                @suitcaseandlife
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="text-right">
                            <div className="meta-label !text-white/50 mb-2">
                                Bangalore
                            </div>
                            <div className="font-instr-sans text-sm">
                                © 26 — {timeStr}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
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
