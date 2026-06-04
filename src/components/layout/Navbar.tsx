"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "home", name: "Home", href: "#home" },
  { key: "about", name: "About", href: "#about" },
  { key: "projects", name: "Projects", href: "#projects" },
  { key: "news", name: "News", href: "#news" },
];

export function Navbar() {
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onScroll = useCallback(() => {
    requestAnimationFrame(() => {
      setAtTop(window.scrollY < 40);

      let current = "home";
      for (const link of navLinks) {
        const id = link.href.substring(1);
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= 100) {
            current = link.key;
          }
        }
      }
      setActiveSection(current);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);

    if (href.startsWith("#")) {
      const el = document.getElementById(href.substring(1));
      if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-500",
          mounted && !atTop && !mobileOpen
            ? "bg-white border-b border-gray-200"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <nav className="max-w-9xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between h-[72px]">
          <Link
            href="/"
            className="font-serif text-[22px] font-semibold tracking-tight text-gray-900 flex items-center relative z-[60]"
          >
            <span className="italic">Beethoval</span>
            <span className="not-italic text-indigo-600">.dev</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={cn(
                  "relative px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 rounded-full",
                  activeSection === link.key
                    ? "text-gray-900 bg-gray-100/80"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#about"
              onClick={(e) => scrollTo(e, "#about")}
              className="hidden md:inline-flex items-center gap-2 h-10 px-6 text-[11px] font-bold uppercase tracking-[0.12em] text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              className="md:hidden relative z-[60] flex items-center justify-center size-10 rounded-full text-gray-900 transition-all active:scale-95 hover:bg-gray-100/80"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative size-5">
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-5 bg-gray-900 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    mobileOpen
                      ? "top-[9px] rotate-45"
                      : "top-[4px] rotate-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[9px] h-[1.5px] bg-gray-900 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    mobileOpen
                      ? "w-5 -rotate-45"
                      : "w-3.5 rotate-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] bg-gray-900 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    mobileOpen
                      ? "top-[9px] w-0 opacity-0"
                      : "top-[14px] w-5 opacity-100"
                  )}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[55] bg-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden flex flex-col",
          mobileOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex-1 flex flex-col justify-center px-8 pt-20">
          <nav className="flex flex-col">
            {navLinks.map((link, i) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={cn(
                  "group block py-5 border-b border-gray-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  mobileOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{
                  transitionDelay: mobileOpen ? `${200 + i * 80}ms` : "0ms",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-5">
                    <span className="text-[11px] font-mono text-gray-300 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-serif text-4xl sm:text-5xl tracking-tight transition-all duration-300",
                        activeSection === link.key
                          ? "text-gray-900 italic"
                          : "text-gray-400 group-hover:text-gray-900 group-hover:italic"
                      )}
                    >
                      {link.name}
                    </span>
                  </div>
                  <ArrowUpRight
                    className={cn(
                      "size-5 transition-all duration-500 ease-out",
                      activeSection === link.key
                        ? "text-indigo-600 opacity-100 translate-x-0"
                        : "text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                  />
                </div>
              </a>
            ))}
          </nav>

          <div
            className={cn(
              "mt-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              mobileOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
            style={{
              transitionDelay: mobileOpen
                ? `${200 + navLinks.length * 80}ms`
                : "0ms",
            }}
          >
            <a
              href="#about"
              onClick={(e) => scrollTo(e, "#about")}
              className="inline-flex items-center gap-3 h-14 px-10 text-[12px] font-bold uppercase tracking-[0.15em] text-white bg-gray-900 rounded-full group"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        <div
          className={cn(
            "px-8 pb-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            mobileOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
          style={{
            transitionDelay: mobileOpen
              ? `${300 + navLinks.length * 80}ms`
              : "0ms",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-gray-100" />
            <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">
              © {new Date().getFullYear()} Beethoval.dev
            </p>
            <div className="h-[1px] flex-1 bg-gray-100" />
          </div>
        </div>
      </div>
    </>
  );
}
