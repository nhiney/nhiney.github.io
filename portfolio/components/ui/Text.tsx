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
    base: "text-base text-zinc-400 md:text-lg leading-relaxed",
    large: "text-lg text-zinc-400 md:text-xl leading-relaxed",
    small: "text-sm text-zinc-500 font-medium tracking-tight",
    muted: "text-zinc-500 font-medium",
  };

  return (
    <Component
      className={cn(variants[variant], className)}
      {...props}
    />
  );
}
