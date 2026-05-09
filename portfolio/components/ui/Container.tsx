import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function Container({ as: Component = "div", className, ...props }: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-[1400px] px-6 md:px-10", className)}
      {...props}
    />
  );
}
