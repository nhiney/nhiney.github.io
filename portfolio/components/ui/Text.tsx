import * as React from "react";
import { cn } from "@/lib/utils";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
  variant?: "base" | "large" | "small" | "muted";
}

export function Text({
  as: Component = "p",
  variant = "base",
  className,
  ...props
}: TextProps) {
  const variants = {
    base: "text-base site-body md:text-lg leading-relaxed",
    large: "text-lg site-body md:text-xl leading-relaxed",
    small: "text-sm site-body font-medium tracking-tight",
    muted: "site-body font-medium",
  };

  // createElement avoids the `never`-typed JSX attributes that a polymorphic
  // `as: React.ElementType` triggers under @types/react 19.
  return React.createElement(Component, {
    className: cn(variants[variant], className),
    ...props,
  });
}
