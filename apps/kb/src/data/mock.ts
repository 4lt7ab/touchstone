export interface Category {
  id: string;
  name: string;
  description: string;
  icon: 'rocket' | 'gear' | 'shield' | 'book' | 'card';
}

export interface Article {
  id: string;
  title: string;
  categoryId: string;
  summary: string;
  body: string;
  author: string;
  updatedAt: string;
  readMinutes: number;
  tags: string[];
}

const TODAY_MS = new Date('2026-05-01T00:00:00Z').getTime();

export const categories: Category[] = [
  {
    id: 'getting-started',
    name: 'Getting started',
    description: 'First-run setup, signing in, your first workspace.',
    icon: 'rocket',
  },
  {
    id: 'billing',
    name: 'Billing & invoices',
    description: 'Subscriptions, plan changes, invoices, refunds.',
    icon: 'card',
  },
  {
    id: 'workspaces',
    name: 'Workspaces & teams',
    description: 'Inviting teammates, roles, sharing, transfer.',
    icon: 'gear',
  },
  {
    id: 'security',
    name: 'Security & privacy',
    description: 'Two-factor, audit logs, single sign-on, data residency.',
    icon: 'shield',
  },
  {
    id: 'integrations',
    name: 'Integrations & API',
    description: 'Webhooks, third-party connectors, the public API.',
    icon: 'book',
  },
];

export const articles: Article[] = [
  {
    id: 'gs-create-account',
    title: 'Create your account',
    categoryId: 'getting-started',
    summary: 'Sign up with email or a single sign-on provider and verify your address.',
    body: 'To create an account, visit the signup page and enter your work email. Your verification link is sent within a minute. If your domain has SSO configured you will be redirected to your identity provider. Choose a password that has at least 12 characters and one symbol. New accounts start with a 14-day free trial of the Team plan; no card is required to begin.',
    author: 'Ada Lovelace',
    updatedAt: '2026-04-22T10:00:00Z',
    readMinutes: 2,
    tags: ['signup', 'onboarding', 'sso'],
  },
  {
    id: 'gs-first-workspace',
    title: 'Set up your first workspace',
    categoryId: 'getting-started',
    summary: 'Create a workspace, name it, and invite the first teammates.',
    body: 'A workspace groups your projects, members, and billing. After verifying your email you are prompted to create your first workspace. Choose a short name — it appears in URLs and emails. You can invite teammates by email or by sharing a join link. Roles default to Member; bump trusted teammates to Admin so they can manage billing and security.',
    author: 'Grace Hopper',
    updatedAt: '2026-04-22T10:30:00Z',
    readMinutes: 3,
    tags: ['workspace', 'onboarding', 'invite'],
  },
  {
    id: 'gs-invite-teammates',
    title: 'Invite teammates to a workspace',
    categoryId: 'getting-started',
    summary: 'Send invites by email, by link, or in bulk via CSV.',
    body: 'Open the People page and click Invite. You can paste in a list of comma-separated addresses, share a magic link, or upload a CSV with email and role columns. Invitations expire after seven days. If a teammate signs up with an address that matches a verified domain, they join the workspace automatically as a Member.',
    author: 'Margaret Hamilton',
    updatedAt: '2026-04-21T15:30:00Z',
    readMinutes: 2,
    tags: ['invite', 'people', 'csv'],
  },
  {
    id: 'gs-keyboard-shortcuts',
    title: 'Keyboard shortcuts',
    categoryId: 'getting-started',
    summary: 'A cheat sheet of the most-used keyboard shortcuts.',
    body: 'Press ? anywhere to open the shortcut overlay. The most common shortcuts: cmd+k opens the command palette, g then p jumps to projects, g then t jumps to tasks, c creates a new item in the current view, e edits the focused row. Most lists support j and k to move down and up.',
    author: 'Alan Turing',
    updatedAt: '2026-04-19T09:15:00Z',
    readMinutes: 1,
    tags: ['shortcuts', 'productivity', 'commands'],
  },

  {
    id: 'bill-update-payment',
    title: 'Update your payment method',
    categoryId: 'billing',
    summary: 'Replace the card on file or switch to invoicing.',
    body: 'Workspace admins can change the payment method from Settings > Billing. You can store one credit card per workspace, or request invoice billing if your annual contract is at least the Team tier. New cards are charged on the next billing cycle; the prior card is removed once the new one authorises a $0 hold.',
    author: 'Katherine Johnson',
    updatedAt: '2026-04-25T13:00:00Z',
    readMinutes: 2,
    tags: ['payment', 'card', 'invoice'],
  },
  {
    id: 'bill-invoice-history',
    title: 'Download invoices and receipts',
    categoryId: 'billing',
    summary: 'Find past invoices, receipts, and statements.',
    body: 'Every invoice is archived under Settings > Billing > History. You can download a PDF receipt or a machine-readable CSV. Invoices are issued on the first of the month for the prior billing period. If a charge looks wrong, click Dispute on the line to open a billing ticket and we will respond within one business day.',
    author: 'Katherine Johnson',
    updatedAt: '2026-04-23T11:30:00Z',
    readMinutes: 2,
    tags: ['invoice', 'receipt', 'history', 'billing'],
  },
  {
    id: 'bill-change-plan',
    title: 'Change your plan',
    categoryId: 'billing',
    summary: 'Upgrade, downgrade, or move to annual billing.',
    body: 'Plan changes take effect at the start of the next billing period. Upgrades are prorated immediately so you only pay the difference for the rest of the cycle. Downgrades take effect at renewal and your existing seats keep working until then. Annual billing offers a 17% discount and locks the price for the term.',
    author: 'Linus Torvalds',
    updatedAt: '2026-04-20T14:00:00Z',
    readMinutes: 3,
    tags: ['plan', 'subscription', 'upgrade', 'pricing'],
  },
  {
    id: 'bill-refund-policy',
    title: 'Refund policy',
    categoryId: 'billing',
    summary: 'When refunds are issued and how to request one.',
    body: 'We refund the most recent monthly charge in full if a workspace is cancelled within seven days of renewal. Annual charges are refunded prorated to the unused months. Refunds are issued back to the original payment method and arrive within five business days. To request a refund, open Settings > Billing > History and click Dispute on the charge.',
    author: 'Linus Torvalds',
    updatedAt: '2026-04-15T08:30:00Z',
    readMinutes: 2,
    tags: ['refund', 'cancellation', 'billing'],
  },

  {
    id: 'ws-roles-and-permissions',
    title: 'Roles and permissions',
    categoryId: 'workspaces',
    summary: 'What Owner, Admin, Member, and Guest can each do.',
    body: 'Every workspace member has a role. Owner can transfer ownership and delete the workspace. Admin can manage billing, members, and security settings. Member can create and edit projects and tasks. Guest is read-only on shared resources. You can promote a member to admin from the People page; ownership is transferred from Settings > Workspace.',
    author: 'Margaret Hamilton',
    updatedAt: '2026-04-26T12:00:00Z',
    readMinutes: 3,
    tags: ['roles', 'permissions', 'admin', 'members'],
  },
  {
    id: 'ws-transfer-ownership',
    title: 'Transfer workspace ownership',
    categoryId: 'workspaces',
    summary: 'Hand a workspace over to another admin.',
    body: 'From Settings > Workspace, click Transfer ownership. The current owner picks an existing admin to receive ownership. Both parties must confirm by email. The previous owner remains an admin and can be removed afterward. Transfer is reversible for 30 days; after that the change is final.',
    author: 'Ada Lovelace',
    updatedAt: '2026-04-24T16:45:00Z',
    readMinutes: 2,
    tags: ['transfer', 'ownership', 'admin'],
  },
  {
    id: 'ws-leave-workspace',
    title: 'Leave a workspace',
    categoryId: 'workspaces',
    summary: 'Remove yourself from a workspace, or what to do if you cannot.',
    body: 'Click your avatar, choose the workspace, and select Leave workspace. Owners cannot leave directly — first transfer ownership to another admin. Leaving removes you from all projects but does not delete content you authored. Re-joining requires a new invitation from an admin.',
    author: 'Grace Hopper',
    updatedAt: '2026-04-18T17:00:00Z',
    readMinutes: 1,
    tags: ['leave', 'membership', 'workspace'],
  },
  {
    id: 'ws-share-link',
    title: 'Share a project with a link',
    categoryId: 'workspaces',
    summary: 'Generate a read-only or read-write share link.',
    body: 'On any project, click Share. Generate a link with view, comment, or edit permission. Links can be limited to a domain or expire after a set time. Anyone with the link can join as a Guest if you allow it; otherwise they need a workspace account. Revoke the link at any time to immediately invalidate access.',
    author: 'Margaret Hamilton',
    updatedAt: '2026-04-17T10:00:00Z',
    readMinutes: 2,
    tags: ['share', 'link', 'collaboration', 'guest'],
  },

  {
    id: 'sec-two-factor',
    title: 'Enable two-factor authentication',
    categoryId: 'security',
    summary: 'Add a second factor with TOTP or a hardware key.',
    body: 'Open Settings > Security and click Add second factor. Pair an authenticator app via QR code, or register a hardware security key over WebAuthn. Backup codes are generated once — store them somewhere safe. If you lose your second factor, an admin can recover access via the workspace recovery flow.',
    author: 'Alan Turing',
    updatedAt: '2026-04-28T08:30:00Z',
    readMinutes: 3,
    tags: ['2fa', 'security', 'authentication', 'totp', 'webauthn'],
  },
  {
    id: 'sec-sso-saml',
    title: 'Single sign-on with SAML',
    categoryId: 'security',
    summary: 'Wire your identity provider to enforce SSO at workspace scope.',
    body: 'Available on the Team plan and above. From Settings > Security > Single sign-on, enter the SAML metadata URL or upload the XML. We support Okta, Entra ID, Google Workspace, OneLogin, and any standard SAML 2.0 IdP. Once verified, you can require SSO for all members; existing passwords are disabled at that point.',
    author: 'Linus Torvalds',
    updatedAt: '2026-04-27T11:00:00Z',
    readMinutes: 4,
    tags: ['sso', 'saml', 'okta', 'entra', 'identity'],
  },
  {
    id: 'sec-audit-log',
    title: 'Audit log',
    categoryId: 'security',
    summary: 'See who did what across the workspace, and how to export it.',
    body: 'The audit log records member, billing, security, and integration events. Admins can filter by actor, action, or time range, and export a CSV for the last 365 days. Audit events are retained for 12 months on Team and 24 months on Enterprise. The log is read-only and cannot be edited or pruned.',
    author: 'Ada Lovelace',
    updatedAt: '2026-04-26T18:20:00Z',
    readMinutes: 2,
    tags: ['audit', 'log', 'export', 'compliance'],
  },
  {
    id: 'sec-data-residency',
    title: 'Data residency',
    categoryId: 'security',
    summary: 'Choose where your workspace data is stored.',
    body: 'Workspaces on the Enterprise plan can pin data residency to US, EU, or APAC. The choice covers primary storage, backups, and search indexes. Cross-region replication is opt-in and disabled by default. To change residency, open a request from Settings > Compliance; migrations are scheduled with at least seven days notice.',
    author: 'Katherine Johnson',
    updatedAt: '2026-04-23T09:00:00Z',
    readMinutes: 3,
    tags: ['residency', 'compliance', 'data', 'enterprise'],
  },

  {
    id: 'int-webhooks',
    title: 'Webhooks',
    categoryId: 'integrations',
    summary: 'Receive events when things happen in your workspace.',
    body: 'Create a webhook from Settings > Integrations > Webhooks. Pick which events to subscribe to (project, task, comment, billing) and supply an HTTPS endpoint. Each delivery is signed with HMAC-SHA256 using your webhook secret; verify the signature header before trusting the body. Failed deliveries are retried with exponential backoff for up to 24 hours.',
    author: 'Grace Hopper',
    updatedAt: '2026-04-29T13:45:00Z',
    readMinutes: 4,
    tags: ['webhooks', 'events', 'api', 'integration'],
  },
  {
    id: 'int-public-api',
    title: 'Using the public API',
    categoryId: 'integrations',
    summary: 'Authenticate against the REST API and make your first request.',
    body: 'The public API is REST over HTTPS, returning JSON. Mint a personal access token from your account settings, or a workspace-scoped token from Settings > Integrations > API tokens. Pass the token as a Bearer header on every request. The base URL is api.example.com/v1. The default rate limit is 600 requests per minute per token, with burst capacity of 100.',
    author: 'Alan Turing',
    updatedAt: '2026-04-29T10:15:00Z',
    readMinutes: 5,
    tags: ['api', 'rest', 'token', 'authentication', 'rate-limit'],
  },
  {
    id: 'int-rate-limits',
    title: 'API rate limits',
    categoryId: 'integrations',
    summary: 'Default limits, headers, and how to request a higher quota.',
    body: 'Each API token is limited to 600 requests per minute, with bursts up to 100 requests in any 10 second window. Every response includes X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset headers. When you exceed a limit you receive a 429 with a Retry-After header. To request a higher quota, contact support with your traffic profile and use case.',
    author: 'Alan Turing',
    updatedAt: '2026-04-28T14:30:00Z',
    readMinutes: 2,
    tags: ['api', 'rate-limit', '429', 'quota'],
  },
  {
    id: 'int-zapier',
    title: 'Connect with Zapier',
    categoryId: 'integrations',
    summary: 'Build no-code automations between us and 5,000+ apps.',
    body: 'Search for our app in Zapier and click Connect. Authorise the workspace and pick a trigger — new task, completed project, billing event. The Zapier action surface includes creating projects, tasks, and comments. The same connector works in Zapier tables and Zapier interfaces. Each Zap counts toward the workspace API rate limit.',
    author: 'Margaret Hamilton',
    updatedAt: '2026-04-22T16:00:00Z',
    readMinutes: 3,
    tags: ['zapier', 'automation', 'no-code', 'integration'],
  },
  {
    id: 'int-slack',
    title: 'Slack integration',
    categoryId: 'integrations',
    summary: 'Post project events into Slack and unfurl links.',
    body: 'Add the integration from Settings > Integrations > Slack. Pick a default channel for events and choose which projects post into Slack. Pasting a project or task URL in Slack unfurls a rich preview. Slash commands let you create tasks (/task create) or check status (/task status) without leaving Slack.',
    author: 'Linus Torvalds',
    updatedAt: '2026-04-19T11:30:00Z',
    readMinutes: 3,
    tags: ['slack', 'chat', 'unfurl', 'integration'],
  },
  {
    id: 'int-export-csv',
    title: 'Export your data as CSV',
    categoryId: 'integrations',
    summary: 'Download a CSV snapshot of projects, tasks, or members.',
    body: 'Admins can request a CSV export from Settings > Data export. Pick the resources (projects, tasks, members, audit) and the date range. We email a download link when the export is ready, typically within five minutes. Links expire after 24 hours. Exports include archived items if you check the box.',
    author: 'Katherine Johnson',
    updatedAt: '2026-04-16T17:00:00Z',
    readMinutes: 2,
    tags: ['export', 'csv', 'data'],
  },

  {
    id: 'gs-mobile-app',
    title: 'Install the mobile app',
    categoryId: 'getting-started',
    summary: 'Install on iOS or Android and pair with your account.',
    body: 'Download from the App Store or Google Play. Sign in with the same email; if you have SSO, the mobile app supports the same provider. Notifications are off by default — enable them per workspace under Settings > Notifications. The mobile app supports tasks, comments, and project read; complex editing is web-only for now.',
    author: 'Alan Turing',
    updatedAt: '2026-04-16T09:00:00Z',
    readMinutes: 2,
    tags: ['mobile', 'ios', 'android', 'install'],
  },
  {
    id: 'sec-recover-access',
    title: 'Recover access if you lose your second factor',
    categoryId: 'security',
    summary: 'Use a backup code, or contact a workspace admin to recover.',
    body: 'If you still have a backup code, enter it on the second-factor screen — each code is single-use. If you have lost both your authenticator and backup codes, an admin can initiate recovery. The admin starts the flow from the People page; you receive an email with a one-time recovery link valid for one hour.',
    author: 'Ada Lovelace',
    updatedAt: '2026-04-15T14:30:00Z',
    readMinutes: 2,
    tags: ['recovery', '2fa', 'backup', 'security'],
  },
];

export function categoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function articleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function articlesByCategory(categoryId: string): Article[] {
  return articles.filter((a) => a.categoryId === categoryId);
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

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'has',
  'have',
  'how',
  'i',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'this',
  'to',
  'was',
  'we',
  'were',
  'will',
  'with',
  'you',
  'your',
  'do',
  'does',
  'did',
  'can',
  'if',
  'so',
  'but',
  'not',
  'no',
  'all',
  'any',
  'each',
  'than',
  'then',
  'them',
  'they',
  'their',
  'there',
  'these',
  'those',
  'when',
  'where',
  'who',
  'what',
  'which',
  'why',
  'about',
]);

const SYNONYMS: Record<string, string[]> = {
  bill: ['billing', 'invoice', 'invoices', 'payment', 'pay', 'charge', 'charges', 'subscription'],
  billing: ['bill', 'invoice', 'invoices', 'payment', 'pay', 'charge', 'charges', 'subscription'],
  invoice: ['bill', 'billing', 'receipt', 'receipts', 'charge'],
  invoices: ['bill', 'billing', 'receipt', 'receipts', 'charge', 'charges'],
  receipt: ['invoice', 'invoices', 'bill'],
  receipts: ['invoice', 'invoices', 'bill'],
  payment: ['bill', 'billing', 'invoice', 'card', 'pay'],
  pay: ['payment', 'bill', 'billing', 'invoice', 'card'],
  card: ['payment', 'pay', 'credit'],
  refund: ['cancellation', 'cancel', 'money'],
  cancel: ['refund', 'cancellation', 'leave'],
  cancellation: ['refund', 'cancel'],
  plan: ['subscription', 'pricing', 'upgrade', 'tier'],
  pricing: ['plan', 'price', 'cost', 'subscription'],
  subscription: ['plan', 'pricing', 'billing'],
  upgrade: ['plan', 'change', 'pricing'],
  password: ['login', 'sign-in', 'signin', 'authentication'],
  login: ['signin', 'sign-in', 'password', 'authentication'],
  signin: ['login', 'sign-in', 'password', 'authentication'],
  '2fa': ['two-factor', 'authentication', 'totp', 'webauthn', 'security'],
  'two-factor': ['2fa', 'authentication', 'totp', 'webauthn', 'security'],
  totp: ['2fa', 'two-factor', 'authentication'],
  webauthn: ['2fa', 'two-factor', 'authentication', 'security-key'],
  sso: ['saml', 'single-sign-on', 'okta', 'entra', 'identity'],
  saml: ['sso', 'single-sign-on', 'identity'],
  identity: ['sso', 'saml', 'authentication'],
  audit: ['log', 'logs', 'compliance'],
  log: ['audit', 'logs'],
  logs: ['audit', 'log'],
  compliance: ['audit', 'residency', 'security'],
  residency: ['compliance', 'data', 'region'],
  region: ['residency', 'data', 'compliance'],
  webhook: ['webhooks', 'event', 'events', 'callback'],
  webhooks: ['webhook', 'event', 'events', 'callback'],
  event: ['webhook', 'webhooks', 'events'],
  events: ['webhook', 'webhooks', 'event'],
  api: ['rest', 'token', 'integration'],
  rest: ['api'],
  token: ['api', 'authentication', 'key'],
  rate: ['rate-limit', 'limit', 'quota', '429'],
  limit: ['rate-limit', 'quota', '429'],
  'rate-limit': ['rate', 'limit', 'quota', '429'],
  quota: ['rate-limit', 'limit'],
  zapier: ['automation', 'integration', 'no-code'],
  slack: ['chat', 'integration', 'notification'],
  notification: ['notify', 'alerts', 'slack'],
  workspace: ['team', 'organization', 'org'],
  team: ['workspace', 'members', 'people'],
  invite: ['inviting', 'people', 'members', 'add'],
  member: ['members', 'people', 'team'],
  members: ['member', 'people', 'team'],
  role: ['roles', 'permission', 'permissions', 'admin'],
  roles: ['role', 'permission', 'permissions', 'admin'],
  permission: ['permissions', 'role', 'roles', 'admin'],
  permissions: ['permission', 'role', 'roles', 'admin'],
  admin: ['owner', 'role', 'permission'],
  owner: ['admin', 'transfer', 'ownership'],
  transfer: ['ownership', 'owner'],
  ownership: ['owner', 'transfer'],
  share: ['sharing', 'link', 'collaboration'],
  sharing: ['share', 'link'],
  link: ['share', 'url'],
  guest: ['share', 'read-only', 'collaboration'],
  recovery: ['recover', 'lost', 'backup'],
  backup: ['recovery', 'codes'],
  csv: ['export', 'download', 'data'],
  export: ['csv', 'download', 'data'],
  download: ['export', 'csv'],
  mobile: ['ios', 'android', 'app'],
  ios: ['mobile', 'app'],
  android: ['mobile', 'app'],
  shortcut: ['shortcuts', 'keyboard', 'commands'],
  shortcuts: ['shortcut', 'keyboard', 'commands'],
  keyboard: ['shortcut', 'shortcuts'],
};

function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.toLowerCase().split(/[^a-z0-9-]+/g)) {
    if (!raw) continue;
    if (raw.length < 2) continue;
    if (STOP_WORDS.has(raw)) continue;
    out.push(raw);
  }
  return out;
}

function expandTokens(tokens: string[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const token of tokens) {
    out.set(token, (out.get(token) ?? 0) + 1);
    const synonyms = SYNONYMS[token];
    if (synonyms) {
      for (const synonym of synonyms) {
        out.set(synonym, (out.get(synonym) ?? 0) + 0.5);
      }
    }
  }
  return out;
}

interface Indexed {
  article: Article;
  vector: Map<string, number>;
  norm: number;
  haystack: string;
}

function buildIndex(): Indexed[] {
  return articles.map((article) => {
    const text = [
      article.title,
      article.title,
      article.summary,
      article.body,
      article.tags.join(' '),
      article.tags.join(' '),
    ].join(' ');
    const tokens = tokenize(text);
    const counts = new Map<string, number>();
    for (const token of tokens) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
    let norm = 0;
    for (const value of counts.values()) {
      norm += value * value;
    }
    return {
      article,
      vector: counts,
      norm: Math.sqrt(norm),
      haystack: text.toLowerCase(),
    };
  });
}

const INDEX = buildIndex();

export interface SearchHit {
  article: Article;
  score: number;
  matchedTerms: string[];
}

export function semanticSearch(query: string, limit = 8): SearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const queryVec = expandTokens(tokens);
  let queryNorm = 0;
  for (const value of queryVec.values()) {
    queryNorm += value * value;
  }
  queryNorm = Math.sqrt(queryNorm);
  if (queryNorm === 0) return [];

  const hits: SearchHit[] = [];
  for (const entry of INDEX) {
    if (entry.norm === 0) continue;
    let dot = 0;
    const matched: string[] = [];
    for (const [term, weight] of queryVec) {
      const docWeight = entry.vector.get(term);
      if (docWeight) {
        dot += weight * docWeight;
        if (tokens.includes(term)) matched.push(term);
      }
    }
    if (dot === 0) continue;
    const score = dot / (queryNorm * entry.norm);
    hits.push({ article: entry.article, score, matchedTerms: matched });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

export function exactSearch(query: string, limit = 8): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const entry of INDEX) {
    const idx = entry.haystack.indexOf(q);
    if (idx === -1) continue;
    const matched = q.split(/\s+/).filter(Boolean);
    const score =
      (entry.article.title.toLowerCase().includes(q) ? 1 : 0.6) + Math.max(0, 1 - idx / 400);
    hits.push({ article: entry.article, score, matchedTerms: matched });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

export function relatedArticles(articleId: string, limit = 4): Article[] {
  const subject = articleById(articleId);
  if (!subject) return [];
  const subjectIndex = INDEX.find((e) => e.article.id === articleId);
  if (!subjectIndex) return [];
  const scores: { article: Article; score: number }[] = [];
  for (const entry of INDEX) {
    if (entry.article.id === articleId) continue;
    if (entry.norm === 0 || subjectIndex.norm === 0) continue;
    let dot = 0;
    for (const [term, weight] of subjectIndex.vector) {
      const docWeight = entry.vector.get(term);
      if (docWeight) dot += weight * docWeight;
    }
    if (dot === 0) continue;
    const sameCategory = entry.article.categoryId === subject.categoryId ? 1.15 : 1;
    scores.push({
      article: entry.article,
      score: (dot / (entry.norm * subjectIndex.norm)) * sameCategory,
    });
  }
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, limit).map((s) => s.article);
}

export function buildSnippet(article: Article, query: string): string {
  const text = article.body;
  const q = query.trim().toLowerCase();
  if (!q) return text.slice(0, 180) + (text.length > 180 ? '…' : '');
  const lower = text.toLowerCase();
  const tokens = tokenize(q).filter((t) => t.length > 2);
  let cursor = -1;
  for (const token of tokens) {
    const idx = lower.indexOf(token);
    if (idx >= 0 && (cursor === -1 || idx < cursor)) cursor = idx;
  }
  if (cursor === -1) {
    const idx = lower.indexOf(q);
    if (idx >= 0) cursor = idx;
  }
  if (cursor === -1) return text.slice(0, 180) + (text.length > 180 ? '…' : '');
  const start = Math.max(0, cursor - 60);
  const end = Math.min(text.length, cursor + 140);
  let snippet = text.slice(start, end);
  if (start > 0) snippet = '…' + snippet;
  if (end < text.length) snippet = snippet + '…';
  return snippet;
}
