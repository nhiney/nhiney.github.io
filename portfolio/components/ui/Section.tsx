import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function Section({ as: Component = "section", className, ...props }: SectionProps) {
  return (
    <Component
      className={cn("py-20 md:py-28 lg:py-32", className)}
      {...props}
    />
  );
}
