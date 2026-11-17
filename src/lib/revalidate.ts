import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateSiteContent(tags: string[], paths: string[] = []) {
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }
  revalidatePath("/[locale]", "layout");
  for (const path of paths) {
    const normalized = path === "/" ? "" : path;
    revalidatePath(path);
    revalidatePath(`/en${normalized}`);
    revalidatePath(`/id${normalized}`);
  }
}
