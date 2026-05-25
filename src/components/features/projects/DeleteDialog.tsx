"use client";

import { useRef, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteDialog({ open, title, onConfirm, onCancel, loading }: DeleteDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onCancel} />
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-none animate-in fade-in zoom-in-95 duration-200 dark:bg-gray-900 dark:border-gray-800"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center dark:bg-red-950/30">
            <AlertTriangle className="size-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Project</h3>
            <p className="mt-1 text-sm text-gray-500">
              Are you sure you want to delete <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onCancel} disabled={loading} className="rounded-full px-5">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading} className="rounded-full px-5">
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
