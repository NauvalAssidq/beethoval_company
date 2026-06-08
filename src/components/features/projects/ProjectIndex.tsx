"use client";

import { useState, useEffect, useTransition } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  ArrowUpDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDialog } from "./DeleteDialog";
import { toast } from "sonner";
import { type Project, type ProjectsResponse } from "@/types/project";

const SORT_OPTIONS = [
  { label: "Newest", value: "createdAt", order: "desc" },
  { label: "Oldest", value: "createdAt", order: "asc" },
  { label: "Title A–Z", value: "title", order: "asc" },
  { label: "Title Z–A", value: "title", order: "desc" },
];

export function ProjectIndex() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(1);
  const [sortIndex, setSortIndex] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setDebouncedSearch(search);
        setPage(1);
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const sortOption = SORT_OPTIONS[sortIndex];
  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
    sort: sortOption.value,
    order: sortOption.order,
  });
  if (debouncedSearch) params.set("search", debouncedSearch);

  const { data, isLoading: loading, mutate } = useSWR<ProjectsResponse>(
    `/api/project?${params.toString()}`,
    fetcher,
    { keepPreviousData: true }
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/project/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete");
      }
      toast.success(`"${deleteTarget.title}" has been deleted`);
      setDeleteTarget(null);
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-gray-900 dark:text-gray-100">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            {data ? `${data.total} project${data.total !== 1 ? "s" : ""} total` : "Loading..."}
          </p>
        </div>
        <Link
          href="/dashboard/projects/create"
          className="inline-flex items-center justify-center rounded-full px-5 gap-2 h-9 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 shadow-none border-none transition-colors"
        >
          <Plus className="size-4" />
          <span>New Project</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-10 rounded-full border-gray-200 bg-white shadow-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 dark:bg-gray-900 dark:border-gray-800"
          />
        </div>

        <div className="relative">
          <Button
            variant="outline"
            className="rounded-full gap-2 shadow-none h-10"
            onClick={() => setSortOpen(!sortOpen)}
          >
            <ArrowUpDown className="size-3.5" />
            <span className="text-sm">{SORT_OPTIONS[sortIndex].label}</span>
          </Button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl z-20 py-1 shadow-none dark:bg-gray-900 dark:border-gray-800">
              {SORT_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSortIndex(i);
                    setSortOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm transition-colors",
                    i === sortIndex
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden shadow-none dark:bg-gray-900 dark:border-gray-800">
                <Skeleton className="w-full aspect-video rounded-none" />
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <div className="space-y-2 mt-1">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
                    <Skeleton className="h-3 w-24 rounded-sm" />
                    <Skeleton className="h-3 w-20 rounded-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data && data.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((project) => (
              <div
                key={project._id}
                className="group flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden shadow-none transition-all dark:bg-gray-900 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
              >
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
                  {project.coverImage || project.marqueeImage ? (
                    <Image 
                      src={(project.coverImage || project.marqueeImage) as string} 
                      alt={project.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/20">
                      <FolderOpen className="size-8 text-indigo-300 dark:text-indigo-700" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon-sm"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm dark:bg-gray-900/90 dark:text-gray-300 dark:hover:bg-gray-800 border-0"
                      onClick={() => router.push(`/dashboard/projects/${project._id}/edit`)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      className="h-8 w-8 rounded-full shadow-sm"
                      onClick={() => setDeleteTarget(project)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-serif text-[20px] tracking-tight text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-5 flex-1 leading-relaxed">
                    {project.description || "No description provided."}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
                    <span className="font-mono">/{project.slug}</span>
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800">
            <FolderOpen className="size-10 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500">
              {debouncedSearch ? "No projects match your search" : "No projects yet"}
            </p>
            {!debouncedSearch && (
              <Link
                href="/dashboard/projects/create"
                className="inline-flex items-center justify-center rounded-full px-5 gap-2 h-9 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 shadow-none border-none mt-2 transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                <Plus className="size-4" />
                <span>Create your first project</span>
              </Link>
            )}
          </div>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {data.page} of {data.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full shadow-none gap-1.5"
              disabled={data.page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-8 h-8 rounded-full text-sm font-medium transition-colors",
                    p === data.page
                      ? "bg-gray-900 text-white dark:bg-indigo-600"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full shadow-none gap-1.5"
              disabled={data.page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      <DeleteDialog
        open={!!deleteTarget}
        title={deleteTarget?.title || ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
