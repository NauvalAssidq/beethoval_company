import type { Metadata } from "next";
import { ServiceIndex } from "@/components/features/services/ServiceIndex";

export const metadata: Metadata = {
  title: "Services Management",
};

export default function ServicesPage() {
  return <ServiceIndex />;
}
