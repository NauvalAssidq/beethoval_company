import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const footerSettings = await db.collection("settings").findOne({ type: "footer" });

    if (!footerSettings) {
      return NextResponse.json(defaultFooterData);
    }

    return NextResponse.json(footerSettings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
