import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/components/features/projects/ProjectDetailClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/public/project/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProject(slug);

  if (!data) {
    return { title: "Project Not Found" };
  }

  const { project } = data;

  return {
    title: project.title,
    description: project.description || `${project.title} — a project by Beethoval.dev`,
    openGraph: {
      title: `${project.title} | Beethoval.dev`,
      description: project.description || `${project.title} — a project by Beethoval.dev`,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Beethoval.dev`,
      description: project.description || `${project.title} — a project by Beethoval.dev`,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProject(slug);

  if (!data) {
    notFound();
  }

  return (
    <ProjectDetailClient
      project={data.project}
      prevProject={data.prevProject}
      nextProject={data.nextProject}
    />
  );
}
