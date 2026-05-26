import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const projects = await db.collection("projects").find({}).toArray();
    const galleries = await db.collection("galleries").find({}).toArray();

    const mixed = [
      ...projects.map(p => ({
        id: p._id.toString(),
        type: "project",
        url: p.marqueeImage || p.marqueeImages?.[0] || "",
        order: p.order || 0
      })).filter(p => p.url),
      ...galleries.map(g => ({
        id: g._id.toString(),
        type: "gallery",
        url: g.url,
        order: g.order || 0
      }))
    ];

    mixed.sort((a, b) => a.order - b.order);

    return NextResponse.json(mixed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
