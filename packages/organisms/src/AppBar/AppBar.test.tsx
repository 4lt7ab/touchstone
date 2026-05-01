import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@touchstone/atoms';
import { AppBar } from './AppBar.js';

describe('AppBar', () => {
  it('renders a banner landmark', () => {
    render(<AppBar />);
    expect(
      screen.getByRole('banner', { name: 'application' }),
    ).toBeInTheDocument();
  });

  it('honors a custom aria-label', () => {
    render(<AppBar aria-label="touchstone" />);
    expect(screen.getByRole('banner', { name: 'touchstone' })).toBeInTheDocument();
  });

  it('renders brand, children, and actions slots', () => {
    render(
      <AppBar
        brand={<span>workshop</span>}
        actions={<Button intent="primary">strike</Button>}
      >
        <input aria-label="search" />
      </AppBar>,
    );
    expect(screen.getByText('workshop')).toBeInTheDocument();
    expect(screen.getByLabelText('search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'strike' })).toBeInTheDocument();
  });

  it('omits a slot wrapper when its prop is not provided', () => {
    const { container } = render(<AppBar brand={<span>workshop</span>} />);
    expect(container.querySelectorAll('header > div')).toHaveLength(1);
  });
});
