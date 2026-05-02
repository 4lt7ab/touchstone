export type ProjectStatus = 'planning' | 'active' | 'blocked' | 'done';
export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Person {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  dueDate: string;
  progress: number;
  taskCount: number;
  doneCount: number;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  projectId: string;
  assigneeId: string;
  dueDate: string;
}

export interface ActivityEntry {
  id: string;
  projectId: string;
  authorId: string;
  message: string;
  timestamp: string;
}

export const people: Person[] = [
  { id: 'p1', name: 'Ada Lovelace', role: 'Engineering lead', initials: 'AL' },
  { id: 'p2', name: 'Grace Hopper', role: 'Staff engineer', initials: 'GH' },
  { id: 'p3', name: 'Alan Turing', role: 'Architect', initials: 'AT' },
  { id: 'p4', name: 'Katherine Johnson', role: 'Senior engineer', initials: 'KJ' },
  { id: 'p5', name: 'Linus Torvalds', role: 'Platform engineer', initials: 'LT' },
  { id: 'p6', name: 'Margaret Hamilton', role: 'Engineering manager', initials: 'MH' },
];

export const projects: Project[] = [
  {
    id: 'proj-mint',
    name: 'Mint billing rewrite',
    description:
      'Replace the legacy invoice pipeline with the new ledger service and consolidate three settlement code paths.',
    status: 'active',
    ownerId: 'p1',
    dueDate: '2026-06-30',
    progress: 62,
    taskCount: 28,
    doneCount: 17,
  },
  {
    id: 'proj-aurora',
    name: 'Aurora design system',
    description:
      'Lift cross-team UI primitives into a shared package and migrate two surfaces as proof of life.',
    status: 'active',
    ownerId: 'p3',
    dueDate: '2026-07-15',
    progress: 41,
    taskCount: 36,
    doneCount: 15,
  },
  {
    id: 'proj-ridge',
    name: 'Ridge data warehouse',
    description:
      'Stand up the analytics warehouse, wire ingest from four upstream systems, and back the executive dashboard.',
    status: 'planning',
    ownerId: 'p2',
    dueDate: '2026-09-01',
    progress: 12,
    taskCount: 22,
    doneCount: 3,
  },
  {
    id: 'proj-cobalt',
    name: 'Cobalt mobile rollout',
    description:
      'Ship the new mobile shell to 100% of users with feature parity on the seven critical flows.',
    status: 'blocked',
    ownerId: 'p4',
    dueDate: '2026-05-22',
    progress: 78,
    taskCount: 19,
    doneCount: 14,
  },
  {
    id: 'proj-sage',
    name: 'Sage onboarding revamp',
    description:
      'Rebuild first-run onboarding around the new account graph and remove the legacy welcome wizard.',
    status: 'done',
    ownerId: 'p6',
    dueDate: '2026-04-10',
    progress: 100,
    taskCount: 14,
    doneCount: 14,
  },
  {
    id: 'proj-orchid',
    name: 'Orchid permission model',
    description:
      'Move from role-based to attribute-based access control across the API gateway and admin surfaces.',
    status: 'active',
    ownerId: 'p5',
    dueDate: '2026-08-12',
    progress: 33,
    taskCount: 24,
    doneCount: 8,
  },
  {
    id: 'proj-vesper',
    name: 'Vesper telemetry',
    description:
      'Replace bespoke logging with the new observability platform and retire two legacy collectors.',
    status: 'planning',
    ownerId: 'p2',
    dueDate: '2026-10-05',
    progress: 8,
    taskCount: 18,
    doneCount: 1,
  },
  {
    id: 'proj-kelp',
    name: 'Kelp checkout polish',
    description:
      'Tighten the checkout funnel — remove dead steps, refresh the address form, and add receipt previews.',
    status: 'active',
    ownerId: 'p4',
    dueDate: '2026-06-01',
    progress: 55,
    taskCount: 11,
    doneCount: 6,
  },
];

export const tasks: Task[] = [
  {
    id: 't1',
    title: 'Cut legacy invoice cron over to ledger.publish',
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj-mint',
    assigneeId: 'p1',
    dueDate: '2026-05-12',
  },
  {
    id: 't2',
    title: 'Backfill ledger entries for prior 90 days',
    status: 'todo',
    priority: 'high',
    projectId: 'proj-mint',
    assigneeId: 'p2',
    dueDate: '2026-05-19',
  },
  {
    id: 't3',
    title: 'Reconcile rounding edge cases',
    status: 'in-progress',
    priority: 'medium',
    projectId: 'proj-mint',
    assigneeId: 'p4',
    dueDate: '2026-05-22',
  },
  {
    id: 't4',
    title: 'Retire SettlementV1 module',
    status: 'todo',
    priority: 'low',
    projectId: 'proj-mint',
    assigneeId: 'p1',
    dueDate: '2026-06-02',
  },
  {
    id: 't5',
    title: 'Audit Mint dashboards for stale fields',
    status: 'done',
    priority: 'medium',
    projectId: 'proj-mint',
    assigneeId: 'p3',
    dueDate: '2026-04-30',
  },

  {
    id: 't6',
    title: 'Publish atoms package v0',
    status: 'done',
    priority: 'high',
    projectId: 'proj-aurora',
    assigneeId: 'p3',
    dueDate: '2026-04-18',
  },
  {
    id: 't7',
    title: 'Migrate billing settings page',
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj-aurora',
    assigneeId: 'p1',
    dueDate: '2026-05-15',
  },
  {
    id: 't8',
    title: 'Migrate onboarding wizard',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj-aurora',
    assigneeId: 'p6',
    dueDate: '2026-05-29',
  },
  {
    id: 't9',
    title: 'Document theme tokens',
    status: 'in-progress',
    priority: 'low',
    projectId: 'proj-aurora',
    assigneeId: 'p3',
    dueDate: '2026-06-10',
  },

  {
    id: 't10',
    title: 'Stand up warehouse cluster',
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj-ridge',
    assigneeId: 'p2',
    dueDate: '2026-05-28',
  },
  {
    id: 't11',
    title: 'Wire CRM ingest',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj-ridge',
    assigneeId: 'p5',
    dueDate: '2026-06-12',
  },
  {
    id: 't12',
    title: 'Spec executive KPI panels',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj-ridge',
    assigneeId: 'p2',
    dueDate: '2026-06-20',
  },

  {
    id: 't13',
    title: 'Resolve App Store certificate snag',
    status: 'blocked',
    priority: 'high',
    projectId: 'proj-cobalt',
    assigneeId: 'p4',
    dueDate: '2026-05-08',
  },
  {
    id: 't14',
    title: 'Roll out to 25% cohort',
    status: 'todo',
    priority: 'high',
    projectId: 'proj-cobalt',
    assigneeId: 'p4',
    dueDate: '2026-05-15',
  },
  {
    id: 't15',
    title: 'Patch crash on cold start',
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj-cobalt',
    assigneeId: 'p5',
    dueDate: '2026-05-09',
  },

  {
    id: 't16',
    title: 'ABAC policy DSL spec',
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj-orchid',
    assigneeId: 'p5',
    dueDate: '2026-06-05',
  },
  {
    id: 't17',
    title: 'Migrate admin console roles',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj-orchid',
    assigneeId: 'p1',
    dueDate: '2026-06-25',
  },

  {
    id: 't18',
    title: 'Remove inline address form',
    status: 'in-progress',
    priority: 'medium',
    projectId: 'proj-kelp',
    assigneeId: 'p4',
    dueDate: '2026-05-14',
  },
  {
    id: 't19',
    title: 'Receipt preview component',
    status: 'todo',
    priority: 'low',
    projectId: 'proj-kelp',
    assigneeId: 'p6',
    dueDate: '2026-05-26',
  },

  {
    id: 't20',
    title: 'Pick observability vendor',
    status: 'todo',
    priority: 'high',
    projectId: 'proj-vesper',
    assigneeId: 'p2',
    dueDate: '2026-06-03',
  },
];

export const activity: ActivityEntry[] = [
  {
    id: 'a1',
    projectId: 'proj-mint',
    authorId: 'p1',
    message: 'Cut over the staging invoice cron — green for 36 hours.',
    timestamp: '2026-04-29T16:12:00Z',
  },
  {
    id: 'a2',
    projectId: 'proj-mint',
    authorId: 'p4',
    message: 'Found a rounding skew on currency conversion; opened a fix.',
    timestamp: '2026-04-29T11:48:00Z',
  },
  {
    id: 'a3',
    projectId: 'proj-aurora',
    authorId: 'p3',
    message: 'Atoms v0 tagged. Two consumers already on it.',
    timestamp: '2026-04-28T22:03:00Z',
  },
  {
    id: 'a4',
    projectId: 'proj-cobalt',
    authorId: 'p4',
    message: 'Apple flagged the entitlement — escalated to support.',
    timestamp: '2026-04-28T18:30:00Z',
  },
  {
    id: 'a5',
    projectId: 'proj-orchid',
    authorId: 'p5',
    message: 'First draft of the policy DSL up for review.',
    timestamp: '2026-04-28T15:11:00Z',
  },
  {
    id: 'a6',
    projectId: 'proj-kelp',
    authorId: 'p4',
    message: 'Inline address form is out of the funnel; -3% drop-off.',
    timestamp: '2026-04-27T20:45:00Z',
  },
  {
    id: 'a7',
    projectId: 'proj-ridge',
    authorId: 'p2',
    message: 'Warehouse cluster is reading; wiring CRM next.',
    timestamp: '2026-04-27T14:22:00Z',
  },
];

export function personById(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function tasksForProject(projectId: string): Task[] {
  return tasks.filter((t) => t.projectId === projectId);
}

export function activityForProject(projectId: string): ActivityEntry[] {
  return activity.filter((a) => a.projectId === projectId);
}

export function statusTone(
  status: ProjectStatus | TaskStatus,
): 'neutral' | 'success' | 'warning' | 'danger' | 'accent' {
  switch (status) {
    case 'done':
      return 'success';
    case 'active':
    case 'in-progress':
      return 'accent';
    case 'planning':
    case 'todo':
      return 'neutral';
    case 'blocked':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function statusLabel(status: ProjectStatus | TaskStatus): string {
  if (status === 'in-progress') return 'In progress';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function priorityTone(priority: Priority): 'neutral' | 'warning' | 'danger' {
  switch (priority) {
    case 'high':
      return 'danger';
    case 'medium':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = new Date('2026-05-01T00:00:00Z').getTime();
  const hours = Math.round((now - then) / 36e5);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return `${weeks}w ago`;
}
