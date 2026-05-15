import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@touchstone/atoms';
import { Dock } from './Dock.js';

describe('Dock', () => {
  it('renders nothing when closed', () => {
    render(
      <Dock>
        <Dock.Content title="Logs">
          <p>body</p>
        </Dock.Content>
      </Dock>,
    );
    expect(screen.queryByRole('region', { name: 'Logs' })).not.toBeInTheDocument();
  });

  it('opens via Dock.Trigger and renders the region with the title', async () => {
    render(
      <Dock>
        <Dock.Trigger>
          <Button>open</Button>
        </Dock.Trigger>
        <Dock.Content title="Logs">
          <p>body</p>
        </Dock.Content>
      </Dock>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    const region = screen.getByRole('region', { name: 'Logs' });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent('body');
  });

  it('honors defaultOpen and dismisses via the built-in close button', async () => {
    render(
      <Dock defaultOpen>
        <Dock.Content title="Logs">
          <p>body</p>
        </Dock.Content>
      </Dock>,
    );
    expect(screen.getByRole('region', { name: 'Logs' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(screen.queryByRole('region', { name: 'Logs' })).not.toBeInTheDocument();
  });

  it('omits the built-in close button when dismissible={false}', () => {
    render(
      <Dock defaultOpen>
        <Dock.Content title="Logs" dismissible={false}>
          <p>body</p>
        </Dock.Content>
      </Dock>,
    );
    expect(screen.queryByRole('button', { name: 'close' })).not.toBeInTheDocument();
  });

  it('mirrors controlled open and forwards onOpenChange', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Dock open={false} onOpenChange={onChange}>
        <Dock.Trigger>
          <Button>open</Button>
        </Dock.Trigger>
        <Dock.Content title="Logs">
          <p>body</p>
        </Dock.Content>
      </Dock>,
    );
    expect(screen.queryByRole('region', { name: 'Logs' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'open' }));
    expect(onChange).toHaveBeenCalledWith(true);
    // Controlled — value doesn't change until parent rerenders.
    expect(screen.queryByRole('region', { name: 'Logs' })).not.toBeInTheDocument();

    rerender(
      <Dock open onOpenChange={onChange}>
        <Dock.Trigger>
          <Button>open</Button>
        </Dock.Trigger>
        <Dock.Content title="Logs">
          <p>body</p>
        </Dock.Content>
      </Dock>,
    );
    expect(screen.getByRole('region', { name: 'Logs' })).toBeInTheDocument();
  });

  it('renders consumer-supplied header actions next to the dismiss button', () => {
    render(
      <Dock defaultOpen>
        <Dock.Content title="Logs" actions={<button type="button">pin</button>}>
          <p>body</p>
        </Dock.Content>
      </Dock>,
    );
    expect(screen.getByRole('button', { name: 'pin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();
  });

  describe('chrome="bare"', () => {
    it('omits the visible title row and the dismiss button', () => {
      render(
        <Dock defaultOpen>
          <Dock.Content title="Ask the workshop" chrome="bare">
            <p>composer</p>
          </Dock.Content>
        </Dock>,
      );
      expect(
        screen.queryByRole('heading', { name: 'Ask the workshop' }),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'close' })).not.toBeInTheDocument();
    });

    it('forwards the title to aria-label so the region is still named', () => {
      render(
        <Dock defaultOpen>
          <Dock.Content title="Ask the workshop" chrome="bare">
            <p>composer</p>
          </Dock.Content>
        </Dock>,
      );
      expect(screen.getByRole('region', { name: 'Ask the workshop' })).toBeInTheDocument();
    });
  });

  describe('width="reading"', () => {
    it('applies the reading-width recipe variant to the panel', () => {
      render(
        <Dock defaultOpen>
          <Dock.Content title="Ask" width="reading" chrome="bare">
            <p>composer</p>
          </Dock.Content>
        </Dock>,
      );
      const region = screen.getByRole('region', { name: 'Ask' });
      expect(region.className).toMatch(/panel_width_reading/);
    });
  });
});
