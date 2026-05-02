import { forwardRef } from 'react';
import type { ReactNode, Ref } from 'react';
import type { BaseComponentProps } from '../types.js';
import * as styles from './Code.css.js';

/**
 * Monospace primitive for inline literals and fenced code blocks. Reads
 * `vars.font.family.mono`, `vars.color.bgMuted`, and `vars.color.border`
 * from the theme contract — every theme owns the code surface.
 *
 * Reading-only: no copy button, no syntax highlighting. For highlighted
 * blocks, hand the result of a downstream highlighter (`rehype-highlight`,
 * `shiki`, `prism`) to `<Code block>`; the `language` prop forwards as
 * `data-language` so the highlighter can target it.
 */
export interface CodeProps extends BaseComponentProps {
  /** Code content. */
  children?: ReactNode;
  /**
   * Render as a fenced block (`<pre><code>`) with padding, scroll-x, and a
   * tinted surround. Without this, `<Code>` renders inline.
   * @default false
   */
  block?: boolean;
  /**
   * Language label. In block mode, shown as a small uppercase pill in the
   * top-right corner. Always forwarded as `data-language` on the rendered
   * element.
   */
  language?: string;
}

export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { children, block = false, language, id, 'data-testid': dataTestId },
  ref,
) {
  if (block) {
    return (
      <pre
        ref={ref as Ref<HTMLPreElement>}
        id={id}
        data-testid={dataTestId}
        data-language={language}
        className={styles.pre}
      >
        {language ? (
          <span className={styles.language} aria-hidden="true">
            {language}
          </span>
        ) : null}
        <code className={styles.code({ block: true })}>{children}</code>
      </pre>
    );
  }
  return (
    <code
      ref={ref}
      id={id}
      data-testid={dataTestId}
      data-language={language}
      className={styles.code({ block: false })}
    >
      {children}
    </code>
  );
});
