import type { Metadata } from "next";
import { ProjectForm } from "@/components/features/projects/ProjectForm";

export const metadata: Metadata = {
  title: "Edit Project",
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectForm projectId={id} />;
}
