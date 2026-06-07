import { notFound } from "next/navigation";
import { NewsDetailClient } from "@/components/features/news/NewsDetailClient";
import clientPromise from "@/lib/mongodb";
import type { Metadata } from "next";
import { cache } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getArticle = cache(async (slug: string) => {
  const client = await clientPromise;
  const db = client.db("portfolio");

  const article = await db.collection("news").findOne({ slug });

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
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticle(slug);

  if (!data) {
    return { title: "Article Not Found" };
  }

  const { article } = data;

  return {
    title: article.title,
    description: article.excerpt || `${article.title} — Beethoval.dev`,
    openGraph: {
      title: `Beethoval.dev | ${article.title}`,
      description: article.excerpt || `${article.title} — Beethoval.dev`,
      images: article.coverImage ? [{ url: article.coverImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Beethoval.dev | ${article.title}`,
      description: article.excerpt || `${article.title} — Beethoval.dev`,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getArticle(slug);

  if (!data) {
    notFound();
  }

  return (
    <NewsDetailClient
      article={data.article}
      prevArticle={data.prevArticle}
      nextArticle={data.nextArticle}
    />
  );
}
