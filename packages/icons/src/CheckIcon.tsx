import { forwardRef } from 'react';
import type { IconProps } from './types.js';

export const CheckIcon = forwardRef<SVGSVGElement, IconProps>(function CheckIcon(
  { size = 16, title, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
});
