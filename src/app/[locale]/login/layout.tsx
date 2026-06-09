import { getServerSession } from "next-auth/next";
import { redirect } from "@/i18n/routing";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect({ href: "/dashboard", locale: params.locale });
  }

  return <>{children}</>;
}
