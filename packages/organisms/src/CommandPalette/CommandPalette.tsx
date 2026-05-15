import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { KeyboardEvent, ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import { useDisclosure, useMergedRefs, useModalSurface } from '@touchstone/hooks';
import type { BaseComponentProps } from '@touchstone/atoms';
import { Kbd } from '@touchstone/atoms';
import { CommandItem } from '@touchstone/molecules';
import { SearchIcon } from '@touchstone/icons';
import { useAppShellSlot } from '../AppShell/appShellSlot.js';
import * as styles from './CommandPalette.css.js';

/**
 * One row in a `CommandPalette`. Authored as data so the palette can do its
 * own filtering, grouping, and keyboard cursor management. Pair with the
 * `CommandPalette` envelope; the row visual is `CommandItem` from
 * `@touchstone/molecules` if you need to compose your own list elsewhere.
 */
export interface CommandPaletteCommand {
  /** Stable unique id — used as the React key and for `aria-activedescendant`. */
  id: string;
  /** Primary, searchable label. */
  label: string;
  /** Optional secondary line shown below the label. */
  description?: ReactNode;
  /** Leading icon. */
  icon?: ReactNode;
  /** Trailing shortcut hint — typically a `Kbd`. */
  shortcut?: ReactNode;
  /** Group heading. Commands without a group fall into the implicit top section. */
  group?: string;
  /** Extra search tokens beyond `label` (synonyms, aliases, abbreviations). */
  keywords?: string[];
  /** Visual emphasis. `danger` for destructive actions. @default 'default' */
  tone?: 'default' | 'danger';
  /** Disable the row — visible but unselectable. */
  disabled?: boolean;
  /** Activation handler. The palette closes after this returns. */
  onSelect: () => void;
}

export interface CommandPaletteProps extends BaseComponentProps {
  /**
   * Controlled open state. Omit when rendered inside an `AppShell`
   * command-palette slot — the shell drives the state via context.
   */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called when the palette wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** All available commands. The palette filters them on the input query. */
  commands: CommandPaletteCommand[];
  /** Input placeholder. @default 'Type a command or search…' */
  placeholder?: string;
  /** Message shown when filtering returns nothing. */
  emptyMessage?: ReactNode;
  /**
   * Custom matcher for the search query. Returns true when the command
   * should be visible. Default is case-insensitive substring on `label`,
   * `description` (string only), `keywords`, and `group`.
   */
  filter?: (command: CommandPaletteCommand, query: string) => boolean;
  /**
   * Hide the keyboard hint footer (`↑↓ to navigate · ↵ to run · esc to
   * close`). The hints are on by default — switch off when embedded in a
   * dense layout that already explains itself.
   * @default true
   */
  showFooter?: boolean;
  /** Accessible label for the palette dialog. @default 'Command palette' */
  'aria-label'?: string;
}

/**
 * Searchable command launcher. A modal `Dialog`-style overlay (focus trap,
 * scroll lock, Escape, click-outside) hosting a filter input and a list of
 * `CommandItem`s, grouped by optional headings. The keyboard cursor moves
 * through visible items via Up/Down/Home/End; Enter activates; Escape
 * closes; pointer hover follows the cursor.
 *
 * Toggle with the consumer's own hotkey — typically `useHotkey('mod+k', ...)`.
 * The palette doesn't bind a global shortcut so consumers can pick the combo
 * that fits their app.
 *
 * When rendered inside an `AppShell` command-palette slot the palette
 * auto-wires to the shell's open/onOpenChange pair — no need to pass them
 * explicitly. Explicit `open` / `onOpenChange` props always win over the
 * slot context.
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  function CommandPalette(props, ref) {
    const slot = useAppShellSlot();
    const effectiveOpen = props.open ?? slot?.open;
    const effectiveOnChange = props.onOpenChange ?? slot?.onOpenChange;
    const { open, onClose } = useDisclosure({
      ...(effectiveOpen !== undefined ? { open: effectiveOpen } : {}),
      ...(props.defaultOpen !== undefined ? { defaultOpen: props.defaultOpen } : {}),
      ...(effectiveOnChange ? { onOpenChange: effectiveOnChange } : {}),
    });
    if (!open) return null;
    if (typeof document === 'undefined') return null;
    const handleOpenChange = (next: boolean): void => {
      if (next) return;
      onClose();
    };
    return (
      <CommandPalettePanel
        {...props}
        open
        onOpenChange={handleOpenChange}
        forwardedRef={ref}
      />
    );
  },
);

interface PanelProps extends Omit<CommandPaletteProps, 'open' | 'onOpenChange'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forwardedRef: Ref<HTMLDivElement>;
}

function CommandPalettePanel({
  open,
  onOpenChange,
  commands,
  placeholder = 'Type a command or search…',
  emptyMessage = 'No matches',
  filter = defaultFilter,
  showFooter = true,
  id,
  'data-testid': dataTestId,
  'aria-label': ariaLabel = 'Command palette',
  forwardedRef,
}: PanelProps): React.ReactPortal {
  const reactId = useId();
  const baseId = id ?? reactId;
  const inputId = `${baseId}-input`;
  const listboxId = `${baseId}-listbox`;

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs<HTMLDivElement>(panelRef, forwardedRef);

  useModalSurface(panelRef, {
    onDismiss: () => onOpenChange(false),
  });

  const visible = useMemo(() => {
    if (query === '') return commands;
    return commands.filter((c) => filter(c, query));
  }, [commands, query, filter]);

  // Reset query + cursor when the palette opens, keep cursor in range when filtering.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Defer focus until after `useModalSurface` settles its focus trap.
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    return;
  }, [open]);

  useEffect(() => {
    if (visible.length === 0) {
      if (activeIndex !== 0) setActiveIndex(0);
      return;
    }
    if (activeIndex >= visible.length) {
      setActiveIndex(visible.length - 1);
    }
  }, [visible, activeIndex]);

  const moveCursor = useCallback(
    (delta: 1 | -1) => {
      setActiveIndex((idx) => {
        if (visible.length === 0) return 0;
        let next = idx + delta;
        if (next < 0) next = visible.length - 1;
        if (next >= visible.length) next = 0;
        return next;
      });
    },
    [visible.length],
  );

  const runActive = useCallback(() => {
    const cmd = visible[activeIndex];
    if (!cmd || cmd.disabled) return;
    cmd.onSelect();
    onOpenChange(false);
  }, [visible, activeIndex, onOpenChange]);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveCursor(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveCursor(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(Math.max(0, visible.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runActive();
    }
  };

  const grouped = useMemo(() => groupCommands(visible), [visible]);
  const activeId = visible[activeIndex] ? optionId(baseId, visible[activeIndex]!.id) : undefined;

  return createPortal(
    <div className={styles.backdrop}>
      <div
        ref={mergedRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        id={baseId}
        data-testid={dataTestId}
        tabIndex={-1}
        className={styles.panel}
      >
        <div className={styles.inputRow}>
          <span className={styles.inputIcon} aria-hidden="true">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            aria-expanded
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            className={styles.input}
          />
        </div>
        <div role="listbox" id={listboxId} aria-label={ariaLabel} className={styles.list}>
          {visible.length === 0 ? <div className={styles.empty}>{emptyMessage}</div> : null}
          {grouped.map((group, gi) => (
            <div key={group.heading ?? `__ungrouped-${gi}`}>
              {group.heading ? (
                <div role="presentation" className={styles.groupHeading}>
                  {group.heading}
                </div>
              ) : null}
              {group.commands.map((cmd) => {
                const idx = visible.indexOf(cmd);
                const highlighted = idx === activeIndex;
                return (
                  <CommandItem
                    key={cmd.id}
                    id={optionId(baseId, cmd.id)}
                    icon={cmd.icon}
                    description={cmd.description}
                    shortcut={cmd.shortcut}
                    {...(cmd.tone ? { tone: cmd.tone } : {})}
                    {...(cmd.disabled ? { disabled: true } : {})}
                    highlighted={highlighted}
                    onSelect={() => {
                      if (cmd.disabled) return;
                      cmd.onSelect();
                      onOpenChange(false);
                    }}
                    onPointerEnter={() => setActiveIndex(idx)}
                  >
                    {cmd.label}
                  </CommandItem>
                );
              })}
            </div>
          ))}
        </div>
        {showFooter ? (
          <div className={styles.footer}>
            <span className={styles.footerHints}>
              <span className={styles.footerHint}>
                <Kbd size="sm">↑</Kbd>
                <Kbd size="sm">↓</Kbd> navigate
              </span>
              <span className={styles.footerHint}>
                <Kbd size="sm">↵</Kbd> run
              </span>
              <span className={styles.footerHint}>
                <Kbd size="sm">esc</Kbd> close
              </span>
            </span>
            <span>
              {visible.length} {visible.length === 1 ? 'result' : 'results'}
            </span>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

function defaultFilter(command: CommandPaletteCommand, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === '') return true;
  if (command.label.toLowerCase().includes(q)) return true;
  if (command.group && command.group.toLowerCase().includes(q)) return true;
  if (command.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
  if (typeof command.description === 'string' && command.description.toLowerCase().includes(q)) {
    return true;
  }
  return false;
}

interface CommandGroup {
  heading: string | null;
  commands: CommandPaletteCommand[];
}

function groupCommands(commands: CommandPaletteCommand[]): CommandGroup[] {
  const groups: CommandGroup[] = [];
  const indexByHeading = new Map<string | null, number>();
  for (const cmd of commands) {
    const heading = cmd.group ?? null;
    let idx = indexByHeading.get(heading);
    if (idx === undefined) {
      idx = groups.length;
      indexByHeading.set(heading, idx);
      groups.push({ heading, commands: [] });
    }
    groups[idx]!.commands.push(cmd);
  }
  return groups;
}

function optionId(baseId: string, commandId: string): string {
  return `${baseId}-cmd-${commandId}`;
}
