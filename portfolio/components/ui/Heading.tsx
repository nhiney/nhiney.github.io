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
    hero: "text-6xl font-[900] tracking-tighter sm:text-7xl lg:text-9xl leading-[1] text-gradient",
    title: "text-4xl font-extrabold tracking-tighter sm:text-5xl",
    subtitle: "text-lg font-semibold text-primary",
    section: "text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground",
  };

  return (
    <Component
      className={cn(variants[variant], "text-foreground", className)}
      {...props}
    />
  );
}
