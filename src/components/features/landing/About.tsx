"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function About() {
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
      className="relative bg-[#fafafa] py-32 md:py-40 lg:py-52 overflow-hidden"
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center gap-4 mb-16 md:mb-20 transition-all duration-1000 ease-out",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <div className="h-px w-10 bg-indigo-600" />
          <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-[0.2em]">
            Philosophy
          </span>
        </div>

        <h2
          className={cn(
            "font-serif text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] text-gray-900 tracking-tight leading-[1.35] mb-20 md:mb-28 transition-all duration-1000 ease-out delay-200",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          Technology shouldn&apos;t be a barrier; it should be an{" "}
          <span className="italic text-indigo-600">equalizer</span>. Great
          digital products are no longer just about complex code, but about{" "}
          <span className="italic">clarity</span>,{" "}
          <span className="italic">purpose</span>, and{" "}
          <span className="italic">seamless experiences</span>.
        </h2>

        <div
          className={cn(
            "max-w-2xl ml-auto transition-all duration-1000 ease-out delay-[500ms]",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-[15px] sm:text-base md:text-[17px] text-gray-500 leading-[1.9]">
            In a cluttered digital landscape filled with bloated software and
            unnecessary noise, Beethoval helps startups and small industries
            penetrate the tech world with clean, purposeful design and solid
            engineering. We build digital experiences stripped of the
            excess—delivering intuitive, flat interfaces and robust full-stack
            solutions that don&apos;t just function, but genuinely empower your
            business to stand out and thrive.
          </p>

          <div
            className={cn(
              "mt-10 flex items-center gap-5 transition-all duration-1000 ease-out delay-[700ms]",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]">
              Banda Aceh, Indonesia
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
