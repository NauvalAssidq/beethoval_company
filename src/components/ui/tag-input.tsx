"use client";

import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({ tags, onChange, placeholder = "Add tag...", className }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      e.preventDefault();
      const newTags = [...tags];
      newTags.pop();
      onChange(newTags);
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-3 py-2 min-h-[3rem] transition-colors focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100",
        className
      )}
    >
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-sm px-2.5 py-1 rounded-md"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent min-w-[120px] outline-none text-sm placeholder:text-gray-400"
        placeholder={tags.length === 0 ? placeholder : ""}
      />
    </div>
  );
}
