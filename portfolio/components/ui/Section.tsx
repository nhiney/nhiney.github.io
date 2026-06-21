import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function Section({ as: Component = "section", className, ...props }: SectionProps) {
  // Default has no built-in padding — pages set their own pt/pb explicitly so
  // spacing is predictable. createElement avoids the `never`-typed JSX
  // attributes a polymorphic `as: React.ElementType` triggers under @types/react 19.
  return React.createElement(Component, {
    className: cn(className),
    ...props,
  });
}
