import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border py-20 text-center bg-background">
      <Container className="space-y-6">
        <div className="flex justify-center gap-8">
          {Object.entries(SITE_CONFIG.links).map(([key, value]) => (
            <a 
              key={key} 
              href={value} 
              target="_blank" 
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium capitalize"
            >
              {key}
            </a>
          ))}
        </div>
        <div className="space-y-2">
          <Text variant="small">
            © 2026 {SITE_CONFIG.fullName}
          </Text>
          <Text variant="small" className="text-[10px] opacity-50">
            {SITE_CONFIG.url.replace("https://", "")}
          </Text>
        </div>
      </Container>
    </footer>
  );
}
