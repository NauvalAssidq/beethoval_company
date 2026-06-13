"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

const locales = [
  { value: "id", label: "Indonesia", flag: "🇮🇩", short: "ID" },
  { value: "en", label: "English", flag: "🇺🇸", short: "EN" },
];

interface PublicLanguageSwitcherProps {
  className?: string;
  isDarkTheme?: boolean;
  align?: "left" | "right";
}

export function PublicLanguageSwitcher({ className, isDarkTheme = false, align = "right" }: PublicLanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = locales.find((l) => l.value === locale) || locales[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (val: string) => {
    if (val !== locale) {
      const q = searchParams.toString();
      const newPath = q ? `${pathname}?${q}` : pathname;
      router.replace(newPath as any, { locale: val });
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center gap-2 h-10 px-4 rounded-full transition-all duration-300 backdrop-blur-md",
          "border hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
          isDarkTheme 
            ? "bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-[0_4px_20px_-5px_rgba(255,255,255,0.1)]" 
            : "bg-white/70 border-gray-200/60 text-gray-800 hover:bg-white hover:border-gray-300 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]"
        )}
      >
        <span className="text-lg leading-none filter drop-shadow-sm transition-transform group-hover:scale-110">
          {selected.flag}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
          {selected.short}
        </span>
        <ChevronDown 
          className={cn(
            "size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isOpen ? "rotate-180" : "rotate-0",
            isDarkTheme ? "text-white/70 group-hover:text-white" : "text-gray-500 group-hover:text-gray-800"
          )} 
        />
      </button>

      <div
        className={cn(
          "absolute mt-3 w-48 rounded-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[100]",
          "border shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] backdrop-blur-xl",
          align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
          isDarkTheme 
            ? "bg-zinc-900/90 border-zinc-800/50" 
            : "bg-white/95 border-gray-100/80",
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
            : "opacity-0 scale-95 pointer-events-none -translate-y-2"
        )}
      >
        <div className="p-2 flex flex-col gap-1">
          {locales.map((l) => (
            <button
              key={l.value}
              onClick={() => handleLanguageChange(l.value)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                l.value === locale
                  ? isDarkTheme ? "bg-white/10 text-white font-medium" : "bg-indigo-50/80 text-indigo-900 font-medium"
                  : isDarkTheme ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-xl leading-none filter drop-shadow-sm transition-transform group-hover:scale-110 duration-300">
                  {l.flag}
                </span>
                <span className="font-medium tracking-wide text-[13px]">{l.label}</span>
              </div>
              {l.value === locale && (
                <Check className={cn("size-4 relative z-10", isDarkTheme ? "text-white" : "text-indigo-600")} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
