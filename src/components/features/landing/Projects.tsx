"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectCard } from "@/lib/landing-data";
import { useReveal } from "@/hooks/useReveal";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { resolveTranslation } from "@/types/i18n";

function ProjectItem({
  project,
  index,
  className,
}: {
  project: ProjectCard;
  index: number;
  className?: string;
}) {
  const { ref, visible: isInView } = useReveal(0.1) as { ref: React.RefObject<HTMLDivElement>, visible: boolean };
  const locale = useLocale() as "en" | "id";

  return (
    <div
      ref={ref}
      className={cn(
        "group transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16",
        className
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <a
        href={`/project/${resolveTranslation(project.slug as any, locale)}`}
        className="block relative overflow-hidden bg-white cursor-pointer"
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={resolveTranslation(project.title, locale)}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
            <span className="text-gray-200 font-serif italic text-6xl md:text-8xl select-none">
              {resolveTranslation(project.title, locale)[0]}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

        <div className="absolute top-5 right-5 size-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
          <ArrowUpRight className="size-5 text-gray-900" />
        </div>
      </a>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <span className="text-[13px] font-medium text-gray-300 tabular-nums shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-serif text-xl md:text-2xl text-gray-900 tracking-tight leading-tight">
              {resolveTranslation(project.title, locale)}
            </h3>
          </div>
          <p className="text-[13px] text-gray-400 font-medium mt-2 line-clamp-2 leading-relaxed ml-9">
            {resolveTranslation(project.description, locale)}
          </p>
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 ml-9">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-medium text-gray-400 border border-gray-200 pl-[8px] pr-[10px] py-[4px] leading-none"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProjectsProps {
  initialProjects?: ProjectCard[];
}

export function Projects({ initialProjects }: ProjectsProps) {
  const { ref: sectionRef, visible: isInView } = useReveal(0.05) as { ref: React.RefObject<HTMLElement | null>, visible: boolean };
  const t = useTranslations("Projects");

  const projects = initialProjects ?? [];

  const leftCol = projects.filter((_, i) => i % 2 === 0);
  const rightCol = projects.filter((_, i) => i % 2 === 1);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-white py-24 md:py-32 overflow-hidden"
    >
      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight leading-[1.05] mb-6">
            <span className="font-sans font-regular">{t("projects")}</span> <span className="font-sans">&amp;</span> <span className="font-serif italic text-indigo-600">{t("past_experiences")}</span>
          </h2>
          <p className="text-[14px] text-gray-400 font-medium max-w-lg leading-relaxed pb-2">
            {t("projects_description")}
          </p>
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full mb-16 md:mb-24" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {projects.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center py-24 text-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <span className="text-6xl text-gray-200 font-serif italic mb-6 select-none">P</span>
            <h3 className="font-serif text-2xl text-gray-900 mb-2">{t("no_projects_yet")}</h3>
            <p className="text-[14px] text-gray-400 font-medium max-w-sm">
              {t("projects_will_appear_here")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex flex-col gap-12 md:gap-16">
              {leftCol.map((project, i) => (
                <ProjectItem
                  key={project._id}
                  project={project}
                  index={i * 2}
                  className="[&_a]:aspect-square"
                />
              ))}
            </div>
            <div className="flex flex-col gap-12 md:gap-16 md:mt-[calc(50%+6rem)]">
              {rightCol.map((project, i) => (
                <ProjectItem
                  key={project._id}
                  project={project}
                  index={i * 2 + 1}
                  className="[&_a]:aspect-square"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
