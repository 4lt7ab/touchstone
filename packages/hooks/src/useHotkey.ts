import { useEffect, useRef } from 'react';

export interface UseHotkeyOptions {
  /** When false, the hotkey is not bound. @default true */
  enabled?: boolean;
  /** Call `preventDefault()` on the matching keydown event. @default true */
  preventDefault?: boolean;
  /**
   * Ignore the keystroke when focus is inside an `<input>`, `<textarea>`,
   * `<select>`, or `[contenteditable]`. Modifier-keyed combos (`mod+…`,
   * `ctrl+…`, `alt+…`) usually want to fire everywhere; plain-key shortcuts
   * (e.g. `'?'`) usually don't. @default false
   */
  ignoreWhenTyping?: boolean;
}

interface ParsedCombo {
  key: string;
  mod: boolean;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

const isMac = (): boolean =>
  typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.platform);

function parseCombo(combo: string): ParsedCombo {
  const parts = combo.toLowerCase().split('+').map((p) => p.trim());
  const last = parts[parts.length - 1];
  if (last === undefined || last === '') {
    throw new Error(`useHotkey: empty key in combo "${combo}"`);
  }
  const mods = new Set(parts.slice(0, -1));
  return {
    key: last,
    mod: mods.has('mod') || mods.has('cmd') || mods.has('meta'),
    ctrl: mods.has('ctrl') || mods.has('control'),
    shift: mods.has('shift'),
    alt: mods.has('alt') || mods.has('option') || mods.has('opt'),
  };
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

function matches(event: KeyboardEvent, combo: ParsedCombo): boolean {
  if (event.key.toLowerCase() !== combo.key) return false;
  const wantMeta = combo.mod && isMac();
  const wantCtrl = combo.ctrl || (combo.mod && !isMac());
  if (event.metaKey !== wantMeta) return false;
  if (event.ctrlKey !== wantCtrl) return false;
  if (event.shiftKey !== combo.shift) return false;
  if (event.altKey !== combo.alt) return false;
  return true;
}

/**
 * Bind a global keyboard shortcut. Combos are written as plus-joined tokens:
 * `mod+b`, `mod+shift+k`, `ctrl+/`, `?`. The `mod` token resolves to the
 * platform meta key (Cmd on macOS, Ctrl elsewhere); `cmd` and `meta` are
 * aliases that always mean the meta key. Modifier matching is exact — a
 * `mod+b` binding will not fire on `mod+shift+b`.
 *
 * The handler receives the underlying `KeyboardEvent`. By default the event
 * is `preventDefault`'d so a browser shortcut (Cmd+B = bold, Cmd+K = address
 * bar in some browsers) does not run alongside the app behaviour.
 *
 * Hotkeys are document-level keydown listeners and are not coordinated with
 * `useDismissableLayer`. If a hotkey should not fire while a modal is open,
 * gate it with `enabled` from the caller.
 */
export function useHotkey(
  combo: string,
  handler: (event: KeyboardEvent) => void,
  options: UseHotkeyOptions = {},
): void {
  const { enabled = true, preventDefault = true, ignoreWhenTyping = false } = options;

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const parsed = parseCombo(combo);
    function onKeyDown(event: KeyboardEvent): void {
      if (!matches(event, parsed)) return;
      if (ignoreWhenTyping && isTypingTarget(event.target)) return;
      if (preventDefault) event.preventDefault();
      handlerRef.current(event);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [combo, enabled, preventDefault, ignoreWhenTyping]);
}
