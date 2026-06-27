import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function Card({ as: Component = "div", className, ...props }: CardProps) {
  // createElement avoids the `never`-typed JSX attributes that a polymorphic
  // `as: React.ElementType` triggers under @types/react 19.
  return React.createElement(Component, {
    className: cn(
      "group relative overflow-hidden transition-all duration-500",
      "bg-card/70 hover:bg-card",
      "border border-border/60 hover:border-primary/30",
      "p-24pt rounded-none", // Sharp but professional
      className
    ),
    ...props,
  });
}
