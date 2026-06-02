"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUploader } from "@/components/ui/image-uploader";
import { TagInput } from "@/components/ui/tag-input";
import { ArrowLeft, Loader2, Save } from "lucide-react";

interface ServiceFormProps {
  serviceId?: string;
}

export function ServiceForm({ serviceId }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!serviceId;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    image: "",
    languages: [] as string[],
  });

  useEffect(() => {
    if (isEditing) {
      fetchService();
    }
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${serviceId}`);
      if (!res.ok) throw new Error("Failed to load Service");
      const data = await res.json();
      setFormData({
        title: data.title || "",
        description: data.description || "",
        icon: data.icon || "",
        image: data.image || "",
        languages: data.languages || [],
      });
    } catch (err) {
      toast.error("Failed to load Service");
      router.push("/dashboard/services");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditing ? `/api/services/${serviceId}` : "/api/services";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save Service");
      }

      toast.success(isEditing ? "Service updated successfully" : "Service created successfully");
      router.push("/dashboard/services");
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
        href="/dashboard/services"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit"
      >
        <ArrowLeft className="size-4" />
        Back to Services
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">
          {isEditing ? "Edit Service" : "Create Service"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Service Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            placeholder="e.g. Web Development"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="icon" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Icon Name (lucide-react)
          </label>
          <input
            id="icon"
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono"
            placeholder="e.g. Code, Palette, Smartphone"
          />
          <p className="text-xs text-zinc-500">
            Find icon names at <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">lucide.dev</a>.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-y"
            placeholder="Describe what the service includes..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Image
          </label>
          <ImageUploader 
            value={formData.image} 
            onChange={(url) => setFormData({ ...formData, image: url as string })} 
            multiple={false} 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Language Used
          </label>
          <TagInput 
            tags={formData.languages} 
            onChange={(languages) => setFormData({ ...formData, languages })} 
            placeholder="Add language..." 
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
            {isEditing ? "Save Changes" : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
