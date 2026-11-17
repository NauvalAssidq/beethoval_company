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
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Images,
  User,
  HelpCircle,
  Briefcase,
  PanelBottom,
  Type,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { NavUser } from "@/components/layout/NavUser";
import { useTranslations } from "next-intl";

const navGroups = [
  {
    labelKey: "overview",
    items: [
      { titleKey: "dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    labelKey: "content",
    items: [
      { titleKey: "projects", url: "/dashboard/projects", icon: FolderKanban },
      { titleKey: "news", url: "/dashboard/news", icon: FileText },
      { titleKey: "gallery", url: "/dashboard/gallery", icon: Images },
    ],
  },
  {
    labelKey: "sections",
    items: [
      { titleKey: "hero", url: "/dashboard/hero", icon: Type },
      { titleKey: "about", url: "/dashboard/about", icon: User },
      { titleKey: "services", url: "/dashboard/services", icon: Briefcase },
      { titleKey: "faqs", url: "/dashboard/faqs", icon: HelpCircle },
      { titleKey: "footer", url: "/dashboard/footer", icon: PanelBottom },
    ],
  },
];

export function AppSidebar({
  user,
}: {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const pathname = usePathname();
  const t = useTranslations("AppSidebar");

  return (
    <Sidebar className="border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <SidebarHeader className="h-16 px-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-row items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <span className="text-[21px] font-serif tracking-tight text-zinc-900 dark:text-zinc-100 italic">
            {t("beethoval")}
            <span className="text-indigo-600 dark:text-indigo-400 not-italic">
              {t("dev")}
            </span>
          </span>
        </Link>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-800">
          CMS
        </span>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 gap-1">
        {navGroups.map((group) => (
          <SidebarGroup key={group.labelKey} className="py-1.5">
            <SidebarGroupLabel className="px-3 mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
              {t(group.labelKey as any)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.url);

                  return (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className="h-9 px-3 rounded-lg text-[13px] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors data-[active=true]:bg-indigo-50/90 dark:data-[active=true]:bg-indigo-950/50 data-[active=true]:text-indigo-600 dark:data-[active=true]:text-indigo-400 data-[active=true]:font-semibold"
                        render={<Link href={item.url} />}
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span>{t(item.titleKey as any)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200 dark:border-zinc-800 p-3">
        <SidebarMenu>
          <NavUser user={user} />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
