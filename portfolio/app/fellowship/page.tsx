import type { Metadata } from "next";
import { FellowshipClient } from "./FellowshipClient";

export const metadata: Metadata = {
  title: "VNNIC Fellowship | Yen Nhi",
  description: "My application and vision for the VNNIC Internet Fellowship Program — contributing to Vietnam's internet infrastructure and DNS ecosystem.",
};

export default function FellowshipPage() {
  return <FellowshipClient />;
}
