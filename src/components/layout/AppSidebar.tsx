"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FolderKanban, FileText, Settings, Images } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "@/components/layout/NavUser";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/dashboard/projects", icon: FolderKanban },
  { title: "Gallery", url: "/dashboard/gallery", icon: Images },
  { title: "News", url: "/dashboard/news", icon: FileText },
  { title: "Settings", url:"/dashboard/settings", icon: Settings}
];

export function AppSidebar({ user }: { user?: { name?: string | null, email?: string | null, image?: string | null } }) {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="h-16 p-4 border-b">
        <div className="flex items-center justify-center">
          <h2 className="text-[22px] font-serif tracking-tight text-gray-900 dark:text-gray-100 italic">Beethoval
            <span className="text-blue-600 dark:text-blue-400 not-italic">.dev</span>
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = item.url === "/dashboard" 
                  ? pathname === "/dashboard" 
                  : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      isActive={isActive}
                      className="group hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 data-[active=true]:bg-indigo-50 dark:data-[active=true]:bg-indigo-900/50 data-[active=true]:text-indigo-700 dark:data-[active=true]:text-indigo-300 data-[active=true]:font-semibold rounded-xl mb-1"
                      render={<Link href={item.url} />}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t h-20 p-4">
        <SidebarMenu>
          <NavUser user={user} />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}