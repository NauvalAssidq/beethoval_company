import clientPromise from "@/lib/mongodb";
import { unstable_cache } from "next/cache";
import type { Service } from "@/types/service";

export interface ProjectCard {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  techStack: string[];
}

export interface MarqueeItem {
  id: string;
  type: string;
  url: string;
  order: number;
}

export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
}

export interface FooterData {
  heading?: { primary: string; secondary: string };
  contact?: { email: string; phone: string };
  links?: { title: string; items: { label: string; href: string }[] }[];
  socials?: { label: string; href: string }[];
  copyright?: string;
}

const defaultFooterData: FooterData = {
  heading: { primary: "LET'S WORK", secondary: "Together" },
  contact: { email: "hello@beethoval.dev", phone: "+62 812 3456 7890" },
  links: [
    {
      title: "Services",
      items: [
        { label: "Web Development", href: "/#services" },
        { label: "UI/UX Design", href: "/#services" },
        { label: "Mobile Apps", href: "/#services" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About", href: "/#about" },
        { label: "Projects", href: "/#projects" },
        { label: "News", href: "/#news" },
        { label: "FAQs", href: "/#faqs" },
      ],
    },
  ],
  socials: [
    { label: "Twitter", href: "https://twitter.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "GitHub", href: "https://github.com" },
  ],
  copyright: "© 2026 Beethoval. All rights reserved.",
};

async function fetchMarqueeItems(): Promise<MarqueeItem[]> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const projects = await db.collection("projects").find({}).toArray();
  const galleries = await db.collection("galleries").find({}).toArray();
  const mixed: MarqueeItem[] = [
    ...projects
      .map((p) => ({
        id: p._id.toString(),
        type: "project",
        url: p.marqueeImage || p.marqueeImages?.[0] || "",
        order: p.order || 0,
      }))
      .filter((p) => p.url),
    ...galleries.map((g) => ({
      id: g._id.toString(),
      type: "gallery",
      url: g.url,
      order: g.order || 0,
    })),
  ];
  mixed.sort((a, b) => a.order - b.order);
  return mixed;
}

async function fetchProjectCards(): Promise<ProjectCard[]> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const projects = await db
    .collection("projects")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return projects.map((p) => ({
    _id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    description: p.description,
    coverImage: p.coverImage || "",
    techStack: p.techStack || [],
  }));
}

async function fetchServices(): Promise<Service[]> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const services = await db
    .collection("services")
    .find({})
    .sort({ order: 1, createdAt: -1 })
    .toArray();
  return services.map((s) => ({
    ...s,
    _id: s._id.toString(),
  })) as Service[];
}

async function fetchNews(): Promise<NewsArticle[]> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const news = await db
    .collection("news")
    .find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .toArray();
  return news.map((n) => ({
    _id: n._id.toString(),
    title: n.title,
    slug: n.slug,
    excerpt: n.excerpt,
    coverImage: n.coverImage,
    createdAt: n.createdAt?.toISOString?.() ?? String(n.createdAt),
  }));
}

async function fetchFooter(): Promise<FooterData> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const doc = await db.collection("settings").findOne({ type: "footer" });
  if (!doc) return defaultFooterData;
  return {
    heading: doc.heading ?? defaultFooterData.heading,
    contact: doc.contact ?? defaultFooterData.contact,
    links: doc.links ?? defaultFooterData.links,
    socials: doc.socials ?? defaultFooterData.socials,
    copyright: doc.copyright ?? defaultFooterData.copyright,
  };
}

export const getCachedMarqueeItems = unstable_cache(
  fetchMarqueeItems,
  ["marquee-items"],
  { revalidate: 300 }
);

export const getCachedProjectCards = unstable_cache(
  fetchProjectCards,
  ["project-cards"],
  { revalidate: 300 }
);

export const getCachedServices = unstable_cache(
  fetchServices,
  ["services"],
  { revalidate: 300 }
);

export const getCachedNews = unstable_cache(
  fetchNews,
  ["news-landing"],
  { revalidate: 300 }
);

export const getCachedFooter = unstable_cache(
  fetchFooter,
  ["footer"],
  { revalidate: 3600 }
);
