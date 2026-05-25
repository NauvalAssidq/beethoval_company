import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-serif text-4xl text-gray-900 dark:text-gray-100">
        Welcome back, <span className="text-indigo-600">{session?.user?.name}</span>
      </h1>
      <p className="text-lg text-gray-500 max-w-xl">Select an option from the sidebar to manage your portfolio.</p>
    </div>
  );
}