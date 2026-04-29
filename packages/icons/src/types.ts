import type { SVGAttributes } from 'react';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /**
   * Pixel size for both width and height. Maps to the `size` attribute of the SVG.
   * @default 16
   */
  size?: number | string;
  /**
   * Accessible label. If omitted the icon is hidden from assistive tech (`aria-hidden`).
   */
  title?: string;
}
