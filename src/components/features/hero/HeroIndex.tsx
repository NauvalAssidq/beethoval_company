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

export function HeroIndex() {
  const [hero, setHero] = useState({
    line1: "",
    highlightWord1: "",
    highlightAction1: "circle",
    separator: "",
    highlightWord2: "",
    highlightAction2: "highlight",
    line3: "",
    subtitle: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await fetch("/api/hero");
        if (res.ok) {
          const data = await res.json();
          setHero({
            line1: data.line1 || "",
            highlightWord1: data.highlightWord1 || "",
            highlightAction1: data.highlightAction1 || "circle",
            separator: data.separator || "",
            highlightWord2: data.highlightWord2 || "",
            highlightAction2: data.highlightAction2 || "highlight",
            line3: data.line3 || "",
            subtitle: data.subtitle || ""
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
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero)
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
        <h1 className="font-serif text-3xl text-gray-900 dark:text-gray-100 tracking-tight">Hero Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage the landing page typography and highlighting actions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl bg-white shadow-none overflow-hidden dark:bg-gray-900 dark:border-gray-800">
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Type className="size-5 text-indigo-500" />
              Main Typography
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Line 1 (Sans-serif)</Label>
                <Input
                  value={hero.line1}
                  onChange={(e) => setHero({ ...hero, line1: e.target.value })}
                  placeholder="Crafting Digital"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="space-y-2">
                  <Label>Highlighted Word 1</Label>
                  <Input
                    value={hero.highlightWord1}
                    onChange={(e) => setHero({ ...hero, highlightWord1: e.target.value })}
                    placeholder="Experiences"
                    required
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label>Action 1</Label>
                  <Combobox 
                    value={hero.highlightAction1} 
                    onValueChange={(val: any) => val && setHero({ ...hero, highlightAction1: val as string })}
                  >
                    <ComboboxInput showTrigger />
                    <ComboboxContent>
                      <ComboboxList>
                        <ComboboxItem value="circle">Circle</ComboboxItem>
                        <ComboboxItem value="highlight">Highlight</ComboboxItem>
                        <ComboboxItem value="none">None</ComboboxItem>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Separator</Label>
                <Input
                  value={hero.separator}
                  onChange={(e) => setHero({ ...hero, separator: e.target.value })}
                  placeholder="&amp;"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="space-y-2">
                  <Label>Highlighted Word 2</Label>
                  <Input
                    value={hero.highlightWord2}
                    onChange={(e) => setHero({ ...hero, highlightWord2: e.target.value })}
                    placeholder="Solutions"
                    required
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label>Action 2</Label>
                  <Combobox 
                    value={hero.highlightAction2} 
                    onValueChange={(val: any) => val && setHero({ ...hero, highlightAction2: val as string })}
                  >
                    <ComboboxInput showTrigger />
                    <ComboboxContent>
                      <ComboboxList>
                        <ComboboxItem value="circle">Circle</ComboboxItem>
                        <ComboboxItem value="highlight">Highlight</ComboboxItem>
                        <ComboboxItem value="none">None</ComboboxItem>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Line 3 (Sans-serif)</Label>
                <Input
                  value={hero.line3}
                  onChange={(e) => setHero({ ...hero, line3: e.target.value })}
                  placeholder="For Your Business"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare className="size-5 text-indigo-500" />
              Subtitle
            </h2>
            <div className="space-y-2">
              <Input
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
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
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
