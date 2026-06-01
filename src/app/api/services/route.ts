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
    const search = searchParams.get("search") || "";

    const client = await clientPromise;
    const db = client.db("portfolio");

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const services = await db
      .collection("services")
      .find(filter)
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const serialized = services.map((s) => ({
      ...s,
      _id: s._id.toString(),
    }));

    return NextResponse.json({ services: serialized });
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
    const { title, description, icon } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const maxOrderService = await db
      .collection("services")
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    
    let nextOrder = 0;
    if (maxOrderService.length > 0 && typeof maxOrderService[0].order === 'number') {
      nextOrder = maxOrderService[0].order + 1;
    }

    const newService = {
      title,
      description,
      icon: icon || null,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("services").insertOne(newService);

    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
