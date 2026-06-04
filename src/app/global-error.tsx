"use client";

import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import "./globals.css";
import { cn } from "@/lib/utils";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", sans.variable, serif.variable, mono.variable, "font-sans")}>
      <body className="min-h-full flex flex-col bg-[#fafafa]">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-8xl md:text-9xl text-gray-200 font-serif italic mb-6 select-none">500</span>
          <h1 className="text-4xl md:text-6xl text-gray-900 tracking-tight leading-[1.05] mb-4">
            <span className="font-sans font-regular">System</span> <span className="font-serif italic text-indigo-600">Error</span>
          </h1>
          <p className="text-[14px] text-gray-500 font-medium max-w-md mb-8 leading-relaxed">
            An unexpected error occurred during execution.
            {error.digest && (
              <span className="block mt-2 font-mono text-[11px] text-gray-400">
                Digest: {error.digest}
              </span>
            )}
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-3 h-12 md:h-14 px-8 md:px-10 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <span>Try Again</span>
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </body>
    </html>
  );
}
