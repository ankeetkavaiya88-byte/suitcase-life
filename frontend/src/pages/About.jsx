import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const GALLERY = [
    {
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
        caption: "Weekend in Lisbon — a long breakfast",
        span: "col-span-12 md:col-span-7 aspect-[16/10]",
    },
    {
        src: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=1400&q=80",
        caption: "A new clock for the hallway",
        span: "col-span-12 md:col-span-5 aspect-[4/5]",
    },
    {
        src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80",
        caption: "The shelf, being rearranged again",
        span: "col-span-12 md:col-span-5 aspect-[4/5]",
    },
    {
        src: "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1400",
        caption: "Mornings in our living room",
        span: "col-span-12 md:col-span-7 aspect-[16/10]",
    },
    {
        src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80",
        caption: "Light is the most collected thing in the house",
        span: "col-span-12 md:col-span-8 aspect-[16/10]",
    },
    {
        src: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
        caption: "A gallery wall in progress",
        span: "col-span-12 md:col-span-4 aspect-[4/5]",
    },
    {
        src: "https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1400",
        caption: "Most decisions happen here",
        span: "col-span-12 md:col-span-6 aspect-[4/5]",
    },
    {
        src: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=1400&q=80",
        caption: "The last light of a Sunday",
        span: "col-span-12 md:col-span-6 aspect-[4/5]",
    },
];

const About = () => {
    return (
        <section
            className="pt-36 md:pt-44 px-6 md:px-12 lg:px-24 max-w-[1500px] mx-auto pb-24 md:pb-40"
            data-testid="about-page"
        >
            {/* Hero */}
            <div className="grid grid-cols-12 gap-8 md:gap-16">
                <div className="col-span-12 md:col-span-5">
                    <div className="meta-label mb-4">
                        [A] <span className="text-neutral-400">/</span> About
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl lg:text-[8rem] leading-[0.92] tracking-[-0.02em]">
                        Two people, a <em className="italic">small</em> shelf.
                    </h1>
                </div>

                <div className="col-span-12 md:col-span-6 md:col-start-7 pt-4 md:pt-12 font-instr-sans">
                    <p className="text-[18px] md:text-[22px] leading-[1.45] text-neutral-800 font-medium">
                        We are{" "}
                        <span className="text-neutral-900">Ankeet &amp; Sruthi.</span>{" "}
                        Somewhere between hoarding and curating lives a word
                        we're more comfortable with: gathering. This is our
                        archive.
                    </p>
                    <p className="mt-6 text-[15px] leading-[1.7] text-neutral-600 max-w-[52ch]">
                        We travel often and we travel slow — a lot of what we
                        bring back is small, sometimes impractical, occasionally
                        expensive, but always a little honest. Objects outlast
                        their packaging. We keep the stories.
                    </p>
                    <p className="mt-4 text-[15px] leading-[1.7] text-neutral-600 max-w-[52ch]">
                        This site is a quiet companion to our Instagram,{" "}
                        <a
                            href="https://instagram.com/suitcaseandlife"
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-4 decoration-neutral-400 hover:decoration-neutral-900 hover:text-neutral-900"
                        >
                            @suitcaseandlife
                        </a>
                        . Each piece has a backstory. Tap <em>I&apos;m interested</em> on
                        anything you like — we'll know which ones strangers on
                        the internet would quietly claim if they could.
                    </p>
                </div>
            </div>

            {/* Gallery — the house & the life */}
            <div className="mt-24 md:mt-36">
                <div className="flex items-end justify-between flex-wrap gap-6 mb-10 md:mb-14">
                    <div>
                        <div className="meta-label mb-4">
                            [A.01] <span className="text-neutral-400">/</span>{" "}
                            House &amp; Life
                        </div>
                        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em]">
                            Where the shelf actually{" "}
                            <em className="italic">lives.</em>
                        </h2>
                    </div>
                    <p className="font-instr-sans text-[14px] leading-[1.6] text-neutral-500 max-w-[34ch]">
                        Glimpses of our home, our travels, and the mess of
                        objects in between — the backdrop to everything on the
                        archive.
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-3 md:gap-4">
                    {GALLERY.map((g, i) => (
                        <figure
                            key={g.src}
                            className={`group relative overflow-hidden rounded-2xl bg-neutral-200 ${g.span}`}
                            data-testid={`about-gallery-${i}`}
                        >
                            <img
                                src={g.src}
                                alt={g.caption}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                            />
                            <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-black/60 via-black/10 to-transparent text-white font-instr-sans text-[12px] md:text-[13px] tracking-wide opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                {g.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>

            {/* Meta grid */}
            <div className="mt-24 md:mt-36 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 border-t border-black/10 pt-10">
                <Meta label="Based in" value="Mumbai, India" />
                <Meta label="Started" value="2026" />
                <Meta label="Updated" value="Weekly" />
                <Meta label="Curators" value="Ankeet · Sruthi" />
            </div>

            {/* CTA */}
            <div className="mt-20 md:mt-28 grid grid-cols-12 gap-8 items-end">
                <div className="col-span-12 md:col-span-8">
                    <div className="meta-label mb-4">Get in touch</div>
                    <div className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
                        If a piece catches your eye and you want{" "}
                        <em className="italic">one</em> for yourself — or simply
                        want to say hello — write to us.
                    </div>
                </div>
                <div className="col-span-12 md:col-span-4 flex flex-col items-start md:items-end gap-3">
                    <a
                        href="https://instagram.com/suitcaseandlife"
                        target="_blank"
                        rel="noreferrer"
                        data-testid="about-ig-link"
                        className="inline-flex items-center gap-2 font-instr-sans text-[15px] font-medium underline underline-offset-[6px] decoration-black/30 hover:decoration-black"
                    >
                        DM on Instagram <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <Link
                        to="/"
                        data-testid="about-home-link"
                        className="inline-flex items-center gap-2 font-instr-sans text-[14px] text-neutral-500 hover:text-neutral-900"
                    >
                        ← Back to the archive
                    </Link>
                </div>
            </div>
        </section>
    );
};

const Meta = ({ label, value }) => (
    <div>
        <div className="meta-label mb-2">{label}</div>
        <div className="font-display text-xl md:text-2xl leading-none">
            {value}
        </div>
    </div>
);

export default About;
