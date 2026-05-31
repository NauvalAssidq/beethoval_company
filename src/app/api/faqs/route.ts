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
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ];
    }

    const faqs = await db
      .collection("faqs")
      .find(filter)
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const serialized = faqs.map((f) => ({
      ...f,
      _id: f._id.toString(),
    }));

    return NextResponse.json({ faqs: serialized });
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
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const maxOrderFaq = await db
      .collection("faqs")
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    
    let nextOrder = 0;
    if (maxOrderFaq.length > 0 && typeof maxOrderFaq[0].order === 'number') {
      nextOrder = maxOrderFaq[0].order + 1;
    }

    const newFaq = {
      question,
      answer,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("faqs").insertOne(newFaq);

    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
