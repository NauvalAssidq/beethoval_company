import type { Metadata } from "next";
import { FaqForm } from "@/components/features/faqs/FaqForm";

export const metadata: Metadata = {
  title: "Edit FAQ",
};

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FaqForm faqId={id} />;
}
