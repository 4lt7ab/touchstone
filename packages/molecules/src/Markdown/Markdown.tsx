import { useMemo } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Code } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { Prose } from '../Prose/Prose.js';
import type { ProseDensity, ProseWidth } from '../Prose/Prose.js';
import { Table } from '../Table/Table.js';

type ReactMarkdownProps = ComponentProps<typeof ReactMarkdown>;

const defaultComponents: Components = {
  // `pre` unwraps so our `<Code block>` (which already emits <pre><code>)
  // doesn't end up double-wrapped.
  pre({ children }) {
    return <>{children}</>;
  },
  code({ className, children, node }) {
    const language = /language-(\w+)/.exec(className ?? '')?.[1];
    const position = node?.position;
    const isBlock =
      position && position.start.line !== position.end.line ? true : Boolean(language);
    if (isBlock) {
      const text = String(children ?? '').replace(/\n$/, '');
      return (
        <Code block {...(language ? { language } : {})}>
          {text}
        </Code>
      );
    }
    return (
      <Code {...(language ? { language } : {})}>
        {children as ReactNode}
      </Code>
    );
  },
  table({ children }) {
    return <Table>{children as ReactNode}</Table>;
  },
  thead({ children }) {
    return <Table.Header>{children as ReactNode}</Table.Header>;
  },
  tbody({ children }) {
    return <Table.Body>{children as ReactNode}</Table.Body>;
  },
  tr({ children }) {
    return <Table.Row>{children as ReactNode}</Table.Row>;
  },
  th({ children }) {
    return <Table.HeaderCell>{children as ReactNode}</Table.HeaderCell>;
  },
  td({ children }) {
    return <Table.Cell>{children as ReactNode}</Table.Cell>;
  },
};

export interface MarkdownProps extends BaseComponentProps {
  /** Markdown source string. */
  children: string;
  /**
   * Partial override of the default `components` map. Shallow-merged over
   * the library defaults so swapping `code` for a highlighted variant
   * doesn't lose the `table` mapping.
   */
  components?: Components;
  /** `remark` plugins forwarded to `react-markdown`. */
  remarkPlugins?: ReactMarkdownProps['remarkPlugins'];
  /** `rehype` plugins forwarded to `react-markdown`. */
  rehypePlugins?: ReactMarkdownProps['rehypePlugins'];
  /** Vertical rhythm of the surrounding `Prose`. @default 'comfortable' */
  density?: ProseDensity;
  /** Line-length clamp of the surrounding `Prose`. @default 'reading' */
  width?: ProseWidth;
  /**
   * Skip the surrounding `Prose` wrapper. Use when composing inside a parent
   * that already provides prose styling (e.g. a custom documentation shell).
   * @default false
   */
  unstyled?: boolean;
}

/**
 * Markdown reader. Wraps `react-markdown` with a default `components` map
 * that routes `code`/`pre` to the `Code` atom and GFM `table`/`thead`/`tbody`
 * /`tr`/`th`/`td` to the `Table` family. Headings, paragraphs, lists,
 * blockquotes, links, emphasis, and horizontal rules are left bare so the
 * surrounding `Prose` styles them.
 *
 * GFM tables / task lists / strikethrough require `remark-gfm` — pass it via
 * `remarkPlugins={[remarkGfm]}`. Consumers install `remark-gfm` themselves
 * (it's a peer of `react-markdown`, not bundled in Touchstone).
 */
export function Markdown({
  children,
  components,
  remarkPlugins,
  rehypePlugins,
  density,
  width,
  unstyled = false,
  id,
  'data-testid': dataTestId,
}: MarkdownProps): React.JSX.Element {
  const merged = useMemo<Components>(() => {
    if (!components) return defaultComponents;
    return { ...defaultComponents, ...components };
  }, [components]);

  const tree = (
    <ReactMarkdown
      components={merged}
      {...(remarkPlugins ? { remarkPlugins } : {})}
      {...(rehypePlugins ? { rehypePlugins } : {})}
    >
      {children}
    </ReactMarkdown>
  );

  if (unstyled) {
    return (
      <div id={id} data-testid={dataTestId}>
        {tree}
      </div>
    );
  }

  return (
    <Prose
      {...(id ? { id } : {})}
      {...(dataTestId ? { 'data-testid': dataTestId } : {})}
      {...(density ? { density } : {})}
      {...(width ? { width } : {})}
    >
      {tree}
    </Prose>
  );
}
