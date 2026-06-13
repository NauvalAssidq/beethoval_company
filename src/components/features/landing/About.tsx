"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { AboutData } from "@/lib/landing-data";
import { useLocale } from "next-intl";
import { resolveTranslation } from "@/types/i18n";

export function About({ aboutData }: { aboutData?: AboutData | null }) {
  const locale = useLocale() as "en" | "id";
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-[#fafafa] border-b border-gray-100 h-dvh flex flex-col justify-center overflow-hidden"
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div
          className={cn(
            "flex items-center justify-center gap-4 mb-12 md:mb-16 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
        </div>

        <h2
          className={cn(
            "text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] text-gray-900 tracking-tight leading-[1.35] mb-16 md:mb-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] delay-200 font-sans [&_em]:font-serif [&_em]:italic [&_em]:text-indigo-600 [&_i]:font-serif [&_i]:italic [&_i]:text-indigo-600",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          dangerouslySetInnerHTML={{
            __html: resolveTranslation(aboutData?.heading, locale) || "Technology shouldn't be a barrier; it should be an <em>equalizer</em>.<br class=\"hidden md:block\"/>Great digital products are no longer just about complex code, but about <em>clarity</em>, <em>purpose</em>, and <em>seamless experiences</em>."
          }}
        />

        <div
          className={cn(
            "max-w-2xl mx-auto transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] delay-[500ms]",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-[15px] sm:text-base md:text-[17px] text-gray-500 leading-[1.9] whitespace-pre-wrap">
            {resolveTranslation(aboutData?.description, locale) || "In a cluttered digital landscape filled with bloated software and unnecessary noise, Beethoval helps startups and small industries penetrate the tech world with clean, purposeful design and solid engineering. We build digital experiences stripped of the excess—delivering intuitive, flat interfaces and robust full-stack solutions that don't just function, but genuinely empower your business to stand out and thrive."}
          </p>

          <div
            className={cn(
              "mt-10 flex items-center justify-center gap-5 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] delay-[700ms]",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]">
              {resolveTranslation(aboutData?.location, locale) || "Banda Aceh, Indonesia"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
