"use client";

import { useState, useEffect, FormEvent } from "react";
import { Loader2, Save, Type, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { useTranslations, useLocale } from "next-intl";
import type { LocalizedString } from "@/types/i18n";

export function HeroIndex() {
  const locale = useLocale() as "en" | "id";
  const [hero, setHero] = useState({
    line1: { en: "", id: "" } as LocalizedString,
    highlightWord1: { en: "", id: "" } as LocalizedString,
    highlightAction1: "circle",
    separator: { en: "", id: "" } as LocalizedString,
    highlightWord2: { en: "", id: "" } as LocalizedString,
    highlightAction2: "highlight",
    line3: { en: "", id: "" } as LocalizedString,
    subtitle: { en: "", id: "" } as LocalizedString
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const t = useTranslations("HeroIndex");

  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await fetch("/api/hero");
        if (res.ok) {
          const data = await res.json();
          setHero({
            line1: data.line1 || { en: "", id: "" },
            highlightWord1: data.highlightWord1 || { en: "", id: "" },
            highlightAction1: data.highlightAction1 || "circle",
            separator: data.separator || { en: "", id: "" },
            highlightWord2: data.highlightWord2 || { en: "", id: "" },
            highlightAction2: data.highlightAction2 || "highlight",
            line3: data.line3 || { en: "", id: "" },
            subtitle: data.subtitle || { en: "", id: "" }
          });
        } else {
          toast.error("Failed to load hero data.");
        }
      } catch (error) {
        toast.error("An error occurred while loading hero data.");
      } finally {
        setLoading(false);
      }
    }
    fetchHero();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fallbackStr = (str: LocalizedString) => ({
        en: str.en || str.id,
        id: str.id || str.en,
      });

      const body = {
        ...hero,
        line1: fallbackStr(hero.line1),
        highlightWord1: fallbackStr(hero.highlightWord1),
        separator: fallbackStr(hero.separator),
        highlightWord2: fallbackStr(hero.highlightWord2),
        line3: fallbackStr(hero.line3),
        subtitle: fallbackStr(hero.subtitle),
      };

      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error("Failed to update hero");
      }

      toast.success("Hero updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden dark:bg-gray-900 dark:border-gray-800">
          <div className="p-6 md:p-8 space-y-8">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 pb-20">
      <div>
        <h1 className="font-serif text-3xl text-gray-900 dark:text-gray-100 tracking-tight">{t('hero_settings')}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('manage_the_landing_page_typography_and_highlightin')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl bg-white shadow-none overflow-hidden dark:bg-gray-900 dark:border-gray-800">
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Type className="size-5 text-indigo-500" />
              {t('main_typography')}
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('line_1_sans_serif')}</Label>
                <Input
                  value={hero.line1[locale]}
                  onChange={(e) => setHero({ ...hero, line1: { ...hero.line1, [locale]: e.target.value } })}
                  placeholder="Crafting Digital"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="space-y-2">
                  <Label>{t('highlighted_word_1')}</Label>
                  <Input
                    value={hero.highlightWord1[locale]}
                    onChange={(e) => setHero({ ...hero, highlightWord1: { ...hero.highlightWord1, [locale]: e.target.value } })}
                    placeholder="Experiences"
                    required
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label>{t('action_1')}</Label>
                  <Combobox 
                    value={hero.highlightAction1} 
                    onValueChange={(val: any) => val && setHero({ ...hero, highlightAction1: val as string })}
                  >
                    <ComboboxInput showTrigger />
                    <ComboboxContent>
                      <ComboboxList>
                        <ComboboxItem value="circle">{t('circle')}</ComboboxItem>
                        <ComboboxItem value="highlight">{t('highlight')}</ComboboxItem>
                        <ComboboxItem value="none">{t('none')}</ComboboxItem>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('separator')}</Label>
                <Input
                  value={hero.separator[locale]}
                  onChange={(e) => setHero({ ...hero, separator: { ...hero.separator, [locale]: e.target.value } })}
                  placeholder="&amp;"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="space-y-2">
                  <Label>{t('highlighted_word_2')}</Label>
                  <Input
                    value={hero.highlightWord2[locale]}
                    onChange={(e) => setHero({ ...hero, highlightWord2: { ...hero.highlightWord2, [locale]: e.target.value } })}
                    placeholder="Solutions"
                    required
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label>{t('action_2')}</Label>
                  <Combobox 
                    value={hero.highlightAction2} 
                    onValueChange={(val: any) => val && setHero({ ...hero, highlightAction2: val as string })}
                  >
                    <ComboboxInput showTrigger />
                    <ComboboxContent>
                      <ComboboxList>
                        <ComboboxItem value="circle">{t('circle')}</ComboboxItem>
                        <ComboboxItem value="highlight">{t('highlight')}</ComboboxItem>
                        <ComboboxItem value="none">{t('none')}</ComboboxItem>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('line_3_sans_serif')}</Label>
                <Input
                  value={hero.line3[locale]}
                  onChange={(e) => setHero({ ...hero, line3: { ...hero.line3, [locale]: e.target.value } })}
                  placeholder="For Your Business"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare className="size-5 text-indigo-500" />
              {t('subtitle')}
            </h2>
            <div className="space-y-2">
              <Input
                value={hero.subtitle[locale]}
                onChange={(e) => setHero({ ...hero, subtitle: { ...hero.subtitle, [locale]: e.target.value } })}
                placeholder="High-performance web applications..."
                required
              />
            </div>
          </div>

        </div>

        <div className="p-4 md:px-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end">
          <Button 
            type="submit" 
            disabled={saving}
            className="shadow-none rounded-full bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <Save className="size-4 mr-2" />
            )}
            {t('save_changes')}
          </Button>
        </div>
      </form>
    </div>
  );
}
