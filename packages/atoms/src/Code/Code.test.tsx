import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Code } from './Code.js';

describe('Code', () => {
  it('renders inline as <code>', () => {
    render(<Code>npm install</Code>);
    const el = screen.getByText('npm install');
    expect(el.tagName).toBe('CODE');
  });

  it('renders block as <pre><code>', () => {
    render(<Code block>const x = 1;</Code>);
    const code = screen.getByText('const x = 1;');
    expect(code.tagName).toBe('CODE');
    expect(code.parentElement?.tagName).toBe('PRE');
  });

  it('forwards language as data-language and renders the pill in block mode', () => {
    render(
      <Code block language="ts">
        let y = 2;
      </Code>,
    );
    const pre = screen.getByText('let y = 2;').parentElement!;
    expect(pre).toHaveAttribute('data-language', 'ts');
    expect(screen.getByText('ts')).toBeInTheDocument();
  });

  it('forwards language as data-language inline (no pill)', () => {
    render(
      <Code language="bash" data-testid="inline">
        ls -la
      </Code>,
    );
    const el = screen.getByTestId('inline');
    expect(el).toHaveAttribute('data-language', 'bash');
    expect(screen.queryByText('bash')).not.toBeInTheDocument();
  });
});
