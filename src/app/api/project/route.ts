import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { validateCSRF, sanitizeInput } from "@/lib/security";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const client = await clientPromise;
    const db = client.db("portfolio");

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [total, projects] = await Promise.all([
      db.collection("projects").countDocuments(filter),
      db.collection("projects")
        .find(filter)
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .toArray()
    ]);

    const totalPages = Math.ceil(total / limit);

    const serialized = projects.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json({
      projects: serialized,
      total,
      page,
      totalPages,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
    const { title, slug, description, content, coverImage, marqueeImage, techStack } = body;

    const client = await clientPromise;
    const db = client.db("portfolio");

    const existing = await db.collection("projects").findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
    }

    const newProject = {
      title,
      slug,
      description,
      content,
      coverImage,
      marqueeImage: marqueeImage || "",
      techStack: techStack || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("projects").insertOne(newProject);

    revalidatePath("/", "page");
    revalidatePath("/project");
    revalidatePath(`/project/${slug}`);

    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}