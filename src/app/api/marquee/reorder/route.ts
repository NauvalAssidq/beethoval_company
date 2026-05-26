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

    // Perform bulk updates
    const bulkOperationsByCollection: Record<string, any[]> = {
      projects: [],
      galleries: []
    };

    items.forEach((item: { id: string, type: "project" | "gallery", order: number }) => {
      const collectionName = item.type === "project" ? "projects" : "galleries";
      bulkOperationsByCollection[collectionName].push({
        updateOne: {
          filter: { _id: new ObjectId(item.id) },
          update: { $set: { order: item.order } }
        }
      });
    });

    if (bulkOperationsByCollection.projects.length > 0) {
      await db.collection("projects").bulkWrite(bulkOperationsByCollection.projects);
    }
    
    if (bulkOperationsByCollection.galleries.length > 0) {
      await db.collection("galleries").bulkWrite(bulkOperationsByCollection.galleries);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
