import {
  Slide01Cover,
  SlideIntro,
  SlideAbstract,
  Slide02Vision,
  Slide03WhyInfrastructure,
  Slide04IPv6Imperative,
} from "./slides-01-05";
import {
  Slide06Strategy,
  Slide07IntelligentSystems,
  Slide09SmartInfrastructure,
  Slide11Cybersecurity,
} from "./slides-06-11";
import {
  SlideEcosystemHub,
  SlideAdoptionChart,
  SlideASEANComparison,
} from "./slides-data-viz";
import {
  Slide12ChallengesAndSolutions,
  Slide14Roadmap,
  Slide15MyRole,
  Slide16WhyFellowship,
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
  { id: "intro", label: "Perspective", Component: SlideIntro },
  { id: "abstract", label: "Abstract", Component: SlideAbstract },
  { id: "vision", label: "Vision", Component: Slide02Vision },
  { id: "infrastructure", label: "Why Infrastructure", Component: Slide03WhyInfrastructure },
  { id: "ecosystem-hub", label: "IPv6 Ecosystem Hub", Component: SlideEcosystemHub },
  { id: "ipv6-imperative", label: "The IPv6 Imperative", Component: Slide04IPv6Imperative },
  { id: "vn-strategy", label: "Vietnam Strategy", Component: Slide06Strategy },
  { id: "adoption-chart", label: "Adoption Trajectory", Component: SlideAdoptionChart },
  { id: "asean-comparison", label: "ASEAN Comparison", Component: SlideASEANComparison },
  { id: "intelligent-systems", label: "IPv6 × Intelligent Systems", Component: Slide07IntelligentSystems },
  { id: "smart-infra", label: "IPv6 × Smart Infrastructure", Component: Slide09SmartInfrastructure },
  { id: "security", label: "Cybersecurity", Component: Slide11Cybersecurity },
  { id: "challenges-solutions", label: "Challenges & Solutions", Component: Slide12ChallengesAndSolutions },
  { id: "roadmap", label: "Roadmap 2030", Component: Slide14Roadmap },
  { id: "my-role", label: "My Role", Component: Slide15MyRole },
  { id: "fellowship", label: "Fellowship & Vision", Component: Slide16WhyFellowship },
  { id: "closing", label: "Closing", Component: Slide18Closing },
  { id: "references", label: "References", Component: Slide19References },
  { id: "thank-you", label: "Thank You", Component: Slide20ThankYou },
];
