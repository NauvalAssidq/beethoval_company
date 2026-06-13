"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLocale } from "next-intl";
import type { LocalizedString } from "@/types/i18n";

interface FaqFormProps {
  faqId?: string;
}

export function FaqForm({ faqId }: FaqFormProps) {
  const router = useRouter();
  const isEditing = !!faqId;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const locale = useLocale() as "en" | "id";
  const t = useTranslations("FaqForm");
  
  interface FaqFormData {
    question: LocalizedString;
    answer: LocalizedString;
  }
  
  const [formData, setFormData] = useState<FaqFormData>({
    question: { en: "", id: "" },
    answer: { en: "", id: "" },
  });

  useEffect(() => {
    if (isEditing) {
      fetchFaq();
    }
  }, [faqId]);

  const fetchFaq = async () => {
    try {
      const res = await fetch(`/api/faqs/${faqId}`);
      if (!res.ok) throw new Error("Failed to load FAQ");
      const data = await res.json();
      setFormData({
        question: data.question || { en: "", id: "" },
        answer: data.answer || { en: "", id: "" },
      });
    } catch (err) {
      toast.error("Failed to load FAQ");
      router.push("/dashboard/faqs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditing ? `/api/faqs/${faqId}` : "/api/faqs";
      const method = isEditing ? "PUT" : "POST";

      const fallbackStr = (str: LocalizedString) => ({
        en: str.en || str.id,
        id: str.id || str.en,
      });

      const body = {
        question: fallbackStr(formData.question),
        answer: fallbackStr(formData.answer),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save FAQ");
      }

      toast.success(isEditing ? "FAQ updated successfully" : "FAQ created successfully");
      router.push("/dashboard/faqs");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <div className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/dashboard/faqs"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit"
      >
        <ArrowLeft className="size-4" />
        {t('back_to_faqs')}
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">
          {isEditing ? t('edit_faq') : t('create_faq')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <label htmlFor="question" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {t('question')}
          </label>
          <input
            id="question"
            type="text"
            required
            value={formData.question[locale]}
            onChange={(e) => setFormData({ ...formData, question: { ...formData.question, [locale]: e.target.value } })}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            placeholder="e.g. How long does a typical project take?"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="answer" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {t('answer')}
          </label>
          <textarea
            id="answer"
            required
            rows={5}
            value={formData.answer[locale]}
            onChange={(e) => setFormData({ ...formData, answer: { ...formData.answer, [locale]: e.target.value } })}
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-y"
            placeholder="Provide a clear and concise answer..."
          />
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isEditing ? t('save_changes') : t('create_faq')}
          </button>
        </div>
      </form>
    </div>
  );
}
