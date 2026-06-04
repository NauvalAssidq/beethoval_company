import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { validateCSRF } from "@/lib/security";

export async function PUT(req: Request) {
  try {
    if (!validateCSRF(req)) {
      return NextResponse.json({ error: "Forbidden - CSRF check failed" }, { status: 403 });
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const bulkOps = items.map((item: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: new ObjectId(item.id) },
        update: { $set: { order: item.order } },
      },
    }));

    if (bulkOps.length > 0) {
      await db.collection("services").bulkWrite(bulkOps);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT Service reorder Error:", error);
    return NextResponse.json({ error: "Failed to reorder services" }, { status: 500 });
  }
}
