import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import { kbd } from './Kbd.css.js';

type KbdVariants = NonNullable<RecipeVariants<typeof kbd>>;

/**
 * Keyboard shortcut hint. Renders the native `<kbd>` element with a
 * tinted, monospaced chip treatment. For multi-key combinations, render
 * each key as its own `<Kbd>` joined by space or `+`, or pass the joined
 * glyph string (`⌘K`) as a single chip — both compose with `Menu.Item`'s
 * `trailing` slot, `Tooltip` content, and a future palette.
 *
 * The element is announced as "keyboard input" by assistive tech via the
 * native `<kbd>` semantics. Pair with `aria-label` on the parent affordance
 * (button, menu item) when the shortcut alone wouldn't read clearly aloud.
 */
export interface KbdProps extends BaseComponentProps, KbdVariants {
  /** Key, glyph, or joined combination (`⌘K`, `⇧⌘P`). */
  children?: ReactNode;
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { size, children, id, 'data-testid': dataTestId },
  ref,
) {
  return (
    <kbd ref={ref} id={id} data-testid={dataTestId} className={kbd({ size })}>
      {children}
    </kbd>
  );
});
