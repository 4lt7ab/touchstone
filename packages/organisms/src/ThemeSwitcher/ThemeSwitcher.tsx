import { Button } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import type { AnchoredPositionAlign, AnchoredPositionSide } from '@touchstone/hooks';
import { CheckIcon, PaletteIcon } from '@touchstone/icons';
import { Menu } from '../Menu/Menu.js';

export interface ThemeSwitcherOption {
  /** Stable key used as the value passed to `onChange`. */
  key: string;
  /** Visible label rendered in the trigger and menu rows. */
  label: string;
}

export interface ThemeSwitcherProps extends BaseComponentProps {
  /** Theme catalogue. The selected option's `label` shows in the trigger. */
  options: readonly ThemeSwitcherOption[];
  /** Currently selected option key. */
  value: string;
  /** Called with the newly chosen option key. */
  onChange: (key: string) => void;
  /** Trigger label override. Defaults to the selected option's label, then 'Theme'. */
  label?: string;
  /** Side of the trigger to render the menu on. @default 'bottom' */
  side?: AnchoredPositionSide;
  /** Alignment along the trigger edge. @default 'end' */
  align?: AnchoredPositionAlign;
  /** Accessible label for the menu surface. @default 'Theme' */
  'aria-label'?: string;
}

/**
 * Drop-in palette picker. Composes `Menu` with a palette-iconed ghost
 * trigger and a check on the active row, so apps don't have to reinvent the
 * theme menu every time they wire up `vars`. Pair with the theme presets
 * exported from `@touchstone/themes`.
 */
export function ThemeSwitcher({
  options,
  value,
  onChange,
  label,
  side = 'bottom',
  align = 'end',
  'aria-label': ariaLabel = 'Theme',
  id,
  'data-testid': dataTestId,
}: ThemeSwitcherProps): React.JSX.Element {
  const selected = options.find((o) => o.key === value);
  const triggerLabel = label ?? selected?.label ?? 'Theme';
  return (
    <Menu>
      <Menu.Trigger>
        <Button intent="ghost" size="sm" id={id} data-testid={dataTestId}>
          <PaletteIcon />
          <span style={{ marginLeft: 8 }}>{triggerLabel}</span>
        </Button>
      </Menu.Trigger>
      <Menu.Content side={side} align={align} aria-label={ariaLabel}>
        {options.map((opt) => (
          <Menu.Item
            key={opt.key}
            trailing={opt.key === value ? <CheckIcon size={14} /> : undefined}
            onSelect={() => onChange(opt.key)}
          >
            {opt.label}
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu>
  );
}
