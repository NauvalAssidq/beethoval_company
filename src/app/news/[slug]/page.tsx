import { notFound } from "next/navigation";
import { NewsDetailClient } from "@/components/features/news/NewsDetailClient";
import clientPromise from "@/lib/mongodb";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const client = await clientPromise;
  const db = client.db("portfolio");

  const article = await db.collection("news").findOne({ slug });

  if (!article) return null;

  const allNews = await db
    .collection("news")
    .find({}, { projection: { title: 1, slug: 1, coverImage: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .toArray();

  const currentIndex = allNews.findIndex(
    (n) => n._id.toString() === article._id.toString()
  );

  const prevArticle =
    currentIndex > 0
      ? {
          title: allNews[currentIndex - 1].title,
          slug: allNews[currentIndex - 1].slug,
          coverImage: allNews[currentIndex - 1].coverImage || "",
        }
      : null;

  const nextArticle =
    currentIndex < allNews.length - 1
      ? {
          title: allNews[currentIndex + 1].title,
          slug: allNews[currentIndex + 1].slug,
          coverImage: allNews[currentIndex + 1].coverImage || "",
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
