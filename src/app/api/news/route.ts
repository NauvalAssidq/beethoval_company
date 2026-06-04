import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";


export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const client = await clientPromise;
    const db = client.db("portfolio");

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const total = await db.collection("news").countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const news = await db
      .collection("news")
      .find(filter)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const serialized = news.map((n) => ({
      ...n,
      _id: n._id.toString(),
    }));

    return NextResponse.json({
      news: serialized,
      total,
      page,
      totalPages,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, tags } = body;

    const client = await clientPromise;
    const db = client.db("portfolio");

    const existing = await db.collection("news").findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "A news article with this slug already exists" }, { status: 409 });
    }

    const newArticle = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("news").insertOne(newArticle);

    revalidatePath("/", "page");

    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
