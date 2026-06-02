import type { Metadata } from "next";
import { ServiceForm } from "@/components/features/services/ServiceForm";

export const metadata: Metadata = {
  title: "Edit Service",
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServiceForm serviceId={id} />;
}
