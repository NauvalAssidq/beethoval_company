import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name}</h1>
      <p className="text-muted-foreground">Select an option from the sidebar to manage your portfolio.</p>
    </div>
  );
}