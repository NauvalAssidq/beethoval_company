import type { Metadata } from "next";
import { FaqForm } from "@/components/features/faqs/FaqForm";

export const metadata: Metadata = {
  title: "Create FAQ",
};

export default function CreateFaqPage() {
  return <FaqForm />;
}
