"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/lib/landing-data";
import { useReveal } from "@/hooks/useReveal";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { resolveTranslation } from "@/types/i18n";

interface NewsProps {
  initialNews?: NewsArticle[];
}

export function News({ initialNews }: NewsProps) {
  const { ref: sectionRef, visible: isInView } = useReveal(0.1) as { ref: React.RefObject<HTMLElement | null>, visible: boolean };
  const locale = useLocale() as "en" | "id";
  const t = useTranslations("News");

  const news = initialNews ?? [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="news"
      className="relative bg-white py-12 md:py-16 overflow-hidden border-t border-gray-100"
    >
      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
        <div
          className={cn(
            "transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-700 tracking-tight leading-[1.05]">
              {t("news_articles")}
            </h2>
            <Link
              href="/#news"
              className="text-[11px] font-semibold text-gray-900 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 group transition-colors"
            >
              {t("view_journal")}
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {news.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center py-24 text-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <span className="text-6xl text-gray-200 font-serif italic mb-6 select-none">
              N
            </span>
            <h3 className="font-serif text-2xl text-gray-900 mb-2">{t("no_news_yet")}</h3>
            <p className="text-[14px] text-gray-400 font-medium max-w-sm">
              {t("check_back_later")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {news.map((item, index) => (
              <Link
                key={item._id}
                href={`/news/${resolveTranslation(item.slug, locale)}`}
                className={cn(
                  "group flex flex-col transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 mb-8 transition-shadow duration-700">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      alt={resolveTranslation(item.title, locale)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover grayscale opacity-90 transition-all duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center">
                      <span className="text-indigo-200 font-serif italic text-4xl select-none">
                        {resolveTranslation(item.title, locale)[0]}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                  <div className="absolute top-5 right-5 size-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg">
                    <ArrowUpRight className="size-4 text-gray-900" />
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <span className="text-[11px] font-semibold text-gray-400 mb-4 tracking-widest uppercase block">
                    {formatDate(item.createdAt)}
                  </span>
                  <h3 className="font-serif text-lg lg:text-xl text-gray-900 leading-[1.15] mb-3 group-hover:text-indigo-600 transition-colors line-clamp-3">
                    {resolveTranslation(item.title, locale)}
                  </h3>
                  {item.excerpt && (
                    <p className="text-[15px] text-gray-500 leading-relaxed font-medium line-clamp-2">
                      {resolveTranslation(item.excerpt, locale)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
