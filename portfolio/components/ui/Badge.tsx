import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "secondary";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary text-primary-foreground border-transparent",
    outline: "bg-transparent text-muted-foreground border-border",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
