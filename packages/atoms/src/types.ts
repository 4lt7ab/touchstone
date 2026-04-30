/**
 * Minimal prop set every component accepts. Replaces `extends HTMLAttributes`
 * to prevent consumers from overriding styles or behavior via escape hatches.
 *
 * Aria props are NOT included here — components add the aria attributes that
 * make sense for what they actually are (interactive vs. structural vs.
 * decorative). The bar for adding a prop here is "every component in the
 * library reasonably needs it" — this set should grow rarely.
 */
export interface BaseComponentProps {
  /** DOM id, forwarded to the rendered element. */
  id?: string;
  /** Test selector, forwarded as `data-testid` on the rendered element. */
  'data-testid'?: string;
}
