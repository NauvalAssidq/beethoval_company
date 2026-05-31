"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
}

export function News() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
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
    async function fetchNews() {
      try {
        const res = await fetch("/api/public/news?limit=3");
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="news"
      className="relative bg-white py-24 md:py-32 overflow-hidden border-t border-gray-100"
    >
      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-20">
        <div
          className={cn(
            "transition-all duration-1000 ease-out",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-indigo-600" />
            <p className="text-[11px] font-semibold text-indigo-600 tracking-[0.2em] uppercase">
              Latest Insights
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight leading-[1.05]">
              News & Articles
            </h2>
            <Link
              href="/#news"
              className="text-[11px] font-semibold text-gray-900 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 group transition-colors"
            >
              View Journal
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-[16/10] w-full mb-6" />
                <div className="h-4 bg-gray-100 w-24 mb-4" />
                <div className="h-7 bg-gray-200 w-full mb-3" />
                <div className="h-7 bg-gray-200 w-3/4 mb-4" />
                <div className="h-4 bg-gray-100 w-full mb-2" />
                <div className="h-4 bg-gray-100 w-2/3" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center py-24 text-center transition-all duration-700",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <span className="text-6xl text-gray-200 font-serif italic mb-6 select-none">
              N
            </span>
            <h3 className="font-serif text-2xl text-gray-900 mb-2">No news yet</h3>
            <p className="text-[14px] text-gray-400 font-medium max-w-sm">
              Check back later for updates and insights.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
            {news.map((item, index) => (
              <Link
                key={item._id}
                href={`/news/${item.slug}`}
                className={cn(
                  "group flex flex-col transition-all duration-1000 ease-out",
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 mb-8 transition-shadow duration-700">
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale opacity-90 transition-all duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center">
                      <span className="text-indigo-200 font-serif italic text-6xl select-none">
                        {item.title[0]}
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
                  <h3 className="font-serif text-2xl lg:text-3xl xl:text-4xl text-gray-900 leading-[1.15] mb-4 group-hover:text-indigo-600 transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-[15px] text-gray-500 leading-relaxed font-medium line-clamp-2">
                      {item.excerpt}
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
