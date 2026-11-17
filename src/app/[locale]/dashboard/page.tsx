import type { Metadata } from "next";
import clientPromise from "@/lib/mongodb";
import { Link } from "@/i18n/routing";
import {
  ArrowUpRight,
  FolderKanban,
  FileText,
  Images,
  HelpCircle,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { resolveTranslation } from "@/types/i18n";
import { Card } from "@/components/ui/card";
import { getVisitStats } from "@/lib/visit-stats";
import { VisitorAnalyticsCard } from "@/components/features/dashboard/VisitorAnalyticsCard";
import { RecentContentCard } from "@/components/features/dashboard/RecentContentCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("DashboardPage");

  const client = await clientPromise;
  const db = client.db("portfolio");

  const [
    projectCount,
    newsCount,
    faqCount,
    galleryCount,
    initialVisitStats,
    recentProjectsRaw,
    recentNewsRaw,
    recentGalleries,
  ] = await Promise.all([
    db.collection("projects").estimatedDocumentCount(),
    db.collection("news").estimatedDocumentCount(),
    db.collection("faqs").estimatedDocumentCount(),
    db.collection("galleries").estimatedDocumentCount(),
    getVisitStats("30d", locale),
    db
      .collection("projects")
      .find({}, { projection: { title: 1, coverImage: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray(),
    db
      .collection("news")
      .find({}, { projection: { title: 1, coverImage: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray(),
    db
      .collection("galleries")
      .find({}, { projection: { url: 1 } })
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray(),
  ]);

  const formatDate = (date: unknown) => {
    if (!date) return "";
    const d = new Date(date as string | Date);
    return d.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const recentProjects = recentProjectsRaw.map((p) => ({
    _id: p._id.toString(),
    title: resolveTranslation(p.title as any, locale),
    coverImage: p.coverImage || "",
    dateLabel: `${t("added")} ${formatDate(p.createdAt)}`,
  }));

  const recentArticles = recentNewsRaw.map((n) => ({
    _id: n._id.toString(),
    title: resolveTranslation(n.title as any, locale),
    coverImage: n.coverImage || "",
    dateLabel: `${t("published")} ${formatDate(n.createdAt)}`,
  }));

  const kpis = [
    {
      label: t("projects"),
      count: projectCount,
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      label: t("articles"),
      count: newsCount,
      href: "/dashboard/news",
      icon: FileText,
    },
    {
      label: t("gallery"),
      count: galleryCount,
      href: "/dashboard/gallery",
      icon: Images,
    },
    {
      label: t("faqs"),
      count: faqCount,
      href: "/dashboard/faqs",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full lg:h-[calc(100dvh-6.5rem)] lg:overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-2xl sm:text-3xl tracking-tight text-zinc-900 dark:text-white leading-none">
            <span className="font-sans font-normal">{t("studio_overview")}</span>{" "}
            <span className="font-serif italic text-indigo-600 dark:text-indigo-400">
              {t("studio_accent")}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/dashboard/projects/create"
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-zinc-900 dark:bg-indigo-600 text-white text-[11px] font-semibold tracking-wide hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
          >
            <Plus className="size-3.5" />
            <span>{t("new_project")}</span>
          </Link>
          <Link
            href="/dashboard/news/create"
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-200 text-[11px] font-semibold tracking-wide hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <Plus className="size-3.5" />
            <span>{t("new_article")}</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-[11px] font-semibold tracking-wide hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <span>{t("view_live")}</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            {kpis.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group block">
                  <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none px-4 py-3 flex flex-col gap-2 transition-colors hover:border-indigo-300 dark:hover:border-indigo-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 truncate">
                        {item.label}
                      </span>
                      <Icon className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-serif text-3xl leading-none text-zinc-900 dark:text-white tabular-nums">
                        {item.count}
                      </span>
                      <ArrowUpRight className="size-3.5 text-zinc-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <VisitorAnalyticsCard initialStats={initialVisitStats} />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4 min-h-0">
          <div className="flex-[1.35] min-h-0 flex flex-col [&>*]:flex-1">
            <RecentContentCard
              projects={recentProjects}
              articles={recentArticles}
            />
          </div>

          <Card className="flex-[0.85] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none p-4 flex flex-col min-h-0 gap-3">
            <div className="flex items-center justify-between shrink-0">
              <span className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                <Images className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                {t("gallery_overview")}
              </span>
              <Link
                href="/dashboard/gallery"
                className="text-[10px] text-indigo-600 hover:underline font-bold uppercase tracking-wider"
              >
                {t("manage_gallery")}
              </Link>
            </div>

            {recentGalleries.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 lg:grid-rows-2 gap-2.5 flex-1 min-h-0">
                {recentGalleries.map((img) => (
                  <Link
                    href="/dashboard/gallery"
                    key={`g-${img._id}`}
                    className="group relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[72px] rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                  >
                    <Image
                      src={img.url}
                      alt="Gallery image"
                      fill
                      sizes="(max-width: 768px) 33vw, 14vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full flex-1 min-h-[90px] flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                <Images className="size-5 text-zinc-300 dark:text-zinc-700 mb-1" />
                <p className="text-xs text-zinc-500">
                  {t("no_images_in_gallery")}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
