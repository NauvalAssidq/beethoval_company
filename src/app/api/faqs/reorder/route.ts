import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items array is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const bulkOperations = items.map((item: { id: string, order: number }) => ({
      updateOne: {
        filter: { _id: new ObjectId(item.id) },
        update: { $set: { order: item.order } }
      }
    }));

    if (bulkOperations.length > 0) {
      await db.collection("faqs").bulkWrite(bulkOperations);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
