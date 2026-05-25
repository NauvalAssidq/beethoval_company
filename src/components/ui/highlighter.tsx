"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HighlighterProps {
  children: React.ReactNode;
  action?: "circle" | "highlight" | "underline";
  color?: string;
  isView?: boolean;
  className?: string;
}

export const Highlighter = ({
  children,
  action = "highlight",
  color = "#4f46e5",
  isView = true,
  className,
}: HighlighterProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isView) {
      const timer = setTimeout(() => setAnimate(true), 400);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [isView]);

  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      {action === "highlight" && (
        <span
          className="absolute inset-0 -z-10 h-full w-full origin-left transition-transform duration-700 ease-out"
          style={{
            backgroundColor: color,
            transform: animate ? "scaleX(1)" : "scaleX(0)",
            top: "10%",
            height: "90%",
          }}
        />
      )}

      {action === "circle" && (
        <svg
          className="absolute inset-0 left-[-5%] top-[-10%] h-[120%] w-[110%] -z-10 overflow-visible pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="50%"
            cy="50%"
            rx="48%"
            ry="45%"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              strokeDasharray: "300%",
              strokeDashoffset: animate ? "0" : "300%",
            }}
          />
        </svg>
      )}

      <span className={cn("relative z-10", action === "highlight" ? "text-white" : "")}>
        {children}
      </span>
    </span>
  );
};