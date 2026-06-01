import type { Metadata } from "next";
import { FaqIndex } from "@/components/features/faqs/FaqIndex";

export const metadata: Metadata = {
  title: "FAQs Management",
};

export default function FaqsPage() {
  return <FaqIndex />;
}
