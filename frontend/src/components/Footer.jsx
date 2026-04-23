import React from "react";
import { ArrowUpRight } from "lucide-react";

const Footer = () => {
    return (
        <footer
            className="border-t border-black/[0.08] bg-[#0A0A0A] text-white"
            data-testid="site-footer"
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24 grid grid-cols-12 gap-10">
                <div className="col-span-12 md:col-span-8">
                    <div className="meta-label !text-white/50 mb-5">
                        Colophon
                    </div>
                    <p className="font-display text-3xl md:text-5xl leading-[1.05]">
                        A small archive of gathered curiosities — kept honest by two people and a{" "}
                        <em className="italic text-white/70">spreadsheet.</em>
                    </p>
                </div>
                <div className="col-span-12 md:col-span-4 flex flex-col justify-end gap-5">
                    <a
                        href="https://instagram.com/suitcaseandlife"
                        target="_blank"
                        rel="noreferrer"
                        data-testid="footer-instagram"
                        className="inline-flex items-center justify-between border-b border-white/15 pb-3 hover:border-white/60 transition-colors"
                    >
                        <span className="font-display text-xl">@suitcaseandlife</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <div className="text-xs text-white/50 font-sans-ui">
                        © {new Date().getFullYear()} Ankeet & Sruthi — made with patience.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
