import { notFound } from "next/navigation";
import { NewsDetailClient } from "@/components/features/news/NewsDetailClient";
import clientPromise from "@/lib/mongodb";
import type { Metadata } from "next";
import { cache } from "react";

import { resolveTranslation } from "@/types/i18n";

interface PageProps {
  params: Promise<{ slug: string, locale: string }>;
}

const getArticle = cache(async (slug: string) => {
  const client = await clientPromise;
  const db = client.db("portfolio");

  const article = await db.collection("news").findOne({ 
    $or: [
      { "slug.en": slug },
      { "slug.id": slug },
      { slug: slug } // fallback for string slug
    ]
  });

  if (!article) return null;

  const [prevRecord, nextRecord] = await Promise.all([
    db.collection("news").findOne(
      { createdAt: { $gt: article.createdAt } },
      { sort: { createdAt: 1 }, projection: { title: 1, slug: 1, coverImage: 1 } }
    ),
    db.collection("news").findOne(
      { createdAt: { $lt: article.createdAt } },
      { sort: { createdAt: -1 }, projection: { title: 1, slug: 1, coverImage: 1 } }
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

  return {
    article: {
      _id: article._id.toString(),
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content || "",
      coverImage: article.coverImage || "",
      tags: article.tags || [],
      createdAt: article.createdAt?.toISOString?.() ?? article.createdAt ?? "",
      updatedAt: article.updatedAt?.toISOString?.() ?? article.updatedAt ?? "",
    },
    prevArticle,
    nextArticle,
  };
});

export async function generateStaticParams() {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const articles = await db.collection("news").find({}, { projection: { slug: 1 } }).toArray();
  
  const params: { slug: string }[] = [];
  for (const article of articles) {
    if (article.slug) {
      if (typeof article.slug === "string") {
        params.push({ slug: article.slug });
      } else {
        if (article.slug.en) params.push({ slug: article.slug.en });
        if (article.slug.id) params.push({ slug: article.slug.id });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const data = await getArticle(slug);

  if (!data) {
    return { title: "Article Not Found" };
  }

  const { article } = data;

  const title = resolveTranslation(article.title, locale);
  const excerpt = resolveTranslation(article.excerpt, locale) || `${title} — Beethoval.dev`;

  return {
    title: title,
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
