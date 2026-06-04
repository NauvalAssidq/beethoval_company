"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { type Service } from "@/types/service";

const FALLBACK_SERVICES: Service[] = [
  {
    _id: "1",
    title: "Pengembangan Web",
    description: "Membangun website yang cepat, skalabel, dan aman menggunakan teknologi modern. Saya berfokus pada performa dan optimasi SEO.",
    icon: "Code",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    languages: ["React", "Laravel", "TypeScript", "TailwindCSS"],
    order: 1,
  },
  {
    _id: "2",
    title: "Desain UI/UX",
    description: "Merancang antarmuka yang intuitif dan pengalaman pengguna yang luar biasa untuk produk digital Anda.",
    icon: "Palette",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=80",
    languages: ["Figma", "Prototyping", "Wireframing"],
    order: 2,
  },
  {
    _id: "3",
    title: "Aplikasi Mobile",
    description: "Membawa bisnis Anda ke genggaman pengguna dengan aplikasi mobile native atau cross-platform yang responsif.",
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80",
    languages: ["React Native", "Flutter", "iOS", "Android"],
    order: 3,
  },
  {
    _id: "4",
    title: "Digital Strategi",
    description: "Roadmap berbasis data untuk membantu startup Anda menembus pasar dan berkembang di ekosistem yang kompetitif.",
    icon: "Rocket",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    languages: ["Analytics", "SEO", "Growth"],
    order: 4,
  },
];

interface ServicesProps {
  initialServices?: Service[];
}

export function Services({ initialServices }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isInView, setIsInView] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  const services =
    initialServices && initialServices.length > 0
      ? initialServices
      : FALLBACK_SERVICES;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(index));
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [services]);

  useEffect(() => {
    const isDesktop = () => window.innerWidth >= 768;

    const handleScroll = () => {
      const wrappers = cardRefs.current;
      if (!isDesktop()) {
        wrappers.forEach((wrapper) => {
          if (!wrapper) return;
          const card = wrapper.firstElementChild as HTMLElement;
          if (card) card.style.transform = "";
        });
        return;
      }

      wrappers.forEach((wrapper, index) => {
        if (!wrapper) return;
        const card = wrapper.firstElementChild as HTMLElement;
        if (!card) return;

        if (index === wrappers.length - 1) {
          card.style.transform = "scale(1)";
          return;
        }

        const rect = wrapper.getBoundingClientRect();
        const stickyTop = 80 + index * 14;

        if (rect.top <= stickyTop + 1) {
          const nextWrapper = wrappers[index + 1];
          if (nextWrapper) {
            const nextRect = nextWrapper.getBoundingClientRect();
            const nextStickyTop = 80 + (index + 1) * 14;
            const travelDistance = card.offsetHeight;
            const progress = Math.max(0, Math.min(1, 1 - (nextRect.top - nextStickyTop) / travelDistance));
            const scale = 1 - progress * 0.05;
            card.style.transform = `scale(${scale})`;
          }
        } else {
          card.style.transform = "scale(1)";
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [services]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-[#fafafa] border-t border-gray-100 mb-12"
    >
      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 mb-8">
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight leading-[1.05] mb-6">
            <span className="font-sans font-regular">Expertise</span> <span className="font-sans">&amp;</span> <span className="font-serif italic text-indigo-600">Services</span>
          </h2>
          <p className="text-[14px] text-gray-400 font-medium max-w-lg leading-relaxed pb-2">
            Clean, purposeful design and solid engineering to genuinely empower your business to stand out.
          </p>
        </div>
      </div>

      {services.length === 0 ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-24 text-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-6xl text-gray-200 font-serif italic mb-6 select-none">S</span>
          <h3 className="font-serif text-2xl text-gray-900 mb-2">No services yet</h3>
          <p className="text-[14px] text-gray-400 font-medium max-w-sm">
            Services will appear here once they are published from the dashboard.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col gap-8 md:gap-0">
            {services.map((service, index) => (
              <div
                key={service._id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={cn(
                  "relative md:sticky w-full md:pb-4 transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:top-[var(--sticky-top)]",
                  visibleCards.has(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                )}
                style={{
                  "--sticky-top": `${80 + index * 14}px`,
                  zIndex: index + 1,
                  transitionDelay: visibleCards.has(index) ? `${index * 120}ms` : "0ms",
                } as React.CSSProperties}
              >
                <div className="h-auto md:h-[55vh] lg:h-[60vh] w-full bg-white border border-gray-300 overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center will-change-transform">
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
                    <div className="flex flex-col justify-center px-5 sm:px-10 md:px-12 lg:px-20 xl:px-28 py-6 md:py-0 order-2 md:order-1">
                      <span className="text-[12px] md:text-[13px] font-mono text-gray-300 tabular-nums block mb-2 md:mb-6">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-serif text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-900 tracking-tight leading-[1.05] mb-3 md:mb-6">
                        {service.title}
                      </h3>
                      <p className="text-[13px] md:text-[15px] text-gray-500 font-medium leading-relaxed mb-4 md:mb-8 max-w-md">
                        {service.description}
                      </p>
                      {service.languages && service.languages.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {service.languages.map((lang) => (
                            <span
                              key={lang}
                              className="text-[11px] font-medium text-gray-400 border border-gray-200 pl-[8px] pr-[10px] py-[4px] leading-none"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="group relative overflow-hidden order-1 md:order-2 h-[200px] md:h-full border-b md:border-b-0 md:border-l border-gray-300">
                      <img
                        src={service.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80"}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="hidden md:block h-[20vh]" />
          </div>
        </div>
      )}
    </section>
  );
}
