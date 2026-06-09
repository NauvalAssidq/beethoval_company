import type { Metadata } from "next";
import { HeroIndex } from "@/components/features/hero/HeroIndex";

export const metadata: Metadata = {
  title: "Hero Settings",
};

export default function HeroPage() {
  return <HeroIndex />;
}
