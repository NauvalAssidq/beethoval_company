"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { User, LogOut, ChevronsUpDown, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export function NavUser({
  user,
}: {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const t = useTranslations("NavUser");

  const displayName = user?.name || "Admin";
  const displayEmail = user?.email || "beethoval.dev";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2.5 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 px-2.5 py-2 text-left transition-all hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={user?.image || ""} className="object-cover" />
              <AvatarFallback className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-serif italic text-sm font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                {displayName}
              </span>
              <span className="truncate text-[11px] font-mono text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5">
                {displayEmail}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="size-3.5 shrink-0 text-zinc-400" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="top"
          sideOffset={8}
          className="w-60 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-lg"
        >
          <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1 rounded-lg bg-zinc-50/80 dark:bg-zinc-900/60">
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={user?.image || ""} className="object-cover" />
              <AvatarFallback className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-serif italic text-sm font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {displayName}
              </span>
              <span className="truncate text-[11px] font-mono text-zinc-400">
                {displayEmail}
              </span>
            </div>
          </div>

          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:bg-indigo-50 dark:focus:bg-indigo-950/50 focus:text-indigo-600 dark:focus:text-indigo-400 transition-colors"
              render={<Link href="/dashboard/profile" className="w-full" />}
            >
              <User className="mr-2 size-3.5" />
              <span>{t("profile")}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:bg-zinc-100 dark:focus:bg-zinc-900 transition-colors"
              render={<Link href="/" className="w-full" />}
            >
              <ExternalLink className="mr-2 size-3.5" />
              <span>{t("live_site")}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />

          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/40 focus:text-red-600 transition-colors"
          >
            <LogOut className="mr-2 size-3.5" />
            <span>{t("log_out")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
