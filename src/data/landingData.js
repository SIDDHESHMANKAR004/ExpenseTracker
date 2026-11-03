// Central copy/content store for the landing page.
// Edit text here — components just render this data.

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Expense Manager', href: '#expense-manager' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Profile', href: '#profile' },
];

export const HERO_STATS = [
  { figure: '12+', label: 'App pages' },
  { figure: '6', label: 'Category budgets' },
  { figure: '100%', label: 'Free to try' },
];

// One entry per real app page — this is the spine of the whole page.
// `id` must match the corresponding NAV_LINKS href (minus '#').
export const FEATURE_SECTIONS = [
  {
    id: 'dashboard',
    eyebrow: 'Page 01 — Dashboard',
    title: 'Financial Dashboard',
    lede: 'The first thing you see after signing in: a single, honest snapshot of where your money stands right now.',
    points: [
      'Current balance, always up to date',
      'Income summary for the period',
      'Expense summary for the period',
      'Budget alerts when a category runs hot',
      'Recent transactions, most recent first',
    ],
    reversed: false,
    imageRequired: {
      src: '/images/landing/dashboard.png',
      title: 'Dashboard screenshot',
      detail: 'Desktop screenshot of the Dashboard page showing the Income card, Expense card, Balance card, active Budget Alerts, and the Recent Transactions list.',
    },
  },
  {
    id: 'expense-manager',
    eyebrow: 'Page 02 — Expense Manager',
    title: 'Expense Manager',
    lede: 'Every transaction starts here. Log what you spent, update what you earned, and organize both into categories that make sense to you.',
    points: [
      'Add an expense in a few fields',
      'Update your income sources',
      'Create custom categories',
      'Delete categories you no longer use',
      'Set a budget limit per category',
    ],
    reversed: true,
    imageRequired: {
      src: '/images/landing/expense-manager.png',
      title: 'Expense Manager screenshot',
      detail: 'Screenshot of the Add Expense form together with the category cards grid (each card showing category name, icon, and current budget limit).',
    },
  },
  {
    id: 'analytics',
    eyebrow: 'Page 03 — Analytics',
    title: 'Visual Analytics',
    lede: 'Numbers on a dashboard tell you what happened. Charts tell you why. Analytics turns your MoneyVerge into patterns you can act on.',
    points: [
      'Interactive doughnut chart of spending',
      'Category-by-category breakdown',
      'Remaining income analysis',
      'Full expense distribution view',
      'Click any chart to zoom in',
    ],
    reversed: false,
    imageRequired: {
      src: '/images/landing/analytics.png',
      title: 'Analytics screenshot',
      detail: 'Screenshot of the Analytics page centered on the interactive doughnut chart, with the category breakdown legend and remaining-income panel visible alongside it.',
    },
  },
  {
    id: 'reports',
    eyebrow: 'Page 04 — Reports',
    title: 'Reports & Insights',
    lede: 'A chronological, exportable record of every rupee in and out — the closest thing to a real bank statement your budget will ever need.',
    points: [
      'Full transaction history',
      'Income summary by period',
      'Expense summary by period',
      'Notes attached to transactions',
      'Strict chronological ordering',
    ],
    reversed: true,
    imageRequired: {
      src: '/images/landing/reports.png',
      title: 'Reports screenshot',
      detail: 'Screenshot of the Reports page showing the chronological transaction table with date, category, note, and amount columns, plus the income/expense summary header.',
    },
  },
  {
    id: 'profile',
    eyebrow: 'Page 05 — Profile & Settings',
    title: 'Profile & Personalization',
    lede: 'Make the app yours: your name, your currency, your budgets — configured once and respected everywhere else in the app.',
    points: [
      'Edit your profile details',
      'Set your preferred currency',
      'Manage category budgets',
      'Share the app with a friend',
      'View other projects by the same builder',
    ],
    reversed: false,
    imageRequired: {
      src: '/images/landing/profile.png',
      title: 'Profile screenshot',
      detail: 'Screenshot of the Profile page showing Edit Profile fields, the Currency Settings selector, Category Budgets list, Share App action, and Other Projects section.',
    },
  },
];

export const BUDGET_HIGHLIGHTS = [
  'Real-time budget warnings the moment a category gets close to its limit',
  'Per-category budgets you set once in Expense Manager',
  'Monthly tracking so limits reset on your schedule',
  'Remaining balance calculated after every transaction',
];

export const RESPONSIVE_SCREENSHOTS = [
  {
    title: 'Desktop experience',
    detail: 'Full-width desktop screenshot of the Dashboard at 1440px.',
    src: '/images/landing/dashboard-desktop.png',
    minHeight: 260,
  },
  {
    title: 'Tablet experience',
    detail: 'Tablet screenshot of the Expense Manager at around 768px.',
    src: '/images/landing/expense-manager-tablet.png',
    minHeight: 260,
  },
  {
    title: 'Mobile experience',
    detail: 'Mobile screenshot of the Dashboard at around 375px.',
    src: '/images/landing/dashboard-mobile.png',
    minHeight: 260,
  },
];

export const TIMELINE_STEPS = [
  { title: 'Create account', desc: 'Sign up in seconds, no setup wizard.' },
  { title: 'Set up income', desc: 'Tell the app what you earn and when.' },
  { title: 'Add expenses', desc: 'Log spending as it happens.' },
  { title: 'Track budget', desc: 'Get warned before you overspend.' },
  { title: 'View reports', desc: 'See the full chronological picture.' },
  { title: 'Improve savings', desc: 'Adjust categories, spend less.' },
];

export const TECH_STACK = [
  { name: 'React.js' },
  { name: 'Bootstrap' },
  { name: 'Firebase' },
  { name: 'Firestore' },
  { name: 'React Router' },
  { name: 'Chart.js' },
  { name: 'JavaScript' },
  { name: 'Responsive Design' },
];

export const TESTIMONIALS = [
  {
    quote: 'I finally stopped guessing where my paycheck went. The category budgets alone paid for the two minutes it took to set up.',
    name: 'Aisha R.',
    role: 'Early user',
  },
  {
    quote: 'The doughnut chart made it obvious food delivery was eating 30% of my budget. Cut it in half within a month.',
    name: 'Daniel K.',
    role: 'Early user',
  },
  {
    quote: 'Reports page is basically my bank statement, but readable. I use it every time I do my monthly review.',
    name: 'Priya M.',
    role: 'Early user',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'Is the app free to use?',
    a: 'Yes. Every page — Dashboard, Expense Manager, Analytics, Reports, and Profile — is available at no cost.',
  },
  {
    q: 'Which currencies are supported?',
    a: 'You can set your preferred currency from Profile → Currency Settings, and every figure across the app updates to match.',
  },
  {
    q: 'How do budget alerts work?',
    a: 'Set a limit for any category in Expense Manager. When spending in that category approaches the limit, the Dashboard shows a budget alert.',
  },
  {
    q: 'Can I export my transaction history?',
    a: 'The Reports page gives you a full chronological transaction history with notes, ready to review or copy out whenever you need it.',
  },
  {
    q: 'Is my financial data secure?',
    a: 'Data is stored in Firebase Firestore behind your authenticated account, so only you can access your MoneyVerge.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes — every page is built responsively and works the same way on desktop, tablet, and mobile.',
  },
];

export const FOOTER_LINKS = {
  product: [
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Expense Manager', href: '#expense-manager' },
    { label: 'Analytics', href: '#analytics' },
    { label: 'Profile', href: '#profile' },
  ],
  company: [
    { label: 'About', href: '#about' },
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};
