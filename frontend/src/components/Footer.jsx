import React from "react";
import { ArrowUpRight } from "lucide-react";

const Footer = () => {
    return (
        <footer
            className="border-t border-black/[0.08] bg-[#0A0A0A] text-white overflow-hidden"
            data-testid="site-footer"
        >
            <div className="max-w-[1500px] mx-auto px-5 md:px-12 lg:px-24 py-14 md:py-24 grid grid-cols-12 gap-8 md:gap-10">
                <div className="col-span-12 md:col-span-8">
                    <div className="meta-label !text-white/50 mb-4 md:mb-5">
                        Colophon
                    </div>
                    <p className="font-display text-2xl sm:text-3xl md:text-5xl leading-[1.1] md:leading-[1.05] [text-wrap:balance]">
                        A small archive of gathered curiosities — kept honest by
                        two people and a{" "}
                        <em className="italic text-white/70">spreadsheet.</em>
                    </p>
                </div>
                <div className="col-span-12 md:col-span-4 flex flex-col justify-end gap-4 md:gap-5">
                    <a
                        href="https://instagram.com/suitcaseandlife"
                        target="_blank"
                        rel="noreferrer"
                        data-testid="footer-instagram"
                        className="inline-flex items-center justify-between border-b border-white/15 pb-3 hover:border-white/60 transition-colors gap-3"
                    >
                        <span className="font-display text-lg md:text-xl truncate">
                            @suitcaseandlife
                        </span>
                        <ArrowUpRight className="w-4 h-4 shrink-0" />
                    </a>
                    <div className="text-[11px] md:text-xs text-white/50 font-instr-sans leading-relaxed">
                        © {new Date().getFullYear()} Ankeet &amp; Sruthi —
                        made with patience.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
