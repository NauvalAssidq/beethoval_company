"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { User, LogOut, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function NavUser({ user }: { user?: { name?: string | null, email?: string | null, image?: string | null } }) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 overflow-hidden border border-gray-200 rounded-full p-2 text-left text-sm bg-gray-100 hover:bg-blue-100 transition-colors">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-1 ring-indigo-500/20">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-indigo-50 text-indigo-600 font-semibold">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
            </Avatar>
            <span className="truncate font-medium">{user?.name || "User"}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-serif">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 transition-colors" render={<Link href="/dashboard/profile" className="w-full" />}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="cursor-pointer focus:bg-red-50 focus:text-red-600 transition-colors">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
