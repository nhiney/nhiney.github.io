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
    reflection: 'Tập trung vào hệ thống hằng ngày hơn là kết quả cuối cùng — thói quen nhỏ, thay đổi lớn.',
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
    reflection: 'Mỗi phiên code tập trung hoàn toàn hiệu quả hơn ba giờ vừa làm vừa lướt điện thoại.',
    tags: ['focus', 'deep work', 'deliberate practice'],
    nodeIndex: 1,
  },
  {
    id: 'pragmatic-broken-windows',
    title: 'Don\'t Live With Broken Windows',
    source: 'The Pragmatic Programmer',
    sourceType: 'book',
    excerpt:
      'Don\'t leave "broken windows" (bad designs, wrong decisions, or poor code) unrepaired. Fix each one as soon as it is discovered. Neglect accelerates software rot faster than any other factor.',
    reflection: 'Một TODO comment tồn tại quá lâu trở thành vĩnh cửu — fix ngay hoặc document rõ ràng.',
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
    reflection: 'Đổi tên một biến mơ hồ thành tên rõ ràng là refactor có giá trị nhất mình từng làm.',
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
    reflection: 'Mỗi lần bắt đầu học điều mới, mình nhớ lại cảm giác lần đầu viết Hello World.',
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
    reflection: 'Khi debug, System 2 mới là người giải quyết vấn đề — System 1 chỉ đoán mò.',
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
    reflection: 'Khu vườn kiến thức này chính là minh chứng — ghi lại để không quên.',
    tags: ['reflection', 'journaling', 'growth'],
    nodeIndex: 6,
  },
]
