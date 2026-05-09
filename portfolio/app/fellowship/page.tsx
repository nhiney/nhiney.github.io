import type { Metadata } from "next";
import { FellowshipClient } from "./FellowshipClient";

export const metadata: Metadata = {
  title: "VNNIC Internet Conference 2026 Fellowship | Yen Nhi",
  description: "My application for the VNNIC Internet Conference 2026 Fellowship — bridging Vietnam's IPv6-Only Transition Program (Resolution 57-NQ/TW) with production engineering: backend, mobile (Flutter/Firebase), ICare healthcare platform, and an AI-driven student social network.",
};

export default function FellowshipPage() {
  return <FellowshipClient />;
}
