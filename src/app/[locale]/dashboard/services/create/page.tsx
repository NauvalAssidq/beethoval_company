import type { Metadata } from "next";
import { ServiceForm } from "@/components/features/services/ServiceForm";

export const metadata: Metadata = {
  title: "Create Service",
};

export default function CreateServicePage() {
  return <ServiceForm />;
}
