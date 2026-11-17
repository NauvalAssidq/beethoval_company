"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, Plus, FolderKanban, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface RecentContentItem {
  _id: string;
  title: string;
  coverImage?: string;
  dateLabel: string;
}

interface RecentContentCardProps {
  projects: RecentContentItem[];
  articles: RecentContentItem[];
}

export function RecentContentCard({
  projects,
  articles,
}: RecentContentCardProps) {
  const t = useTranslations("DashboardPage");
  const [tab, setTab] = useState<"projects" | "articles">("projects");

  const items = tab === "projects" ? projects : articles;
  const viewAllHref =
    tab === "projects" ? "/dashboard/projects" : "/dashboard/news";
  const createHref =
    tab === "projects" ? "/dashboard/projects/create" : "/dashboard/news/create";

  return (
    <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none flex flex-col overflow-hidden min-h-0 p-0 gap-0">
      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-2 shrink-0">
        <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setTab("projects")}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all",
              tab === "projects"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            <FolderKanban className="size-3 text-indigo-600 dark:text-indigo-400" />
            <span>{t("projects")}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("articles")}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all",
              tab === "articles"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            <FileText className="size-3 text-indigo-600 dark:text-indigo-400" />
            <span>{t("articles")}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={createHref}
            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors"
          >
            <Plus className="size-3" />
            <span>{t("new_item")}</span>
          </Link>
          <Link
            href={viewAllHref}
            className="text-[10px] text-zinc-500 hover:text-indigo-600 font-bold uppercase tracking-wider transition-colors"
          >
            {t("view_all")}
          </Link>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0 divide-y divide-zinc-100 dark:divide-zinc-900">
        {items.map((item) => {
          const editHref =
            tab === "projects"
              ? `/dashboard/projects/${item._id}/edit`
              : `/dashboard/news/${item._id}/edit`;

          return (
            <Link
              key={`${tab}-${item._id}`}
              href={editHref}
              className="group flex items-center gap-3 px-4 flex-1 min-h-[54px] hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <div className="relative size-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 shrink-0">
                {item.coverImage ? (
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="40px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-serif italic text-zinc-400">
                    {item.title[0] || "B"}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">
                  {item.dateLabel}
                </p>
              </div>

              <ArrowUpRight className="size-3.5 text-zinc-300 group-hover:text-indigo-600 transition-colors shrink-0" />
            </Link>
          );
        })}

        {items.length === 0 && (
          <div className="p-6 text-sm text-zinc-500 text-center my-auto">
            {tab === "projects" ? t("no_projects_found") : t("no_articles_found")}
          </div>
        )}
      </div>
    </Card>
  );
}
