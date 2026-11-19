"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarqueeItem, HeroData } from "@/lib/landing-data";
import { useReveal } from "@/hooks/useReveal";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { resolveTranslation } from "@/types/i18n";

interface HeroProps {
  marqueeItems?: MarqueeItem[];
  heroData?: HeroData;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=350&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=350&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=350&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&h=350&q=80",
];

export function Hero({ marqueeItems, heroData }: HeroProps) {
  const { ref: sectionRef, visible: isInView } = useReveal(0.1) as { ref: React.RefObject<HTMLElement | null>, visible: boolean };
  const locale = useLocale() as "en" | "id";
  const t = useTranslations("Hero");

  useEffect(() => {
    try {
      const key = "beethoval_db_warmed_at";
      const last = Number(localStorage.getItem(key) || "0");
      const now = Date.now();
      if (!last || now - last > 15 * 60 * 1000) {
        localStorage.setItem(key, String(now));
        fetch("/api/health").catch(() => {});
      }
    } catch {
      fetch("/api/health").catch(() => {});
    }
  }, []);

  const data = heroData || {
    line1: "Crafting Digital",
    highlightWord1: "Experiences",
    highlightAction1: "circle",
    separator: "&",
    highlightWord2: "Solutions",
    highlightAction2: "highlight",
    line3: "For Your Business",
    subtitle: "High-performance web applications on hand, with professional grade interface"
  };

  const resolvedUrls =
    marqueeItems && marqueeItems.length > 0
      ? marqueeItems.map((m) => m.url)
      : FALLBACK_IMAGES;

  const animateIn = cn(
    "transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-dvh md:h-dvh flex flex-col bg-white overflow-hidden border-b border-gray-100"
    >
      <div className="md:flex-1 w-full max-w-9xl mx-auto mb-2 md:mb-6 lg:mb-8 z-10 relative flex flex-col justify-start md:justify-end px-4 sm:px-6 lg:px-8 pt-[156px] pb-8 md:pt-20 md:pb-12">
        <div className="text-left flex flex-col items-start">
          <h1 className={cn(animateIn, "delay-300 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-4 text-left leading-[1.05] tracking-tight")}>
            <span className="font-sans font-regular">{resolveTranslation(data.line1, locale) || "Crafting Digital"}</span>
            {" "}</h1>
          <h1 className={cn(animateIn, "delay-300 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-4 text-left leading-[1.05] tracking-tight")}>
            {" "}
            <Highlighter action={data.highlightAction1 as any} color="#4f46e5" isView={isInView} className={cn("font-serif italic", data.highlightAction1 === "circle" ? "text-indigo-600" : "")}>
              {resolveTranslation(data.highlightWord1, locale) || "Experiences"}
            </Highlighter>
            {" "}<span className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl">{resolveTranslation(data.separator, locale) || "&"}</span>{" "}
            <Highlighter action={data.highlightAction2 as any} color="#4f46e5" isView={isInView} className={cn("font-serif italic", data.highlightAction2 === "circle" ? "text-indigo-600" : "")}>
              {resolveTranslation(data.highlightWord2, locale) || "Solutions"}
            </Highlighter>
          </h1>
          <h1 className={cn(animateIn, "delay-300 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 text-left leading-[1.05] tracking-tight")}>
            <span className="font-sans font-regular">{resolveTranslation(data.line3, locale) || "For Your Business"}</span>
          </h1>

          <p className={cn(animateIn, "delay-700 text-sm sm:text-sm md:text-md lg:text-lg text-gray-500 underline mb-0 max-w-3xl text-left leading-relaxed font-medium")}>
            {resolveTranslation(data.subtitle, locale) || "High-performance web applications on hand, with professional grade interface"}
          </p>
        </div>
      </div>

      <div className={cn(animateIn, "delay-1000 w-full z-10 relative mt-auto pb-8 md:pb-12 overflow-hidden flex")}>
        <div className="flex w-max animate-marquee gap-6 md:gap-8 pr-6 md:pr-8">
          {Array.from({ length: Math.max(2, Math.ceil(8 / resolvedUrls.length)) })
            .flatMap(() => resolvedUrls)
            .map((src, i) => (
              <div key={i} className="relative w-[312px] h-[312px] sm:w-[384px] sm:h-[384px] md:w-[456px] md:h-[456px] shrink-0 overflow-hidden">
                <Image src={src} fill sizes="(max-width: 640px) 312px, (max-width: 768px) 384px, 456px" className="object-contain object-bottom" alt={t("portfolio_showcase")} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
