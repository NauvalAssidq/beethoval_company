import { notFound } from "next/navigation";
import { NewsDetailClient } from "@/components/features/news/NewsDetailClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/public/news/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
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
