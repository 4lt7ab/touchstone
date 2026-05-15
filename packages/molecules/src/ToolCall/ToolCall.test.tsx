import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolCall } from './ToolCall.js';

describe('ToolCall', () => {
  it('renders the tool name and a status badge', () => {
    render(<ToolCall name="search_docs" status="success" />);
    expect(screen.getByText('search_docs')).toBeInTheDocument();
    expect(screen.getByText('done')).toBeInTheDocument();
  });

  it('starts collapsed when the call has succeeded', () => {
    render(<ToolCall name="search_docs" status="success" result={<span>hit</span>} />);
    expect(screen.queryByText('hit')).not.toBeVisible();
  });

  it('starts open when the call is pending or errored', () => {
    render(<ToolCall name="search_docs" status="pending" args={<span>payload</span>} />);
    expect(screen.getByText('payload')).toBeVisible();
  });

  it('toggles open on click', async () => {
    const user = userEvent.setup();
    render(<ToolCall name="search_docs" status="success" result={<span>hit</span>} />);
    await user.click(screen.getByRole('button', { name: /search_docs/ }));
    expect(screen.getByText('hit')).toBeVisible();
  });
});
