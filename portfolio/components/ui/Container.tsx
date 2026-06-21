import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function Container({ as: Component = "div", className, ...props }: ContainerProps) {
  // createElement avoids the `never`-typed JSX attributes that a polymorphic
  // `as: React.ElementType` triggers under @types/react 19.
  return React.createElement(Component, {
    className: cn("mx-auto w-full max-w-[1400px] px-6 md:px-10", className),
    ...props,
  });
}
