import { Metadata } from "next";
import clientPromise from "@/lib/mongodb";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCachedFooter } from "@/lib/landing-data";
import {
  ProjectCatalogClient,
  type CatalogProject,
} from "@/components/features/projects/ProjectCatalogClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  return {
    title: isId ? "Katalog Proyek | Beethoval.dev" : "Project Catalog | Beethoval.dev",
    description: isId
      ? "Jelajahi katalog lengkap produk digital dan pengalaman web Beethoval di tampilan desktop, tablet, dan ponsel."
      : "Explore the complete catalog of digital products and web experiences crafted by Beethoval across desktop, tablet, and mobile viewports.",
  };
}

async function getAllProjects(): Promise<CatalogProject[]> {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const projects = await db
      .collection("projects")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return JSON.parse(
      JSON.stringify(
        projects.map((p) => ({
          _id: p._id.toString(),
          title: p.title,
          slug: p.slug,
          description: p.description || "",
          coverImage: p.coverImage || "",
          marqueeImage: p.marqueeImage || "",
          techStack: Array.isArray(p.techStack) ? p.techStack : [],
          createdAt: p.createdAt?.toISOString?.() ?? String(p.createdAt ?? ""),
        }))
      )
    );
  } catch (err) {
    console.error("Error loading projects in /project catalog page:", err);
    return [];
  }
}

export default async function LocalizedProjectCatalogPage({ params }: PageProps) {
  await params;
  const [projects, footerData] = await Promise.all([
    getAllProjects(),
    getCachedFooter(),
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar />
      <ProjectCatalogClient projects={projects} />
      <Footer footerData={footerData} />
    </main>
  );
}
