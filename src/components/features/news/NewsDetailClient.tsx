"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

interface ArticleNav {
  title: string;
  slug: string;
  coverImage: string;
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface NewsDetailClientProps {
  article: Article;
  prevArticle: ArticleNav | null;
  nextArticle: ArticleNav | null;
}

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => {
      obs.unobserve(el);
    };
  }, [threshold]);

  return { ref, visible };
}

export function NewsDetailClient({
  article,
  prevArticle,
  nextArticle,
}: NewsDetailClientProps) {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 80);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const metaReveal = useReveal(0.2);
  const contentReveal = useReveal(0.05);
  const navReveal = useReveal(0.15);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar transparentTheme="dark" />

      <div className="relative h-[100vh] w-full overflow-hidden">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover blur-xs scale-100"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-800 to-gray-950" />
        )}

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-9xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
            {article.tags.length > 0 && (
              <div
                className="flex flex-wrap gap-2 mb-6 animate-fade-up"
                style={{ "--delay": "200ms" } as React.CSSProperties}
              >
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-white/80 border border-white/25 px-3 py-1.5 backdrop-blur-sm bg-white/5 tracking-wide uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-tight leading-[1.05] max-w-5xl animate-fade-up"
              style={{ "--delay": "400ms" } as React.CSSProperties}
            >
              {article.title}
            </h1>

            {article.excerpt && (
              <p
                className="text-base sm:text-lg text-white/60 font-medium max-w-xl mt-5 leading-relaxed animate-fade-up"
                style={{ "--delay": "600ms" } as React.CSSProperties}
              >
                {article.excerpt}
              </p>
            )}
          </div>
        </div>

        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
          style={{ "--delay": "1200ms" } as React.CSSProperties}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>

      <div
        ref={metaReveal.ref}
        className={cn(
          "border-b border-gray-200 transition-all duration-700",
          metaReveal.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        )}
      >
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-3">
              <Calendar className="size-4 text-gray-300 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
                  Published
                </span>
                <span className="text-sm text-gray-700 font-medium">
                  {article.createdAt ? formatDate(article.createdAt) : "—"}
                </span>
              </div>
            </div>

            {article.tags.length > 0 && (
              <div className="flex items-start gap-3">
                <Tag className="size-4 text-gray-300 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
                    Tags
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    {article.tags.join(" · ")}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <ArrowUpRight className="size-4 text-gray-300 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
                  Slug
                </span>
                <span className="text-sm text-gray-700 font-mono font-medium">
                  /{article.slug}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={contentReveal.ref}
        className={cn(
          "transition-all duration-1000 ease-out",
          contentReveal.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        )}
      >
        <article className="max-w-2xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-32">
          <div
            className={cn(
              "prose prose-lg max-w-none prose-public",
              "prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-gray-900",
              "prose-p:font-sans prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:text-[17px]",
              "prose-a:text-indigo-600 prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:text-indigo-800 prose-a:font-medium prose-a:decoration-indigo-300",
              "prose-img:rounded-xl prose-img:shadow-sm prose-img:my-12 prose-img:w-[100vw] sm:prose-img:w-[768px] prose-img:max-w-none prose-img:relative prose-img:left-[50%] prose-img:-translate-x-1/2",
              "prose-blockquote:border-l-2 prose-blockquote:border-indigo-500 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-gray-500 prose-blockquote:pl-6 prose-blockquote:not-italic",
              "prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
              "prose-pre:bg-[#1e1e2e] prose-pre:rounded-xl prose-pre:text-sm",
              "prose-li:text-gray-600 prose-li:text-[17px] prose-li:leading-[1.8]",
              "prose-strong:text-gray-900 prose-strong:font-semibold",
              "prose-hr:border-gray-200 prose-hr:my-16",
              "prose-table:border-collapse prose-table:w-full",
              "prose-sub:text-xs prose-sup:text-xs"
            )}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>

      {(prevArticle || nextArticle) && (
        <div
          ref={navReveal.ref}
          className={cn(
            "border-t border-gray-200 transition-all duration-1000 ease-out",
            navReveal.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {prevArticle ? (
              <Link
                href={`/news/${prevArticle.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden h-[50vh] md:h-[60vh] p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200"
              >
                {prevArticle.coverImage ? (
                  <img
                    src={prevArticle.coverImage}
                    alt={prevArticle.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />

                <div className="relative z-10">
                  <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest block mb-3">
                    ← Previous Article
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
                    {prevArticle.title}
                  </h3>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}

            {nextArticle ? (
              <Link
                href={`/news/${nextArticle.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden h-[50vh] md:h-[60vh] p-8 md:p-12"
              >
                {nextArticle.coverImage ? (
                  <img
                    src={nextArticle.coverImage}
                    alt={nextArticle.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />

                <div className="relative z-10 text-right">
                  <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest block mb-3">
                    Next Article →
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
                    {nextArticle.title}
                  </h3>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-gray-200 py-12 md:py-16">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-lg font-bold tracking-tight text-gray-900"
          >
            <span className="italic">Beethoval</span>
            <span className="not-italic text-indigo-600">.dev</span>
          </Link>

          <Link
            href="/#news"
            className="text-[13px] font-medium text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center gap-1.5"
          >
            <span>All News</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </footer>
    </main>
  );
}
