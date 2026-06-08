import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { validateCSRF, sanitizeInput } from "@/lib/security";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const hero = await db.collection("hero").findOne({});

    if (!hero) {
      return NextResponse.json({
        line1: "Crafting Digital",
        highlightWord1: "Experiences",
        highlightAction1: "circle",
        separator: "&",
        highlightWord2: "Solutions",
        highlightAction2: "highlight",
        line3: "For Your Business",
        subtitle: "High-performance web applications on hand, with professional grade interface"
      });
    }

    return NextResponse.json({ ...hero, _id: hero._id.toString() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!validateCSRF(req)) {
      return NextResponse.json({ error: "Invalid CSRF Origin" }, { status: 403 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body = await req.json();
    body = sanitizeInput(body);
    
    const { 
      line1, 
      highlightWord1, 
      highlightAction1, 
      separator, 
      highlightWord2, 
      highlightAction2, 
      line3, 
      subtitle 
    } = body;

    const client = await clientPromise;
    const db = client.db("portfolio");

    const newHeroConfig = {
      line1,
      highlightWord1,
      highlightAction1,
      separator,
      highlightWord2,
      highlightAction2,
      line3,
      subtitle,
      updatedAt: new Date(),
    };

    await db.collection("hero").updateOne(
      {},
      { $set: newHeroConfig },
      { upsert: true }
    );

    revalidatePath("/", "page");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
