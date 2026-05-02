import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import { avatar } from './Avatar.css.js';

type AvatarVariants = NonNullable<RecipeVariants<typeof avatar>>;

/**
 * A small, fixed-size mark for a person, workspace, or brand. Renders a
 * monogram, an icon, or any child glyph inside a sized surface — choose
 * `shape: 'round'` for people, `'square'` for brands and workspaces.
 *
 * Aria defaults to hidden because most avatars sit next to a visible label.
 * Pass `aria-label` (or `aria-labelledby`) when the avatar needs to stand
 * on its own — an icon-only profile button, a bare row in a list.
 */
export interface AvatarProps extends BaseComponentProps, AvatarVariants {
  /** Initials shown when no children are supplied. Truncated to 3 characters. */
  monogram?: string;
  /** Icon or glyph for the mark; takes precedence over `monogram`. */
  children?: ReactNode;
  /** Accessible label when the avatar carries meaning on its own. */
  'aria-label'?: string;
  /** Or labelledby — id of an external label element. */
  'aria-labelledby'?: string;
  /** Hide from the a11y tree (overrides the labelled defaults). */
  'aria-hidden'?: boolean | 'true' | 'false';
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    size,
    shape,
    tone,
    monogram,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-hidden': ariaHidden,
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const labelled = Boolean(ariaLabel || ariaLabelledBy);
  const hidden = ariaHidden ?? !labelled;
  const content = children ?? (monogram ? monogram.slice(0, 3) : null);
  return (
    <span
      ref={ref}
      id={id}
      data-testid={dataTestId}
      role={labelled ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-hidden={hidden ? true : undefined}
      className={avatar({ size, shape, tone })}
    >
      {content}
    </span>
  );
});
