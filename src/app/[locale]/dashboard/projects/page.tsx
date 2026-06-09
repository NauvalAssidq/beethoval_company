import type { Metadata } from "next";
import { ProjectIndex } from "@/components/features/projects/ProjectIndex";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return <ProjectIndex />;
}
