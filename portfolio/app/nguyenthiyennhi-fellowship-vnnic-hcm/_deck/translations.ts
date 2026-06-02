export type DeckLang = "en" | "vi";

export interface SlideTexts {
  s01: { badge: string; title: string; subtitle: string; tags: string[]; cta: string };
  s_intro: { eyebrow: string; sections: Array<{ title: string; intro: string; bullets: string[] }> };
  s_abstract: {
    eyebrow: string;
    title: string;
    summary: string;
    pillars: Array<{ tag: string; title: string; body: string }>;
    keywordsLabel: string;
    keywords: string[];
    citationLine: string;
  };
  s02: { eyebrow: string; headline1: string; headline2: string; subhead: string; pullquote: string };
  s03: { eyebrow: string; headline1: string; headline2: string; headline3: string; subhead: string; analogyLegacyLabel: string; analogyConnectorLabel: string; analogyDigitalLabel: string; analogyItems: string[]; analogyDigitalItem: string; pillars: Array<{ tag: string; title: string; body: string }>; pullquote: string };
  s04: { eyebrow: string; headline1: string; headline2: string; crisisLabel: string; cascade: Array<{ title: string; bullets: string[] }>; stat1value: string; stat1label: string; stat1cite?: string; stat2value: string; stat2label: string; stat2cite?: string; stat3value: string; stat3label: string; stat3cite?: string; solutionLabel: string; thDim: string; rows: Array<{ dim: string; v4: string; v6: string }>; pullquote: string };
  s06: { eyebrow: string; headline1: string; headline2: string; intro: string; foundations: string[]; policyLabel: string; policyAnchors: Array<{ code: string; title: string; year: string; url?: string }>; posLabel: string; globalLabel: string; aseanLabel: string; trafficLabel: string; positionStats: Array<{ value: string; label: string; cite?: string }>; posNote: string; objLabel: string; objectives: Array<{ title: string; bullets: string[] }>; citiesLabel: string; cities: string[]; pullquote: string };
  s07: { eyebrow: string; headline1: string; headline2: string; intro: string; sections: Array<{ tag: string; headline: string; intro: string; highlights: string[]; extras: string[]; stats: Array<{ value: string; label: string; cite?: string }> }>; domainsLabel: string; domains: string[]; pullquote: string };
  s09: { eyebrow: string; headline1: string; headline2: string; intro: string; sections: Array<{ tag: string; headline: string; intro: string; highlights: string[]; extras: string[]; stats: Array<{ value: string; label: string; cite?: string }> }>; pullquote: string };
  s11: { eyebrow: string; headline1: string; headline2: string; intro: string; capLabel: string; capabilities: Array<{ title: string; bullets: string[] }>; cavLabel: string; caveats: string[]; closingNote: string; pullquote: string };
  s12: { eyebrow: string; headline1: string; headline2: string; challengesLabel: string; challenges: Array<{ num: string; title: string; bullets: string[]; maturityValue: string; maturityLabel: string }>; solutionsLabel: string; solutions: Array<{ title: string; bullets: string[] }>; pullquote: string };
  s14: { eyebrow: string; headline1: string; headline2: string; intro: string; prioritiesLabel: string; outcomesLabel: string; leadLabel: string; kpiLabel: string; phases: Array<{ title: string; target: string; priorities: string[]; outcomes: string[]; leadAgencies: string[]; kpiGates: string[] }>; closingNote: string; pullquote: string };
  s15: { eyebrow: string; headline1: string; headline2: string; intro: string; intersectionLabel: string; intersectionItems: string[]; motivationText: string; motivationItems: string[]; posLabel: string; name: string; school: string; city: string; pathLabel: string; pathText: string; capLabel: string; capabilities: Array<{ title: string; bullets: string[] }>; closingNote: string; pullquote: string };
  s16: { eyebrow: string; headline1: string; headline2: string; intro: string; introBullets: string[]; reasonsLabel: string; reasons: Array<{ title: string; body: string }>; visionsLabel: string; horizons: Array<{ title: string; yearLabel: string; body: string }>; closingNote: string; pullquote: string };
  s18: { eyebrow: string; headline1: string; headlineBuilt: string; layerIntro: string; layerSubtitle: string; layers: string[]; closing1: string; closing2: string; pullquote: string };
  s19: { eyebrow: string; headline1: string; headline2: string; methodLabel: string; methodTitle: string; methodSourcesLabel: string; methodSources: string[]; methodNote: string; groups: Array<{ title: string; roleNote?: string; items: Array<{ name: string; url: string; desc: string }> }>; academicLabel: string; academicNotes: string[] };
  s20: { badge: string; title: string; nameLabel: string; byline: string; intro: string; contactLabel: string; contactLabels: [string, string]; portfolioInvite: string; footerTitle: string; footerBody: string; pullquote: string };
  s_ecosystem_hub: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    nodes: Array<{ label: string; sub: string }>;
    pullquote: string;
  };
  s_adoption_chart: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    vnLabel: string;
    globalLabel: string;
    targetLabel: string;
    targetShortLabel: string;
    sourceNote: string;
    stats: Array<{ value: string; label: string; sub: string }>;
    pullquote: string;
  };
  s_asean_chart: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    sourceNote: string;
    highlightLabel: string;
    highlightBody: string;
    regionLabel: string;
    regionBody: string;
    pullquote: string;
  };
}

export const deckTx: Record<DeckLang, SlideTexts> = {
  en: {
    s01: {
      badge: "VNNIC Internet for Youth Fellowship 2026",
      title: "IPv6 as a Strategic Foundation for Vietnam’s Digital Infrastructure",
      subtitle: "A research perspective on IPv6 within the context of AI, IoT, and national digital transformation",
      tags: ["Nguyen Thi Yen Nhi", "3rd-year IT Student · Ho Chi Minh City University of Industry and Trade"],
      cta: "Slide to begin",
    },
    s_intro: {
      eyebrow: "Research Perspective",
      sections: [
        {
          title: "1. My perspective on the Internet",
          intro: "During my studies in Information Technology, I began to view the Internet not only as a user-facing platform, but as an infrastructure system with clear scalability constraints. As I explored system design and architecture in more depth, I realized that:",
          bullets: [
            "The most critical limitations are not at the application layer",
            "But at the foundational Internet architecture and its long-term scalability",
          ],
        },
        {
          title: "2. Perspective on IPv6",
          intro: "From this viewpoint, IPv6 is not simply a replacement for IPv4, but an architectural transition of the Internet. This transition is driven by scaling pressure from:",
          bullets: [
            "AI systems",
            "IoT networks",
            "Large-scale data infrastructures",
          ],
        },
        {
          title: "3. My approach to this topic",
          intro: "I approach this topic from a systems analysis perspective, focusing on:",
          bullets: [
            "Changes at the protocol layer",
            "Their impact on the operational structure of the digital ecosystem",
            "At a national scale",
          ],
        },
      ],
    },
    s_abstract: {
      eyebrow: "Executive Abstract",
      title: "IPv6 as Strategic Infrastructure for Vietnam's Digital Sovereignty.",
      summary:
        "This proposal argues that IPv6 is not a technical upgrade — it is the architectural condition under which Vietnam's digital economy, intelligent systems, and national digital sovereignty can scale through the 2026–2030 horizon. Anchored on Decision No. 749/QĐ-TTg (2020), Decision No. 411/QĐ-TTg (2022), and VNNIC's national IPv6 program (IPv6 For Gov, 2021–2025), this analysis maps the gap between current adoption, AI/IoT/5G scaling requirements, and the structural workforce, SME, and legacy-system bottlenecks. It proposes a five-pillar response and a three-phase roadmap to lift national IPv6 deployment toward 90–100% by 2030.",
      pillars: [
        { tag: "Thesis", title: "IPv6 is infrastructure, not protocol", body: "Adoption is a function of policy, workforce, and architectural design — not bandwidth." },
        { tag: "Method", title: "Evidence-based system analysis", body: "Findings triangulate VNNIC, APNIC, ITU, Cisco, Cloudflare, and IETF RFC sources — no proprietary or unverifiable data." },
        { tag: "Outcome", title: "Five pillars × three phases", body: "Workforce, SME enablement, IPv6-first policy, awareness, R&D — sequenced across 2026–27, 2027–28, 2028–30." },
      ],
      keywordsLabel: "Keywords",
      keywords: [
        "digital infrastructure",
        "scalable network architecture",
        "Internet governance",
        "national digital transformation",
        "AI-driven ecosystem",
        "low-latency infrastructure",
        "IPv6 For Gov",
        "digital sovereignty",
      ],
      citationLine: "Sources: VNNIC (2024) · APNIC Labs · Decision 749/QĐ-TTg · Decision 411/QĐ-TTg · ITU-R M.2410 · Cisco AIR 2023–2028 · IoT Analytics 2024.",
    },
    s02: {
      eyebrow: "Vision",
      headline1: "Internet infrastructure is the foundation of the modern digital economy.",
      headline2: "IPv6 is not merely a technical upgrade — it is a strategic choice for Vietnam's long-term vision over the next 20–30 years.",
      subhead: "IPv6 sits at the intersection of national policy, artificial intelligence, the Internet of Things, and digital sovereignty — where decisions about network architecture can directly shape the growth trajectory of the entire digital economy.",
      pullquote: "Whoever controls the address space, shapes the architecture of the future Internet.",
    },
    s03: {
      eyebrow: "Why Internet Infrastructure Is Strategic",
      headline1: "The Internet is not simply a connectivity tool —",
      headline2: "it is core",
      headline3: "national infrastructure.",
      subhead: "Like roads in logistics or power grids in energy, the Internet serves as the transport layer for the entire digital ecosystem: commerce, governance, healthcare, and artificial intelligence.",
      analogyLegacyLabel: "Physical infrastructure of the last century",
      analogyConnectorLabel: "Equivalent to",
      analogyDigitalLabel: "Digital infrastructure of this century",
      analogyItems: ["Roads", "Power Grids", "Water Supply"],
      analogyDigitalItem: "Internet Infrastructure",
      pillars: [
        { tag: "Economic Layer", title: "The digital economy runs on continuous data flows", body: "Cloud-native businesses depend directly on network infrastructure scalability. Digital economic growth is tied to the capacity of the Internet infrastructure layer." },
        { tag: "Digital Sovereignty Layer", title: "Network architecture shapes national data control", body: "Cybersecurity and resilience depend on foundational protocol design. Infrastructure choices determine a nation's degree of digital autonomy." },
        { tag: "Technology Innovation Layer", title: "AI, IoT, 5G, and smart cities all converge on Internet infrastructure", body: "Every next-generation digital system depends on connectivity and addressability. The Internet protocol is the foundation under every foundation in digital architecture." },
      ],
      pullquote: "Infrastructure is invisible — until it fails. Then it becomes the most critical element of the entire system.",
    },
    s04: {
      eyebrow: "The IPv6 Imperative",
      headline1: "IPv4 is at its structural limit.",
      headline2: "IPv6 is not a patch — it is a re-foundation.",
      crisisLabel: "The IPv4 crisis",
      cascade: [
        { title: "No remaining free IPv4 pools", bullets: ["Major registries (APNIC, RIPE NCC, ARIN) have exhausted public IPv4 allocations", "Distribution now depends on reuse, recovery, and transfer markets"] },
        { title: "NAT: a workaround that became the default", bullets: ["NAT extends IPv4 lifespan but breaks end-to-end connectivity", "VoIP, P2P, IoT, and gaming operate under growing architectural constraints"] },
        { title: "Rising infrastructure costs", bullets: ["IPv4 leasing costs continue to increase as scarcity deepens", "Cloud-native enterprises and IoT deployments absorb hidden legacy architecture costs"] },
      ],
      stat1value: "4.29 Billion",
      stat1label: "Theoretical IPv4 address pool (32-bit space)",
      stat1cite: "RFC 791 · 1981",
      stat2value: "~41 Billion",
      stat2label: "Connected IoT devices forecast by 2030 (≈18.8B in 2024)",
      stat2cite: "IoT Analytics · State of IoT 2024",
      stat3value: "0 blocks",
      stat3label: "Free public IPv4 blocks remaining at the major RIRs (APNIC, RIPE NCC, ARIN, LACNIC)",
      stat3cite: "APNIC · RIPE NCC · ARIN registries",
      solutionLabel: "Why switch to IPv6",
      thDim: "Dimension",
      rows: [
        { dim: "Address space", v4: "4.3 × 10⁹", v6: "3.4 × 10³⁸" },
        { dim: "NAT dependency", v4: "Required", v6: "Nearly eliminated" },
        { dim: "Header design", v4: "Complex, legacy", v6: "Streamlined" },
        { dim: "Security", v4: "Bolt-on", v6: "IPSec native" },
        { dim: "Autoconfig & mobility", v4: "Limited", v6: "Built-in (SLAAC)" },
        { dim: "IoT scalability", v4: "Constrained", v6: "Designed for scale" },
      ],
      pullquote: "IPv6 is what the Internet looks like when redesigned with everything humanity has learned from the first generation.",
    },
    s06: {
      eyebrow: "National IPv6 Strategy",
      headline1: "Vietnam is not merely 'keeping up' with the global IPv6 transition.",
      headline2: "It is positioning itself among the leading nations of the region.",
      intro: "Coordinated by the Vietnam Internet Network Information Center (VNNIC) under the Ministry of Information and Communications, IPv6 transition is anchored in three converging national policy frameworks (see below). Together they define IPv6 as the strategic infrastructure foundation for:",
      foundations: ["Digital Government", "Digital Economy", "Digital Society", "National Cloud & IoT Infrastructure", "Next-Generation Internet"],
      policyLabel: "Anchoring policy framework",
      policyAnchors: [
        { code: "Decision 749/QĐ-TTg", title: "National Digital Transformation Program to 2025, vision 2030", year: "03 Jun 2020", url: "https://vanban.chinhphu.vn/?pageid=27160&docid=200163" },
        { code: "Decision 411/QĐ-TTg", title: "National Strategy for Digital Economy & Digital Society to 2025, vision 2030", year: "31 Mar 2022", url: "https://vanban.chinhphu.vn/default.aspx?pageid=27160&docid=205605" },
        { code: "IPv6 For Gov", title: "VNNIC national program — IPv6 deployment for government agencies (Phase 2021–2025)", year: "2021–2025", url: "https://vnnic.vn/ipv6/ipv6forgov" },
      ],
      posLabel: "Vietnam's current position",
      globalLabel: "Global ranking",
      aseanLabel: "ASEAN ranking",
      trafficLabel: "National IPv6 traffic share",
      positionStats: [
        { value: "Top 10", label: "Global IPv6 deployment ranking", cite: "APNIC Labs · 2024" },
        { value: "Top 2", label: "ASEAN regional position", cite: "VNNIC · 2024" },
        { value: "~64%", label: "National IPv6 traffic share (Q4 2024)", cite: "thongke.ipv6.vn" },
      ],
      posNote: "Vietnam ranks among the highest IPv6-deployment economies globally — ahead of many traditionally advanced markets — and is on track to meet the 90–100% target by 2030. [VNNIC Annual IPv6 Report 2024].",
      objLabel: "Strategic objectives by 2030",
      objectives: [
        {
          title: "IPv6-Only National Infrastructure",
          bullets: ["Build a national Internet network operating preferentially or entirely on IPv6", "Progressively reduce IPv4 dependency"],
        },
        {
          title: "Universal IPv6 Across All Platforms",
          bullets: ["90–100% IPv6 deployment across public services & government systems", "ISPs & mobile networks, datacenters & cloud", "Enterprise infrastructure & national digital platforms"],
        },
        {
          title: "Lead Next-Generation Internet in the Region",
          bullets: ["Position Vietnam as a hub for IPv6, 5G, and large-scale IoT", "Smart City ecosystems, AI infrastructure, cloud-native networking"],
        },
      ],
      citiesLabel: "Priority deployment centers",
      cities: ["Hanoi", "Da Nang", "Ho Chi Minh City"],
      pullquote: "IPv6 is no longer a technical choice. It is the strategic infrastructure for the national digital economy.",
    },
    s07: {
      eyebrow: "IPv6 × Intelligent Systems",
      headline1: "AI and IoT scale on the same foundation:",
      headline2: "a protocol that can address everything, everywhere.",
      intro: "Modern AI systems and IoT deployments share the same structural requirement — every node, device, and endpoint needs a unique, globally routable address. IPv6 is that foundation.",
      sections: [
        {
          tag: "AI",
          headline: "AI doesn’t scale on GPUs alone. It scales on networks.",
          intro: "Distributed training, edge AI, and federated learning all communicate through IP. When a hyperscale run spans tens of thousands of GPU nodes, the challenge is identity, routing, and coordination — not just compute.",
          highlights: [
            "Direct per-node addressing — no NAT, no overlay complexity",
            "Edge AI devices need globally routable addresses for real-time inference",
            "Federated learning requires ultra-low latency synchronization between nodes",
            "SRv6 enables AI-aware traffic engineering at massive scale",
          ],
          extras: [],
          stats: [
            { value: "25K+", label: "GPU nodes per hyperscale training run", cite: "NVIDIA · Meta Llama 3 paper" },
            { value: "< 1 ms", label: "Target inter-pod latency for AI fabric", cite: "ITU-R M.2410 URLLC" },
            { value: "3.4×10³⁸", label: "IPv6 address space — sufficient for any AI topology", cite: "RFC 4291" },
          ],
        },
        {
          tag: "IoT",
          headline: "Every sensor needs an address. Only IPv6 can provide one to each.",
          intro: "The Internet is shifting from ‘humans connecting’ to ‘every object participating’. Watches, vehicles, production lines, power grids — every device generates data, communicates continuously, and needs network identity.",
          highlights: [
            "3.4 × 10³⁸ unique addresses — enough for planetary-scale IoT",
            "6LoWPAN: IPv6 for low-power, low-bandwidth sensor networks",
            "Direct end-to-end connectivity without NAT overhead",
          ],
          extras: [],
          stats: [
            { value: "~41B", label: "Global IoT devices forecast by 2030 (18.8B in 2024)", cite: "IoT Analytics 2024" },
            { value: "3.6×", label: "M2M connections per capita globally by 2023", cite: "Cisco AIR 2023" },
            { value: "29B+", label: "Total networked devices forecast 2023", cite: "Cisco AIR 2023–2028" },
          ],
        },
      ],
      domainsLabel: "IoT deployment domains enabled by IPv6",
      domains: ["Smart home", "Smart healthcare", "Logistics & autonomous vehicles", "Smart agriculture", "Industrial IoT", "Smart buildings", "Digital urban infrastructure"],
      pullquote: "IPv6 is not background infrastructure for AI and IoT. It is the condition that makes both possible at scale.",
    },
    s09: {
      eyebrow: "IPv6 × Smart Infrastructure",
      headline1: "Smart cities run on 5G.",
      headline2: "5G runs on IPv6.",
      intro: "Urban intelligence and next-generation wireless connectivity converge on the same requirement: every system, device, and signal needs a unique address and real-time routing. IPv6 is the shared foundation layer for both.",
      sections: [
        {
          tag: "Smart Cities",
          headline: "A city is only ‘smart’ when every system can be identified and coordinated in real time.",
          intro: "Not sensors and cameras — a unified digital infrastructure where traffic, utilities, healthcare, and public services respond to real-time data through millions of directly addressable IPv6 endpoints.",
          highlights: [
            "Smart traffic: real-time signal coordination and V2X communication",
            "Smart healthcare: remotely monitored, continuously connected medical devices",
            "Smart utilities: IPv6-addressed power, water, and environmental sensors",
            "Public safety: large-scale surveillance and emergency coordination systems",
            "Digital citizen services: directly addressable e-government endpoints",
          ],
          extras: ["Hanoi", "Ho Chi Minh City", "Da Nang"],
          stats: [
            { value: "1B+", label: "Urban IoT endpoints forecast by 2030", cite: "IoT Analytics 2024" },
            { value: "3", label: "National smart-city pilot cities (Resolution 06/NQ-TW)", cite: "MIC · 2022" },
            { value: "5", label: "Infrastructure layers requiring IPv6-native design", cite: "ITU-T Y.4000 / Smart Sustainable Cities" },
          ],
        },
        {
          tag: "5G",
          headline: "5G is not faster Wi-Fi. It is a connectivity architecture for ultra-dense digital society.",
          intro: "5G handles radio access. IPv6 handles identity, routing, and scaling. Together: 5G is the wireless layer — IPv6 is the addressing circulatory system beneath it.",
          highlights: [
            "mMTC: 10⁶ devices/km² — only feasible within the IPv6 address space",
            "URLLC: sub-millisecond latency for autonomous vehicles and industrial robots",
            "5G Core Service-Based Architecture aligns naturally with IPv6-native networks",
            "Network slicing + IPv6 QoS enables real-time per-service resource allocation",
          ],
          extras: [],
          stats: [
            { value: "1M/km²", label: "mMTC device density (IMT-2020 target)", cite: "ITU-R M.2410-0" },
            { value: "< 1 ms", label: "URLLC user-plane latency target", cite: "ITU-R M.2410-0" },
            { value: "20 Gbps", label: "5G peak downlink throughput", cite: "ITU-R M.2410-0" },
          ],
        },
      ],
      pullquote: "The urban internet needs a protocol designed for density — not retrofitted for it.",
    },
    s11: {
      eyebrow: "IPv6 × Cybersecurity",
      headline1: "IPv6 does not automatically make networks more secure.",
      headline2: "It removes the architectural constraints that make modern security hard to implement correctly.",
      intro: "For years, the Internet had to patch IPv4’s problems with NAT, intermediary layers, bolt-on encryption, and address-hiding architectures instead of true identity management. IPv6 changes that foundation.",
      capLabel: "IPv6 enables a modern security model",
      capabilities: [
        {
          title: "IPSec integrated from the foundation",
          bullets: [
            "In IPv4, IPSec is a bolt-on component",
            "In IPv6, IPSec is integrated as part of the protocol architecture",
            "Provides better support for end-to-end encryption, node authentication, and large-scale secure connectivity",
          ],
        },
        {
          title: "Zero-Trust needs real identity capability",
          bullets: [
            "Modern zero-trust models require per-endpoint identification, continuous authentication, and identity-based control",
            "IPv6 makes this more viable with end-to-end global addresses, reduced NAT dependency, and clearer endpoint governance",
          ],
        },
        {
          title: "Cryptographically Generated Addresses (CGA)",
          bullets: [
            "IPv6 supports CGA mechanisms that bind identity to addresses",
            "Increases node trustworthiness, reduces spoofing risk in certain network models",
          ],
        },
        {
          title: "Simpler header, better inspection capability",
          bullets: [
            "IPv6 header design is more compact and consistent, reducing packet-processing ambiguity",
            "Helps firewalls, IDS/IPS, telemetry engines, and traffic analysis systems operate more effectively at scale",
          ],
        },
      ],
      cavLabel: "But IPv6 also requires higher operational maturity",
      caveats: [
        "Misconfiguration can expand the attack surface — IPv6 is not turn on and secure",
        "Monitoring systems may not fully see IPv6 traffic if not updated",
        "Successful transition requires engineer training, SOC process updates, monitoring upgrades, and new security thinking",
      ],
      closingNote: "The modern Internet cannot rely indefinitely on patches built for 1980s networking. IPv6 is not a complete security solution — but it is the foundation on which modern security architecture can stand.",
      pullquote: "A modern cybersecurity posture needs a protocol designed for the modern era.",
    },
    s12: {
      eyebrow: "Challenges & Strategic Solutions",
      headline1: "The gaps are real.",
      headline2: "So are the solutions.",
      challengesLabel: "Reality gaps",
      challenges: [
        { num: "01", title: "Specialized workforce gap", bullets: ["IPv6 capability concentrated at major ISPs, national infrastructure agencies, and dedicated technical teams", "SMEs, local enterprises, and provincial infrastructure still lack engineers capable of IPv6-native design and dual-stack operations"], maturityValue: "45%", maturityLabel: "IPv6 workforce" },
        { num: "02", title: "Legacy systems still IPv4-dependent", bullets: ["Many enterprise applications, government systems, and SME infrastructure are still built around IPv4", "This creates transition costs, operational complexity, and a psychology of upgrade deferral"], maturityValue: "", maturityLabel: "" },
        { num: "03", title: "Awareness asymmetry", bullets: ["Large corporations view IPv6 as long-term strategy and future scaling capability", "Many SMEs still view IPv6 as a technical cost rather than a competitive capability"], maturityValue: "40%", maturityLabel: "Market awareness" },
        { num: "04", title: "Geographic unevenness", bullets: ["IPv6 deployment strongest in major urban centers, data centers, and national backbone networks", "Local networks, smaller ISPs, and rural areas are still transitioning more slowly"], maturityValue: "60%", maturityLabel: "Deployment coverage" },
      ],
      solutionsLabel: "Strategic responses",
      solutions: [
        { title: "Workforce & Education", bullets: ["Integrate IPv6 into university IT curricula", "Build hands-on labs", "Launch national certification programs", "Connect training to real ISP & cloud demand"] },
        { title: "Enterprise Enablement", bullets: ["IPv6-ready deployment toolkit for SMEs", "Tax incentives or cloud credits", "ISP support programs", "Practical migration guidance"] },
        { title: "IPv6-First Policy", bullets: ["Public services prioritize IPv6", "IPv6-ready procurement standards", "National monitoring dashboard", "Transparent deployment KPIs by sector"] },
        { title: "Public Awareness", bullets: ["Mass media campaigns", "Popularized content for SMEs", "Integrate Internet knowledge into digital education"] },
        { title: "Research & Innovation", bullets: ["IPv6 × AI × IoT research labs", "Open datasets", "University–enterprise–government collaboration"] },
      ],
      pullquote: "Policy moves the system. Education moves the generation. Research moves the future.",
    },
    s14: {
      eyebrow: "National Roadmap to 2030",
      headline1: "2030 is not a 'technical deadline'.",
      headline2: "It is the strategic horizon Vietnam is navigating toward.",
      intro: "Rather than a linear plan, this roadmap is structured as three reinforcing layers — awareness & workforce, deployment & enablement, and sovereignty & leadership. Each phase names lead agencies and concrete KPI gates so the transition can be governed, measured, and held accountable.",
      prioritiesLabel: "Strategic priorities",
      outcomesLabel: "Expected outcomes",
      leadLabel: "Lead agencies",
      kpiLabel: "KPI gates",
      phases: [
        {
          title: "Foundation",
          target: "Awareness · Education · Workforce",
          priorities: [
            "Integrate IPv6 into university and technical curricula (CS/IT/Networking programs)",
            "Standardize training content for ISPs, enterprises, and SOC teams",
            "Launch a national workforce-certification program for IPv6-native engineers",
            "Build a Vietnamese-language IPv6 knowledge and lab resource base",
            "Run coordinated awareness campaigns via VNNIC, MIC, and major ISPs",
          ],
          outcomes: [
            "≥50% of technical universities offer IPv6-native courses",
            "10,000+ certified network engineers across ISPs, SOCs, and SMEs",
            "Public IPv6 awareness reaches measurable threshold (survey-based)",
          ],
          leadAgencies: ["VNNIC", "MIC", "MOET (Ministry of Education)", "Major ISPs"],
          kpiGates: ["≥50% universities with IPv6 curriculum", "≥10,000 certified engineers", "≥70% national IPv6 traffic"],
        },
        {
          title: "Expansion",
          target: "SMEs · Cloud · Local Infrastructure",
          priorities: [
            "Nationwide IPv6 transition support program for SMEs (toolkits + co-funded migration)",
            "Mandate IPv6-native deployment for all government cloud platforms",
            "Province-by-province network upgrade with prioritized rollout waves",
            "Expand IPv6 testing toolkits and conformance validation frameworks",
            "Embed IPv6 criteria into public procurement and digital service standards",
          ],
          outcomes: [
            "60%+ of SMEs complete IPv6 dual-stack or single-stack transition",
            "Government cloud infrastructure reaches ≥80% IPv6",
            "All new public digital services launched IPv6-native by default",
          ],
          leadAgencies: ["MIC", "VNNIC", "Government Cybersecurity Center", "Provincial DICs"],
          kpiGates: ["≥60% SME adoption", "≥80% gov cloud IPv6", "100% new public services IPv6-default"],
        },
        {
          title: "IPv6-First Vietnam",
          target: "Full stack · Smart Cities · Next-generation infrastructure",
          priorities: [
            "Migrate all public digital services to IPv6-only operation where feasible",
            "Synchronize Smart-City ecosystems (Hanoi, HCMC, Da Nang) with IPv6 infrastructure",
            "Target 90–99% national IPv6 deployment rate",
            "Position Vietnam as the SEA reference model for IPv6 transition",
            "Export policy frameworks and operational knowledge to ASEAN partners",
          ],
          outcomes: [
            "90–99% national IPv6 adoption achieved",
            "Regional leadership in digital sovereignty established",
            "Reference model adopted by developing nations across ASEAN",
          ],
          leadAgencies: ["MIC", "VNNIC", "National Digital Transformation Committee"],
          kpiGates: ["90–99% IPv6 traffic share", "100% gov services IPv6-first", "≥3 ASEAN partners adopting framework"],
        },
      ],
      closingNote: "These three phases overlap and reinforce one another, and require parallel resourcing. Phase 1 builds the workforce Phase 2 needs. Phase 2 builds the infrastructure Phase 3 depends on. Lead agencies are listed for governance accountability — they are not exhaustive owners.",
      pullquote: "2030 is not the end of the transition. It is the moment the next-generation Internet begins to become the default.",
    },
    s15: {
      eyebrow: "My Role",
      headline1: "I did not come to IPv6 as a short-term topic.",
      headline2: "I see it as part of a larger picture of the future of digital infrastructure.",
      intro: "As an IT student, I care about how the Internet is built, scaled, and operated at national scale —",
      intersectionLabel: "especially at the intersection of:",
      intersectionItems: ["network infrastructure", "AI", "cloud", "next-generation Internet"],
      motivationText: "What draws me is not just the new technology itself, but how technology becomes the foundation for:",
      motivationItems: ["the digital economy", "intelligent systems", "long-term national competitiveness"],
      posLabel: "Positioning",
      name: "Nguyen Thi Yen Nhi",
      school: "Ho Chi Minh City University of Industry and Trade",
      city: "Ho Chi Minh City",
      pathLabel: "Long-term orientation:",
      pathText: "From theoretical foundations → engineering practice → strategic thinking about Vietnam’s digital infrastructure.",
      capLabel: "Areas I’m actively developing",
      capabilities: [
        {
          title: "Networking & systems fundamentals",
          bullets: ["How the Internet operates", "How systems are designed", "How infrastructure scales at large scale"],
        },
        {
          title: "Applied AI & data",
          bullets: ["The intersection of AI, data, and cloud infrastructure", "Real-world deployment capabilities"],
        },
        {
          title: "Research from primary sources",
          bullets: ["RFC and technical documentation", "VNNIC and APNIC reports", "International Internet infrastructure sources — understanding from first principles, not summaries"],
        },
        {
          title: "Technical depth → strategic perspective",
          bullets: ["Not just understanding how the technology works", "But why it matters and how it shapes the digital ecosystem", "And how Vietnam can leverage it for long-term advantage"],
        },
      ],
      closingNote: "I am still at the beginning of my learning journey. But I want to walk this path seriously and sustainably — studying deeply, building strong foundations, and gradually contributing to the technology ecosystem I care about.",
      pullquote: "I don’t just want to use the next-generation Internet. I want to understand how it’s built — and help create it.",
    },
    s16: {
      eyebrow: "Why This Fellowship & Future Vision",
      headline1: "I do not see this fellowship as a credential.",
      headline2: "I see it as the entry point into building Vietnam’s next-generation Internet infrastructure.",
      intro: "The core value of this fellowship, in my view, lies in access to:",
      introBullets: [
        "National-scale infrastructure thinking",
        "A deep technical and practical learning environment",
        "A community of people actively building IPv6 and Vietnam’s Internet",
      ],
      reasonsLabel: "Why this fellowship matters to me",
      reasons: [
        {
          title: "Access to national infrastructure expertise",
          body: "The opportunity to learn directly from VNNIC experts and organizations deploying IPv6 at national scale — where knowledge is tied to real operational practice.",
        },
        {
          title: "Developing systems-level thinking",
          body: "From technical foundations, I aim to understand how Internet architecture is designed, how infrastructure policy is shaped, and how technical decisions affect national-scale systems.",
        },
        {
          title: "A long-term development environment",
          body: "Joining a community focused on Internet infrastructure and scalability, rather than short-term applications.",
        },
        {
          title: "Foundation for meaningful contribution",
          body: "The fellowship enables me to build capability in IPv6 and next-gen networking, AI infrastructure and distributed systems, and the next-generation Internet in Vietnam.",
        },
      ],
      visionsLabel: "Development trajectory",
      horizons: [
        {
          title: "Engineering & research",
          yearLabel: "+5 years",
          body: "Deep specialization in network systems and IPv6-native infrastructure. Working at the intersection of networking, cloud, and AI systems. Contributing to real-world projects in the digital ecosystem.",
        },
        {
          title: "Policy × infrastructure",
          yearLabel: "+10 years",
          body: "Working in public-private collaboration models for digital infrastructure. Contributing to next-generation Internet strategy at the regional level. Part of the broader digital sovereignty conversation.",
        },
        {
          title: "Long-horizon vision",
          yearLabel: "Long horizon",
          body: "Helping build the next generation of Vietnam’s Internet: more architecturally secure, larger in scale, and ready for AI, IoT, and IPv6-native infrastructure.",
        },
      ],
      closingNote: "This fellowship is not the destination. It is a step into the right ecosystem I am committed to pursuing long-term.",
      pullquote: "I am not looking for recognition. I am looking for the capability to create real value in the system I am learning — and will help build.",
    },
    s18: {
      eyebrow: "Closing Statement",
      headline1: "Vietnam’s next Internet will not be inherited from the past.",
      headlineBuilt: "It will be built.",
      layerIntro: "Not through a single leap,",
      layerSubtitle: "but through deliberate accumulation, layer by layer:",
      layers: [
        "every protocol redesigned",
        "every policy recalibrated",
        "every system restructured",
        "every person who chooses to help shape its direction",
      ],
      closing1: "In that picture, I am not standing on the outside watching.",
      closing2: "I choose to become part of the process of building it.",
      pullquote: "Vietnam’s next Internet does not form on its own — it is built by people who dare to participate in shaping it.",
    },
    s19: {
      eyebrow: "References & Research Sources",
      headline1: "Strong claims require",
      headline2: "strong sources.",
      methodLabel: "Methodological basis",
      methodTitle: "Evidence-based Infrastructure Analysis",
      methodSourcesLabel: "Drawing from 4 source categories:",
      methodSources: [
        "National policy & legal documents",
        "Technical standards (IETF / RFC)",
        "Global Internet measurement data",
        "Industry reports & international organisations",
      ],
      methodNote: "Analysis and visualisations are synthesis and interpretation — they do not replace the original data sources.",
      groups: [
        {
          title: "🇻🇳 Vietnam — National Policy & Legal Documents",
          items: [
            { name: "VNNIC — Vietnam Internet Network Information Center", url: "https://vnnic.vn", desc: "National Internet resource authority; leads IPv6 deployment strategy" },
            { name: "IPv6 For Gov Programme 2021–2025", url: "https://vnnic.vn/ipv6forgov", desc: "VNNIC national programme for IPv6 adoption across government agencies" },
            { name: "Decision 749/QĐ-TTg — National Digital Transformation", url: "https://vanban.chinhphu.vn/?pageid=27160&docid=200163", desc: "National Digital Transformation Programme to 2025, vision 2030" },
            { name: "Decision 411/QĐ-TTg — Digital Economy & Society", url: "https://vanban.chinhphu.vn/?pageid=27160&docid=205555", desc: "National Strategy for Digital Economy & Digital Society to 2025, vision 2030" },
            { name: "APNIC Labs — Vietnam IPv6 Adoption Statistics", url: "https://stats.labs.apnic.net/ipv6/VN", desc: "Country-level IPv6 deployment measurement for Vietnam, updated continuously" },
          ],
        },
        {
          title: "🌐 Global IPv6 Measurement & Internet Data",
          items: [
            { name: "APNIC Labs — IPv6 Measurement System", url: "https://stats.labs.apnic.net/ipv6", desc: "Per-country IPv6 adoption measurement, updated continuously" },
            { name: "Google IPv6 Statistics", url: "https://www.google.com/intl/en/ipv6/statistics.html", desc: "IPv6 user share observed across Google's global infrastructure" },
            { name: "Internet Society — Deploy360 IPv6", url: "https://www.internetsociety.org/deploy360/ipv6/", desc: "Deployment guidance and global IPv6 adoption data from ISOC" },
            { name: "Cloudflare Radar — Adoption & Usage", url: "https://radar.cloudflare.com/adoption-and-usage", desc: "IPv6 traffic trends derived from Cloudflare's real-world network data" },
          ],
        },
        {
          title: "📘 Technical Standards (IETF / RFC)",
          roleNote: "These documents directly define IPv6 protocol architecture.",
          items: [
            { name: "RFC 8200 — Internet Protocol, Version 6 Specification", url: "https://datatracker.ietf.org/doc/html/rfc8200", desc: "The authoritative IPv6 standard, replacing RFC 2460 (published 2017)" },
            { name: "RFC 4291 — IP Version 6 Addressing Architecture", url: "https://datatracker.ietf.org/doc/html/rfc4291", desc: "Defines IPv6 address types: unicast, multicast, anycast" },
            { name: "RFC 4862 — IPv6 Stateless Address Autoconfiguration", url: "https://datatracker.ietf.org/doc/html/rfc4862", desc: "SLAAC mechanism — devices self-assign routable addresses without DHCP" },
            { name: "RFC 791 — Internet Protocol (IPv4)", url: "https://datatracker.ietf.org/doc/html/rfc791", desc: "Original IPv4 specification (1981) — context for IPv4's structural limits" },
          ],
        },
        {
          title: "📊 Industry Reports & International Organisations",
          items: [
            { name: "ITU-R Report M.2410-0 — IMT-2020 (5G) Minimum Requirements", url: "https://www.itu.int/pub/R-REP-M.2410-2017", desc: "ITU standard defining 5G performance targets — source of mMTC & URLLC figures" },
            { name: "IoT Analytics — Number of Connected IoT Devices", url: "https://iot-analytics.com/number-connected-iot-devices/", desc: "Global IoT device count tracking — 21.1B devices in 2025, forecast to 2030" },
            { name: "Ericsson Mobility Report — IoT Connections Outlook", url: "https://www.ericsson.com/en/reports-and-papers/mobility-report", desc: "Freely available global connectivity forecast including IoT device projections" },
            { name: "Meta AI — Llama 3 Technical Blog", url: "https://ai.meta.com/blog/meta-llama-3/", desc: "Illustrates distributed AI training at scale — 25 K+ GPU cluster infrastructure" },
          ],
        },
      ],
      academicLabel: "Academic notes",
      academicNotes: [
        "All data sourced from public, verifiable references",
        "Analysis is system-level synthesis, not standalone commentary",
        "No proprietary or unverified data sources used",
        "Goal: reflect the infrastructure picture, not just describe the technology",
      ],
    },
    s20: {
      badge: "20 / 20",
      title: "Thank you.",
      nameLabel: "Nguyen Thi Yen Nhi",
      byline: "Candidate · VNNIC Internet School for Youth Fellowship 2026",
      intro: "Thank you — to the organizing team, the reviewers, and everyone who took the time to listen. Getting to share something I genuinely care about, in a room like this, means more than I can easily put into words.",
      contactLabel: "Contact",
      contactLabels: ["Email", "Portfolio"],
      portfolioInvite: "If you'd like to know more about me — my projects, learning journey, and what I'm building — feel free to visit my portfolio. I'd love to connect!",
      footerTitle: "Closing thought",
      footerBody: "Some fields do not just require knowledge — they require the belief that the work matters. Every protocol understood, every architecture traced, every policy read with care — is a small act of real learning. I'm grateful for the space to explore that here, and for your time today.",
      pullquote: "The next generation of Vietnam's Internet does not need to wait for permission. It only needs to begin — and never stop.",
    },
    s_ecosystem_hub: {
      eyebrow: "IPv6 as the Foundation Layer",
      headline1: "IPv6 does not serve one system.",
      headline2: "It enables every system simultaneously.",
      nodes: [
        { label: "AI Data\nCenters",     sub: "SRv6 · GPU clusters · edge AI" },
        { label: "IoT\nNetworks",        sub: "6LoWPAN · 41B devices by 2030" },
        { label: "5G\nArchitecture",     sub: "mMTC · URLLC · eMBB" },
        { label: "Smart\nCities",        sub: "Hanoi · HCMC · Da Nang" },
        { label: "Digital\nGovernment",  sub: "IPv6 For Gov 2021–2025" },
        { label: "Cyber-\nsecurity",     sub: "IPSec · CGA · Zero-Trust" },
      ],
      pullquote: "IPv6 is not a feature of one technology. It is the architectural substrate that makes all next-generation technologies operable at scale.",
    },
    s_adoption_chart: {
      eyebrow: "Vietnam's IPv6 Adoption Trajectory",
      headline1: "From 22% in 2019 to 64% in 2024.",
      headline2: "Consistent, policy-driven progress.",
      vnLabel: "Vietnam",
      globalLabel: "Global average",
      targetLabel: "90% target · 2030",
      targetShortLabel: "2030 target",
      sourceNote: "Data: VNNIC Annual IPv6 Report 2024 · APNIC Labs Measurement System. 2019–2023 figures approximate; Q4 2024 (~64%) from VNNIC official measurement. Global average from APNIC Labs aggregate.",
      stats: [
        { value: "+42 pts", label: "Growth 2019 → 2024", sub: "vs. +18 pts global avg" },
        { value: "Top 10",  label: "Global IPv6 ranking",  sub: "Q4 2024 · APNIC Labs" },
        { value: "+26 pts", label: "To reach 90% target",  sub: "by 2030 · 6 years remaining" },
      ],
      pullquote: "The path to 90% is not a technical problem. It is a deployment, workforce, and policy challenge — which the 2026–2030 roadmap directly addresses.",
    },
    s_asean_chart: {
      eyebrow: "Regional Context — ASEAN IPv6 Deployment",
      headline1: "Vietnam leads ASEAN in IPv6 adoption.",
      headline2: "The question is what happens next.",
      sourceNote: "Approximate figures from APNIC Labs · Q4 2024. Values rounded to nearest percentage point. Country rankings may vary by measurement methodology and reporting period.",
      highlightLabel: "Vietnam's Regional Position",
      highlightBody: "At ~64%, Vietnam leads the ASEAN region — a position built through sustained national policy (IPv6 For Gov) and coordinated ISP migration programs since 2021.",
      regionLabel: "The Regional Opportunity",
      regionBody: "The ASEAN average sits at ~35–40%. Vietnam's lead creates a window to serve as the regional reference model for IPv6 transition policy — exporting frameworks, not just adopting them.",
      pullquote: "Leading in adoption metrics is only meaningful if the lead translates into architectural capability — not just a traffic share statistic.",
    },
  },

  vi: {
    s01: {
      badge: "Học bổng VNNIC Internet for Youth 2026",
      title: "IPv6 – Nền tảng chiến lược cho hạ tầng số Việt Nam",
      subtitle: "Góc nhìn nghiên cứu về IPv6 trong bối cảnh AI, IoT và chuyển đổi số quốc gia",
      tags: ["Nguyễn Thị Yến Nhi", "Sinh viên năm 3, ngành Công nghệ Thông tin | Đại học Công Thương TP. Hồ Chí Minh"],
      cta: "Vuốt để bắt đầu",
    },
    s_intro: {
      eyebrow: "Góc nhìn nghiên cứu",
      sections: [
        {
          title: "1. Cách em nhìn về Internet",
          intro: "Trong quá trình học Công nghệ Thông tin, em không chỉ nhìn Internet dưới góc độ người sử dụng, mà bắt đầu xem nó như một hệ thống hạ tầng có giới hạn rõ ràng về khả năng mở rộng. Khi tìm hiểu sâu hơn về cách các hệ thống được thiết kế và vận hành, em nhận ra rằng:",
          bullets: [
            "Giới hạn quan trọng nhất không nằm ở lớp ứng dụng",
            "Mà nằm ở kiến trúc nền tảng của Internet và khả năng mở rộng dài hạn",
          ],
        },
        {
          title: "2. Góc nhìn về IPv6",
          intro: "Từ góc nhìn này, IPv6 không đơn thuần là một giải pháp thay thế IPv4, mà là một sự chuyển dịch về kiến trúc Internet. Sự chuyển dịch này xuất phát từ áp lực mở rộng đến từ:",
          bullets: [
            "AI",
            "IoT",
            "Các hệ thống dữ liệu quy mô lớn",
          ],
        },
        {
          title: "3. Cách em tiếp cận đề tài",
          intro: "Em tiếp cận đề tài này theo hướng phân tích hệ thống, tập trung vào việc làm rõ:",
          bullets: [
            "Các thay đổi ở tầng giao thức",
            "Ảnh hưởng đến cấu trúc vận hành của hệ sinh thái số",
            "Ở cấp độ quốc gia",
          ],
        },
      ],
    },
    s_abstract: {
      eyebrow: "Tóm tắt chiến lược",
      title: "IPv6 — Hạ tầng chiến lược cho chủ quyền số của Việt Nam.",
      summary:
        "Bản đề xuất này lập luận rằng IPv6 không phải một nâng cấp kỹ thuật, mà là điều kiện kiến trúc để kinh tế số, hệ thống thông minh và chủ quyền số của Việt Nam có thể mở rộng trong giai đoạn 2026–2030. Dựa trên Quyết định 749/QĐ-TTg (2020), Quyết định 411/QĐ-TTg (2022) và Chương trình IPv6 For Gov của VNNIC (2021–2025), bài phân tích chỉ ra khoảng cách giữa tỷ lệ triển khai hiện tại, yêu cầu mở rộng của AI/IoT/5G và các điểm nghẽn về nhân lực, SME, và hệ thống legacy. Năm trụ cột giải pháp và lộ trình ba giai đoạn được đề xuất nhằm đưa IPv6 toàn quốc đạt 90–100% vào năm 2030.",
      pillars: [
        { tag: "Luận điểm", title: "IPv6 là hạ tầng, không phải giao thức", body: "Tỷ lệ triển khai là hàm số của chính sách, nhân lực và thiết kế kiến trúc — không phải băng thông." },
        { tag: "Phương pháp", title: "Phân tích hệ thống dựa trên bằng chứng", body: "Kết hợp nguồn VNNIC, APNIC, ITU, Cisco, Cloudflare và RFC của IETF — không dùng dữ liệu độc quyền hay chưa kiểm chứng." },
        { tag: "Kết quả", title: "Năm trụ cột × Ba giai đoạn", body: "Nhân lực, hỗ trợ SME, chính sách IPv6-first, nhận thức, R&D — triển khai theo 2026–27, 2027–28, 2028–30." },
      ],
      keywordsLabel: "Từ khoá chiến lược",
      keywords: [
        "hạ tầng số",
        "kiến trúc mạng có khả năng mở rộng",
        "quản trị Internet",
        "chuyển đổi số quốc gia",
        "hệ sinh thái AI",
        "hạ tầng độ trễ thấp",
        "IPv6 For Gov",
        "chủ quyền số",
      ],
      citationLine: "Nguồn: VNNIC (2024) · APNIC Labs · QĐ 749/QĐ-TTg · QĐ 411/QĐ-TTg · ITU-R M.2410 · Cisco AIR 2023–2028 · IoT Analytics 2024.",
    },
    s02: {
      eyebrow: "Tầm nhìn",
      headline1: "Hạ tầng Internet là nền móng của nền kinh tế số hiện đại.",
      headline2: "Trong bối cảnh đó, IPv6 không chỉ là một nâng cấp kỹ thuật, mà là một lựa chọn chiến lược cho tầm nhìn dài hạn của Việt Nam trong 20–30 năm tới.",
      subhead: "IPv6 nằm tại giao điểm giữa chính sách quốc gia, trí tuệ nhân tạo, Internet of Things và chủ quyền kỹ thuật số, nơi các quyết định về kiến trúc mạng có thể ảnh hưởng trực tiếp đến cấu trúc phát triển của toàn bộ nền kinh tế số.",
      pullquote: "Ai kiểm soát không gian địa chỉ, người đó định hình kiến trúc của tương lai Internet.",
    },
    s03: {
      eyebrow: "Tại sao hạ tầng Internet mang tính chiến lược",
      headline1: "Internet không đơn thuần là một công cụ kết nối —",
      headline2: "đó là hạ tầng",
      headline3: "quốc gia cốt lõi.",
      subhead: "Tương tự đường bộ trong logistics hay lưới điện trong năng lượng, Internet đóng vai trò lớp vận chuyển cho toàn bộ hệ sinh thái số: thương mại, quản trị, y tế và trí tuệ nhân tạo.",
      analogyLegacyLabel: "Hạ tầng vật lý của thế kỷ trước",
      analogyConnectorLabel: "Tương đương",
      analogyDigitalLabel: "Hạ tầng số của thế kỷ này",
      analogyItems: ["Đường giao thông", "Lưới điện", "Cấp thoát nước"],
      analogyDigitalItem: "Hạ tầng Internet",
      pillars: [
        { tag: "Tầng kinh tế số", title: "GDP kỹ thuật số vận hành trên luồng dữ liệu liên tục", body: "Doanh nghiệp cloud-native phụ thuộc trực tiếp vào khả năng mở rộng hạ tầng mạng. Tăng trưởng kinh tế số gắn liền với năng lực của tầng hạ tầng Internet." },
        { tag: "Tầng chủ quyền số", title: "Kiến trúc mạng ảnh hưởng đến khả năng kiểm soát dữ liệu quốc gia", body: "An ninh mạng và khả năng chống chịu phụ thuộc vào thiết kế giao thức nền tảng. Lựa chọn hạ tầng = mức độ tự chủ số của quốc gia." },
        { tag: "Tầng đổi mới công nghệ", title: "AI, IoT, 5G và smart city đều hội tụ trên hạ tầng Internet", body: "Mọi hệ thống số thế hệ mới đều phụ thuộc vào khả năng kết nối và địa chỉ hóa. Giao thức Internet là lớp nền của mọi lớp nền trong kiến trúc số." },
      ],
      pullquote: "Hạ tầng vô hình — cho đến khi nó thất bại. Khi đó, nó trở thành yếu tố quan trọng nhất của toàn hệ thống.",
    },
    s04: {
      eyebrow: "Tại sao phải chuyển sang IPv6",
      headline1: "IPv4 đã đến giới hạn cấu trúc.",
      headline2: "IPv6 không phải bản vá — đó là tái kiến trúc nền tảng.",
      crisisLabel: "Khủng hoảng IPv4",
      cascade: [
        { title: "Cạn kiệt nguồn địa chỉ IPv4 công cộng miễn phí", bullets: ["Các tổ chức lớn như APNIC, RIPE NCC và ARIN đã gần như cạn kiệt toàn bộ kho địa chỉ IPv4 công cộng", "Việc cấp phát hiện phụ thuộc vào tái sử dụng, thu hồi và thị trường chuyển nhượng địa chỉ"] },
        { title: "NAT: giải pháp tạm thời trở thành kiến trúc mặc định", bullets: ["NAT kéo dài vòng đời IPv4 nhưng phá vỡ kết nối end-to-end ban đầu", "Hạ tầng mạng ngày càng khó quản trị, khó mở rộng và phức tạp hơn về bảo mật"] },
        { title: "Chi phí mở rộng hạ tầng ngày càng tăng", bullets: ["Giá thuê và chuyển nhượng IPv4 tiếp tục tăng khi khan hiếm sâu hơn", "Startup cloud-native và IoT đang gánh chi phí phát sinh từ kiến trúc Internet thế hệ cũ"] },
      ],
      stat1value: "4,29 tỷ",
      stat1label: "Không gian địa chỉ IPv4 theo thiết kế (32-bit)",
      stat1cite: "RFC 791 · 1981",
      stat2value: "~41 tỷ",
      stat2label: "Thiết bị IoT toàn cầu dự kiến đến 2030 (≈18,8 tỷ vào 2024)",
      stat2cite: "IoT Analytics · State of IoT 2024",
      stat3value: "0 khối",
      stat3label: "Khối địa chỉ IPv4 công cộng còn trống tại các RIR lớn (APNIC, RIPE NCC, ARIN, LACNIC)",
      stat3cite: "Đăng ký APNIC · RIPE NCC · ARIN",
      solutionLabel: "Vì sao lại chuyển sang IPv6",
      thDim: "Chiều",
      rows: [
        { dim: "Không gian địa chỉ", v4: "4,3 × 10⁹", v6: "3,4 × 10³⁸" },
        { dim: "Phụ thuộc NAT", v4: "Bắt buộc", v6: "Gần như loại bỏ" },
        { dim: "Cấu trúc header gói tin", v4: "Phức tạp, lỗi thời", v6: "Tối giản, hiệu quả hơn" },
        { dim: "Bảo mật tích hợp", v4: "Được bổ sung bên ngoài giao thức", v6: "IPSec tích hợp sẵn từ nền tảng" },
        { dim: "Tự cấu hình & tính di động", v4: "Hỗ trợ hạn chế", v6: "Tích hợp sẵn (SLAAC)" },
        { dim: "Khả năng mở rộng IoT", v4: "Bị giới hạn về địa chỉ", v6: "Thiết kế sẵn cho quy mô hàng tỷ thiết bị" },
      ],
      pullquote: "IPv6 là Internet được thiết kế lại với tất cả kiến thức mà nhân loại đã học được từ Internet thế hệ đầu tiên.",
    },
    s06: {
      eyebrow: "Chiến lược IPv6 Quốc gia",
      headline1: "Việt Nam không chỉ \"theo kịp\" quá trình chuyển đổi IPv6 toàn cầu.",
      headline2: "Việt Nam đang định vị mình trong nhóm dẫn đầu khu vực.",
      intro: "Dưới sự điều phối của Trung tâm Internet Việt Nam (VNNIC) thuộc Bộ TT&TT, quá trình chuyển đổi IPv6 được neo trên ba khung chính sách quốc gia hội tụ (xem bên dưới). Cùng nhau, các văn bản này xác định IPv6 là nền tảng hạ tầng chiến lược cho:",
      foundations: ["Chính phủ số", "Kinh tế số", "Xã hội số", "Hạ tầng cloud & IoT quốc gia", "Internet thế hệ tiếp theo"],
      policyLabel: "Các văn bản chính sách nền tảng",
      policyAnchors: [
        { code: "Quyết định 749/QĐ-TTg", title: "Chương trình Chuyển đổi số Quốc gia đến 2025, định hướng 2030", year: "03/06/2020", url: "https://vanban.chinhphu.vn/?pageid=27160&docid=200163" },
        { code: "Quyết định 411/QĐ-TTg", title: "Chiến lược phát triển Kinh tế số & Xã hội số đến 2025, định hướng 2030", year: "31/03/2022", url: "https://vanban.chinhphu.vn/default.aspx?pageid=27160&docid=205605" },
        { code: "Chương trình IPv6 For Gov", title: "Chương trình quốc gia của VNNIC — triển khai IPv6 cho cơ quan nhà nước (Giai đoạn 2021–2025)", year: "2021–2025", url: "https://vnnic.vn/ipv6/ipv6forgov" },
      ],
      posLabel: "Vị trí hiện tại của Việt Nam",
      globalLabel: "Xếp hạng toàn cầu",
      aseanLabel: "Xếp hạng ASEAN",
      trafficLabel: "Tỷ lệ lưu lượng IPv6 quốc gia",
      positionStats: [
        { value: "Top 10", label: "Xếp hạng triển khai IPv6 toàn cầu", cite: "APNIC Labs · 2024" },
        { value: "Top 2", label: "Vị trí trong khu vực ASEAN", cite: "VNNIC · 2024" },
        { value: "~64%", label: "Tỷ lệ traffic IPv6 quốc gia (Q4/2024)", cite: "thongke.ipv6.vn" },
      ],
      posNote: "Việt Nam thuộc nhóm các nền kinh tế có tỷ lệ triển khai IPv6 cao nhất thế giới — vượt nhiều thị trường phát triển truyền thống — và đang trên lộ trình đạt mục tiêu 90–100% vào năm 2030. [Báo cáo IPv6 thường niên VNNIC, 2024].",
      objLabel: "Mục tiêu chiến lược đến năm 2030",
      objectives: [
        {
          title: "Hạ tầng quốc gia IPv6-Only",
          bullets: ["Xây dựng mạng Internet quốc gia vận hành ưu tiên hoặc hoàn toàn trên IPv6", "Giảm dần sự phụ thuộc vào IPv4"],
        },
        {
          title: "Phổ cập IPv6 trên mọi nền tảng",
          bullets: ["Đạt 90–100% triển khai IPv6 trên dịch vụ công & hệ thống chính phủ", "ISP & mobile network, datacenter & cloud", "Hạ tầng doanh nghiệp & nền tảng số quốc gia"],
        },
        {
          title: "Dẫn đầu Internet thế hệ mới trong khu vực",
          bullets: ["Định vị Việt Nam như trung tâm triển khai IPv6, 5G và IoT quy mô lớn", "Smart City, AI infrastructure, cloud-native networking"],
        },
      ],
      citiesLabel: "Các trung tâm triển khai trọng điểm",
      cities: ["Hà Nội", "Đà Nẵng", "TP. Hồ Chí Minh"],
      pullquote: "IPv6 không còn là lựa chọn kỹ thuật. Nó là hạ tầng chiến lược cho nền kinh tế số quốc gia.",
    },
    s07: {
      eyebrow: "IPv6 × Hệ thống thông minh",
      headline1: "AI và IoT mở rộng trên cùng một nền tảng:",
      headline2: "một giao thức có thể định địa chỉ mọi thứ, ở khắp nơi.",
      intro: "Hệ thống AI hiện đại và hạ tầng IoT đều có chung một yêu cầu cấu trúc — mỗi node, thiết bị và điểm cuối cần một địa chỉ duy nhất, có thể định tuyến toàn cầu. IPv6 là nền tảng đó.",
      sections: [
        {
          tag: "AI",
          headline: "AI không mở rộng chỉ nhờ GPU. Nó mở rộng nhờ hạ tầng mạng.",
          intro: "Distributed training, edge AI và federated learning đều giao tiếp qua địa chỉ IP. Khi một lần training hyperscale trải rộng hàng chục nghìn GPU node, vấn đề không còn là compute — mà là định danh, định tuyến và đồng bộ.",
          highlights: [
            "Định địa chỉ trực tiếp từng node — không NAT, không overlay phức tạp",
            "Edge AI cần địa chỉ định tuyến toàn cầu cho inference thời gian thực",
            "Federated learning đòi hỏi đồng bộ độ trễ cực thấp giữa các node",
            "SRv6 cho phép traffic engineering thông minh theo tải AI quy mô lớn",
          ],
          extras: [],
          stats: [
            { value: "25K+", label: "Node GPU mỗi đợt training hyperscale", cite: "NVIDIA · Meta Llama 3" },
            { value: "< 1 ms", label: "Mục tiêu độ trễ inter-pod cho AI fabric", cite: "ITU-R M.2410 URLLC" },
            { value: "3.4×10³⁸", label: "Không gian địa chỉ IPv6 — đủ cho mọi topology AI", cite: "RFC 4291" },
          ],
        },
        {
          tag: "IoT",
          headline: "Mỗi cảm biến cần một địa chỉ. Chỉ IPv6 mới có thể cấp cho từng thiết bị.",
          intro: "Internet đang chuyển từ 'con người kết nối' sang 'mọi vật thể tham gia'. Từ đồng hồ, xe hơi đến dây chuyền sản xuất và lưới điện — mọi thiết bị tạo ra dữ liệu, giao tiếp liên tục và cần được định danh trên mạng.",
          highlights: [
            "3.4 × 10³⁸ địa chỉ — đủ cho IoT ở quy mô hành tinh",
            "6LoWPAN: IPv6 cho mạng cảm biến công suất thấp, băng thông hẹp",
            "Kết nối trực tiếp end-to-end, không overhead NAT",
          ],
          extras: [],
          stats: [
            { value: "~41 tỷ", label: "Thiết bị IoT toàn cầu dự kiến 2030 (18,8 tỷ vào 2024)", cite: "IoT Analytics 2024" },
            { value: "3.6×", label: "Kết nối M2M trên đầu người toàn cầu năm 2023", cite: "Cisco AIR 2023" },
            { value: "29 tỷ+", label: "Tổng số thiết bị kết nối mạng dự báo 2023", cite: "Cisco AIR 2023–2028" },
          ],
        },
      ],
      domainsLabel: "Những ngành đang được tái định hình bởi IPv6 + IoT",
      domains: ["Nhà thông minh", "Y tế thông minh", "Logistics & phương tiện tự động", "Nông nghiệp thông minh", "IoT công nghiệp", "Tòa nhà thông minh", "Hạ tầng đô thị số"],
      pullquote: "IPv6 không phải hạ tầng nền cho AI và IoT. Đó là điều kiện làm cho cả hai có thể mở rộng ở quy mô đó.",
    },
    s09: {
      eyebrow: "IPv6 × Hạ tầng thông minh",
      headline1: "Thành phố thông minh chạy trên 5G.",
      headline2: "5G chạy trên IPv6.",
      intro: "Trí thông minh đô thị và kết nối không dây thế hệ mới hội tụ trên cùng một yêu cầu: mỗi hệ thống, thiết bị và tín hiệu cần địa chỉ duy nhất và định tuyến thời gian thực. IPv6 là lớp nền tảng chung.",
      sections: [
        {
          tag: "Thành phố thông minh",
          headline: "Thành phố chỉ thực sự 'thông minh' khi mọi hệ thống được định danh và điều phối theo thời gian thực.",
          intro: "Không phải cảm biến và camera — mà là hạ tầng số thống nhất nơi giao thông, điện nước, y tế và dịch vụ công phản hồi dữ liệu thời gian thực qua hàng triệu điểm kết nối IPv6 có địa chỉ trực tiếp.",
          highlights: [
            "Giao thông thông minh: điều phối tín hiệu và V2X thời gian thực",
            "Y tế thông minh: thiết bị y tế kết nối và giám sát từ xa liên tục",
            "Tiện ích thông minh: cảm biến điện, nước, môi trường IPv6-native",
            "An toàn công cộng: giám sát quy mô lớn và điều phối khẩn cấp",
            "Dịch vụ công số: điểm cuối e-government có địa chỉ trực tiếp",
          ],
          extras: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"],
          stats: [
            { value: "1B+", label: "Số endpoint IoT đô thị dự báo đến 2030", cite: "IoT Analytics 2024" },
            { value: "3", label: "Thành phố thí điểm Smart City quốc gia (NQ 06/NQ-TW)", cite: "Bộ TT&TT · 2022" },
            { value: "5", label: "Lớp hạ tầng yêu cầu thiết kế IPv6-native", cite: "ITU-T Y.4000 / Smart Sustainable Cities" },
          ],
        },
        {
          tag: "5G",
          headline: "5G không phải WiFi nhanh hơn. Đó là kiến trúc kết nối cho xã hội số mật độ cực cao.",
          intro: "5G xử lý truy cập vô tuyến. IPv6 xử lý định danh, định tuyến và mở rộng quy mô. 5G là lớp vô tuyến — IPv6 là hệ thống tuần hoàn địa chỉ bên dưới nó.",
          highlights: [
            "mMTC: 10⁶ thiết bị/km² — chỉ khả thi trong không gian địa chỉ IPv6",
            "URLLC: độ trễ dưới 1ms cho xe tự hành và robot công nghiệp",
            "5G Core Service-Based Architecture phù hợp tự nhiên với mạng IPv6-native",
            "Network slicing + IPv6 QoS cho phép phân bổ tài nguyên theo thời gian thực",
          ],
          extras: [],
          stats: [
            { value: "1M/km²", label: "Mật độ thiết bị mMTC (mục tiêu IMT-2020)", cite: "ITU-R M.2410-0" },
            { value: "< 1 ms", label: "Mục tiêu độ trễ user-plane URLLC", cite: "ITU-R M.2410-0" },
            { value: "20 Gbps", label: "Băng thông đỉnh tải xuống 5G", cite: "ITU-R M.2410-0" },
          ],
        },
      ],
      pullquote: "Internet đô thị cần một giao thức được thiết kế cho mật độ — không phải cải tiến để chạy kịp với nó.",
    },
    s11: {
      eyebrow: "IPv6 × An ninh mạng",
      headline1: "IPv6 không tự động làm mạng an toàn hơn.",
      headline2: "Nó loại bỏ những giới hạn kiến trúc khiến bảo mật hiện đại khó được triển khai đúng cách.",
      intro: "Trong nhiều năm, Internet phải 'vá' các vấn đề của IPv4 bằng NAT, lớp trung gian, bảo mật bổ sung sau và các kiến trúc che giấu địa chỉ thay vì quản trị danh tính thực sự. IPv6 thay đổi nền tảng đó.",
      capLabel: "IPv6 mở đường cho mô hình bảo mật hiện đại",
      capabilities: [
        {
          title: "IPSec được tích hợp từ nền tảng",
          bullets: [
            "Trong IPv4, IPSec là thành phần bổ sung",
            "Trong IPv6, IPSec được tích hợp như một phần của kiến trúc giao thức",
            "Tạo điều kiện tốt hơn cho mã hóa end-to-end, xác thực node và kết nối bảo mật quy mô lớn",
          ],
        },
        {
          title: "Zero-Trust cần khả năng định danh thật",
          bullets: [
            "Mô hình zero-trust hiện đại yêu cầu nhận diện từng endpoint, xác thực liên tục và kiểm soát theo danh tính",
            "IPv6 giúp điều này khả thi hơn nhờ địa chỉ toàn cầu end-to-end, giảm phụ thuộc vào NAT và quản trị endpoint rõ ràng hơn",
          ],
        },
        {
          title: "Cryptographically Generated Addresses (CGA)",
          bullets: [
            "IPv6 hỗ trợ các cơ chế CGA giúp ràng buộc danh tính với địa chỉ",
            "Tăng độ tin cậy của node, giảm nguy cơ giả mạo trong một số mô hình mạng",
          ],
        },
        {
          title: "Header đơn giản hơn, khả năng kiểm tra tốt hơn",
          bullets: [
            "Thiết kế header IPv6 gọn hơn và nhất quán hơn, giảm mơ hồ xử lý packet",
            "Giúp firewall, IDS/IPS, telemetry engine và hệ thống phân tích lưu lượng hoạt động hiệu quả hơn ở quy mô lớn",
          ],
        },
      ],
      cavLabel: "Nhưng IPv6 cũng yêu cầu mức trưởng thành cao hơn",
      caveats: [
        "Cấu hình sai có thể mở rộng bề mặt tấn công — IPv6 không phải 'bật lên là an toàn'",
        "Hệ thống giám sát có thể không nhìn thấy lưu lượng IPv6 đầy đủ nếu không được cập nhật",
        "Chuyển đổi thành công đòi hỏi đào tạo kỹ sư, cập nhật quy trình SOC, nâng cấp monitoring và tư duy bảo mật mới",
      ],
      closingNote: "Internet hiện đại không thể dựa mãi trên những lớp vá được xây dựng cho mạng của thập niên 1980. IPv6 không phải giải pháp bảo mật hoàn chỉnh — nhưng nó là nền móng để kiến trúc bảo mật hiện đại có thể đứng vững.",
      pullquote: "Tư thế an ninh mạng hiện đại cần một giao thức được thiết kế cho thời đại hiện đại.",
    },
    s12: {
      eyebrow: "Thực tế & Giải pháp chiến lược",
      headline1: "Những khoảng cách là thực tế.",
      headline2: "Và giải pháp cũng vậy.",
      challengesLabel: "Khoảng cách thực tế",
      challenges: [
        { num: "01", title: "Khoảng cách nhân lực chuyên biệt", bullets: ["Năng lực IPv6 tập trung ở các ISP lớn, cơ quan hạ tầng quốc gia và nhóm kỹ thuật chuyên dụng", "SME, doanh nghiệp địa phương và hạ tầng tỉnh thành vẫn thiếu kỹ sư đủ năng lực IPv6-native"], maturityValue: "45%", maturityLabel: "Nhân lực IPv6" },
        { num: "02", title: "Hệ thống cũ vẫn phụ thuộc IPv4", bullets: ["Nhiều ứng dụng doanh nghiệp, hệ thống chính phủ và hạ tầng SME vẫn xây dựng quanh IPv4", "Tạo ra chi phí chuyển đổi, độ phức tạp vận hành và tâm lý trì hoãn nâng cấp"], maturityValue: "", maturityLabel: "" },
        { num: "03", title: "Bất đối xứng nhận thức", bullets: ["Doanh nghiệp lớn xem IPv6 là chiến lược dài hạn và khả năng mở rộng tương lai", "Nhiều SME vẫn xem IPv6 là chi phí kỹ thuật hơn là năng lực cạnh tranh — đây chủ yếu là khoảng cách nhận thức"], maturityValue: "40%", maturityLabel: "Nhận thức thị trường" },
        { num: "04", title: "Không đồng đều về địa lý", bullets: ["Triển khai IPv6 mạnh nhất ở các trung tâm đô thị lớn, data center và mạng backbone quốc gia", "Mạng địa phương, ISP nhỏ và khu vực nông thôn vẫn đang chuyển đổi chậm hơn"], maturityValue: "60%", maturityLabel: "Phạm vi triển khai" },
      ],
      solutionsLabel: "Định hướng giải pháp chiến lược",
      solutions: [
        { title: "Nhân lực & Giáo dục", bullets: ["Tích hợp IPv6 vào chương trình CNTT đại học", "Xây dựng phòng lab thực hành", "Ra mắt chương trình chứng chỉ quốc gia", "Kết nối đào tạo với nhu cầu thực từ ISP & cloud"] },
        { title: "Hỗ trợ doanh nghiệp", bullets: ["Bộ công cụ triển khai IPv6 cho SME", "Ưu đãi thuế hoặc tín dụng cloud", "Chương trình hỗ trợ từ ISP", "Hướng dẫn migration thực tế"] },
        { title: "Chính sách IPv6-First", bullets: ["Ưu tiên IPv6 trong dịch vụ công", "Tiêu chuẩn mua sắm IPv6-ready", "Dashboard giám sát quốc gia", "KPI triển khai minh bạch theo ngành"] },
        { title: "Nâng cao nhận thức công cộng", bullets: ["Chiến dịch truyền thông đại chúng", "Nội dung phổ thông hóa cho SME", "Tích hợp kiến thức Internet vào giáo dục số"] },
        { title: "Nghiên cứu & Đổi mới", bullets: ["Lab nghiên cứu IPv6 × AI × IoT", "Tập dữ liệu mở", "Hợp tác Đại học–Doanh nghiệp–Chính phủ"] },
      ],
      pullquote: "Chính sách di chuyển hệ thống. Giáo dục di chuyển thế hệ. Nghiên cứu di chuyển tương lai.",
    },
    s14: {
      eyebrow: "Lộ trình quốc gia đến 2030",
      headline1: "2030 không phải một 'hạn chót kỹ thuật'.",
      headline2: "Đó là chân trời chiến lược mà Việt Nam đang từng bước điều hướng tới.",
      intro: "Thay vì kế hoạch tuyến tính, lộ trình được tổ chức thành ba lớp hỗ trợ lẫn nhau — nhận thức & nhân lực, triển khai & hỗ trợ, và chủ quyền & dẫn dắt. Mỗi giai đoạn nêu rõ cơ quan chủ trì và các KPI gate cụ thể để quá trình chuyển đổi có thể được điều hành, đo lường và quy trách nhiệm.",
      prioritiesLabel: "Ưu tiên chiến lược",
      outcomesLabel: "Kết quả kỳ vọng",
      leadLabel: "Cơ quan chủ trì",
      kpiLabel: "KPI gate",
      phases: [
        {
          title: "Giai đoạn nền tảng",
          target: "Nhận thức · Giáo dục · Nhân lực",
          priorities: [
            "Tích hợp IPv6 vào chương trình đào tạo đại học và kỹ thuật (CS/IT/Networking)",
            "Chuẩn hóa nội dung đào tạo cho ISP, doanh nghiệp và đội SOC",
            "Ra mắt chương trình chứng chỉ quốc gia về kỹ sư IPv6-native",
            "Xây dựng nền tảng kiến thức và phòng lab IPv6 tiếng Việt",
            "Triển khai chiến dịch nhận thức phối hợp VNNIC, Bộ TT&TT, ISP lớn",
          ],
          outcomes: [
            "≥50% trường đại học kỹ thuật có chương trình IPv6-native",
            "10.000+ kỹ sư mạng được chứng nhận trên ISP, SOC, SME",
            "Nhận thức công cộng đạt ngưỡng đo được (qua khảo sát)",
          ],
          leadAgencies: ["VNNIC", "Bộ TT&TT", "Bộ GD&ĐT", "ISP lớn"],
          kpiGates: ["≥50% đại học có chương trình IPv6", "≥10.000 kỹ sư được chứng nhận", "≥70% lưu lượng IPv6 quốc gia"],
        },
        {
          title: "Giai đoạn mở rộng",
          target: "SME · Cloud · Hạ tầng địa phương",
          priorities: [
            "Chương trình hỗ trợ chuyển đổi IPv6 cho SME toàn quốc (toolkit + đồng tài trợ migration)",
            "Yêu cầu tất cả nền tảng cloud chính phủ phải triển khai IPv6-native",
            "Nâng cấp mạng tỉnh thành theo các đợt ưu tiên",
            "Mở rộng bộ thử nghiệm và khung kiểm tra phù hợp IPv6",
            "Đưa tiêu chí IPv6 vào chính sách mua sắm công và tiêu chuẩn dịch vụ số",
          ],
          outcomes: [
            "60%+ SME hoàn thành chuyển đổi IPv6 (dual-stack hoặc single-stack)",
            "Hạ tầng đám mây chính phủ đạt ≥80% IPv6",
            "Toàn bộ dịch vụ công mới triển khai IPv6-native mặc định",
          ],
          leadAgencies: ["Bộ TT&TT", "VNNIC", "Trung tâm An toàn không gian mạng quốc gia", "Sở TT&TT các tỉnh"],
          kpiGates: ["≥60% SME chuyển đổi", "≥80% cloud chính phủ IPv6", "100% dịch vụ công mới IPv6 mặc định"],
        },
        {
          title: "Việt Nam IPv6-First",
          target: "Toàn diện · Smart City · Hạ tầng thế hệ mới",
          priorities: [
            "Chuyển toàn bộ dịch vụ công sang IPv6-only ở những nơi khả thi",
            "Đồng bộ hệ sinh thái Smart City (Hà Nội, TP.HCM, Đà Nẵng) với hạ tầng IPv6",
            "Đạt tỷ lệ triển khai IPv6 90–99% toàn quốc",
            "Định vị Việt Nam là mô hình tham chiếu của Đông Nam Á về chuyển đổi IPv6",
            "Xuất khẩu khung chính sách và kiến thức vận hành sang các đối tác ASEAN",
          ],
          outcomes: [
            "90–99% triển khai IPv6 toàn quốc",
            "Vị thế dẫn dắt khu vực về chủ quyền số được thiết lập",
            "Mô hình tham chiếu được các quốc gia ASEAN áp dụng",
          ],
          leadAgencies: ["Bộ TT&TT", "VNNIC", "Ủy ban Quốc gia về Chuyển đổi số"],
          kpiGates: ["90–99% tỷ lệ traffic IPv6", "100% dịch vụ công IPv6-first", "≥3 đối tác ASEAN áp dụng framework"],
        },
      ],
      closingNote: "Ba giai đoạn này chồng lấp và củng cố nhau, cần nguồn lực song song. Giai đoạn 1 tạo nhân lực mà Giai đoạn 2 cần. Giai đoạn 2 xây hạ tầng mà Giai đoạn 3 dựa vào. Danh sách cơ quan chủ trì là để quy trách nhiệm — không phải danh sách chủ sở hữu duy nhất.",
      pullquote: "2030 không phải điểm kết thúc của quá trình chuyển đổi. Đó là thời điểm Internet thế hệ mới bắt đầu trở thành mặc định.",
    },
    s15: {
      eyebrow: "Vai trò của em",
      headline1: "Em không đến với IPv6 như một chủ đề ngắn hạn.",
      headline2: "Em xem nó là một phần của bức tranh lớn hơn về tương lai hạ tầng số.",
      intro: "Là sinh viên Công nghệ Thông tin, em quan tâm đến cách Internet được xây dựng, mở rộng và vận hành ở quy mô quốc gia —",
      intersectionLabel: "đặc biệt tại giao điểm giữa:",
      intersectionItems: ["hạ tầng mạng", "AI", "cloud", "Internet thế hệ tiếp theo"],
      motivationText: "Điều thu hút em không chỉ là công nghệ mới, mà là cách công nghệ trở thành nền tảng cho:",
      motivationItems: ["kinh tế số", "hệ thống thông minh", "năng lực cạnh tranh dài hạn của một quốc gia"],
      posLabel: "Định vị",
      name: "Nguyễn Thị Yến Nhi",
      school: "Trường Đại học Công Thương TP.HCM",
      city: "TP. Hồ Chí Minh",
      pathLabel: "Định hướng dài hạn",
      pathText: "Từ sinh viên hiểu giao thức → kỹ sư thiết kế hệ thống → chuyên gia tham gia định hình hạ tầng số quốc gia. Không phải người quan sát từ bên ngoài — mà là người trong cuộc.",
      capLabel: "Những lĩnh vực em đang tập trung phát triển",
      capabilities: [
        {
          title: "Nền tảng mạng & hệ thống",
          bullets: ["Internet vận hành như thế nào", "Hệ thống được thiết kế ra sao", "Hạ tầng có thể mở rộng ở quy mô lớn như thế nào"],
        },
        {
          title: "AI ứng dụng & dữ liệu",
          bullets: ["Giao điểm giữa AI, dữ liệu và cloud infrastructure", "Khả năng triển khai trong thế giới thực"],
        },
        {
          title: "Tư duy nghiên cứu từ nguồn sơ cấp",
          bullets: ["RFC và tài liệu kỹ thuật", "Báo cáo từ VNNIC và APNIC", "Nguồn hạ tầng Internet quốc tế — hiểu vấn đề từ góc nhìn nền tảng thay vì qua nội dung tóm tắt"],
        },
        {
          title: "Chiều sâu kỹ thuật → góc nhìn chiến lược",
          bullets: ["Không chỉ hiểu công nghệ hoạt động như thế nào", "Mà còn hiểu vì sao nó quan trọng và ảnh hưởng đến hệ sinh thái số ra sao", "Và Việt Nam có thể tận dụng nó như thế nào trong dài hạn"],
        },
      ],
      closingNote: "Em vẫn đang ở đầu hành trình học tập của mình. Nhưng em muốn đi theo con đường này một cách nghiêm túc và bền vững: học sâu, xây nền tảng chắc, và từng bước đóng góp vào hệ sinh thái công nghệ mà mình quan tâm.",
      pullquote: "Em không chỉ muốn sử dụng Internet thế hệ tiếp theo. Em muốn hiểu cách nó được xây dựng và góp phần tạo ra nó.",
    },
    s16: {
      eyebrow: "Lý do học bổng & Tầm nhìn tương lai",
      headline1: "Em không xem học bổng này như một chứng chỉ.",
      headline2: "Em xem đây là điểm khởi đầu để tham gia vào quá trình xây dựng hạ tầng Internet thế hệ tiếp theo của Việt Nam.",
      intro: "Giá trị cốt lõi của học bổng, theo em, nằm ở khả năng tiếp cận:",
      introBullets: [
        "Hệ tư duy hạ tầng ở cấp quốc gia",
        "Môi trường kỹ thuật chuyên sâu và thực tiễn",
        "Cộng đồng những người đang trực tiếp xây dựng IPv6 và Internet Việt Nam",
      ],
      reasonsLabel: "Vì sao học bổng này quan trọng với em",
      reasons: [
        {
          title: "Tiếp cận chiều sâu chuyên môn hạ tầng quốc gia",
          body: "Cơ hội học hỏi trực tiếp từ các chuyên gia tại VNNIC và các đơn vị đang triển khai IPv6 ở quy mô quốc gia — nơi kiến thức gắn liền với vận hành thực tế.",
        },
        {
          title: "Phát triển tư duy cấp hệ thống",
          body: "Từ nền tảng kỹ thuật, em hướng đến khả năng hiểu kiến trúc Internet được thiết kế như thế nào, chính sách hạ tầng được hình thành ra sao, và các quyết định kỹ thuật ảnh hưởng đến hệ thống quốc gia như thế nào.",
        },
        {
          title: "Môi trường phát triển dài hạn",
          body: "Tham gia một cộng đồng tập trung vào hạ tầng và khả năng mở rộng của Internet, thay vì chỉ các ứng dụng ngắn hạn.",
        },
        {
          title: "Nền tảng để đóng góp thực chất",
          body: "Học bổng giúp em phát triển năng lực về IPv6 và hạ tầng mạng thế hệ mới, AI infrastructure và hệ thống phân tán, và Internet thế hệ tiếp theo tại Việt Nam.",
        },
      ],
      visionsLabel: "Định hướng phát triển",
      horizons: [
        {
          title: "Kỹ thuật & nghiên cứu",
          yearLabel: "+5 năm",
          body: "Phát triển chuyên sâu về hệ thống mạng và IPv6-native infrastructure. Làm việc tại giao điểm giữa networking, cloud và AI systems. Tham gia các dự án thực tế trong hệ sinh thái số.",
        },
        {
          title: "Chính sách & hạ tầng",
          yearLabel: "+10 năm",
          body: "Làm việc trong mô hình hợp tác công–tư về hạ tầng số. Tham gia xây dựng chiến lược Internet thế hệ tiếp theo ở cấp khu vực. Đóng góp vào quá trình chuyển đổi số ở cấp khu vực.",
        },
        {
          title: "Tầm nhìn dài hạn",
          yearLabel: "Tầm nhìn dài",
          body: "Trở thành người tham gia xây dựng thế hệ tiếp theo của Internet Việt Nam: an toàn hơn về kiến trúc, mở rộng hơn về quy mô, sẵn sàng cho AI, IoT và IPv6-native infrastructure.",
        },
      ],
      closingNote: "Học bổng này không phải là đích đến. Đây là một bước chuyển vào đúng hệ sinh thái mà em cam kết theo đuổi lâu dài.",
      pullquote: "Em không tìm kiếm sự công nhận. Em tìm kiếm năng lực để tạo ra giá trị thực chất trong hệ thống mà em đang học và sẽ tham gia xây dựng.",
    },
    s18: {
      eyebrow: "Tuyên bố kết thúc",
      headline1: "Internet thế hệ tiếp theo của Việt Nam sẽ không được thừa kế từ quá khứ.",
      headlineBuilt: "Nó sẽ được kiến tạo.",
      layerIntro: "Không phải bằng một bước nhảy duy nhất,",
      layerSubtitle: "mà bằng sự tích lũy có chủ đích qua từng tầng:",
      layers: [
        "từng giao thức được thiết kế lại",
        "từng chính sách được hiệu chỉnh",
        "từng hệ thống được tái cấu trúc",
        "và từng con người góp phần định hình hướng đi",
      ],
      closing1: "Trong bức tranh đó, em không đứng bên ngoài quan sát.",
      closing2: "Em chọn trở thành một phần của quá trình kiến tạo.",
      pullquote: "Internet tiếp theo của Việt Nam không tự nhiên hình thành — nó được xây dựng bởi những người dám tham gia vào việc định hình nó.",
    },
    s19: {
      eyebrow: "Tài liệu tham khảo & Cơ sở nghiên cứu",
      headline1: "Những luận điểm mạnh mẽ đòi hỏi",
      headline2: "nguồn tham chiếu vững chắc.",
      methodLabel: "Cơ sở phương pháp",
      methodTitle: "Phân tích hạ tầng dựa trên bằng chứng",
      methodSourcesLabel: "Kết hợp từ 4 nhóm nguồn:",
      methodSources: [
        "Chính sách & văn bản pháp lý quốc gia",
        "Tiêu chuẩn kỹ thuật (IETF / RFC)",
        "Dữ liệu đo lường Internet toàn cầu",
        "Báo cáo ngành & tổ chức quốc tế uy tín",
      ],
      methodNote: "Phân tích và trực quan hóa là tổng hợp và diễn giải — không thay thế nguồn dữ liệu gốc.",
      groups: [
        {
          title: "🇻🇳 Chính sách & văn bản pháp lý quốc gia",
          items: [
            { name: "VNNIC — Trung tâm Internet Việt Nam", url: "https://vnnic.vn", desc: "Cơ quan quản lý tài nguyên Internet quốc gia, chủ trì triển khai IPv6" },
            { name: "Chương trình IPv6 For Gov 2021–2025", url: "https://vnnic.vn/ipv6forgov", desc: "Chương trình triển khai IPv6 cho cơ quan nhà nước do VNNIC chủ trì" },
            { name: "Quyết định 749/QĐ-TTg — Chuyển đổi số Quốc gia", url: "https://vanban.chinhphu.vn/?pageid=27160&docid=200163", desc: "Chương trình CĐS quốc gia đến 2025, định hướng 2030 — neo pháp lý chiến lược" },
            { name: "Quyết định 411/QĐ-TTg — Kinh tế số & Xã hội số", url: "https://vanban.chinhphu.vn/?pageid=27160&docid=205555", desc: "Chiến lược phát triển Kinh tế số & Xã hội số đến 2025, định hướng 2030" },
            { name: "APNIC Labs — Thống kê IPv6 Việt Nam", url: "https://stats.labs.apnic.net/ipv6/VN", desc: "Đo lường tỷ lệ triển khai IPv6 riêng cho Việt Nam, cập nhật liên tục từ APNIC" },
          ],
        },
        {
          title: "🌐 Đo lường & thống kê IPv6 toàn cầu",
          items: [
            { name: "APNIC Labs — IPv6 Measurement System", url: "https://stats.labs.apnic.net/ipv6", desc: "Đo lường tỷ lệ triển khai IPv6 theo từng quốc gia, cập nhật liên tục" },
            { name: "Google IPv6 Statistics", url: "https://www.google.com/intl/en/ipv6/statistics.html", desc: "Tỷ lệ người dùng IPv6 quan sát qua hạ tầng toàn cầu của Google" },
            { name: "Internet Society — Deploy360 IPv6", url: "https://www.internetsociety.org/deploy360/ipv6/", desc: "Hướng dẫn triển khai và dữ liệu IPv6 toàn cầu từ tổ chức phi lợi nhuận ISOC" },
            { name: "Cloudflare Radar — Adoption & Usage", url: "https://radar.cloudflare.com/adoption-and-usage", desc: "Xu hướng lưu lượng IPv6 thực tế từ hệ thống mạng Cloudflare toàn cầu" },
          ],
        },
        {
          title: "📘 Tiêu chuẩn kỹ thuật (IETF / RFC)",
          roleNote: "Đây là các văn bản định nghĩa trực tiếp kiến trúc giao thức IPv6.",
          items: [
            { name: "RFC 8200 — Internet Protocol, Version 6 Specification", url: "https://datatracker.ietf.org/doc/html/rfc8200", desc: "Tiêu chuẩn IPv6 chính thức hiện hành, thay thế RFC 2460 (ban hành 2017)" },
            { name: "RFC 4291 — IP Version 6 Addressing Architecture", url: "https://datatracker.ietf.org/doc/html/rfc4291", desc: "Định nghĩa kiến trúc địa chỉ IPv6 — unicast, multicast, anycast" },
            { name: "RFC 4862 — IPv6 Stateless Address Autoconfiguration", url: "https://datatracker.ietf.org/doc/html/rfc4862", desc: "Cơ chế SLAAC — thiết bị tự gán địa chỉ có thể định tuyến toàn cầu mà không cần DHCP" },
            { name: "RFC 791 — Internet Protocol (IPv4)", url: "https://datatracker.ietf.org/doc/html/rfc791", desc: "Đặc tả IPv4 gốc (1981) — tham chiếu để hiểu rõ giới hạn cấu trúc của IPv4" },
          ],
        },
        {
          title: "📊 Báo cáo ngành & tổ chức quốc tế",
          items: [
            { name: "ITU-R Report M.2410-0 — Yêu cầu tối thiểu IMT-2020 (5G)", url: "https://www.itu.int/pub/R-REP-M.2410-2017", desc: "Báo cáo kỹ thuật ITU định nghĩa yêu cầu 5G — nguồn số liệu mMTC & URLLC" },
            { name: "IoT Analytics — Số lượng thiết bị IoT kết nối toàn cầu", url: "https://iot-analytics.com/number-connected-iot-devices/", desc: "Theo dõi số lượng thiết bị IoT toàn cầu — 21,1 tỷ năm 2025, xu hướng đến 2030" },
            { name: "Ericsson Mobility Report — Dự báo kết nối IoT", url: "https://www.ericsson.com/en/reports-and-papers/mobility-report", desc: "Báo cáo dự báo kết nối toàn cầu của Ericsson — miễn phí, cập nhật định kỳ" },
            { name: "Meta AI — Llama 3 Technical Blog", url: "https://ai.meta.com/blog/meta-llama-3/", desc: "Minh họa quy mô training AI phân tán ở hyperscale — cụm 25.000+ GPU node" },
          ],
        },
      ],
      academicLabel: "Ghi chú về phương pháp",
      academicNotes: [
        "Toàn bộ dữ liệu lấy từ nguồn công khai, có thể kiểm chứng độc lập",
        "Phân tích mang tính tổng hợp hệ thống — không phải bình luận đơn lẻ",
        "Không sử dụng dữ liệu độc quyền hoặc nguồn chưa được xác thực",
        "Mục tiêu: phản ánh bức tranh hạ tầng thực chất, không chỉ mô tả kỹ thuật",
      ],
    },
    s20: {
      badge: "20 / 20",
      title: "Em xin chân thành cảm ơn",
      nameLabel: "Nguyễn Thị Yến Nhi",
      byline: "Ứng viên · Học bổng VNNIC Internet School for Youth 2026",
      intro: "Em xin chân thành cảm ơn Ban tổ chức, các anh chị giám khảo và tất cả mọi người đã dành thời gian quan tâm phần chia sẻ của em. Được đứng tại đây để nói về điều mình thật sự quan tâm và theo đuổi là một cơ hội mà em vô cùng trân trọng.",
      contactLabel: "Thông tin liên hệ",
      contactLabels: ["Email", "Portfolio"],
      portfolioInvite: "Nếu anh chị muốn tìm hiểu thêm về hành trình học tập, các dự án và những định hướng em đang theo đuổi, em rất vui khi được kết nối qua portfolio của mình.",
      footerTitle: "Lời kết",
      footerBody: "Có những lĩnh vực không chỉ cần kiến thức hay kỹ năng, mà còn cần một niềm tin đủ lớn để kiên trì theo đuổi trong thời gian dài. Với em, Internet và hạ tầng số là một trong những lĩnh vực như vậy. Mỗi điều em học, mỗi dự án em thực hiện — dù nhỏ — đều là những bước đi nghiêm túc trên hành trình mà em thật sự muốn theo đuổi. Em tin rằng sự phát triển của Internet không chỉ đến từ công nghệ, mà còn đến từ những người sẵn sàng học hỏi, xây dựng và đóng góp lâu dài cho cộng đồng. Cảm ơn vì đã cho em cơ hội được chia sẻ điều đó hôm nay.",
      pullquote: "Thế hệ xây dựng Internet tiếp theo của Việt Nam không cần chờ được trao cơ hội. Họ bắt đầu từ sự chủ động — và tiếp tục bằng sự bền bỉ.",
    },
    s_ecosystem_hub: {
      eyebrow: "IPv6 là tầng nền tảng",
      headline1: "IPv6 không phục vụ một hệ thống.",
      headline2: "Nó kích hoạt mọi hệ thống cùng lúc.",
      nodes: [
        { label: "Trung tâm\ndữ liệu AI",    sub: "SRv6 · cụm GPU · edge AI" },
        { label: "Mạng\nIoT",               sub: "6LoWPAN · 41 tỷ thiết bị 2030" },
        { label: "Kiến trúc\n5G",            sub: "mMTC · URLLC · eMBB" },
        { label: "Thành phố\nthông minh",    sub: "Hà Nội · TP.HCM · Đà Nẵng" },
        { label: "Chính phủ\nsố",            sub: "IPv6 For Gov 2021–2025" },
        { label: "An ninh\nmạng",            sub: "IPSec · CGA · Zero-Trust" },
      ],
      pullquote: "IPv6 không phải tính năng của một công nghệ. Đó là lớp nền kiến trúc giúp mọi công nghệ thế hệ mới có thể vận hành ở quy mô lớn.",
    },
    s_adoption_chart: {
      eyebrow: "Lộ trình triển khai IPv6 của Việt Nam",
      headline1: "Từ 22% năm 2019 lên 64% năm 2024.",
      headline2: "Tăng trưởng nhất quán, dẫn dắt bởi chính sách.",
      vnLabel: "Việt Nam",
      globalLabel: "Trung bình toàn cầu",
      targetLabel: "Mục tiêu 90% · 2030",
      targetShortLabel: "Mục tiêu 2030",
      sourceNote: "Dữ liệu: Báo cáo IPv6 thường niên VNNIC 2024 · Hệ thống đo lường APNIC Labs. Số liệu 2019–2023 là ước tính gần đúng; Q4/2024 (~64%) từ đo lường chính thức của VNNIC. Trung bình toàn cầu từ APNIC Labs.",
      stats: [
        { value: "+42 pts", label: "Tăng trưởng 2019 → 2024",   sub: "so với +18 pts trung bình toàn cầu" },
        { value: "Top 10",  label: "Xếp hạng IPv6 toàn cầu",    sub: "Q4/2024 · APNIC Labs" },
        { value: "+26 pts", label: "Để đạt mục tiêu 90%",        sub: "đến năm 2030 · còn 6 năm" },
      ],
      pullquote: "Hành trình đến 90% không phải vấn đề kỹ thuật. Đó là thách thức triển khai, nhân lực và chính sách — đúng trọng tâm mà lộ trình 2026–2030 giải quyết.",
    },
    s_asean_chart: {
      eyebrow: "Bối cảnh khu vực — Triển khai IPv6 ASEAN",
      headline1: "Việt Nam dẫn đầu ASEAN về triển khai IPv6.",
      headline2: "Câu hỏi là điều gì xảy ra tiếp theo.",
      sourceNote: "Số liệu ước tính từ APNIC Labs · Q4/2024. Làm tròn đến phần trăm gần nhất. Thứ hạng quốc gia có thể thay đổi theo phương pháp đo lường và kỳ báo cáo.",
      highlightLabel: "Vị thế khu vực của Việt Nam",
      highlightBody: "Với ~64%, Việt Nam dẫn đầu khu vực ASEAN — vị thế được xây dựng qua chính sách quốc gia bền vững (IPv6 For Gov) và các chương trình phối hợp với ISP từ năm 2021.",
      regionLabel: "Cơ hội khu vực",
      regionBody: "Tỷ lệ trung bình ASEAN ước tính ~35–40%. Vị thế dẫn đầu của Việt Nam tạo cơ hội trở thành mô hình tham chiếu chính sách khu vực — xuất khẩu framework, không chỉ áp dụng.",
      pullquote: "Dẫn đầu về chỉ số triển khai chỉ có ý nghĩa khi vị thế đó được chuyển hóa thành năng lực kiến trúc thực chất — không chỉ là con số thống kê lưu lượng mạng.",
    },
  },
};
