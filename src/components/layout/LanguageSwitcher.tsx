"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

const locales = [
  { value: "id", label: "Indonesia", flag: "🇮🇩" },
  { value: "en", label: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher({ triggerClassName }: { triggerClassName?: string } = {}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLanguageChange = (val: string | null) => {
    if (val && val !== locale) {
      const q = searchParams.toString();
      const newPath = q ? `${pathname}?${q}` : pathname;
      router.replace(newPath as any, { locale: val });
    }
  };

  const selected = locales.find(l => l.value === locale) || locales[0];

  return (
    <Combobox 
      defaultValue={locale} 
      onValueChange={handleLanguageChange}
    >
      <ComboboxTrigger className={cn("flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-gray-50 transition-colors dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", triggerClassName)}>
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="font-medium uppercase text-xs tracking-wider text-gray-700 dark:text-gray-300">
          {selected.value}
        </span>
      </ComboboxTrigger>
      <ComboboxContent align="end" side="bottom" sideOffset={8} className="w-48 z-50">
        <ComboboxList>
          {locales.map((l) => (
            <ComboboxItem key={l.value} value={l.value} className="flex items-center gap-2 cursor-pointer">
              <span className="text-base leading-none">{l.flag}</span>
              <span>{l.label}</span>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
