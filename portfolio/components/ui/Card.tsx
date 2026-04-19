import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function Card({ as: Component = "div", className, ...props }: CardProps) {
  return (
    <Component
      className={cn(
        "group relative overflow-hidden transition-all duration-500",
        "bg-zinc-900/50 hover:bg-zinc-900",
        "border border-zinc-800/50 hover:border-zinc-700/50",
        "p-24pt rounded-none", // Sharp but professional
        className
      )}
      {...props}
    />
  );
}
