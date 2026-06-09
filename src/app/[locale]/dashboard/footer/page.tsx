import type { Metadata } from "next";
import { FooterIndex } from "@/components/features/footer/FooterIndex";

export const metadata: Metadata = {
  title: "Footer Settings",
};

export default function FooterPage() {
  return <FooterIndex />;
}
