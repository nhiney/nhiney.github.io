import {
  Slide01Cover,
  Slide02Vision,
  Slide03WhyInfrastructure,
  Slide04IPv4Crisis,
  Slide05WhyIPv6,
} from "./slides-01-05";
import {
  Slide06Strategy,
  Slide07IPv6AI,
  Slide08IPv6IoT,
  Slide09SmartCity,
  Slide10IPv65G,
  Slide11Cybersecurity,
} from "./slides-06-11";
import {
  Slide12Challenges,
  Slide13Solutions,
  Slide14Roadmap,
  Slide15MyRole,
  Slide16WhyFellowship,
  Slide17FutureVision,
} from "./slides-12-17";
import {
  Slide18Closing,
  Slide19References,
  Slide20ThankYou,
} from "./slides-18-20";

export type SlideEntry = {
  id: string;
  label: string;
  Component: React.ComponentType<{ index: number }>;
};

export const SLIDES: SlideEntry[] = [
  { id: "cover", label: "Cover", Component: Slide01Cover },
  { id: "vision", label: "Vision", Component: Slide02Vision },
  { id: "infrastructure", label: "Why Infrastructure", Component: Slide03WhyInfrastructure },
  { id: "ipv4-crisis", label: "IPv4 Crisis", Component: Slide04IPv4Crisis },
  { id: "why-ipv6", label: "Why IPv6", Component: Slide05WhyIPv6 },
  { id: "vn-strategy", label: "Vietnam Strategy", Component: Slide06Strategy },
  { id: "ai", label: "IPv6 × AI", Component: Slide07IPv6AI },
  { id: "iot", label: "IPv6 × IoT", Component: Slide08IPv6IoT },
  { id: "smart-city", label: "Smart Cities", Component: Slide09SmartCity },
  { id: "5g", label: "5G Future", Component: Slide10IPv65G },
  { id: "security", label: "Cybersecurity", Component: Slide11Cybersecurity },
  { id: "challenges", label: "Challenges", Component: Slide12Challenges },
  { id: "solutions", label: "Solutions", Component: Slide13Solutions },
  { id: "roadmap", label: "Roadmap 2030", Component: Slide14Roadmap },
  { id: "my-role", label: "My Role", Component: Slide15MyRole },
  { id: "fellowship", label: "Why Fellowship", Component: Slide16WhyFellowship },
  { id: "future", label: "Future Vision", Component: Slide17FutureVision },
  { id: "closing", label: "Closing", Component: Slide18Closing },
  { id: "references", label: "References", Component: Slide19References },
  { id: "thank-you", label: "Thank You", Component: Slide20ThankYou },
];
