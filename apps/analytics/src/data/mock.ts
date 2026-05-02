export type ReportKind = 'dashboard' | 'funnel' | 'cohort' | 'export';
export type ReportStatus = 'live' | 'draft' | 'archived';

export interface Report {
  id: string;
  name: string;
  kind: ReportKind;
  owner: string;
  status: ReportStatus;
  views: number;
  updatedAt: string;
}

export interface Source {
  id: string;
  name: string;
  share: number;
  delta: number;
}

export interface PageStat {
  path: string;
  views: number;
  delta: number;
}

export interface FunnelStep {
  label: string;
  count: number;
}

export interface Funnel {
  id: string;
  name: string;
  description: string;
  steps: FunnelStep[];
}

export interface Audience {
  id: string;
  name: string;
  description: string;
  size: number;
  delta: number;
  source: string;
  updatedAt: string;
}

const TODAY_MS = new Date('2026-05-01T00:00:00Z').getTime();

export const trafficSeries: { date: string; visitors: number }[] = (() => {
  const out: { date: string; visitors: number }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(TODAY_MS - i * 86400000);
    const iso = d.toISOString().slice(0, 10);
    const base = 4200 + Math.sin(i / 5) * 380 + Math.cos(i / 11) * 220;
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6 ? -540 : 0;
    const trend = (89 - i) * 9;
    const noise = ((i * 1103515245 + 12345) % 1000) / 1000 - 0.5;
    out.push({
      date: iso,
      visitors: Math.max(0, Math.round(base + weekend + trend + noise * 280)),
    });
  }
  return out;
})();

export const sessionSeries = trafficSeries.map((d, i) => ({
  date: d.date,
  sessions: Math.round(d.visitors * (1.4 + Math.sin(i / 7) * 0.08)),
}));

export const conversionSeries = trafficSeries.map((d, i) => ({
  date: d.date,
  rate: 2.3 + Math.sin(i / 9) * 0.5 + (i / trafficSeries.length) * 0.7,
}));

export const reports: Report[] = [
  {
    id: 'r-overview',
    name: 'Executive overview',
    kind: 'dashboard',
    owner: 'Ada Lovelace',
    status: 'live',
    views: 1284,
    updatedAt: '2026-04-30T17:12:00Z',
  },
  {
    id: 'r-acquisition',
    name: 'Acquisition by source',
    kind: 'dashboard',
    owner: 'Grace Hopper',
    status: 'live',
    views: 942,
    updatedAt: '2026-04-30T11:48:00Z',
  },
  {
    id: 'r-signup-funnel',
    name: 'Signup funnel',
    kind: 'funnel',
    owner: 'Alan Turing',
    status: 'live',
    views: 718,
    updatedAt: '2026-04-29T22:06:00Z',
  },
  {
    id: 'r-checkout-funnel',
    name: 'Checkout funnel',
    kind: 'funnel',
    owner: 'Katherine Johnson',
    status: 'live',
    views: 633,
    updatedAt: '2026-04-29T15:33:00Z',
  },
  {
    id: 'r-onboarding-funnel',
    name: 'Onboarding funnel',
    kind: 'funnel',
    owner: 'Margaret Hamilton',
    status: 'draft',
    views: 41,
    updatedAt: '2026-04-28T19:22:00Z',
  },
  {
    id: 'r-power-users',
    name: 'Power users cohort',
    kind: 'cohort',
    owner: 'Linus Torvalds',
    status: 'live',
    views: 412,
    updatedAt: '2026-04-28T08:15:00Z',
  },
  {
    id: 'r-churn-risk',
    name: 'Churn risk cohort',
    kind: 'cohort',
    owner: 'Ada Lovelace',
    status: 'live',
    views: 369,
    updatedAt: '2026-04-27T20:01:00Z',
  },
  {
    id: 'r-mobile-vs-web',
    name: 'Mobile vs web',
    kind: 'dashboard',
    owner: 'Grace Hopper',
    status: 'draft',
    views: 88,
    updatedAt: '2026-04-27T13:44:00Z',
  },
  {
    id: 'r-pricing-experiment',
    name: 'Pricing experiment v3',
    kind: 'cohort',
    owner: 'Alan Turing',
    status: 'archived',
    views: 1102,
    updatedAt: '2026-04-21T09:30:00Z',
  },
  {
    id: 'r-weekly-csv',
    name: 'Weekly CSV export',
    kind: 'export',
    owner: 'Katherine Johnson',
    status: 'live',
    views: 254,
    updatedAt: '2026-04-25T05:10:00Z',
  },
  {
    id: 'r-eu-only',
    name: 'EU only — geo split',
    kind: 'dashboard',
    owner: 'Margaret Hamilton',
    status: 'live',
    views: 187,
    updatedAt: '2026-04-24T16:55:00Z',
  },
  {
    id: 'r-sunset',
    name: 'Sunset — homepage A/B',
    kind: 'cohort',
    owner: 'Linus Torvalds',
    status: 'archived',
    views: 612,
    updatedAt: '2026-04-12T11:20:00Z',
  },
];

export const sources: Source[] = [
  { id: 's-direct', name: 'Direct', share: 0.31, delta: 0.02 },
  { id: 's-organic', name: 'Organic search', share: 0.28, delta: 0.04 },
  { id: 's-referral', name: 'Referral', share: 0.14, delta: -0.01 },
  { id: 's-social', name: 'Social', share: 0.12, delta: 0.05 },
  { id: 's-email', name: 'Email', share: 0.09, delta: -0.02 },
  { id: 's-paid', name: 'Paid', share: 0.06, delta: 0.0 },
];

export const topPages: PageStat[] = [
  { path: '/', views: 18420, delta: 0.06 },
  { path: '/pricing', views: 9840, delta: 0.11 },
  { path: '/docs', views: 7411, delta: 0.04 },
  { path: '/blog/launch', views: 5232, delta: 0.42 },
  { path: '/changelog', views: 3104, delta: -0.03 },
  { path: '/about', views: 2487, delta: 0.01 },
];

export const funnels: Funnel[] = [
  {
    id: 'signup',
    name: 'Signup',
    description: 'From landing page to first authenticated session.',
    steps: [
      { label: 'Visit landing', count: 24800 },
      { label: 'Click "Get started"', count: 9120 },
      { label: 'Complete email step', count: 6350 },
      { label: 'Verify email', count: 4880 },
      { label: 'First session', count: 3920 },
    ],
  },
  {
    id: 'checkout',
    name: 'Checkout',
    description: 'From cart open to receipt.',
    steps: [
      { label: 'Open cart', count: 12400 },
      { label: 'Begin checkout', count: 7100 },
      { label: 'Address entered', count: 5630 },
      { label: 'Payment entered', count: 4810 },
      { label: 'Order placed', count: 4380 },
    ],
  },
  {
    id: 'onboarding',
    name: 'Onboarding',
    description: 'First-run flow for new accounts.',
    steps: [
      { label: 'Account created', count: 3920 },
      { label: 'Profile filled', count: 2980 },
      { label: 'Workspace chosen', count: 2410 },
      { label: 'Invited a teammate', count: 1240 },
      { label: 'Activated', count: 1095 },
    ],
  },
];

export const audiences: Audience[] = [
  {
    id: 'a-power',
    name: 'Power users',
    description: 'Logged in 5+ days in the last 30, with at least one workspace invite.',
    size: 8420,
    delta: 0.08,
    source: 'Behavior',
    updatedAt: '2026-04-30T08:00:00Z',
  },
  {
    id: 'a-trial-active',
    name: 'Active trials',
    description: 'In trial window, opened the app in the last 7 days.',
    size: 1240,
    delta: 0.14,
    source: 'Lifecycle',
    updatedAt: '2026-04-30T08:00:00Z',
  },
  {
    id: 'a-trial-stalled',
    name: 'Stalled trials',
    description: 'In trial window, no app open in the last 5 days.',
    size: 612,
    delta: -0.06,
    source: 'Lifecycle',
    updatedAt: '2026-04-30T08:00:00Z',
  },
  {
    id: 'a-eu',
    name: 'EU customers',
    description: 'Billing country in EU; for compliance segmentation.',
    size: 14820,
    delta: 0.02,
    source: 'Geo',
    updatedAt: '2026-04-29T09:30:00Z',
  },
  {
    id: 'a-mobile',
    name: 'Mobile-first',
    description: '70%+ of sessions originate from a mobile device.',
    size: 5610,
    delta: 0.11,
    source: 'Behavior',
    updatedAt: '2026-04-29T09:30:00Z',
  },
  {
    id: 'a-churn-risk',
    name: 'Churn risk',
    description: 'Engagement score has dropped two tiers in the last 14 days.',
    size: 423,
    delta: 0.22,
    source: 'Model',
    updatedAt: '2026-04-28T20:15:00Z',
  },
  {
    id: 'a-enterprise',
    name: 'Enterprise',
    description: 'Plan tier = Enterprise; seats > 25.',
    size: 96,
    delta: 0.04,
    source: 'Plan',
    updatedAt: '2026-04-28T11:11:00Z',
  },
  {
    id: 'a-newsletter',
    name: 'Newsletter subscribers',
    description: 'Opted into the weekly product newsletter.',
    size: 38240,
    delta: 0.03,
    source: 'Marketing',
    updatedAt: '2026-04-27T14:00:00Z',
  },
];

export function reportById(id: string): Report | undefined {
  return reports.find((r) => r.id === id);
}

export function reportKindLabel(kind: ReportKind): string {
  switch (kind) {
    case 'dashboard':
      return 'Dashboard';
    case 'funnel':
      return 'Funnel';
    case 'cohort':
      return 'Cohort';
    case 'export':
      return 'Export';
  }
}

export function reportStatusTone(status: ReportStatus): 'success' | 'neutral' | 'warning' {
  switch (status) {
    case 'live':
      return 'success';
    case 'draft':
      return 'warning';
    case 'archived':
      return 'neutral';
  }
}

export function statusLabel(status: ReportStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const hours = Math.round((TODAY_MS - then) / 36e5);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return `${weeks}w ago`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return n.toLocaleString('en-US');
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

export function formatDelta(value: number): string {
  const pct = (value * 100).toFixed(1);
  if (value > 0) return `+${pct}%`;
  if (value < 0) return `${pct}%`;
  return '0.0%';
}

export function deltaTone(value: number): 'success' | 'danger' | 'neutral' {
  if (value > 0.005) return 'success';
  if (value < -0.005) return 'danger';
  return 'neutral';
}
