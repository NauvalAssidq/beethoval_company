import type { Metadata } from "next";
import { ProjectForm } from "@/components/features/projects/ProjectForm";

export const metadata: Metadata = {
  title: "Create Project",
};

export default function CreateProjectPage() {
  return <ProjectForm />;
}
