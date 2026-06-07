import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { join } from "path";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import { Readable } from "stream";

const STORAGE_MODE = process.env.STORAGE_MODE || "local";

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string = "image/webp"
): Promise<string> {
  if (STORAGE_MODE === "r2") {
    const client = getR2Client();
    const bucket = process.env.R2_BUCKET_NAME!;
    const key = `uploads/${filename}`;

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    return `/api/public/image/${key}`;
  }

  const uploadDir = join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  const filePath = join(uploadDir, filename);
  await writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

export async function getFile(key: string) {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME!;

  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  const stream = response.Body;
  if (!stream) return null;

  let buffer: Buffer;
  if (stream instanceof Readable) {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    buffer = Buffer.concat(chunks);
  } else if (typeof (stream as any).transformToByteArray === "function") {
    const bytes = await (stream as any).transformToByteArray();
    buffer = Buffer.from(bytes);
  } else {
    return null;
  }

  return {
    buffer,
    contentType: response.ContentType || "application/octet-stream",
    contentLength: response.ContentLength,
  };
}

export async function deleteFile(url: string | undefined | null) {
  if (!url) return;

  if (STORAGE_MODE === "r2") {
    const prefix = "/api/public/image/";
    let key: string | null = null;

    if (url.startsWith(prefix)) {
      key = url.replace(prefix, "");
    } else if (process.env.R2_PUBLIC_URL && url.startsWith(process.env.R2_PUBLIC_URL)) {
      key = url.replace(`${process.env.R2_PUBLIC_URL}/`, "");
    }

    if (!key) return;

    const client = getR2Client();
    const bucket = process.env.R2_BUCKET_NAME!;

    try {
      await client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
    } catch (e) {
      console.error("Failed to delete from R2:", url, e);
    }
    return;
  }

  if (url.startsWith("/uploads/")) {
    try {
      const filename = url.replace("/uploads/", "");
      const filePath = join(process.cwd(), "public", "uploads", filename);
      await unlink(filePath);
    } catch (e) {
      console.error("Failed to delete local file:", url, e);
    }
  }
}
