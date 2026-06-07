"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import DOMPurify from "isomorphic-dompurify";
import { useReveal } from "@/hooks/useReveal";
import Image from "next/image";

interface ProjectNav {
  title: string;
  slug: string;
  coverImage: string;
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: string;
  marqueeImage: string;
  techStack: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectDetailClientProps {
  project: Project;
  prevProject: ProjectNav | null;
  nextProject: ProjectNav | null;
}

// removed local useReveal

export function ProjectDetailClient({
  project,
  prevProject,
  nextProject,
}: ProjectDetailClientProps) {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 80);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const metaReveal = useReveal(0.2);
  const contentReveal = useReveal(0.05);
  const navReveal = useReveal(0.15);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar transparentTheme="dark" />

      <div className="relative h-[100vh] w-full overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover blur-xs scale-100"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-950" />
        )}

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-9xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
            {project.techStack.length > 0 && (
              <div
                className="flex flex-wrap gap-2 mb-6 animate-fade-up"
                style={{ "--delay": "200ms" } as React.CSSProperties}
              >
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-medium text-white/80 border border-white/25 px-3 py-1.5 backdrop-blur-sm bg-white/5 tracking-wide uppercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-tight leading-[1.05] max-w-5xl animate-fade-up"
              style={{ "--delay": "400ms" } as React.CSSProperties}
            >
              {project.title}
            </h1>

            {project.description && (
              <p
                className="text-base sm:text-lg text-white/60 font-medium max-w-xl mt-5 leading-relaxed animate-fade-up"
                style={{ "--delay": "600ms" } as React.CSSProperties}
              >
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
          style={{ "--delay": "1200ms" } as React.CSSProperties}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>

      <div
        ref={metaReveal.ref}
        className={cn(
          "border-b border-gray-200 transition-all duration-700",
          metaReveal.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        )}
      >
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-3">
              <Calendar className="size-4 text-gray-300 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
                  Published
                </span>
                <span className="text-sm text-gray-700 font-medium">
                  {project.createdAt ? formatDate(project.createdAt) : "—"}
                </span>
              </div>
            </div>

            {project.techStack.length > 0 && (
              <div className="flex items-start gap-3">
                <Layers className="size-4 text-gray-300 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
                    Technology
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    {project.techStack.join(" · ")}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <ArrowUpRight className="size-4 text-gray-300 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
                  Slug
                </span>
                <span className="text-sm text-gray-700 font-mono font-medium">
                  /{project.slug}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={contentReveal.ref}
        className={cn(
          "transition-all duration-1000 ease-out",
          contentReveal.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        )}
      >
        <article className="max-w-2xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-32">
          <div
            className={cn(
              "prose prose-lg max-w-none prose-public",
              "prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-gray-900",
              "prose-p:font-sans prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:text-[17px]",
              "prose-a:text-indigo-600 prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:text-indigo-800 prose-a:font-medium prose-a:decoration-indigo-300",
              "prose-img:rounded-none prose-img:shadow-none prose-img:my-12 prose-img:w-[100vw] prose-img:max-w-[100vw] prose-img:relative prose-img:-left-1/2 prose-img:translate-x-[-50%] prose-img:ml-[50%]",
              "prose-blockquote:border-l-2 prose-blockquote:border-indigo-500 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-gray-500 prose-blockquote:pl-6 prose-blockquote:not-italic",
              "prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
              "prose-pre:bg-[#1e1e2e] prose-pre:rounded-xl prose-pre:text-sm",
              "prose-li:text-gray-600 prose-li:text-[17px] prose-li:leading-[1.8]",
              "prose-strong:text-gray-900 prose-strong:font-semibold",
              "prose-hr:border-gray-200 prose-hr:my-16",
              "prose-table:border-collapse prose-table:w-full",
              "prose-sub:text-xs prose-sup:text-xs"
            )}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.content) }}
          />
        </article>
      </div>

      {(prevProject || nextProject) && (
        <div
          ref={navReveal.ref}
          className={cn(
            "border-t border-gray-200 transition-all duration-1000 ease-out",
            navReveal.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {prevProject ? (
              <Link
                href={`/project/${prevProject.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden h-[50vh] md:h-[60vh] p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200"
              >
                {prevProject.coverImage ? (
                  <Image
                    src={prevProject.coverImage}
                    alt={prevProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />

                <div className="relative z-10">
                  <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest block mb-3">
                    ← Previous Project
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
                    {prevProject.title}
                  </h3>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}

            {nextProject ? (
              <Link
                href={`/project/${nextProject.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden h-[50vh] md:h-[60vh] p-8 md:p-12"
              >
                {nextProject.coverImage ? (
                  <Image
                    src={nextProject.coverImage}
                    alt={nextProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />

                <div className="relative z-10 text-right">
                  <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest block mb-3">
                    Next Project →
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
                    {nextProject.title}
                  </h3>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-gray-200 py-12 md:py-16">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-lg font-bold tracking-tight text-gray-900"
          >
            <span className="italic">Beethoval</span>
            <span className="not-italic text-indigo-600">.dev</span>
          </Link>

          <Link
            href="/#projects"
            className="text-[13px] font-medium text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center gap-1.5"
          >
            <span>All Projects</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </footer>
    </main>
  );
}
