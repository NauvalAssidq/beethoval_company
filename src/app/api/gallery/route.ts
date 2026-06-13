import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const galleries = await db
      .collection("galleries")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const serialized = galleries.map((g) => ({
      ...g,
      _id: g._id.toString(),
    }));

    return NextResponse.json(serialized);
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
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const highestOrderDoc = await db.collection("galleries").find().sort({ order: -1 }).limit(1).toArray();
    const newOrder = highestOrderDoc.length > 0 ? (highestOrderDoc[0].order || 0) + 1 : 1;

    const newImage = {
      url,
      order: newOrder,
      createdAt: new Date(),
    };

    const result = await db.collection("galleries").insertOne(newImage);

    revalidateTag("gallery", undefined as any);
    revalidatePath("/", "page");

    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
