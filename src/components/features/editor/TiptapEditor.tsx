"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { EditorToolbar } from "./EditorToolbar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  className?: string;
}

export function TiptapEditor({ content, onChange, className }: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[500px] p-8 lg:p-10 " +
          "dark:prose-invert prose-gray " +
          "prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight " +
          "prose-p:font-sans prose-p:leading-relaxed text-gray-800 dark:text-gray-200 " +
          "prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-500 " +
          "prose-img:rounded-2xl prose-img:shadow-md " +
          "prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none " +
          "prose-blockquote:border-l-indigo-500 prose-blockquote:font-serif prose-blockquote:italic",
      },
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      setIsUploading(true);
      const toastId = toast.loading("Optimizing & uploading image...");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      editor?.chain().focus().setImage({ src: data.url }).run();
      toast.success("Image uploaded successfully", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("w-full flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-800", className)}>
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-800">
        <EditorToolbar editor={editor} onImageUpload={handleImageUpload} isUploading={isUploading} />
      </div>
      <div className="overflow-y-auto max-h-[700px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
