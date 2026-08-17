import { notFound } from "next/navigation";
import { NewsDetailClient } from "@/components/features/news/NewsDetailClient";
import clientPromise from "@/lib/mongodb";
import type { Metadata } from "next";
import { cache } from "react";
import { resolveTranslation } from "@/types/i18n";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

const getArticle = cache(async (rawSlug: string) => {
  try {
    const slug = decodeURIComponent(rawSlug);
    const client = await clientPromise;
    const db = client.db("portfolio");

    const article = await db.collection("news").findOne({ 
      $or: [
        { "slug.en": slug },
        { "slug.id": slug },
        { slug: slug }
      ]
    });

    if (!article) return null;

    const [prevRecord, nextRecord] = await Promise.all([
      db.collection("news").findOne(
        { createdAt: { $gt: article.createdAt } },
        { sort: { createdAt: 1 }, projection: { _id: 0, title: 1, slug: 1, coverImage: 1 } }
      ),
      db.collection("news").findOne(
        { createdAt: { $lt: article.createdAt } },
        { sort: { createdAt: -1 }, projection: { _id: 0, title: 1, slug: 1, coverImage: 1 } }
      )
    ]);

    const prevArticle = prevRecord
      ? {
          title: prevRecord.title,
          slug: prevRecord.slug,
          coverImage: prevRecord.coverImage || "",
        }
      : null;

    const nextArticle = nextRecord
      ? {
          title: nextRecord.title,
          slug: nextRecord.slug,
          coverImage: nextRecord.coverImage || "",
        }
      : null;

    const result = {
      article: {
        _id: article._id.toString(),
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || "",
        content: article.content || "",
        coverImage: article.coverImage || "",
        tags: article.tags || [],
        createdAt: article.createdAt?.toISOString?.() ?? String(article.createdAt ?? ""),
        updatedAt: article.updatedAt?.toISOString?.() ?? String(article.updatedAt ?? ""),
      },
      prevArticle,
      nextArticle,
    };

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("Error in getArticle:", error);
    return null;
  }
});

export async function generateStaticParams() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const articles = await db.collection("news").find({}, { projection: { slug: 1 } }).toArray();
    
    const params: { slug: string; locale: string }[] = [];
    for (const article of articles) {
      if (article.slug) {
        const slugs: string[] = [];
        if (typeof article.slug === "string") {
          slugs.push(article.slug);
        } else {
          if (article.slug.en) slugs.push(article.slug.en);
          if (article.slug.id && article.slug.id !== article.slug.en) slugs.push(article.slug.id);
        }

        for (const s of slugs) {
          params.push({ slug: s, locale: "en" });
          params.push({ slug: s, locale: "id" });
        }
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug, locale } = await params;
    const data = await getArticle(slug);

    if (!data) {
      return { title: "Article Not Found | Beethoval.dev" };
    }

    const { article } = data;
    const title = resolveTranslation(article.title, locale);
    const excerpt = resolveTranslation(article.excerpt, locale) || `${title} — Beethoval.dev`;

    return {
      title: `${title} | Beethoval.dev`,
      description: excerpt,
      openGraph: {
        title: `Beethoval.dev | ${title}`,
        description: excerpt,
        images: article.coverImage ? [{ url: article.coverImage }] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `Beethoval.dev | ${title}`,
        description: excerpt,
        images: article.coverImage ? [article.coverImage] : [],
      },
    };
  } catch {
    return { title: "News | Beethoval.dev" };
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug, locale } = await params;
  const data = await getArticle(slug);

  if (!data) {
    notFound();
  }

  return (
    <NewsDetailClient
      article={data.article as any}
      prevArticle={data.prevArticle as any}
      nextArticle={data.nextArticle as any}
    />
  );
}
