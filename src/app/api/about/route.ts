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
    const about = await db.collection("about").findOne({});
    
    return NextResponse.json(about || {
      heading: "Technology shouldn't be a barrier; it should be an <em>equalizer</em>.<br class=\"hidden md:block\"/>Great digital products are no longer just about complex code, but about <em>clarity</em>, <em>purpose</em>, and <em>seamless experiences</em>.",
      description: "In a cluttered digital landscape filled with bloated software and unnecessary noise, Beethoval helps startups and small industries penetrate the tech world with clean, purposeful design and solid engineering. We build digital experiences stripped of the excess—delivering intuitive, flat interfaces and robust full-stack solutions that don't just function, but genuinely empower your business to stand out and thrive.",
      location: "Banda Aceh, Indonesia",
    });
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

    const { heading, description, location } = body;

    const client = await clientPromise;
    const db = client.db("portfolio");

    const newAbout = {
      heading,
      description,
      location,
      updatedAt: new Date(),
    };

    await db.collection("about").updateOne(
      {},
      { $set: newAbout },
      { upsert: true }
    );

    revalidatePath("/", "page");
    revalidatePath("/dashboard/about");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
