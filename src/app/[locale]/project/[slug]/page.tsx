import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/components/features/projects/ProjectDetailClient";
import clientPromise from "@/lib/mongodb";
import type { Metadata } from "next";
import { cache } from "react";

import { resolveTranslation } from "@/types/i18n";

interface PageProps {
  params: Promise<{ slug: string, locale: string }>;
}

const getProject = cache(async (slug: string) => {
  const client = await clientPromise;
  const db = client.db("portfolio");

  const project = await db.collection("projects").findOne({ 
    $or: [
      { "slug.en": slug },
      { "slug.id": slug },
      { slug: slug } // fallback for string slug
    ]
  });

  if (!project) return null;

  const [prevRecord, nextRecord] = await Promise.all([
    db.collection("projects").findOne(
      { createdAt: { $gt: project.createdAt } },
      { sort: { createdAt: 1 }, projection: { title: 1, slug: 1, coverImage: 1 } }
    ),
    db.collection("projects").findOne(
      { createdAt: { $lt: project.createdAt } },
      { sort: { createdAt: -1 }, projection: { title: 1, slug: 1, coverImage: 1 } }
    )
  ]);

  const prevProject = prevRecord
    ? {
        title: prevRecord.title,
        slug: prevRecord.slug,
        coverImage: prevRecord.coverImage || "",
      }
    : null;

  const nextProject = nextRecord
    ? {
        title: nextRecord.title,
        slug: nextRecord.slug,
        coverImage: nextRecord.coverImage || "",
      }
    : null;

  return {
    project: {
      _id: project._id.toString(),
      title: project.title,
      slug: project.slug,
      description: project.description || "",
      content: project.content || "",
      coverImage: project.coverImage || "",
      marqueeImage: project.marqueeImage || "",
      techStack: project.techStack || [],
      createdAt: project.createdAt?.toISOString?.() ?? project.createdAt ?? "",
      updatedAt: project.updatedAt?.toISOString?.() ?? project.updatedAt ?? "",
    },
    prevProject,
    nextProject,
  };
});

export async function generateStaticParams() {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const projects = await db.collection("projects").find({}, { projection: { slug: 1 } }).toArray();
  
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const data = await getProject(slug);

  if (!data) {
    return { title: "Project Not Found" };
  }

  const { project } = data;

  const title = resolveTranslation(project.title, locale);
  const description = resolveTranslation(project.description, locale) || `${title} — a project by Beethoval.dev`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: `Beethoval.dev | ${title}`,
      description: description,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Beethoval.dev | ${title}`,
      description: description,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const data = await getProject(slug);

  if (!data) {
    notFound();
  }

  return (
    <ProjectDetailClient
      project={data.project as any}
      prevProject={data.prevProject as any}
      nextProject={data.nextProject as any}
    />
  );
}
