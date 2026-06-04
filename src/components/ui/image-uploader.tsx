"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string | string[];
  onChange: (url: string | string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function ImageUploader({ value, onChange, multiple = false, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const images = Array.isArray(value) ? value : value ? [value] : [];

  const handleUpload = async (files: File[]) => {
    const validFiles = files.filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast.error("Please upload valid image files");
      return;
    }

    if (!multiple && validFiles.length > 1) {
      toast.error("You can only upload one image here");
      validFiles.splice(1);
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const uploadedUrls: string[] = [];

      await Promise.all(
        validFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Failed to upload image");
          uploadedUrls.push(data.url);
        })
      );

      toast.success("Image uploaded successfully", { id: toastId });

      if (multiple) {
        onChange([...images, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(Array.from(e.dataTransfer.files));
    }
  }, [handleUpload]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(Array.from(e.target.files));
    }
  };

  const removeImage = (indexToRemove: number) => {
    if (multiple) {
      const newImages = images.filter((_, idx) => idx !== indexToRemove);
      onChange(newImages);
    } else {
      onChange("");
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors text-center cursor-pointer overflow-hidden",
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
            : "border-gray-200 hover:border-gray-300 bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:bg-gray-900",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <Loader2 className="size-8 text-indigo-500 animate-spin" />
          ) : (
            <UploadCloud className="size-8 text-gray-400 dark:text-gray-500" />
          )}
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isUploading ? "Uploading..." : "Click or drag image to upload"}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or WEBP
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className={cn("grid gap-4", multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-2")}>
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 aspect-video">
              <img
                src={url}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
