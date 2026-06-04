import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const services = await db
      .collection("services")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const serialized = services.map((s) => ({
      ...s,
      _id: s._id.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
