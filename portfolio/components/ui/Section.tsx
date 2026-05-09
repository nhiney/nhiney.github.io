import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function Section({ as: Component = "section", className, ...props }: SectionProps) {
  return (
    <Component
      // Default has no built-in padding — pages set their own pt/pb explicitly
      // so spacing is predictable and the page-level Container's space-y can
      // actually take effect without 80-128px hidden bottom padding fighting it.
      className={cn(className)}
      {...props}
    />
  );
}
