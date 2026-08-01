"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function PrivacyFooterLink() {
  const { language } = useLanguage();
  const label = language === "vi" ? "Quyền riêng tư" : "Privacy";

  return (
    <Link
      href="/privacy"
      className="inline-flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
