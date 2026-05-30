import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const client = await clientPromise;
    const db = client.db("portfolio");

    const article = await db.collection("news").findOne({ slug });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

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

    return NextResponse.json({
      article: {
        _id: article._id.toString(),
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || "",
        content: article.content || "",
        coverImage: article.coverImage || "",
        tags: article.tags || [],
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      },
      prevArticle,
      nextArticle,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
