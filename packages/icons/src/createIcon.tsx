import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { IconProps } from './types.js';

export function createIcon(
  displayName: string,
  paths: ReactNode,
): React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>> {
  const Component = forwardRef<SVGSVGElement, IconProps>(function Icon(
    { size = 16, title, ...rest },
    ref,
  ) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        role={title ? 'img' : undefined}
        aria-hidden={title ? undefined : true}
        aria-label={title}
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        {paths}
      </svg>
    );
  });
  Component.displayName = displayName;
  return Component;
}
