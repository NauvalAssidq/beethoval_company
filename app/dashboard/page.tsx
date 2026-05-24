import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your config
import LogoutButton from "./LogoutButton"; 

export default async function DashboardPage() {
  // Pass the config into the function
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto p-8 flex flex-col items-start gap-4">
      <h1 className="text-3xl font-bold">Welcome back, {session.user?.name}</h1>
      <p className="text-muted-foreground">Your session token is active.</p>
      
      <LogoutButton /> 
    </main>
  );
}