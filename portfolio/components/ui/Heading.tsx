import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: "hero" | "title" | "subtitle" | "section";
}

export function Heading({
  as: Component = "h2",
  variant = "title",
  className,
  ...props
}: HeadingProps) {
  const variants = {
    hero: "text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl leading-[1.15]",
    title: "text-2xl font-semibold tracking-tight sm:text-3xl",
    subtitle: "text-base font-medium text-primary",
    section: "text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground",
  };

  return (
    <Component
      className={cn(variants[variant], "text-foreground", className)}
      {...props}
    />
  );
}
