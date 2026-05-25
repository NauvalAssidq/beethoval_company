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
import { LayoutDashboard, FolderKanban, FileText, Settings } from "lucide-react";
import Link from "next/link";
import { NavUser } from "@/components/layout/NavUser";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/dashboard/projects", icon: FolderKanban },
  { title: "Journal", url: "/dashboard/news", icon: FileText },
  { title: "Settings", url:"/dashboard/settings", icon: Settings}
];

export function AppSidebar({ user }: { user?: { name?: string | null, email?: string | null, image?: string | null } }) {
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-600 rounded-full"
                    render={<Link href={item.url} />}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <NavUser user={user} />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}