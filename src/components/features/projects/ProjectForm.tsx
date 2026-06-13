"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "@/components/features/editor/TiptapEditor";
import { TagInput } from "@/components/ui/tag-input";
import { ImageUploader } from "@/components/ui/image-uploader";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import type { LocalizedString } from "@/types/i18n";

interface ProjectFormProps {
  projectId?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

const INPUT_STYLE =
  "w-full bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 h-12 rounded-xl px-4 text-base transition-colors shadow-none dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100";

export function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!projectId;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const locale = useLocale() as "en" | "id";
  const [title, setTitle] = useState<LocalizedString>({ en: "", id: "" });
  const [slug, setSlug] = useState<LocalizedString>({ en: "", id: "" });
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState<LocalizedString>({ en: "", id: "" });
  const [content, setContent] = useState<LocalizedString>({ en: "", id: "" });
  const [coverImage, setCoverImage] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [marqueeImage, setMarqueeImage] = useState("");
  const [touched, setTouched] = useState({ title: false, slug: false });
  const [isDirty, setIsDirty] = useState(false);
  const t = useTranslations("ProjectForm");

  useEffect(() => {
    if (!isEdit || !projectId) return;
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/project/${projectId}`);
        if (!res.ok) throw new Error("Project not found");
        const data = await res.json();
        setTitle(data.title || { en: "", id: "" });
        setSlug(data.slug || { en: "", id: "" });
        setSlugManual(true);
        setDescription(data.description || { en: "", id: "" });
        setContent(data.content || { en: "", id: "" });
        setCoverImage(data.coverImage || "");
        setTechStack(data.techStack || []);
        setMarqueeImage(data.marqueeImage || "");
      } catch {
        toast.error("Failed to load project");
        router.push("/dashboard/projects");
      } finally {
        setFetching(false);
      }
    };
    fetchProject();
  }, [isEdit, projectId, router]);

  useEffect(() => {
    if (!slugManual) {
      setSlug((prev) => ({ ...prev, [locale]: slugify(title[locale]) }));
    }
  }, [title, slugManual, locale]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && (title.en || title.id || content.en || content.id)) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, title, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, slug: true });

    if ((!title.en.trim() && !title.id.trim()) || (!slug.en.trim() && !slug.id.trim())) {
      toast.error("Please fill in the required fields in at least one language");
      return;
    }

    setLoading(true);
    try {
      const fallbackStr = (str: LocalizedString) => ({
        en: str.en || str.id,
        id: str.id || str.en,
      });

      const body = {
        title: fallbackStr(title),
        slug: fallbackStr(slug),
        description: fallbackStr(description),
        content: fallbackStr(content),
        coverImage: coverImage.trim(),
        techStack: techStack,
        marqueeImage: marqueeImage,
      };

      const url = isEdit ? `/api/project/${projectId}` : "/api/project";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(isEdit ? "Project updated" : "Project created");
      setIsDirty(false);
      router.push("/dashboard/projects");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-8xl">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center justify-center size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-gray-900 dark:text-gray-100">
            {isEdit ? t('edit_project') : t('new_project')}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? t('update_your_project_details') : t('fill_in_the_details_to_create_a_new_project')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} onChange={() => setIsDirty(true)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('title')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="My Awesome Project"
              value={title[locale]}
              onBlur={() => setTouched(t => ({ ...t, title: true }))}
              onChange={(e) => setTitle(prev => ({ ...prev, [locale]: e.target.value }))}
              className={cn(INPUT_STYLE, touched.title && !title[locale].trim() && "border-red-500 focus-visible:ring-red-500")}
            />
            {touched.title && !title[locale].trim() && <span className="text-xs text-red-500">{t('title_is_required')}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('slug')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="my-awesome-project"
              value={slug[locale]}
              onBlur={() => setTouched(t => ({ ...t, slug: true }))}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(prev => ({ ...prev, [locale]: e.target.value }));
              }}
              className={cn(INPUT_STYLE, "font-mono text-sm", touched.slug && !slug[locale].trim() && "border-red-500 focus-visible:ring-red-500")}
            />
            {touched.slug && !slug[locale].trim() && <span className="text-xs text-red-500">{t('slug_is_required')}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('description')}
            </Label>
            <Input
              id="description"
              placeholder="A short summary of the project"
              value={description[locale]}
              onChange={(e) => setDescription(prev => ({ ...prev, [locale]: e.target.value }))}
              className={INPUT_STYLE}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('content')}</Label>
            <TiptapEditor content={content[locale]} onChange={(html) => { setContent(prev => ({ ...prev, [locale]: html })); setIsDirty(true); }} />
          </div>
        </div>


        <div className="flex flex-col gap-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 dark:bg-gray-900/50 dark:border-gray-800 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="coverImage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('cover_image')}
              </Label>
              <ImageUploader value={coverImage} onChange={(url) => setCoverImage(url as string)} multiple={false} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="marqueeImage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('marquee_image')}
              </Label>
              <ImageUploader value={marqueeImage} onChange={(url) => { setMarqueeImage(url as string); setIsDirty(true); }} multiple={false} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="techStack" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('tech_stack')}
              </Label>
              <TagInput tags={techStack} onChange={(tags) => { setTechStack(tags); setIsDirty(true); }} placeholder="Add technology..." />
            </div>
          </div>


          <div className="flex items-center justify-end gap-3 lg:mt-auto">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full px-5"
              onClick={() => router.push("/dashboard/projects")}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full px-6 gap-2 bg-gray-900 text-white hover:bg-gray-800 shadow-none border-none dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              <span>{loading ? t('saving') : isEdit ? t('update_project') : t('create_project')}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
