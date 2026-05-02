import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { Button, type BaseComponentProps } from '@touchstone/atoms';
import * as styles from './AlertBanner.css.js';

type RootVariants = NonNullable<RecipeVariants<typeof styles.root>>;

/**
 * Inline status panel for in-page messaging. The four `tone` values map to
 * the feedback foreground/background pairs in the theme contract — the
 * canonical alert pattern. For short tag-shaped status, use `Badge`; for
 * stacked toast-style notifications, use the (forthcoming) `Toast`.
 *
 * Pass `onDismiss` to render the close affordance. Without it, the alert
 * is permanent (e.g. a form-level validation summary that stays until the
 * field is corrected).
 */
export interface AlertBannerProps extends BaseComponentProps, RootVariants {
  /** Optional bold title rendered above the body. */
  title?: ReactNode;
  /** Body content. */
  children?: ReactNode;
  /** Render a dismiss button when present. The handler must hide the alert in your own state. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. @default 'dismiss' */
  dismissLabel?: string;
  /**
   * ARIA role override. `danger` and `warning` default to `alert` (live);
   * `success` and `info` default to `status` (polite). Override for
   * non-typical use cases.
   */
  role?: 'alert' | 'status' | 'note';
}

function DismissGlyph(): React.JSX.Element {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

export const AlertBanner = forwardRef<HTMLDivElement, AlertBannerProps>(function AlertBanner(
  {
    tone = 'info',
    title,
    children,
    onDismiss,
    dismissLabel = 'dismiss',
    role,
    id,
    'data-testid': dataTestId,
  },
  ref,
): React.JSX.Element {
  const resolvedRole = role ?? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status');
  return (
    <div
      ref={ref}
      role={resolvedRole}
      id={id}
      data-testid={dataTestId}
      className={styles.root({ tone })}
    >
      <div className={styles.body}>
        {title ? <span className={styles.title}>{title}</span> : null}
        {children ? <span>{children}</span> : null}
      </div>
      {onDismiss ? (
        <Button
          intent="ghost"
          shape="square"
          size="sm"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <DismissGlyph />
        </Button>
      ) : null}
    </div>
  );
});
