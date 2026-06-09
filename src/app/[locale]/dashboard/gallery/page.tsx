import type { Metadata } from "next";
import GalleryIndex from "@/components/features/gallery/GalleryIndex";

export const metadata: Metadata = {
  title: "Gallery Management",
};

export default function GalleryPage() {
  return <GalleryIndex />;
}
