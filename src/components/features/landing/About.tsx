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
      { threshold: 0.1 }
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
      className="relative bg-[#fafafa] py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div
          className={cn(
            "transition-all duration-1000 ease-out",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-[13px] font-medium text-indigo-600 tracking-widest uppercase mb-4">
            Philosophy
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight leading-[1.05]">
              About
            </h2>
            <p className="text-[14px] text-gray-400 font-medium max-w-sm leading-relaxed md:text-right pb-2">
              Our approach to building digital
              <br className="hidden md:block" /> products that truly matter.
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full mb-16 md:mb-20" />

      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div
            className={cn(
              "lg:col-span-5 transition-all duration-1000 ease-out delay-200",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-gray-900 tracking-tight leading-[1.15]">
              Technology should be an{" "}
              <span className="text-indigo-600 not-italic font-semibold">equalizer</span>,{" "}
              not a barrier.
            </h2>
          </div>

          <div className="lg:col-span-1 relative hidden lg:flex justify-center">
            <div className="w-px h-full bg-gray-200" />
          </div>

          <div className="lg:col-span-6">
            <div
              className={cn(
                "transition-all duration-1000 ease-out delay-[400ms]",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <p className="text-[15px] sm:text-base md:text-lg text-gray-500 leading-[1.85] font-medium mb-8">
                Technology shouldn&apos;t be a barrier; it should be an equalizer. Great digital
                products are no longer just about complex code, but about clarity, purpose, and
                seamless experiences.
              </p>
            </div>

            <div
              className={cn(
                "transition-all duration-1000 ease-out delay-[600ms]",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <p className="text-[15px] sm:text-base md:text-lg text-gray-400 leading-[1.85]">
                In a cluttered digital landscape filled with bloated software and unnecessary noise,
                Beethoval helps startups and small industries penetrate the tech world with clean,
                purposeful design and solid engineering. We build digital experiences stripped of the
                excess—delivering intuitive, flat interfaces and robust full-stack solutions that
                don&apos;t just function, but genuinely empower your business to stand out and thrive.
              </p>
            </div>

            <div
              className={cn(
                "mt-12 flex items-center gap-6 transition-all duration-1000 ease-out delay-[800ms]",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <div className="h-px w-12 bg-indigo-600" />
              <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-[0.2em]">
                Banda Aceh, Indonesia
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
