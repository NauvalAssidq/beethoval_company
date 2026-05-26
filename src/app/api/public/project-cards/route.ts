import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const projects = await db
      .collection("projects")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = projects.map((p) => ({
      _id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      description: p.description,
      coverImage: p.coverImage || "",
      marqueeImage: p.marqueeImage || "",
      techStack: p.techStack || [],
    }));

    return NextResponse.json(serialized);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
