import { Metadata } from "next";
import LoginForm from "@/components/features/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to manage your stunning apps & websites.",
};

export default function LoginPage() {
  return <LoginForm />;
}
