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
      "bg-zinc-900/50 hover:bg-zinc-900",
      "border border-zinc-800/50 hover:border-zinc-700/50",
      "p-24pt rounded-none", // Sharp but professional
      className
    ),
    ...props,
  });
}
