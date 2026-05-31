import type { Metadata } from "next";
import { NewsForm } from "@/components/features/news/NewsForm";

export const metadata: Metadata = {
  title: "Create Article",
};

export default function CreateNewsPage() {
  return <NewsForm />;
}
