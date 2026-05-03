import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import remarkGfm from 'remark-gfm';
import { Markdown } from './Markdown.js';

describe('Markdown', () => {
  it('renders headings, paragraphs, and inline emphasis as bare HTML inside Prose', () => {
    render(<Markdown>{`# title\n\nplain **bold** _italic_ paragraph.`}</Markdown>);
    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument();
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByText('italic').tagName).toBe('EM');
  });

  it('routes inline code to the Code atom', () => {
    render(<Markdown>{`run \`bun install\` first.`}</Markdown>);
    const inline = screen.getByText('bun install');
    expect(inline.tagName).toBe('CODE');
    expect(inline.parentElement?.tagName).not.toBe('PRE');
  });

  it('routes fenced code with language to <Code block> and emits a language pill', () => {
    render(<Markdown>{`\`\`\`ts\nconst x = 1;\n\`\`\``}</Markdown>);
    const code = screen.getByText('const x = 1;');
    expect(code.tagName).toBe('CODE');
    const pre = code.parentElement!;
    expect(pre.tagName).toBe('PRE');
    expect(pre).toHaveAttribute('data-language', 'ts');
    expect(screen.getByText('ts')).toBeInTheDocument();
  });

  it('renders GFM tables through the Table family when remark-gfm is provided', () => {
    const md = [
      '| name | role |',
      '| ---- | ---- |',
      '| ada  | apprentice |',
      '| sam  | journey |',
    ].join('\n');
    render(<Markdown remarkPlugins={[remarkGfm]}>{md}</Markdown>);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'name' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'apprentice' })).toBeInTheDocument();
  });

  it('shallow-merges a components override over the defaults', () => {
    function Loud({ children }: { children?: React.ReactNode }) {
      return <strong data-testid="loud">{children}</strong>;
    }
    render(
      <Markdown components={{ em: Loud }}>{`plain **bold** _swapped_ paragraph.`}</Markdown>,
    );
    expect(screen.getByTestId('loud')).toHaveTextContent('swapped');
    expect(screen.getByText('bold').tagName).toBe('STRONG');
  });

  it('mode="text" emits the stripped text content as a single span', () => {
    render(
      <Markdown mode="text" data-testid="md">
        {`# title\n\nthe **anvil** rings`}
      </Markdown>,
    );
    const span = screen.getByTestId('md');
    expect(span.tagName).toBe('SPAN');
    expect(span.textContent).toContain('title');
    expect(span.textContent).toContain('anvil rings');
    expect(span.querySelector('h1')).toBeNull();
    expect(span.querySelector('strong')).toBeNull();
  });

  it('unstyled=true skips the Prose wrapper', () => {
    render(
      <Markdown unstyled data-testid="md">
        {`# bare`}
      </Markdown>,
    );
    const root = screen.getByTestId('md');
    expect(root.getAttribute('data-density')).toBeNull();
    expect(root.getAttribute('data-width')).toBeNull();
  });
});
