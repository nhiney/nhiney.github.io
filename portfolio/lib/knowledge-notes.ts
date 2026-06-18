export interface KnowledgeNote {
  id: string
  title: string
  source: string
  sourceType: 'book' | 'code' | 'life' | 'design'
  excerpt: string
  reflection?: string
  tags: string[]
  nodeIndex: number
}

export const KNOWLEDGE_NOTES: KnowledgeNote[] = [
  {
    id: 'atomic-habits-systems',
    title: 'Systems Beat Goals',
    source: 'Atomic Habits',
    sourceType: 'book',
    excerpt:
      'You do not rise to the level of your goals, you fall to the level of your systems. Goals are about the results you want to achieve; systems are about the processes that lead to those results.',
    reflection: 'Focus on daily systems rather than end results — small habits, big changes.',
    tags: ['habits', 'productivity', 'systems thinking'],
    nodeIndex: 0,
  },
  {
    id: 'deep-work-focus',
    title: 'Deep Work Is Rare & Valuable',
    source: 'Deep Work',
    sourceType: 'book',
    excerpt:
      'The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable. The few who cultivate this skill will thrive.',
    reflection: 'One fully focused coding session beats three hours of half-working, half-scrolling.',
    tags: ['focus', 'deep work', 'deliberate practice'],
    nodeIndex: 1,
  },
  {
    id: 'pragmatic-broken-windows',
    title: "Don't Live With Broken Windows",
    source: 'The Pragmatic Programmer',
    sourceType: 'book',
    excerpt:
      'Don\'t leave "broken windows" (bad designs, wrong decisions, or poor code) unrepaired. Fix each one as soon as it is discovered. Neglect accelerates software rot faster than any other factor.',
    reflection: 'A TODO comment that lives too long becomes permanent — fix it now or document it clearly.',
    tags: ['clean code', 'engineering discipline', 'refactoring'],
    nodeIndex: 2,
  },
  {
    id: 'code-naming-clarity',
    title: 'Name Things Clearly',
    source: 'Coding',
    sourceType: 'code',
    excerpt:
      'Code is read far more often than it is written. A well-named variable, function, or class is worth a paragraph of comments. Clarity is kindness to your future self and your teammates.',
    reflection: 'Renaming one vague variable to a clear name is the most valuable refactor I have ever done.',
    tags: ['clean code', 'readability', 'naming'],
    nodeIndex: 3,
  },
  {
    id: 'life-embrace-beginner',
    title: 'Embrace Being a Beginner',
    source: 'Life',
    sourceType: 'life',
    excerpt:
      'Curiosity is more durable than expertise. Experts stop asking "why"; beginners ask it constantly. The willingness to not know — and to keep exploring — is the real competitive edge.',
    reflection: 'Every time I start learning something new, I remember the feeling of writing my first Hello World.',
    tags: ['growth mindset', 'curiosity', 'learning'],
    nodeIndex: 4,
  },
  {
    id: 'thinking-fast-slow',
    title: 'System 1 vs System 2 Thinking',
    source: 'Thinking, Fast and Slow',
    sourceType: 'book',
    excerpt:
      'System 1 operates automatically, quickly, with little or no effort. System 2 allocates attention to deliberate mental activities. Most of our errors come from trusting System 1 where System 2 is needed.',
    reflection: 'When debugging, System 2 is the one that actually solves the problem — System 1 just guesses.',
    tags: ['cognition', 'decision making', 'mental models'],
    nodeIndex: 5,
  },
  {
    id: 'life-document-journey',
    title: 'Document Your Learning Journey',
    source: 'Life',
    sourceType: 'life',
    excerpt:
      'The process of learning matters as much as the outcome. Writing down what you struggled with, what clicked, and what you would do differently transforms experience into compounding wisdom.',
    reflection: 'This knowledge garden is the proof — I write things down so I never forget.',
    tags: ['reflection', 'journaling', 'growth'],
    nodeIndex: 6,
  },
  {
    id: 'clean-architecture-boundaries',
    title: 'Draw Boundaries, Defer Decisions',
    source: 'Clean Architecture',
    sourceType: 'code',
    excerpt:
      'A good architect maximizes the number of decisions not made. Keep details — frameworks, databases, the web — at the edges, behind boundaries, so the core business rules stay independent and testable.',
    reflection: 'Separating business logic from the framework let me swap the DB from Oracle to Postgres without touching the core.',
    tags: ['architecture', 'design', 'decoupling'],
    nodeIndex: 7,
  },
  {
    id: 'refactoring-small-steps',
    title: 'Refactor in Tiny Safe Steps',
    source: 'Refactoring',
    sourceType: 'code',
    excerpt:
      'Refactoring is a series of small behavior-preserving transformations. Each step is tiny, so if something breaks you know exactly where. The discipline is what makes large changes safe.',
    reflection: 'Small commits + green tests after every step = never fearing a refactor that "breaks the whole week".',
    tags: ['refactoring', 'testing', 'discipline'],
    nodeIndex: 8,
  },
  {
    id: 'mom-test-questions',
    title: 'Ask About the Past, Not the Future',
    source: 'The Mom Test',
    sourceType: 'book',
    excerpt:
      'People lie to be nice when you ask about hypotheticals. Ask about specifics in their past instead: what they did, what it cost them, what they tried. Facts beat opinions when validating an idea.',
    reflection: 'In user interviews, "when did you last run into this problem?" beats every hypothetical question.',
    tags: ['product', 'user research', 'validation'],
    nodeIndex: 9,
  },
  {
    id: 'design-hierarchy',
    title: 'Visual Hierarchy Guides the Eye',
    source: 'Refactoring UI',
    sourceType: 'design',
    excerpt:
      'Not everything on the screen is equally important. Use size, weight, and color to establish a hierarchy so the user knows what to look at first, second, and third — de-emphasize to emphasize.',
    reflection: 'Dimming the secondary text usually works better than making the primary text bolder.',
    tags: ['ui design', 'hierarchy', 'typography'],
    nodeIndex: 10,
  },
  {
    id: 'design-whitespace',
    title: 'Whitespace Is Not Wasted Space',
    source: 'Design',
    sourceType: 'design',
    excerpt:
      'Generous spacing makes interfaces feel calm, premium, and easy to scan. Crowding elements together to "fit more" usually makes everything harder to use, not easier.',
    reflection: 'Whenever a layout feels cramped, I add padding before thinking about adding anything else.',
    tags: ['ui design', 'spacing', 'clarity'],
    nodeIndex: 11,
  },
  {
    id: 'show-your-work',
    title: 'Share Process, Not Just Results',
    source: 'Show Your Work!',
    sourceType: 'book',
    excerpt:
      'You don\'t have to be a genius to share what you learn. Document the small steps publicly; the trail of breadcrumbs is what helps others — and your future self — and builds your reputation over time.',
    reflection: 'Blogging about one tiny bug helped a stranger from Google — and helped me remember the fix.',
    tags: ['sharing', 'creativity', 'building in public'],
    nodeIndex: 12,
  },
  {
    id: 'code-test-first',
    title: 'Let Tests Drive the Design',
    source: 'Coding',
    sourceType: 'code',
    excerpt:
      'When code is hard to test, that is a design smell, not a testing problem. Writing the test first forces small, decoupled units with clear inputs and outputs.',
    reflection: 'If a function is hard to test, it is almost certainly doing too much.',
    tags: ['testing', 'tdd', 'design'],
    nodeIndex: 13,
  },
  {
    id: 'life-rest-is-work',
    title: 'Rest Is Part of the Work',
    source: 'Life',
    sourceType: 'life',
    excerpt:
      'Sustainable output comes from rhythm, not constant grind. Sleep, walks, and stepping away are where the subconscious solves the problems the conscious mind got stuck on.',
    reflection: 'The fix for the hardest bug usually arrives in the shower, not while staring at the screen.',
    tags: ['rest', 'sustainability', 'wellbeing'],
    nodeIndex: 14,
  },
  {
    id: 'make-time-highlight',
    title: 'Choose One Daily Highlight',
    source: 'Make Time',
    sourceType: 'book',
    excerpt:
      'Instead of a packed to-do list, pick a single highlight — the one thing you want to make time for today. It gives the day a focus and a sense of accomplishment that busyness never does.',
    reflection: 'One clear highlight each morning keeps me from ending the day feeling busy yet empty.',
    tags: ['focus', 'time management', 'intention'],
    nodeIndex: 15,
  },
  {
    id: 'security-least-privilege',
    title: 'Default to Least Privilege',
    source: 'Security',
    sourceType: 'code',
    excerpt:
      'Every component should run with the minimum permissions it needs and nothing more. Most breaches escalate through over-granted access that nobody ever revisited.',
    reflection: 'A service account made "admin for convenience" today is tomorrow\'s vulnerability.',
    tags: ['security', 'access control', 'defense in depth'],
    nodeIndex: 16,
  },
  {
    id: 'design-consistency',
    title: 'Consistency Lowers Cognitive Load',
    source: 'Design',
    sourceType: 'design',
    excerpt:
      'Reusing the same patterns, spacing, and components means users learn your interface once. Every inconsistency is a tiny new thing the brain has to decode.',
    reflection: 'A small but consistent design system is worth more than many beautiful one-off screens.',
    tags: ['design system', 'consistency', 'ux'],
    nodeIndex: 17,
  },
  {
    id: 'life-compound-interest',
    title: 'Small Things Compound',
    source: 'Life',
    sourceType: 'life',
    excerpt:
      'A 1% improvement every day is barely noticeable in a week, but it is nearly 38x over a year. The same compounding applies to learning, relationships, and reputation — quietly, then suddenly.',
    reflection: 'Studying 30 minutes a day for a year took me further than any end-of-term cramming sprint.',
    tags: ['compounding', 'consistency', 'growth'],
    nodeIndex: 18,
  },
  {
    id: 'pragmatic-dry',
    title: 'Every Knowledge, One Place',
    source: 'The Pragmatic Programmer',
    sourceType: 'book',
    excerpt:
      'DRY: every piece of knowledge must have a single, unambiguous, authoritative representation within a system. Duplication is not just typing twice — it is two things that must change together and won\'t.',
    reflection: 'The most annoying bugs come from the same rule copied in two places that quietly drift apart.',
    tags: ['dry', 'maintainability', 'clean code'],
    nodeIndex: 19,
  },
]
