import clientPromise from "@/lib/mongodb";
import { unstable_cache } from "next/cache";
import type { Service } from "@/types/service";
import type { LocalizedString } from "@/types/i18n";

export interface ProjectCard {
  _id: string;
  title: LocalizedString;
  slug: LocalizedString;
  description: LocalizedString;
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
  title: LocalizedString;
  slug: LocalizedString;
  excerpt: LocalizedString;
  coverImage: string;
  createdAt: string;
}

export interface FooterData {
  heading?: { primary: LocalizedString; secondary: LocalizedString };
  contact?: { email: string; phone: string };
  links?: { title: LocalizedString; items: { label: LocalizedString; href: string }[] }[];
  socials?: { label: string; href: string }[];
  copyright?: LocalizedString;
}

export interface HeroData {
  line1: LocalizedString;
  highlightWord1: LocalizedString;
  highlightAction1: "circle" | "highlight" | "none";
  separator: LocalizedString;
  highlightWord2: LocalizedString;
  highlightAction2: "circle" | "highlight" | "none";
  line3: LocalizedString;
  subtitle: LocalizedString;
}

export interface AboutData {
  heading: LocalizedString;
  description: LocalizedString;
  location: LocalizedString;
}

const defaultHeroData: HeroData = {
  line1: { en: "Crafting Digital", id: "Merancang Digital" },
  highlightWord1: { en: "Experiences", id: "Pengalaman" },
  highlightAction1: "circle",
  separator: { en: "&", id: "&" },
  highlightWord2: { en: "Solutions", id: "Solusi" },
  highlightAction2: "highlight",
  line3: { en: "For Your Business", id: "Untuk Bisnis Anda" },
  subtitle: { en: "High-performance web applications on hand, with professional grade interface", id: "Aplikasi web berkinerja tinggi, dengan antarmuka profesional" }
};

const defaultFooterData: FooterData = {
  heading: { 
    primary: { en: "LET'S WORK", id: "MARI BEKERJA" }, 
    secondary: { en: "Together", id: "Bersama" } 
  },
  contact: { email: "hello@beethoval.dev", phone: "+62 812 3456 7890" },
  links: [
    {
      title: { en: "Services", id: "Layanan" },
      items: [
        { label: { en: "Web Development", id: "Pengembangan Web" }, href: "/#services" },
        { label: { en: "UI/UX Design", id: "Desain UI/UX" }, href: "/#services" },
        { label: { en: "Mobile Apps", id: "Aplikasi Seluler" }, href: "/#services" },
      ],
    },
    {
      title: { en: "Company", id: "Perusahaan" },
      items: [
        { label: { en: "About", id: "Tentang" }, href: "/#about" },
        { label: { en: "Projects", id: "Proyek" }, href: "/#projects" },
        { label: { en: "News", id: "Berita" }, href: "/#news" },
        { label: { en: "FAQs", id: "FAQ" }, href: "/#faqs" },
      ],
    },
  ],
  socials: [
    { label: "Twitter", href: "https://twitter.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "GitHub", href: "https://github.com" },
  ],
  copyright: { en: "© 2026 Beethoval. All rights reserved.", id: "© 2026 Beethoval. Hak cipta dilindungi." },
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

async function fetchHero(): Promise<HeroData> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const doc = await db.collection("hero").findOne({});
  if (!doc) return defaultHeroData;
  return {
    line1: doc.line1 ?? defaultHeroData.line1,
    highlightWord1: doc.highlightWord1 ?? defaultHeroData.highlightWord1,
    highlightAction1: doc.highlightAction1 ?? defaultHeroData.highlightAction1,
    separator: doc.separator ?? defaultHeroData.separator,
    highlightWord2: doc.highlightWord2 ?? defaultHeroData.highlightWord2,
    highlightAction2: doc.highlightAction2 ?? defaultHeroData.highlightAction2,
    line3: doc.line3 ?? defaultHeroData.line3,
    subtitle: doc.subtitle ?? defaultHeroData.subtitle,
  };
}

const getAbout = async (): Promise<AboutData | null> => {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const about = await db.collection("about").findOne({});
  if (!about) return null;
  return {
    heading: about.heading,
    description: about.description,
    location: about.location,
  };
};

export const getCachedMarqueeItems = unstable_cache(
  fetchMarqueeItems,
  ["marquee-items"],
  { tags: ["marquee-items", "projects", "gallery"], revalidate: 300 }
);

export const getCachedProjectCards = unstable_cache(
  fetchProjectCards,
  ["project-cards"],
  { tags: ["projects"], revalidate: 300 }
);

export const getCachedServices = unstable_cache(
  fetchServices,
  ["services"],
  { tags: ["services"], revalidate: 300 }
);

export const getCachedAbout = unstable_cache(
  async () => getAbout(),
  ['landing-about'],
  { tags: ['about'] }
);

export const getCachedNews = unstable_cache(
  fetchNews,
  ["news-landing"],
  { tags: ["news"], revalidate: 300 }
);

export const getCachedFooter = unstable_cache(
  fetchFooter,
  ["footer"],
  { tags: ["footer"], revalidate: 3600 }
);

export const getCachedHero = unstable_cache(
  fetchHero,
  ["hero"],
  { tags: ["hero"], revalidate: 3600 }
);
