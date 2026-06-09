import type { Metadata } from "next";
import { NewsIndex } from "@/components/features/news/NewsIndex";

export const metadata: Metadata = {
  title: "News Management",
};

export default function NewsPage() {
  return <NewsIndex />;
}
