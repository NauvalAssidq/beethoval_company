import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { validateCSRF, sanitizeInput } from "@/lib/security";


const defaultFooterData = {
  type: "footer",
  heading: { primary: "LET'S WORK", secondary: "Together" },
  contact: { email: "hello@beethoval.dev", phone: "+62 812 3456 7890" },
  links: [
    {
      title: "Services",
      items: [
        { label: "Web Development", href: "/#services" },
        { label: "UI/UX Design", href: "/#services" },
        { label: "Mobile Apps", href: "/#services" }
      ]
    },
    {
      title: "Company",
      items: [
        { label: "About", href: "/#about" },
        { label: "Projects", href: "/#projects" },
        { label: "News", href: "/#news" },
        { label: "FAQs", href: "/#faqs" }
      ]
    }
  ],
  socials: [
    { label: "Twitter", href: "https://twitter.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "GitHub", href: "https://github.com" }
  ],
  copyright: "© 2026 Beethoval. All rights reserved."
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    let footerSettings = await db.collection("settings").findOne({ type: "footer" });

    if (!footerSettings) {
      await db.collection("settings").insertOne(defaultFooterData);
      footerSettings = defaultFooterData as any;
    }

    return NextResponse.json(footerSettings);
  } catch (error: any) {
    console.error("GET Footer Error:", error);
    return NextResponse.json({ error: "Failed to fetch footer" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!validateCSRF(request)) {
      return NextResponse.json({ error: "Forbidden - CSRF check failed" }, { status: 403 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let data = await request.json();
    data = sanitizeInput(data);
    const client = await clientPromise;
    const db = client.db("portfolio");

    const updateData = { ...data };
    delete updateData._id;

    await db.collection("settings").updateOne(
      { type: "footer" },
      { $set: updateData },
      { upsert: true }
    );

    revalidatePath("/", "page");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT Footer Error:", error);
    return NextResponse.json({ error: "Failed to update footer" }, { status: 500 });
  }
}
