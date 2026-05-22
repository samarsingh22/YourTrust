import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer";
  id?: string;
}

export default function Container({
  children,
  className,
  as: Tag = "section",
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16",
        className
      )}
    >
      {children}
    </Tag>
  );
}
