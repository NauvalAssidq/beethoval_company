"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "@/components/features/editor/TiptapEditor";
import { TagInput } from "@/components/ui/tag-input";
import { ImageUploader } from "@/components/ui/image-uploader";
import { toast } from "sonner";

interface NewsFormProps {
  articleId?: string;
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

export function NewsForm({ articleId }: NewsFormProps) {
  const router = useRouter();
  const isEdit = !!articleId;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [touched, setTouched] = useState({ title: false, slug: false });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isEdit || !articleId) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/news/${articleId}`);
        if (!res.ok) throw new Error("Article not found");
        const data = await res.json();
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setSlugManual(true);
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        setCoverImage(data.coverImage || "");
        setTags(data.tags || []);
      } catch {
        toast.error("Failed to load article");
        router.push("/dashboard/news");
      } finally {
        setFetching(false);
      }
    };
    fetchArticle();
  }, [isEdit, articleId, router]);

  useEffect(() => {
    if (!slugManual) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && (title || content)) {
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

    if (!title.trim() || !slug.trim()) {
      toast.error("Please fill in the required fields");
      return;
    }

    setLoading(true);
    try {
      const body = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content,
        coverImage: coverImage.trim(),
        tags,
      };

      const url = isEdit ? `/api/news/${articleId}` : "/api/news";
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

      toast.success(isEdit ? "Article updated" : "Article created");
      setIsDirty(false);
      router.push("/dashboard/news");
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
          href="/dashboard/news"
          className="inline-flex items-center justify-center size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-gray-900 dark:text-gray-100">
            {isEdit ? "Edit Article" : "New Article"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? "Update your article details" : "Fill in the details to publish a new article"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} onChange={() => setIsDirty(true)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Breaking: Something Amazing Happened"
              value={title}
              onBlur={() => setTouched(t => ({ ...t, title: true }))}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(INPUT_STYLE, touched.title && !title.trim() && "border-red-500 focus-visible:ring-red-500")}
            />
            {touched.title && !title.trim() && <span className="text-xs text-red-500">Title is required</span>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="breaking-something-amazing"
              value={slug}
              onBlur={() => setTouched(t => ({ ...t, slug: true }))}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
              className={cn(INPUT_STYLE, "font-mono text-sm", touched.slug && !slug.trim() && "border-red-500 focus-visible:ring-red-500")}
            />
            {touched.slug && !slug.trim() && <span className="text-xs text-red-500">Slug is required</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Excerpt
            </Label>
            <Input
              id="excerpt"
              placeholder="A brief summary of the article"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className={INPUT_STYLE}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</Label>
            <TiptapEditor content={content} onChange={(html) => { setContent(html); setIsDirty(true); }} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 dark:bg-gray-900/50 dark:border-gray-800 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="coverImage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image
              </Label>
              <ImageUploader value={coverImage} onChange={(url) => setCoverImage(url as string)} multiple={false} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tags" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </Label>
              <TagInput tags={tags} onChange={(t) => { setTags(t); setIsDirty(true); }} placeholder="Add tag..." />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 lg:mt-auto">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full px-5"
              onClick={() => router.push("/dashboard/news")}
            >
              Cancel
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
              <span>{loading ? "Saving..." : isEdit ? "Update Article" : "Publish Article"}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
