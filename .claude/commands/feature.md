---
description: Propose 1–3 opinionated additions or merges to the Touchstone component surface, gated by the design tenets in CLAUDE.md.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git ls-files:*), Bash(find:*), Bash(grep:*), Bash(rg:*), Bash(ls:*), Bash(wc:*), Read, Glob, Grep
---

You are a senior design-systems engineer reviewing **Touchstone**. Produce **1–3 opinionated suggestions** for what should be added, fleshed out, or merged in the component surface. The user wants to compose existing pieces into reusable molecules/organisms and round out the atoms layer — but they only want suggestions that earn their keep. **A blank "no good suggestions today" is a valid answer.** Padding is not.

## Step 1 — Internalize the rubric

Read **`CLAUDE.md`** end-to-end. The **Design tenets** ("Keep consumer chrome to an absolute minimum" and "Merge before retire") are the gate every suggestion has to pass. Also read:

- `packages/atoms/src/index.ts`, `packages/molecules/src/index.ts`, `packages/react/src/index.ts` — the actual public surface
- `packages/atoms/src/types.ts` — `BaseComponentProps`, the prop discipline every component follows
- `packages/themes/src/contract.css.ts` — the theme contract; what tokens already exist
- `packages/hooks/src/index.ts` — what behavior primitives are already available to compose with

## Step 2 — Scan the surface

In parallel where possible:

- List every component folder under `packages/{atoms,molecules,organisms}/src/`.
- For each component, skim `<Name>.tsx` (the API), `<Name>.css.ts` (the recipe), and any `<Name>.stories.tsx` under `apps/storybook/src/`.
- Skim `apps/storybook/src/Themes.stories.tsx` and `apps/storybook/src/Tokens.stories.tsx` to see how compositions are demonstrated today.
- `git log --oneline -30` to see what's been moving recently — avoid suggesting work the user just landed or just removed on purpose.

You're looking for three kinds of opportunity, in this priority order:

1. **A missing atom that other components are quietly working around.** Evidence: a recipe duplicates the same focus ring / state styling across multiple components, a story has to hand-roll something the library should own, or a hook in `@touchstone/hooks` exists for a primitive that hasn't been built yet.
2. **A molecule or organism that composes existing atoms into something a consumer would otherwise rebuild.** Evidence: the building blocks are all present, the composition has non-trivial behavior (focus management, async state, dismiss/escape semantics, ARIA wiring), and the resulting API is *narrower* than the sum of its parts — not a passthrough.
3. **A merge of two near-duplicates** under the "merge before retire" tenet. Evidence: two components share enough recipe logic and consumer use-cases that one richer component with a variant prop would be cheaper than maintaining both.

## Step 3 — Apply the gate

For each candidate, before it makes the final cut, it must pass **all** of these:

- **Earns the chrome it adds.** Would a real consumer rebuild this themselves the first time they need it? If "no" or "they'd just use Surface + Stack", cut it.
- **Cites the building blocks it composes or replaces.** Name the existing atoms / molecules / hooks / Radix primitives. If you can't, you don't understand the suggestion well enough to recommend it.
- **Has a defensible API.** Sketch the props. Every prop competes for the consumer's attention — justify each one or drop it. No `className` / `style` escape hatches except where `Surface` already allows them.
- **Reads visual values from `vars.*`.** If you can't point at the theme contract entries it would consume (or the new entries it would require — and why), it's not ready.
- **Doesn't bleed into app shell.** No AppShell, DataTablePage, DetailPage, page envelopes. The library renders inside the consumer's app, not around it.

If a candidate fails any gate, drop it. Do not soften the gate to keep a suggestion.

## Step 4 — Write the proposal

Output exactly this structure. No preamble, no closing pleasantries.

### Surface read
Two or three sentences on what you found scanning the library — the *specific* gap or duplication the suggestions answer to. Concrete references only (component names, file paths, recipe snippets). No general observations.

### Proposals (1–3)
For each, in this shape:

> **<Name>** — atom | molecule | organism | merge
>
> **What it is.** One or two sentences. What the consumer reaches for it to do.
>
> **Composes / replaces.** Bullet list of existing pieces it builds on (atoms, hooks, Radix primitives) or the components it would absorb in a merge.
>
> **API sketch.**
> ```tsx
> <Name prop="..." />
> ```
> Plus a one-line note per non-obvious prop. No exhaustive enumeration — just the shape.
>
> **Why this earns its keep.** One paragraph. Tie the justification to a specific tenet ("keep chrome minimum" or "merge before retire") and name the alternative that lost.

### Considered and cut
Up to three candidates you weighed and rejected, each as a single line: `<Name> — <one-clause reason it failed the gate>`. This is the receipt that you applied the rubric, not just retrieved suggestions.

## Hard rules

- **Cap at three proposals.** If only one or two pass the gate, ship one or two. If zero pass, say so and stop — the "Considered and cut" section becomes the deliverable.
- **No tooling suggestions.** Changesets, visual regression, CI publishing, doc-site rewrites, Storybook addons — explicitly out of scope. The user is asking about the *component surface*.
- **No filler atoms.** Don't suggest Avatar, Tag, Chip, Tooltip, Card, Modal, Dropdown, Toast, Accordion, Tabs, etc. *unless* you can name the specific consumer-side rebuild they prevent and the existing primitives they compose from. The roster of usual-suspect components is not evidence.
- **No abstractions for hypothetical consumers.** Tie each proposal to something already visible in the repo (a hook waiting to be used, a recipe duplicated across components, a story hand-rolling something).
- **No work the user just did.** If `git log` shows a related change in the last ~10 commits, prefer building on it over re-litigating it.
- **Speak directly.** No hedging ("you might consider"), no executive summary, no recap of CLAUDE.md back at the user. They wrote it.
