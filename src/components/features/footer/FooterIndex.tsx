"use client";

import { useState, useEffect, FormEvent } from "react";
import { Loader2, Save, Type, Mail, Link as LinkIcon, Share2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLocale } from "next-intl";
import type { LocalizedString } from "@/types/i18n";

export function FooterIndex() {
  const locale = useLocale() as "en" | "id";
  const [heading, setHeading] = useState<{ primary: LocalizedString, secondary: LocalizedString }>({ 
    primary: { en: "", id: "" }, 
    secondary: { en: "", id: "" } 
  });
  const [contact, setContact] = useState({ email: "", phone: "" });
  const [copyright, setCopyright] = useState<LocalizedString>({ en: "", id: "" });
  const [socials, setSocials] = useState<{ label: string, href: string }[]>([]);
  const [links, setLinks] = useState<{ title: LocalizedString, items: { label: LocalizedString, href: string }[] }[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const t = useTranslations("FooterIndex");

  useEffect(() => {
    async function fetchFooter() {
      try {
        const res = await fetch("/api/footer");
        if (res.ok) {
          const data = await res.json();
          setHeading({ 
            primary: data.heading?.primary || { en: "", id: "" }, 
            secondary: data.heading?.secondary || { en: "", id: "" } 
          });
          setContact(data.contact || { email: "", phone: "" });
          setCopyright(data.copyright || { en: "", id: "" });
          setSocials(data.socials || []);
          setLinks(data.links || []);
        } else {
          toast.error("Failed to load footer data.");
        }
      } catch (error) {
        toast.error("An error occurred while loading footer data.");
      } finally {
        setLoading(false);
      }
    }
    fetchFooter();
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
        heading: {
          primary: fallbackStr(heading.primary),
          secondary: fallbackStr(heading.secondary),
        },
        contact,
        copyright: fallbackStr(copyright),
        socials,
        links: links.map(group => ({
          title: fallbackStr(group.title),
          items: group.items.map(item => ({
            label: fallbackStr(item.label),
            href: item.href,
          })),
        })),
      };

      const res = await fetch("/api/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error("Failed to update footer");
      }

      toast.success("Footer updated successfully!");
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
        <h1 className="font-serif text-3xl text-gray-900 dark:text-gray-100 tracking-tight">{t('footer_settings')}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('manage_the_global_footer_content_links_and_contact_information')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl bg-white shadow-none overflow-hidden dark:bg-gray-900 dark:border-gray-800">
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Type className="size-5 text-indigo-500" />
              Main Heading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Primary Text (Sans-serif)</Label>
                <Input
                  value={heading.primary[locale]}
                  onChange={(e) => setHeading({ ...heading, primary: { ...heading.primary, [locale]: e.target.value } })}
                  placeholder="LET'S WORK"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Text (Italic Serif)</Label>
                <Input
                  value={heading.secondary[locale]}
                  onChange={(e) => setHeading({ ...heading, secondary: { ...heading.secondary, [locale]: e.target.value } })}
                  placeholder="Together"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Mail className="size-5 text-indigo-500" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  placeholder="hello@beethoval.dev"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="+62 812 3456 7890"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Share2 className="size-5 text-indigo-500" />
              Social Media
            </h2>
            <div className="space-y-3">
              {socials.map((social, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Input
                    value={social.label}
                    onChange={(e) => {
                      const newSocials = [...socials];
                      newSocials[i].label = e.target.value;
                      setSocials(newSocials);
                    }}
                    placeholder="Platform (e.g. Twitter)"
                    className="w-1/3"
                    required
                  />
                  <Input
                    value={social.href}
                    onChange={(e) => {
                      const newSocials = [...socials];
                      newSocials[i].href = e.target.value;
                      setSocials(newSocials);
                    }}
                    placeholder="URL"
                    className="flex-1"
                    required
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setSocials(socials.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setSocials([...socials, { label: "", href: "" }])} className="mt-2">
                <Plus className="size-4 mr-1" /> Add Social Link
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <LinkIcon className="size-5 text-indigo-500" />
              Footer Links
            </h2>
            <div className="space-y-6">
              {links.map((group, groupIdx) => (
                <div key={groupIdx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <Label>Column Title</Label>
                      <Input
                        value={group.title[locale]}
                        onChange={(e) => {
                          const newLinks = [...links];
                          newLinks[groupIdx].title = { ...newLinks[groupIdx].title, [locale]: e.target.value };
                          setLinks(newLinks);
                        }}
                        placeholder="e.g. Services"
                        required
                      />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setLinks(links.filter((_, i) => i !== groupIdx))} className="text-red-500 hover:text-red-600 hover:bg-red-50 mt-5">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/30">
                    {group.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-2">
                        <Input
                          value={item.label[locale] || ""}
                          onChange={(e) => {
                            const newLinks = [...links];
                            newLinks[groupIdx].items[itemIdx].label = { 
                              ...(newLinks[groupIdx].items[itemIdx].label || { en: "", id: "" }), 
                              [locale]: e.target.value 
                            };
                            setLinks(newLinks);
                          }}
                          placeholder="Link Label"
                          className="w-1/3 text-sm"
                          required
                        />
                        <Input
                          value={item.href}
                          onChange={(e) => {
                            const newLinks = [...links];
                            newLinks[groupIdx].items[itemIdx].href = e.target.value;
                            setLinks(newLinks);
                          }}
                          placeholder="URL or anchor (e.g. /#services)"
                          className="flex-1 text-sm"
                          required
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                          const newLinks = [...links];
                          newLinks[groupIdx].items = newLinks[groupIdx].items.filter((_, i) => i !== itemIdx);
                          setLinks(newLinks);
                        }} className="text-red-500 hover:text-red-600 h-9 w-9">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="ghost" size="sm" onClick={() => {
                      const newLinks = [...links];
                      newLinks[groupIdx].items.push({ label: { en: "", id: "" }, href: "" });
                      setLinks(newLinks);
                    }} className="mt-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                      <Plus className="size-4 mr-1" /> Add Link
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setLinks([...links, { title: { en: "", id: "" }, items: [] }])}>
                <Plus className="size-4 mr-1" /> Add Link Column
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100">Copyright Text</h2>
            <div className="space-y-2">
              <Input
                value={copyright[locale]}
                onChange={(e) => setCopyright({ ...copyright, [locale]: e.target.value })}
                placeholder="© 2026 Beethoval. All rights reserved."
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
