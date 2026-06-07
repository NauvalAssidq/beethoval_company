import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/components/features/projects/ProjectDetailClient";
import clientPromise from "@/lib/mongodb";
import type { Metadata } from "next";
import { cache } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getProject = cache(async (slug: string) => {
  const client = await clientPromise;
  const db = client.db("portfolio");

  const project = await db.collection("projects").findOne({ slug });

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
      title: `Beethoval.dev | ${project.title}`,
      description: project.description || `${project.title} — a project by Beethoval.dev`,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Beethoval.dev | ${project.title}`,
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
