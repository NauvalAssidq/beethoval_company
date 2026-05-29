"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "home", name: "Home", href: "#home" },
  { key: "projects", name: "Projects", href: "#projects" },
  { key: "about", name: "About", href: "#about" },
];

export function Navbar() {
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

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
          "fixed top-0 left-0 right-0 z-[60] border-b transition-colors duration-500",
          !atTop && !mobileOpen
            ? "bg-white border-gray-200"
            : "bg-transparent border-transparent"
        )}
      >
        <nav className="max-w-9xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between h-[72px]">
          <Link
            href="/"
            className="font-serif text-[22px] font-bold tracking-tight text-gray-900 flex items-center relative z-[60]"
          >
            <span className="italic">Beethoval</span>
            <span className="not-italic text-indigo-600">.dev</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={cn(
                  "relative text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 py-1 group",
                  activeSection === link.key
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-900"
                )}
              >
                {link.name}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-[1.5px] bg-gray-900 transition-all duration-300 ease-out",
                    activeSection === link.key
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  )}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="hidden md:inline-flex items-center justify-center h-9 px-5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Dashboard
            </Link>

            <button
              className="md:hidden relative z-[60] flex items-center justify-center p-2 text-gray-900 transition-transform active:scale-95"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[50] bg-[#fafafa] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden flex flex-col",
          mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="flex-1 flex flex-col justify-center px-8 pt-20">
          <nav className="flex flex-col gap-0">
            {navLinks.map((link, i) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={cn(
                  "block py-4 border-b border-gray-200/60 transition-all duration-500 ease-out",
                  mobileOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                )}
                style={{
                  transitionDelay: mobileOpen ? `${150 + i * 80}ms` : "0ms",
                }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-[11px] font-mono text-gray-300 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-serif text-4xl sm:text-5xl tracking-tight transition-colors",
                      activeSection === link.key
                        ? "text-gray-900"
                        : "text-gray-400"
                    )}
                  >
                    {link.name}
                  </span>
                </div>
              </a>
            ))}
          </nav>

          <div
            className={cn(
              "mt-12 transition-all duration-500 ease-out",
              mobileOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            )}
            style={{
              transitionDelay: mobileOpen
                ? `${150 + navLinks.length * 80}ms`
                : "0ms",
            }}
          >
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center h-12 px-8 text-[12px] font-semibold uppercase tracking-[0.15em] text-white bg-gray-900"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div
          className={cn(
            "px-8 pb-10 transition-all duration-500 ease-out",
            mobileOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
          style={{
            transitionDelay: mobileOpen
              ? `${250 + navLinks.length * 80}ms`
              : "0ms",
          }}
        >
          <p className="text-[11px] text-gray-300 tracking-widest uppercase font-medium">
            © {new Date().getFullYear()} Beethoval.dev
          </p>
        </div>
      </div>
    </>
  );
}
