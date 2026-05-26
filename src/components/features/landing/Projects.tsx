"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCard {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  techStack: string[];
}

function ProjectItem({
  project,
  index,
  className,
}: {
  project: ProjectCard;
  index: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "group transition-all duration-1000 ease-out",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16",
        className
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <a
        href={`/project/${project.slug}`}
        className="block relative overflow-hidden bg-gray-100 cursor-pointer"
      >
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
            <span className="text-gray-200 font-serif italic text-6xl md:text-8xl select-none">
              {project.title[0]}
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
              {project.title}
            </h3>
          </div>
          <p className="text-[13px] text-gray-400 font-medium mt-2 line-clamp-2 leading-relaxed ml-9">
            {project.description}
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

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/public/project-cards");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const leftCol = projects.filter((_, i) => i % 2 === 0);
  const rightCol = projects.filter((_, i) => i % 2 === 1);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-[#fafafa] py-24 md:py-32 overflow-hidden"
    >
      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div
          className={cn(
            "transition-all duration-1000 ease-out",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-[13px] font-medium text-indigo-600 tracking-widest uppercase mb-4">
            Selected Work
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gray-900 tracking-tight leading-[1]">
              Projects
            </h2>
            <p className="text-[14px] text-gray-400 font-medium max-w-sm leading-relaxed md:text-right pb-2">
              A curated selection of the digital products
              <br className="hidden md:block" /> and web experiences we&rsquo;ve crafted.
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full mb-16 md:mb-24" />

      <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex flex-col gap-12">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/3] w-full" />
                  <div className="mt-5 space-y-2">
                    <div className="h-6 bg-gray-200 w-48" />
                    <div className="h-4 bg-gray-100 w-72" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-12 md:mt-32">
              {[3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] w-full" />
                  <div className="mt-5 space-y-2">
                    <div className="h-6 bg-gray-200 w-48" />
                    <div className="h-4 bg-gray-100 w-64" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center py-24 text-center transition-all duration-700",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <span className="text-6xl text-gray-200 font-serif italic mb-6 select-none">P</span>
            <h3 className="font-serif text-2xl text-gray-900 mb-2">No projects yet</h3>
            <p className="text-[14px] text-gray-400 font-medium max-w-sm">
              Projects will appear here once they are published from the dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left column */}
            <div className="flex flex-col gap-12 md:gap-16">
              {leftCol.map((project, i) => (
                <ProjectItem
                  key={project._id}
                  project={project}
                  index={i * 2}
                  className="[&_a]:aspect-[4/3]"
                />
              ))}
            </div>
            <div className="flex flex-col gap-12 md:gap-16 md:mt-32">
              {rightCol.map((project, i) => (
                <ProjectItem
                  key={project._id}
                  project={project}
                  index={i * 2 + 1}
                  className="[&_a]:aspect-[3/4]"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
