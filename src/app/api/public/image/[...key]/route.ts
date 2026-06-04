import { NextResponse } from "next/server";
import { getFile } from "@/lib/storage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params;
    const objectKey = key.join("/");

    if (!objectKey.match(/^uploads\/\d+\.webp$/)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const file = await getFile(objectKey);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new NextResponse(file.buffer as any, {
      status: 200,
      headers: {
        "Content-Type": file.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(file.buffer.length),
      },
    });
  } catch (error: any) {
    if (error?.name === "NoSuchKey" || error?.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
