import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './Prose.css.js';

export type ProseDensity = 'comfortable' | 'compact';
export type ProseWidth = 'reading' | 'full';

/**
 * Long-form content container. Wrap any tree of bare HTML — markdown
 * output, hand-authored documentation JSX, an `aboutThisRelease` blob —
 * and the descendants pick up consistent vertical rhythm and theme-bound
 * visual values for headings, paragraphs, lists, blockquotes, links, and
 * horizontal rules.
 *
 * Implementation uses descendant `globalStyle` selectors keyed off the
 * Prose root class — a deliberate exception to the "no descendant styling"
 * grain, justified because the children are not Touchstone primitives.
 *
 * Pair with `Markdown` (which renders inside Prose by default) or wrap
 * hand-authored content directly. Inline `Code` and the `Table` family
 * already carry their own visuals; Prose only adjusts margins around them.
 */
export interface ProseProps extends BaseComponentProps {
  /** Long-form content. */
  children?: ReactNode;
  /** Vertical rhythm. `comfortable` is the long-read default. @default 'comfortable' */
  density?: ProseDensity;
  /**
   * Line-length clamp. `reading` keeps paragraphs to ~65ch so the eye
   * doesn't lose its place; `full` lets the container fill its parent.
   * @default 'reading'
   */
  width?: ProseWidth;
}

export const Prose = forwardRef<HTMLDivElement, ProseProps>(function Prose(
  { children, density = 'comfortable', width = 'reading', id, 'data-testid': dataTestId },
  ref,
) {
  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      data-density={density}
      data-width={width}
      className={styles.root}
    >
      {children}
    </div>
  );
});
