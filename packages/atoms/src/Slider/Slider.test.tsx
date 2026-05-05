import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from './Slider.js';

describe('Slider — single thumb', () => {
  it('renders one slider thumb with min/max/now defaults', () => {
    render(<Slider aria-label="volume" />);
    const thumb = screen.getByRole('slider', { name: 'volume' });
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
  });

  it('honors defaultValue', () => {
    render(<Slider aria-label="volume" defaultValue={42} />);
    expect(screen.getByRole('slider', { name: 'volume' })).toHaveAttribute('aria-valuenow', '42');
  });

  it('arrow keys step by step', async () => {
    const onChange = vi.fn();
    render(<Slider aria-label="volume" defaultValue={50} step={5} onChange={onChange} />);
    const thumb = screen.getByRole('slider', { name: 'volume' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(55);
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith(50);
  });

  it('shift + arrow steps by 10x', async () => {
    const onChange = vi.fn();
    render(<Slider aria-label="volume" defaultValue={50} step={1} onChange={onChange} />);
    const thumb = screen.getByRole('slider', { name: 'volume' });
    thumb.focus();
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    expect(onChange).toHaveBeenLastCalledWith(60);
  });

  it('Home / End jump to min / max', async () => {
    const onChange = vi.fn();
    render(<Slider aria-label="volume" defaultValue={50} onChange={onChange} />);
    const thumb = screen.getByRole('slider', { name: 'volume' });
    thumb.focus();
    await userEvent.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith(100);
    await userEvent.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('clamps at min and max', async () => {
    const onChange = vi.fn();
    render(<Slider aria-label="volume" defaultValue={0} onChange={onChange} />);
    const thumb = screen.getByRole('slider', { name: 'volume' });
    thumb.focus();
    await userEvent.keyboard('{ArrowLeft}');
    // already at min — value stays at 0, no spurious onChange
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects controlled value (does not move on internal key when prop is fixed)', async () => {
    const onChange = vi.fn();
    render(<Slider aria-label="volume" value={20} onChange={onChange} />);
    const thumb = screen.getByRole('slider', { name: 'volume' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(21);
    expect(thumb).toHaveAttribute('aria-valuenow', '20');
  });

  it('does not move when disabled', async () => {
    const onChange = vi.fn();
    render(<Slider aria-label="volume" defaultValue={50} disabled onChange={onChange} />);
    const thumb = screen.getByRole('slider', { name: 'volume' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses formatValue for aria-valuetext', () => {
    render(
      <Slider
        aria-label="bitrate"
        defaultValue={64}
        formatValue={(v) => `${v} kbps`}
      />,
    );
    expect(screen.getByRole('slider', { name: 'bitrate' })).toHaveAttribute(
      'aria-valuetext',
      '64 kbps',
    );
  });

  it('renders a hidden input when name is provided', () => {
    const { container } = render(
      <Slider aria-label="volume" defaultValue={42} name="volume" />,
    );
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toHaveAttribute('name', 'volume');
    expect(hidden).toHaveAttribute('value', '42');
  });

  it('snaps to step', async () => {
    const onChange = vi.fn();
    render(<Slider aria-label="volume" defaultValue={50} step={10} onChange={onChange} />);
    const thumb = screen.getByRole('slider', { name: 'volume' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(60);
  });

  it('drives controlled value through onChange', async () => {
    function Host(): React.JSX.Element {
      const [value, setValue] = useState(0);
      return (
        <Slider aria-label="volume" value={value} onChange={(v) => setValue(v as number)} />
      );
    }
    render(<Host />);
    const thumb = screen.getByRole('slider', { name: 'volume' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '3');
  });
});

describe('Slider — range', () => {
  it('renders two thumbs with bounded valuemin/valuemax (no crossing)', () => {
    render(<Slider aria-label="band" range defaultValue={[20, 80]} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
    expect(sliders[0]).toHaveAttribute('aria-valuemin', '0');
    expect(sliders[0]).toHaveAttribute('aria-valuemax', '80');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
    expect(sliders[1]).toHaveAttribute('aria-valuemin', '20');
    expect(sliders[1]).toHaveAttribute('aria-valuemax', '100');
  });

  it('start thumb cannot move past end thumb', async () => {
    const onChange = vi.fn();
    render(
      <Slider aria-label="band" range defaultValue={[40, 50]} onChange={onChange} step={5} />,
    );
    const [start] = screen.getAllByRole('slider');
    start!.focus();
    // try to push start past end (50)
    await userEvent.keyboard('{ArrowRight}'); // 45
    expect(onChange).toHaveBeenLastCalledWith([45, 50]);
    await userEvent.keyboard('{ArrowRight}'); // would go to 50; clamps at end
    expect(onChange).toHaveBeenLastCalledWith([50, 50]);
    onChange.mockClear();
    await userEvent.keyboard('{ArrowRight}'); // already at end; no change
    expect(onChange).not.toHaveBeenCalled();
  });

  it('end thumb cannot move below start thumb', async () => {
    const onChange = vi.fn();
    render(
      <Slider aria-label="band" range defaultValue={[40, 50]} onChange={onChange} step={5} />,
    );
    const [, end] = screen.getAllByRole('slider');
    end!.focus();
    await userEvent.keyboard('{ArrowLeft}'); // 45
    expect(onChange).toHaveBeenLastCalledWith([40, 45]);
    await userEvent.keyboard('{ArrowLeft}'); // clamps at start (40)
    expect(onChange).toHaveBeenLastCalledWith([40, 40]);
  });

  it('labels each thumb (start / end) when ranged with a base aria-label', () => {
    render(<Slider aria-label="band" range defaultValue={[20, 80]} />);
    expect(screen.getByRole('slider', { name: 'band start' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'band end' })).toBeInTheDocument();
  });

  it('renders two hidden inputs with name.start / name.end when name is provided', () => {
    const { container } = render(
      <Slider aria-label="band" range defaultValue={[20, 80]} name="band" />,
    );
    const inputs = container.querySelectorAll('input[type="hidden"]');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveAttribute('name', 'band.start');
    expect(inputs[1]).toHaveAttribute('name', 'band.end');
  });
});

// Pointer drag is verified visually in Storybook — jsdom's React synthetic
// pointer events don't reliably propagate `clientX`, and the bounding-rect
// math is straightforward (linear ratio along the track's width). Keyboard
// interaction is what a11y users hit and is covered exhaustively above.
