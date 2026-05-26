"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { key: "home", name: "Home", href: "#home" },
  { key: "projects", name: "Projects", href: "#projects" },
  { key: "about", name: "About", href: "#about" },
];

export function Navbar({ isScrolled }: { isScrolled: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((link) => link.href.substring(1));
      let current = "";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= 100) {
            current = section;
          }
        }
      }
      
      if (current) {
        setActiveSection(current);
      } else if (window.scrollY < 100) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    
    if (href.startsWith("#")) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 transition-all duration-300">
      <nav className={cn(
        "mx-auto flex items-center justify-between px-6 py-3 transition-all duration-500 ease-out",
        isScrolled 
          ? "max-w-4xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm border border-gray-200 dark:border-gray-800 rounded-[20px]" 
          : "max-w-9xl bg-transparent border border-transparent"
      )}>
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
          <span className="italic">Beethoval</span>
          <span className="not-italic text-indigo-600">.dev</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={cn(
                "text-[14px] font-medium transition-all duration-200 relative py-1",
                activeSection === link.key 
                  ? "text-indigo-600" 
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-full h-[2px] bg-indigo-600 rounded-full transition-transform duration-300 origin-left",
                activeSection === link.key ? "scale-x-100" : "scale-x-0"
              )} />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block">
            <Button className="rounded-[10px] bg-gray-900 hover:bg-gray-800 text-white px-5 py-2">
              Dashboard
            </Button>
          </Link>

          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div 
          id="mobile-nav" 
          className={cn(
            "md:hidden fixed inset-x-4 top-24 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl transition-all duration-300 transform",
            mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
          )}
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={cn(
                  "text-lg font-medium transition-colors",
                  activeSection === link.key ? "text-indigo-600" : "text-gray-900 dark:text-white"
                )}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <Link href="/login" className="w-full">
                <Button className="w-full rounded-[10px] bg-gray-900 hover:bg-gray-800 text-white">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
