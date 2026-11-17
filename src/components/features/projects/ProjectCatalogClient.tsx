"use client";

import React, { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveTranslation, type LocalizedString } from "@/types/i18n";

export interface CatalogProject {
  _id: string;
  title: LocalizedString | string;
  slug: LocalizedString | string;
  description: LocalizedString | string;
  coverImage: string;
  marqueeImage?: string;
  techStack: string[];
  createdAt?: string;
}

interface ProjectCatalogClientProps {
  projects: CatalogProject[];
}

export function ProjectCatalogClient({ projects }: ProjectCatalogClientProps) {
  const locale = useLocale() as "en" | "id";
  const t = useTranslations("ProjectCatalog");

  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("all");

  const techOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      for (const tech of p.techStack || []) {
        counts.set(tech, (counts.get(tech) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tech]) => tech);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const title = resolveTranslation(p.title as any, locale).toLowerCase();
      const desc = resolveTranslation(p.description as any, locale).toLowerCase();
      const techs = p.techStack || [];

      const matchesTech = selectedTech === "all" || techs.includes(selectedTech);
      const matchesSearch =
        !q ||
        title.includes(q) ||
        desc.includes(q) ||
        techs.some((tech) => tech.toLowerCase().includes(q));

      return matchesTech && matchesSearch;
    });
  }, [projects, search, selectedTech, locale]);

  return (
    <>
      <section className="pt-28 pb-12 sm:pt-32 sm:pb-14 md:pt-40 md:pb-16 border-b border-gray-200 bg-white">
        <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 tracking-tight leading-[1.05]">
            <span className="font-sans font-normal">{t("title_primary")}</span>{" "}
            <span className="font-serif italic text-indigo-600">{t("title_accent")}</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-2xl mt-4 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="sticky top-[72px] z-30 bg-[#fafafa]/90 backdrop-blur-md border-b border-gray-200">
        <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">
              <div className="relative w-full sm:w-64 md:w-72 shrink-0">
                <Search className="size-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="w-full h-10 pl-10 pr-8 text-[13px] bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {techOptions.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setSelectedTech("all")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap transition-colors border",
                      selectedTech === "all"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                    )}
                  >
                    {t("all_tech")}
                  </button>
                  {techOptions.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => setSelectedTech(tech)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap transition-colors border",
                        selectedTech === tech
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                      )}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 shrink-0 self-end md:self-auto">
              {t("showing_count", { count: filteredProjects.length })}
            </span>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 flex-1 bg-[#fafafa]">
        <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center bg-white border border-gray-200">
              <span className="text-6xl text-gray-200 font-serif italic mb-6 select-none">
                P
              </span>
              <h2 className="font-serif text-2xl text-gray-900 mb-2">
                {t("no_projects_found")}
              </h2>
              <p className="text-[14px] text-gray-400 font-medium max-w-sm mb-6 px-4">
                {t("no_projects_hint")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedTech("all");
                }}
                className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-indigo-600 transition-colors"
              >
                {t("reset_filters")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              {filteredProjects.map((project, index) => {
                const title = resolveTranslation(project.title as any, locale);
                const slug = resolveTranslation(project.slug as any, locale);
                const description = resolveTranslation(project.description as any, locale);
                const previewImg = project.coverImage || project.marqueeImage || "";

                return (
                  <Link
                    key={project._id}
                    href={`/project/${slug}`}
                    className="group flex flex-col transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-white border border-gray-200 mb-5 sm:mb-6">
                      {previewImg ? (
                        <Image
                          src={previewImg}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-300 font-serif italic text-6xl select-none">
                            {title[0] || "P"}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                      <div className="absolute top-4 right-4 size-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-md">
                        <ArrowUpRight className="size-4 text-gray-900" />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[12px] font-medium text-gray-300 tabular-nums shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2 className="font-serif text-xl sm:text-2xl text-gray-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                          {title}
                        </h2>
                      </div>

                      {description && (
                        <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium mt-2.5 line-clamp-2 leading-relaxed ml-7">
                          {description}
                        </p>
                      )}

                      {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4 ml-7">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] font-medium text-gray-400 border border-gray-200 bg-white px-2.5 py-1 leading-none"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
