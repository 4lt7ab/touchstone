import type { ReactNode } from 'react';

export type MessageId = string;
export type ConversationId = string;

export interface ToolPart {
  kind: 'tool';
  id: string;
  name: string;
  status: 'pending' | 'success' | 'error';
  args?: Record<string, unknown>;
  result?: ReactNode;
}

export interface CitationPart {
  kind: 'citation';
  id: string;
  index: number;
  title: string;
  snippet: string;
  href?: string;
}

export interface TextPart {
  kind: 'text';
  id: string;
  body: string;
}

export type MessagePart = TextPart | ToolPart | CitationPart;

export interface ChatMessage {
  id: MessageId;
  author: 'user' | 'assistant' | 'system' | 'tool';
  authorName?: string;
  parts: MessagePart[];
  state: 'complete' | 'streaming' | 'error';
  timestamp: string;
  liked?: boolean;
  disliked?: boolean;
}

export interface ChatConversation {
  id: ConversationId;
  title: string;
  preview: string;
  updatedAt: string;
  messages: ChatMessage[];
}

const initial: ChatConversation[] = [
  {
    id: 'conv-1',
    title: 'Themes & rhythms',
    preview: 'How do the rhythm presets pair with each theme?',
    updatedAt: 'just now',
    messages: [
      {
        id: 'm-1',
        author: 'system',
        parts: [{ kind: 'text', id: 'm-1-t', body: 'New conversation · grounded against the Touchstone docs.' }],
        state: 'complete',
        timestamp: '',
      },
      {
        id: 'm-2',
        author: 'user',
        authorName: 'You',
        parts: [
          {
            kind: 'text',
            id: 'm-2-t',
            body: 'How do themes compose in Touchstone, and what do rhythms add on top?',
          },
        ],
        state: 'complete',
        timestamp: '11:02',
      },
      {
        id: 'm-3',
        author: 'assistant',
        authorName: 'Touchstone Guide',
        parts: [
          {
            kind: 'text',
            id: 'm-3-t1',
            body: 'Every theme is a CSS class that fills the same vars.* contract — applying the class to any wrapping element switches the whole subtree.',
          },
          {
            kind: 'citation',
            id: 'm-3-c1',
            index: 1,
            title: 'docs/architecture.md · Theming',
            snippet:
              'A single theme contract (vars.*) defined in @touchstone/themes is read by every styled component. Theme presets are class-based and applied at the root.',
          },
          {
            kind: 'text',
            id: 'm-3-t2',
            body: ' Rhythms are an opt-in pulse layer: a ThemeRhythmProvider drives a CSS variable that glow-aware components (Background, Surface glow="pulse") read. The five "themed" themes ship matching rhythms so synthwave breathes and pacman wakas — the still themes leave the variable at 0 and look static.',
          },
        ],
        state: 'complete',
        timestamp: '11:02',
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Umbrella publishing ritual',
    preview: 'walk me through just bump → /commit → just release',
    updatedAt: 'yesterday',
    messages: [
      {
        id: 'm-1',
        author: 'user',
        authorName: 'You',
        parts: [{ kind: 'text', id: 'm-1-t', body: 'walk me through just bump → /commit → just release' }],
        state: 'complete',
        timestamp: 'yesterday',
      },
      {
        id: 'm-2',
        author: 'assistant',
        authorName: 'Touchstone Guide',
        parts: [
          {
            kind: 'text',
            id: 'm-2-t',
            body: 'The three steps are human-only. `just bump <level>` walks every workspace package.json and stamps a new version in lockstep. Then /commit folds the diff into a single craft-voice commit. Finally `just release` runs scripts/publish.ts which asserts a clean tree, builds, and publishes each public package in topological order.',
          },
          {
            kind: 'tool',
            id: 'm-2-tool',
            name: 'read_file',
            status: 'success',
            args: { path: 'scripts/publish.ts', limit: 200 },
            result: 'Loaded scripts/publish.ts · 198 lines',
          },
        ],
        state: 'complete',
        timestamp: 'yesterday',
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'Adding a new atom',
    preview: 'what does the canonical atom folder look like?',
    updatedAt: 'tuesday',
    messages: [],
  },
];

export function seedConversations(): ChatConversation[] {
  return JSON.parse(JSON.stringify(initial)) as ChatConversation[];
}

const cannedReplies: ReadonlyArray<{ match: RegExp; parts: MessagePart[] }> = [
  {
    match: /merge|retire|tenet/i,
    parts: [
      {
        kind: 'text',
        id: 'r-mr-1',
        body: 'Touchstone has two paired tenets. The first is **sane defaults that quickstart a real app** — the zero-config render is the demo. The second is **merge before retire** — when two in-scope components overlap, merge with one extra prop rather than cut the utility.',
      },
      {
        kind: 'citation',
        id: 'r-mr-c',
        index: 1,
        title: 'docs/design-tenets.md',
        snippet:
          'A merged component with one extra prop is almost always cheaper than two near-duplicate components.',
      },
    ],
  },
  {
    match: /theme|rhythm|warm sand|synthwave|terminal|pipboy|pacman/i,
    parts: [
      {
        kind: 'text',
        id: 'r-t-1',
        body: 'Each theme is a class-based fill of the same vars.* contract. Apply the class to any wrapping element — body, route shell, single panel — and the subtree picks up that theme. Swap the class to swap the theme.',
      },
      {
        kind: 'tool',
        id: 'r-t-tool',
        name: 'list_themes',
        status: 'success',
        args: { source: 'packages/themes' },
        result:
          'warmSand · slate · moss · coral · synthwave · terminal · pipboy · neural · blackhole · pacman',
      },
    ],
  },
  {
    match: /umbrella|publish|release|bump/i,
    parts: [
      {
        kind: 'text',
        id: 'r-u-1',
        body: 'The umbrella @4lt7ab/touchstone bundles every workspace dependency — JS and CSS — into a single tarball. Consumers install one package and import one stylesheet.',
      },
      {
        kind: 'text',
        id: 'r-u-2',
        body: ' Releases are human-only: `just bump <level>` → /commit → `just release`. The agent never touches versions and never publishes.',
      },
      {
        kind: 'citation',
        id: 'r-u-c',
        index: 1,
        title: '.claude/rules/human-only-levers.md',
        snippet: 'Workspace versioning and npm publishing are human levers.',
      },
    ],
  },
  {
    match: /atom|molecule|organism|layer|tier/i,
    parts: [
      {
        kind: 'text',
        id: 'r-a-1',
        body: 'Atomic-design layering is enforced by dependency direction: tokens → themes → atoms → molecules → organisms → react. An atom can never import a molecule. Sibling-to-sibling imports inside a tier need a real reason.',
      },
    ],
  },
];

const fallback: MessagePart[] = [
  {
    kind: 'text',
    id: 'r-f-1',
    body: 'Good question — let me think out loud. Touchstone leans hard on its two tenets: sane defaults and merge before retire. Ask me about themes, the umbrella package, or how a layer earns a new component, and I can show you the relevant docs and stories.',
  },
];

export function replyFor(prompt: string): MessagePart[] {
  for (const entry of cannedReplies) {
    if (entry.match.test(prompt)) {
      return entry.parts.map((part) => ({ ...part, id: `${part.id}-${Date.now()}` }));
    }
  }
  return fallback.map((part) => ({ ...part, id: `${part.id}-${Date.now()}` }));
}

export const starterPrompts: ReadonlyArray<string> = [
  'What are the two design tenets?',
  'How do themes compose in Touchstone?',
  'Walk me through the release ritual.',
  'What lives at the molecules tier?',
];
