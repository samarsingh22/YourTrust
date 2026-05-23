"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const BrutalistButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-sonko-bold uppercase tracking-wider transition-all duration-200",
          "border-2 border-[#4A6444]",
          "hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#3A5235]",
          "active:translate-y-0 active:shadow-none",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
          {
            "bg-[#4A6444] text-[#F5E5B1] hover:bg-[#3A5235]":
              variant === "primary",
            "bg-transparent text-[#4A6444] hover:bg-[#4A6444]/15":
              variant === "outline",
            "border-transparent bg-transparent text-[#4A6444] hover:bg-[#4A6444]/15":
              variant === "ghost",
          },
          {
            "px-5 py-2 text-xs": size === "sm",
            "px-7 py-3 text-sm": size === "md",
            "px-10 py-4 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

BrutalistButton.displayName = "BrutalistButton";
export default BrutalistButton;
