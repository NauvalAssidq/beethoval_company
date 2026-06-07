import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid news ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const article = await db.collection("news").findOne({ _id: new ObjectId(id) });

    if (!article) {
      return NextResponse.json({ error: "News article not found" }, { status: 404 });
    }

    return NextResponse.json({ ...article, _id: article._id.toString() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid news ID" }, { status: 400 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, tags } = body;

    const client = await clientPromise;
    const db = client.db("portfolio");

    const existing = await db.collection("news").findOne({
      slug,
      _id: { $ne: new ObjectId(id) },
    });
    if (existing) {
      return NextResponse.json({ error: "A news article with this slug already exists" }, { status: 409 });
    }

    const result = await db.collection("news").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          slug,
          excerpt,
          content,
          coverImage,
          tags: tags || [],
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "News article not found" }, { status: 404 });
    }

    revalidatePath("/", "page");
    revalidatePath("/news");
    revalidatePath(`/news/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid news ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection("news").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "News article not found" }, { status: 404 });
    }

    revalidatePath("/", "page");
    revalidatePath("/news");
    revalidatePath("/news/[slug]", "page");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
