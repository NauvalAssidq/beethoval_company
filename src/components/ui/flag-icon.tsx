import React from "react";
import { cn } from "@/lib/utils";

interface FlagIconProps {
  locale: string;
  className?: string;
}

export function FlagIcon({ locale, className }: FlagIconProps) {
  if (locale === "id") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "size-4 rounded-full shrink-0 overflow-hidden ring-1 ring-black/10 dark:ring-white/15",
          className
        )}
        aria-hidden="true"
      >
        <rect width="24" height="12" fill="#CE1126" />
        <rect y="12" width="24" height="12" fill="#FFFFFF" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "size-4 rounded-full shrink-0 overflow-hidden ring-1 ring-black/10 dark:ring-white/15",
        className
      )}
      aria-hidden="true"
    >
      <rect width="24" height="24" fill="#FFFFFF" />
      <rect y="0" width="24" height="3.43" fill="#B22234" />
      <rect y="6.86" width="24" height="3.43" fill="#B22234" />
      <rect y="13.71" width="24" height="3.43" fill="#B22234" />
      <rect y="20.57" width="24" height="3.43" fill="#B22234" />
      <rect width="12" height="13.71" fill="#3C3B6E" />
      <circle cx="3" cy="3.5" r="0.8" fill="#FFFFFF" />
      <circle cx="6" cy="3.5" r="0.8" fill="#FFFFFF" />
      <circle cx="9" cy="3.5" r="0.8" fill="#FFFFFF" />
      <circle cx="4.5" cy="6.8" r="0.8" fill="#FFFFFF" />
      <circle cx="7.5" cy="6.8" r="0.8" fill="#FFFFFF" />
      <circle cx="3" cy="10" r="0.8" fill="#FFFFFF" />
      <circle cx="6" cy="10" r="0.8" fill="#FFFFFF" />
      <circle cx="9" cy="10" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}
