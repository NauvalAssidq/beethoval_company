import type { Metadata } from "next";
import { NewsForm } from "@/components/features/news/NewsForm";

export const metadata: Metadata = {
  title: "Edit Article",
};

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewsForm articleId={id} />;
}
