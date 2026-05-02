import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertBanner } from './AlertBanner.js';

describe('AlertBanner', () => {
  it('renders with role=status by default (info tone)', () => {
    render(<AlertBanner title="ok" />);
    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('ok');
  });

  it('renders with role=alert when tone is danger', () => {
    render(
      <AlertBanner tone="danger" title="cracked vessel">
        the seal would not hold.
      </AlertBanner>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('cracked vessel');
    expect(alert).toHaveTextContent('the seal would not hold.');
  });

  it('renders with role=alert when tone is warning', () => {
    render(<AlertBanner tone="warning" title="cooling slowly" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders the dismiss button when onDismiss is provided and fires it on click', async () => {
    const onDismiss = vi.fn();
    render(<AlertBanner tone="info" onDismiss={onDismiss} title="hello" />);
    const btn = screen.getByRole('button', { name: 'dismiss' });
    await userEvent.click(btn);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('does not render a dismiss button without onDismiss', () => {
    render(<AlertBanner tone="info" title="hello" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('honors a custom dismissLabel', () => {
    render(
      <AlertBanner tone="info" title="hello" onDismiss={() => {}} dismissLabel="seal the entry" />,
    );
    expect(screen.getByRole('button', { name: 'seal the entry' })).toBeInTheDocument();
  });
});
