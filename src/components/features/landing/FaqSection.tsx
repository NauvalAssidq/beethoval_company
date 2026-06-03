"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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
      className="relative bg-white dark:bg-zinc-950 py-24 md:py-32 border-t border-zinc-100 dark:border-zinc-900"
    >
      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          
          <div className="lg:col-span-4 flex flex-col">
            <div className="sticky top-32">
              <div
                className={cn(
                  "transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
              >
                <h2 className="text-4xl md:text-5xl lg:text-7xl text-zinc-900 dark:text-zinc-100 tracking-tight leading-[1.05] mb-6">
                  <span className="font-sans font-regular">Frequently Asked</span><br />
                  <span className="font-serif italic text-indigo-600">Question</span>
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm">
                  Everything you need to know about our process, pricing, and how we deliver award-winning digital experiences.
                </p>
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-8 flex flex-col border-t border-zinc-200 dark:border-zinc-800/50">
            {loading ? (
              <div className="flex flex-col space-y-4 py-8">
                <div className="h-16 bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
                <div className="h-16 bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
                <div className="h-16 bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
              </div>
            ) : (
              faqs.map((faq, index) => {
                const isOpen = openId === faq._id;
                
                return (
                  <div
                    key={faq._id}
                    className={cn(
                      "group relative flex flex-col border-b border-zinc-200 dark:border-zinc-800/50 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                    )}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : faq._id)}
                      className="w-full flex items-center gap-4 md:gap-6 py-5 md:py-10 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors px-4 md:px-8 -mx-4 md:-mx-8 group-data-[state=open]:bg-zinc-50 dark:group-data-[state=open]:bg-zinc-900/50"
                      data-state={isOpen ? "open" : "closed"}
                    >
                      <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 tracking-widest shrink-0 w-6 md:w-8 hidden sm:block">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      
                      <h3 className="flex-1 font-sans font-medium text-lg md:text-2xl text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                        {faq.question}
                      </h3>
                      
                      <div className="relative size-6 shrink-0 flex items-center justify-center">
                        <div className="absolute w-full h-[1.5px] bg-zinc-900 dark:bg-zinc-100 transition-transform duration-500 group-data-[state=open]:rotate-180" />
                        <div className="absolute w-full h-[1.5px] bg-zinc-900 dark:bg-zinc-100 transition-transform duration-500 rotate-90 group-data-[state=open]:rotate-0 opacity-100 group-data-[state=open]:opacity-0" />
                      </div>
                    </button>

                    <div
                      className="grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-6 md:pb-10 pl-4 sm:pl-0 md:pl-8 pr-4 md:pr-16 text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl transform transition-transform duration-500 -translate-y-4 data-[state=open]:translate-y-0"
                             data-state={isOpen ? "open" : "closed"}
                        >
                          {faq.answer}
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
