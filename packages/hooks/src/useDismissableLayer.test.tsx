import { describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { useDismissableLayer } from './useDismissableLayer.js';

function Layer({
  testid,
  onDismiss,
  dismissible,
  active = true,
  withTrigger = false,
}: {
  testid: string;
  onDismiss: () => void;
  dismissible?: boolean;
  active?: boolean;
  withTrigger?: boolean;
}): React.JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useDismissableLayer(panelRef, {
    onDismiss,
    ...(withTrigger ? { triggerRef } : {}),
    ...(dismissible !== undefined ? { dismissible } : {}),
    active,
  });
  return (
    <>
      {withTrigger ? (
        <button data-testid={`${testid}-trigger`} ref={triggerRef}>
          trigger
        </button>
      ) : null}
      <div data-testid={testid} ref={panelRef}>
        <button data-testid={`${testid}-inside`}>inside</button>
      </div>
    </>
  );
}

describe('useDismissableLayer', () => {
  it('dismisses on outside mousedown', () => {
    const onDismiss = vi.fn();
    const { getByTestId } = render(
      <>
        <Layer testid="panel" onDismiss={onDismiss} />
        <button data-testid="outside">outside</button>
      </>,
    );
    fireEvent.mouseDown(getByTestId('outside'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss on mousedown inside the panel', () => {
    const onDismiss = vi.fn();
    const { getByTestId } = render(<Layer testid="panel" onDismiss={onDismiss} />);
    fireEvent.mouseDown(getByTestId('panel-inside'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not dismiss on mousedown inside the trigger', () => {
    const onDismiss = vi.fn();
    const { getByTestId } = render(
      <Layer testid="panel" onDismiss={onDismiss} withTrigger />,
    );
    fireEvent.mouseDown(getByTestId('panel-trigger'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismisses on Escape', () => {
    const onDismiss = vi.fn();
    render(<Layer testid="panel" onDismiss={onDismiss} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('only the topmost layer receives Escape', () => {
    const dismissA = vi.fn();
    const dismissB = vi.fn();
    render(
      <>
        <Layer testid="a" onDismiss={dismissA} />
        <Layer testid="b" onDismiss={dismissB} />
      </>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(dismissA).not.toHaveBeenCalled();
    expect(dismissB).toHaveBeenCalledTimes(1);
  });

  it('only the topmost layer receives outside mousedown', () => {
    const dismissA = vi.fn();
    const dismissB = vi.fn();
    const { getByTestId } = render(
      <>
        <Layer testid="a" onDismiss={dismissA} />
        <Layer testid="b" onDismiss={dismissB} />
        <button data-testid="outside">outside</button>
      </>,
    );
    fireEvent.mouseDown(getByTestId('outside'));
    expect(dismissA).not.toHaveBeenCalled();
    expect(dismissB).toHaveBeenCalledTimes(1);
  });

  it('a click inside a child layer protects the parent layer', () => {
    const dismissA = vi.fn();
    const dismissB = vi.fn();
    const { getByTestId } = render(
      <>
        <Layer testid="a" onDismiss={dismissA} />
        <Layer testid="b" onDismiss={dismissB} />
      </>,
    );
    fireEvent.mouseDown(getByTestId('b-inside'));
    expect(dismissA).not.toHaveBeenCalled();
    expect(dismissB).not.toHaveBeenCalled();
  });

  it('dismissible=false blocks dismissal of the top layer and of layers below', () => {
    const dismissA = vi.fn();
    const dismissB = vi.fn();
    const { getByTestId } = render(
      <>
        <Layer testid="a" onDismiss={dismissA} />
        <Layer testid="b" onDismiss={dismissB} dismissible={false} />
        <button data-testid="outside">outside</button>
      </>,
    );
    fireEvent.mouseDown(getByTestId('outside'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(dismissA).not.toHaveBeenCalled();
    expect(dismissB).not.toHaveBeenCalled();
  });

  it('does not register when active is false', () => {
    const onDismiss = vi.fn();
    const { getByTestId } = render(
      <>
        <Layer testid="panel" onDismiss={onDismiss} active={false} />
        <button data-testid="outside">outside</button>
      </>,
    );
    fireEvent.mouseDown(getByTestId('outside'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
