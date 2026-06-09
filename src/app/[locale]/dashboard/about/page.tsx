import type { Metadata } from "next";
import { AboutIndex } from "@/components/features/about/AboutIndex";

export const metadata: Metadata = {
  title: "About Me Management",
};

export default function AboutPage() {
  return <AboutIndex />;
}
