"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";
import { Skeleton } from "@/components/ui/skeleton";

export function Hero() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [isInView, setIsInView] = useState(false);

    const fallbackImages = [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=350&q=80",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=350&q=80",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=350&q=80",
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&h=350&q=80",
    ];
    
    const [marqueeImages, setMarqueeImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch("/api/public/projects");
                if (res.ok) {
                    const data = await res.json();
                    const urls = data.map((p: any) => p.url).filter(Boolean);
                    if (urls.length > 0) {
                        setMarqueeImages(urls);
                    } else {
                        setMarqueeImages(fallbackImages);
                    }
                } else {
                    setMarqueeImages(fallbackImages);
                }
            } catch (err) {
                console.error("Failed to load marquee images:", err);
                setMarqueeImages(fallbackImages);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

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
            className="relative h-dvh flex flex-col bg-white overflow-hidden border-b border-gray-100"
        >
            <div className="flex-1 w-full max-w-9xl mx-auto z-10 relative flex flex-col justify-end px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <div className="text-left flex flex-col items-start">
                    <h1 className={cn(animateIn, "delay-300 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 text-left leading-[1.05] tracking-tight")}>
                        <span className="font-sans font-regular">Crafting Digital</span>
                    </h1>
                    <h1 className={cn(animateIn, "delay-300 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-4 text-left leading-[1.05] tracking-tight")}>
                        {" "}
                        <Highlighter action="circle" color="#4f46e5" isView={isInView} className="font-serif italic text-indigo-600">
                            Experiences
                        </Highlighter>
                        {" "}<span className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl">&amp;</span>{" "}
                        <Highlighter action="highlight" color="#4f46e5" isView={isInView} className="font-serif italic">
                            Solutions
                        </Highlighter>
                    </h1>
                    <h1 className={cn(animateIn, "delay-300 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 text-left leading-[1.05] tracking-tight")}>
                        <span className="font-sans font-regular">For Your Business</span>
                    </h1>
                   
                    <p className={cn(animateIn, "delay-700 text-sm sm:text-sm md:text-md lg:text-lg text-gray-400 mb-0 max-w-3xl text-left leading-relaxed font-medium")}>
                        High-performance web applications on hand, with professional grade interface
                    </p>
                </div>
            </div>

            <div className={cn(animateIn, "delay-1000 w-full z-10 relative mt-auto pb-12 overflow-hidden flex")}>
                <div className="flex w-max animate-marquee gap-8 pr-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={`skel-${i}`} className="w-[450px] h-[450px] md:w-[500px] md:h-[500px] shrink-0 overflow-hidden">
                                <Skeleton className="w-full h-full rounded-none bg-gray-200/50" />
                            </div>
                        ))
                    ) : (
                        Array.from({ length: Math.max(2, Math.ceil(8 / marqueeImages.length)) })
                            .flatMap(() => marqueeImages)
                            .map((src, i) => (
                            <div key={i} className="w-[450px] h-[450px] md:w-[500px] md:h-[500px] shrink-0 overflow-hidden">
                                <img src={src} className="w-full h-full object-contain object-bottom" alt="Portfolio showcase" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
