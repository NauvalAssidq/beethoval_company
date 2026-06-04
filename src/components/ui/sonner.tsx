"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans !border !shadow-none !rounded-xl",
          default:
            "!bg-background !text-foreground !border-border",
          error:
            "!bg-red-50 !text-red-600 !border-red-200 dark:!bg-red-950/30 dark:!border-red-900/50",
          success:
            "!bg-green-50 !text-green-600 !border-green-200 dark:!bg-green-950/30 dark:!border-green-900/50",
          warning:
            "!bg-amber-50 !text-amber-600 !border-amber-200 dark:!bg-amber-950/30 dark:!border-amber-900/50",
          info:
            "!bg-indigo-50 !text-indigo-600 !border-indigo-200 dark:!bg-indigo-950/30 dark:!border-indigo-900/50",
          description: "!text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-gray-900 group-[.toast]:text-white group-[.toast]:rounded-full",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-full",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
