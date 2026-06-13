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
import { LayoutDashboard, FolderKanban, FileText, Settings, Images, User, HelpCircle, Briefcase, PanelBottom, Type } from "lucide-react";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { NavUser } from "@/components/layout/NavUser";
import { useTranslations } from "next-intl";

const items = [
  { titleKey: "dashboard", url: "/dashboard", icon: LayoutDashboard },
  { titleKey: "hero", url: "/dashboard/hero", icon: Type },
  { titleKey: "about", url: "/dashboard/about", icon: User },
  { titleKey: "projects", url: "/dashboard/projects", icon: FolderKanban },
  { titleKey: "services", url: "/dashboard/services", icon: Briefcase },
  { titleKey: "gallery", url: "/dashboard/gallery", icon: Images },
  { titleKey: "news", url: "/dashboard/news", icon: FileText },
  { titleKey: "faqs", url: "/dashboard/faqs", icon: HelpCircle },
  { titleKey: "footer", url: "/dashboard/footer", icon: PanelBottom },
];

export function AppSidebar({ user }: { user?: { name?: string | null, email?: string | null, image?: string | null } }) {
  const pathname = usePathname();
  const t = useTranslations("AppSidebar");
  return (
    <Sidebar>
      <SidebarHeader className="h-16 p-4 border-b">
        <div className="flex items-center justify-center">
          <h2 className="text-[22px] font-serif tracking-tight text-gray-900 dark:text-gray-100 italic">{t('beethoval')}
            <span className="text-blue-600 dark:text-blue-400 not-italic">{t('dev')}</span>
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('management')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = item.url === "/dashboard" 
                  ? pathname === "/dashboard" 
                  : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton 
                      isActive={isActive}
                      className="group hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 data-[active=true]:bg-indigo-50 dark:data-[active=true]:bg-indigo-900/50 data-[active=true]:text-indigo-700 dark:data-[active=true]:text-indigo-300 data-[active=true]:font-semibold rounded-xl mb-1"
                      render={<Link href={item.url} />}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{t(item.titleKey)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 flex flex-col gap-2">
        <SidebarMenu>
          <NavUser user={user} />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}