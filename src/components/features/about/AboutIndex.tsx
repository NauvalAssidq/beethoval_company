"use client";

import { useState, useEffect, FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Loader2, Info, Type, MapPin } from "lucide-react";
import type { AboutData } from "@/lib/landing-data";
import { useTranslations, useLocale } from "next-intl";
import type { LocalizedString } from "@/types/i18n";

export function AboutIndex() {
  const locale = useLocale() as "en" | "id";
  const [data, setData] = useState({
    heading: { en: "", id: "" } as LocalizedString,
    description: { en: "", id: "" } as LocalizedString,
    location: { en: "", id: "" } as LocalizedString,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const t = useTranslations("AboutIndex");

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((json) => {
        if (json) {
          setData({
            heading: json.heading || { en: "", id: "" },
            description: json.description || { en: "", id: "" },
            location: json.location || { en: "", id: "" }
          });
        }
      })
      .catch(() => toast.error("Failed to load about data"))
      .finally(() => setLoading(false));
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
        heading: fallbackStr(data.heading),
        description: fallbackStr(data.description),
        location: fallbackStr(data.location),
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }

      toast.success("About section updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 pb-20">
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
        <h1 className="font-serif text-3xl text-gray-900 dark:text-gray-100 tracking-tight">{t('about_me')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('manage_the_content_of_the_about_section_on_the_lan')}</p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl bg-white shadow-none overflow-hidden dark:bg-gray-900 dark:border-gray-800">
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Type className="size-5 text-indigo-500" />
              {t('main_content')}
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('heading')}</Label>
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 p-3 rounded-lg flex items-start gap-2 text-xs mb-1">
                  <Info className="size-4 shrink-0 mt-0.5" />
                  <p>
                    {t('use')} <code>{t('lt_em_gt_word_lt_em_gt')}</code> {t('or')} <code>{t('lt_i_gt_word_lt_i_gt')}</code> {t('to_italicize_specific_words_use')} <code>{t('lt_br_gt')}</code> {t('for_line_breaks')}
                  </p>
                </div>
                <Textarea
                  value={data.heading[locale]}
                  onChange={(e) => setData({ ...data, heading: { ...data.heading, [locale]: e.target.value } })}
                  className="h-32 resize-none bg-white dark:bg-zinc-950 font-mono text-sm leading-relaxed"
                  placeholder="Technology shouldn't be a barrier..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{t('description')}</Label>
                <Textarea
                  value={data.description[locale]}
                  onChange={(e) => setData({ ...data, description: { ...data.description, [locale]: e.target.value } })}
                  className="h-48 resize-none bg-white dark:bg-zinc-950 leading-relaxed"
                  placeholder="In a cluttered digital landscape..."
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MapPin className="size-5 text-indigo-500" />
              {t('location_settings')}
            </h2>
            <div className="space-y-2">
              <Label>{t('location_label')}</Label>
              <Input
                value={data.location[locale]}
                onChange={(e) => setData({ ...data, location: { ...data.location, [locale]: e.target.value } })}
                className="bg-white dark:bg-zinc-950"
                placeholder="Banda Aceh, Indonesia"
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
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                {t('saving')}
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                {t('save_changes')}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
