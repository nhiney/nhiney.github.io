import type { Metadata } from "next";
import { FullDeckClient } from "./FullDeckClient";

export const metadata: Metadata = {
  title: "IPv6 Strategic Foundation · VNNIC Fellowship 2026",
  description:
    "A 20-slide research-driven presentation on IPv6 as the strategic foundation for Vietnam's digital infrastructure in the AI & IoT era — VNNIC Internet School for Youth Fellowship 2026.",
};

export default function FellowshipPage() {
  return <FullDeckClient />;
}
