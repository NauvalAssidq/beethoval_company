import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 3;

    const client = await clientPromise;
    const db = client.db("portfolio");

    const news = await db
      .collection("news")
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const serialized = news.map((n) => ({
      _id: n._id.toString(),
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      coverImage: n.coverImage,
      tags: n.tags || [],
      createdAt: n.createdAt,
    }));

    return NextResponse.json(serialized);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
