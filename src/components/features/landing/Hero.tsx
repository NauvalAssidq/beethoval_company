"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";

export function Hero() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        const currentRef = sectionRef.current;
        if (currentRef) observer.observe(currentRef);
        
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    const animateIn = cn(
        "transition-all duration-1000 ease-out",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    );

    return (
        <section
            ref={sectionRef}
            className="relative min-h-dvh flex items-center justify-center bg-[#fafafa] pt-32 pb-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#fafafa]">
                <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-10" />

            <div className="max-w-7xl mx-auto z-10 w-full relative">
                <div className="text-center flex flex-col items-center">
                    <h1 className={cn(animateIn, "delay-300 text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gray-900 mb-4 text-center leading-[1.05] tracking-tight")}>
                        <span className="font-sans font-medium">Crafting Digital</span>{" "}
                        <Highlighter action="circle" color="#4f46e5" isView={isInView} className="font-serif italic text-indigo-600">
                            Experiences
                        </Highlighter>
                        {" "}<span className="font-sans">&amp;</span>{" "}
                        <Highlighter action="highlight" color="#4f46e5" isView={isInView} className="font-serif italic">
                            Solutions
                        </Highlighter>
                    </h1>
                   
                    <p className={cn(animateIn, "delay-700 text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl text-center mx-auto leading-relaxed font-medium")}>
                        I build high-performance web applications and clean, professional user interfaces using Next.js, Node.js, and modern CSS architecture.
                    </p>

                    <div className={cn(animateIn, "delay-1000 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center w-full sm:w-auto")}>
                        <a
                            href="#showcase"
                            className="group inline-flex items-center justify-center gap-3 h-[52px] px-8 rounded-full text-base font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200 shadow-none"
                        >
                            <span>View Projects</span>
                            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                        <a
                            href="#contact"
                            className="group inline-flex items-center justify-center gap-3 h-[52px] px-8 rounded-full text-base font-medium text-gray-900 bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-none"
                        >
                            <span>Schedule Call</span>
                            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
