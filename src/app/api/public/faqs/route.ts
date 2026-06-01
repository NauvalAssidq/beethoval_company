import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const faqs = await db
      .collection("faqs")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const serialized = faqs.map((f) => ({
      ...f,
      _id: f._id.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
