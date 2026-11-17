"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveTranslation } from "@/types/i18n";
import { useLocale, useTranslations } from "next-intl";

interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

const DUMMY_FAQS: Faq[] = [
  {
    _id: "dummy-1",
    question: "What is your typical project timeline?",
    answer: "Our typical engagement runs between 4 to 8 weeks, depending on the complexity of the digital experience. We prioritize precision over speed, ensuring every interaction feels bespoke and premium.",
    order: 1,
  },
  {
    _id: "dummy-2",
    question: "Do you offer ongoing technical maintenance?",
    answer: "Yes. Post-launch, we offer dedicated retainer packages to ensure your platform remains performant, secure, and aligned with the latest web standards.",
    order: 2,
  },
  {
    _id: "dummy-3",
    question: "How do you handle project pricing?",
    answer: "We price based on the value and technical complexity of the architecture. After our initial discovery phase, we provide a transparent, milestone-based proposal.",
    order: 3,
  },
];

export function FaqSection() {
  const locale = useLocale() as "en" | "id";
  const t = useTranslations("FaqSection");
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const res = await fetch("/api/public/faqs");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setFaqs(data);
          } else {
            setFaqs(DUMMY_FAQS);
          }
        } else {
          setFaqs(DUMMY_FAQS);
        }
      } catch (err) {
        setFaqs(DUMMY_FAQS);
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative bg-white py-16 sm:py-20 md:py-28 border-t border-gray-100"
    >
      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-20">
          
          <div className="lg:col-span-4 flex flex-col">
            <div className="lg:sticky lg:top-32">
              <div
                className={cn(
                  "transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-zinc-900 tracking-tight leading-[1.08] mb-4 sm:mb-6">
                  <span className="font-sans font-regular">{t("frequently_asked")}</span><br />
                  <span className="font-serif italic text-indigo-600">{t("question")}</span>
                </h2>
                <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-sm">
                  {t("faq_description")}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col border-t border-zinc-200">
            {loading ? (
              <div className="flex flex-col space-y-4 py-8">
                <div className="h-16 bg-zinc-100 rounded-lg animate-pulse" />
                <div className="h-16 bg-zinc-100 rounded-lg animate-pulse" />
                <div className="h-16 bg-zinc-100 rounded-lg animate-pulse" />
              </div>
            ) : (
              faqs.map((faq, index) => {
                const isOpen = openId === faq._id;
                
                return (
                  <div
                    key={faq._id}
                    data-state={isOpen ? "open" : "closed"}
                    className={cn(
                      "group relative flex flex-col border-b border-zinc-200 transition-colors duration-300",
                      isOpen ? "bg-zinc-50/80" : "hover:bg-zinc-50/60",
                      isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    )}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faq._id)}
                      className="w-full flex items-center justify-between gap-3 sm:gap-5 py-5 sm:py-7 px-3 sm:px-6 text-left cursor-pointer"
                    >
                      <div className="flex items-baseline sm:items-center gap-3 sm:gap-5 min-w-0 flex-1">
                        <span className="text-[11px] font-mono text-zinc-400 tracking-widest tabular-nums shrink-0 w-5 sm:w-7">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>

                        <h3 className={cn(
                          "font-sans font-medium text-base sm:text-lg md:text-xl transition-colors tracking-tight leading-snug",
                          isOpen ? "text-indigo-600" : "text-zinc-900 group-hover:text-indigo-600"
                        )}>
                          {resolveTranslation(faq.question as any, locale)}
                        </h3>
                      </div>

                      <ChevronDown
                        className={cn(
                          "size-4 sm:size-5 shrink-0 transition-transform duration-300",
                          isOpen
                            ? "rotate-180 text-indigo-600"
                            : "text-zinc-400 group-hover:text-indigo-600"
                        )}
                      />
                    </button>

                    <div
                      className="grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-6 sm:pb-7 px-3 sm:px-6 pl-11 sm:pl-[4.5rem] pr-8 sm:pr-14 text-sm md:text-base text-zinc-500 leading-relaxed max-w-3xl">
                          {resolveTranslation(faq.answer as any, locale)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
