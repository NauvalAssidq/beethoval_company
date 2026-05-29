import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const client = await clientPromise;
    const db = client.db("portfolio");

    const project = await db.collection("projects").findOne({ slug });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const allProjects = await db
      .collection("projects")
      .find({}, { projection: { title: 1, slug: 1, coverImage: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    const currentIndex = allProjects.findIndex(
      (p) => p._id.toString() === project._id.toString()
    );

    const prevProject =
      currentIndex > 0
        ? {
            title: allProjects[currentIndex - 1].title,
            slug: allProjects[currentIndex - 1].slug,
            coverImage: allProjects[currentIndex - 1].coverImage || "",
          }
        : null;

    const nextProject =
      currentIndex < allProjects.length - 1
        ? {
            title: allProjects[currentIndex + 1].title,
            slug: allProjects[currentIndex + 1].slug,
            coverImage: allProjects[currentIndex + 1].coverImage || "",
          }
        : null;

    return NextResponse.json({
      project: {
        _id: project._id.toString(),
        title: project.title,
        slug: project.slug,
        description: project.description || "",
        content: project.content || "",
        coverImage: project.coverImage || "",
        marqueeImage: project.marqueeImage || "",
        techStack: project.techStack || [],
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      prevProject,
      nextProject,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
