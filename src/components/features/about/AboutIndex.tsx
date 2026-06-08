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

export function AboutIndex() {
  const [data, setData] = useState<AboutData>({
    heading: "",
    description: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((json) => {
        if (json) setData(json);
      })
      .catch(() => toast.error("Failed to load about data"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
        <h1 className="font-serif text-3xl text-gray-900 dark:text-gray-100 tracking-tight">About Me</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the content of the About section on the landing page.</p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl bg-white shadow-none overflow-hidden dark:bg-gray-900 dark:border-gray-800">
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Type className="size-5 text-indigo-500" />
              Main Content
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Heading</Label>
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 p-3 rounded-lg flex items-start gap-2 text-xs mb-1">
                  <Info className="size-4 shrink-0 mt-0.5" />
                  <p>
                    Use <code>&lt;em&gt;word&lt;/em&gt;</code> or <code>&lt;i&gt;word&lt;/i&gt;</code> to italicize specific words. Use <code>&lt;br/&gt;</code> for line breaks.
                  </p>
                </div>
                <Textarea
                  value={data.heading}
                  onChange={(e) => setData({ ...data, heading: e.target.value })}
                  className="h-32 resize-none bg-white dark:bg-zinc-950 font-mono text-sm leading-relaxed"
                  placeholder="Technology shouldn't be a barrier..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
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
              Location Settings
            </h2>
            <div className="space-y-2">
              <Label>Location Label</Label>
              <Input
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value })}
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
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
