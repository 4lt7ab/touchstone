import { describe, expect, it, beforeEach } from 'vitest';
import { useEffect, useRef, useState } from 'react';
import { render, act } from '@testing-library/react';
import {
  useAnchoredPosition,
  type AnchoredPositionAlign,
  type AnchoredPositionSide,
} from './useAnchoredPosition.js';

interface ProbeProps {
  side?: AnchoredPositionSide;
  align?: AnchoredPositionAlign;
  offset?: number;
  anchorRect: DOMRect;
  floatingRect: DOMRect;
  onResolved: (style: { top: number; left: number }, side: AnchoredPositionSide) => void;
}

function Probe({
  side,
  align,
  offset,
  anchorRect,
  floatingRect,
  onResolved,
}: ProbeProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const result = useAnchoredPosition(anchorRef, floatingRef, {
    ...(side ? { side } : {}),
    ...(align ? { align } : {}),
    ...(offset !== undefined ? { offset } : {}),
  });

  const setAnchor = (node: HTMLDivElement | null): void => {
    anchorRef.current = node;
    if (node) node.getBoundingClientRect = () => anchorRect;
  };
  const setFloating = (node: HTMLDivElement | null): void => {
    floatingRef.current = node;
    if (node) node.getBoundingClientRect = () => floatingRect;
  };

  useEffect(() => {
    onResolved(
      { top: result.style.top, left: result.style.left },
      result.side,
    );
  }, [onResolved, result.style.top, result.style.left, result.side]);

  return (
    <>
      <div ref={setAnchor} />
      <div ref={setFloating} />
    </>
  );
}

function rect(top: number, left: number, width: number, height: number): DOMRect {
  return {
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

describe('useAnchoredPosition', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 768 });
  });

  function renderProbe(props: Omit<ProbeProps, 'onResolved'>): {
    style: { top: number; left: number };
    side: AnchoredPositionSide;
  } {
    let captured = { top: -9999, left: -9999 };
    let capturedSide: AnchoredPositionSide = 'bottom';
    act(() => {
      render(
        <Probe
          {...props}
          onResolved={(s, side) => {
            captured = s;
            capturedSide = side;
          }}
        />,
      );
    });
    return { style: captured, side: capturedSide };
  }

  it('places the floating element below the anchor with start alignment by default', () => {
    const { style, side } = renderProbe({
      anchorRect: rect(100, 200, 80, 40),
      floatingRect: rect(0, 0, 160, 120),
    });
    expect(side).toBe('bottom');
    expect(style).toEqual({ top: 100 + 40 + 8, left: 200 });
  });

  it('aligns to center', () => {
    const { style } = renderProbe({
      align: 'center',
      anchorRect: rect(100, 200, 80, 40),
      floatingRect: rect(0, 0, 160, 120),
    });
    expect(style).toEqual({ top: 148, left: 200 + 40 - 80 });
  });

  it('flips to top when bottom would clip the viewport', () => {
    const { style, side } = renderProbe({
      side: 'bottom',
      anchorRect: rect(700, 200, 80, 40),
      floatingRect: rect(0, 0, 160, 200),
    });
    expect(side).toBe('top');
    expect(style).toEqual({ top: 700 - 200 - 8, left: 200 });
  });

  it('honors right side with start alignment', () => {
    const { style, side } = renderProbe({
      side: 'right',
      anchorRect: rect(100, 200, 80, 40),
      floatingRect: rect(0, 0, 160, 120),
    });
    expect(side).toBe('right');
    expect(style).toEqual({ top: 100, left: 200 + 80 + 8 });
  });
});

// ensure react import is not pruned for jsx
void useState;
